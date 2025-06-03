import { Supplier } from "~/types/supplier.type"
import supabase from "~/utils/supabase.client"

export const SupplierService = {
    
  // Create
  async createPost(postData: Supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: Supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Supplier) {
    const { data, error } = await supabase
      .from("suppliers")
      .update({ status_id: 1 })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Supplier) {
    const { data, error } = await supabase
      .from("suppliers")
      .update({ status_id: 2 })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete
  async deletePost(id: Supplier) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsBySupplier(userId: Supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}