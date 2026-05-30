// =========================================
// SMART LEARNING PORTAL
// app.js
// =========================================



// =========================================
// DOM ELEMENTS
// =========================================

const themeToggleBtn =
    document.getElementById("themeToggle");

const body =
    document.body;

const navbar =
    document.querySelector(".custom-navbar");



// =========================================
// DARK MODE SYSTEM
// =========================================

// CHECK SAVED THEME
const savedTheme =
    localStorage.getItem("theme");

// APPLY SAVED THEME
if (savedTheme === "dark") {

    body.classList.add("dark-mode");

    themeToggleBtn.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;
}



// TOGGLE DARK MODE
themeToggleBtn.addEventListener("click", () => {

    body.classList.toggle("dark-mode");

    // SAVE THEME
    if (body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

        themeToggleBtn.innerHTML =
            `<i class="fa-solid fa-sun"></i>`;

    } else {

        localStorage.setItem("theme", "light");

        themeToggleBtn.innerHTML =
            `<i class="fa-solid fa-moon"></i>`;
    }
});



// =========================================
// NAVBAR SCROLL EFFECT
// =========================================

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.padding = "10px 0";

        navbar.style.background =
            "rgba(2, 6, 23, 0.95)";

        navbar.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";

    } else {

        navbar.style.padding = "15px 0";

        navbar.style.background =
            "rgba(15, 23, 42, 0.9)";

        navbar.style.boxShadow =
            "none";
    }
});



// =========================================
// SMOOTH SCROLLING
// =========================================

document.querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            e.preventDefault();

            const target =
                document.querySelector(
                    this.getAttribute("href")
                );

            if (target) {

                target.scrollIntoView({

                    behavior: "smooth"
                });
            }
        });
    });



// =========================================
// SCROLL REVEAL ANIMATION
// =========================================

const revealElements =
    document.querySelectorAll(
        ".feature-card, .stats-card"
    );

function revealOnScroll() {

    const windowHeight =
        window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {

            element.style.opacity = "1";

            element.style.transform =
                "translateY(0)";

        } else {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(60px)";
        }
    });
}

// INITIAL STYLE
revealElements.forEach(element => {

    element.style.transition =
        "all 0.8s ease";

    element.style.opacity = "0";

    element.style.transform =
        "translateY(60px)";
});

window.addEventListener(
    "scroll",
    revealOnScroll
);

// INITIAL LOAD
revealOnScroll();



// =========================================
// ACTIVE NAVBAR LINK
// =========================================

const navLinks =
    document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.forEach(item => {

            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});



// =========================================
// HERO BUTTON RIPPLE EFFECT
// =========================================

const buttons =
    document.querySelectorAll(".btn");

buttons.forEach(button => {

    button.addEventListener("click", function (e) {

        const circle =
            document.createElement("span");

        const diameter =
            Math.max(
                button.clientWidth,
                button.clientHeight
            );

        const radius =
            diameter / 2;

        circle.style.width =
            circle.style.height =
            `${diameter}px`;

        circle.style.left =
            `${e.clientX -
            button.offsetLeft -
            radius}px`;

        circle.style.top =
            `${e.clientY -
            button.offsetTop -
            radius}px`;

        circle.classList.add("ripple");

        const ripple =
            button.querySelector(".ripple");

        if (ripple) {

            ripple.remove();
        }

        button.appendChild(circle);
    });
});



// =========================================
// DYNAMIC GREETING
// =========================================

function getGreeting() {

    const currentHour =
        new Date().getHours();

    if (currentHour < 12) {

        return "Good Morning ☀️";

    } else if (currentHour < 18) {

        return "Good Afternoon 🌤";

    } else {

        return "Good Evening 🌙";
    }
}

// CONSOLE GREETING
console.log(
    `${getGreeting()} Welcome to Smart Learning Portal`
);



// =========================================
// LIVE YEAR IN FOOTER
// =========================================

const footerText =
    document.querySelector(".footer-bottom p");

if (footerText) {

    const currentYear =
        new Date().getFullYear();

    footerText.innerHTML =
        `© ${currentYear} Smart Learning Portal. All Rights Reserved.`;
}



// =========================================
// PAGE LOADER
// =========================================

window.addEventListener("load", () => {

    const loader =
        document.querySelector(".loader");

    if (loader) {

        loader.classList.add("loader-hidden");

        setTimeout(() => {

            loader.remove();

        }, 1000);
    }
});



// =========================================
// BACK TO TOP BUTTON
// =========================================

// CREATE BUTTON
const backToTopBtn =
    document.createElement("button");

backToTopBtn.innerHTML =
    `<i class="fa-solid fa-arrow-up"></i>`;

backToTopBtn.classList.add(
    "back-to-top"
);

document.body.appendChild(
    backToTopBtn
);

// SHOW/HIDE BUTTON
window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        backToTopBtn.classList.add("show");

    } else {

        backToTopBtn.classList.remove("show");
    }
});

// SCROLL TO TOP
backToTopBtn.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"
        });
    }
);



// =========================================
// TYPING EFFECT
// =========================================

const heroTitle =
    document.querySelector(".hero-title span");

if (heroTitle) {

    const words = [

        "Grow Faster",
        "Learn Better",
        "Build Skills",
        "Achieve Goals"
    ];

    let wordIndex = 0;

    let charIndex = 0;

    let isDeleting = false;

    function typeEffect() {

        const currentWord =
            words[wordIndex];

        if (!isDeleting) {

            heroTitle.textContent =
                currentWord.substring(
                    0,
                    charIndex++
                );

        } else {

            heroTitle.textContent =
                currentWord.substring(
                    0,
                    charIndex--
                );
        }

        let speed = 120;

        if (isDeleting) {

            speed = 70;
        }

        if (
            !isDeleting &&
            charIndex ===
            currentWord.length + 1
        ) {

            isDeleting = true;

            speed = 1200;

        } else if (
            isDeleting &&
            charIndex === 0
        ) {

            isDeleting = false;

            wordIndex =
                (wordIndex + 1) %
                words.length;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();
}



// =========================================
// SIMPLE CONTACT VALIDATION
// =========================================

const forms =
    document.querySelectorAll("form");

forms.forEach(form => {

    form.addEventListener(
        "submit",
        function (e) {

            const requiredFields =
                form.querySelectorAll(
                    "[required]"
                );

            let isValid = true;

            requiredFields.forEach(field => {

                if (
                    field.value.trim() === ""
                ) {

                    isValid = false;

                    field.classList.add(
                        "is-invalid"
                    );

                } else {

                    field.classList.remove(
                        "is-invalid"
                    );
                }
            });

            if (!isValid) {

                e.preventDefault();

                alert(
                    "Please fill all required fields."
                );
            }
        }
    );
});



// =========================================
// PERFORMANCE OPTIMIZATION
// =========================================

// DEBOUNCE FUNCTION
function debounce(func, delay) {

    let timeout;

    return function () {

        const context = this;

        const args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            func.apply(context, args);

        }, delay);
    };
}



// =========================================
// WINDOW RESIZE EVENT
// =========================================

window.addEventListener(
    "resize",
    debounce(() => {

        console.log(
            "Window resized"
        );

    }, 300)
);



// =========================================
// APP INITIALIZATION
// =========================================

function initializeApp() {

    console.log(
        "Smart Learning Portal Initialized Successfully"
    );

    console.log(
        "Developer: Muhammad Aamir"
    );

    console.log(
        "Contact: 03436448495"
    );

    console.log(
        "Email: muhammadaamir2495@gmail.com"
    );
}

initializeApp();