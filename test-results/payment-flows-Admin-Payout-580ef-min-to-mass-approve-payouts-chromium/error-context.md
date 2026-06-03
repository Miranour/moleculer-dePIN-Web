# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-flows.spec.ts >> Admin Payout Flow >> should allow admin to mass approve payouts
- Location: e2e/payment-flows.spec.ts:37:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Kripto \/ Banka Payout Yönetimi/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Kripto \/ Banka Payout Yönetimi/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Researcher Payment Flow', () => {
  4  |   test('should allow researcher to view wallet and add funds', async ({ page, context }) => {
  5  |     await context.addInitScript(() => {
  6  |       window.localStorage.setItem('auth_token', 'mock_token');
  7  |       window.localStorage.setItem('user_role', 'researcher');
  8  |     });
  9  | 
  10 |     await page.goto('/wallet');
  11 | 
  12 |     // Wait for page to load and display wallet elements
  13 |     await expect(page.getByRole('heading', { name: /Cüzdan & Bakiye/i })).toBeVisible();
  14 | 
  15 |     // Verify balance is visible (mock data might be loaded, or just check the element exists)
  16 |     await expect(page.getByText('Mevcut Kredi')).toBeVisible();
  17 | 
  18 |     // Fill the deposit amount
  19 |     const amountInput = page.getByPlaceholder('Miktar (USDT)');
  20 |     await expect(amountInput).toBeVisible();
  21 |     await amountInput.fill('500');
  22 | 
  23 |     // Click on the Stripe deposit button
  24 |     const depositButton = page.getByRole('button', { name: /Kredi Kartı ile Yükle/i });
  25 |     await expect(depositButton).toBeVisible();
  26 |     await depositButton.click();
  27 | 
  28 |     // Verify optimistic update or state change (e.g. mock successful payment alert)
  29 |     // A real e2e test with stripe requires complex mocking or a test card. We assert that
  30 |     // the system proceeds to process the payment (button loading state etc)
  31 |     // Since we didn't inject a backend mock into the playwright page natively here,
  32 |     // we'll just check that the action ran.
  33 |   });
  34 | });
  35 | 
  36 | test.describe('Admin Payout Flow', () => {
  37 |   test('should allow admin to mass approve payouts', async ({ page, context }) => {
  38 |     await context.addInitScript(() => {
  39 |       window.localStorage.setItem('auth_token', 'mock_admin_token');
  40 |       window.localStorage.setItem('user_role', 'admin');
  41 |     });
  42 | 
  43 |     await page.goto('/admin/payouts');
  44 | 
  45 |     // Verify Admin Payouts page loaded
> 46 |     await expect(page.getByRole('heading', { name: /Kripto \/ Banka Payout Yönetimi/i })).toBeVisible();
     |                                                                                           ^ Error: expect(locator).toBeVisible() failed
  47 | 
  48 |     // Verify Mass Approve button
  49 |     const massApproveBtn = page.getByRole('button', { name: /Toplu Onayla/i });
  50 |     await expect(massApproveBtn).toBeVisible();
  51 | 
  52 |     // Click mass approve
  53 |     await massApproveBtn.click();
  54 | 
  55 |     // Verify that pending counts are updated
  56 |     // The specific verification depends on UI mock data.
  57 |     // If mock data had pending, they become completed.
  58 |     await expect(page.getByText('Tamamlandı').first()).toBeVisible();
  59 |   });
  60 | });
  61 | 
```