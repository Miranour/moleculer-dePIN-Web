export interface SimulationResult {
  id: string;
  moleculeName: string;
  smiles: string;
  pdbId: string;
  date: string;
  status: 'success' | 'failed';
  bindingEnergy: number;
  admetScore: number;
  admetDetails: {
    toxicity: number;
    absorption: number;
    distribution: number;
    metabolism: number;
    excretion: number;
  };
}

// Mock Data
const MOCK_RESULTS: SimulationResult[] = [
  {
    id: 'SIM-1001',
    moleculeName: 'Aspirin Derivative',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    pdbId: '1CRN',
    date: '2026-05-28T14:32:00Z',
    status: 'success',
    bindingEnergy: -8.5,
    admetScore: 85,
    admetDetails: { toxicity: 90, absorption: 85, distribution: 75, metabolism: 80, excretion: 95 }
  },
  {
    id: 'SIM-1002',
    moleculeName: 'Novel Kinase Inhibitor',
    smiles: 'C1=CC=C(C=C1)NC2=NC=C(C=N2)C3=CC=CC=C3',
    pdbId: '2SRC',
    date: '2026-05-29T09:15:00Z',
    status: 'success',
    bindingEnergy: -11.2,
    admetScore: 62,
    admetDetails: { toxicity: 40, absorption: 70, distribution: 80, metabolism: 65, excretion: 55 }
  },
  {
    id: 'SIM-1003',
    moleculeName: 'Failed Structure A',
    smiles: 'C1=CC=C(C=C1)N=N',
    pdbId: '1CRN',
    date: '2026-05-30T11:20:00Z',
    status: 'failed',
    bindingEnergy: 0,
    admetScore: 0,
    admetDetails: { toxicity: 0, absorption: 0, distribution: 0, metabolism: 0, excretion: 0 }
  },
  {
    id: 'SIM-1004',
    moleculeName: 'Gleevec Analog',
    smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CC=CC=N5',
    pdbId: '1IEP',
    date: '2026-05-30T16:45:00Z',
    status: 'success',
    bindingEnergy: -12.8,
    admetScore: 78,
    admetDetails: { toxicity: 85, absorption: 60, distribution: 90, metabolism: 75, excretion: 80 }
  }
];

export const simulationService = {
  getSimulations: async (): Promise<SimulationResult[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_RESULTS;
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const total = MOCK_RESULTS.length;
    const success = MOCK_RESULTS.filter(r => r.status === 'success').length;
    const failed = total - success;
    
    return {
      total,
      success,
      failed,
      activeCredits: 1250,
      computeHours: 42.5
    };
  }
};
