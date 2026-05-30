
// =========================================
// REGISTER SYSTEM
// =========================================


// DOM ELEMENTS
const registerForm =
    document.getElementById(
        "registerForm"
    );

const password =
    document.getElementById(
        "password"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );

const togglePassword =
    document.querySelector(
        ".toggle-password"
    );

const toggleConfirmPassword =
    document.querySelector(
        ".toggle-confirm-password"
    );


// =========================================
// SHOW / HIDE PASSWORD
// =========================================

function toggleInput(
    input,
    icon
) {

    if (
        input.type === "password"
    ) {

        input.type = "text";

        icon.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    } else {

        input.type = "password";

        icon.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );
    }
}


// PASSWORD TOGGLE

togglePassword.addEventListener(
    "click",
    () => {

        toggleInput(
            password,
            togglePassword
        );
    }
);


// CONFIRM PASSWORD TOGGLE

toggleConfirmPassword.addEventListener(
    "click",
    () => {

        toggleInput(
            confirmPassword,
            toggleConfirmPassword
        );
    }
);


// =========================================
// FORM SUBMIT
// =========================================

registerForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const fullName =
            document.getElementById(
                "fullName"
            ).value;

        const username =
            document.getElementById(
                "username"
            ).value;

        const email =
            document.getElementById(
                "email"
            ).value;

        const phone =
            document.getElementById(
                "phone"
            ).value;


        // PASSWORD CHECK
        if (
            password.value !==
            confirmPassword.value
        ) {

            showToast(
                "Passwords do not match!",
                "error"
            );

            return;
        }


        // USER OBJECT
        const user = {

            fullName,
            username,
            email,
            phone,
            password: password.value,
            registeredAt:
                new Date()
                .toLocaleString()
        };


        // SAVE USER
        localStorage.setItem(
            "studentUser",
            JSON.stringify(user)
        );


        // SUCCESS
        showToast(
            "Registration Successful!",
            "success"
        );


        // RESET FORM
        registerForm.reset();


        // REDIRECT
        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 2000);
    }
);


// =========================================
// TOAST
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
        `register-toast ${type}`;

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
