import { AssetModel } from "~/types/asset_model.tpye"
import supabase from "~/utils/supabase.client"

export const AssetModelService = {
    
  // Create
  async createPost(postData: AssetModel) {
    const { data, error } = await supabase
      .from('asset_model')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('asset_model')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('asset_model')
      .select('*, status_labels(*), departments(*), categories(*), manufacturers(*), depreciations(*)')
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('asset_model')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: AssetModel) {
    const { data, error } = await supabase
      .from('asset_model')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: AssetModel) {
    const { data, error } = await supabase
      .from('asset_model')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: AssetModel) {
    const { data, error } = await supabase
      .from('asset_model')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: AssetModel) {
    const { error } = await supabase
      .from('asset_model')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: AssetModel) {
    const { data, error } = await supabase
      .from('asset_model')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}