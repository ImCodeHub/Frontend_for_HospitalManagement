const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            gender: document.getElementById("gender").value,
            email: document.getElementById("register-email").value,
            mobileNo: document.getElementById("mobileNo").value,
            password: document.getElementById("register-password").value,
            address: document.getElementById("address").value,
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
                alert("Registration successful!");
                redirectToUserPage();
                closeForm();
            } else {
                alert("Registration failed: " + (data.message || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred during registration: " + error.message);
        });