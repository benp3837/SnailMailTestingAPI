package com.ben.SnailMail.controllers;

import com.ben.SnailMail.models.Mail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/translate")
@CrossOrigin
public class PigController {

    @PostMapping
    public ResponseEntity<String> translate(@RequestBody String phraseToTranslate) {

        //Translate the phrase to Pig Latin
        String translatedPhrase = translateToPigLatin(phraseToTranslate);

        //If all checks from the service pass, we can send the mail
        return ResponseEntity.status(201).body(translatedPhrase);

    }

    //Pig Latin translation method
    private String translateToPigLatin(String phrase) {
        String[] words = phrase.split(" ");
        StringBuilder pigLatinPhrase = new StringBuilder();

        for (String word : words) {
            if (word.length() > 0) {
                char firstLetter = word.charAt(0);
                String pigLatinWord = word.substring(1) + firstLetter + "ay";
                pigLatinPhrase.append(pigLatinWord).append(" ");
            }
        }

        return pigLatinPhrase.toString().trim();
    }

}
