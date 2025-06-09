import { Company } from "~/types/company.type"
import supabase from "~/utils/supabase.client"

export const CompanyService = {
    
  // Create
  async createPost(postData: Company) {
    const { data, error } = await supabase
      .from('companies')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Company) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('companies')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 1)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsInactive() {
    const { data, error } = await supabase
      .from('companies')
      .select('*, status_labels(*), departments(*)')
      .eq('status_id', 2)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Company) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Company) {
    const { data, error } = await supabase
      .from('companies')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Company) {
    const { data, error } = await supabase
      .from('companies')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Company) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Company) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}