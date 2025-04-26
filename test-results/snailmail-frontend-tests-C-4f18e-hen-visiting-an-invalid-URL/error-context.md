# Test info

- Name: should show the error page when visiting an invalid URL
- Location: C:\Users\BenjaminPetruzziello\Documents\Revature\Sandbox\SDET\SnailMailTestingAPI\snailmail-frontend\tests\Compose.spec.tsx:61:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=404')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=404')

    at C:\Users\BenjaminPetruzziello\Documents\Revature\Sandbox\SDET\SnailMailTestingAPI\snailmail-frontend\tests\Compose.spec.tsx:69:44
```

# Page snapshot

```yaml
- navigation:
  - heading "🐌 SnailMail 🐌" [level=2]
- heading "Inbox" [level=3]
- table:
  - rowgroup:
    - row "Subject Sender Message":
      - cell "Subject"
      - cell "Sender"
      - cell "Message"
  - rowgroup:
    - row "Hey snail@snailmail.com I am a snail":
      - cell "Hey"
      - cell "snail@snailmail.com"
      - cell "I am a snail"
    - row "Hey snail@snailmail.com I have a shell":
      - cell "Hey"
      - cell "snail@snailmail.com"
      - cell "I have a shell"
    - row "Hey slug@snailmail.com I am a slug":
      - cell "Hey"
      - cell "slug@snailmail.com"
      - cell "I am a slug"
    - row "Hey clam@snailmail.com ...":
      - cell "Hey"
      - cell "clam@snailmail.com"
      - cell "..."
- button "Compose Email"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | //TODO: describe()??
   4 |
   5 | test.beforeEach(async ({ page }) => {
   6 |   await page.goto('http://localhost:5173'); 
   7 | });
   8 |
   9 | test('user can send email via compose screen', async ({ page }) => {
  10 |
  11 |   await page.getByRole('button', { name: 'Compose Email' }).click(); //Click Compose Email button
  12 |
  13 |   await page.getByPlaceholder('Recipient').fill('testemail@snailmail.com');
  14 |   await page.getByPlaceholder('Subject').fill('E2E Playwright');
  15 |   await page.getByPlaceholder('Write your message here...').fill('Hello from E2E test!');
  16 |
  17 |   page.once('dialog', async (dialog) => {
  18 |     expect(dialog.message()).toContain('sent mail to');
  19 |     await dialog.accept();
  20 |   });
  21 |
  22 |   await page.getByRole('button', { name: 'Send' }).click();
  23 | });
  24 |
  25 |
  26 | test('shows alert when trying to send without recipient', async ({ page }) => {
  27 |
  28 |   // Click the "Compose Email" button
  29 |   await page.getByRole('button', { name: 'Compose Email' }).click();
  30 |
  31 |   // Fill only subject and body, leave recipient empty
  32 |   await page.getByPlaceholder('Subject').fill('Missing recipient');
  33 |   await page.getByPlaceholder('Write your message here...').fill('This should not send.');
  34 |
  35 |   // Listen for the alert and assert its message
  36 |   page.once('dialog', async (dialog) => {
  37 |     expect(dialog.message()).toBe('Recipient cannot be empty!');
  38 |     await dialog.accept();
  39 |   });
  40 |
  41 |   // Click Send
  42 |   await page.getByRole('button', { name: 'Send' }).click();
  43 | });
  44 |
  45 | test('closes the compose component when X is clicked', async ({ page }) => {
  46 |   
  47 |     // Open the Compose component
  48 |     await page.getByRole('button', { name: 'Compose Email' }).click();
  49 |   
  50 |     // Make sure it's visible
  51 |     await expect(page.getByTestId('compose-component')).toBeVisible();
  52 |   
  53 |     // Click the close (X) button
  54 |     await page.locator('.btn-close').click();
  55 |   
  56 |     // Verify the component is no longer in the DOM
  57 |     await expect(page.getByTestId('compose-component')).toHaveCount(0);
  58 |   });
  59 |
  60 |   //For this test, we'll create a new context to switch the base URL defined in the beforeEach
  61 |   test('should show the error page when visiting an invalid URL', async ({ browser }) => {
  62 |     // Create an isolated context that doesn't inherit the beforeEach
  63 |     const context = await browser.newContext();
  64 |     const page = await context.newPage();
  65 |
  66 |     await page.goto('http://localhost:5173/nonexistent');
  67 |
  68 |     //Assert that our error page shows up
> 69 |     await expect(page.locator('text=404')).toBeVisible(); // or however your app shows errors
     |                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  70 |     // You could also check for 'Page not found' or other wording
  71 |
  72 |     await context.close();
  73 |   });
  74 |
```