// =========================================
// notes.js
// SMART LEARNING PORTAL NOTES SYSTEM
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const noteForm =
    document.getElementById(
        "noteForm"
    );

const noteTitle =
    document.getElementById(
        "noteTitle"
    );

const noteCategory =
    document.getElementById(
        "noteCategory"
    );

const noteContent =
    document.getElementById(
        "noteContent"
    );

const notesContainer =
    document.getElementById(
        "notesContainer"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const filterCategory =
    document.getElementById(
        "filterCategory"
    );

const deleteAllBtn =
    document.getElementById(
        "deleteAllBtn"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );



// =========================================
// NOTES ARRAY
// =========================================

let notes =

    JSON.parse(
        localStorage.getItem(
            "smartNotes"
        )
    ) || [];



// =========================================
// ADD NOTE
// =========================================

noteForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // CREATE NOTE OBJECT
        const newNote = {

            id: Date.now(),

            title:
                noteTitle.value,

            category:
                noteCategory.value,

            content:
                noteContent.value,

            date:
                new Date()
                .toLocaleDateString(),

            time:
                new Date()
                .toLocaleTimeString()
        };

        // PUSH NOTE
        notes.push(newNote);

        // SAVE LOCAL STORAGE
        saveNotes();

        // RENDER NOTES
        renderNotes();

        // RESET FORM
        noteForm.reset();

        // TOAST
        showToast(
            "Note Added Successfully!"
        );
    }
);



// =========================================
// SAVE NOTES
// =========================================

function saveNotes() {

    localStorage.setItem(
        "smartNotes",
        JSON.stringify(notes)
    );
}



// =========================================
// RENDER NOTES
// =========================================

function renderNotes(
    filteredNotes = notes
) {

    // CLEAR CONTAINER
    notesContainer.innerHTML = "";

    // EMPTY STATE
    if (
        filteredNotes.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    } else {

        emptyState.style.display =
            "none";
    }

    // LOOP NOTES
    filteredNotes.forEach(note => {

        const noteCard =
            document.createElement(
                "div"
            );

        noteCard.classList.add(
            "note-card"
        );

        noteCard.innerHTML =

            `
            <div class="note-top">

                <span class="note-category">
                    ${note.category}
                </span>

                <div class="note-actions">

                    <button
                        class="edit-btn"
                        onclick="editNote(${note.id})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

            <h3>
                ${note.title}
            </h3>

            <p>
                ${note.content}
            </p>

            <div class="note-footer">

                <small>
                    ${note.date}
                </small>

                <small>
                    ${note.time}
                </small>

            </div>
            `;

        notesContainer.appendChild(
            noteCard
        );
    });
}



// =========================================
// DELETE NOTE
// =========================================

function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Delete this note?"
        );

    if (confirmDelete) {

        notes = notes.filter(
            note =>
                note.id !== id
        );

        saveNotes();

        renderNotes();

        showToast(
            "Note Deleted!"
        );
    }
}



// =========================================
// EDIT NOTE
// =========================================

function editNote(id) {

    const note =
        notes.find(
            note =>
                note.id === id
        );

    // FILL FORM
    noteTitle.value =
        note.title;

    noteCategory.value =
        note.category;

    noteContent.value =
        note.content;

    // REMOVE OLD NOTE
    notes = notes.filter(
        note =>
            note.id !== id
    );

    saveNotes();

    renderNotes();

    // SCROLL TOP
    window.scrollTo({

        top: 0,

        behavior: "smooth"
    });

    showToast(
        "Edit your note and save again."
    );
}



// =========================================
// SEARCH NOTES
// =========================================

searchInput.addEventListener(
    "input",
    () => {

        const searchValue =
            searchInput.value
            .toLowerCase();

        const filteredNotes =
            notes.filter(note => {

                return (

                    note.title
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    note.content
                    .toLowerCase()
                    .includes(searchValue)
                );
            });

        renderNotes(
            filteredNotes
        );
    }
);



// =========================================
// FILTER NOTES
// =========================================

filterCategory.addEventListener(
    "change",
    () => {

        const category =
            filterCategory.value;

        // ALL NOTES
        if (
            category === "All"
        ) {

            renderNotes();

            return;
        }

        // FILTER
        const filteredNotes =
            notes.filter(note => {

                return (
                    note.category ===
                    category
                );
            });

        renderNotes(
            filteredNotes
        );
    }
);



// =========================================
// DELETE ALL NOTES
// =========================================

deleteAllBtn.addEventListener(
    "click",
    () => {

        if (
            notes.length === 0
        ) {

            showToast(
                "No notes available."
            );

            return;
        }

        const confirmDelete =
            confirm(
                "Delete all notes?"
            );

        if (confirmDelete) {

            notes = [];

            saveNotes();

            renderNotes();

            showToast(
                "All Notes Deleted!"
            );
        }
    }
);



// =========================================
// TOAST NOTIFICATION
// =========================================

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "notes-toast";

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
// NOTES ANALYTICS
// =========================================

function notesAnalytics() {

    console.log(
        `Total Notes:
        ${notes.length}`
    );

    const categories = {};

    // COUNT CATEGORY
    notes.forEach(note => {

        if (
            categories[note.category]
        ) {

            categories[
                note.category
            ]++;

        } else {

            categories[
                note.category
            ] = 1;
        }
    });

    console.log(
        "Category Stats:",
        categories
    );
}

notesAnalytics();



// =========================================
// AUTO SAVE INDICATOR
// =========================================

function autoSaveIndicator() {

    console.log(
        "Auto-saving notes..."
    );
}

setInterval(
    autoSaveIndicator,
    10000
);



// =========================================
// CHARACTER COUNTER
// =========================================

noteContent.addEventListener(
    "input",
    () => {

        const maxLength = 500;

        const currentLength =
            noteContent.value.length;

        console.log(
            `Characters:
            ${currentLength}/${maxLength}`
        );
    }
);



// =========================================
// SORT NOTES BY LATEST
// =========================================

function sortLatestNotes() {

    notes.sort((a, b) => {

        return b.id - a.id;
    });
}

sortLatestNotes();



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

            noteForm.requestSubmit();
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
// INITIALIZE NOTES SYSTEM
// =========================================

function initializeNotes() {

    renderNotes();

    console.log(
        "Smart Notes System Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );
}

initializeNotes();