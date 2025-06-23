import { Consumable } from "~/types/consumable.type"
import supabase from "~/utils/supabase.client"

export const ConsumableService = {

  // Create
  async createPost(postData: Consumable) {
    const { data, error } = await supabase
      .from('consumables')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createPostConsumableCheck(postData: Consumable) {
    const { data, error } = await supabase
      .from('consumables_check')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('consumables')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('consumables')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        companies(*), 
        manufacturers(*), 
        suppliers(*), 
        categories(*), 
        locations(*),
        consumables_check:consumables_check!consumable_id(
        count
      )
        `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllChecked(departmentID: number, consumable_id: number) {
    const { data, error } = await supabase
      .from('consumables_check')
      .select(`*, consumables(*)`)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('consumable_id', consumable_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('consumables')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        companies(*), 
        manufacturers(*), 
        suppliers(*), 
        categories(*), 
        locations(*),
        consumables_check:consumables_check!consumable_id(
        count
      )
        `)
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('consumables') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: Consumable) {
    const { data, error } = await supabase
      .from('consumables')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Consumable) {
    const { data, error } = await supabase
      .from('consumables')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Consumable) {
    const { data, error } = await supabase
      .from('consumables')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deleteConsumableCheck(id: number) {
    const { error } = await supabase
      .from('consumables_check')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByUser(userId: Consumable) {
    const { data, error } = await supabase
      .from('consumables')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}