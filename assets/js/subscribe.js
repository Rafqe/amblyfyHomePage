/**
 * Subscribe Form Handler
 * Manages the subscription form functionality including form submission,
 * success message display, and form reset.
 */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", function () {
  // Get the subscription form element
  const subscribeForm = document.getElementById("subscribeForm");

  // Only proceed if the form exists on the page
  if (subscribeForm) {
    // Add submit event listener to the form
    subscribeForm.addEventListener("submit", handleFormSubmit);
  }
});

/**
 * Handles the form submission event
 * @param {Event} event - The form submission event
 */
function handleFormSubmit(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Get form input values
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
  };

  // Log the subscription data (replace with actual API call)
  console.log("Subscription data:", formData);

  // Show success message
  showSuccessMessage();

  // Close modal and reset form after delay
  setTimeout(closeModalAndResetForm, 2000);
}

/**
 * Displays the success message in the modal
 */
function showSuccessMessage() {
  const modalBody = document.querySelector("#subscribeModal .modal-body");
  modalBody.innerHTML = `
    <div class="alert alert-success" role="alert">
      Thank you for subscribing! We'll keep you updated with the latest news and updates.
    </div>
  `;
}

/**
 * Closes the modal and resets the form
 */
function closeModalAndResetForm() {
  // Get the modal instance
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("subscribeModal")
  );

  // Hide the modal
  modal.hide();

  // Reset the form after modal is closed
  setTimeout(resetForm, 500);
}

/**
 * Resets the form to its initial state
 */
function resetForm() {
  const modalBody = document.querySelector("#subscribeModal .modal-body");

  // Restore the original form HTML
  modalBody.innerHTML = `
    <form id="subscribeForm">
      <div class="mb-3">
        <input type="text" class="form-control" id="firstName" placeholder="First Name" required>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" id="lastName" placeholder="Last Name" required>
      </div>
      <div class="mb-3">
        <input type="email" class="form-control" id="email" placeholder="Email Address" required>
      </div>
    </form>
  `;

  // Reattach the submit event listener to the new form
  document
    .getElementById("subscribeForm")
    .addEventListener("submit", handleFormSubmit);
}
