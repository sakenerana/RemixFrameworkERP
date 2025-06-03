import { Location } from "~/types/location.type"
import supabase from "~/utils/supabase.client"

export const LocationService = {
    
  // Create
  async createPost(postData: Location) {
    const { data, error } = await supabase
      .from('locations')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Location) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Location) {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

   // Activate
  async activateStatus(id: number, updates: Location) {
    const { data, error } = await supabase
      .from('locations')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Location) {
    const { data, error } = await supabase
      .from('locations')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Location) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Location) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}