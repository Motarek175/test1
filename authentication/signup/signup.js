function getData() {
  const name = document.getElementById("name").value;
  const nameRegex = /^[a-zA-Z0-9 ]{8,}$/;
  const email = document.getElementById("email").value;
  const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const phone = document.getElementById("phone").value;
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const password = document.getElementById("password").value;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const rePassword = document.getElementById("rePassword").value;
  const data = { name, email, phone, password, rePassword };

  if (!name || !name.match(nameRegex)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid name! Must be at least 8 characters and contain only letters and numbers.",
    });
  } else if (!email || !email.match(emailRegex)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid email!",
    });
  } else if (!password || !password.match(passwordRegex)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid password! Must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  } else if (password !== rePassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Passwords do not match!",
    });
  } else if (!phone || !phone.match(phoneRegex)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid phone number! Must be 11 digits and start with 010 or 011 or 012 or 015 without any spaces",
    });
  } else {
    calling(data);
  }
}

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function togglerePassword() {
  const input = document.getElementById("rePassword");
  input.type = input.type === "password" ? "text" : "password";
}

async function calling(data) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  if (result.message == "success") {
    Swal.fire({
      icon: "success",
      title: "Register Successfully",
      text: "Please Sign In",
    }).then(() => {
      window.location.href = "../signin/signin.html";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: result.message,
    });
  }
}
