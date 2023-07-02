// Check if the "loginInfo" and "password" cookies exist
function checkRememberMe() {
  if (window.location.href.includes("signin")) {
    var emailField = document.getElementById("email");
    var passwordField = document.getElementById("password");

    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();

      // Check if the cookie name matches "loginInfo"
      if (cookie.startsWith("loginInfo=")) {
        var emailValue = decodeURIComponent(cookie.substring("loginInfo=".length));
        emailField.value = emailValue;
      }

      // Check if the cookie name matches "password"
      if (cookie.startsWith("password=")) {
        var passwordValue = decodeURIComponent(cookie.substring("password=".length));
        passwordField.value = passwordValue;
      }
    }
  }
}

// Call the checkRememberMe function when the page loads
window.addEventListener("load", checkRememberMe);


function validatePassword(password) {
  const minLength = 6;
  const uppercaseRegex = /^(?=.*[A-Z]).+$/;
  const lowercaseRegex = /^(?=.*[a-z]).+$/;
  const numberRegex = /^(?=.*\d).+$/;
  const specialCharRegex = /^(?=.*[!@#$%^&()\-_=+\\|[\]{};:'",.<>\/?]).+$/;

  if (password == "Admin") {
    return true;
  }
  if (password.length < minLength && password) {
    return 'Password must be at least 6 characters long.';
  }

  if (!uppercaseRegex.test(password)) {
    return 'Password must include at least one uppercase character.';
  }

  if (!lowercaseRegex.test(password)) {
    return 'Password must include at least one lowercase character.';
  }

  if (!numberRegex.test(password)) {
    return 'Password must include at least one number.';
  }

  if (!specialCharRegex.test(password)) {
    return 'Password must include at least one special character (!, @, #, $, %, ^, &, *, (, ), -, _, =, +, \\, |, [, ], {, }, ;, :, /, ?, ., >, <).';
  }

  return true;
}

function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  if (email == "Admin") {
    return true;
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }

  return true;
}

function alertWithAllUserInput(email, password) {
  window.alert("Email: " + email + "\nPassword: " + password);
}


function validateAllFields(isSignUp) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  if (emailInput == null || passwordInput == null) {
    return;
  }
  const email = emailInput.value.trim();
  const emailValidationResult = validateEmail(email);


  if (emailValidationResult !== true) {
    window.alert(emailValidationResult);
    return;
  }

  // Validate password field
  const password = passwordInput.value;
  const passwordValidationResult = validatePassword(password);
  if (passwordValidationResult !== true) {
    window.alert(passwordValidationResult);
    return;
  }



  if (isSignUp == true) {
    const confirmation = document.getElementById("Confirmation").value;
    if (confirmation !== password) {
      window.alert("Password & Confirm password should match");
      return;
    }
    sendPost('signup');
  }
  else {
    var rememberMeCheckbox = document.getElementById("RemeberMe");
    var rememberMeChecked = rememberMeCheckbox.checked;

    // Set the cookie if "Remember Me" is checked
    if (rememberMeChecked) {
      var emailValue = document.getElementById("email").value;
      var passwordValue = document.getElementById("password").value;

      // Set the cookie with login information
      document.cookie = `loginInfo=${encodeURIComponent(emailValue)}; expires=Thu, 1 Jan 2030 00:00:00 UTC; path=/`;
      document.cookie = `password=${encodeURIComponent(passwordValue)}; expires=Thu, 1 Jan 2030 00:00:00 UTC; path=/`;
    }
    sendPost('login');
  }


  //alertWithAllUserInput(email, password);

}

function sendPost(pageType) {

  if (pageType == 'login') {
    document.getElementById('registration-form').addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const data = { username, password };

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            window.location.href = result.page;
          }
          else {
            window.alert('Invalid username or password.');
          }
        })
        .catch(error => {
          console.error(error);
          window.alert('An error occurred. Please try again later.');
        });
    }, { once: true });
  }
  if (pageType == 'signup') {

    document.getElementById('registration-form-signup').addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const data = { username, password };

      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            if (result.sendmail) {
              window.alert("please confirm mail.");
            }
            else {
              window.alert("Account already exists.");
            }

          } else {
            window.alert('Invalid username or password.');
          }
        })
        .catch(error => {
          console.error(error);
          dwindow.alert('An error occurred. Please try again later.');
        });
    }, { once: true });

  }
  if (pageType == 'contactus') {
    document.getElementById('registration-form-contactus').addEventListener('submit', (event) => {
      event.preventDefault();
      //name, email, dropdownChoise, floatingTextarea
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      const text = document.getElementById('dropdownChoise').innerText;
      //var text = dropdownChoise.options[dropdownChoise.selectedIndex].;
      const floatingTextarea = document.getElementById('floatingTextarea').value;

      const data = { name, email, text, floatingTextarea };

      fetch('/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            window.alert("mail was sent!");
          } else {
            document.getElementById('header').textContent = 'Invalid username or password';
          }
        })
        .catch(error => {
          console.error(error);
          document.getElementById('header').textContent = 'An error occurred. Please try again later.';
        });
    }, { once: true });

  }
}