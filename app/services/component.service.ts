import { Component } from "~/types/component.type"
import supabase from "~/utils/supabase.client"

export const ComponentService = {

  // Create
  async createPost(postData: Component) {
    const { data, error } = await supabase
      .from('components')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createPostComponentCheck(postData: Component) {
    const { data, error } = await supabase
      .from('components_check')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('components')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        companies(*), 
        manufacturers(*), 
        suppliers(*), 
        categories(*), 
        locations(*),
        components_check:components_check!component_id(
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
  async getAllChecked(departmentID: number, component_id: number) {
    const { data, error } = await supabase
      .from('components_check')
      .select(`*, components(*)`)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('component_id', component_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('components')
      .select(`*, 
        status_labels(*), 
        departments(*), 
        companies(*), 
        manufacturers(*), 
        suppliers(*), 
        categories(*), 
        locations(*),
        components_check:components_check!component_id(
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
      .from('components') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);

    if (error) throw error;

    return count;
  },

  // Update
  async updatePost(id: number, updates: Component) {
    const { data, error } = await supabase
      .from('components')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: Component) {
    const { data, error } = await supabase
      .from('components')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: Component) {
    const { data, error } = await supabase
      .from('components')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deleteComponentCheck(id: number) {
    const { error } = await supabase
      .from('components_check')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Component) {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}