package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mail")
@CrossOrigin
public class MailController {

    @GetMapping
    public ResponseEntity<List<Mail>> getInbox(){

        List<Mail> inbox = List.of(
                new Mail(1, "guy@snailmail.com", "me@snailmail.com", "Swimming?", "I like swimming"),
                new Mail(2, "guy@snailmail.com", "me@snailmail.com", "Beagles", "I like beagles"),
                new Mail(3, "gal@snailmail.com", "me@snailmail.com", "Heyooo", "I be like heyooo")
        );

        return ResponseEntity.ok().body(inbox);

    }

    @GetMapping("/sent")
    public ResponseEntity<List<Mail>> getSentBox(){

        List<Mail> inbox = List.of(
                new Mail(1, "me@snailmail.com", "guy@snailmail.com", "Re:Swimming?", "I like swimming sorta"),
                new Mail(2, "me@snailmail.com", "guy@snailmail.com", "Re:Beagles", "I like beagles too"),
                new Mail(3, "me@snailmail.com", "gal@snailmail.com", "Re:Heyooo", "Gurl me too")
        );

        return ResponseEntity.ok().body(inbox);

    }

    //TODO: should I have filtering and stuff in the backend or the frontend?

}
