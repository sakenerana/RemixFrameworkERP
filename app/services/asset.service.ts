import { Asset } from "~/types/asset.type"
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

  // Read (single)
  async getPostById(id: Asset) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
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
  async deletePost(id: Asset) {
    const { error } = await supabase
      .from('assets')
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