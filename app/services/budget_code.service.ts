import supabase from "~/utils/supabase.client"

export interface BudgetCodePayload {
  particulars: string;
}

export const BudgetCodeService = {

  // Read All
  async getAllParticulars() {
    const { data, error } = await supabase
      .from('budget_code')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Create
  async createParticular(payload: BudgetCodePayload) {
    const { data, error } = await supabase
      .from('budget_code')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update
  async updateParticular(id: number, payload: BudgetCodePayload) {
    const { data, error } = await supabase
      .from('budget_code')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete
  async deleteParticular(id: number) {
    const { error } = await supabase
      .from('budget_code')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

}
