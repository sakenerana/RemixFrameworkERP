import { User } from "~/types/user.type";
import supabase from "~/utils/supabase.client";

export const UserService = {
  // Create
  async createPost(postData: User) {
    const { data, error } = await supabase
      .from("users")
      .insert(postData)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Create
  async createPostProfile(postData: any) {
    const { data, error } = await supabase
      .from("profile")
      .insert(postData)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Read (single)
  async getPostById(id: User) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Read (multiple)
  async getAllPosts() {
    const { data, error } = await supabase
      .from("users")
      .select("*, departments(*), status_labels(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTableCounts() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('users') // Replace with your table name
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return count;
  },

  async getTableCountsInactiveUsers() {
    // Get list of all tables (you'll need to know your table names)
    const { count, error } = await supabase
      .from('users') // Replace with your table name
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 2);

    if (error) throw error; 
    return count;
  },

  async getActiveUsers() {
    // Get list of all tables (you'll need to know your table names)
    const { data, error } = await supabase
      .from('users') // Replace with your table name
      .select('*')
      .eq('status_id', 1);

    if (error) throw error; 
    return data;
  },

  // Update
  async updatePost(id: number, updates: User) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Activate
  async activateStatus(id: number, updates: User) {
    const { data, error } = await supabase
      .from("users")
      .update({ status_id: 1 })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Deactivate
  async deactivateStatus(id: number, updates: User) {
    const { data, error } = await supabase
      .from("users")
      .update({ status_id: 2 })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete
  async deletePost(id: User) {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Custom query example
  async getPostsByUser(userId: User) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },
};
