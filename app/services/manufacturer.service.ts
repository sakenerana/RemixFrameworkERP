import { Manufacturer } from "~/types/manufacturer.type"
import supabase from "~/utils/supabase.client"

export const ManufacturerService = {
    
  // Create
  async createPost(postData: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Manufacturer) {
    const { error } = await supabase
      .from('manufacturers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Manufacturer) {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}