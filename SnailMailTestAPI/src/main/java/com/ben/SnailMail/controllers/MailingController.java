package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mailing")
@CrossOrigin
public class MailingController {

    @PostMapping
    public ResponseEntity<Mail> sendMail(@RequestBody Mail mailToSend){

        //Actually send the mail here...

        return ResponseEntity.status(201).body(mailToSend);

    }

    //method to send mail takes an array of email addresses and the mail in question
    //should this be a DTO? sentMailDTO?

}
