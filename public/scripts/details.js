const detailButton = document.getElementById("detailButton");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const pinCodeInput = document.getElementById("pin-code");
const addressInput = document.getElementById("address");
const institueInput = document.getElementById("institute");
const dobInput = document.getElementById("dob");
const bioInput = document.getElementById("bio");

let error = false;
let temp = "";

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
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = document.getElementById("age").value;
  const pinCode = document.getElementById("pin-code").value;
  const address = document.getElementById("address").value;
  const institue = document.getElementById("institute").value;
  const dob = document.getElementById("dob").value;
  const bio = document.getElementById("bio").value;
  if (firstName === null || firstName === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the First Name field";
    error = true;
    return false;
  }
  if (lastName === null || lastName === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the Last Name field";
    error = true;
    return false;
  }
  if (age === null || age === "") {
    document.getElementById("errorPara").innerHTML = "Please select your age";
    error = true;
    return false;
  }
  if (dob === null || dob === "") {
    document.getElementById("errorPara").innerHTML = "Please select your dob";
    error = true;
    return false;
  }
  if (address === null || address === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the address field";
    error = true;
    return false;
  }
  if (pinCode === null || pinCode === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the pin-code field";
    error = true;
    return false;
  }
  if (institue === null || institue === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the institute/workplace field";
    error = true;
    return false;
  }
  if (bio === null || bio === "") {
    document.getElementById("errorPara").innerHTML =
      "Please fill the Bio field";
    error = true;
    return false;
  }
  if (!error) {
    window.location.replace("/home");
  }
});
