import { Category } from "~/types/category.type"
import supabase from "~/utils/supabase.client"

export const CategoryService = {
    
  // Create
  async createPost(postData: Category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Category) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Category) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Category) {
    const { data, error } = await supabase
      .from('categories')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Category) {
    const { data, error } = await supabase
      .from('categories')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Category) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByUser(userId: Category) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}