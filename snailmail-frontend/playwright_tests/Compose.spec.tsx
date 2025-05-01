import { test, expect, request } from '@playwright/test';

//TODO: describe()??

test.beforeEach(async ({ page }) => {
  await page.goto('/'); //Playwright automatically goes to baseURL defined in the config file
  await page.getByRole('button', { name: 'Compose Email' }).click(); //Open Compose.tsx
});

test('user can send email via compose screen', async ({ page }) => {

  //I like to select elements by the easiest field that's still unique. 
  await page.getByPlaceholder('Recipient').fill('testemail@snailmail.com');
  await page.getByPlaceholder('Subject').fill('E2E Playwright');
  await page.getByPlaceholder('Write your message here...').fill('Hello from E2E test!');

  //dialog - an event that gets emitted when a dialog element appears (alert() is one!)
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('sent mail to'); //assert its message
    await dialog.accept(); //.accept() hits "ok" to dismiss the alert
  });

  //click the send button, which should trigger the alert we're listening for above
  await page.getByRole('button', { name: 'Send' }).click(); 

  //Wait for an HTTP response from the /mail URL
  const response = await page.waitForResponse('**/mail');  

  //Make assertions on the values of the HTTP response
  expect(response.status()).toBe(201);
  const jsonResponse = await response.json();
  expect(jsonResponse.recipient).toBe('testemail@snailmail.com');
  //TODO: could expect() on the other fields too

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

test('backend rejects email with missing recipient', async () => {

  //recall that the backend sends a 400 (client side error) if an email is missing a recipient
  //missing recipient SHOULD be caught by the frontend first... 
  //but it's important to test that the backend handles it correctly

  //Let's make a new ApiRequestContext so we can directly send an HTTP request to the backend
  const requestContext = await request.newContext();

  //Directly send a POST with an email object - this returns an ApiResponse object that we can run assertions on
  const response = await requestContext.post('http://localhost:8080/mail', {
    data: {
      sender: 'me@snailmail.com',
      recipient: '',
      subject: 'The backend will never allow this',
      body: 'Test message',
    },
  });

  //make sure we get an error code in the response
  expect(response.status()).toBeGreaterThanOrEqual(400);

  //Let's also extract the response body so we can see if we get the expected error message
  const body = await response.json(); 
  expect(body.message).toBe("Sender or recipient cannot be null");

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

  //test for backend being down, HTTP request failing (mock the request w/ abort)
  test('shows alert if backend is down', async ({ page }) => {

    // Intercept the POST request and simulate a failed backend
    await page.route('**/mail', route => {
      route.abort(); // Simulates the server being down
    });
  
    // Mount your app
    await page.goto('http://localhost:5173'); // or whatever your Vite port is
  
    // Open Compose component
    await page.getByRole('button', { name: 'Compose Email' }).click();
  
    // Fill out a valid form
    await page.getByPlaceholder('Recipient').fill('valid@email.com');
    await page.getByPlaceholder('Subject').fill('Server Down Test');
    await page.getByPlaceholder('Write your message here...').fill('Body text');
  
    // Listen for alert and check message
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Network'); // Or a more specific substring depending on error
      await dialog.dismiss();
    });
   
    // Attempt to send email
    await page.getByRole('button', { name: 'Send' }).click();
  });

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

//Test console.log logs correct data
test('logs correct data from backend after sending email', async ({ page }) => {


    //Fill out a valid form
    await page.getByPlaceholder('Recipient').fill('valid@email.com');
    await page.getByPlaceholder('Subject').fill('test console.log logs');
    await page.getByPlaceholder('Write your message here...').fill('Body text');

  //Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'log') {
      expect(msg.text()).toContain("{mailId: 0, sender: me@snailmail.com, recipient: valid@email.com, subject: test console.log logs, body: Body text}")
    }
  });

  //Click Send to trigger the alert being listened for
  await page.getByRole('button', { name: 'Send' }).click();

})

test('user can send email via compose screen (with HAR)', async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: {
      path: 'har-files/send-email.har',
      content: 'embed', //Optional: embeds the response bodies into the HAR file
    },
  });

  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Compose Email' }).click();

  await page.getByPlaceholder('Recipient').fill('testemail@snailmail.com');
  await page.getByPlaceholder('Subject').fill('E2E Playwright');
  await page.getByPlaceholder('Write your message here...').fill('Hello from E2E test!');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('sent mail to');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Send' }).click();

  const response = await page.waitForResponse('**/mail');
  expect(response.status()).toBe(201);
  const jsonResponse = await response.json();
  expect(jsonResponse.recipient).toBe('testemail@snailmail.com');

  await context.close(); // Ensures the HAR file is finalized
});