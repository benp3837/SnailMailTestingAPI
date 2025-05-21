package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.ChangePasswordDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ben.SnailMail.models.User;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    //Login (POST request)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User incomingUser, HttpSession session){

        //NOTE: we have an HttpSession coming in through parameters, implicitly included in every HTTP request
        //This will let us save a session for the logged-in-user and store their info temporarily

        //try to log in (HARDCODED!)
        if(incomingUser.getUsername().equals("username") && incomingUser.getPassword().equals("password")){

            //Imagine we checked the DB for matching username and password, and found this user
            User loggedInUser = new User("username", "me@snailmail.com", "password", "user");

            //If we get here, the login was successful - we can build up the User's session!
            session.setAttribute("username", loggedInUser.getUsername());
            //other user info from the DB would get stored here too.....

            //it's really easy to access these values with getAttribute()!
            System.out.println("User " + session.getAttribute("username") + " has logged in!");

        /* WHY store all this info in a Session?

          -It lets us store user info that can be used for checks throughout the app
            -check that the user is logged in (session != null)
            -check that a user's role is appropriate (role.equals("admin"))
            -personalize the app (use the user's name in HTTP responses to use them in the UI etc)
            -simplify and secure our URLs!
                -ex: use the stored userId in "findXByUserId" methods instead of sending it in the PATH
                -This cleans up our URLs and secures them a bit more too.
           */

            //Return the User info to the client
            return ResponseEntity.ok(loggedInUser);

        } else {
            //If the login fails, we can throw a failure message back
            return ResponseEntity.status(401).body("Invalid username or password");
        }

    }

    @PostMapping("/change-password")
    public ResponseEntity<String> logout(@RequestBody ChangePasswordDTO cpwDTO){

        if(cpwDTO.getOldPassword().equals("password")){
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(400).body("Incorrect old password");
        }

    }

}