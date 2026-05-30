// =========================================
// attendance.js
// SMART LEARNING PORTAL ATTENDANCE SYSTEM
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const attendanceForm =
    document.getElementById(
        "attendanceForm"
    );

const subjectName =
    document.getElementById(
        "subjectName"
    );

const attendanceDate =
    document.getElementById(
        "attendanceDate"
    );

const attendanceStatus =
    document.getElementById(
        "attendanceStatus"
    );

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );

const totalClasses =
    document.getElementById(
        "totalClasses"
    );

const presentClasses =
    document.getElementById(
        "presentClasses"
    );

const attendancePercentage =
    document.getElementById(
        "attendancePercentage"
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
// ATTENDANCE DATA
// =========================================

let attendanceRecords =

    JSON.parse(
        localStorage.getItem(
            "attendanceRecords"
        )
    ) || [];



// =========================================
// ADD ATTENDANCE
// =========================================

attendanceForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // CREATE RECORD
        const attendance = {

            id: Date.now(),

            subject:
                subjectName.value,

            date:
                attendanceDate.value,

            status:
                attendanceStatus.value
        };

        // PUSH RECORD
        attendanceRecords.push(
            attendance
        );

        // SAVE
        saveAttendance();

        // RENDER
        renderAttendance();

        // UPDATE STATS
        updateStatistics();

        // RESET FORM
        attendanceForm.reset();

        // TOAST
        showToast(
            "Attendance Added!"
        );
    }
);



// =========================================
// SAVE ATTENDANCE
// =========================================

function saveAttendance() {

    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(
            attendanceRecords
        )
    );
}



// =========================================
// RENDER ATTENDANCE
// =========================================

function renderAttendance() {

    attendanceTableBody.innerHTML =
        "";

    // EMPTY STATE
    if (
        attendanceRecords.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    } else {

        emptyState.style.display =
            "none";
    }

    // LOOP RECORDS
    attendanceRecords.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML =

                `
                <td>
                    ${record.subject}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>

                    <span class="
                        badge
                        ${record.status === "Present"
                            ? "bg-success"
                            : "bg-danger"}
                    ">

                        ${record.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteAttendance(${record.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>
                `;

            attendanceTableBody.appendChild(
                row
            );
        });
}



// =========================================
// DELETE ATTENDANCE
// =========================================

function deleteAttendance(id) {

    const confirmDelete =
        confirm(
            "Delete attendance record?"
        );

    if (confirmDelete) {

        attendanceRecords =
            attendanceRecords.filter(
                record =>
                    record.id !== id
            );

        saveAttendance();

        renderAttendance();

        updateStatistics();

        showToast(
            "Attendance Deleted!"
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
            attendanceRecords.length === 0
        ) {

            showToast(
                "No records found!"
            );

            return;
        }

        const confirmDelete =
            confirm(
                "Delete all attendance records?"
            );

        if (confirmDelete) {

            attendanceRecords = [];

            saveAttendance();

            renderAttendance();

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
        attendanceRecords.length;

    // PRESENT
    const present =
        attendanceRecords.filter(
            record =>
                record.status ===
                "Present"
        ).length;

    // PERCENTAGE
    const percentage =
        total === 0
            ? 0
            : (
                (present / total) * 100
            ).toFixed(1);

    // UPDATE UI
    totalClasses.innerHTML =
        total;

    presentClasses.innerHTML =
        present;

    attendancePercentage.innerHTML =
        `${percentage}%`;
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
        "attendance-toast";

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

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    }
);



// =========================================
// TABLE ROW HOVER EFFECT
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
// AUTO SAVE LOG
// =========================================

function autoSaveLog() {

    console.log(
        "Attendance auto-saved"
    );
}

setInterval(
    autoSaveLog,
    10000
);



// =========================================
// ATTENDANCE ANALYTICS
// =========================================

function attendanceAnalytics() {

    console.log(
        `Total Records:
        ${attendanceRecords.length}`
    );

    const presentCount =
        attendanceRecords.filter(
            record =>
                record.status ===
                "Present"
        ).length;

    const absentCount =
        attendanceRecords.filter(
            record =>
                record.status ===
                "Absent"
        ).length;

    console.log(
        `Present:
        ${presentCount}`
    );

    console.log(
        `Absent:
        ${absentCount}`
    );
}

attendanceAnalytics();



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

            attendanceForm.requestSubmit();
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
// INITIALIZE ATTENDANCE SYSTEM
// =========================================

function initializeAttendance() {

    renderAttendance();

    updateStatistics();

    console.log(
        "Attendance System Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );
}

initializeAttendance();