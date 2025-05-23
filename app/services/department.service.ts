import { Department } from "~/types/department.type"
import supabase from "~/utils/supabase.client"

export const DepartmentService = {
    
  // Create
  async createPost(postData: Department) {
    const { data, error } = await supabase
      .from('departments')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Department) {
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
      .from('departments')
      .select('*, status_labels(*)')
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Department) {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Department) {
    const { data, error } = await supabase
      .from('departments')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Department) {
    const { data, error } = await supabase
      .from('departments')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Department) {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Department) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}