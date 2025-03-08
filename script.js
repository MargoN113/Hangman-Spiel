if (localStorage.getItem("isPlayingAgain") === "true") {
    startGame();
}
else {
    document.getElementById("startButton").style.display = "block";
}

document.getElementById("startButton").addEventListener("click", function() {
    startGame();
});

function startGame() {
    document.getElementById("startButton").style.display = "none";
    localStorage.setItem("isPlayingAgain", "false");

    document.getElementById("hangman").style.display = "block";
    document.getElementById("message").style.display = "block";
    document.getElementById("hinweis").style.display = "block";
    document.getElementById("triesCounter").style.display = "block";
    document.getElementById("usedLetters").style.display = "block";

    let blanksElement = document.getElementById("blanks");

    fetch("/start")
           .then(response => response.text())
           .then(data => {
               let blanks = data.split(":")[1];
               let formattedBlanks = blanks.split("").join(" ");

               blanksElement.innerText = formattedBlanks;
               console.log(data);
           })
           .catch(error => console.error("Fehler:", error));
}


function updateHangmanImage(tries) {
    const hangmanImages = [
        "Hangman_0.drawio_1.png",
        "Hangman_1.png",
        "Hangman_2.drawio_1.png",
        "Hangman_3.drawio_1.png",
        "Hangman_4.drawio_1.png",
        "Hangman_5.drawio_1.png",
        "Hangman_6.drawio_1.png"
    ];
    document.getElementById("hangman").src = hangmanImages[6 - tries];
}

let enteredLetters = new Set();

document.addEventListener("keydown", function(event) {
    const pressedKey = event.key.toUpperCase();
    if (/^[A-ZÄÖÜß]$/.test(pressedKey) && !enteredLetters.has(pressedKey)) {
        enteredLetters.add(pressedKey);

        document.getElementById("usedLetters").innerText += " " + pressedKey;

        fetch("/checkLetter?letter=" + pressedKey)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    alert(data.error);
                }
                else {
                    document.getElementById("blanks").innerHTML = data.word.split("").join(" ");

                    if (data.win) {
                        document.getElementById("message").innerText = "Herzlichen Glückwunsch! Du hast gewonnen!🎉";
                        document.removeEventListener("keydown", arguments.callee);

                        setTimeout(() => {
                                document.getElementById("playAgainText").style.display = "block";
                                document.getElementById("overlay").style.display = "flex";
                                document.getElementById("restartButton").style.display = "block";
                            }, 1700);

                        return;
                    }

                    if (data.correct) {
                        document.getElementById("message").innerText = "Super! Gib den nächsten Buchstaben ein!";
                    }
                    else {
                        document.getElementById("message").innerText = "Falscher Buchstabe!";
                        updateHangmanImage(data.tries);
                        document.getElementById("triesCounter").innerText = "Leben: " + data.tries + "💖";

                        if (data.tries === 0) {
                            document.getElementById("message").innerText = "Leider hast du verloren!😲";
                            document.getElementById("triesCounter").innerText = "Leben: " + data.tries + "💔";
                            document.removeEventListener("keydown", arguments.callee);

                            document.getElementById("word").innerHTML = "Das Wort war:&nbsp;&nbsp;" + data.chosenWord;

                            setTimeout(() => {
                                    document.getElementById("playAgainText").style.display = "block";
                                    document.getElementById("overlay").style.display = "flex";
                                    document.getElementById("restartButton").style.display = "block";
                                }, 2600);
                            return;
                        }
                    }
                }
            })
            .catch(error => console.error("Error:", error));
    }
    else if (!/^[A-ZÄÖÜß]$/.test(pressedKey)) {
        document.getElementById("message").innerText = "Beachte bitte den Hinweis über die Eingabe!";
    }
    else {
        document.getElementById("message").innerText = "Dieser Buchstabe wurde schon benutzt!";
    }
});

document.getElementById("restartButton").addEventListener("click", function() {
    localStorage.setItem("isPlayingAgain", "true");
    location.reload();
});

