import { test, expect } from '@playwright/test';

test.describe('Real Authentication Flow', () => {
  test('should login as admin and see admin dashboard', async ({ page }) => {
    // Go to login page
    await page.goto('/login');

    // Fill the login form
    await page.getByLabel('E-posta').fill('admin@depin.com');
    await page.getByLabel('Şifre').fill('admin123');

    // Submit
    await page.getByRole('button', { name: 'Giriş Yap' }).click();

    // Verify successful redirection to admin dashboard
    await expect(page).toHaveURL(/\/admin\/workers/);
    await expect(page.getByRole('heading', { name: /Ağ & Worker Yönetimi/i })).toBeVisible();
    
    // Verify token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should login as researcher and see dashboard', async ({ page }) => {
    await page.goto('/login');

    // Fill the login form with researcher credentials
    await page.getByLabel('E-posta').fill('user@depin.com');
    await page.getByLabel('Şifre').fill('user123');

    // Submit
    await page.getByRole('button', { name: 'Giriş Yap' }).click();

    // Verify successful redirection to researcher dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Genel Bakış/i })).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('E-posta').fill('wrong@depin.com');
    await page.getByLabel('Şifre').fill('wrong123');

    await page.getByRole('button', { name: 'Giriş Yap' }).click();

    // Verify error message from backend
    await expect(page.getByText('Geçersiz e-posta veya şifre')).toBeVisible();
  });
});
