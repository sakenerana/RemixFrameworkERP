import { Accessories } from "~/types/accessories.type"
import { Category } from "~/types/category.type"
import { License } from "~/types/license.type"
import supabase from "~/utils/supabase.client"

export const LicenseService = {

  // Create
  async createPost(postData: License) {
    const { data, error } = await supabase
      .from('licenses')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createPostLicenseCheck(postData: License) {
    const { data, error } = await supabase
      .from('license_check')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('licenses')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        manufacturers(*), 
        depreciations(*), 
        suppliers(*), 
        companies(*), 
        categories(*),
        license_check:license_check!license_id(
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
  async getAllChecked(departmentID: number, license_id: number) {
    const { data, error } = await supabase
      .from('license_check')
      .select(`*, licenses(*)`)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('license_id', license_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllProductKeyByID(departmentID: number, license_id: number) {
    const { data, error } = await supabase
      .from('licenses')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        manufacturers(*), 
        depreciations(*), 
        suppliers(*), 
        companies(*), 
        categories(*),
        license_check:license_check!license_id(
        *
      )
        `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('id', license_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('licenses')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        manufacturers(*), 
        depreciations(*), 
        suppliers(*), 
        companies(*), 
        categories(*),
        license_check:license_check!license_id(
        count
      )
        `)
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('licenses') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: License) {
    const { data, error } = await supabase
      .from('licenses')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: License) {
    const { data, error } = await supabase
      .from('licenses')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: License) {
    const { data, error } = await supabase
      .from('licenses')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deleteLicenseCheck(id: number) {
    const { error } = await supabase
      .from('license_check')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByUser(userId: License) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}