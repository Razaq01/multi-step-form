'use strict';

// Function to add animation classes to all <input> elements
function applySlideInRightAnimation() {
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].classList.add('animate__animated', 'animate__slideInRight');
    console.log('Applied animation to:', inputs[i]);
  }
}

// Apply the animation on page load
window.addEventListener('load', applySlideInRightAnimation);




// Grabbing all necessary elements from the DOM
const steps = document.querySelectorAll(".stp"); // All form steps
const circleSteps = document.querySelectorAll(".step"); // Sidebar step indicators
const formInputs = document.querySelectorAll(".step-1 form input"); // Input fields in Step 1
const plans = document.querySelectorAll(".plan-card"); // Plan options (Arcade, Advanced, Pro)
const switcher = document.querySelector(".switch"); // Billing switch (monthly/yearly)
const addons = document.querySelectorAll(".box"); // Add-on options
const total = document.querySelector(".total b"); // Total price display
const planPrice = document.querySelector(".plan-price"); // Price of selected plan
let time; // To track if billing is yearly or monthly
let currentStep = 1; // Current step number
let currentCircle = 0; // Current step circle
const obj = { plan: null, kind: null, price: null }; // Holds selected plan details



// Updates the active state of step circles in the sidebar
function updateCircleSteps() {
  circleSteps.forEach(step => step.classList.remove("active")); // Clear active class from all steps
  circleSteps[currentCircle].classList.add("active"); // Highlight the current step
}

// Handles form navigation for each step
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");

  // Handle "Go Back" button
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none"; // Hide current step
      currentStep--; // Decrement step counter
      currentCircle--; // Decrement step circle
      document.querySelector(`.step-${currentStep}`).style.display = "flex"; // Show previous step
      updateCircleSteps(); // Update sidebar step indicators
    });
  }

  // Handle "Next Step" button
  nextBtn.addEventListener("click", () => {
    if (validateForm()) {  // Ensure the form is valid first
      document.querySelector(`.step-${currentStep}`).style.display = "none"; // Hide current step
      if (currentStep < 5) { // Make sure you're not exceeding the last step
        currentStep++;
        currentCircle++;
        setTotal(); // Calculate and update the total price
      }
      document.querySelector(`.step-${currentStep}`).style.display = "flex"; // Show the next step
      updateCircleSteps(); // Update sidebar step indicators
      summary(obj); // Update the summary with selected details

      if (currentStep === 4) {
        nextBtn.innerHTML = "Confirm";
      }
    }
  });
  
});

// Updates the summary section with the selected plan and billing details
function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");

  // Show the plan name and whether it's monthly or yearly
  planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "Yearly" : "Monthly"})`;
  
  // Update the price displayed in the summary
  planPrice.innerHTML = obj.price.innerText;
}



// Validates the inputs in Step 1 (Personal Info)
function validateForm() {
  let valid = true;

  formInputs.forEach(input => {
    const inputValue = input.value.trim();
    
    // Validate Name Field (only letters and spaces)
    if (input.id === 'name') {
      const nameRegex = /^[a-zA-Z\s]+$/; // Allows letters and spaces
      if (!nameRegex.test(inputValue)) {
        valid = false;
        showError(input, "Please enter a valid name (letters only).");
      } else {
        clearError(input);
      }
    }
    
    // Validate Email Field
    else if (input.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
      if (!emailRegex.test(inputValue)) {
        valid = false;
        showError(input, "Please enter a valid email address.");
      } else {
        clearError(input);
      }
    }
    
    // Validate Phone Number Field (only numbers, allows + at the beginning)
    else if (input.id === 'phone') {
      const phoneRegex = /^\+?[0-9]{8,}$/; // Ensure there are at least 8 digits
 // Allows only digits and optional +
      if (!phoneRegex.test(inputValue)) {
        valid = false;
        showError(input, "Please enter a valid phone number (numbers only).");
      } else {
        clearError(input);
      }
    }
    
    // General validation for empty fields
    else if (!inputValue) {
      valid = false;
      showError(input, "This field is required.");
    } else {
      clearError(input);
    }
  });
  
  return valid; // Returns whether the form is valid or not
}

// Function to show the error message and highlight the input
function showError(input, message) {
  input.classList.add("err"); // Highlight input with error
  const errorElement = findLabel(input).nextElementSibling;
  errorElement.innerText = message; // Set custom error message
  errorElement.style.display = "flex"; // Show error message
}

// Function to clear error state for the input
function clearError(input) {
  input.classList.remove("err"); // Remove error highlighting
  findLabel(input).nextElementSibling.style.display = "none"; // Hide error message
}

// Finds the label associated with a specific input field
function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor === idVal) return labels[i]; // Match input ID with label's "for" attribute
  }
}


// Finds the label associated with a specific input field
function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor === idVal) return labels[i]; // Match input ID with label's "for" attribute
  }
}

// Handles plan selection (Arcade, Advanced, Pro)
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected"); // Remove 'selected' class from previous plan
    plan.classList.add("selected"); // Add 'selected' class to clicked plan
    obj.plan = plan.querySelector("b"); // Store selected plan name
    obj.price = plan.querySelector(".plan-priced"); // Store selected plan price
  });
});

// Toggles between monthly and yearly billing
// Toggles between monthly and yearly billing
switcher.addEventListener("click", () => {
  const isYearly = switcher.querySelector("input").checked; // Check if yearly is selected
  document.querySelector(".monthly").classList.toggle("sw-active", !isYearly); // Toggle monthly active state
  document.querySelector(".yearly").classList.toggle("sw-active", isYearly); // Toggle yearly active state
  switchPrice(isYearly); // Update plan prices based on billing type
  obj.kind = isYearly; // Store the billing type (yearly or monthly)
});

function updateAddonPrices(isYearly) {
  const addonPrices = document.querySelectorAll(".box .price");
  
  // Define the add-on prices for both billing cycles
  const monthlyAddons = [1, 2, 2];   // Monthly add-ons: Online service, Larger storage, Customizable profile
  const yearlyAddons = [10, 20, 20]; // Yearly add-ons: Online service, Larger storage, Customizable profile

  // Update each add-on price based on the selected billing type
  addonPrices.forEach((price, index) => {
    if (isYearly) {
      price.innerHTML = `+$${yearlyAddons[index]}/yr`;
    } else {
      price.innerHTML = `+$${monthlyAddons[index]}/mo`;
    }
  });
}


// Handles add-on selection
addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) { // If the add-on was already selected
      addonSelect.checked = false; // Uncheck the add-on
      addon.classList.remove("ad-selected"); // Remove selected styling
      showAddon(ID, false); // Remove add-on from summary
    } else {
      addonSelect.checked = true; // Check the add-on
      addon.classList.add("ad-selected"); // Add selected styling
      showAddon(addon, true); // Add add-on to summary
      e.preventDefault(); // Prevent default action
    }
  });
});

function switchPrice(checked) {
  // Arrays holding the prices for yearly and monthly plans
  const yearlyPrice = [90, 120, 150]; // Yearly plan prices: Arcade, Advanced, Pro
  const monthlyPrice = [9, 12, 15];   // Monthly plan prices: Arcade, Advanced, Pro

  // Select all elements that display the plan prices on the page
  const prices = document.querySelectorAll(".plan-priced");

  // Loop through each plan price element
  prices.forEach((price, index) => {
    // Check if yearly billing is selected (checked = true)
    if (checked) {
      // Update the price to the yearly rate and append a "2 months free" message
      // The message is styled using inline CSS with dark blue text and a smaller font size
      price.innerHTML = `$${yearlyPrice[index]}/yr <p style="color: darkblue; font-size: 0.9em;">2 months free</p>`;
    } else {
      // If monthly billing is selected, display the monthly rate without the "2 months free" message
      price.innerHTML = `$${monthlyPrice[index]}/mo`;
    }
  });

  updateAddonPrices(checked);

  // Update the obj with the currently selected plan's new price
  const selectedPlan = document.querySelector(".plan-card.selected .plan-priced");
  obj.price = selectedPlan; // Update price in the object for later summary

  // Call the setTime function to update the billing time type (monthly/yearly)
  setTime(checked);
}



// Adds or removes add-ons from the summary
function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true); // Clone the template for add-ons
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".service-price");
  const serviceID = clone.querySelector(".selected-addon");

  if (val) { // If an add-on is being added
    serviceName.innerText = ad.querySelector("label").innerText; // Set add-on name
    servicePrice.innerText = ad.querySelector(".price").innerText; // Set add-on price
    serviceID.setAttribute("data-id", ad.dataset.id); // Assign data-id
    document.querySelector(".addons").appendChild(clone); // Append add-on to summary
  } else { // If an add-on is being removed
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      if (addon.getAttribute("data-id") === ad) {
        addon.remove(); // Remove the add-on from summary
      }
    });
  }
}

// Calculates and updates the total price in the summary
function setTotal() {
  const basePrice = parseInt(planPrice.innerHTML.replace(/\D/g, "")); // Extract the numeric value from the plan price
  let totalValue = basePrice;

  // Add the prices of selected add-ons
  const addonPrices = document.querySelectorAll(".selected-addon .service-price");
  addonPrices.forEach(price => {
    totalValue += parseInt(price.innerHTML.replace(/\D/g, "")); // Add add-on prices
  });

  total.innerHTML = `$${totalValue}/${obj.kind ? "yr" : "mo"}`;
}

// Add an event listener to the "Change" link
document.querySelector(".change-plan").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  
  // Go back to the "Select Plan" step
  document.querySelector(`.step-${currentStep}`).style.display = "none"; // Hide current summary step
  currentStep = 2; // Change to step 2, where users select a plan
  currentCircle = 1; // Change the step indicator in the sidebar
  document.querySelector(`.step-${currentStep}`).style.display = "flex"; // Show the Select Plan step
  updateCircleSteps(); // Update the step indicator in the sidebar
});



// Sets the billing type (monthly or yearly)
function setTime(t) {
  time = t; // Set the time variable (true for yearly, false for monthly)
}
