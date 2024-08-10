document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById("overlay");
    const doctorDetailsBox = document.getElementById("doctor-details-box");

    function openDoctorDetailsBox() {
        doctorDetailsBox.style.display = "block";
        overlay.style.display = "block";
    }

    function closeDoctorDetailsBox() {
        doctorDetailsBox.style.display = "none";
        overlay.style.display = "none";
    }

    function fetchDoctorDetails(doctorId) {
        fetch(`http://localhost:8080/api/v1/patient/doctor/${doctorId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const doctor = data[0];
                const doctorDetails = `
                <div id ="doctor-box">
                    <img src="${doctor.photo}" alt="Doctor Photo">
                    <div>
                        <h1>Dr. ${doctor.firstName} ${doctor.lastName}</h1>
                        <p> ${doctor.specialization}</p>
                        <p>${doctor.education}</p>
                    </div>
                </div>    
                    <p style="margin-top:10px"><strong>Experience:</strong> ${doctor.experience} years</p>
                    <p style="font-size:13px; text-align:left;">${doctor.about}</p>
                `;
                document.getElementById('doctor-details-box').innerHTML = doctorDetails;
                openDoctorDetailsBox();
            } else {
                document.getElementById('doctor-details-box').innerHTML = '<p>No doctor details found.</p>';
            }
        })
        .catch(error => console.error('Error fetching doctor details:', error));
    }    

    // Attach click event listener to doctor elements
    document.addEventListener('click', function(event) {
        if (event.target.closest('.doctor')) {
            const doctorId = event.target.closest('.doctor').id;
            fetchDoctorDetails(doctorId);
        } else if (!event.target.closest('#doctor-details-box')) {
            closeDoctorDetailsBox();
        }
    });
});
