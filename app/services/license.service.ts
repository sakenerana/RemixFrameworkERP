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

  // Read (single)
  async getPostById(id: License) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('licenses')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 1)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsInactive() {
    const { data, error } = await supabase
      .from('licenses')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 2)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: License) {
    const { data, error } = await supabase
      .from('posts')
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
  async deletePost(id: License) {
    const { error } = await supabase
      .from('licenses')
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