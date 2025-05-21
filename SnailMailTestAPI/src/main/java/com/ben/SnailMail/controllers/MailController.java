package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
import com.ben.SnailMail.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * This Controller is responsible for the user's mailbox (NOT the mailing system)
 */
@RestController
@RequestMapping("/mail")
@CrossOrigin
public class MailController {

    //Autowired service so the controller can use its methods
    @Autowired
    private MailService mailService;

    @GetMapping
    public ResponseEntity<List<Mail>> getInbox(){

        List<Mail> inbox = mailService.getInbox();

        if(inbox == null){
            return ResponseEntity.status(204).body(null);
        } else{
            return ResponseEntity.ok().body(inbox);
        }

    }

    @PostMapping
    public ResponseEntity<Mail> sendMail(@RequestBody Mail mailToSend){

        //Send the mail object to the service
        Mail sentMail = mailService.sendMail(mailToSend);

        //If all checks from the service pass, we can send the mail
        return ResponseEntity.status(201).body(sentMail);

    }

    //Spring MVC ExceptionHandler - Super generic one to help with tests
    @ExceptionHandler
    public ResponseEntity<Exception> handleException(Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.status(400).body(e);
    }

}
