package com.ben.SnailMail;

import com.ben.SnailMail.models.Mail;
import com.ben.SnailMail.services.MailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


@SpringBootTest
@AutoConfigureMockMvc
class SnailMailApplicationTests {

	//Mockito setup - make a mock MailService to be used in tests
	@MockitoBean
	MailService mailService;

	//Instantiate a standalone MockMvc object to allow for mcok HTTP requests
	@Autowired
	private MockMvc mockMvc;

	//Default autogenerated test from spring boot
	@Test
	void contextLoads() {
	}

	//Our First RestAssured Test - Just makes sure the inbox behaves as expected
	@Test
	void testGetInbox() {
		//Response object from RestAssured. Let's extract the HTTP response to run tests!
		Response response = given()
				.when().get("http://localhost:8080/mail")
				.then()
				.extract().response(); //Extract the response object

			//Assert normal 200 response with content validation using JsonPath! (greaterThan, notNullValue, and more later!)
			response.then()
					.statusCode(200)
					.body("size()", greaterThan(0))
					.body("[0].sender", notNullValue())
					.body("[0].recipient", notNullValue());

	}

	//WOW! Friendship ended with JUnit, now RestAssured is my best friend
	//We can write way more readable, maintainable, and far-reaching tests with RestAssured's Response object
	//Under the hood, RestAssured still uses JUnit. It's a wrapper that makes it easier to test REST APIs


	//Let's do two tests on sending mail -
	//One that tests a successful send, and one that tests an invalid send (Green/Red tests)

	//Successful POST request
	@Test
	void testSendMailSuccess(){

		//Valid mail object
		Mail mail = new Mail("sdf", "me@snailmail.com", "you@snailmail.com", "Test", "We b testing");

		Response response = given()
				.contentType("application/json") //Do we need to specify the content type here?
				.body(mail)
				.when().post("http://localhost:8080/mail")
				.then()
				.extract().response();

		//Check the response when mail is valid - Should be a 201 with the same mail object data
		//We can easily test the response data with JsonPath!
		response.then()
				.statusCode(201)
				.body("sender", equalTo(mail.getSender()))
				.body("recipient", equalTo(mail.getRecipient()))
				.body("subject", equalTo(mail.getSubject()))
				.body("body", equalTo(mail.getBody()));

	}


	//Unsuccessful POST request (Missing Subject)
	@Test
	void testSendMailFailsOnMissingField(){

		//This one has a missing subject, so it should throw an exception
		Mail mail = new Mail("sdf", "me@snailmail.com", "you@snailmail.com", "", "We b testing");

		Response response = given()
				.contentType("application/json")
				.body(mail)
				.when().post("http://localhost:8080/mail")
				.then()
				.extract().response();

		//Check the response when mail is invalid - Should be a 400 with an error message
		//We can easily test the error response data with JsonPath's equalTo()!
		response.then()
				.statusCode(400)
				.body("message", equalTo("Subject or body cannot be null"));

	}

	//Tests using mocking--------------- Mockito and MockMVC

	//Here's a test that uses Mockito - it will let us mock method calls and return values of our choosing
	@Test
	void returnsNoContentIfInboxIsEmpty() throws Exception {

		when(mailService.getInbox()).thenReturn(null); //mock the method call, return null

		//mock the HTTP request, ensure the controller method does the right thing when service returns null
		mockMvc.perform(get("/mail"))
				.andExpect(status().isNoContent()) //Expect 204
				.andExpect(content().string(""));   //Expect no response body
	}

	@Test
	void testPostMailMocked() throws Exception {
		Mail mail = new Mail("me@snailmail.com", "you@snailmail.com", "hi", "sup");

		//note the "ArgumentMatchers.any()" which allows us to mock any Mail object values
		when(mailService.sendMail(ArgumentMatchers.any(Mail.class))).thenReturn(mail);;

		mockMvc.perform(post("/mail")
						.contentType(MediaType.APPLICATION_JSON)                         // specify JSON request
						.accept(MediaType.APPLICATION_JSON)                              // expect JSON response
						.content(new ObjectMapper().writeValueAsString(mail)))           // serialize the Mail object
				.andExpect(status().isCreated())
				.andExpect(content().string(new ObjectMapper().writeValueAsString(mail)));        // assert JSON field
	}


	//testing login, for cookies is created
	@Test
	void loginSetsSessionCookie() {
		// Define the login payload
		String loginJson = """
            {
              "username": "username",
              "password": "password"
            }
        """;

		// Send the POST request and extract the response
		Response response = given()
				.contentType("application/json")
				.body(loginJson)
				.when()
				.post("http://localhost:8080/auth/login");

		// Assert 200 OK and session cookie set
		response.then()
				.statusCode(200)
				.body("username", equalTo("username")) //Check the response body
				.cookie("JSESSIONID", notNullValue());

	}


	//a filter for logging
	@Test
	void testWithLoggingFilters() {
		given()
				.filter(new RequestLoggingFilter()) //logs the request
				.filter(new ResponseLoggingFilter()) //logs the response
				.contentType("application/json")
				.body(new Mail("sdf", "me@snailmail.com", "you@snailmail.com", "Hi", "Body"))
				.when()
				.post("http://localhost:8080/mail")
				.then()
				.statusCode(201);
	}

	//test change password works
	@Test
	void testChangePassword() {
		String changePasswordJson = """
			{
			  "oldPassword": "password",
			  "newPassword": "newpassword"
			}
		""";

		Response response = given()
				.contentType("application/json")
				.body(changePasswordJson)
				.when()
				.post("http://localhost:8080/auth/change-password");

		response.then()
				.statusCode(200)
				.body(equalTo("Password changed successfully"));
	}

	@Test
	void testChangePasswordFails() {
		String changePasswordJson = """
			{
			  "oldPassword": "wrongpassword",
			  "newPassword": "newpassword"
			}
		""";

		Response response = given()
				.contentType("application/json")
				.body(changePasswordJson)
				.when()
				.post("http://localhost:8080/auth/change-password");

		response.then()
				.statusCode(400)
				.body(equalTo("Incorrect old password"));
	}

}
