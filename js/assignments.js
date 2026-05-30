// =========================================
// assignments.js
// SMART LEARNING PORTAL ASSIGNMENT SYSTEM
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const assignmentForm =
    document.getElementById(
        "assignmentForm"
    );

const assignmentTitle =
    document.getElementById(
        "assignmentTitle"
    );

const assignmentSubject =
    document.getElementById(
        "assignmentSubject"
    );

const assignmentDeadline =
    document.getElementById(
        "assignmentDeadline"
    );

const assignmentStatus =
    document.getElementById(
        "assignmentStatus"
    );

const assignmentTableBody =
    document.getElementById(
        "assignmentTableBody"
    );

const totalAssignments =
    document.getElementById(
        "totalAssignments"
    );

const completedAssignments =
    document.getElementById(
        "completedAssignments"
    );

const pendingAssignments =
    document.getElementById(
        "pendingAssignments"
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
// ASSIGNMENTS ARRAY
// =========================================

let assignments =

    JSON.parse(
        localStorage.getItem(
            "assignments"
        )
    ) || [];



// =========================================
// ADD ASSIGNMENT
// =========================================

assignmentForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // CREATE OBJECT
        const assignment = {

            id: Date.now(),

            title:
                assignmentTitle.value,

            subject:
                assignmentSubject.value,

            deadline:
                assignmentDeadline.value,

            status:
                assignmentStatus.value
        };

        // PUSH DATA
        assignments.push(
            assignment
        );

        // SAVE
        saveAssignments();

        // RENDER
        renderAssignments();

        // UPDATE STATS
        updateStatistics();

        // RESET FORM
        assignmentForm.reset();

        // TOAST
        showToast(
            "Assignment Added!"
        );
    }
);



// =========================================
// SAVE ASSIGNMENTS
// =========================================

function saveAssignments() {

    localStorage.setItem(
        "assignments",
        JSON.stringify(
            assignments
        )
    );
}



// =========================================
// RENDER ASSIGNMENTS
// =========================================

function renderAssignments() {

    assignmentTableBody.innerHTML =
        "";

    // EMPTY STATE
    if (
        assignments.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    } else {

        emptyState.style.display =
            "none";
    }

    // LOOP
    assignments.forEach(
        assignment => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML =

                `
                <td>
                    ${assignment.title}
                </td>

                <td>
                    ${assignment.subject}
                </td>

                <td>
                    ${assignment.deadline}
                </td>

                <td>

                    <span class="
                        badge
                        ${assignment.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"}
                    ">

                        ${assignment.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteAssignment(${assignment.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>
                `;

            assignmentTableBody.appendChild(
                row
            );
        });
}



// =========================================
// DELETE ASSIGNMENT
// =========================================

function deleteAssignment(id) {

    const confirmDelete =
        confirm(
            "Delete this assignment?"
        );

    if (confirmDelete) {

        assignments =
            assignments.filter(
                assignment =>
                    assignment.id !== id
            );

        saveAssignments();

        renderAssignments();

        updateStatistics();

        showToast(
            "Assignment Deleted!"
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
            assignments.length === 0
        ) {

            showToast(
                "No assignments found!"
            );

            return;
        }

        const confirmDelete =
            confirm(
                "Delete all assignments?"
            );

        if (confirmDelete) {

            assignments = [];

            saveAssignments();

            renderAssignments();

            updateStatistics();

            showToast(
                "All Assignments Deleted!"
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
        assignments.length;

    // COMPLETED
    const completed =
        assignments.filter(
            assignment =>
                assignment.status ===
                "Completed"
        ).length;

    // PENDING
    const pending =
        assignments.filter(
            assignment =>
                assignment.status ===
                "Pending"
        ).length;

    // UPDATE UI
    totalAssignments.innerHTML =
        total;

    completedAssignments.innerHTML =
        completed;

    pendingAssignments.innerHTML =
        pending;
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
        "assignment-toast";

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
// ASSIGNMENT ANALYTICS
// =========================================

function assignmentAnalytics() {

    console.log(
        `Total Assignments:
        ${assignments.length}`
    );

    const completed =
        assignments.filter(
            assignment =>
                assignment.status ===
                "Completed"
        ).length;

    const pending =
        assignments.filter(
            assignment =>
                assignment.status ===
                "Pending"
        ).length;

    console.log(
        `Completed:
        ${completed}`
    );

    console.log(
        `Pending:
        ${pending}`
    );
}

assignmentAnalytics();



// =========================================
// AUTO SAVE LOG
// =========================================

function autoSaveLog() {

    console.log(
        "Assignments auto-saved"
    );
}

setInterval(
    autoSaveLog,
    10000
);



// =========================================
// DEADLINE CHECKER
// =========================================

function checkDeadlines() {

    const today =
        new Date();

    assignments.forEach(
        assignment => {

            const deadline =
                new Date(
                    assignment.deadline
                );

            const difference =
                deadline - today;

            const daysLeft =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );

            console.log(
                `${assignment.title}
                Deadline:
                ${daysLeft} days left`
            );
        });
}

checkDeadlines();



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

            assignmentForm.requestSubmit();
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
// INITIALIZE ASSIGNMENT SYSTEM
// =========================================

function initializeAssignments() {

    renderAssignments();

    updateStatistics();

    console.log(
        "Assignment System Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );
}

initializeAssignments();