let currentRotation = 0;
let currentAttempt = 0;
let currentEye = "right";
let currentTest = "acuity";
let attempts = 0;
let correctAnswers = 0;
let letterSize = 200;
let rightEyeResults = { correct: 0, incorrect: 0 };
let leftEyeResults = { correct: 0, incorrect: 0 };
let previousRotation = null;
let astigmatismResults = {
  right: { correct: 0, incorrect: 0 },
  left: { correct: 0, incorrect: 0 },
};
let currentAstigmatismImage = 1;

// Acuity test variables
let currentSizeLevel = 0;
let sizeLevels = [200, 160, 100, 50, 32, 20, 10];
let attemptsAtCurrentSize = 0;
let correctAtCurrentSize = 0;
let totalAttempts = 0;
let additionalAttempts = 0;
const MAX_TOTAL_ATTEMPTS = 16;
const MAX_ADDITIONAL_ATTEMPTS = 2;

// Size calibration variables
let currentSize = 1;
let calibrationSettings = {
  size: 1,
};

// Add Landolt C test variables
let landoltResults = {
  right: { correct: 0, incorrect: 0 },
  left: { correct: 0, incorrect: 0 },
};
let currentLandoltRotation = 0;
let landoltContrast = 100;
let landoltAttempts = 0;

// Contrast Test Variables
let currentContrast = 100;
let contrastTestResults = {
  rightEye: { correct: 0, incorrect: 0, lowestVisible: 0.1, attempts: 0 },
  leftEye: { correct: 0, incorrect: 0, lowestVisible: 0.1, attempts: 0 },
};
let isRightEyeContrast = true;
let currentContrastRotation = 0;
let previousContrastRotation = null;
let currentContrastSize = 200; // Starting size in pixels
const CONTRAST_ATTEMPTS_PER_EYE = 10;

const letterE = document.getElementById("letterE");
const result = document.getElementById("result");
const attemptsCount = document.getElementById("attemptsCount");
const progressBar = document.querySelector(".progress");
const steps = document.querySelectorAll(".step");
const astigmatismImage = document.getElementById("astigmatismImage");

// Function to show a specific screen
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}

// Function to update the letter size
function updateLetterSize() {
  const baseSize = 200;
  const sizeReduction = Math.floor(attempts / 2) * 45;
  const newSize = Math.max(20, baseSize - sizeReduction);

  letterE.style.width = `${newSize}px`;
  letterE.style.height = `${newSize}px`;
}

// Function to update attempts count
function updateAttemptsCount() {
  attemptsCount.textContent = currentAttempt;
}

// Function to rotate the letter E
function rotateLetter() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousRotation);

  currentRotation = newRotation;
  previousRotation = newRotation;
  letterE.style.transform = `rotate(${currentRotation}deg)`;
}

// Function to check the answer
function checkAnswer(direction) {
  let correctDirection;

  switch (currentRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  const isCorrect = direction === correctDirection;
  attemptsAtCurrentSize++;
  totalAttempts++;

  if (isCorrect) {
    correctAtCurrentSize++;
    if (currentEye === "right") {
      rightEyeResults.correct++;
    } else {
      leftEyeResults.correct++;
    }
  } else {
    if (currentEye === "right") {
      rightEyeResults.incorrect++;
    } else {
      leftEyeResults.incorrect++;
    }
  }

  console.log(
    `Attempt ${attemptsAtCurrentSize} at size ${sizeLevels[currentSizeLevel]}, Correct: ${correctAtCurrentSize}, Total attempts: ${totalAttempts}`
  );

  // Check if we've reached maximum attempts
  if (totalAttempts >= MAX_TOTAL_ATTEMPTS) {
    console.log("Reached maximum attempts, moving to next eye or test");
    if (currentEye === "right") {
      currentEye = "left";
      currentSizeLevel = 0;
      attemptsAtCurrentSize = 0;
      correctAtCurrentSize = 0;
      totalAttempts = 0;
      additionalAttempts = 0;
      showScreen("leftEyeInstructions");
      return;
    } else {
      currentTest = "astigmatism";
      showScreen("astigmatismInstructions");
      return;
    }
  }

  // Logic for size progression
  if (attemptsAtCurrentSize >= 2) {
    console.log(
      `Completed 2 attempts at size ${sizeLevels[currentSizeLevel]}, Correct: ${correctAtCurrentSize}`
    );

    if (correctAtCurrentSize === 2) {
      // All correct, move to next size
      console.log(
        `All correct at size ${sizeLevels[currentSizeLevel]}, moving to next level`
      );
      currentSizeLevel++;
      attemptsAtCurrentSize = 0;
      correctAtCurrentSize = 0;
      additionalAttempts = 0;
    } else {
      // Less than 2 correct, give additional attempts
      if (additionalAttempts < MAX_ADDITIONAL_ATTEMPTS) {
        console.log(
          `Less than 2 correct, giving additional attempt ${
            additionalAttempts + 1
          }`
        );
        additionalAttempts++;
        attemptsAtCurrentSize = 0;
        correctAtCurrentSize = 0;
      } else {
        // Failed additional attempts, stop at current level
        console.log(
          `Failed additional attempts at size ${sizeLevels[currentSizeLevel]}, stopping test`
        );
        if (currentEye === "right") {
          currentEye = "left";
          currentSizeLevel = 0;
          attemptsAtCurrentSize = 0;
          correctAtCurrentSize = 0;
          totalAttempts = 0;
          additionalAttempts = 0;
          showScreen("leftEyeInstructions");
          return;
        } else {
          currentTest = "astigmatism";
          showScreen("astigmatismInstructions");
          return;
        }
      }
    }
  }

  // Update letter size
  letterSize = sizeLevels[currentSizeLevel];
  console.log(`Setting new letter size: ${letterSize}`);
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  letterE.style.transform = `rotate(${currentRotation}deg)`;

  rotateLetter();
  updateProgress();
}

// Function to show results
function showResults() {
  // Calculate final scores
  const rightEyeAcuity = calculateSnellenFraction(rightEyeResults.correct);
  const leftEyeAcuity = calculateSnellenFraction(leftEyeResults.correct);

  // Calculate contrast scores based on lowest visible contrast
  const rightEyeContrast = Math.max(
    0.1,
    100 - contrastTestResults.rightEye.correct * 19
  );
  const leftEyeContrast = Math.max(
    0.1,
    100 - contrastTestResults.leftEye.correct * 19
  );

  // Create and show summary view
  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = `
    <div class="results-summary">
      <h2>Test Results Summary</h2>
      <div class="summary-content">
        <div class="summary-section">
          <h3>Visual Acuity</h3>
          <p>Right Eye: ${rightEyeAcuity}</p>
          <p>Left Eye: ${leftEyeAcuity}</p>
        </div>
        <div class="summary-section">
          <h3>Astigmatism</h3>
          <p>Right Eye: ${
            astigmatismResults.right.correct >= 1
              ? "Normal"
              : "Possible Astigmatism"
          }</p>
          <p>Left Eye: ${
            astigmatismResults.left.correct >= 1
              ? "Normal"
              : "Possible Astigmatism"
          }</p>
        </div>
        <div class="summary-section">
          <h3>Contrast Sensitivity</h3>
          <p>Right Eye: ${rightEyeContrast.toFixed(1)}%</p>
          <p>Left Eye: ${leftEyeContrast.toFixed(1)}%</p>
        </div>
        <button onclick="restartTest()" class="start-button">Take Test Again</button>
      </div>
    </div>
  `;

  showScreen("resultsScreen");
  updateProgress();
}

// Function to restart the test
function restartTest() {
  // Reset all test variables
  currentEye = "right";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  rightEyeResults = { correct: 0, incorrect: 0 };
  leftEyeResults = { correct: 0, incorrect: 0 };
  astigmatismResults = {
    right: { correct: 0, incorrect: 0 },
    left: { correct: 0, incorrect: 0 },
  };
  landoltResults = {
    right: { correct: 0, incorrect: 0 },
    left: { correct: 0, incorrect: 0 },
  };
  landoltContrast = 100;
  landoltAttempts = 0;

  // Reset calibration
  currentSize = 1;
  document.getElementById("sizeValue").textContent = "100%";
  document.getElementById("cardReference").style.transform = "scale(1)";
  document.getElementById("sizeSlider").value = 100;

  // Reset letter size
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;

  // Reset contrast test variables
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults = {
    rightEye: { correct: 0, incorrect: 0, lowestVisible: 0.1, attempts: 0 },
    leftEye: { correct: 0, incorrect: 0, lowestVisible: 0.1, attempts: 0 },
  };
  isRightEyeContrast = true;

  // Reset contrast image
  document.documentElement.style.setProperty("--contrast", "100%");

  // Show welcome screen
  showScreen("welcomeScreen");
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const acuityStep = document.getElementById("acuityStep");
  const astigmatismStep = document.getElementById("astigmatismStep");
  const contrastStep = document.getElementById("contrastStep");

  // Reset all steps
  [acuityStep, astigmatismStep, contrastStep].forEach((step) => {
    step.classList.remove("current", "completed");
  });

  if (currentTest === "acuity") {
    acuityStep.classList.add("current");
  } else if (currentTest === "astigmatism") {
    acuityStep.classList.add("completed");
    astigmatismStep.classList.add("current");
  } else if (currentTest === "contrast") {
    acuityStep.classList.add("completed");
    astigmatismStep.classList.add("completed");
    contrastStep.classList.add("current");
  }
}

// Function to start the test
function startTest() {
  console.log("Starting test for right eye");
  currentEye = "right";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  showScreen("testScreen");
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  rotateLetter();
  updateProgress();
}

// Function to start left eye test
function startLeftEyeTest() {
  console.log("Starting test for left eye");
  currentEye = "left";
  currentTest = "acuity";
  currentSizeLevel = 0;
  attemptsAtCurrentSize = 0;
  correctAtCurrentSize = 0;
  totalAttempts = 0;
  additionalAttempts = 0;
  letterSize = sizeLevels[0];

  showScreen("testScreen");
  letterE.style.width = `${letterSize}px`;
  letterE.style.height = `${letterSize}px`;
  rotateLetter();
  updateProgress();
}

// Handle astigmatism test
function startAstigmatismTest() {
  console.log("Starting astigmatism test for right eye");
  currentTest = "astigmatism";
  currentEye = "right";
  attempts = 0;
  correctAnswers = 0;
  showAstigmatismImage();
  showScreen("astigmatismTest");
  updateProgress();
}

// Start left eye astigmatism test
function startLeftEyeAstigmatismTest() {
  console.log("Starting astigmatism test for left eye");
  currentEye = "left";
  currentTest = "astigmatism";
  attempts = 0;
  correctAnswers = 0;
  showAstigmatismImage();
  showScreen("astigmatismTest");
  updateProgress();
}

// Show random astigmatism test image
function showAstigmatismImage() {
  currentAstigmatismImage = Math.floor(Math.random() * 3) + 1; // Random number 1-3
  astigmatismImage.src = `eyeTest/assets/astigmatism${currentAstigmatismImage}.png`;
  console.log("Showing astigmatism image:", currentAstigmatismImage);
}

// Handle astigmatism answer
function handleAstigmatismAnswer(isCorrect) {
  console.log("Handling astigmatism answer:", {
    isCorrect,
    currentEye,
    attempts,
    currentAstigmatismImage,
  });

  // For image 1, "Yes" is correct (all lines are equal)
  // For images 2 and 3, "No" is correct (lines are different)
  const correctAnswer = currentAstigmatismImage === 1 ? true : false;

  if (isCorrect === correctAnswer) {
    correctAnswers++;
    astigmatismResults[currentEye].correct++;
  } else {
    astigmatismResults[currentEye].incorrect++;
  }

  attempts++;

  if (attempts >= 3) {
    console.log("Reached 3 astigmatism attempts");
    if (currentEye === "right") {
      console.log("Switching to left eye for astigmatism");
      currentEye = "left";
      attempts = 0;
      correctAnswers = 0;
      showScreen("leftEyeAstigmatismInstructions");
    } else {
      console.log("Moving to contrast test");
      showScreen("rightEyeContrastInstructions");
    }
  } else {
    showAstigmatismImage();
  }
  updateProgress();
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Preload images
  const images = [
    "eyeTest/assets/C.png",
    "eyeTest/assets/astigmatism1.png",
    "eyeTest/assets/astigmatism2.png",
    "eyeTest/assets/astigmatism3.png",
  ];

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Hide all screens except welcome
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  document.getElementById("welcomeScreen").classList.remove("hidden");

  // Initialize size slider with adjusted scale
  const sizeSlider = document.getElementById("sizeSlider");
  const cardReference = document.getElementById("cardReference");
  const baseScale = 1.014;

  function updateScale(value) {
    const scale = value / 100;
    currentSize = baseScale * scale;
    document.getElementById("sizeValue").textContent = `${value}%`;
    cardReference.style.transform = `scale(${currentSize})`;
  }

  // Set initial values immediately
  sizeSlider.value = 100;
  currentSize = baseScale;
  updateScale(100);

  // Add event listeners
  sizeSlider.addEventListener("input", () =>
    updateScale(parseInt(sizeSlider.value))
  );
  sizeSlider.addEventListener("change", () =>
    updateScale(parseInt(sizeSlider.value))
  );

  // Add keyboard controls
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      adjustSize("smaller");
    } else if (e.key === "ArrowRight") {
      adjustSize("larger");
    }
  });

  // Initialize progress
  updateProgress();
});

function adjustSize(direction) {
  const sizeSlider = document.getElementById("sizeSlider");
  const currentValue = parseInt(sizeSlider.value);

  if (direction === "larger") {
    sizeSlider.value = Math.min(130, currentValue + 1);
  } else {
    sizeSlider.value = Math.max(70, currentValue - 1);
  }

  // Trigger the input event to update the display
  sizeSlider.dispatchEvent(new Event("input"));
}

// Function to calculate Snellen fraction
function calculateSnellenFraction(correctAnswers) {
  // Convert correct answers to Snellen fraction based on size levels
  // sizeLevels = [200, 160, 100, 50, 32, 20, 10]
  const snellenValues = {
    16: "20/20", // Perfect vision
    15: "20/25",
    14: "20/32",
    13: "20/40",
    12: "20/50",
    11: "20/63",
    10: "20/80",
    9: "20/100",
    8: "20/125",
    7: "20/160",
    6: "20/200", // Worst possible result
    5: "20/200",
    4: "20/200",
    3: "20/200",
    2: "20/200",
    1: "20/200",
    0: "20/200",
  };

  // Ensure we don't exceed the maximum possible correct answers
  const adjustedAnswers = Math.min(correctAnswers, 16);
  return snellenValues[adjustedAnswers] || "20/200";
}

// Start the calibration
function startCalibration() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("calibrationScreen").classList.remove("hidden");
}

function updateContrast() {
  const contrastSlider = document.getElementById("contrastSlider");
  const contrastPreview = document.getElementById("contrastPreview");
  currentContrast = contrastSlider.value;

  // Convert contrast value to gray level
  const grayLevel = Math.round((currentContrast / 100) * 255);
  const grayColor = `rgb(${grayLevel}, ${grayLevel}, ${grayLevel})`;

  // Update preview with current gray level
  contrastPreview.style.backgroundColor = grayColor;
  contrastPreview.textContent = `${currentContrast}%`;
}

function finishCalibration() {
  // Save calibration settings
  calibrationSettings = {
    size: currentSize,
  };

  // Apply settings to the test
  document.documentElement.style.setProperty("--test-size", `${currentSize}`);

  // Show right eye instructions instead of starting test directly
  document.getElementById("calibrationScreen").classList.add("hidden");
  document.getElementById("rightEyeInstructions").classList.remove("hidden");
}

// Initialize the test
showScreen("rightEyeInstructions");

document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
});

// Add Landolt C test functions
function startLandoltTest() {
  currentTest = "landolt";
  currentEye = "right";
  landoltAttempts = 0;
  landoltContrast = 100;
  showScreen("landoltTest");
  rotateLandoltC();
  updateProgress();
}

function startLeftEyeLandoltTest() {
  currentTest = "landolt";
  currentEye = "left";
  landoltAttempts = 0;
  landoltContrast = 100;
  showScreen("landoltTest");
  rotateLandoltC();
  updateProgress();
}

function rotateLandoltC() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousRotation);

  currentLandoltRotation = newRotation;
  previousRotation = newRotation;

  // Calculate size reduction
  const sizeReduction = (landoltAttempts / 10) * 0.5;
  const currentSize = 1 - sizeReduction;

  // Calculate contrast reduction (from 100% to 2%)
  landoltContrast = Math.max(2, 100 - landoltAttempts * 9.8);

  const landoltC = document.getElementById("landoltC");
  landoltC.style.transform = `rotate(${currentLandoltRotation}deg) scale(${currentSize})`;
  landoltC.style.opacity = `${landoltContrast / 100}`;
}

function checkLandoltAnswer(direction) {
  let correctDirection;

  switch (currentLandoltRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  if (direction === correctDirection) {
    landoltResults[currentEye].correct++;
  } else {
    landoltResults[currentEye].incorrect++;
  }

  landoltAttempts++;

  if (landoltAttempts >= 10) {
    if (currentEye === "right") {
      currentEye = "left";
      landoltAttempts = 0;
      showScreen("leftEyeLandoltInstructions");
    } else {
      showResults();
    }
  } else {
    rotateLandoltC();
  }
  updateProgress();
}

function startContrastTest() {
  isRightEyeContrast = true;
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults.rightEye.attempts = 0;
  document
    .getElementById("rightEyeContrastInstructions")
    .classList.add("hidden");
  document.getElementById("contrastTest").classList.remove("hidden");
  document.getElementById("contrastImage").src = "eyeTest/assets/C.png";
  rotateContrastC();
  updateContrastImage();
}

function startLeftEyeContrastTest() {
  isRightEyeContrast = false;
  currentContrast = 100;
  currentContrastSize = 200;
  contrastTestResults.leftEye.attempts = 0;
  document
    .getElementById("leftEyeContrastInstructions")
    .classList.add("hidden");
  document.getElementById("contrastTest").classList.remove("hidden");
  document.getElementById("contrastImage").src = "eyeTest/assets/C.png";
  rotateContrastC();
  updateContrastImage();
}

function rotateContrastC() {
  const rotations = [0, 90, 180, 270];
  let newRotation;

  do {
    newRotation = rotations[Math.floor(Math.random() * rotations.length)];
  } while (newRotation === previousContrastRotation);

  currentContrastRotation = newRotation;
  previousContrastRotation = newRotation;
  document.getElementById(
    "contrastImage"
  ).style.transform = `rotate(${currentContrastRotation}deg)`;
}

function updateContrastImage() {
  const contrastImage = document.getElementById("contrastImage");
  // Apply both opacity and contrast for better effect
  contrastImage.style.filter = `contrast(${currentContrast}%) opacity(${
    currentContrast / 100
  })`;
  contrastImage.style.width = `${currentContrastSize}px`;
  contrastImage.style.height = `${currentContrastSize}px`;
}

function handleContrastAnswer(direction) {
  const eye = isRightEyeContrast ? "rightEye" : "leftEye";
  let correctDirection;

  switch (currentContrastRotation) {
    case 0:
      correctDirection = "right";
      break;
    case 90:
      correctDirection = "down";
      break;
    case 180:
      correctDirection = "left";
      break;
    case 270:
      correctDirection = "up";
      break;
  }

  const isCorrect = direction === correctDirection;
  contrastTestResults[eye].attempts++;

  if (isCorrect) {
    contrastTestResults[eye].correct++;
    // Reduce contrast by 19% each time
    currentContrast = Math.max(3, currentContrast - 19);
    // Reduce size by 30px each time
    currentContrastSize = Math.max(40, currentContrastSize - 30);
  } else {
    contrastTestResults[eye].incorrect++;
    // Increase contrast by 10% if wrong
    currentContrast = Math.min(100, currentContrast + 10);
    // Increase size by 15px if wrong
    currentContrastSize = Math.min(240, currentContrastSize + 15);
  }

  if (contrastTestResults[eye].attempts >= CONTRAST_ATTEMPTS_PER_EYE) {
    finishContrastTest();
    return;
  }

  updateContrastImage();
  rotateContrastC();
}

function finishContrastTest() {
  document.getElementById("contrastTest").classList.add("hidden");

  if (isRightEyeContrast) {
    document
      .getElementById("leftEyeContrastInstructions")
      .classList.remove("hidden");
  } else {
    showResults();
  }
}

// Update the HTML for contrast test
document.getElementById("contrastTest").innerHTML = `
  <h1>Contrast Sensitivity Test 👁️</h1>
  <div class="test-area">
    <div class="contrast-container">
      <img src="eyeTest/assets/C.png" alt="Contrast Test" id="contrastImage" />
    </div>
    <div class="controls">
      <p class="question">Which way is the C pointing? 🤔</p>
      <div class="buttons">
        <button onclick="handleContrastAnswer('up')" class="direction-btn">⬆️</button>
        <button onclick="handleContrastAnswer('right')" class="direction-btn">➡️</button>
        <button onclick="handleContrastAnswer('down')" class="direction-btn">⬇️</button>
        <button onclick="handleContrastAnswer('left')" class="direction-btn">⬅️</button>
      </div>
    </div>
  </div>
`;

// Update the instructions for test 2 and 3
document.getElementById("rightEyeContrastInstructions").innerHTML = `
  <h1>Contrast Sensitivity Test - Right Eye 👁️</h1>
  <div class="instruction-box">
    <p class="instruction-text">
      This test measures your ability to distinguish objects from their background.
      You will see a letter C that will become progressively harder to see.
    </p>
    <ul class="instruction-list">
      <li>Cover your left eye completely</li>
      <li>Keep your right eye open and focused on the screen</li>
      <li>Tell us which way the C is pointing using the arrow buttons</li>
      <li>The C will become harder to see as you get answers correct</li>
      <li>If you can't see the C clearly, you can get it wrong to make it more visible</li>
      <li>Take your time and be as accurate as possible</li>
    </ul>
    <button onclick="startContrastTest()" class="start-button">Start Test</button>
  </div>
`;

document.getElementById("leftEyeContrastInstructions").innerHTML = `
  <h1>Contrast Sensitivity Test - Left Eye 👁️</h1>
  <div class="instruction-box">
    <p class="instruction-text">
      Now we'll test your left eye's contrast sensitivity.
      The test will be the same as before, but with your left eye.
    </p>
    <ul class="instruction-list">
      <li>Cover your right eye completely</li>
      <li>Keep your left eye open and focused on the screen</li>
      <li>Tell us which way the C is pointing using the arrow buttons</li>
      <li>The C will become harder to see as you get answers correct</li>
      <li>If you can't see the C clearly, you can get it wrong to make it more visible</li>
      <li>Take your time and be as accurate as possible</li>
    </ul>
    <button onclick="startLeftEyeContrastTest()" class="start-button">Start Test</button>
  </div>
`;

// Update the instructions for astigmatism test
document.getElementById("astigmatismInstructions").innerHTML = `
  <h1>Astigmatism Test - Right Eye 👁️</h1>
  <div class="instruction-box">
    <p class="instruction-text">
      This test helps detect astigmatism by checking if you see lines equally clearly in all directions.
      You will see a series of lines that may appear different in clarity.
    </p>
    <ul class="instruction-list">
      <li>Cover your left eye completely</li>
      <li>Keep your right eye open and focused on the screen</li>
      <li>Look at the center of the image</li>
      <li>Tell us if all the lines appear equally clear and sharp</li>
      <li>If some lines appear blurrier or less distinct than others, select "No"</li>
      <li>If all lines appear equally clear and sharp, select "Yes"</li>
      <li>Take your time to make a careful observation</li>
    </ul>
    <button onclick="startAstigmatismTest()" class="start-button">Start Test</button>
  </div>
`;

document.getElementById("leftEyeAstigmatismInstructions").innerHTML = `
  <h1>Astigmatism Test - Left Eye 👁️</h1>
  <div class="instruction-box">
    <p class="instruction-text">
      Now we'll test your left eye for astigmatism.
      The test will be the same as before, but with your left eye.
    </p>
    <ul class="instruction-list">
      <li>Cover your right eye completely</li>
      <li>Keep your left eye open and focused on the screen</li>
      <li>Look at the center of the image</li>
      <li>Tell us if all the lines appear equally clear and sharp</li>
      <li>If some lines appear blurrier or less distinct than others, select "No"</li>
      <li>If all lines appear equally clear and sharp, select "Yes"</li>
      <li>Take your time to make a careful observation</li>
    </ul>
    <button onclick="startLeftEyeAstigmatismTest()" class="start-button">Start Test</button>
  </div>
`;

// Update the instructions for right eye test
document.getElementById("rightEyeInstructions").innerHTML = `
  <h1>Eye Test Adventure! 👀</h1>
  <div class="instruction-box">
    <p class="instruction-text">
      Let's test your right eye first! Here's what to do:
    </p>
    <ul class="instruction-list">
      <li>Cover your left eye with your hand ✋</li>
      <li>Stand 1 meter away from the screen</li>
      <li>You'll see a letter E pointing in different directions</li>
      <li>Click the arrow button that matches the direction the E is pointing</li>
      <li>You'll have multiple attempts at each size</li>
      <li>Try your best to identify the direction correctly!</li>
    </ul>
    <button onclick="startTest()" class="start-button">Start the Adventure! 🚀</button>
  </div>
`;
