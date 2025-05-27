import { Groups } from "~/types/groups.type"
import supabase from "~/utils/supabase.client"

export const GroupService = {
    
  // Create
  async createPost(postData: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('users_groups')
      .select('*, status_labels(*)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('users_groups') // Replace with your table name
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Groups) {
    const { error } = await supabase
      .from('users_groups')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Groups) {
    const { data, error } = await supabase
      .from('users_groups')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}