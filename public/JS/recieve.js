const bookPackages = document.querySelectorAll(".bookBtnClass");
bookPackages.forEach((bookPackage) => {
	const index = bookPackage.getAttribute("data-book-index");
	if (document.getElementById(`bookButton${index}`) != null) {
		const bookButton = document.getElementById(`bookButton${index}`);
		const confirmationPopup = document.getElementById(
			`confirmationPopup${index}`
		);
		const popupOverlay = document.getElementById(`popupOverlay${index}`);
		const confirmButton = document.getElementById(`confirmButton${index}`);
		const cancelButton = document.getElementById(`cancelButton${index}`);
		const bookForm = document.getElementById(`bookForm${index}`);

		// Show Popup
		bookButton.addEventListener("click", () => {
			console.log(index);
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
	}
});
