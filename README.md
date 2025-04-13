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
- Möglichkeit, die Länge der Wörter auszuwählen
- Die Web-App für mobile Geräte optimieren
- Audio-Effekte hinzufügen
- Benutzerfreundlichkeit verbessern (Möglichkeit, die Zähler jederzeit zurückzusetzen; Nachrichten, die den Vorgang für den User bestätigen etc.) -> ✅
- Siege und Niederlagen in der Session zählen -> ✅
- Sicherheit verbessern (das Wort wird nicht nach außen sichtbar) -> ✅

## Beispiele
![image](https://github.com/user-attachments/assets/30ce9d67-6c86-41f7-8915-b137c26dc512)
![image](https://github.com/user-attachments/assets/f1f29d91-6440-42cc-9b95-de55fc5221c7)
![image](https://github.com/user-attachments/assets/4f3dedff-25ab-43b4-a335-0a77e16e4856)
![image](https://github.com/user-attachments/assets/e0486925-e11d-447b-a4dd-c2310763579d)


