import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth Mock
  http.post('*/api/v1/auth/login', async ({ request }) => {
    return HttpResponse.json({
      token: 'mock-jwt-token-xyz',
      user: { id: 'usr_1', role: 'researcher', name: 'Dr. Test' }
    });
  }),

  // Simulation Start Mock
  http.post('*/api/v1/simulations', async ({ request }) => {
    return HttpResponse.json({
      id: 'SIM_999X',
      status: 'queued',
      message: 'Simülasyon kuyruğa alındı'
    }, { status: 201 });
  }),

  // Simulation Status Mock
  http.get('*/api/v1/simulations/:id', () => {
    return HttpResponse.json({
      id: 'SIM_999X',
      status: 'success',
      bindingEnergy: -9.5,
      admetScore: 88,
      moleculeName: 'Test Ligand'
    });
  }),

  // Wallet Mock
  http.get('*/api/v1/wallet', () => {
    return HttpResponse.json({
      balance: 1500,
      transactions: []
    });
  }),
];
