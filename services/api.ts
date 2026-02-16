import { Bin, User, UserRole, DashboardStats, BinStatus, Compartment, TeamMember } from '../types';
import { supabase } from '../src/lib/supabaseClient';

// Helper to calculate overall bin status from compartments
const calculateStatus = (compartments: Compartment[]): BinStatus => {
  const maxFill = Math.max(...compartments.map(c => c.fillLevel));
  if (maxFill >= 90) return 'FULL';
  if (maxFill >= 70) return 'WARNING';
  return 'NORMAL';
};

export const api = {
  // Authentication is now handled in App.tsx using supabase.auth directly
  // This remains for backward compatibility or if needed by specific components
  login: async (email: string, pass: string): Promise<{ user: User; token: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;

    const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: userData?.name || 'User',
        role: userData?.role as UserRole,
        avatar: userData?.avatar,
        bio: userData?.bio
      },
      token: data.session?.access_token || ''
    };
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data: bins, error } = await supabase.from('bins').select('*').eq('enabled', true);
    if (error) throw error;

    const full = bins.filter(b => b.status === 'FULL').length;
    const allLevels = bins.flatMap(b => (b.compartments as Compartment[]).map(c => c.fillLevel));
    const avg = allLevels.length ? Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length) : 0;

    return {
      totalBins: bins.length,
      fullBins: full,
      avgFillPercentage: avg,
      activeAlerts: bins.filter(b => b.status !== 'NORMAL').length
    };
  },

  getAllBins: async (): Promise<Bin[]> => {
    const { data, error } = await supabase.from('bins').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data as Bin[];
  },

  getOperatorBins: async (operatorId: string): Promise<Bin[]> => {
    const { data, error } = await supabase
      .from('bins')
      .select('*')
      .eq('assigned_operator_id', operatorId)
      .eq('enabled', true)
      .order('id', { ascending: true });
    if (error) throw error;
    return data as Bin[];
  },

  markAsEmptied: async (binId: string): Promise<Bin> => {
    const { data: currentBin, error: fetchError } = await supabase
      .from('bins')
      .select('compartments')
      .eq('id', binId)
      .single();

    if (fetchError) throw fetchError;

    const emptiedCompartments = (currentBin.compartments as Compartment[]).map(c => ({
      ...c,
      fillLevel: 0
    }));

    const { data, error } = await supabase
      .from('bins')
      .update({
        compartments: emptiedCompartments,
        status: 'NORMAL',
        last_emptied: new Date().toISOString()
      })
      .eq('id', binId)
      .select()
      .single();

    if (error) throw error;
    return data as Bin;
  },

  // Real-time subscription helper
  subscribeToBins: (callback: (payload: any) => void) => {
    return supabase
      .channel('bins-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, callback)
      .subscribe();
  },

  getTeam: async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase.from('team').select('*').order('id', { ascending: true });
    if (error) return []; // Fallback if team table doesn't exist yet
    return data as TeamMember[];
  },

  updateTeamMemberImage: async (id: number, imageUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
      .from('team')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as TeamMember;
  },

  simulateFill: async (binId: string, level: number): Promise<Bin> => {
    const { data: currentBin, error: fetchError } = await supabase
      .from('bins')
      .select('compartments')
      .eq('id', binId)
      .single();

    if (fetchError) throw fetchError;

    const updatedCompartments = (currentBin.compartments as Compartment[]).map(c => ({
      ...c,
      fillLevel: level
    }));

    const { data, error } = await supabase
      .from('bins')
      .update({
        compartments: updatedCompartments,
        status: calculateStatus(updatedCompartments)
      })
      .eq('id', binId)
      .select()
      .single();

    if (error) throw error;
    return data as Bin;
  },

  addBin: async (binData: { id: string; locationName: string; address: string; localBodyEmail: string; enabled: boolean }): Promise<Bin> => {
    const defaultCompartments: Compartment[] = [
      { id: 'c1', name: 'Organic', fillLevel: 0 },
      { id: 'c2', name: 'Plastic', fillLevel: 0 },
      { id: 'c3', name: 'Metal', fillLevel: 0 }
    ];

    const { data, error } = await supabase
      .from('bins')
      .insert([
        {
          id: binData.id,
          locationName: binData.locationName,
          address: binData.address,
          local_body_email: binData.localBodyEmail,
          enabled: binData.enabled,
          status: 'NORMAL',
          compartments: defaultCompartments,
          last_emptied: new Date().toISOString(),
          latitude: 0, // Default coordinates as placeholder
          longitude: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Bin;
  }
};
