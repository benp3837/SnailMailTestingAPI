/// <reference types="cypress" /> 

//^Cypress entities won't be recognized without this first line ^ 
//(includes describe, beforeEach, it, cy, and more)

/*TEST SUITE OVERVIEW - 
 *This file contains 5 End to End tests for the Inbox component.
    1) Check that a real, successful GET inbox request to the backend works as expected
    2) Check that a real, successful GET inbox request to the backend works as expected when there is no mail
    3) Check that a fake GET inbox request (returning mock data) to the backend works as expected
    4) Check that a real, failed GET request is handled as expected
    5) Check that clicking the "compose email" button opens the Compose.tsx Component
 *
*/

describe("Inbox Component Tests", () => {
   
    //beforeEach lets us set functionality that will run before each test (saves some lines of code!)
    beforeEach(() => {
        //Render App.tsx (to see the inbox)
        cy.visit("http://localhost:5173");
    })

    //test 1-----------
    it("fetches and displays mail from the backend", () => {

        //Extract the HTTP response when it comes in so we can run tests on it
        //We can also manipulate the response this way. See later tests ;)
        cy.intercept("GET", "http://localhost:8080/mail").as("getInbox"); 

        //make sure the GET request came back as a 200. Note the "getInbox" alias defined above
        cy.wait("@getInbox").its("response.statusCode").should("eq", 200);
    
        //Check that the inbox elemnts display as expected - two ways to do it
        cy.get("table").should("exist");
        cy.contains("Subject").should("exist");

        //Test that the first row looks like what we expect (for every tr in the tbody, make sure their tds aren't empty)
        cy.get("tbody tr").first().within(() => {
            cy.get("td").eq(0).should("not.be.empty"); //subject
            cy.get("td").eq(1).should("not.be.empty"); //sender
            cy.get("td").eq(2).should("not.be.empty"); //body
          });

          //TODO: could have an if statement check if there is any mail before running the assertions

    });

    //test 2-----------
    it("shows an empty inbox message when there are no emails", () => {

        //This time, we'll manipulate the response to have an empty response body
        cy.intercept("GET", "http://localhost:8080/mail", {
        statusCode: 200,
        body: [],
        });

        //Check that the "no mail" message is there and the table isn't
        cy.contains("No mail yet. You're all caught up!").should("be.visible");
        cy.get("table").should("not.exist");
    });

    //test 3-----------
    it("fetches and displays fake mail from the fixtures/inbox.json", () => {

        //Entirely replace the response data from the GET request with our fixture
        cy.intercept('GET', '/mail', { fixture: 'inbox.json' })
  
        //Confirm the number of messages rendered
        cy.get('tbody tr').should('have.length', 3)
    
        //Check that each message displays correct content
        cy.contains('td', 'Meeting Reminder').should('exist')
        cy.contains('td', 'alice@snailmail.com').should('exist')
        cy.contains('td', 'Fixtures help us mock data, which gives us complete control over the data being tested').should('exist')
        
        cy.contains('td', 'Lunch Plans').should('exist')
        cy.contains('td', 'carol@snailmail.com').should('exist')
        cy.contains('td', 'Mocks are helpful for early UI testing when dont have an API yet...').should('exist')

        //TODO: the 3rd object in the fixture :p
    
    })

    //test 4-----------
    it("displays an error alert if the inbox fetch fails", () => {

        //Force an error after this one
        cy.intercept("GET", "/mail", {
          forceNetworkError: true, //Trigger the catch block automatically
        }).as("getInboxFail");
    
        //Stub the alert when it pops up so Cypress doesn't get interrupted
        //"Stub"? we're faking the alert so Cypress can track it without actually causing a popup
        cy.on("window:alert", cy.stub().as("alert"));
    
        //wait for @getInboxFail to return
        //Not necessary due to Cypress's automatic waiting! But it does add reliability.
        cy.wait("@getInboxFail");
    
        //Confirm alert got triggered. Note the use of the alias we defined a few lines above
        cy.get("@alert").should("have.been.calledWith", "Something went wrong trying to fetch mail");
  
        //Some debugging stategies-------------------
  
        cy.pause() //This will pause the test runner. You have to manually resume it
  
        cy.log("I'm a Cypress test log! I'll show up in the Cypress GUI")
  
    });

    //test 5-----------
    //THIS TEST WILL BE HELPFUL WHEN YOU START TESTING THE COMPOSE COMPONENT!
    it("renders the Compose component when the button is clicked", () => {
        
        //Render App.tsx
        cy.visit("http://localhost:5173");

        //Find and click the button that opens the Compose component
        cy.contains("button", "Compose Email").click();

        //Assert that the Compose component is visible - using a data attribute
        cy.get('[data-testid="compose-component"]').should("exist");

        //The last line of this test will be useful when you test the Componse.tsx ^

    });

})