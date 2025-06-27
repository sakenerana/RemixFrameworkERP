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

  async getAllPostsReport(postData: CustomAsset) {
    // Build the base query
    let query = supabase
      .from('assets')
      .select(`
    id, 
    created_at,
    status_id,
    users(*),
    departments(*),
    asset_model(*),
    locations(*)
  `)
      .order('created_at', { ascending: false });

    // Add conditional filters only if values exist
    if (postData.status_id != null) query = query.eq('status_id', postData.status_id);
    if (postData.department_id != null) query = query.eq('department_id', postData.department_id);
    if (postData.location_id != null) query = query.eq('location_id', postData.location_id);
    if (postData.asset_model_id != null) query = query.eq('asset_model_id', postData.asset_model_id);

    const { data, error } = await query;

    if (error) throw error;

    // Filter out null/undefined values from the returned data
    const filteredData = data?.map(asset => {
      const filteredAsset: Record<string, any> = {};
      Object.entries(asset).forEach(([key, value]) => {
        if (value != null) {
          filteredAsset[key] = value;
        }
      });
      return filteredAsset;
    });

    return filteredData || [];
  },

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