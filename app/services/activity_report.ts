import supabase from "~/utils/supabase.client"

export const ActivityReportService = {

    // Read (multiple)
    async getAllPosts(departmentID: number) {
        const { data, error } = await supabase
            .from('activity_report')
            .select(`*, departments(*), users(*)`)
            .eq('department_id', departmentID)
            .order('created_at', { ascending: false })
            .limit(500) // Add this line to limit to 500 records

        if (error) throw error
        return data
    },

}