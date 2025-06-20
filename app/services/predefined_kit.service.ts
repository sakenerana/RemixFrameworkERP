import { PredefinedKit } from "~/types/predefined_kit.type"
import supabase from "~/utils/supabase.client"

export const PredefinedKitService = {

  // Create
  async createPost(postData: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Create
  async createPostPredefinedCheck(postData: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined_check')
      .insert(postData)
      .select()

    if (error) throw error
    return data[0]
  },

  // Read (single)
  async getPostById(id: number) {
    const { data, error } = await supabase
      .from('predefined')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Read (multiple)
  async getAllPosts(departmentID: number) {
    const { data, error } = await supabase
      .from('predefined')
      .select(`
      *, 
      status_labels(*),
      departments(*),
      predefined_check:predefined_check!predefined_id(
        count
      )
    `)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllChecked(departmentID: number, predefined_id: number) {
    const { data, error } = await supabase
      .from('predefined_check')
      .select(`*, predefined(*)`)
      .eq('status_id', 1)
      .eq('department_id', departmentID)
      .eq('predefined_id', predefined_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPostsInactive(departmentID: number) {
    const { data, error } = await supabase
      .from('predefined')
      .select(`
      *, 
      status_labels(*),
      departments(*),
      predefined_check:predefined_check!predefined_id(
        count
      )
    `)
      .eq('status_id', 2)
      .eq('department_id', departmentID)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update
  async updatePost(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Activate
  async activateStatus(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined')
      .update({ status_id: 1 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deactivate
  async deactivateStatus(id: number, updates: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete
  async deletePredefinedCheck(id: number) {
    const { error } = await supabase
      .from('predefined_check')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Custom query example
  async getPostsByDepartment(userId: PredefinedKit) {
    const { data, error } = await supabase
      .from('predefined')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}