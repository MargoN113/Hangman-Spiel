package com.example.hangman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HangManSpringBootApplication {
	public static void main(String[] args) {
		SpringApplication.run(HangManSpringBootApplication.class, args);
	}

}
