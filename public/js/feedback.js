
// Simple event Listener that displays the user's name on the screen. Later more logic will be added to check 
// against the database if the user actually exists and prompt the appropriate message.
// No need for logic to check if both fields have values because both fields are required before hitting the Log in button.
document.querySelector('.login-box form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = event.target.username.value;

    // Hide the login form
    document.querySelector('.login-box').style.display = 'none';

    // Update the username display
    const usernameContainer = document.querySelector('.username-container');
    usernameContainer.innerHTML = `${username} <i id="user" class="fa-solid fa-user" style="color: #ffffff;"></i>`;

    // Display the welcome message and logout button
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = 'welcome-container';
    welcomeContainer.innerHTML = `
        <div class="welcome-message">
            Welcome, <strong>${username}!</strong>
        </div>
        <button id="logoutButton">Logout</button>
    `;
    document.querySelector('.box2').appendChild(welcomeContainer);

    // Add event listener for logout
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Remove welcome container
        welcomeContainer.remove();

        // Reset the username display
        usernameContainer.innerHTML = `Username <i id="user" class="fa-solid fa-user" style="color: #ffffff;"></i>`;

        // Show the login form again
        document.querySelector('.login-box').style.display = 'block';
    });
});


// Function to mark the appropriate recipient of the feedback.
function toggleColor(selectedButtonId, otherButtonId) {
    const selectedButton = document.getElementById(selectedButtonId);
    const otherButton = document.getElementById(otherButtonId);
    selectedButton.classList.add('selected');
    otherButton.classList.remove('selected');
}

// Event listeners for the recipient buttons
document.getElementById("DjButton").addEventListener("click", function () {
    toggleColor('DjButton', 'ProducerButton'); 
});

document.getElementById("ProducerButton").addEventListener("click", function () {
    toggleColor('ProducerButton', 'DjButton'); 
});

// Notify user that message was sent.
document.getElementById("sendButton").addEventListener("click", sendFeedback);


// Send Feedback function
function sendFeedback() {
    const feedbackText = document.getElementById("feedbackText").value;
    const isDjSelected = document.getElementById("DjButton").classList.contains('selected');
    const isProducerSelected = document.getElementById("ProducerButton").classList.contains('selected');

    if (feedbackText.trim() === "") {
        alert('Please write your feedback.');
        return;
    }

    if (!isDjSelected && !isProducerSelected) {
        alert('Please select a recipient.');
        return;
    }

    const recipient = isDjSelected ? 'dj' : 'producer';
    fetch(`/send-feedback/${recipient}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackText })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("feedbackText").value = '';
                alert("Feedback sent!");
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending feedback.');
        });
}





