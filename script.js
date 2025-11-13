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

 
let currentColor = 'blue';
let uploadedLogo = null;

 

/** 
 * @param {string} color  
 */
function changeUmbrellaColor(color) { 
    currentColor = color;
 
    umbrellaImages.forEach(img => {
        img.classList.add('hidden');
    });
 
    const selectedUmbrella = document.getElementById(`umbrella-${color}`);
    if (selectedUmbrella) {
        selectedUmbrella.classList.remove('hidden');
    }
 
    colorSwatches.forEach(swatch => {
        swatch.classList.remove('active');
        if (swatch.dataset.color === color) {
            swatch.classList.add('active');
        }
    });
 
    body.className = `theme-${color}`;
}

 
/**
 * @param {File} file  
 * @returns {Object}  
 */
function validateFile(file) {
     
    if (!file) {
        return { isValid: false, error: 'No file selected.' };
    }

     
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: 'Please upload a .png or .jpg file only.' 
        };
    }

     
    const maxSize = 5 * 1024 * 1024;  
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: 'File size must be less than 5MB.' 
        };
    }

    return { isValid: true };
}

/**
  * @param {Event} event 
 */
function handleLogoUpload(event) {
    const file = event.target.files[0];

     
    const validation = validateFile(file);
    if (!validation.isValid) {
        alert(validation.error);
        fileInput.value = ''; 
        return;
    }
 
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
 * @param {string} logoDataUrl  
 */
function displayLogo(logoDataUrl) { 
    overlayLogoImage.src = logoDataUrl;
    logoOverlay.classList.add('visible');
 
    logoPreviewImage.src = logoDataUrl;
    logoPreviewBox.classList.add('visible');
}
 
function removeLogo() { 
    uploadedLogo = null;
    fileInput.value = '';
 
    logoOverlay.classList.remove('visible');
    overlayLogoImage.src = '';
 
    logoPreviewBox.classList.remove('visible');
    logoPreviewImage.src = '';
}

 
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        const selectedColor = this.dataset.color;
        changeUmbrellaColor(selectedColor);
    });
});

 
uploadButton.addEventListener('click', function() {
    fileInput.click();
});

 
fileInput.addEventListener('change', handleLogoUpload);

 
removeLogoButton.addEventListener('click', removeLogo);

 
function initializeApp() {
    changeUmbrellaColor('blue');
}
 
initializeApp();