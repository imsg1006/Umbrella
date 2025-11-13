// ========================================
// DOM Element References
// ========================================
const colorSwatches = document.querySelectorAll('.color-swatch');
const umbrellaImages = document.querySelectorAll('.umbrella-image');
const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const logoOverlay = document.getElementById('logoOverlay');
const overlayLogoImage = document.getElementById('overlayLogoImage');
const logoPreviewBox = document.getElementById('logoPreviewBox');
const logoPreviewImage = document.getElementById('logoPreviewImage');
const removeLogoButton = document.getElementById('removeLogoButton');
const body = document.body;

// ========================================
// Application State
// ========================================
let currentColor = 'blue';
let uploadedLogo = null;

// ========================================
// Color Management Functions
// ========================================

/**
 * Changes the umbrella color and updates the theme
 * This function handles:
 * - Switching umbrella images
 * - Updating color swatch active states
 * - Changing background theme
 * 
 * @param {string} color - The color to switch to (pink, blue, yellow)
 */
function changeUmbrellaColor(color) {
    // Update current color state
    currentColor = color;

    // Hide all umbrella images
    umbrellaImages.forEach(img => {
        img.classList.add('hidden');
    });

    // Show selected umbrella image
    const selectedUmbrella = document.getElementById(`umbrella-${color}`);
    if (selectedUmbrella) {
        selectedUmbrella.classList.remove('hidden');
    }

    // Update active state on color swatches
    colorSwatches.forEach(swatch => {
        swatch.classList.remove('active');
        if (swatch.dataset.color === color) {
            swatch.classList.add('active');
        }
    });

    // Change body theme class for background gradient and button colors
    body.className = `theme-${color}`;
}

// ========================================
// Logo Upload Functions
// ========================================

/**
 * Validates uploaded file against requirements
 * Checks for:
 * - Correct file type (.png, .jpg, .jpeg)
 * - File size under 5MB
 * 
 * @param {File} file - The file to validate
 * @returns {Object} Object with isValid boolean and error message if invalid
 */
function validateFile(file) {
    // Check if file exists
    if (!file) {
        return { isValid: false, error: 'No file selected.' };
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: 'Please upload a .png or .jpg file only.' 
        };
    }

    // Validate file size (5MB maximum)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: 'File size must be less than 5MB.' 
        };
    }

    return { isValid: true };
}

/**
 * Handles logo file upload event
 * Validates file and reads it as data URL for display
 * 
 * @param {Event} event - The file input change event
 */
function handleLogoUpload(event) {
    const file = event.target.files[0];

    // Validate the uploaded file
    const validation = validateFile(file);
    if (!validation.isValid) {
        alert(validation.error);
        fileInput.value = ''; // Clear the input
        return;
    }

    // Read the file and convert to base64 data URL
    const reader = new FileReader();
    
    reader.onload = function(e) {
        uploadedLogo = e.target.result;
        displayLogo(uploadedLogo);
    };

    reader.onerror = function() {
        alert('Error reading file. Please try again.');
        fileInput.value = '';
    };

    reader.readAsDataURL(file);
}

/**
 * Displays the uploaded logo on the umbrella and in preview box
 * 
 * @param {string} logoDataUrl - The base64 data URL of the logo
 */
function displayLogo(logoDataUrl) {
    // Display logo overlay on umbrella
    overlayLogoImage.src = logoDataUrl;
    logoOverlay.classList.add('visible');

    // Display logo in preview box below upload button
    logoPreviewImage.src = logoDataUrl;
    logoPreviewBox.classList.add('visible');
}

/**
 * Removes the uploaded logo from display
 * Clears both the overlay on umbrella and preview box
 */
function removeLogo() {
    // Clear uploaded logo state
    uploadedLogo = null;
    fileInput.value = '';

    // Hide logo overlay on umbrella
    logoOverlay.classList.remove('visible');
    overlayLogoImage.src = '';

    // Hide logo preview box
    logoPreviewBox.classList.remove('visible');
    logoPreviewImage.src = '';
}

// ========================================
// Event Listeners
// ========================================

/**
 * Initialize color swatch click handlers
 * Each swatch triggers umbrella color change
 */
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        const selectedColor = this.dataset.color;
        changeUmbrellaColor(selectedColor);
    });
});

/**
 * Upload button click triggers file input
 */
uploadButton.addEventListener('click', function() {
    fileInput.click();
});

/**
 * File input change handler for logo upload
 */
fileInput.addEventListener('change', handleLogoUpload);

/**
 * Remove logo button click handler
 */
removeLogoButton.addEventListener('click', removeLogo);

// ========================================
// Application Initialization
// ========================================

/**
 * Initialize the application with default state
 * Sets blue as the default umbrella color
 */
function initializeApp() {
    changeUmbrellaColor('blue');
}

// Run initialization when DOM is ready
initializeApp();