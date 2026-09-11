/* =========================================
   LIFE SIMULATOR - REAL TIME SYSTEM
========================================= */

const startScreen = document.getElementById("startScreen");
const creationScreen = document.getElementById("creationScreen");
const gameScreen = document.getElementById("gameScreen");

const startBtn = document.getElementById("startBtn");
const createBtn = document.getElementById("createBtn");

const playerNameInput = document.getElementById("playerName");
const playerAgeInput = document.getElementById("playerAge");
const playerGoalInput = document.getElementById("playerGoal");


/* =========================================
   PLAYER DATA
========================================= */

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
    money: 50,

    /* Real-world timestamp */
    createdAt: null,
    lastSeen: null
};


/* =========================================
   START
========================================= */

startBtn.addEventListener("click", () => {

    startScreen.classList.add("hidden");

    creationScreen.classList.remove("hidden");

});


/* =========================================
   CREATE CHARACTER
========================================= */

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

    const now = Date.now();

    player.createdAt = now;
    player.lastSeen = now;

    saveGame();

    creationScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    updateUI();

    startRealTime();

});


/* =========================================
   REAL TIME CLOCK
========================================= */

let clockStarted = false;

function startRealTime() {

    if (clockStarted) {
        return;
    }

    clockStarted = true;

    updateRealTime();

    setInterval(updateRealTime, 1000);

}


/* =========================================
   UPDATE REAL TIME
========================================= */

function updateRealTime() {

    const now = new Date();

    updateClock(now);

    updateDate(now);

    updatePeriod(now);

    updateLifeDay(now);

    player.lastSeen = Date.now();

    saveGame();
}


/* =========================================
   CLOCK
========================================= */

function updateClock(date) {

    const hours =
        String(date.getHours()).padStart(2, "0");

    const minutes =
        String(date.getMinutes()).padStart(2, "0");

    const seconds =
        String(date.getSeconds()).padStart(2, "0");


    const clock =
        document.getElementById("realTime");

    if (clock) {

        clock.textContent =
            `${hours}:${minutes}:${seconds}`;

    }

}


/* =========================================
   DATE
========================================= */

function updateDate(date) {

    const dateElement =
        document.getElementById("realDate");

    if (!dateElement) {
        return;
    }


    const formatted =
        date.toLocaleDateString("en-US", {

            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"

        });


    dateElement.textContent = formatted;

}


/* =========================================
   TIME PERIOD
========================================= */

function updatePeriod(date) {

    const hour = date.getHours();

    const period =
        document.getElementById("timePeriod");

    if (!period) {
        return;
    }


    if (hour >= 5 && hour < 12) {

        period.textContent =
            "🌅 Morning";

    }

    else if (hour >= 12 && hour < 17) {

        period.textContent =
            "☀️ Afternoon";

    }

    else if (hour >= 17 && hour < 21) {

        period.textContent =
            "🌇 Evening";

    }

    else {

        period.textContent =
            "🌙 Night";

    }

}


/* =========================================
   REAL LIFE DAYS
========================================= */

function updateLifeDay(now) {

    if (!player.createdAt) {
        return;
    }


    const millisecondsPerDay =
        24 * 60 * 60 * 1000;


    const elapsed =
        now - player.createdAt;


    const realDays =
        Math.floor(
            elapsed / millisecondsPerDay
        );


    const newDay =
        realDays + 1;


    if (newDay > player.day) {

        const daysPassed =
            newDay - player.day;


        player.day = newDay;


        onNewDay(daysPassed);

    }


    const dayElement =
        document.getElementById("day");


    if (dayElement) {

        dayElement.textContent =
            player.day;

    }

}


/* =========================================
   NEW DAY EVENT
========================================= */

function onNewDay(daysPassed) {

    gainXP(daysPassed * 10);


    /* Small daily bonus */

    player.happiness =
        clamp(player.happiness + 1);


    saveGame();


    if (daysPassed === 1) {

        alert(
            `🌅 A new day has begun!\n\nDAY ${player.day}`
        );

    }

}


/* =========================================
   ACTION SYSTEM
========================================= */

document.querySelectorAll(".action").forEach(button => {

    button.addEventListener("click", () => {

        const action =
            button.dataset.action;

        performAction(action);

    });

});


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


    player.intelligence =
        clamp(player.intelligence);

    player.skills =
        clamp(player.skills);

    player.fitness =
        clamp(player.fitness);

    player.happiness =
        clamp(player.happiness);

    player.money =
        clamp(player.money);


    gainXP(20);

    saveGame();

    updateUI();

}


/* =========================================
   XP
========================================= */

function gainXP(amount) {

    player.xp += amount;


    while (player.xp >= 100) {

        player.xp -= 100;

        player.level++;


        alert(
            `🎉 LEVEL UP!\n\nYou reached Level ${player.level}!`
        );

    }

}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

    const nameElement =
        document.getElementById("displayName");

    if (nameElement) {

        nameElement.textContent =
            player.name.toUpperCase();

    }


    const levelElement =
        document.getElementById("level");

    if (levelElement) {

        levelElement.textContent =
            player.level;

    }


    const dayElement =
        document.getElementById("day");

    if (dayElement) {

        dayElement.textContent =
            player.day;

    }


    const xpElement =
        document.getElementById("xp");

    if (xpElement) {

        xpElement.textContent =
            player.xp;

    }


    updateStat("intelligence");
    updateStat("skills");
    updateStat("fitness");
    updateStat("happiness");
    updateStat("money");


    const xpBar =
        document.getElementById("xpBar");

    if (xpBar) {

        xpBar.style.width =
            `${player.xp}%`;

    }

}


/* =========================================
   UPDATE STAT
========================================= */

function updateStat(stat) {

    const value =
        player[stat];


    const number =
        document.getElementById(stat);

    const bar =
        document.getElementById(`${stat}Bar`);


    if (number) {

        number.textContent =
            value;

    }


    if (bar) {

        bar.style.width =
            `${value}%`;

    }

}


/* =========================================
   SAVE
========================================= */

function saveGame() {

    localStorage.setItem(

        "lifeSimulatorSave",

        JSON.stringify(player)

    );

}


/* =========================================
   LOAD
========================================= */

function loadGame() {

    const saved =
        localStorage.getItem(
            "lifeSimulatorSave"
        );


    if (!saved) {

        return;

    }


    try {

        player =
            JSON.parse(saved);


        startScreen.classList.add("hidden");

        creationScreen.classList.add("hidden");

        gameScreen.classList.remove("hidden");


        updateUI();

        startRealTime();


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


/* =========================================
   RESET
========================================= */

function resetGame() {

    const confirmed =
        confirm(
            "Are you sure you want to start a new life?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "lifeSimulatorSave"
    );


    location.reload();

}


/* =========================================
   CLAMP
========================================= */

function clamp(value) {

    return Math.max(
        0,
        Math.min(100, value)
    );

}


/* =========================================
   START
========================================= */

loadGame();
