
import { Bin, User, UserRole, DashboardStats, BinStatus, Compartment, TeamMember } from '../types';

const initialCompartments = (): Compartment[] => [
  { id: 'c1', name: 'Organic', fillLevel: Math.floor(Math.random() * 40) },
  { id: 'c2', name: 'Plastic', fillLevel: Math.floor(Math.random() * 40) },
  { id: 'c3', name: 'Metal', fillLevel: Math.floor(Math.random() * 40) }
];

let MOCK_BINS: Bin[] = [
  {
    id: 'BN-001',
    locationName: 'Central Park North',
    address: '110th St, New York, NY 10026',
    latitude: 40.7951,
    longitude: -73.9583,
    status: 'NORMAL',
    enabled: true,
    lastEmptied: '2024-03-25T10:00:00Z',
    assignedOperatorId: 'op-1',
    compartments: [
      { id: 'c1', name: 'Organic', fillLevel: 45 },
      { id: 'c2', name: 'Plastic', fillLevel: 30 },
      { id: 'c3', name: 'Metal', fillLevel: 10 }
    ]
  },
  {
    id: 'BN-002',
    locationName: 'Times Square',
    address: 'Manhattan, NY 10036',
    latitude: 40.7589,
    longitude: -73.9851,
    status: 'FULL',
    enabled: true,
    lastEmptied: '2024-03-24T08:00:00Z',
    assignedOperatorId: 'op-1',
    compartments: [
      { id: 'c1', name: 'Organic', fillLevel: 95 },
      { id: 'c2', name: 'Plastic', fillLevel: 92 },
      { id: 'c3', name: 'Metal', fillLevel: 88 }
    ]
  },
  {
    id: 'BN-003',
    locationName: 'Grand Central',
    address: '89 E 42nd St, New York, NY 10017',
    latitude: 40.7527,
    longitude: -73.9772,
    status: 'NORMAL',
    enabled: true,
    lastEmptied: '2024-03-26T14:30:00Z',
    assignedOperatorId: 'op-2',
    compartments: initialCompartments()
  },
  {
    id: 'BN-004',
    locationName: 'Battery Park',
    address: 'New York, NY 10004',
    latitude: 40.7033,
    longitude: -74.0170,
    status: 'FULL',
    enabled: true,
    lastEmptied: '2024-03-27T09:15:00Z',
    assignedOperatorId: 'op-1',
    compartments: [
      { id: 'c1', name: 'Organic', fillLevel: 98 },
      { id: 'c2', name: 'Plastic', fillLevel: 94 },
      { id: 'c3', name: 'Metal', fillLevel: 91 }
    ]
  },
  {
    id: 'BN-005',
    locationName: 'DUMBO Waterfront',
    address: 'Brooklyn, NY 11201',
    latitude: 40.7041,
    longitude: -73.9922,
    status: 'FULL',
    enabled: true,
    lastEmptied: '2024-03-27T11:45:00Z',
    assignedOperatorId: 'op-1',
    compartments: [
      { id: 'c1', name: 'Organic', fillLevel: 92 },
      { id: 'c2', name: 'Plastic', fillLevel: 96 },
      { id: 'c3', name: 'Metal', fillLevel: 89 }
    ]
  },
  {
    id: 'BN-006',
    locationName: 'Millennium Park',
    address: '201 E Randolph St, Chicago, IL 60602',
    latitude: 41.8827,
    longitude: -87.6226,
    status: 'WARNING',
    enabled: true,
    lastEmptied: '2024-03-26T15:00:00Z',
    assignedOperatorId: 'op-2',
    compartments: [
      { id: 'c1', name: 'Organic', fillLevel: 75 },
      { id: 'c2', name: 'Plastic', fillLevel: 82 },
      { id: 'c3', name: 'Metal', fillLevel: 40 }
    ]
  }
];

let MOCK_TEAM: TeamMember[] = [
  { id: 1, name: "Parnavi Rane", role: "Frontend Developer", linkedin: "https://www.linkedin.com/in/parnavi-rane-234a58329/", imageUrl: "https://i.pravatar.cc/300?u=1" },
  { id: 2, name: "Khushi Gaurkar", role: "Backend Developer", linkedin: "https://www.linkedin.com/in/khushigaurkar/", imageUrl: "https://i.pravatar.cc/300?u=2" },
  { id: 3, name: "Arya Parab", role: "IoT Hardware & Circuit", linkedin: "https://www.linkedin.com/in/arya-parab/", imageUrl: "https://i.pravatar.cc/300?u=3" },
  { id: 4, name: "Adithya Achary", role: "Embedded Systems", linkedin: "https://www.linkedin.com/in/adithya-achary-8871a932a/", imageUrl: "https://i.pravatar.cc/300?u=4" },
  { id: 5, name: "Sellora Panda", role: "Research & Documentation", linkedin: "https://www.linkedin.com/in/sellora-biswanath-panda-348139329/", imageUrl: "https://i.pravatar.cc/300?u=5" },
  { id: 6, name: "Divya Bhor", role: "Research & Development", linkedin: "https://www.linkedin.com/in/divya-bhor-1b5269330/", imageUrl: "https://i.pravatar.cc/300?u=6" },
  { id: 101, name: "Dr. Dhananjay Patel", role: "Project Mentor", linkedin: "https://www.linkedin.com/in/dhananjay-patel-ph-d-27491931/", imageUrl: "https://i.pravatar.cc/300?u=101", isProfessor: true },
  { id: 102, name: "Prof. Vinita Bhandiwad", role: "Project Mentor", linkedin: "https://www.linkedin.com/in/vinita-bhandiwad-450294116/", imageUrl: "https://i.pravatar.cc/300?u=102", isProfessor: true },
];

const calculateStatus = (compartments: Compartment[]): BinStatus => {
  const maxFill = Math.max(...compartments.map(c => c.fillLevel));
  if (maxFill >= 90) return 'FULL';
  if (maxFill >= 70) return 'WARNING';
  return 'NORMAL';
};

export const api = {
  login: async (email: string, pass: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email === 'admin@ecomitra.com') {
      return {
        user: { id: 'admin-1', name: 'Admin Control', email, role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=admin', bio: 'Regional Waste Logistics Manager' },
        token: 'mock-admin'
      };
    } else if (email === 'operator2@ecomitra.com') {
      return {
        user: { id: 'op-2', name: 'Operator 2', email, role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=op2', bio: 'Field Specialist - Zone 2' },
        token: 'mock-op2'
      };
    } else {
      // Default to op-1 for operator1@ecomitra.com and others
      return {
        user: { id: 'op-1', name: 'Operator 1', email: 'operator1@ecomitra.com', role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=op', bio: 'Field Specialist - Zone 4' },
        token: 'mock-op1'
      };
    }
  },

  getStats: async (): Promise<DashboardStats> => {
    const enabledBins = MOCK_BINS.filter(b => b.enabled);
    const full = enabledBins.filter(b => b.status === 'FULL').length;
    const allLevels = enabledBins.flatMap(b => b.compartments.map(c => c.fillLevel));
    const avg = allLevels.length ? Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length) : 0;
    return {
      totalBins: MOCK_BINS.length,
      fullBins: full,
      avgFillPercentage: avg,
      activeAlerts: enabledBins.filter(b => b.status !== 'NORMAL').length
    };
  },

  getAllBins: async (): Promise<Bin[]> => {
    return [...MOCK_BINS];
  },

  getOperatorBins: async (operatorId: string): Promise<Bin[]> => {
    return MOCK_BINS.filter(b => b.assignedOperatorId === operatorId && b.enabled);
  },

  markAsEmptied: async (binId: string): Promise<Bin> => {
    const idx = MOCK_BINS.findIndex(b => b.id === binId);
    MOCK_BINS[idx] = {
      ...MOCK_BINS[idx],
      compartments: MOCK_BINS[idx].compartments.map(c => ({ ...c, fillLevel: 0 })),
      status: 'NORMAL',
      lastEmptied: new Date().toISOString()
    };
    return MOCK_BINS[idx];
  },

  getTeam: async (): Promise<TeamMember[]> => {
    return [...MOCK_TEAM];
  },

  updateTeamMemberImage: async (id: number, imageUrl: string): Promise<TeamMember> => {
    const idx = MOCK_TEAM.findIndex(m => m.id === id);
    if (idx !== -1) {
      MOCK_TEAM[idx].imageUrl = imageUrl;
      return MOCK_TEAM[idx];
    }
    throw new Error("Member not found");
  },

  simulateFill: async (binId: string, level: number): Promise<Bin> => {
    const idx = MOCK_BINS.findIndex(b => b.id === binId);
    if (idx !== -1) {
      const updatedCompartments = MOCK_BINS[idx].compartments.map(c => ({ ...c, fillLevel: level }));
      MOCK_BINS[idx] = {
        ...MOCK_BINS[idx],
        compartments: updatedCompartments,
        status: calculateStatus(updatedCompartments)
      };
      return MOCK_BINS[idx];
    }
    throw new Error("Bin not found");
  }
};
