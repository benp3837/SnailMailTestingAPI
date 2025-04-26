import { test, expect } from '@playwright/test';

//TODO: describe()??

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173'); 
});

test('user can send email via compose screen', async ({ page }) => {

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


test('shows alert when trying to send without recipient', async ({ page }) => {

  // Click the "Compose Email" button
  await page.getByRole('button', { name: 'Compose Email' }).click();

  // Fill only subject and body, leave recipient empty
  await page.getByPlaceholder('Subject').fill('Missing recipient');
  await page.getByPlaceholder('Write your message here...').fill('This should not send.');

  // Listen for the alert and assert its message
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Recipient cannot be empty!');
    await dialog.accept();
  });

  // Click Send
  await page.getByRole('button', { name: 'Send' }).click();
});

test('closes the compose component when X is clicked', async ({ page }) => {
  
    // Open the Compose component
    await page.getByRole('button', { name: 'Compose Email' }).click();
  
    // Make sure it's visible
    await expect(page.getByTestId('compose-component')).toBeVisible();
  
    // Click the close (X) button
    await page.locator('.btn-close').click();
  
    // Verify the component is no longer in the DOM
    await expect(page.getByTestId('compose-component')).toHaveCount(0);
  });

  //For this test, we'll create a new context to switch the base URL defined in the beforeEach
  test('should show the error page when visiting an invalid URL', async ({ browser }) => {
    // Create an isolated context that doesn't inherit the beforeEach
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5173/nonexistent');

    //Assert that our error page shows up
    await expect(page.locator('text=404')).toBeVisible(); // or however your app shows errors
    // You could also check for 'Page not found' or other wording

    await context.close();
  });
