package com.ben.SnailMail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SnailMailApplication {

	public static void main(String[] args) {
		SpringApplication.run(SnailMailApplication.class, args);
	}

}




//The curriculum has a lot of good topics usually, from core spring stuff (beans, IoC, DI) to projects/modules
//When I started, I used to do one lil demo project on each topic in isolation (here's the MVC demo, here's the Data demo)

//It was fine when it came to doing well on QC and stuff, but associates struggled to put it all together
//Around project time I would get a million debugging questions, often in those "bridge" areas between topics
//People had very interesting code in their service layers for instance, as it's typically the bridge between controller/DAO
//I remember someone doing all the data processing and validation in the controller,
//...and then just passing it to the service which would pass it to the DAO unchanged... lolol

//Nowadays, I DO still do an isolated demo for core spring stuff (showing bean wiring, IoC, DI, etc)
//but THEN, it's just a big project that covers all the topics at once, usually MVC, Data, AOP, Security
//This is great and keeps people more engaged, as I usually have them pick stuff like the theme and functionality
//It also plays great into the later front end weeks, as I'll typically attach a big React/Angular front end to it

//I think PEP is great, in general, and I 100% prefer working with PEP associates.
//But their biggest blind spot is big picture development. So these days I'm EXTRA keen on doing big projects to demo topics






