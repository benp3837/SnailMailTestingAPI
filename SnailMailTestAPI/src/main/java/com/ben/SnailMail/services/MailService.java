package com.ben.SnailMail.services;

import com.ben.SnailMail.daos.MailDAO;
import com.ben.SnailMail.models.Mail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MailService {

    //Autowired DAO so the service can use its methods
    private MailDAO mailDAO;

    //Constructor to inject the DAO
    public MailService(MailDAO mailDAO) {
        this.mailDAO = mailDAO;
    }

    //Imagine that this method is actually getting the inbox from a database
    public List<Mail> getInbox() {

        //Call to the database in search of the inbox would go here
        return mailDAO.findAll();

//        return List.of(
//                new Mail("guy@snailmail.com", "me@snailmail.com", "Swimming?", "I like swimming"),
//                new Mail("guy@snailmail.com", "me@snailmail.com", "Beagles", "I like beagles"),
//                new Mail("gal@snailmail.com", "me@snailmail.com", "Heyooo", "I like ladybugs")
//        );
    }

    //Send mail input validation lives here now! The service usually handles all of this stuff
    public Mail sendMail(Mail mailToSend) {

        //Some basic checks to throw Exceptions on invalid mail-
        //Thrown Exceptions will get caught in the controller! (see our exception handler)

        if(mailToSend.getSender() == null || mailToSend.getRecipient() == null ||
                mailToSend.getSender().isBlank() ||mailToSend.getRecipient().isBlank()){
            throw new IllegalArgumentException("Sender or recipient cannot be null");
        }

        if(mailToSend.getSubject() == null || mailToSend.getBody() == null
                || mailToSend.getSubject().isBlank() || mailToSend.getBody().isBlank()){

            throw new IllegalArgumentException("Subject or body cannot be null");
        }

        if(mailToSend.getSubject().length() > 20){
            throw new IllegalArgumentException("Save it for the message body, bud");
        }

        //Mail would be sent to the DB here
        Mail returnedMail = mailDAO.save(mailToSend);

        //Return the valid mail object to the controller
        return returnedMail;
    }

}
