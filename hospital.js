document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");




    // Typing effect code (unchanged)
    const words = ["Hair Treatment", "Skin Treatment", "Eye Treatment", "Bone Treatment", "Full body check-up"];
    let wordIndex = 0;
    let letterIndex = 0;
    let currentWord = "";
    let isDeleting = false;
    const treatmentElement = document.getElementById("treatment");
    const typingSpeed = 100; // Adjust the typing speed (in milliseconds)
    const deletingSpeed = 70; // Adjust the deleting speed (in milliseconds)
    const pauseBetweenWords = 100; // Pause between words (in milliseconds)

    function type() {
        if (!isDeleting && letterIndex < words[wordIndex].length) {
            // Typing
            currentWord += words[wordIndex].charAt(letterIndex);
            letterIndex++;
            treatmentElement.textContent = currentWord;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && letterIndex > 0) {
            // Deleting
            currentWord = currentWord.substring(0, letterIndex - 1);
            letterIndex--;
            treatmentElement.textContent = currentWord;
            setTimeout(type, deletingSpeed);
        } else if (!isDeleting && letterIndex === words[wordIndex].length) {
            // Pause before deleting
            isDeleting = true;
            setTimeout(type, pauseBetweenWords);
        } else if (isDeleting && letterIndex === 0) {
            // Move to the next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, typingSpeed);
        }
    }

    type();

    const loginLink = document.getElementById("login-link");
    const loginFormContainer = document.getElementById("login-form-container");
    const registerFormContainer = document.getElementById("register-form-container");
    const appointmentFormContainer = document.getElementById("appointment-form-container");
    const showRegisterFormLink = document.getElementById("show-register-form");
    const showLoginFormLink = document.getElementById("show-login-form");
    const overlay = document.getElementById("overlay");
    const closeButtons = document.querySelectorAll(".close-button");

    function openForm(formContainer) {
        formContainer.style.display = "block";
        overlay.style.display = "block";
    }

    function closeForm() {
        if (loginFormContainer) loginFormContainer.style.display = "none";
        if (registerFormContainer) registerFormContainer.style.display = "none";
        if (appointmentFormContainer) appointmentFormContainer.style.display = "none";
        overlay.style.display = "none";
    }

    if (loginLink) {
        loginLink.addEventListener("click", function (event) {
            event.preventDefault();
            openForm(loginFormContainer);
        });
    }

    if (showRegisterFormLink) {
        showRegisterFormLink.addEventListener("click", function (event) {
            event.preventDefault();
            openForm(registerFormContainer);
            loginFormContainer.style.display = "none";
        });
    }

    if (showLoginFormLink) {
        showLoginFormLink.addEventListener("click", function (event) {
            event.preventDefault();
            openForm(loginFormContainer);
            registerFormContainer.style.display = "none";
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeForm);
    }

    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener("click", closeForm);
        });
    }
    
    
    function getAppointment() {
        fetch('http://localhost:8080/api/v1/patient/appoinment/recent', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); // Debug log
    
            const appointDetailContainer = document.getElementById('appoint-detail-container');
            appointDetailContainer.innerHTML = ''; // Clear any existing content
    
            if (Array.isArray(data) && data.length > 0) {
                data.reverse();
                data.forEach(appointment => {
                    const appointDetailBox = document.createElement('li');
                    appointDetailBox.classList.add('appoint-detail-box');
                    appointDetailBox.innerHTML = `
                        <p><strong>Appointment ID:</strong> ${appointment.appointmentId}</p>
                        <p><strong>Patient:</strong> ${appointment.patient}</p>
                        <p><strong>Reason:</strong> ${appointment.reason}</p>
                        <p><strong>Date of Birth:</strong> ${appointment.dateOfBirth}</p>
                        <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                        <p><strong>Appointment Date:</strong> ${appointment.appointmentDate}</p>
                        <p><strong>Date of Booking:</strong> ${appointment.dateOfBooking}</p>
                        <p><strong>Appointment Time:</strong> ${appointment.appointmentTime}</p>
                        <p><strong>Location:</strong> ${appointment.location}</p>
                        <p><strong>Status:</strong> ${appointment.status}</p>
                    `;
                    appointDetailContainer.appendChild(appointDetailBox);
                });
            } else {
                appointDetailContainer.innerHTML = '<li class="appoint-detail-box">No upcoming appointments.</li>';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            const appointDetailContainer = document.getElementById('appoint-detail-container');
            appointDetailContainer.innerHTML = '<li class="appoint-detail-box">Failed to load appointment details.</li>';
        });
    }
    
    // Call the function to fetch and display appointments
    getAppointment();
    

    // Function to update the welcome message
    function updateWelcomeMessage() {
        const token = localStorage.getItem("token");
        if (token) {
            console.log("Token found:", token); // Debug log
            fetch("http://localhost:8080/api/v1/patient/get-name", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(response => response.text())
                .then(name => {
                    console.log("Fetched name:", name); // Debug log
                    const welcomeElements = document.getElementsByClassName("welcome");
                    if (welcomeElements.length > 0) {
                        for (let i = 0; i < welcomeElements.length; i++) {
                            welcomeElements[i].textContent = name;
                        }
                    } else {
                        console.error("No elements with class 'welcome' found.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching name:", error);
                });
        } else {
            console.log("No token found in localStorage"); // Debug log
        }
    }

    updateWelcomeMessage(); // Call the function on page load

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                gender: document.getElementById("gender").value,
                email: document.getElementById("register-email").value,
                mobileNo: document.getElementById("mobileNo").value,
                password: document.getElementById("register-password").value,
                role: document.getElementById("role").value
            };

            fetch("http://localhost:8080/api/v1/auth/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.access_token) {
                        localStorage.setItem("token", data.access_token);
                        showAlert("Registration successful!", 'success');
                        redirectToUserPage();
                        document.getElementById("register-form").reset();
                        closeForm();
                    } else {
                        showAlert("Registration failed: " + (data.message || "Unknown error"), 'error');
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred during registration: " + error.message);
                });
        });
    }

    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const loginData = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };

            fetch("http://localhost:8080/api/v1/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.access_token) {
                        localStorage.setItem("token", data.access_token);
                        showAlert('Login successful!', 'success');
                        updateWelcomeMessage();
                        redirectToUserPage();
                        closeForm();
                    } else {
                        alert("Login failed: " + (data.message || "Unknown error"));
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred during login: " + error.message);
                });
        });
    }

    function redirectToUserPage() {
        window.location.href = "user-dashboard.html"; // Change this to your user's landing page
    }

    // Function to handle logout
    function logout() {
        localStorage.removeItem("token"); // Remove the token from localStorage
        window.location.href = "index.html"; // Redirect to index.html after logout
    }

    // Event listener for logout link
    const logoutLink = document.getElementById("logout-link");
    console.log("Logout link:", logoutLink); // Debug log
    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Logout link clicked"); // Debug log
            logout(); // Call logout function
        });
    } else {
        console.error("Logout link not found in the DOM.");
    }

    // open appointment data.
    const bookAppointmentButtons = document.querySelectorAll(".book-appointment-btn");
    bookAppointmentButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const token = localStorage.getItem("token");
            if (token) {
                // User is logged in, show the appointment form
                openForm(appointmentFormContainer);
                document.getElementById("register-form")
            } else {
                // User is not logged in, prompt for login
                openForm(loginFormContainer);
            }
        });
    });

    // Function to handle the appointment form submission
    const appointmentForm = document.getElementById("appointment-form");
    if (appointmentForm) {
        appointmentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to book an appointment.");
                return;
            }
            const appointmentData = {
                reason: document.getElementById("reason").value,
                dateOfBirth: document.getElementById("dateOfBirth").value,
                appointmentDate: document.getElementById("appointmentDate").value,
                appointmentTime: document.getElementById("appointmentTime").value,
                location: document.getElementById("location").value
            };

            fetch("http://localhost:8080/api/v1/patient/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(appointmentData)
            })
                .then(response => response.text())  // Get the response as text
                .then(text => {
                    let data;
                    try {
                        data = JSON.parse(text);  // Try to parse it as JSON
                    } catch (error) {
                        data = { message: text };  // If it fails, treat it as plain text
                    }

                    if (data.message) {
                        showAlert(data.message, 'success');
                        closeForm();
                    } else {
                        showAlert("Failed to book appointment: " + (data.message || "Unknown error"), 'error');
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    showAlert("An error occurred while booking the appointment: " + error.message, 'error');
                });
        });
    }

});


function showAlert(message, type) {
    const alertContainer = document.getElementById('custom-alert-container');
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    // Show the alert
    alert.style.display = 'block';

    // Remove the alert after 3 seconds
    setTimeout(() => {
        alert.style.display = 'none';
        alertContainer.removeChild(alert);
    }, 3000);
}

