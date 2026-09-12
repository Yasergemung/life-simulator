/* =========================================
   LIFE SIMULATOR
   REAL TIME + STUDY PLANNER
========================================= */


/* =========================================
   SCREEN ELEMENTS
========================================= */

const startScreen =
    document.getElementById("startScreen");

const creationScreen =
    document.getElementById("creationScreen");

const gameScreen =
    document.getElementById("gameScreen");


const startBtn =
    document.getElementById("startBtn");

const createBtn =
    document.getElementById("createBtn");


const playerNameInput =
    document.getElementById("playerName");

const playerAgeInput =
    document.getElementById("playerAge");

const playerGoalInput =
    document.getElementById("playerGoal");


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

    createdAt: null,

    lastSeen: null,

    studySessions: []

};


/* =========================================
   SELECTED STUDY DAY
========================================= */

let selectedStudyDay = "Saturday";

let clockStarted = false;


/* =========================================
   START GAME
========================================= */

startBtn.addEventListener(
    "click",
    () => {

        startScreen.classList.add("hidden");

        creationScreen.classList.remove(
            "hidden"
        );

    }
);


/* =========================================
   CREATE CHARACTER
========================================= */

createBtn.addEventListener(
    "click",
    () => {

        const name =
            playerNameInput.value.trim();

        const age =
            Number(playerAgeInput.value);

        const goal =
            playerGoalInput.value;


        if (!name) {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (
            !age ||
            age < 13 ||
            age > 100
        ) {

            alert(
                "Please enter a valid age."
            );

            return;

        }


        if (!goal) {

            alert(
                "Choose your main goal."
            );

            return;

        }


        player.name = name;

        player.age = age;

        player.goal = goal;


        const now = Date.now();

        player.createdAt = now;

        player.lastSeen = now;


        saveGame();


        creationScreen.classList.add(
            "hidden"
        );

        gameScreen.classList.remove(
            "hidden"
        );


        updateUI();

        renderStudyPlanner();

        startRealTime();

    }
);


/* =========================================
   REAL TIME SYSTEM
========================================= */

function startRealTime() {

    if (clockStarted) return;

    clockStarted = true;

    updateRealTime();

    setInterval(
        updateRealTime,
        1000
    );

}


function updateRealTime() {

    const now = new Date();

    updateClock(now);

    updateDate(now);

    updatePeriod(now);

    updateLifeDay(now);

    checkStudyReminders(now);

    player.lastSeen = Date.now();

    saveGame();

}


/* =========================================
   CLOCK
========================================= */

function updateClock(date) {

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    const clock =
        document.getElementById(
            "realTime"
        );


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
        document.getElementById(
            "realDate"
        );


    if (!dateElement) return;


    const formatted =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    dateElement.textContent =
        formatted;

}


/* =========================================
   TIME PERIOD
========================================= */

function updatePeriod(date) {

    const hour =
        date.getHours();


    const period =
        document.getElementById(
            "timePeriod"
        );


    if (!period) return;


    if (
        hour >= 5 &&
        hour < 12
    ) {

        period.textContent =
            "🌅 Morning";

    }

    else if (
        hour >= 12 &&
        hour < 17
    ) {

        period.textContent =
            "☀️ Afternoon";

    }

    else if (
        hour >= 17 &&
        hour < 21
    ) {

        period.textContent =
            "🌇 Evening";

    }

    else {

        period.textContent =
            "🌙 Night";

    }

}


/* =========================================
   LIFE DAY
========================================= */

function updateLifeDay(now) {

    if (!player.createdAt)
        return;


    const millisecondsPerDay =
        24 *
        60 *
        60 *
        1000;


    const elapsed =
        now -
        player.createdAt;


    const realDays =
        Math.floor(
            elapsed /
            millisecondsPerDay
        );


    const newDay =
        realDays + 1;


    if (
        newDay >
        player.day
    ) {

        const daysPassed =
            newDay -
            player.day;


        player.day =
            newDay;


        onNewDay(
            daysPassed
        );

    }


    const dayElement =
        document.getElementById(
            "day"
        );


    if (dayElement) {

        dayElement.textContent =
            player.day;

    }

}


/* =========================================
   NEW DAY
========================================= */

function onNewDay(daysPassed) {

    gainXP(
        daysPassed * 10
    );


    player.happiness =
        clamp(
            player.happiness + 1
        );


    saveGame();


    if (daysPassed === 1) {

        alert(
            `🌅 A new day has begun!\n\nDAY ${player.day}`
        );

    }

}


/* =========================================
   BASIC ACTIONS
========================================= */

document
    .querySelectorAll(".action")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;


                    performAction(
                        action
                    );

                }
            );

        }
    );


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
        clamp(
            player.intelligence
        );


    player.skills =
        clamp(
            player.skills
        );


    player.fitness =
        clamp(
            player.fitness
        );


    player.happiness =
        clamp(
            player.happiness
        );


    player.money =
        clamp(
            player.money
        );


    gainXP(20);

    saveGame();

    updateUI();

}


/* =========================================
   XP
========================================= */

function gainXP(amount) {

    player.xp += amount;


    while (
        player.xp >= 100
    ) {

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
        document.getElementById(
            "displayName"
        );


    if (nameElement) {

        nameElement.textContent =
            player.name.toUpperCase();

    }


    const levelElement =
        document.getElementById(
            "level"
        );


    if (levelElement) {

        levelElement.textContent =
            player.level;

    }


    const dayElement =
        document.getElementById(
            "day"
        );


    if (dayElement) {

        dayElement.textContent =
            player.day;

    }


    const xpElement =
        document.getElementById(
            "xp"
        );


    if (xpElement) {

        xpElement.textContent =
            player.xp;

    }


    updateStat(
        "intelligence"
    );

    updateStat(
        "skills"
    );

    updateStat(
        "fitness"
    );

    updateStat(
        "happiness"
    );

    updateStat(
        "money"
    );


    const xpBar =
        document.getElementById(
            "xpBar"
        );


    if (xpBar) {

        xpBar.style.width =
            `${player.xp}%`;

    }


    updateStudyProgress();

}


/* =========================================
   UPDATE STAT
========================================= */

function updateStat(stat) {

    const value =
        player[stat];


    const number =
        document.getElementById(
            stat
        );


    const bar =
        document.getElementById(
            `${stat}Bar`
        );


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
   STUDY PLANNER
========================================= */


/*
   Study session format:

   {
       id: number,
       subject: string,
       day: string,
       start: string,
       end: string,
       goal: string,
       completed: boolean
   }
*/


/* =========================================
   ADD STUDY SESSION
========================================= */

const addStudyBtn =
    document.getElementById(
        "addStudyBtn"
    );


addStudyBtn.addEventListener(
    "click",
    addStudySession
);


function addStudySession() {

    const subject =
        document
            .getElementById(
                "subjectInput"
            )
            .value
            .trim();


    const day =
        document.getElementById(
            "studyDay"
        ).value;


    const start =
        document.getElementById(
            "studyStart"
        ).value;


    const end =
        document.getElementById(
            "studyEnd"
        ).value;


    const goal =
        document
            .getElementById(
                "studyGoal"
            )
            .value
            .trim();


    if (!subject) {

        alert(
            "Please enter a subject."
        );

        return;

    }


    if (!start || !end) {

        alert(
            "Please choose the study time."
        );

        return;

    }


    if (start >= end) {

        alert(
            "The end time must be after the start time."
        );

        return;

    }


    const session = {

        id: Date.now(),

        subject: subject,

        day: day,

        start: start,

        end: end,

        goal: goal,

        completed: false

    };


    player.studySessions.push(
        session
    );


    saveGame();


    clearStudyForm();


    selectedStudyDay =
        day;


    updateSelectedDayButtons();

    renderStudyPlanner();

    updateStudyProgress();

}


/* =========================================
   CLEAR FORM
========================================= */

function clearStudyForm() {

    document.getElementById(
        "subjectInput"
    ).value = "";


    document.getElementById(
        "studyStart"
    ).value = "";


    document.getElementById(
        "studyEnd"
    ).value = "";


    document.getElementById(
        "studyGoal"
    ).value = "";

}


/* =========================================
   SELECT DAY
========================================= */

document
    .querySelectorAll(".week-day")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedStudyDay =
                        button.dataset.day;


                    updateSelectedDayButtons();

                    renderStudyPlanner();

                }
            );

        }
    );


function updateSelectedDayButtons() {

    document
        .querySelectorAll(".week-day")
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.day ===
                    selectedStudyDay
                );

            }
        );

}


/* =========================================
   RENDER STUDY PLANNER
========================================= */

function renderStudyPlanner() {

    const list =
        document.getElementById(
            "studyList"
        );


    if (!list) return;


    const sessions =
        player.studySessions
            .filter(
                session =>
                    session.day ===
                    selectedStudyDay
            )
            .sort(
                (a, b) =>
                    a.start.localeCompare(
                        b.start
                    )
            );


    list.innerHTML = "";


    if (
        sessions.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-study">

                📖

                <h3>
                    No study sessions yet
                </h3>

                <p>
                    Add a study session for ${selectedStudyDay}.
                </p>

            </div>

        `;

        return;

    }


    sessions.forEach(
        session => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "study-card";


            if (
                session.completed
            ) {

                card.classList.add(
                    "completed"
                );

            }


            card.innerHTML = `

                <div class="study-time">

                    ${session.start}
                    -
                    ${session.end}

                </div>


                <div class="study-info">

                    <h3>
                        ${escapeHTML(
                            session.subject
                        )}
                    </h3>

                    ${
                        session.goal
                            ?
                        `<p>
                            🎯 ${escapeHTML(
                                session.goal
                            )}
                        </p>`
                            :
                        `<p>
                            Study session
                        </p>`
                    }

                </div>


                <button
                    class="study-complete"
                    data-id="${session.id}"
                >

                    ${
                        session.completed
                            ?
                        "✓ Completed"
                            :
                        "✓ Complete"
                    }

                </button>


                <button
                    class="delete-study"
                    data-id="${session.id}"
                    title="Delete"
                >

                    🗑

                </button>

            `;


            list.appendChild(
                card
            );

        }
    );


    addStudyCardEvents();

}


/* =========================================
   STUDY CARD EVENTS
========================================= */

function addStudyCardEvents() {

    document
        .querySelectorAll(
            ".study-complete"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleStudy(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".delete-study"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteStudy(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );

}


/* =========================================
   COMPLETE STUDY
========================================= */

function toggleStudy(id) {

    const session =
        player.studySessions.find(
            item =>
                item.id === id
        );


    if (!session) return;


    session.completed =
        !session.completed;


    if (session.completed) {

        /*
            Completing a study session
            gives XP and Intelligence.
        */

        player.intelligence =
            clamp(
                player.intelligence + 5
            );


        gainXP(25);

    }


    saveGame();

    updateUI();

    renderStudyPlanner();

}


/* =========================================
   DELETE STUDY
========================================= */

function deleteStudy(id) {

    const confirmed =
        confirm(
            "Delete this study session?"
        );


    if (!confirmed) return;


    player.studySessions =
        player.studySessions.filter(
            session =>
                session.id !== id
        );


    saveGame();

    renderStudyPlanner();

    updateStudyProgress();

}


/* =========================================
   STUDY PROGRESS
========================================= */

function updateStudyProgress() {

    const progressElement =
        document.getElementById(
            "studyProgress"
        );


    if (!progressElement)
        return;


    const total =
        player.studySessions.length;


    const completed =
        player.studySessions.filter(
            session =>
                session.completed
        ).length;


    const percentage =
        total === 0
            ?
        0
            :
        Math.round(
            (completed / total) *
            100
        );


    progressElement.textContent =
        `${percentage}%`;

}


/* =========================================
   STUDY REMINDERS
========================================= */

let reminderCache = {};


function checkStudyReminders(date) {

    if (
        !player.studySessions ||
        player.studySessions.length === 0
    ) {

        return;

    }


    const days = [

        "Sunday",

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday",

        "Saturday"

    ];


    const today =
        days[
            date.getDay()
        ];


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    const currentTime =
        `${hours}:${minutes}`;


    player.studySessions
        .filter(
            session =>
                session.day === today &&
                session.start === currentTime &&
                !session.completed
        )
        .forEach(
            session => {

                const key =
                    `${session.id}-${today}-${currentTime}`;


                if (
                    reminderCache[key]
                ) {

                    return;

                }


                reminderCache[key] =
                    true;


                alert(
                    `📚 Study Time!\n\n${session.subject}\n${session.start} - ${session.end}`
                );

            }
        );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================================
   SAVE GAME
========================================= */

function saveGame() {

    localStorage.setItem(
        "lifeSimulatorSave",
        JSON.stringify(player)
    );

}


/* =========================================
   LOAD GAME
========================================= */

function loadGame() {

    const saved =
        localStorage.getItem(
            "lifeSimulatorSave"
        );


    if (!saved) return;


    try {

        player =
            JSON.parse(saved);


        /*
            Compatibility with old saves.
        */

        if (
            !Array.isArray(
                player.studySessions
            )
        ) {

            player.studySessions = [];

        }


        startScreen.classList.add(
            "hidden"
        );


        creationScreen.classList.add(
            "hidden"
        );


        gameScreen.classList.remove(
            "hidden"
        );


        updateUI();

        renderStudyPlanner();

        startRealTime();

    }

    catch (error) {

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
   RESET GAME
========================================= */

function resetGame() {

    const confirmed =
        confirm(
            "Are you sure you want to start a new life?"
        );


    if (!confirmed)
        return;


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
        Math.min(
            100,
            value
        )
    );

}


/* =========================================
   START
========================================= */

loadGame();
