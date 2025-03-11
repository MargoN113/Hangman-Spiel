package com.example.hangman;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        return "OK";  // Минимальный ответ, чтобы не тратить трафик
    }
}