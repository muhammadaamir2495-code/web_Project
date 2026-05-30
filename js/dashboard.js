// =========================================
// dashboard.js
// SMART LEARNING PORTAL DASHBOARD
// =========================================



// =========================================
// LOGIN PROTECTION
// =========================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (!isLoggedIn) {

    window.location.href =
        "login.html";
}



// =========================================
// DOM ELEMENTS
// =========================================

const studentName =
    document.getElementById("studentName");

const greetingText =
    document.getElementById("greetingText");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const notesCount =
    document.getElementById("notesCount");

const quizCount =
    document.getElementById("quizCount");

const progressCount =
    document.getElementById("progressCount");

const attendanceCount =
    document.getElementById("attendanceCount");



// =========================================
// LOAD USER DATA
// =========================================

const loggedInUser =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );

if (loggedInUser) {

    studentName.innerHTML =
        loggedInUser.name;
}



// =========================================
// GREETING SYSTEM
// =========================================

function generateGreeting() {

    const hour =
        new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting =
            "Good Morning ☀️";

    } else if (hour < 18) {

        greeting =
            "Good Afternoon 🌤";

    } else {

        greeting =
            "Good Evening 🌙";
    }

    greetingText.innerHTML =
        `${greeting}, ${loggedInUser.name}`;
}

generateGreeting();



// =========================================
// DARK MODE SYSTEM
// =========================================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

    darkModeBtn.innerHTML =

        `
        <i class="fa-solid fa-sun"></i>
        Light Mode
        `;
}



// TOGGLE DARK MODE
darkModeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        // SAVE THEME
        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            darkModeBtn.innerHTML =

                `
                <i class="fa-solid fa-sun"></i>
                Light Mode
                `;

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );

            darkModeBtn.innerHTML =

                `
                <i class="fa-solid fa-moon"></i>
                Dark Mode
                `;
        }
    }
);



// =========================================
// LOGOUT SYSTEM
// =========================================

logoutBtn.addEventListener(
    "click",
    () => {

        // CONFIRM LOGOUT
        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );

        if (confirmLogout) {

            // REMOVE LOGIN DATA
            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "loggedInUser"
            );

            // REDIRECT
            window.location.href =
                "login.html";
        }
    }
);



// =========================================
// DASHBOARD DATA
// =========================================

const dashboardData = {

    notes: 25,

    quizzes: 12,

    progress: 89,

    attendance: 95
};



// =========================================
// COUNTER ANIMATION
// =========================================

function animateCounter(
    element,
    start,
    end,
    duration,
    suffix = ""
) {

    let startTime = null;

    function animation(currentTime) {

        if (!startTime) {

            startTime = currentTime;
        }

        const progress =
            Math.min(
                (currentTime - startTime)
                / duration,
                1
            );

        const value =
            Math.floor(
                progress *
                (end - start) + start
            );

        element.innerHTML =
            value + suffix;

        if (progress < 1) {

            requestAnimationFrame(
                animation
            );
        }
    }

    requestAnimationFrame(
        animation
    );
}



// START COUNTERS
animateCounter(
    notesCount,
    0,
    dashboardData.notes,
    2000
);

animateCounter(
    quizCount,
    0,
    dashboardData.quizzes,
    2000
);

animateCounter(
    progressCount,
    0,
    dashboardData.progress,
    2000,
    "%"
);

animateCounter(
    attendanceCount,
    0,
    dashboardData.attendance,
    2000,
    "%"
);



// =========================================
// CARD HOVER EFFECT
// =========================================

const dashboardCards =
    document.querySelectorAll(
        ".dashboard-card"
    );

dashboardCards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.style.transform =
                "translateY(-12px) scale(1.02)";
        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "translateY(0) scale(1)";
        }
    );
});



// =========================================
// NOTIFICATION SYSTEM
// =========================================

function showNotification(
    message,
    type = "success"
) {

    // CREATE DIV
    const notification =
        document.createElement("div");

    notification.className =

        `
        alert alert-${type}
        notification-toast
        `;

    notification.innerHTML =

        `
        <strong>Notification:</strong>
        ${message}
        `;

    document.body.appendChild(
        notification
    );

    // SHOW ANIMATION
    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 100);

    // REMOVE
    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

        setTimeout(() => {

            notification.remove();

        }, 500);

    }, 4000);
}



// WELCOME MESSAGE
setTimeout(() => {

    showNotification(
        `Welcome back ${loggedInUser.name}!`
    );

}, 1000);



// =========================================
// REAL TIME CLOCK
// =========================================

const clockElement =
    document.createElement("div");

clockElement.classList.add(
    "live-clock"
);

document.querySelector(
    ".dashboard-header"
).appendChild(clockElement);

function updateClock() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString();

    clockElement.innerHTML =
        `<i class="fa-regular fa-clock"></i> ${time}`;
}

setInterval(updateClock, 1000);

updateClock();



// =========================================
// ACTIVITY TRACKER
// =========================================

const activities = [

    "HTML Quiz Completed",

    "JavaScript Notes Added",

    "Assignment Submitted",

    "Attendance Updated",

    "Bootstrap Course Finished"
];

function randomActivity() {

    const randomIndex =
        Math.floor(
            Math.random() *
            activities.length
        );

    console.log(
        `Recent Activity: ${activities[randomIndex]}`
    );
}

setInterval(
    randomActivity,
    10000
);



// =========================================
// SIDEBAR ACTIVE LINK
// =========================================

const sidebarLinks =
    document.querySelectorAll(
        ".sidebar-menu a"
    );

sidebarLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            sidebarLinks.forEach(item => {

                item.classList.remove(
                    "active"
                );
            });

            link.classList.add(
                "active"
            );
        }
    );
});



// =========================================
// KEYBOARD SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    function (e) {

        // CTRL + D
        if (
            e.ctrlKey &&
            e.key === "d"
        ) {

            e.preventDefault();

            darkModeBtn.click();
        }

        // CTRL + L
        if (
            e.ctrlKey &&
            e.key === "l"
        ) {

            e.preventDefault();

            logoutBtn.click();
        }
    }
);



// =========================================
// PAGE LOADER
// =========================================

window.addEventListener(
    "load",
    () => {

        document.body.style.opacity =
            "0";

        setTimeout(() => {

            document.body.style.transition =
                "opacity 0.8s ease";

            document.body.style.opacity =
                "1";

        }, 200);
    }
);



// =========================================
// PERFORMANCE ANALYTICS
// =========================================

function calculatePerformance() {

    const total =
        dashboardData.notes +
        dashboardData.quizzes +
        dashboardData.progress +
        dashboardData.attendance;

    const average =
        total / 4;

    console.log(
        `Average Performance: ${average}`
    );
}

calculatePerformance();



// =========================================
// STORAGE MONITOR
// =========================================

function storageUsage() {

    let total = 0;

    for (
        let key in localStorage
    ) {

        if (
            localStorage.hasOwnProperty(key)
        ) {

            total +=
                (
                    localStorage[key]
                        .length +
                    key.length
                );
        }
    }

    console.log(
        `LocalStorage Usage: ${(
            total / 1024
        ).toFixed(2)} KB`
    );
}

storageUsage();



// =========================================
// AUTO SAVE DASHBOARD STATE
// =========================================

function saveDashboardState() {

    const dashboardState = {

        darkMode:
            document.body.classList.contains(
                "dark-mode"
            ),

        lastVisit:
            new Date().toLocaleString()
    };

    localStorage.setItem(
        "dashboardState",
        JSON.stringify(
            dashboardState
        )
    );
}

window.addEventListener(
    "beforeunload",
    saveDashboardState
);



// =========================================
// SYSTEM STATUS CHECK
// =========================================

function systemCheck() {

    console.log(
        "System Status: Running"
    );

    console.log(
        "Dashboard Loaded Successfully"
    );

    console.log(
        "User:",
        loggedInUser.name
    );

    console.log(
        "Theme:",
        localStorage.getItem(
            "theme"
        )
    );
}

systemCheck();



// =========================================
// INITIALIZATION
// =========================================

function initializeDashboard() {

    console.log(
        "Smart Learning Dashboard Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );

    console.log(
        "Advanced Dashboard Ready"
    );
}

initializeDashboard();