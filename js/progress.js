// =========================================
// progress.js
// SMART LEARNING PORTAL PROGRESS TRACKER
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const progressForm =
    document.getElementById(
        "progressForm"
    );

const courseName =
    document.getElementById(
        "courseName"
    );

const courseInstructor =
    document.getElementById(
        "courseInstructor"
    );

const courseProgress =
    document.getElementById(
        "courseProgress"
    );

const progressTableBody =
    document.getElementById(
        "progressTableBody"
    );

const totalCourses =
    document.getElementById(
        "totalCourses"
    );

const completedCourses =
    document.getElementById(
        "completedCourses"
    );

const averageProgress =
    document.getElementById(
        "averageProgress"
    );

const deleteAllBtn =
    document.getElementById(
        "deleteAllBtn"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );



// =========================================
// PROGRESS DATA
// =========================================

let progressRecords =

    JSON.parse(
        localStorage.getItem(
            "progressRecords"
        )
    ) || [];



// =========================================
// ADD PROGRESS
// =========================================

progressForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // VALIDATION
        if (
            courseProgress.value > 100 ||
            courseProgress.value < 0
        ) {

            showToast(
                "Progress must be between 0 and 100!"
            );

            return;
        }

        // CREATE OBJECT
        const progress = {

            id: Date.now(),

            course:
                courseName.value,

            instructor:
                courseInstructor.value,

            progress:
                Number(
                    courseProgress.value
                )
        };

        // PUSH DATA
        progressRecords.push(
            progress
        );

        // SAVE
        saveProgress();

        // RENDER
        renderProgress();

        // UPDATE STATS
        updateStatistics();

        // RESET
        progressForm.reset();

        // TOAST
        showToast(
            "Course Progress Added!"
        );
    }
);



// =========================================
// SAVE PROGRESS
// =========================================

function saveProgress() {

    localStorage.setItem(
        "progressRecords",
        JSON.stringify(
            progressRecords
        )
    );
}



// =========================================
// RENDER PROGRESS
// =========================================

function renderProgress() {

    progressTableBody.innerHTML =
        "";

    // EMPTY STATE
    if (
        progressRecords.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    } else {

        emptyState.style.display =
            "none";
    }

    // LOOP
    progressRecords.forEach(
        record => {

            // STATUS
            let status =
                record.progress === 100
                    ? "Completed"
                    : "In Progress";

            // STATUS CLASS
            let badgeClass =
                record.progress === 100
                    ? "bg-success"
                    : "bg-warning";

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML =

                `
                <td>
                    ${record.course}
                </td>

                <td>
                    ${record.instructor}
                </td>

                <td>

                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="
                                width:
                                ${record.progress}%;
                            ">

                            ${record.progress}%

                        </div>

                    </div>

                </td>

                <td>

                    <span class="
                        badge
                        ${badgeClass}
                    ">

                        ${status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteProgress(${record.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>
                `;

            progressTableBody.appendChild(
                row
            );
        });
}



// =========================================
// DELETE PROGRESS
// =========================================

function deleteProgress(id) {

    const confirmDelete =
        confirm(
            "Delete this course progress?"
        );

    if (confirmDelete) {

        progressRecords =
            progressRecords.filter(
                record =>
                    record.id !== id
            );

        saveProgress();

        renderProgress();

        updateStatistics();

        showToast(
            "Progress Deleted!"
        );
    }
}



// =========================================
// DELETE ALL
// =========================================

deleteAllBtn.addEventListener(
    "click",
    () => {

        if (
            progressRecords.length === 0
        ) {

            showToast(
                "No progress records found!"
            );

            return;
        }

        const confirmDelete =
            confirm(
                "Delete all progress records?"
            );

        if (confirmDelete) {

            progressRecords = [];

            saveProgress();

            renderProgress();

            updateStatistics();

            showToast(
                "All Records Deleted!"
            );
        }
    }
);



// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics() {

    // TOTAL
    const total =
        progressRecords.length;

    // COMPLETED
    const completed =
        progressRecords.filter(
            record =>
                record.progress === 100
        ).length;

    // AVERAGE
    let average = 0;

    if (total > 0) {

        const totalProgress =
            progressRecords.reduce(
                (sum, record) =>
                    sum + record.progress,
                0
            );

        average =
            (
                totalProgress / total
            ).toFixed(1);
    }

    // UPDATE UI
    totalCourses.innerHTML =
        total;

    completedCourses.innerHTML =
        completed;

    averageProgress.innerHTML =
        `${average}%`;
}



// =========================================
// TOAST NOTIFICATION
// =========================================

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "progress-toast";

    toast.innerHTML =

        `
        <i class="fa-solid fa-circle-check"></i>
        ${message}
        `;

    document.body.appendChild(
        toast
    );

    // SHOW
    setTimeout(() => {

        toast.classList.add(
            "show"
        );

    }, 100);

    // REMOVE
    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

        setTimeout(() => {

            toast.remove();

        }, 500);

    }, 3000);
}



// =========================================
// DARK MODE
// =========================================

const savedTheme =
    localStorage.getItem(
        "theme"
    );

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );
}



// TOGGLE THEME
themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        // SAVE
        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    }
);



// =========================================
// TABLE HOVER EFFECT
// =========================================

document.addEventListener(
    "mouseover",
    e => {

        if (
            e.target.tagName === "TD"
        ) {

            e.target.parentElement.style.transform =
                "scale(1.01)";
        }
    }
);

document.addEventListener(
    "mouseout",
    e => {

        if (
            e.target.tagName === "TD"
        ) {

            e.target.parentElement.style.transform =
                "scale(1)";
        }
    }
);



// =========================================
// ANALYTICS
// =========================================

function progressAnalytics() {

    console.log(
        `Total Courses:
        ${progressRecords.length}`
    );

    const completed =
        progressRecords.filter(
            record =>
                record.progress === 100
        ).length;

    console.log(
        `Completed Courses:
        ${completed}`
    );
}

progressAnalytics();



// =========================================
// AUTO SAVE LOG
// =========================================

function autoSaveLog() {

    console.log(
        "Progress auto-saved"
    );
}

setInterval(
    autoSaveLog,
    10000
);



// =========================================
// KEYBOARD SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    e => {

        // CTRL + S
        if (
            e.ctrlKey &&
            e.key === "s"
        ) {

            e.preventDefault();

            progressForm.requestSubmit();
        }

        // CTRL + D
        if (
            e.ctrlKey &&
            e.key === "d"
        ) {

            e.preventDefault();

            themeBtn.click();
        }
    }
);



// =========================================
// PAGE LOAD ANIMATION
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
// INITIALIZE PROGRESS SYSTEM
// =========================================

function initializeProgress() {

    renderProgress();

    updateStatistics();

    console.log(
        "Progress Tracker Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );
}

initializeProgress();