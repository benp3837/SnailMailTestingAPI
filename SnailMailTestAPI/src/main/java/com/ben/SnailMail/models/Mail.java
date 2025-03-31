package com.ben.SnailMail.models;

import org.springframework.stereotype.Component;

@Component
public class Mail {

    private int mailId;

    private String sender;

    private String recipient;

    private String subject;

    private String body;

    public Mail() {
    }

    public Mail(int mailId, String sender, String recipient, String subject, String body) {
        this.mailId = mailId;
        this.sender = sender;
        this.recipient = recipient;
        this.subject = subject;
        this.body = body;
    }

    public Mail(String sender, String recipient, String subject, String body) {
        this.sender = sender;
        this.recipient = recipient;
        this.subject = subject;
        this.body = body;
    }

    public int getMailId() {
        return mailId;
    }

    public void setMailId(int mailId) {
        this.mailId = mailId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    @Override
    public String toString() {
        return "Mail{" +
                "mailId=" + mailId +
                ", sender='" + sender + '\'' +
                ", recipient='" + recipient + '\'' +
                ", subject='" + subject + '\'' +
                ", body='" + body + '\'' +
                '}';
    }
}
