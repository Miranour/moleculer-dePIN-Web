import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../pages/Lab';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Simulation Flow Integration', () => {
  it('should render lab interface and trigger simulation', async () => {
    // Mock the simulation service directly for UI component test if API call is deep, 
    // or rely on MSW if the component calls fetch directly.
    renderWithProviders(<Lab />);

    // RDKit loading state should be present initially or bypass in test
    // Assuming UI renders "Simülasyonu Başlat" button
    const startButton = await screen.findByRole('button', { name: /Simülasyonu Başlat/i });
    expect(startButton).toBeInTheDocument();

    // Trigger simulation
    fireEvent.click(startButton);

    // Wait for the UI to show some progress or success message
    // Note: In reality, this requires SSE to mock. We'll verify button disabled state
    await waitFor(() => {
      expect(startButton).toBeDisabled();
    });
  });
});
