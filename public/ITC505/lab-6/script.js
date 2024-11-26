
// Predefined list of participants for the Secret Santa (normalized to lowercase for consistency)
const participants = ['paul', 'troy', 'mark', 'ralph', 'roxanne', 'brook', 'daryll'];

// This will hold the assigned Secret Santa names
let assignments = {};

// Forbidden pairs: these cannot be assigned to each other
const forbiddenPairs = {
    'troy': 'paul',
    'paul': 'troy',
    'ralph': 'mark',
    'mark': 'ralph'
};

// Function to shuffle the participants list (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to handle drawing the Secret Santa
function drawName() {
    const nameInput = document.getElementById('nameInput').value.trim().toLowerCase(); // Normalize input to lowercase

    // Check if the name is valid and exists in the participants list
    if (!nameInput || !participants.includes(nameInput)) {
        document.getElementById('message').textContent = "Please enter a valid participant name.";
        return;
    }

    // If assignments are empty, shuffle participants and assign Secret Santa
    if (Object.keys(assignments).length === 0) {
        shuffleAndAssign();
    }

    // If name has already been assigned a Secret Santa, notify the user
    if (assignments[nameInput]) {
        document.getElementById('message').textContent = `${nameInput}, your Secret Santa is ${assignments[nameInput]}!`;
    } else {
        document.getElementById('message').textContent = "Please draw again or check your name.";
    }
}

// Function to shuffle the participants list and assign Secret Santa to each
function shuffleAndAssign() {
    let shuffledParticipants = [...participants];
    let assigned = false;
    let attempt = 0;

    // Keep trying to assign until no forbidden pairs are assigned
    while (!assigned && attempt < 100) { // limit the attempts to prevent infinite loop
        shuffleArray(shuffledParticipants);
        const newAssignments = {};

        // Assign Secret Santa based on shuffled list
        for (let i = 0; i < participants.length; i++) {
            let giver = participants[i];
            let receiver = shuffledParticipants[i];

            // Ensure no one is assigned to themselves
            if (giver === receiver || isForbiddenPair(giver, receiver)) {
                break; // If forbidden pair or self-assignment is detected, break the loop and reshuffle
            }

            newAssignments[giver] = receiver;
        }

        // If we successfully assigned everyone without breaking, we're done
        if (Object.keys(newAssignments).length === participants.length) {
            assignments = newAssignments;
            assigned = true;
        }

        attempt++;
    }

    // If we exceed attempts, something went wrong (shouldn't happen with correct constraints)
    if (attempt >= 100) {
        document.getElementById('message').textContent = "Something went wrong. Please refresh and try again.";
    }

    console.log(assignments); // Log assignments for debugging
}

// Helper function to check if a pair is forbidden
function isForbiddenPair(giver, receiver) {
    return forbiddenPairs[giver] === receiver || forbiddenPairs[receiver] === giver;
}