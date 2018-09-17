let isGameActive = true;

/* Character base type */

function Character(options) {
    this.name = options.name,
    this.health = options.health,
    this.attackingForce = options.attackingForce;
    this.healingRate = options.healingRate;
    this.friendsList = [];
}

Character.prototype.attack = function(target) {
    const forceOfThisAttack = Math.random() * this.attackingForce;
    target.health -= forceOfThisAttack;
    return `${forceOfThisAttack} damage dealt!`;
}

/* Hero -- subtype of Character */

function Hero(options) {
    Character.call(this, options);
    this.friendliness = options.friendliness;
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.befriend = function(target) {
    const targetFriendliness = target.friendliness || 0;
    if (this.friendliness * Math.random() + targetFriendliness * Math.random() >3.5) {
        this.friendsList.push(target);
        target.friendsList.push(this);
        return `Whoa!  ${this.name} and ${target.name} are friends now!`;
    } else {
        return `That didn't go well... ${target.name} told ${this.name} to f*** off!`;
    }
}

Hero.prototype.heal = function() {
    const forceOfThisHealing = Math.random() * this.healingRate;
    this.health += forceOfThisHealing; 
    return `${forceOfThisHealing} healing!`;
}

/* Monster -- subtype of Character */

function Monster(options) {
    Character.call(this, options);
    this.wrathFactor = options.wrathFactor;
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.doubleAttack = function(target) {
    const forceOfThisAttack = Math.random() * this.attackingForce * this.wrathFactor;
    target.health -= forceOfThisAttack;
    let damageTaken = 0;
    if (target.health > 0) {
        damageTaken = Math.random() * target.attackingForce;
        this.health -= damageTaken;
    }
    return `Reckless Assault!  ${forceOfThisAttack} damage dealt, but ${damageTaken} damage taken!`; 
}

const you = new Hero({name: 'You', health: 10, attackingForce: 3, healingRate: 3, friendliness: 5});

const monster = new Monster({name: 'The Monster', health: 6, attackingForce: 5, healingRate: 2, wrathFactor: 1.6});

document.getElementById("attack").addEventListener('click', function () {
    updateYourMove("You attack! " + you.attack(monster));
    handleOpponentsTurn();
});

document.getElementById("heal").addEventListener("click", function () {
    updateYourMove("You heal yourself.  " + you.heal());
    handleOpponentsTurn(); 
});

document.getElementById("make-friends").addEventListener('click', function () {
    updateYourMove("You try to make friends. " + you.befriend(monster));
    handleOpponentsTurn(); 
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
    const actionChoice = Math.floor(Math.random() * 2);
    let resultString = "";
    if (actionChoice === 0) {
        resultString = `${monster.name} attacks! 
        ${monster.attack(you)}`;
    } else if (actionChoice === 1) {
        resultString = `${monster.name} risks itself to destroy you.  ${monster.doubleAttack(you)}`;
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

    opponentHealth.innerText = monster.health;
    opponentAttackingForce.innerText = monster.attackingForce;
    opponentHealingRate.innerText = monster.healingRate;
    opponentFriendliness.innerText = monster.friendliness || 0;

    opponentMove.innerText = resultString;
}

function checkGame() {
    const endNode = document.getElementById("game-over");
    if (monster.friendsList.length > 0) {
        isGameActive = false;
        endNode.innerText = "Game Over.  Everyone is friends!";
    } else if (monster.health <= 0) {
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