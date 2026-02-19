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
    try {
      const { data: bins, error } = await supabase
        .from('bins')
        .select('*')
        .eq('is_active', true);
      if (error) {
        console.error(error);
        return {
          totalBins: 0,
          activeBins: 0,
          fullBins: 0,
          avgFillPercentage: 0,
          activeAlerts: 0,
          bins: []
        };
      }

      const binList = (bins || []) as Bin[];
      const full = binList.filter(b => b.status === 'FULL').length;
      const allLevels = binList.flatMap(b => (b.compartments ?? [] as Compartment[]).map(c => c.fillLevel));
      const avg = allLevels.length ? Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length) : 0;

      return {
        totalBins: binList.length,
        activeBins: binList.filter(b => b.is_active).length,
        fullBins: full,
        avgFillPercentage: avg,
        activeAlerts: binList.filter(b => b.status !== 'NORMAL').length,
        bins: binList
      };
    } catch (error) {
      console.error("Error in api.getStats:", error);
      return {
        totalBins: 0,
        activeBins: 0,
        fullBins: 0,
        avgFillPercentage: 0,
        activeAlerts: 0,
        bins: []
      };
    }
  },

  getAllBins: async (): Promise<Bin[]> => {
    console.log("🔥 NEW API FUNCTION RUNNING");
    try {
      const { data: bins, error: binsError } = await supabase
        .from('bins')
        .select('*')
        .order('bin_id', { ascending: true });

      if (binsError) throw binsError;

      const { data: logsData } = await supabase
        .from('latest_waste_logs')
        .select('*');
      const logs = (logsData ?? []) as any[];

      const mergedBins = (bins ?? []).map((bin: any) => {
        const latestLog = logs.find((log: any) => log.bin_id === bin.bin_id);
        if (latestLog) {
          return {
            ...bin,
            status: latestLog.status ?? bin.status,
            compartments: latestLog.compartments ?? bin.compartments
          };
        }
        return bin;
      });

      return mergedBins as Bin[];
    } catch (error) {
      console.error("Error in api.getAllBins:", error);
      return [];
    }
  },

  getOperatorBins: async (operatorId: string): Promise<Bin[]> => {
    try {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .eq('assigned_operator_id', operatorId)
        .order('id', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Bin[];
    } catch (error) {
      console.error("Error in api.getOperatorBins:", error);
      return [];
    }
  },

  markAsEmptied: async (binId: string): Promise<Bin> => {
    try {
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
    } catch (error) {
      console.error("Error in api.markAsEmptied:", error);
      throw error;
    }
  },

  // Real-time subscription helper
  subscribeToBins: (callback: (payload: any) => void) => {
    return supabase
      .channel('bins-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, callback)
      .subscribe();
  },

  getTeam: async (): Promise<TeamMember[]> => {
    try {
      const { data, error } = await supabase.from('team').select('*').order('id', { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    } catch (error) {
      console.error("Error in api.getTeam:", error);
      throw error;
    }
  },

  updateTeamMemberImage: async (id: number, imageUrl: string): Promise<TeamMember> => {
    try {
      const { data, error } = await supabase
        .from('team')
        .update({ image_url: imageUrl })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as TeamMember;
    } catch (error) {
      console.error("Error in api.updateTeamMemberImage:", error);
      throw error;
    }
  },

  addBin: async (binData: { id: string; locationName: string; address: string; localBodyEmail: string; enabled: boolean }): Promise<Bin> => {
    try {
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
    } catch (error) {
      console.error("Error in api.addBin:", error);
      throw error;
    }
  }
};
