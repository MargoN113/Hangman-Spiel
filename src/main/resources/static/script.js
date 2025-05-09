function updateHangmanImage(tries) {
    const hangmanImages = [
        "Hangman_0.png",
        "Hangman_1.png",
        "Hangman_2.png",
        "Hangman_3.png",
        "Hangman_4.png",
        "Hangman_5.png",
        "Hangman_6.png"
    ];
    document.getElementById("hangman").src = hangmanImages[6 - tries];
}
function showUpdateCountersRequest() {
    //Das Overlay sollte nur erscheinen, wenn Siege > 0 && Niederlagen > 0 und es wurde in dieser Session noch nicht gezeigt
    if (!sessionStorage.getItem("counterUpdateRequestShown") && (winCount > 0 || lossCount > 0)) {
        document.getElementById("updateScoreText").innerText = "📍Dein Score📍\nSiege🎉: " + winCount + "\nNiederlagen😶‍🌫️: " + lossCount + "\n\nZurücksetzen?";
        document.getElementById("overlayUpdatingScore").style.display = "flex";
        sessionStorage.setItem("counterUpdateRequestShown", "true");

        //Zurücksetzen geklickt
        document.getElementById("updateScoreButton").addEventListener("click", function() {
             localStorage.setItem("wins", 0);
             localStorage.setItem("losses", 0);
             winCount = 0;
             lossCount = 0;
             document.getElementById("overlayUpdatingScore").style.display = "none";
        });

        //Beibehalten geklickt
        document.getElementById("keepScoreButton").addEventListener("click", function() {
            sessionStorage.setItem("counterUpdateRequestShown", "true");
            document.getElementById("overlayUpdatingScore").style.display = "none";
        });
    }
}

var winCount = parseInt(localStorage.getItem("wins")) || 0;
var lossCount = parseInt(localStorage.getItem("losses")) || 0;

//Button "Zähler zurücksetzen" angeklickt
document.getElementById("mainScreenUpdateScoreButton").addEventListener("click", function() {
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    winCount = 0;
    lossCount = 0;

    let resetMessage = document.getElementById("resetMessage");
    resetMessage.innerText = "Zurückgesetzt!";
    resetMessage.style.display = "block";
    resetMessage.classList.add("fade-out");

    setTimeout(() => {
        resetMessage.style.display = "none";
        resetMessage.classList.remove("fade-out");
    }, 3000);
});

showUpdateCountersRequest();

let selectedDifficulty = null;
const difficultyButtons = document.querySelectorAll(".difficulty");
document.getElementById("startButton").disabled = true;

//Buttons für die Auswahl des Schwierigkeitsgrades
difficultyButtons.forEach(button => {
    button.addEventListener("click", function() {
        difficultyButtons.forEach(b => b.classList.remove("active"));

        button.classList.add("active");
        selectedDifficulty = button.getAttribute("data-level");
        localStorage.setItem("selectedDifficulty", selectedDifficulty);
        startButton.disabled = false;
        startButton.classList.add("active");
    });
});

//Falls der Spieler nochmal spielt, den Schwierigkeitsgrad behalten
if (sessionStorage.getItem("changeDifficultyButtonPushed") === "false") {
    startGame(localStorage.getItem("selectedDifficulty"));
}

else {
    document.getElementById("startButton").style.display = "block";
}

document.getElementById("startButton").addEventListener("click", function() {
    localStorage.setItem("selectedDifficulty", selectedDifficulty);
    startGame(selectedDifficulty);
});

function startGame(difficulty) {
    sessionStorage.setItem("changeDifficultyButtonPushed", "true");

    //Texte den Elementen zuweisen und notwendige Komponenten ausblenden
    document.getElementById("difficultyLevels").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("gameDescription").style.display = "none";
    document.getElementById("overlayUpdatingScore").style.display = "none";
    document.getElementById("mainScreenUpdateScoreButton").style.display = "none";

    document.getElementById("difficultyInfo").innerText = "Schwierigkeitsgrad: " + difficulty;
    document.getElementById("winCounter").style.display = "block";
    document.getElementById("lossCounter").style.display = "block";
    document.getElementById("winCounter").innerText = "Siege🎉: \n" + winCount;
    document.getElementById("lossCounter").innerText = "Niederlagen😶‍🌫️: \n" + lossCount;

    //Alle nötigen Komponenten einblenden
    document.getElementById("hangman").style.display = "block";
    document.getElementById("message").style.display = "block";
    document.getElementById("hinweis").style.display = "block";
    document.getElementById("triesCounter").style.display = "block";
    document.getElementById("usedLetters").style.display = "block";
    document.getElementById("difficultyInfo").style.display = "block";
    document.getElementById("winCounter").style.display = "block";
    document.getElementById("lossCounter").style.display = "block";

    let blanksElement = document.getElementById("blanks");

    //Fetchen und Bearbeiten der Blanks
    fetch("/start")
           .then(response => response.text())
           .then(data => {
               blanksElement.innerText = data.split("").join(" ");
           })
           .catch(error => console.error("Fehler:", error));
    document.addEventListener("keydown", mainKeydownListener);
}

let enteredLetters = new Set();
let invalidSymbol = 0;
let invalidLetter = 0;
let lastErrorType = "";

//Hauptfunktion, wo analysiert wird, welcher Buchstabe eingegeben wurde, und die Anfrage an Backend geschickt wird
function mainKeydownListener(event) {
    const pressedKey = event.key.toUpperCase();

    if (/^[A-ZÄÖÜ]$/.test(pressedKey) && !enteredLetters.has(pressedKey)) {
        enteredLetters.add(pressedKey);
        invalidSymbol = 0;
        invalidLetter = 0;
        lastErrorType = "";

        document.getElementById("usedLetters").innerText += " " + pressedKey;

        fetch("setLetter?letter=" + pressedKey)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    alert(data.error);
                }
                else {
                    document.getElementById("blanks").innerHTML = data.word.split("").join(" ");
                    if (data.tries < 0) return;

                    if (data.win) {
                        showWinMessage(data.chosenWord);
                        return;
                    }

                    //Wenn ein korrekter Buchstabe eingegeben wurde
                    if (data.correct) {
                        document.getElementById("message").innerText = "Super! Gib den nächsten Buchstaben ein!";
                    }
                    else { //Wenn ein falscher Buchstabe eingegeben wurde
                        if (data.tries === 0) {
                            showLoseMessage(data.chosenWord);
                            return;
                        }

                        document.getElementById("message").innerText = "Falscher Buchstabe!";
                        updateHangmanImage(data.tries);
                        document.getElementById("triesCounter").innerText = "Leben: " + data.tries + "💖";

                        if (localStorage.getItem("selectedDifficulty") === "Normal" && data.tries === 1) {
                            handleHint(data.word); //Hint benutzen
                        }
                    }
                }
            })
            .catch(error => console.error("Error:", error));
    }
    //Wenn die Eingabe nicht korrekt war
    else if (!/^[A-ZÄÖÜ]$/.test(pressedKey)) { //Falsche Taste gedrückt
        if (lastErrorType !== "invalidKey") {
            invalidSymbol = 0;
        }
        invalidSymbol++;
        lastErrorType = "invalidKey";

        document.getElementById("message").innerText = "Beachte bitte unten den Hinweis über die Eingabe! (x" + invalidSymbol + ")";
    }
    else if (enteredLetters.has(pressedKey)) { //Schon vorhandenen Buchstaben gedrückt
        if (lastErrorType !== "repeatedLetter") {
            invalidLetter = 0;
        }
        invalidLetter++;
        lastErrorType = "repeatedLetter";

        document.getElementById("message").innerText = "Dieser Buchstabe wurde schon benutzt! (x" + invalidLetter + ")";
    }
}

//Funktion, die die Logik für den Sieg implementiert
function showWinMessage(chosenWord) {
    document.getElementById("message").innerText = "Herzlichen Glückwunsch! Du hast gewonnen!🎉";
    winCount++;
    localStorage.setItem("wins", winCount);
    showPlayAgainText(chosenWord);
}

//Funktion, die die Logik für die Niederlage implementiert
function showLoseMessage(chosenWord) {
    document.getElementById("message").innerText = "Leider hast du verloren!😲";
    document.getElementById("triesCounter").innerText = "Leben: 0💔";
    lossCount++;
    localStorage.setItem("losses", lossCount);

    document.getElementById("helpText").style.display = "none";

    showPlayAgainText(chosenWord);
}

//Funktion, die die Logik für die Text-Anzeige "Nochmal spielen?" implementiert
function showPlayAgainText(chosenWord) {
     document.removeEventListener("keydown", mainKeydownListener);

     setTimeout(() => {
            document.getElementById("word").innerText = "📍" + chosenWord + "📍";
            document.getElementById("playAgainText").style.display = "block";
            document.getElementById("overlayPlayingAgain").style.display = "flex";
            document.getElementById("restartButton").style.display = "block";
            document.getElementById("winCounter").innerText = "Siege🎉: \n" + localStorage.getItem("wins");
            document.getElementById("lossCounter").innerText = "Niederlagen😶‍🌫️: \n" + localStorage.getItem("losses");
        }, 1500);
}

//Funktion, die die Logik für einen Hinweis implementiert
function handleHint(word) {
    let hintMessage = "";
    let firstClosed = word[0] === "_";
    let lastClosed = word[word.length-1] === "_";
    let letterIndexArr = [];

    if (firstClosed && lastClosed) {
        hintMessage = "ersten und letzten";
        letterIndexArr.push(0);
        letterIndexArr.push(word.length-1);
    }
    else if (firstClosed) {
        hintMessage = "ersten";
        letterIndexArr.push(0);
    }
    else if (lastClosed) {
        hintMessage = "letzten";
        letterIndexArr.push(word.length-1);
    }
    if (firstClosed || lastClosed) {
        document.getElementById("helpText").innerText = "Du hast nur ein Leben! Willst du dir den " + hintMessage + " Buchstaben anzeigen lassen?";
        document.getElementById("helpButton").style.display = "block";


        const helpButton = document.getElementById("helpButton");
        if (!helpButton.hasEventListener) {
            helpButton.addEventListener("click", function(event) { //Wurde der Button geklickt?
                fetch("setLetter?hint=true")
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error(data.error);
                            alert(data.error);
                        }
                        else {
                            document.getElementById("blanks").innerHTML = data.word.split("").join(" ");

                            for (let i = 0; i < letterIndexArr.length; i++) {
                                enteredLetters.add(data.word[letterIndexArr[i]]);
                                document.getElementById("usedLetters").innerText += " " + data.word[letterIndexArr[i]];
                            }
                        }

                        if (!data.word.includes("_")) showWinMessage(data.chosenWord); //Falls das Wort erraten wurde
                    })
                    .catch(error => console.error("Fehler beim Abrufen der Daten:", error));

                helpButton.style.display = "none";
                document.getElementById("helpText").style.display = "none";
                document.getElementById("message").innerText = "So sieht das Wort aus!";
            });
                helpButton.hasEventListener = true;
        }

        //Falls der Button nicht geklickt, sondern ein Buchstabe eingegeben wurde, Anzeige ausblenden
        document.addEventListener("keydown", function keydownHandler(event) {
            const pressedKey = event.key.toUpperCase();
            if (/^[A-ZÄÖÜß]$/.test(pressedKey)) {
                document.getElementById("helpText").style.display = "none";
                document.getElementById("helpButton").style.display = "none";

                document.removeEventListener("keydown", keydownHandler);
            }
        });

    }
}
document.getElementById("restartButton").addEventListener("click", function() {
    sessionStorage.setItem("changeDifficultyButtonPushed", "false");
    location.reload();
    sessionStorage.setItem("counterUpdateRequestShown", "true");
});

document.getElementById("changeDifficultyButton").addEventListener("click", function() {
    sessionStorage.setItem("changeDifficultyButtonPushed", "true");
    location.reload();
    sessionStorage.setItem("counterUpdateRequestShown", "true");
});





