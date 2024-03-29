const loginButton = document.getElementById("loginButton");
document.getElementById("input--email").addEventListener("focus", () => {
  document.getElementById("label--email").classList.add("transform");
});

document.getElementById("input--email").addEventListener("blur", async () => {
  const value = document.getElementById("input--email").value
  const infoElement = document.getElementById("input--email-info")
  if (value === "") {
    document.getElementById("label--email").classList.remove("transform");
    infoElement.innerText = "Please enter a Email"
    return
  }
  if(!value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
    infoElement.innerText = "Email invalid"
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open("GET", `/searchMail?email=${value.trim()}`, true)
  xhr.onload = () => {
    if(xhr.status === 200) {
      infoElement.innerText = xhr.response
    }
  }
  xhr.send()
});

document.getElementById("input--password").addEventListener("focus", () => {
  document.getElementById("label--password").classList.add("transform");
});

document.getElementById("input--password").addEventListener("blur", () => {
  if (document.getElementById("input--password").value === "") {
    document.getElementById("label--password").classList.remove("transform");
  }
});
// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// let emailError = false;
// let passwordError = false;
// let emailPara = "";
// let passwordPara = "";

// const emailInput = document.getElementById("input--email");
// const passwordInput = document.getElementById("input--password");

// emailInput.addEventListener("focus",()=>{
//   emailError = false;
//   passwordError = false;
//   emailPara = "";
//   passwordPara = "";
//   document.getElementById("emailErrorPara").innerHTML = emailPara;
//   document.getElementById("passwordErrorPara").innerHTML = passwordPara;
// })

// passwordInput.addEventListener("focus",() => {
//   emailError = false;
//   passwordError = false;
//   emailPara = "";
//   passwordPara = "";
//   document.getElementById("emailErrorPara").innerHTML = emailPara;
//   document.getElementById("passwordErrorPara").innerHTML = passwordPara;
// })


// loginButton.addEventListener("click", async () => {
//   const email = document.getElementById("input--email").value;
//   const password = document.getElementById("input--password").value;
//   if (email === null || email === "") {
//     emailPara = "Email can't be blank";
//     document.getElementById("emailErrorPara").innerHTML = emailPara;
//     emailError = true;
//     return false;
//   }
//   if (!regex.test(password)) {
//     passwordPara = "Your password should be of minimum length 8 and must include one lowercase, one uppercase, one special symbol and one numerical";
//     document.getElementById("passwordErrorPara").innerHTML = passwordPara;
//     passwordError = true;
//     return false;
//   }
//   if(!emailError && !passwordError){
//     tempPara = 'visited';
//     await axios.post(apiUrl.login, { email, password })
//     .then(res => res.data)
//     .then(res => {
//       console.log(res)
//       if(res.status === "success" && res.user.email === email && res.user.password === password) {
//         window.location.replace("/home")
//       }
//       else if(res.status === "fail" && res.message.toLowerCase().includes("email")) {
//         document.getElementById("emailErrorPara").innerHTML = res.message
//       }
//       else if(res.status === "fail" && res.message.toLowerCase().includes("password")) {
//         document.getElementById("passwordErrorPara").innerHTML = res.message
//       }
//     })
//     .catch(err => {
//       const res = err.response.data
//       if(!res) {
//         return console.log(err)
//       }
//       if(res.status === "fail" && res.message.toLowerCase().includes("user")) {
//         document.getElementById("emailErrorPara").innerHTML = res.message
//       }
//       else if(res.status === "fail" && res.message.toLowerCase().includes("password")) {
//         document.getElementById("passwordErrorPara").innerHTML = res.message
//       }
//     })
//   }
// });
