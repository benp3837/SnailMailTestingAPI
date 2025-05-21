package com.ben.SnailMail.daos;

import com.ben.SnailMail.models.Mail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MailDAO extends MongoRepository<Mail, String> {

    //TODO: could create custom method here if findAll, findById, save, and delete aren't enough
    //But remember save() is for inserting AND updating

}