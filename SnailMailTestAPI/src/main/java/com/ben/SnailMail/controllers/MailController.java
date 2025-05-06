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

        //yes, inbox will never be null since the values are hardcoded in the service
        //BUT we can use mockito to mock the service and return null
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

//    //TODO: Might not need this to get the point across...
//    @GetMapping("/sent")
//    public ResponseEntity<List<Mail>> getSentBox(){
//
//        List<Mail> inbox = List.of(
//                new Mail(1, "me@snailmail.com", "guy@snailmail.com", "Re:Swimming?", "I like swimming sorta"),
//                new Mail(2, "me@snailmail.com", "guy@snailmail.com", "Re:Beagles", "I like beagles too"),
//                new Mail(3, "me@snailmail.com", "gal@snailmail.com", "Re:Heyooo", "Gurl me too")
//        );
//
//        return ResponseEntity.ok().body(inbox);
//
//    }

