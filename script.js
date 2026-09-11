const startScreen = document.getElementById("startScreen");
const creationScreen = document.getElementById("creationScreen");
const gameScreen = document.getElementById("gameScreen");

const startBtn = document.getElementById("startBtn");
const createBtn = document.getElementById("createBtn");

const playerNameInput = document.getElementById("playerName");
const playerAgeInput = document.getElementById("playerAge");
const playerGoalInput = document.getElementById("playerGoal");

let player = {
    name: "",
    age: 16,
    goal: "",

    day: 1,
    level: 1,
    xp: 0,

    intelligence: 50,
    skills: 50,
    fitness: 50,
    happiness: 50,
    money: 50
};


/* =========================
   START GAME
========================= */

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    creationScreen.classList.remove("hidden");
});


/* =========================
   CREATE CHARACTER
========================= */

createBtn.addEventListener("click", () => {

    const name = playerNameInput.value.trim();
    const age = Number(playerAgeInput.value);
    const goal = playerGoalInput.value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!age || age < 13 || age > 100) {
        alert("Please enter a valid age.");
        return;
    }

    if (!goal) {
        alert("Choose your main goal.");
        return;
    }

    player.name = name;
    player.age = age;
    player.goal = goal;

    saveGame();

    creationScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    updateUI();
});


/* =========================
   ACTION BUTTONS
========================= */

document.querySelectorAll(".action").forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        performAction(action);
    });

});


/* =========================
   PERFORM ACTION
========================= */

function performAction(action) {

    switch (action) {

        case "study":

            player.intelligence += 10;
            player.happiness -= 2;

            break;


        case "coding":

            player.skills += 10;
            player.happiness -= 1;

            break;


        case "football":

            player.fitness += 10;
            player.happiness += 3;

            break;


        case "gaming":

            player.happiness += 10;
            player.skills += 2;

            break;
    }


    /* Keep stats between 0 and 100 */

    player.intelligence = clamp(player.intelligence);
    player.skills = clamp(player.skills);
    player.fitness = clamp(player.fitness);
    player.happiness = clamp(player.happiness);
    player.money = clamp(player.money);


    /* Give XP */

    gainXP(20);


    /* Move to next day */

    nextDay();


    /* Save progress */

    saveGame();


    /* Update screen */

    updateUI();
}


/* =========================
   XP SYSTEM
========================= */

function gainXP(amount) {

    player.xp += amount;


    if (player.xp >= 100) {

        player.xp -= 100;

        player.level++;

        alert(
            `🎉 LEVEL UP!\n\nYou reached Level ${player.level}!`
        );
    }
}


/* =========================
   DAY SYSTEM
========================= */

function nextDay() {

    player.day++;

    randomEvent();
}


/* =========================
   RANDOM EVENTS
========================= */

function randomEvent() {

    const chance = Math.random();


    /* 25% chance */

    if (chance <= 0.75) {
        return;
    }


    const events = [

        {
            text: "⚡ You discovered a new opportunity!",
            money: 10
        },

        {
            text: "🎁 Someone gave you a small reward!",
            money: 15
        },

        {
            text: "📚 You found a useful learning resource!",
            intelligence: 5
        },

        {
            text: "⚽ You had an amazing training session!",
            fitness: 5
        },

        {
            text: "💡 You got a brilliant idea!",
            skills: 5
        }

    ];


    const event =
        events[Math.floor(Math.random() * events.length)];


    alert(event.text);


    if (event.money) {
        player.money += event.money;
    }


    if (event.intelligence) {
        player.intelligence += event.intelligence;
    }


    if (event.fitness) {
        player.fitness += event.fitness;
    }


    if (event.skills) {
        player.skills += event.skills;
    }


    /* Keep values valid */

    player.intelligence = clamp(player.intelligence);
    player.skills = clamp(player.skills);
    player.fitness = clamp(player.fitness);
    player.happiness = clamp(player.happiness);
    player.money = clamp(player.money);
}


/* =========================
   UPDATE UI
========================= */

function updateUI() {

    document.getElementById("displayName").textContent =
        player.name.toUpperCase();


    document.getElementById("level").textContent =
        player.level;


    document.getElementById("day").textContent =
        player.day;


    document.getElementById("xp").textContent =
        player.xp;


    updateStat("intelligence");

    updateStat("skills");

    updateStat("fitness");

    updateStat("happiness");

    updateStat("money");


    document.getElementById("xpBar").style.width =
        `${player.xp}%`;
}


/* =========================
   UPDATE STAT
========================= */

function updateStat(stat) {

    const value = player[stat];


    document.getElementById(stat).textContent =
        value;


    document.getElementById(`${stat}Bar`).style.width =
        `${value}%`;
}


/* =========================
   SAVE GAME
========================= */

function saveGame() {

    localStorage.setItem(
        "lifeSimulatorSave",
        JSON.stringify(player)
    );
}


/* =========================
   LOAD GAME
========================= */

function loadGame() {

    const saved =
        localStorage.getItem("lifeSimulatorSave");


    if (!saved) {
        return;
    }


    try {

        player = JSON.parse(saved);


        startScreen.classList.add("hidden");

        creationScreen.classList.add("hidden");

        gameScreen.classList.remove("hidden");


        updateUI();

    } catch (error) {

        console.error(
            "Save data is corrupted.",
            error
        );

        localStorage.removeItem(
            "lifeSimulatorSave"
        );
    }
}


/* =========================
   RESET GAME
========================= */

function resetGame() {

    const confirmReset =
        confirm(
            "Are you sure you want to delete your life?"
        );


    if (!confirmReset) {
        return;
    }


    localStorage.removeItem(
        "lifeSimulatorSave"
    );


    location.reload();
}


/* =========================
   CLAMP VALUE
========================= */

function clamp(value) {

    return Math.max(
        0,
        Math.min(100, value)
    );
}


/* =========================
   LOAD SAVED GAME
========================= */

loadGame();
