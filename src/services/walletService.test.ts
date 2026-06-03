import { describe, it, expect } from 'vitest';
import { walletService } from './walletService';

describe('Wallet Service', () => {
  it('should fetch initial wallet data', async () => {
    const data = await walletService.getWalletData();
    expect(data).toHaveProperty('balance');
    expect(data.transactions).toBeInstanceOf(Array);
    expect(data.balance).toBeGreaterThan(0);
  });

  it('should add funds and return new transaction', async () => {
    const amount = 500;
    const initialData = await walletService.getWalletData();
    const initialBalance = initialData.balance;

    const tx = await walletService.deposit(amount);

    expect(tx).toBeDefined();
    expect(tx.amount).toBe(amount);
    expect(tx.type).toBe('deposit');
    expect(tx.status).toBe('completed');

    const updatedData = await walletService.getWalletData();
    expect(updatedData.balance).toBe(initialBalance + amount);
    expect(updatedData.transactions[0].id).toBe(tx.id);
  });
});
