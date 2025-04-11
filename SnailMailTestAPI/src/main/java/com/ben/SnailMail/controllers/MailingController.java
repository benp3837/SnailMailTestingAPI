package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
* This Controller is responsible for sending mail
*/

@RestController
@RequestMapping("/mailing")
@CrossOrigin
public class MailingController {

    @PostMapping
    public ResponseEntity<Mail> sendMail(@RequestBody Mail mailToSend){

        //Some basic checks to throw Exceptions on invalid mail-

        if(mailToSend.getSender() == null || mailToSend.getRecipient() == null ||
                mailToSend.getSender().isBlank() ||mailToSend.getRecipient().isBlank()){
            throw new IllegalArgumentException("Sender or recipient cannot be null");
        }

        if(mailToSend.getSubject() == null || mailToSend.getBody() == null
                || mailToSend.getSubject().isBlank() || mailToSend.getBody().isBlank()){

            System.out.println("Hi");

            throw new IllegalArgumentException("Subject or body cannot be null");
        }

        System.out.println(mailToSend);

        //If all checks pass, we can send the mail
        return ResponseEntity.status(201).body(mailToSend);

    }

    //method to send mail takes an array of email addresses and the mail in question
    //should this be a DTO? sentMailDTO?



    //Spring MVC ExceptionHandler - Super generic one to help with tests
    @ExceptionHandler
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }

}
