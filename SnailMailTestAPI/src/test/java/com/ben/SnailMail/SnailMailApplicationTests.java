package com.ben.SnailMail;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class SnailMailApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void testGetInbox() {
		//Response object from RestAssured. Lets us extract the HTTP response to run tests!
		Response response = given()
				.when().get("http://localhost:8080/mail")
				.then()
				.extract().response(); //Extract the response

		if (response.getBody().asString().isEmpty()) {
			//If the response is empty, assert that the status is 204
			//This assert() method is coming from JUnit
			assertEquals(204, response.statusCode());
		} else {
			//Otherwise, assert normal 200 response with content validation
			response.then()
					.statusCode(200)
					.body("size()", greaterThan(0))
					.body("[0].sender", notNullValue())
					.body("[0].recipient", notNullValue());
		}
	}

	//WOW! Friendship ended with JUnit, now RestAssured is my best friend
	//We can write way more readable, maintainable, and far-reaching tests with RestAssured
	//Under the hood, RestAssured still uses JUnit. It's a wrapper that makes it easier to test REST APIs

}
