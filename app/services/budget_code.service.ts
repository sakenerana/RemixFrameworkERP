import { supabase } from "~/lib/supabase"

export const BudgetCodeService = {

  // Read All
  async getAllParticulars() {
    const { data, error } = await supabase
      .from('budget_code')
      .select('*')
    if (error) throw error
    return data
  },

}