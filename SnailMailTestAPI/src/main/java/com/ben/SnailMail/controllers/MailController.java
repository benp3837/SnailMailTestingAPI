package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
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

    @GetMapping
    public ResponseEntity<List<Mail>> getInbox(){

        List<Mail> inbox = List.of(
                new Mail(1, "guy@snailmail.com", "me@snailmail.com", "Swimming?", "I like swimming"),
                new Mail(2, "guy@snailmail.com", "me@snailmail.com", "Beagles", "I like beagles"),
                new Mail(3, "gal@snailmail.com", "me@snailmail.com", "Heyooo", "I like ladybugs")
        );

        return ResponseEntity.ok().body(inbox);

    }

    @PostMapping
    public ResponseEntity<Mail> sendMail(@RequestBody Mail mailToSend){

        //Some basic checks to throw Exceptions on invalid mail-

        if(mailToSend.getSender() == null || mailToSend.getRecipient() == null ||
                mailToSend.getSender().isBlank() ||mailToSend.getRecipient().isBlank()){
            throw new IllegalArgumentException("Sender or recipient cannot be null");
        }

        if(mailToSend.getSubject() == null || mailToSend.getBody() == null
                || mailToSend.getSubject().isBlank() || mailToSend.getBody().isBlank()){

            throw new IllegalArgumentException("Subject or body cannot be null");
        }

        System.out.println(mailToSend);

        //If all checks pass, we can send the mail
        return ResponseEntity.status(201).body(mailToSend);

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

