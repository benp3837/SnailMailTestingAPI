import { test, expect } from '@playwright/test';

//TODO: describe()??

test.beforeEach(async ({ page }) => {
  await page.goto('/'); //Playwright automatically goes to baseURL defined in the config file
  await page.getByRole('button', { name: 'Compose Email' }).click(); //Open Compose.tsx
});

test('user can send email via compose screen', async ({ page }) => {

  await page.getByPlaceholder('Recipient').fill('testemail@snailmail.com');
  await page.getByPlaceholder('Subject').fill('E2E Playwright');
  await page.getByPlaceholder('Write your message here...').fill('Hello from E2E test!');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('sent mail to');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Send' }).click();

  const response = await page.waitForResponse('**/mail');  //Waits for a network response matching the /mail URL

  //Make assertions on the values of the HTTP response
  expect(response.status()).toBe(200);
  const jsonResponse = await response.json();
  expect(jsonResponse.recipient).toBe('testemail@snailmail.com');

});

test('shows alert when trying to send without recipient', async ({ page }) => {

  //Fill only subject and body, leave recipient empty
  await page.getByPlaceholder('Subject').fill('Missing recipient');
  await page.getByPlaceholder('Write your message here...').fill('This should not send.');

  //Listen for the alert (which is a "dialog" event) and assert its message when it appears
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Recipient cannot be empty!');
    await dialog.accept();
  });

  //Click Send to trigger the alert being listened for
  await page.getByRole('button', { name: 'Send' }).click();
});

test('shows alert when recipient is not valid email', async ({ page }) => {

  //Fill subject and body, put invalid email for recipient
  await page.getByPlaceholder('Subject').fill('Invalid recipient');
  await page.getByPlaceholder('Write your message here...').fill('This should not send.');
  await page.getByPlaceholder('Recipient').fill('Something random, NOT an email');

  //Listen for the alert and assert its message when it appears
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe("Recipient doesn't appear to be a valid email address");
    await dialog.accept();
  });

  //Click Send to trigger the alert being listened for
  await page.getByRole('button', { name: 'Send' }).click();
});

test('closes the compose component when X is clicked', async ({ page }) => {
  
    //Make sure Compose is visible to start
    await expect(page.getByTestId('compose-component')).toBeVisible();
  
    //Click the x button using a value in the class, just for fun
    await page.locator('.btn-close').click();
  
    //Assert that Compose is no longer in the DOM, using count just for fun
    await expect(page.getByTestId('compose-component')).toHaveCount(0);
  });

  //TODO: test for backend being down, HTTP request failing (mock the request w/ abort)

  //For this test, we'll create a new context to switch the base URL defined in the beforeEach
  //Not really compose related but just wanna show it
  test('should show the error page when visiting an invalid URL', async ({ browser }) => {

    //Create an isolated context that doesn't inherit the beforeEach
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5173/nonexistent');

    //Assert that our error page shows up
    await expect(page.getByText('Welcome to the Error Page')).toBeVisible();

    //TODO: yes we could have used an identifier like a data attribute here
    //TODO: it would look like _____________

    await context.close();
  });
