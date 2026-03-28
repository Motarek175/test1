const email = localStorage.getItem("email");
document.getElementById("email").value = email;

function getData() {
  const newPassword = document.getElementById("password").value;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!newPassword || !newPassword.match(passwordRegex)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid password! Must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  } else {
    const data = { email, newPassword };
    calling(data);
  }
}

async function calling(data) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  if (result.token) {
    Swal.fire({
      icon: "success",
      title: "Password changed successfully",
    }).then(() => {
      localStorage.removeItem("email");
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

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}