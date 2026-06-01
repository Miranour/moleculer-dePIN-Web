export interface Transaction {
  id: string;
  type: 'deposit' | 'simulation_cost' | 'refund';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface WalletData {
  balance: number;
  transactions: Transaction[];
}

let mockWallet: WalletData = {
  balance: 1250,
  transactions: [
    {
      id: 'TRX-1004',
      type: 'simulation_cost',
      amount: -50,
      date: '2026-05-30T16:45:00Z',
      status: 'completed',
      description: 'Simülasyon: Gleevec Analog (1IEP)'
    },
    {
      id: 'TRX-1003',
      type: 'simulation_cost',
      amount: -50,
      date: '2026-05-30T11:20:00Z',
      status: 'completed',
      description: 'Simülasyon: Failed Structure A (1CRN)'
    },
    {
      id: 'TRX-1002',
      type: 'deposit',
      amount: 1000,
      date: '2026-05-29T10:00:00Z',
      status: 'completed',
      description: 'Kredi Yükleme (Kredi Kartı)'
    },
    {
      id: 'TRX-1001',
      type: 'deposit',
      amount: 350,
      date: '2026-05-28T09:00:00Z',
      status: 'completed',
      description: 'Hoşgeldin Bonusu'
    }
  ]
};

export const walletService = {
  getWalletData: async (): Promise<WalletData> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...mockWallet };
  },

  deposit: async (amount: number): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful payment
    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: 'Kredi Yükleme (Stripe)'
    };

    mockWallet.balance += amount;
    mockWallet.transactions = [newTransaction, ...mockWallet.transactions];

    return newTransaction;
  }
};
