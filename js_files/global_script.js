//*************************************************************************//
// global_script.js
// Written by: Idrees Munshi
// Global script for the entire project
//
//*************************************************************************//
console.log("%cglobal_script.js loaded", "color: red; background-color: black;");

//*************************************************************************//
// Variables
//
//*************************************************************************//
instructionsShown = false;


//*************************************************************************//
// showInstructions();
// Displays instructions for the game to the user
// Input: N/A
// Output: N/A
//*************************************************************************//
function showInstructions() {
    if (instructionsShown == false) {
        // Local variables
        let instructionText = document.createElement('p');
        let startButton = document.createElement('button');
        let subtitleText = document.getElementById('p_subtitle');
        
        // Remove title
        document.getElementById('h_title').remove();

        // Update subtitle text and add instruction text to DOM
        subtitleText.innerHTML = '"Time and tide wait for no one."' + '<br>' +
            " - Geoffrey Chaucer ";
        subtitleText.style.fontSize = '2.5em';
        
        instructionText.innerHTML =
            'Move left and right with A and D or arrow keys' +  '<br>' +
            'and jump with the spacebar.' +  '<br>' +
            'Hold (some key) to move time forward' +  '<br>' +
            'All you must do is make it home.' + '<br>' +
            'I pray your journey goes well...';
        instructionText.id = 'p_instructionText';
        document.getElementById('d_instructionsContainer').appendChild(instructionText);

        // Create start button and add to DOM
        startButton.innerHTML = "I'm ready.";
        startButton.id = 'b_startButton';
        startButton.onclick = () => {
            document.getElementById('d_instructionsContainer').removeChild(instructionText);
            document.getElementById('d_instructionsContainer').removeChild(startButton);
            subtitleText.innerHTML = 'Remember, time is precious.' + '<br>' +
                'Don\'t waste it.';
            subtitleText.style.fontSize = '4em';
            subtitleText.style.padding = '10%';
            subtitleText.style.animation = 'fadeOut 5s ease';
            setTimeout(() => {
                subtitleText.remove();
                window.location.href = 'game_playScreen.html';
            }, 4000);
        }
        document.getElementById('d_instructionsContainer').appendChild(startButton);
        

        instructionsShown = true;
    }
}

// When button is pressed to start game, or between levels, have a screen which shows messages like:
// "Remember, your life is precious. Don't waste it."

//*************************************************************************//
// END OF FILE
//
//*************************************************************************//