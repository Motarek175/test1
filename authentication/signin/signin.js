window.onload = function () {
  if (localStorage.getItem("token")) {
    Swal.fire({
      icon: "info",
      title: "You are already signed in",
      text: "Redirecting to home page after 2 seconds",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../../index.html";
    });
  }
};

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function getData() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const emailreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const data = { email, password };
  if (!email || !email.match(emailreg)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid email!",
    });
  } else if (!password) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid password!",
    });
  } else {
    calling(data);
  }
}

async function calling(data) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  console.log(result);
  if (result.message == "success") {
    localStorage.setItem("token", result.token);
    Swal.fire({
      icon: "success",
      title: "Login Successfully",
    }).then(() => {
      window.location.href = "../../index.html";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: result.message,
    });
  }
}
