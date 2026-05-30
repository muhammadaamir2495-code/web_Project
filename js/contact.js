// =========================================
// contact.js
// SMART LEARNING PORTAL CONTACT SYSTEM
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const contactForm =
    document.getElementById(
        "contactForm"
    );

const fullName =
    document.getElementById(
        "fullName"
    );

const email =
    document.getElementById(
        "email"
    );

const subject =
    document.getElementById(
        "subject"
    );

const message =
    document.getElementById(
        "message"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );



// =========================================
// FORM SUBMIT
// =========================================

contactForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // VALIDATION
        if (
            fullName.value.trim() === "" ||
            email.value.trim() === "" ||
            subject.value.trim() === "" ||
            message.value.trim() === ""
        ) {

            showToast(
                "Please fill all fields!",
                "error"
            );

            return;
        }

        // EMAIL VALIDATION
        const emailPattern =

            /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (
            !email.value.match(
                emailPattern
            )
        ) {

            showToast(
                "Invalid email address!",
                "error"
            );

            return;
        }

        // MESSAGE OBJECT
        const contactMessage = {

            name:
                fullName.value,

            email:
                email.value,

            subject:
                subject.value,

            message:
                message.value,

            date:
                new Date()
                .toLocaleDateString(),

            time:
                new Date()
                .toLocaleTimeString()
        };

        // SAVE MESSAGE
        saveMessage(
            contactMessage
        );

        // SUCCESS
        showToast(
            "Message Sent Successfully!",
            "success"
        );

        // RESET FORM
        contactForm.reset();
    }
);



// =========================================
// SAVE MESSAGE
// =========================================

function saveMessage(data) {

    let messages =

        JSON.parse(
            localStorage.getItem(
                "contactMessages"
            )
        ) || [];

    messages.push(data);

    localStorage.setItem(
        "contactMessages",
        JSON.stringify(messages)
    );
}



// =========================================
// TOAST NOTIFICATION
// =========================================

function showToast(
    message,
    type
) {

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `contact-toast ${type}`;

    // ICON
    let icon = "";

    if (type === "success") {

        icon =
            "fa-circle-check";

    } else {

        icon =
            "fa-circle-exclamation";
    }

    toast.innerHTML =

        `
        <i class="fa-solid ${icon}"></i>
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
// INPUT ANIMATION EFFECT
// =========================================

const inputs =
    document.querySelectorAll(
        ".form-control"
    );

inputs.forEach(input => {

    input.addEventListener(
        "focus",
        () => {

            input.style.transform =
                "scale(1.02)";
        }
    );

    input.addEventListener(
        "blur",
        () => {

            input.style.transform =
                "scale(1)";
        }
    );
});



// =========================================
// CHARACTER COUNTER
// =========================================

message.addEventListener(
    "input",
    () => {

        const maxLength = 1000;

        const currentLength =
            message.value.length;

        console.log(

            `Message Length:
            ${currentLength}/${maxLength}`
        );

        // LIMIT
        if (
            currentLength > maxLength
        ) {

            message.value =
                message.value.substring(
                    0,
                    maxLength
                );
        }
    }
);



// =========================================
// AUTO SAVE DRAFT
// =========================================

function autoSaveDraft() {

    const draft = {

        name:
            fullName.value,

        email:
            email.value,

        subject:
            subject.value,

        message:
            message.value
    };

    localStorage.setItem(
        "contactDraft",
        JSON.stringify(draft)
    );

    console.log(
        "Draft Auto Saved"
    );
}



// AUTO SAVE EVERY 5 SEC
setInterval(
    autoSaveDraft,
    5000
);



// =========================================
// LOAD DRAFT
// =========================================

function loadDraft() {

    const draft =

        JSON.parse(
            localStorage.getItem(
                "contactDraft"
            )
        );

    if (draft) {

        fullName.value =
            draft.name || "";

        email.value =
            draft.email || "";

        subject.value =
            draft.subject || "";

        message.value =
            draft.message || "";
    }
}

loadDraft();



// =========================================
// REMOVE DRAFT AFTER SUBMIT
// =========================================

contactForm.addEventListener(
    "submit",
    () => {

        localStorage.removeItem(
            "contactDraft"
        );
    }
);



// =========================================
// SOCIAL ICON EFFECT
// =========================================

const socialIcons =
    document.querySelectorAll(
        ".social-links a"
    );

socialIcons.forEach(icon => {

    icon.addEventListener(
        "mouseenter",
        () => {

            icon.style.transform =
                "translateY(-8px)";
        }
    );

    icon.addEventListener(
        "mouseleave",
        () => {

            icon.style.transform =
                "translateY(0)";
        }
    );
});



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
// CONTACT ANALYTICS
// =========================================

function contactAnalytics() {

    const messages =

        JSON.parse(
            localStorage.getItem(
                "contactMessages"
            )
        ) || [];

    console.log(
        `Total Messages:
        ${messages.length}`
    );
}

contactAnalytics();



// =========================================
// KEYBOARD SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    e => {

        // CTRL + ENTER
        if (
            e.ctrlKey &&
            e.key === "Enter"
        ) {

            contactForm.requestSubmit();
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
// INITIALIZE CONTACT PAGE
// =========================================

function initializeContact() {

    console.log(
        "Contact System Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );
}

initializeContact();