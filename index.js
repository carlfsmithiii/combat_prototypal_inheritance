let isGameActive = true;

const Character = function ({name, health, attackingForce, healingRate, friendliness}) {
    this.name = name,
    this.health = health,
    this.attackingForce = attackingForce;
    this.healingRate = healingRate;
    this.friendliness = friendliness;
    this.friendsList = [];
}

Character.prototype.attack = function(target) {
    const forceOfThisAttack = Math.random() * this.attackingForce;
    target.health -= forceOfThisAttack;
    return `${forceOfThisAttack} damage dealt!`;
}

Character.prototype.heal = function() {
    const forceOfThisHealing = Math.random() * this.healingRate;
    this.health += forceOfThisHealing; 
    return `${forceOfThisHealing} healing!`;
}

Character.prototype.befriend = function(target) {
    if (this.friendliness * Math.random() + target.friendliness * Math.random() > 5) {
        this.friendsList.push(target);
        target.friendsList.push(this);
        return `Whoa!  ${this.name} and ${target.name} are friends now!`;
    } else {
        return `That didn't go well... ${target.name} told ${this.name} to f*** off!`;
    }
}

const you = new Character({name: 'You', health: 10, attackingForce: 3, healingRate: 3, friendliness: 5});

const opponent = new Character({name: 'The Monster', health: 6, attackingForce: 5, healingRate: 2, friendliness: 1});

document.getElementById("attack").addEventListener('click', function () {
    updateYourMove("You attack! " + you.attack(opponent));
    handleOpponentsTurn();
});

document.getElementById("heal").addEventListener("click", function () {
    updateYourMove("You heal yourself.  " + you.heal());
    handleOpponenetsTurn(); 
});

document.getElementById("make-friends").addEventListener('click', function () {
    updateYourMove("You try to make friends. " + you.befriend(opponent));
    handleOpponenetsTurn(); 
});

function handleOpponentsTurn() {
    updateOpponentMove("");
    checkGame();
    if (isGameActive) {
        opponentPlays();
        checkGame();
    }
}

function opponentPlays() {
    const actionChoice = Math.floor(Math.random() * 3);
    let resultString = "";
    if (actionChoice === 0) {
        resultString = `${opponent.name} attacks! 
        ${opponent.attack(you)}`;
    } else if (actionChoice === 1) {
        resultString = `${opponent.name} heals.  ${opponent.heal()}`;
    } else if (actionChoice === 2) {
        resultString = `${opponent.name} tries to make friends.  ${opponent.befriend(you)}`;
    }
    updateOpponentMove(resultString);
    updateYourMove();
    checkGame();
}

function updateYourMove(resultString) {
    const yourHealth = document.getElementById("your-health");
    const yourAttackingForce = document.getElementById("your-attacking-force");
    const yourHealingRate = document.getElementById("your-healing-rate");
    const yourFriendliness = document.getElementById("your-friendliness");
    const yourMove = document.getElementById("your-move");


    yourHealth.innerText = you.health;
    yourAttackingForce.innerText = you.attackingForce;
    yourHealingRate.innerText = you.healingRate;
    yourFriendliness.innerText = you.friendliness;

    if (resultString) {
        yourMove.innerText = resultString;
    }
}

function updateOpponentMove(resultString) {
    const opponentHealth = document.getElementById("their-health");
    const opponentAttackingForce = document.getElementById("their-attacking-force");
    const opponentHealingRate = document.getElementById("their-healing-rate");
    const opponentFriendliness = document.getElementById("their-friendliness");

    const opponentMove = document.getElementById("opponents-move");

    opponentHealth.innerText = opponent.health;
    opponentAttackingForce.innerText = opponent.attackingForce;
    opponentHealingRate.innerText = opponent.healingRate;
    opponentFriendliness.innerText = opponent.friendliness;

    opponentMove.innerText = resultString;
}

function checkGame() {
    const endNode = document.getElementById("game-over");
    if (opponent.friendsList.length > 0) {
        isGameActive = false;
        endNode.innerText = "Game Over.  Everyone is friends!";
    } else if (opponent.health <= 0) {
        isGameActive = false;
        endNode.innerText = "Game Over.  You killed your opponent!";
    } else if (you.health <= 0) {
        isGameActive = false;
        endNode.innerText = "Game Over.  You are dead.";
    }

    if (!isGameActive) {
        document.getElementById("attack").disabled = true;
        document.getElementById("heal").disabled = true;
        document.getElementById("make-friends").disabled = true;
    }
}

updateYourMove("");
updateOpponentMove("");