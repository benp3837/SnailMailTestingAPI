import { test, expect } from '@playwright/test';

//TODO: beforeEach type stuff to click open the compose component

test('user can send email via compose screen', async ({ page }) => {
  await page.goto('http://localhost:5173'); 

  await page.getByRole('button', { name: 'Compose Email' }).click(); //Click Compose Email button

  await page.getByPlaceholder('Recipient').fill('testemail@snailmail.com');
  await page.getByPlaceholder('Subject').fill('E2E Playwright');
  await page.getByPlaceholder('Write your message here...').fill('Hello from E2E test!');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('sent mail to');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Send' }).click();
});
