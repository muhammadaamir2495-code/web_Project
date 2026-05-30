// =========================================
// auth.js
// SMART LEARNING PORTAL LOGIN SYSTEM
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePasswordBtn =
    document.getElementById("togglePassword");

const loginAlert =
    document.getElementById("loginAlert");

const rememberMe =
    document.getElementById("rememberMe");



// =========================================
// DEMO USER DATA
// =========================================

const demoUsers = [

    {
        email: "admin@gmail.com",
        password: "admin123",
        name: "Muhammad Aamir",
        role: "Administrator"
    },

    {
        email: "student@gmail.com",
        password: "student123",
        name: "Ali Khan",
        role: "Student"
    }
];



// =========================================
// SHOW PASSWORD TOGGLE
// =========================================

togglePasswordBtn.addEventListener(
    "click",
    () => {

        const type =
            passwordInput.getAttribute("type");

        if (type === "password") {

            passwordInput.setAttribute(
                "type",
                "text"
            );

            togglePasswordBtn.innerHTML =
                `<i class="fa-solid fa-eye-slash"></i>`;

        } else {

            passwordInput.setAttribute(
                "type",
                "password"
            );

            togglePasswordBtn.innerHTML =
                `<i class="fa-solid fa-eye"></i>`;
        }
    }
);



// =========================================
// LOAD SAVED EMAIL
// =========================================

window.addEventListener(
    "load",
    () => {

        const savedEmail =
            localStorage.getItem(
                "rememberedEmail"
            );

        if (savedEmail) {

            emailInput.value =
                savedEmail;

            rememberMe.checked = true;
        }
    }
);



// =========================================
// ALERT FUNCTION
// =========================================

function showAlert(message, type) {

    loginAlert.innerHTML =

        `
        <div class="alert alert-${type} alert-dismissible fade show">

            ${message}

            <button type="button"
                class="btn-close"
                data-bs-dismiss="alert">
            </button>

        </div>
        `;
}



// =========================================
// EMAIL VALIDATION
// =========================================

function validateEmail(email) {

    const regex =
        /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    return regex.test(email);
}



// =========================================
// PASSWORD VALIDATION
// =========================================

function validatePassword(password) {

    return password.length >= 6;
}



// =========================================
// LOGIN FORM SUBMIT
// =========================================

loginForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // GET VALUES
        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value.trim();

        // EMPTY CHECK
        if (
            email === "" ||
            password === ""
        ) {

            showAlert(
                "Please fill all fields.",
                "danger"
            );

            return;
        }

        // EMAIL CHECK
        if (!validateEmail(email)) {

            showAlert(
                "Invalid email format.",
                "warning"
            );

            return;
        }

        // PASSWORD CHECK
        if (
            !validatePassword(password)
        ) {

            showAlert(
                "Password must contain at least 6 characters.",
                "warning"
            );

            return;
        }

        // FIND USER
        const user =
            demoUsers.find(user => {

                return (
                    user.email === email &&
                    user.password === password
                );
            });

        // LOGIN SUCCESS
        if (user) {

            // SAVE LOGIN STATUS
            localStorage.setItem(
                "isLoggedIn",
                true
            );

            // SAVE USER DATA
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            // REMEMBER EMAIL
            if (rememberMe.checked) {

                localStorage.setItem(
                    "rememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "rememberedEmail"
                );
            }

            // SUCCESS ALERT
            showAlert(
                `Welcome back, ${user.name}! Redirecting...`,
                "success"
            );

            // LOADING BUTTON EFFECT
            const submitBtn =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            submitBtn.innerHTML =

                `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Logging In...
                `;

            submitBtn.disabled = true;

            // REDIRECT
            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 2000);

        } else {

            // INVALID USER
            showAlert(
                "Invalid email or password.",
                "danger"
            );

            passwordInput.value = "";

            passwordInput.focus();
        }
    }
);



// =========================================
// INPUT ANIMATION
// =========================================

const formInputs =
    document.querySelectorAll(
        ".form-control"
    );

formInputs.forEach(input => {

    input.addEventListener(
        "focus",
        () => {

            input.parentElement.style.transform =
                "scale(1.02)";

            input.parentElement.style.transition =
                "0.3s ease";
        }
    );

    input.addEventListener(
        "blur",
        () => {

            input.parentElement.style.transform =
                "scale(1)";
        }
    );
});



// =========================================
// AUTO LOGIN CHECK
// =========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            );

        if (isLoggedIn) {

            window.location.href =
                "dashboard.html";
        }
    }
);



// =========================================
// ENTER KEY SHORTCUT
// =========================================

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Enter") {

            loginForm.requestSubmit();
        }
    }
);



// =========================================
// SOCIAL LOGIN BUTTONS
// =========================================

const socialButtons =
    document.querySelectorAll(
        ".social-btn"
    );

socialButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showAlert(
                "Social login integration coming soon.",
                "info"
            );
        }
    );
});



// =========================================
// SECURITY FEATURE
// =========================================

// PREVENT RIGHT CLICK
document.addEventListener(
    "contextmenu",
    function (e) {

        e.preventDefault();
    }
);



// =========================================
// PREVENT DEV SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    function (e) {

        // F12
        if (e.key === "F12") {

            e.preventDefault();
        }

        // CTRL + SHIFT + I
        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key === "I"
        ) {

            e.preventDefault();
        }
    }
);



// =========================================
// DYNAMIC GREETING
// =========================================

function greetingMessage() {

    const hour =
        new Date().getHours();

    if (hour < 12) {

        return "Good Morning ☀️";

    } else if (hour < 18) {

        return "Good Afternoon 🌤";

    } else {

        return "Good Evening 🌙";
    }
}

console.log(
    `${greetingMessage()} Login System Ready`
);



// =========================================
// LOGIN PAGE ANIMATION
// =========================================

window.addEventListener(
    "load",
    () => {

        const loginCard =
            document.querySelector(
                ".login-card"
            );

        loginCard.style.opacity = "0";

        loginCard.style.transform =
            "translateY(50px)";

        setTimeout(() => {

            loginCard.style.transition =
                "all 1s ease";

            loginCard.style.opacity = "1";

            loginCard.style.transform =
                "translateY(0)";

        }, 200);
    }
);



// =========================================
// SESSION TIME TRACKER
// =========================================

const loginStartTime =
    new Date();

console.log(
    `Login page opened at: ${loginStartTime}`
);



// =========================================
// APP INITIALIZATION
// =========================================

function initializeLoginSystem() {

    console.log(
        "Smart Learning Login System Initialized"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );

    console.log(
        "Project: Smart Learning Portal"
    );
}

initializeLoginSystem();