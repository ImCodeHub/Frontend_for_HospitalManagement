document.addEventListener("DOMContentLoaded", function(){
    console.log("Dom fully loaded  in password-rest");

    const forgotPasswordFormContainer = document.getElementById("forgot-password-form-container");
    const showForgotPasswordFormLink = document.getElementById("show-forgotpassword-form");
    const loginFormContainer = document.getElementById("login-form-container");
    const closeButtons = document.querySelectorAll(".close-button");

    function openForm(formContainer) {
        formContainer.style.display = "block";
        overlay.style.display = "block";
    }

    function closeForm() {
        if (loginFormContainer) loginFormContainer.style.display = "none";
        if (forgotPasswordFormContainer) forgotPasswordFormContainer.style.display = "none";
        document.getElementById("new-password-form").style.display = "none";

        overlay.style.display = "none";
    }

    if (showForgotPasswordFormLink) {
        showForgotPasswordFormLink.addEventListener("click", function (event) {
            event.preventDefault();
            closeForm();
            openForm(forgotPasswordFormContainer);
        });
    }

    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener("click", closeForm);
        });
    }


    function sendOtp(email) {
        userEmail = email;
        fetch('http://localhost:8080/api/v1/auth/getOtp/' + encodeURIComponent(email), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text()) // Get plain text response
            .then(text => {
                let data;
                try {
                    data = JSON.parse(text);
                } catch (error) {
                    data = { message: text };
                }
                // Check if response contains success indication
                if (data.message.includes("OTP has been sent")) {
                    showAlert(data.message, 'success');
                    document.getElementById("forgot-password-form").reset();

                    // Show the OTP form
                    document.getElementById("forgot-password-form").style.display = "none";
                    document.getElementById("otp-form").style.display = "block";
                } else {
                    showAlert("Failed to send OTP: " + (data.message || "unknown error"), 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Failed to send OTP. Please try again. ' + error.message, 'error');
            });
    }

    let userEmail = "";
    document.getElementById('send-otp-button').addEventListener('click', function () {
        var email = document.getElementById('forgot-email').value;
        if (email) {
            sendOtp(email);

        } else {
            showAlert('Please enter a valid email address.', 'error');
        }
    });

    document.getElementById('resend-otp-button').addEventListener('click', function () {
        if (userEmail) {
            sendOtp(userEmail);
        } else {
            showAlert('Please enter a valid email address.', 'error');
        }
    });

    document.getElementById('verify-otp-button').addEventListener('click', function() {
        var otp = document.getElementById('otp').value;
    
        if (otp) {
            verifyOtp(userEmail, otp);
        } else {
            showAlert('Please enter the OTP.', 'error');
        }
    });

    document.getElementById('update-password-button').addEventListener('click', function() {
        var newPassword = document.getElementById('new-password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
    
        if (newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                updatePassword(userEmail, newPassword);
            } else {
                showAlert('Passwords do not match.', 'error');
            }
        } else {
            showAlert('Please fill in all fields.', 'error');
        }
    });


    // Function to verify OTP
    function verifyOtp(email, otp) {
        fetch('http://localhost:8080/api/v1/auth/verifyOtp?email=' + encodeURIComponent(email) + '&otp=' + encodeURIComponent(otp), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data === true) {
                    showAlert('OTP verified successfully.', 'success');
                    document.getElementById("otp-form").reset();

                    // Show the new password form
                    document.getElementById("otp-form").style.display = "none";
                    document.getElementById("new-password-form").style.display = "block";
                } else {
                    showAlert('OTP verification failed. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('OTP verification failed. Please try again. ' + error.message, 'error');
            });
    }


    function updatePassword(email, newPassword) {
        fetch('http://localhost:8080/api/v1/auth/updatePassword?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(newPassword), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json()) // Expecting a JSON response
        .then(data => {
            if (data) { // Adjust based on your response structure
                showAlert('Password updated successfully', 'success');
                document.getElementById("new-password-form").reset();
                closeForm();
            } else {
                showAlert('Password update failed. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Password update failed. Please try again. ' + error.message, 'error');
        });
    }
    



});