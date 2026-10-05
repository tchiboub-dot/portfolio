import { test, expect } from '@playwright/test';

const base = 'https://portfolio-flame-two-94.vercel.app';

test('buyer flow desktop and mobile', async ({ page, browserName }) => {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Taha|Portfolio|Chiboub/i);

  const projectBtn = page.getByRole('link', { name: /View My Projects/i });
  await expect(projectBtn).toBeVisible();
  await projectBtn.click();
  await page.waitForTimeout(600);
  await expect(page.locator('#projects')).toBeVisible();

  const nextProject = page.getByRole('button', { name: /Next project/i });
  await expect(nextProject).toBeVisible();
  await nextProject.click();

  const liveDemo = page.getByRole('link', { name: /View Live Demo/i }).first();
  await expect(liveDemo).toBeVisible();

  const contactAnchor = page.getByRole('link', { name: /Contact/i }).first();
  await contactAnchor.click();
  await page.waitForTimeout(600);
  await expect(page.locator('#contact')).toBeVisible();

  const name = page.locator('#name');
  const email = page.locator('#email');
  const message = page.locator('#message');
  await name.fill('Buyer Test');
  await email.fill('buyer@example.com');
  await message.fill('I am interested in working with you on a product collaboration.');
  await page.getByRole('button', { name: /Send Message/i }).click();

  await expect(page.getByText(/successfully|sent successfully|Thank you/i)).toBeVisible({ timeout: 10000 });
});
