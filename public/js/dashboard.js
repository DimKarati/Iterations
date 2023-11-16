
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

    // Add event listener for logout.
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Remove welcome container.
        welcomeContainer.remove();

        // Reset the username display.
        usernameContainer.innerHTML = `Username <i id="user" class="fa-solid fa-user" style="color: #ffffff;"></i>`;

        // Show the login form again.
        document.querySelector('.login-box').style.display = 'block';
    });
});



// Function that compares The Producer's list and Dj's.
// Later when the database is added, the client will be able to pick a desired date and display the lists.
document.addEventListener('DOMContentLoaded', function () {
    // Grab all songs from the DJ and Producer lists
    const djSongs = Array.from(document.querySelector('.song-window:not(.producer) ul').children);
    const producerSongs = Array.from(document.querySelector('.song-window.producer ul').children);

    // Convert the Producer's song list into a set for easier lookup.
    const producerSongSet = new Set(producerSongs.map(song => song.querySelector('.song-title').textContent));

    // Iterate over each song in the DJ's list.
    djSongs.forEach(song => {
        const songTitle = song.querySelector('.song-title').textContent;

        // If the song title from DJ's list exists in the Producer's song set, highlight it green; otherwise, highlight it red
        if (producerSongSet.has(songTitle)) {
            song.style.color = 'green';
        } else {
            song.style.color = 'red';
        }
    });
});


// Open modal
document.querySelector('.report-button').addEventListener('click', function () {
    document.getElementById('reportModal').style.display = 'block';
});

// Close modal on submit and print the report
document.getElementById('reportForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = event.target.reportTitle.value;
    const summary = event.target.reportSummary.value;
    const date = event.target.reportDate.value;

    console.log(`Report Title: ${title}`);
    console.log(`Summary: ${summary}`);
    console.log(`Created on: ${date}`);

    // Close modal
    document.getElementById('reportModal').style.display = 'none';
});


document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('reportModal').style.display = 'none';
});


// Function to display the date.
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('reportDateDisplay').innerText = new Date().toLocaleDateString();
});

// Function to display the report is submit.
document.getElementById('submit-report').addEventListener('click', function () {
    document.getElementById('reportModal').style.display = 'none';
    alert("Report Submitted");
});



