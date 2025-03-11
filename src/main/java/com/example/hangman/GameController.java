package com.example.hangman;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import java.util.Base64;
import java.nio.charset.StandardCharsets;

@RestController
public class GameController {

    private final static String[] allWords = {"Jahr", "Margarita", "Mensch", "Zeit", "Angelegenheit", "Leben", "Tag", "Hand", "Mal", "Arbeit", "Wort", "Ort", "Gesicht", "Freund", "Auge", "Frage", "Haus", "Seite", "Land", "Welt", "Fall", "Kopf",
            "Kind", "Kraft", "Ende", "Ansicht", "System", "Teil", "Stadt", "Beziehung", "Frau", "Geld", "Erde", "Auto", "Wasser", "Vater", "Problem", "Stunde", "Recht", "Fuß", "Entscheidung", "Tür", "Bild", "Geschichte", "Macht", "Gesetz", "Krieg", "Gott", "Stimme", "Tausend", "Buch", "Möglichkeit", "Ergebnis", "Nacht", "Tisch", "Name", "Bereich", "Artikel", "Zahl", "Unternehmen", "Volk", "Ehefrau", "Gruppe", "Entwicklung", "Prozess", "Gericht", "Bedingung", "Mittel", "Anfang", "Licht", "Zeit", "Weg", "Seele", "Niveau", "Form", "Verbindung", "Minute", "Straße", "Abend", "Qualität", "Gedanke", "Straße", "Mutter", "Handlung", "Monat", "Staat", "Sprache", "Liebe", "Blick", "Mama", "Jahrhundert", "Schule", "Ziel", "Gesellschaft",
            "Tätigkeit", "Organisation", "Präsident", "Zimmer", "Ordnung", "Moment", "Theater", "Brief", "Morgen", "Hilfe", "Situation", "Rolle", "Rubel", "Sinn", "Zustand", "Wohnung", "Organ", "Aufmerksamkeit", "Körper", "Arbeit", "Sohn", "Maß", "Tod", "Markt", "Programm", "Aufgabe", "Unternehmen", "Fenster", "Gespräch", "Regierung", "Familie", "Produktion", "Information", "Lage", "Zentrum", "Antwort", "Ehemann", "Autor", "Wand", "Interesse", "Föderation", "Regel", "Verwaltung", "Mann", "Idee", "Partei", "Rat", "Rechnung", "Herz", "Bewegung", "Sache", "Material", "Woche", "Gefühl", "Kapitel", "Wissenschaft",
            "Reihe", "Zeitung", "Grund", "Schulter", "Preis", "Plan", "Rede", "Punkt", "Basis", "Kamerad", "Kultur", "Daten", "Meinung", "Dokument", "Institut", "Verlauf", "Projekt", "Treffen", "Direktor", "Frist", "Finger", "Erfahrung", "Dienst", "Schicksal", "Mädchen", "Warteschlange", "Wald", "Zusammensetzung", "Mitglied", "Menge", "Ereignis", "Objekt", "Saal", "Schöpfung", "Bedeutung", "Periode", "Schritt", "Bruder"};

    private final static ArrayList<String> usedWords = new ArrayList<>();


    @GetMapping("/start")
    public String getWord(HttpSession session) {
        String chosenWord = allWords[(int) (Math.random() * allWords.length)].toUpperCase();

        while (usedWords.contains(chosenWord)) {
            chosenWord = allWords[(int) (Math.random() * allWords.length)].toUpperCase();
        }
        usedWords.add(chosenWord);

        session.setAttribute("chosenWord", chosenWord);

        int tries = 6;
        session.setAttribute("tries", tries);

        StringBuilder blanks = new StringBuilder(chosenWord.length());
        blanks.append("_".repeat(chosenWord.length()));

        session.setAttribute("blanks", blanks.toString());

        return blanks.toString().trim();
    }

    @GetMapping("/setLetter")
    public Map<String, Object> setLetter(@RequestParam(required = false) String letter,
                                         @RequestParam(required = false) Boolean hint, HttpSession session) {

        String chosenWord = (String) session.getAttribute("chosenWord");
        String blanks = (String) session.getAttribute("blanks");

        if (chosenWord == null || blanks == null) {
            return Map.of("error","Kein Wort gefunden. Starte das Spiel neu!");
        }

        String[] chosenWordSplitted = chosenWord.split("");
        String[] blanksSplitted = blanks.split("");
        boolean isCorrect = false;

        int tries = (int) session.getAttribute("tries");

        if (hint != null && hint) {
            ArrayList<Integer> indicesList = new ArrayList<>();

            boolean firstClosed = blanksSplitted[0].equals("_");
            boolean lastClosed = blanksSplitted[blanksSplitted.length-1].equals("_");


            for (int i = 0; i < chosenWordSplitted.length; i++) {
                if (chosenWordSplitted[i].equals(chosenWordSplitted[0]) || chosenWordSplitted[i].equals(chosenWordSplitted[chosenWordSplitted.length-1])) {
                    indicesList.add(i);
                }
            }

            if (firstClosed && lastClosed) {
                indicesList.add(0);
                indicesList.add(blanksSplitted.length-1);
            }
            else if (firstClosed) {
                indicesList.add(0);
            }
            else {
                indicesList.add(blanksSplitted.length-1);
            }

            blanksSplitted = getHint(chosenWordSplitted, blanksSplitted, indicesList);
            isCorrect = true;
        }

        else if (letter != null) {
            for (int i = 0; i < chosenWordSplitted.length; i++) {
                if (chosenWordSplitted[i].equals(letter)) {
                    blanksSplitted[i] = letter;
                    isCorrect = true;
                }
            }
        }

        if (!isCorrect) tries--;
        session.setAttribute("tries", tries);

        blanks = String.join("", blanksSplitted);
        session.setAttribute("blanks", blanks);

        Map<String, Object> response = new HashMap<>();

        response.put("word", blanks);
        response.put("correct", isCorrect);
        response.put("tries", tries);
        response.put("chosenWord", Base64.getEncoder().encodeToString(chosenWord.getBytes(StandardCharsets.UTF_8)));
        if (!blanks.contains("_")) response.put("win", true);

        return response;
    }

    private String[] getHint(String[] chosenWordSplitted, String[] blanksSplitted, ArrayList<Integer> indicesList) {
        for (int index : indicesList) {
            blanksSplitted[index] = chosenWordSplitted[index];
        }
        return blanksSplitted;
    }

}




