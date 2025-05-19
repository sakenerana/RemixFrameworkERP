import { Component } from "~/types/component.type"
import supabase from "~/utils/supabase.client"

export const ComponentService = {
    
  // Create
  async createPost(postData: Component) {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: Component) {
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
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: Component, updates: Component) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePost(id: Component) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: Component) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}