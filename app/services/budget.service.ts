import { Budget } from "~/types/budget.type"
import supabase from "~/utils/supabase.client"

export const BudgetService = {

    // Create
    async createPost(postData: Budget) {
        const { data, error } = await supabase
            .from('budget')
            .insert(postData)
            .select()

        if (error) throw error
        return data[0]
    },

    // Read (single)
    async getPostById(id: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async getByData(departmentID: number, officeID: number) {
        // const currentDate = new Date().toISOString();

        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1) // Only approved budgets
            .eq('department_id', departmentID)
            .eq('office_id', officeID)
            // Filter where current date is between start and end dates
            // .lte('start_date', currentDate)
            // .gte('end_date', currentDate)
            // Get the most recently created budget
            .order('created_at', { ascending: false })
            .limit(1); // Only get the single most recent budget

        if (error) throw error;
        return data?.[0] || null; // Return single record or null
    },

    async getAllPosts(departmentID: number, currentDate: string) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1)
            .eq('department_id', departmentID)
            // Filter where current date is between start and end dates
            // .lte('start_date', currentDate)  // start_date <= currentDate
            .gte('end_date', currentDate)   // end_date >= currentDate
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Read (multiple)
    async getAllPostsByLicenses(departmentID: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1)
            .eq('department_id', departmentID)
            .eq('type', 'License')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Read (multiple)
    async getAllPostsByAccessories(departmentID: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1)
            .eq('department_id', departmentID)
            .eq('type', 'Accessory')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Read (multiple)
    async getAllPostsByConsumables(departmentID: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1)
            .eq('department_id', departmentID)
            .eq('type', 'Consumable')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Read (multiple)
    async getAllPostsByComponents(departmentID: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 1)
            .eq('department_id', departmentID)
            .eq('type', 'Component')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Read (multiple)
    async getAllPostsInactive(departmentID: number) {
        const { data, error } = await supabase
            .from('budget')
            .select('*, status_labels(*), departments(*)')
            .eq('status_id', 2)
            .eq('department_id', departmentID)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Update
    async updatePost(id: number, updates: Budget) {
        const { data, error } = await supabase
            .from('budget')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    // Activate
    async activateStatus(id: number, updates: Budget) {
        const { data, error } = await supabase
            .from('budget')
            .update({ status_id: 1 })
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    // Deactivate
    async deactivateStatus(id: number, updates: Budget) {
        const { data, error } = await supabase
            .from('budget')
            .update({ status_id: 2 })
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    // Delete
    async deletePost(id: Budget) {
        const { error } = await supabase
            .from('budget')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    },

    // Custom query example
    async getPostsByUser(userId: Budget) {
        const { data, error } = await supabase
            .from('budget')
            .select('*')
            .eq('user_id', userId)

        if (error) throw error
        return data
    }
}