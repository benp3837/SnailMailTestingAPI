/// <reference types="cypress" /> 

//^Cypress won't recognize any types without this first line ^ 
//(describe, beforeEach, it, cy, and more)

/*BIG PICTURE - 
 *This file contains 5 End to End tests for the Inbox component.
    1) Check that a real, successful GET inbox request to the backend works as expected
    2) Check that a real, successful GET inbox request to the backend works differently when there is no mail
    3) Check that a fake GET inbox request to the backend works as expected
    4) Check that a real, failed GET request is handled in an expected way
    5) Check that clicking the "compose email" button opens the Compose.tsx
 *
*/

describe("Inbox Component - With real GET request to the API", () => {
    it("fetches and displays mail from the backend", () => {
      
        //Render the inbox component. (Inbox is rendered right in App.tsx)
        cy.visit("http://localhost:5173");  

        //Extract the HTTP response when it comes in so we can run tests on it
        //We can also manipulate the response this way. See later tests ;)
        cy.intercept("GET", "http://localhost:8080/mail").as("getInbox"); 

        //make sure the GET request came back as a 200. Note the "getInbox" alias
        cy.wait("@getInbox").its("response.statusCode").should("eq", 200);
    
        //Check that the inbox displays as expected
        cy.get("table").should("exist");
        cy.contains("Subject").should("exist");

        //Test that the first row looks like what we expect
        cy.get("tbody tr").first().within(() => {
            cy.get("td").eq(0).should("not.be.empty"); //subject
            cy.get("td").eq(1).should("not.be.empty"); //sender
            cy.get("td").eq(2).should("not.be.empty"); //recipient
          });

    });
  });


describe("Inbox Component - No Mail in inbox", () => {
    it("shows an empty inbox message when there are no emails", () => {

        //This time, we'll manipulate the response to have an empty response body
        cy.intercept("GET", "http://localhost:8080/mail", {
        statusCode: 200,
        body: [],
        });

        //Render Inbox
        cy.visit("http://localhost:5173");

        //Check that the message is there and the table isn't
        cy.contains("No mail yet. You're all caught up!").should("be.visible");
        cy.get("table").should("not.exist");
    });
});


describe('Inbox Component - With Fixture Based Dummy Data', () => {

    //Just to show beforeEach - setting up the fixture to replace the HTTP Response when it comes back
    beforeEach(() => {
      //Intercept the GET request to /mail and respond with the fixture
      cy.intercept('GET', '/mail', { fixture: 'inbox.json' })
    })
  
    it("fetches and displays fake mail from the fixtures/inbox.json", () => {

        cy.visit('http://localhost:5173') //Render Inbox component
  
        //Confirm the number of messages rendered
        cy.get('tbody tr').should('have.length', 3)
    
        //Check that each message displays correct content
        cy.contains('td', 'Meeting Reminder').should('exist')
        cy.contains('td', 'alice@snailmail.com').should('exist')
        cy.contains('td', 'Fixtures help us mock data, which gives us complete control over the data being tested').should('exist')
        
        cy.contains('td', 'Lunch Plans').should('exist')
        cy.contains('td', 'carol@snailmail.com').should('exist')
        cy.contains('td', 'Mocks are helpful for early UI testing when dont have an API yet...').should('exist')
    
    })
  })


describe("Inbox Component - API fails to respond", () => {
    it("displays an error alert if the inbox fetch fails", () => {
      cy.intercept("GET", "http://localhost:8080/mail", {
        forceNetworkError: true, //Trigger the catch block automatically
      }).as("getInboxFail");
  
      //Stub the alert when it pops up so Cypress doesn't get interrupted
      //"Stub"? we're faking the alert so Cypress can track it without actually causing a popup
      cy.on("window:alert", cy.stub().as("alert"));
  
      //Render Inbox component
      cy.visit("http://localhost:5173");
  
      //wait for @getInboxFail to return
      //Not necessary due to Cypress's automatic waiting! But it does add reliability.
      cy.wait("@getInboxFail");
  
      //Confirm alert got triggered. Note the use of the alias we defined a few lines above
      cy.get("@alert").should("have.been.calledWith", "Something went wrong trying to fetch mail");

      //Some debugging stategies-------------------

      cy.pause() //This will pause the test runner. You have to manually resume it

      cy.log("I'm a Cypress test log! I'll show up in the Cypress GUI")

    });
  });


//THIS TEST WILL BE HELPFUL WHEN YOU START TESTING THE COMPOSE COMPONENT!
describe("Inbox Component - Compose Email Button Renders Compose.tsx", () => {
  it("renders the Compose component when the button is clicked", () => {
    
    //Render App.tsx
    cy.visit("http://localhost:5173");

    //Find and click the button that opens the Compose component
    cy.contains("button", "Compose Email").click();

    //Assert that the Compose component is visible - using a data
    cy.get('[data-testid="compose-component"]').should("exist");

    //The last line of this test will be useful when you test the Componse.tsx

  });
});
