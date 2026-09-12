/* =========================================
   LIFE SIMULATOR
   REAL TIME + ADVANCED STUDY PLANNER
========================================= */


/* =========================================
   SCREENS
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
   PLAYER
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


let selectedStudyDay =
    "Saturday";


let clockStarted = false;


/* =========================================
   DAY NAMES
========================================= */

const dayNames = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


/* =========================================
   START
========================================= */

startBtn.addEventListener(
    "click",
    () => {

        startScreen.classList.add(
            "hidden"
        );

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
            Number(
                playerAgeInput.value
            );

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


        const now =
            Date.now();


        player.createdAt =
            now;

        player.lastSeen =
            now;


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
   REAL TIME
========================================= */

function startRealTime() {

    if (clockStarted)
        return;


    clockStarted = true;


    updateRealTime();


    setInterval(
        updateRealTime,
        1000
    );

}


/* =========================================
   UPDATE REAL TIME
========================================= */

function updateRealTime() {

    const now =
        new Date();


    updateClock(now);

    updateDate(now);

    updatePeriod(now);

    updateLifeDay(now);

    updateStudySystem(now);

    updateStudyCardsStatus(now);


    player.lastSeen =
        Date.now();


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

    const element =
        document.getElementById(
            "realDate"
        );


    if (!element)
        return;


    element.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* =========================================
   PERIOD
========================================= */

function updatePeriod(date) {

    const hour =
        date.getHours();


    const element =
        document.getElementById(
            "timePeriod"
        );


    if (!element)
        return;


    if (
        hour >= 5 &&
        hour < 12
    ) {

        element.textContent =
            "🌅 Morning";

    }

    else if (
        hour >= 12 &&
        hour < 17
    ) {

        element.textContent =
            "☀️ Afternoon";

    }

    else if (
        hour >= 17 &&
        hour < 21
    ) {

        element.textContent =
            "🌇 Evening";

    }

    else {

        element.textContent =
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


    const element =
        document.getElementById(
            "day"
        );


    if (element) {

        element.textContent =
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


    if (
        daysPassed === 1
    ) {

        showGameNotification(
            `🌅 A new day has begun! Day ${player.day}`
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

                    performAction(
                        button.dataset.action
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


        showGameNotification(
            `🎉 LEVEL UP! You reached Level ${player.level}!`
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


    updateStat("intelligence");

    updateStat("skills");

    updateStat("fitness");

    updateStat("happiness");

    updateStat("money");


    const xpBar =
        document.getElementById(
            "xpBar"
        );


    if (xpBar) {

        xpBar.style.width =
            `${player.xp}%`;

    }


    updateStudyProgress();

    updateStudySummary();

}


/* =========================================
   STAT
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


    if (number)
        number.textContent =
            value;


    if (bar)
        bar.style.width =
            `${value}%`;

}


/* =========================================
   ADD STUDY
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


    if (
        !start ||
        !end
    ) {

        alert(
            "Please choose the study time."
        );

        return;

    }


    if (
        start >= end
    ) {

        alert(
            "The end time must be after the start time."
        );

        return;

    }


    const session = {

        id: Date.now(),

        subject,

        day,

        start,

        end,

        goal,

        completed: false,

        missed: false,

        rewardClaimed: false

    };


    player.studySessions.push(
        session
    );


    selectedStudyDay =
        day;


    saveGame();


    clearStudyForm();

    updateSelectedDayButtons();

    renderStudyPlanner();

    updateUI();

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
   GET CURRENT SESSION
========================================= */

function getCurrentStudySession(date) {

    const today =
        dayNames[
            date.getDay()
        ];


    const currentMinutes =
        date.getHours() * 60 +
        date.getMinutes();


    return player.studySessions.find(
        session => {

            if (
                session.day !==
                today
            )
                return false;


            const start =
                timeToMinutes(
                    session.start
                );


            const end =
                timeToMinutes(
                    session.end
                );


            return (
                currentMinutes >= start &&
                currentMinutes < end &&
                !session.completed
            );

        }
    );

}


/* =========================================
   UPDATE STUDY SYSTEM
========================================= */

function updateStudySystem(date) {

    updateCurrentStudy(date);

    checkStudyReminders(date);

    markMissedSessions(date);

}


/* =========================================
   CURRENT STUDY
========================================= */

function updateCurrentStudy(date) {

    const content =
        document.getElementById(
            "currentStudyContent"
        );


    const status =
        document.getElementById(
            "currentStudyStatus"
        );


    if (!content)
        return;


    const session =
        getCurrentStudySession(
            date
        );


    if (!session) {

        status.textContent =
            "No active session";


        content.innerHTML = `

            <div class="no-current-study">

                📚

                <h3>
                    No study session right now
                </h3>

                <p>
                    Your current lesson will appear here automatically.
                </p>

            </div>

        `;

        return;

    }


    status.textContent =
        "LIVE NOW";


    const start =
        timeToMinutes(
            session.start
        );


    const end =
        timeToMinutes(
            session.end
        );


    const current =
        date.getHours() * 60 +
        date.getMinutes();


    const seconds =
        date.getSeconds();


    const totalSeconds =
        (
            end -
            start
        ) * 60;


    const elapsedSeconds =
        (
            current -
            start
        ) * 60 +
        seconds;


    const remainingSeconds =
        Math.max(
            0,
            totalSeconds -
            elapsedSeconds
        );


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                (
                    elapsedSeconds /
                    totalSeconds
                ) * 100
            )
        );


    content.innerHTML = `

        <div class="current-active">

            <div class="subject-icon">
                📚
            </div>

            <h2>
                ${escapeHTML(
                    session.subject
                )}
            </h2>

            <div class="current-time">

                ${session.start}
                -
                ${session.end}

            </div>

            <div class="countdown">

                ${formatDuration(
                    remainingSeconds
                )}

            </div>

            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width:${progress}%"
                ></div>

            </div>

            ${
                session.goal
                    ?
                `<div class="current-goal">
                    🎯 ${escapeHTML(session.goal)}
                </div>`
                    :
                ""
            }

            <br>

            <button
                class="main-btn"
                onclick="completeStudy(${session.id})"
            >
                ✓ COMPLETE SESSION
            </button>

        </div>

    `;

}


/* =========================================
   TIME TO MINUTES
========================================= */

function timeToMinutes(time) {

    const parts =
        time.split(":");


    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


/* =========================================
   FORMAT COUNTDOWN
========================================= */

function formatDuration(totalSeconds) {

    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );


    const seconds =
        totalSeconds % 60;


    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}


/* =========================================
   REMINDERS
========================================= */

let reminderCache = {};


function checkStudyReminders(date) {

    const today =
        dayNames[
            date.getDay()
        ];


    const currentTime =
        `${String(
            date.getHours()
        ).padStart(2,"0")}:${String(
            date.getMinutes()
        ).padStart(2,"0")}`;


    player.studySessions
        .filter(
            session =>
                session.day === today &&
                session.start === currentTime &&
                !session.completed &&
                !session.missed
        )
        .forEach(
            session => {

                const key =
                    `${session.id}-${date.toDateString()}`;


                if (
                    reminderCache[key]
                )
                    return;


                reminderCache[key] =
                    true;


                showGameNotification(
                    `📚 Study Time: ${session.subject}`
                );

            }
        );

}


/* =========================================
   MISSED SESSIONS
========================================= */

function markMissedSessions(date) {

    const today =
        dayNames[
            date.getDay()
        ];


    const currentMinutes =
        date.getHours() * 60 +
        date.getMinutes();


    let changed = false;


    player.studySessions.forEach(
        session => {

            if (
                session.day !== today ||
                session.completed ||
                session.missed
            )
                return;


            const end =
                timeToMinutes(
                    session.end
                );


            if (
                currentMinutes >
                end
            ) {

                session.missed =
                    true;


                changed = true;

            }

        }
    );


    if (changed) {

        saveGame();

        renderStudyPlanner();

        updateUI();

    }

}


/* =========================================
   STUDY STATUS
========================================= */

function getSessionStatus(
    session,
    date
) {

    if (
        session.completed
    ) {

        return "completed";

    }


    if (
        session.missed
    ) {

        return "missed";

    }


    const today =
        dayNames[
            date.getDay()
        ];


    if (
        session.day !== today
    ) {

        return "upcoming";

    }


    const current =
        date.getHours() * 60 +
        date.getMinutes();


    const start =
        timeToMinutes(
            session.start
        );


    const end =
        timeToMinutes(
            session.end
        );


    if (
        current >= start &&
        current < end
    ) {

        return "current";

    }


    if (
        current < start
    ) {

        return "upcoming";

    }


    return "missed";

}


/* =========================================
   UPDATE CARDS
========================================= */

function updateStudyCardsStatus(
    date
) {

    const cards =
        document.querySelectorAll(
            ".study-card"
        );


    cards.forEach(
        card => {

            const id =
                Number(
                    card.dataset.id
                );


            const session =
                player.studySessions.find(
                    item =>
                        item.id === id
                );


            if (!session)
                return;


            const status =
                getSessionStatus(
                    session,
                    date
                );


            card.classList.toggle(
                "active-session",
                status === "current"
            );


            card.classList.toggle(
                "missed",
                status === "missed"
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


    if (!list)
        return;


    const sessions =
        player.studySessions
            .filter(
                session =>
                    session.day ===
                    selectedStudyDay
            )
            .sort(
                (a,b) =>
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
                    Add a study session for
                    ${selectedStudyDay}.
                </p>

            </div>

        `;

        return;

    }


    const now =
        new Date();


    sessions.forEach(
        session => {

            const status =
                getSessionStatus(
                    session,
                    now
                );


            const card =
                document.createElement(
                    "div"
                );


            card.dataset.id =
                session.id;


            card.className =
                "study-card";


            if (
                session.completed
            ) {

                card.classList.add(
                    "completed"
                );

            }


            if (
                status === "current"
            ) {

                card.classList.add(
                    "active-session"
                );

            }


            if (
                status === "missed"
            ) {

                card.classList.add(
                    "missed"
                );

            }


            const statusText = {

                current:
                    "● LIVE",

                completed:
                    "✓ COMPLETED",

                missed:
                    "✕ MISSED",

                upcoming:
                    "UPCOMING"

            };


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


                <div class="study-status ${status}">

                    ${statusText[status]}

                </div>


                <button
                    class="study-complete"
                    data-id="${session.id}"
                    ${
                        session.completed
                        ?
                        "disabled"
                        :
                        ""
                    }
                >

                    ${
                        session.completed
                            ?
                        "✓ Done"
                            :
                        "Complete"
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
   CARD EVENTS
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

                        completeStudy(
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

function completeStudy(id) {

    const session =
        player.studySessions.find(
            item =>
                item.id === id
        );


    if (!session)
        return;


    if (
        session.completed
    )
        return;


    session.completed =
        true;


    session.missed =
        false;


    if (
        !session.rewardClaimed
    ) {

        session.rewardClaimed =
            true;


        player.intelligence =
            clamp(
                player.intelligence + 5
            );


        gainXP(25);

    }


    saveGame();


    showGameNotification(
        `📚 ${session.subject} completed! +5 Intelligence +25 XP`
    );


    updateUI();

    renderStudyPlanner();

    updateCurrentStudy(
        new Date()
    );

}


/* =========================================
   DELETE STUDY
========================================= */

function deleteStudy(id) {

    const confirmed =
        confirm(
            "Delete this study session?"
        );


    if (!confirmed)
        return;


    player.studySessions =
        player.studySessions.filter(
            session =>
                session.id !== id
        );


    saveGame();


    renderStudyPlanner();

    updateUI();

}


/* =========================================
   PROGRESS
========================================= */

function updateStudyProgress() {

    const element =
        document.getElementById(
            "studyProgress"
        );


    if (!element)
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
            completed /
            total *
            100
        );


    element.textContent =
        `${percentage}%`;

}


/* =========================================
   SUMMARY
========================================= */

function updateStudySummary() {

    const total =
        player.studySessions.length;


    const completed =
        player.studySessions.filter(
            session =>
                session.completed
        ).length;


    const missed =
        player.studySessions.filter(
            session =>
                session.missed &&
                !session.completed
        ).length;


    const remaining =
        total -
        completed -
        missed;


    document.getElementById(
        "totalSessions"
    ).textContent =
        total;


    document.getElementById(
        "completedSessions"
    ).textContent =
        completed;


    document.getElementById(
        "missedSessions"
    ).textContent =
        missed;


    document.getElementById(
        "remainingSessions"
    ).textContent =
        remaining;

}


/* =========================================
   NOTIFICATION
========================================= */

function showGameNotification(message) {

    let notification =
        document.getElementById(
            "gameNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "gameNotification";


        notification.style.position =
            "fixed";


        notification.style.right =
            "20px";


        notification.style.bottom =
            "20px";


        notification.style.zIndex =
            "9999";


        notification.style.maxWidth =
            "350px";


        notification.style.padding =
            "15px 20px";


        notification.style.background =
            "#151515";


        notification.style.color =
            "white";


        notification.style.border =
            "1px solid #ff3c00";


        notification.style.borderRadius =
            "12px";


        notification.style.boxShadow =
            "0 10px 40px rgba(0,0,0,.5)";


        notification.style.fontWeight =
            "700";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    clearTimeout(
        notification.timer
    );


    notification.timer =
        setTimeout(
            () => {

                notification.style.display =
                    "none";

            },
            4000
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


    if (!saved)
        return;


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

            player.studySessions =
                [];

        }


        player.studySessions.forEach(
            session => {

                if (
                    typeof session.missed !==
                    "boolean"
                ) {

                    session.missed =
                        false;

                }


                if (
                    typeof session.rewardClaimed !==
                    "boolean"
                ) {

                    session.rewardClaimed =
                        session.completed ||
                        false;

                }

            }
        );


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
   RESET
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
   LOAD GAME
========================================= */

loadGame();
