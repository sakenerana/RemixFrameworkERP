import { Asset } from "~/types/asset.type"
import { CustomAsset } from "~/types/custom_asset.type"
import supabase from "~/utils/supabase.client"

export const AssetService = {

  // Create
  async createPost(postData: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createReport(postData: any) {
    const { data, error } = await supabase
      .from('activity_report')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createPostAssetsCheck(postData: Asset) {
    const { data, error } = await supabase
      .from('assets_check')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('assets')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        asset_model(*), 
        locations(*),
        assets_check:assets_check!assets_id(
        count
      )
        `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsLimit(departmentID: number) {
    const { data, error } = await supabase
      .from('assets')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        asset_model(*), 
        locations(*),
        assets_check:assets_check!assets_id(
        count
      )
        `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })
      .limit(5) // Add this line to limit to 500 records

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllAssetTagByID(departmentID: number, assets_id: number) {
    const { data, error } = await supabase
      .from('assets')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        asset_model(
        *,
        manufacturers:manufacturers(*),
        categories:categories(*),
        depreciations:depreciations(*)
      ),
        assets_check:assets_check!assets_id(
        *
      )
        `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('id', assets_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('assets')
      .select('*, status_labels(*), departments(*), asset_model(*), locations(*)')
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsReport(postData: CustomAsset) {
    const { data, error } = await supabase
      .from('assets')
      .select(`
    id,
    created_at,
    status_id,
    notes,
    name,
    order_no,
    purchase_date,
    purchase_cost,
    qty,
    min_qty,
    status_labels(*),
    users(*),
    departments(*),
    asset_model(*),
    locations(*)
  `)
      .eq('status_id', postData.status_id)
      .eq('department_id', postData.department_id)
      .eq('location_id', postData.location_id)
      .eq('asset_model_id', postData.asset_model_id)
      .eq('asset_model.supplier_id', postData.supplier_id)
      .eq('asset_model.manufacturer_id', postData.manufacturer_id)
      .eq('asset_model.category_id', postData.category_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Flatten the data for Excel
    const excelData = data.map((asset: any) => ({
      asset_id: asset.id,
      created_at: asset.created_at,
      asset_name: asset.name,
      order_no: asset.order_no,
      purchase_date: asset.purchase_date,
      purchase_cost: asset.purchase_cost,
      qty: asset.qty,
      min_qty: asset.min_qty,
      asset_notes: asset.notes,
      asset_status: asset.status_labels?.name,

      // // User data
      user_id: asset.users.id,
      user_fname: asset.users.first_name,
      user_mname: asset.users.middle_name,
      user_lname: asset.users.last_name,
      user_email: asset.users.email,

      // // Department data (flattened)
      department_id: asset.departments.id,
      department_name: asset.departments.department,

      // // Asset model data
      model_id: asset.asset_model.id,
      model_name: asset.asset_model?.name,

      // // Location data
      location_id: asset.locations.id,
      location_name: asset.locations?.name,

      // // Supplier data
      supplier_id: asset.asset_model.supplier_id,

      // // Manufacturer data
      manufacturer_id: asset.asset_model.manufacturer_id,

      // // Category data
      category_id: asset.asset_model.category_id,
    }));

    return excelData
  },

  // async getAllPostsReport(postData: CustomAsset) {
  //   // Build the base query
  //   let query = supabase
  //     .from('assets')
  //     .select(`
  //   id,
  //   created_at,
  //   status_id,
  //   notes,
  //   name,
  //   order_no,
  //   purchase_date,
  //   purchase_cost,
  //   qty,
  //   min_qty,
  //   status_labels(*),
  //   users(*),
  //   departments(*),
  //   asset_model(*),
  //   locations(*)
  // `)
  //     .order('created_at', { ascending: false });

  //   // Add conditional filters only if values exist
  //   if (postData.status_id != null) query = query.eq('status_id', postData.status_id);
  //   if (postData.department_id != null) query = query.eq('department_id', postData.department_id);
  //   if (postData.location_id != null) query = query.eq('location_id', postData.location_id);
  //   if (postData.asset_model_id != null) query = query.eq('asset_model_id', postData.asset_model_id);
  //   if (postData.supplier_id != null) query = query.eq('asset_model.supplier_id', postData.supplier_id);
  //   if (postData.manufacturer_id != null) query = query.eq('asset_model.manufacturer_id', postData.manufacturer_id);
  //   if (postData.category_id != null) query = query.eq('asset_model.category_id', postData.category_id);

  //   const { data, error } = await query;

  //   if (error) throw error;

  //   // Flatten the data for Excel
  //   const excelData = data.map((asset: any) => ({
  //     asset_id: asset.id,
  //     created_at: asset.created_at,
  //     asset_name: asset.name,
  //     order_no: asset.order_no,
  //     purchase_date: asset.purchase_date,
  //     purchase_cost: asset.purchase_cost,
  //     qty: asset.qty,
  //     min_qty: asset.min_qty,
  //     asset_notes: asset.notes,
  //     asset_status: asset.status_labels?.name,

  //     // // User data
  //     user_id: asset.users.id,
  //     user_fname: asset.users?.first_name,
  //     user_mname: asset.users?.middle_name,
  //     user_lname: asset.users?.last_name,
  //     user_email: asset.users?.email,

  //     // // Department data (flattened)
  //     department_id: asset.departments?.id,
  //     department_name: asset.departments?.department,

  //     // // Asset model data
  //     model_id: asset.asset_model?.id,
  //     model_name: asset.asset_model?.name,

  //     // // Location data
  //     location_id: asset.locations?.id,
  //     location_name: asset.locations?.name,

  //     // // Supplier data
  //     supplier_id: asset.asset_model?.supplier_id,

  //     // // Manufacturer data
  //     manufacturer_id: asset.asset_model?.manufacturer_id,

  //     // // Category data
  //     category_id: asset.asset_model?.category_id,
  //   }));

  //   // Filter out null/undefined values from the returned data
  //   // const filteredData = data?.map(asset => {
  //   //   const filteredAsset: Record<string, any> = {};
  //   //   Object.entries(asset).forEach(([key, value]) => {
  //   //     if (value != null) {
  //   //       filteredAsset[key] = value;
  //   //     }
  //   //   });
  //   //   return filteredAsset;
  //   // });

  //   return excelData;
  // },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('assets') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deleteAssetsCheck(id: number) {
    const { error } = await supabase
      .from('assets_check')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByUser(userId: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}