import { Accessories } from "~/types/accessories.type"
import supabase from "~/utils/supabase.client"

export const AccessoryService = {

  // Create
  async createPost(postData: Accessories) {
    const { data, error } = await supabase
      .from('accessories')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('accessories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('accessories')
      .select('*, status_labels(*), departments(*), companies(*), manufacturers(*), suppliers(*), categories(*), locations(*)')
      .eq('status_id', 1)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPostsInactive() {
    const { data, error } = await supabase
      .from('accessories')
      .select('*, status_labels(*), departments(*), companies(*), manufacturers(*), suppliers(*), categories(*), locations(*)')
      .eq('status_id', 2)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('accessories') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: Accessories) {
    const { data, error } = await supabase
      .from('accessories')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Accessories) {
    const { data, error } = await supabase
      .from('accessories')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Accessories) {
    const { data, error } = await supabase
      .from('accessories')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Accessories) {
    const { error } = await supabase
      .from('accessories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByUser(userId: Accessories) {
    const { data, error } = await supabase
      .from('accessories')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}