import { PredefinedKit } from "~/types/predefined_kit.type"
import supabase from "~/utils/supabase.client"

export const PredefinedKitService = {
    
  // Create
  async createPost(postData: PredefinedKit) {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: PredefinedKit) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

    // Activate
  async activateStatus(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('departments')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('departments')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: PredefinedKit) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: PredefinedKit) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}