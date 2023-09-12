var detailButton = document.getElementById("detailButton");
var firstNameInput = document.getElementById("firstName")
var lastNameInput = document.getElementById("lastName");
var ageInput = document.getElementById("age");
var pinCodeInput = document.getElementById("pin-code");
var addressInput = document.getElementById("address");
var institueInput = document.getElementById("institute");
var dobInput = document.getElementById("dob");
var bioInput = document.getElementById("bio");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");



var firstNameError = document.getElementById("firstNameError");
var lastNameError = document.getElementById("lastNameError");
var ageError = document.getElementById("ageError");
var dobError = document.getElementById("dobError");
var emailError = document.getElementById("emailError");
var phoneError = document.getElementById("phoneError");
var pinError = document.getElementById("pinError");
pinError.textContent = "hi"
// var firstNameError = document.getElementById("firstNameError");

const nameRegex = /^[a-zA-Z]+$/;
const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
const ageRegex = /^(?:[1-9]\d{0,1}|100)$/; // Age between 1 and 100
const pinCodeRegex = /^\d{6}$/; // 6-digit PIN code
const addressMinLength = 10;
const institueMinLength = 10;
const dobRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // YYYY-MM-DD format
const bioMinLength = 20;
const phoneRegex = /^\d{10}$/;

firstNameInput.addEventListener("input", () => {
  validateFirstName();
});
lastNameInput.addEventListener("input", () => {
  validateLastName();
});
emailInput.addEventListener("input", () => {
  validateEmail();
});
ageInput.addEventListener("input", () => {
  validateAge();
});
dobInput.addEventListener("input", () => {
  validatedob();
});
phoneInput.addEventListener("input",()=>{
  validatePhone();
})

pinCodeInput.addEventListener("input", ()=>{
  validatePin();
})

function validateFirstName() {
  var firstName = firstNameInput.value.trim();

  if (!nameRegex.test(firstName)) {
    firstNameError.textContent = "Please enter a valid first name.";
  } else {
    firstNameError.textContent = "";
  }
}
function validateLastName() {
  var lastName = lastNameInput.value.trim();

  if (!nameRegex.test(lastName)) {
    lastNameError.textContent = "Please enter a valid last name.";
  } else {
    lastNameError.textContent = "";
  }
}
function validateAge() {
  var age = ageInput.value.trim();

  if (age<1) {
    ageError.textContent = "Please enter a valid age";
  } else {
    ageError.textContent = "";
  }
}
function validatedob() {
  var dob = dobInput.value.trim();

  if (!dobRegex.test(dob)) {
    dobError.textContent = "Please enter a valid dob";
  } else {
    dobError.textContent = "";
  }
}
function validateEmail() {
  var email = emailInput.value.trim();

  if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email.";
  } else {
    emailError.textContent = "";
  }
}


function validatePhone(){
  var phone = phoneInput.value.trim();

  if(!phoneRegex.test(phone)){

    phoneError.textContent = "Please enter a valid phone number";
  }
  else{
    phoneError.textContent = "";
  }
}


function validatePin(){
  var pin = pinCodeInput.value.trim();
  if(!pinCodeRegex.test(pin)){
    pinError.textContent = "Please enter a valid PIN CODE";
  }
  else{
    pinError.textContent = "abc";
  }
}

let error = false;

firstNameInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

lastNameInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

ageInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

pinCodeInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

addressInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

institueInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

dobInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

bioInput.addEventListener("focus", () => {
  error = false;
  document.getElementById("errorPara").innerHTML = "";
});

detailButton.addEventListener("click", () => {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const age = ageInput.value.trim();
  const pinCode = pinCodeInput.value.trim();
  const address = addressInput.value.trim();
  const institue = institueInput.value.trim();
  const dob = dobInput.value.trim();
  const bio = bioInput.value.trim();

  // Strict regex patterns for validation
  const nameRegex = /^[A-Za-z\s\-']+$/; // Only letters, spaces, hyphens, and apostrophes allowed
  const ageRegex = /^(?:[1-9]\d{0,1}|100)$/; // Age between 1 and 100
  const pinCodeRegex = /^\d{6}$/; // 6-digit PIN code
  const addressMinLength = 10;
  const institueMinLength = 10;
  const dobRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // YYYY-MM-DD format
  const bioMinLength = 20;

  if (!nameRegex.test(firstName)) {
    document.getElementById("errorPara").innerHTML =
      "Please enter a valid first name.";
    error = true;
    return false;
  }

  if (!nameRegex.test(lastName)) {
    document.getElementById("errorPara").innerHTML =
      "Please enter a valid last name.";
    error = true;
    return false;
  }

  if (!ageRegex.test(age)) {
    document.getElementById("errorPara").innerHTML =
      "Please enter a valid age between 1 and 100.";
    error = true;
    return false;
  }

  if (!dobRegex.test(dob)) {
    document.getElementById("errorPara").innerHTML =
      "Please enter a valid date of birth in YYYY-MM-DD format.";
    error = true;
    return false;
  }

  if (address.length < addressMinLength) {
    document.getElementById("errorPara").innerHTML =
      `Please enter a valid address (at least ${addressMinLength} characters).`;
    error = true;
    return false;
  }

  if (!pinCodeRegex.test(pinCode)) {
    document.getElementById("errorPara").innerHTML =
      "Please enter a valid 6-digit PIN code.";
    error = true;
    return false;
  }

  if (institue.length < institueMinLength) {
    document.getElementById("errorPara").innerHTML =
      `Please enter a valid institute/workplace (at least ${institueMinLength} characters).`;
    error = true;
    return false;
  }

  if (bio.length < bioMinLength) {
    document.getElementById("errorPara").innerHTML =
      `Bio should be at least ${bioMinLength} characters long.`;
    error = true;
    return false;
  }

  if (!error) {
    window.location.replace("/home");
  }
});
