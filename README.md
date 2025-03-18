# Hangman Spiel
### Projektebschrebung: Ein klassisches Hangman Spiel, das in Java und Spring Boot entwickelt wurde, mit Unterstützung für verschiedene Schwierigkeitsgrade und einer einfachen Benutzeroberfläche.

## Benutzung
- Das Spiel ist online unter https://hangman-spiel.onrender.com/ verfügbar
## Technologien
- Frontend: HTML, CSS, JavaScript
- Backend: Java, Spring Boot
- Datenübertragung: REST API 
- Hosting: Render mit Docker

## Funktionen
- Auswahl des Schwierigkeitsgrades
- Echtzeit-Feedback zu korrekten und falschen Buchstaben und Eingaben
- Anzeige eines Hangmans, der sich mit jedem falschen Versuch weiter aufbaut
- Lokale Speicherung von Fortschritten und Schwierigkeitsgrad

## Klassen
- **HangmanSpringBootApplication** - Hauptklasse, von hier aus wird das Spiel gestartet.
- **GameController** - Enthält die ganze Spiellogik. Methode *getWord(...)* erzeugt das Wort und speichert es in der Session, Methode *setLetter(...)* setzt einen oder mehrere Buchstaben in Wort ein: Die Eingabeparameter werden analysiert und basierend darauf wird der Code ausgeführt.
- **MainController** - Sorgt dafür, dass die Startseite mit der zugehörigen HTML-Datei geladen wird.
- **WebConfig** - Zeigt Spring Boot an, welchen Pfad er verwenden soll, um auf statische Ressourcen zuzugreifen.
- **SendRequestService** - Sendet alle 15 Minuten eine HTTP-anfrage an den Server, damit er immer sofort erreichbar ist.

## To-Do
- Neuen Schwierigkeitsgrad "Leicht" hinzufügen
- Benutzerfreundlichkeit verbessern
- Siege und Niederlagen in einer Session zählen
- Evtl. mit der Datenbank verbinden
- Sicherheit verbessern -> ✅

## Beispiele
![image](https://github.com/user-attachments/assets/3fffd82e-c9f1-4ba6-9d0f-6014e8e65b61)
![image](https://github.com/user-attachments/assets/2cb3d07f-d342-458a-a3aa-41212d28d6a1)
![image](https://github.com/user-attachments/assets/7ee2d2a8-3a80-4588-9ae0-dd6e27266904)

