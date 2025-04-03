package com.example.hangman;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SendRequestService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 15 * 60 * 1000)
    public void pingServer() {
        String url = "https://hangman-spiel.onrender.com";
        try {
            restTemplate.getForObject(url, String.class);
            System.out.println("Server pinged successfully!");
        } catch (Exception e) {
            System.out.println("Ping failed: " + e.getMessage());
        }
    }
}