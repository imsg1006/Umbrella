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
 * Change umbrella color + theme
 */
function changeUmbrellaColor(color) {
  currentColor = color;

  umbrellaImages.forEach(img => img.classList.add('hidden'));
  const selectedUmbrella = document.getElementById(`umbrella-${color}`);
  selectedUmbrella.classList.remove('hidden');
  selectedUmbrella.classList.add('fade-in');
  setTimeout(() => selectedUmbrella.classList.remove('fade-in'), 500);

  colorSwatches.forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color === color);
  });

  body.className = `theme-${color}`;
}

/**
 * Validate uploaded file
 */
function validateFile(file) {
  if (!file) return { isValid: false, error: 'No file selected.' };
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) return { isValid: false, error: 'Please upload a .png or .jpg file only.' };
  if (file.size > 5 * 1024 * 1024) return { isValid: false, error: 'File size must be less than 5MB.' };
  return { isValid: true };
}

/**
 * Handle logo upload
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
  reader.onload = (e) => {
    uploadedLogo = e.target.result;
    displayLogo(uploadedLogo);
  };
  reader.readAsDataURL(file);
}

/**
 * Display uploaded logo
 */
function displayLogo(logoDataUrl) {
  overlayLogoImage.src = logoDataUrl;
  logoOverlay.classList.add('visible');
  logoPreviewImage.src = logoDataUrl;
  logoPreviewBox.classList.add('visible');
}

/**
 * Remove uploaded logo
 */
function removeLogo() {
  uploadedLogo = null;
  fileInput.value = '';
  logoOverlay.classList.remove('visible');
  overlayLogoImage.src = '';
  logoPreviewBox.classList.remove('visible');
  logoPreviewImage.src = '';
}

/**
 * Download umbrella preview
 */
function downloadPreview() {
  const umbrellaPreview = document.querySelector('.umbrella-preview');
  html2canvas(umbrellaPreview).then((canvas) => {
    const link = document.createElement('a');
    link.download = `custom_umbrella_${currentColor}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

/**
 * Umbrella open animation on load
 */
function animateUmbrellaOpening() {
  const selectedUmbrella = document.getElementById(`umbrella-${currentColor}`);
  selectedUmbrella.classList.add('umbrella-open');
  setTimeout(() => selectedUmbrella.classList.remove('umbrella-open'), 1500);
}

/**
 * Initialize app
 */
function initializeApp() {
  changeUmbrellaColor('blue');
  animateUmbrellaOpening();
}

// Event listeners
colorSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => changeUmbrellaColor(swatch.dataset.color));
});
uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleLogoUpload);
removeLogoButton.addEventListener('click', removeLogo);

// Download button
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Download Preview';
downloadBtn.className = 'upload-button';
downloadBtn.style.marginTop = '20px';
downloadBtn.onclick = downloadPreview;
document.querySelector('.upload-section').appendChild(downloadBtn);

initializeApp();
