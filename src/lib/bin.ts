import { supabase } from "../lib/supabase";

export const getAllBins = async () => {
    const { data, error } = await supabase
        .from("bins")
        .select("*")
        .eq("is_active", true);

    if (error) throw error;
    return data;
};
