const bookButton = document.getElementById(`bookButton`);
const confirmationPopup = document.getElementById(`confirmationPopup`);
const popupOverlay = document.getElementById(`popupOverlay`);
const confirmButton = document.getElementById(`confirmButton`);
const cancelButton = document.getElementById(`cancelButton`);
const bookForm = document.getElementById(`bookForm`);

// Show Popup
bookButton.addEventListener("click", (e) => {
	e.preventDefault();
	confirmationPopup.style.display = "block";
	popupOverlay.style.display = "block";
});

// Confirm Submission
confirmButton.addEventListener("click", () => {
	confirmationPopup.style.display = "none";
	popupOverlay.style.display = "none";
	bookForm.submit(); // Submit the form
});

// Cancel Popup
cancelButton.addEventListener("click", () => {
	confirmationPopup.style.display = "none";
	popupOverlay.style.display = "none";
});
