package com.ben.SnailMail;

import com.ben.SnailMail.models.Mail;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class SnailMailApplicationTests {

	@Test
	void contextLoads() {
	}

	//Our First RestAssured Test - Just makes sure the inbox behaves as expected
	@Test
	void testGetInbox() {
		//Response object from RestAssured. Let's extract the HTTP response to run tests!
		Response response = given()
				.when().get("HTTP://SOME_URL")
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
		//TODO: can I mock this object with mockito? Or maybe that's more for Classes with called methods?
		Mail mail = new Mail(1, "me@snailmail.com", "you@snailmail.com", "Test", "We b testing");

		Response response = given()
				.contentType("application/json") //Do we need to specify the content type here?
				.body(mail)
				.when().post("http://localhost:8080/mailing")
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
	void testSendMailFail(){

		//This one has a missing subject, so it should throw an exception
		Mail mail = new Mail(1, "me@snailmail.com", "you@snailmail.com", "", "We b testing");

		Response response = given()
				.contentType("application/json") //Do we need to specify the content type here?
				.body(mail)
				.when().post("http://localhost:8080/mailing")
				.then()
				.extract().response();

		//Check the response when mail is invalid - Should be a 400 with an error message
		//We can easily test the error response data with JsonPath's equalTo()!
		response.then()
				.statusCode(400)
				.body("message", equalTo("Subject or body cannot be null"));

	}



}
