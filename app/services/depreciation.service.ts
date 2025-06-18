import { Depreciation } from "~/types/depreciation.type"
import supabase from "~/utils/supabase.client"

export const DepreciationService = {
    
  // Create
  async createPost(postData: Depreciation) {
    const { data, error } = await supabase
      .from('depreciations')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('depreciations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('depreciations')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('depreciations')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Depreciation) {
    const { data, error } = await supabase
      .from('depreciations')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Depreciation) {
    const { data, error } = await supabase
      .from('depreciations')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Depreciation) {
    const { data, error } = await supabase
      .from('depreciations')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Depreciation) {
    const { error } = await supabase
      .from('depreciations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Depreciation) {
    const { data, error } = await supabase
      .from('depreciations')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}