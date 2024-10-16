/*
all the logic uses html ids
*/
var level = 0;
var computer_tiles = [];
var player_tiles = [];
// colors array is used when generating new tiles by referring to the index of this array. See function generateNewTile
var colors = ["green", "red", "yellow", "blue"];

//updates the h1 tag to current level
function updateLevel(level) {
    document.querySelector("h1").innerHTML = level;
}
//reset the game, clear all variables, remove event listeners
function resetGame() {
    var audio = new Audio("sounds/wrong.mp3").play();
    document.querySelector("body").classList.add("game-over");
    level = 0;
    computer_tiles = [];
    player_tiles = [];
    document.addEventListener("keydown", newGame);
    updateLevel("GAME OVER!! Press a key to start");
}
function checkPlayerTiles(button) {
    //flag variable to check loop later
    var gameOver = false;
    //add the new user input to the array
    player_tiles.push(button.id);

    //only check tiles if arrays are not empty
    if (
        computer_tiles.length > 0 &&
        player_tiles.length > 0 &&
        computer_tiles.length === player_tiles.length
    ) {
        // loop through computer tiles and break if any element does not match by setting gameOver to true
        for (var i = 0; i < computer_tiles.length; i++) {
            if (computer_tiles[i] !== player_tiles[i]) {
                gameOver = true;
                break;
            }
        }
        //if the loop didn't break that means the player clicked on the correct tiles, so generate new tile
        // add one second delay so player can see the new tile animation
        if (gameOver === false) {
            setTimeout(generateNewTile, 1000);
        }
        //if loop break reset the game immediately 
        else if (gameOver === true) {
            resetGame();
        }
    }
}
function generateNewTile() {
    var newTile = Math.floor(Math.random() * 4);
    computer_tiles.push(colors[newTile]);
    var button = document.querySelector("#" + colors[newTile]);
    buttonAnimation(button, 200);
    level++;
    updateLevel(level);
    player_tiles = [];
}
//plays the sounds based on the clicked button
function playSounds(color) {
    switch (color) {
        case "blue":
            var audio = new Audio("sounds/blue.mp3").play();
            break;
        case "green":
            var audio = new Audio("sounds/green.mp3").play();
            break;
        case "red":
            var audio = new Audio("sounds/red.mp3").play();
            break;
        case "yellow":
            var audio = new Audio("sounds/yellow.mp3").play();
            break;
    }
}
//animates the button by adding and removing "pressed" CSS class
function buttonAnimation(button) {
    button.classList.add("pressed");
    //setTimeout to create a delay between adding and removing css class
    // button object is passed to setTimeout which enables us to use that object inside anonymous function
    setTimeout(
        function (button) {
            button.classList.remove("pressed");
        },
        200,
        button
    );
}
function newGame() {
    //remove keydown event listener and gameover css class and generate new random tile, add event listeners to buttons.
    document.removeEventListener("keydown", newGame);
    document.querySelector("body").classList.remove("game-over");
    generateNewTile();
    var buttons = document.querySelectorAll(".btn");
    // add mouseup listeners after keydown event is removed to avoid bugs
    // used "click" event initially but that generated multiple events at once which messed up the player_tiles array.
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("mouseup", function (e) {
            //animate the button user click
            buttonAnimation(this);
            //plays corresponding sounds
            playSounds(this);
            //checks if clicked button is correct or incorrect
            checkPlayerTiles(this);
        });
    }
}
//only start new game after a key is pressed, not mouse clicks
document.addEventListener("keydown", newGame);
