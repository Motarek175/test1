window.onload = function () {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let signed = document.querySelector(".signed");
  let notSigned = document.querySelector(".notSigned");
  if (localStorage.getItem("token")) {
    notSigned.classList.add("hidden");
    getCartnums(localStorage.getItem("token"));
    getWishlistNums(localStorage.getItem("token"));
    const decoded = jwt_decode(localStorage.getItem("token"));
    document.querySelector(".userName").innerHTML = decoded.name;
  } else {
    signed.classList.add("hidden");
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    document.querySelector(".userName").classList.add("hidden");
  }
};

function sendData() {
  let fName = document.getElementById("first-name").value;
  let lName = document.getElementById("last-name").value;
  let fullName = fName + " " + lName;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone-number").value;
  let message = document.getElementById("message").value;

  if (!fName || !lName || !email || !phone || !message) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid and complete data!",
    });
  } else {
    const data = { fullName, email, phone, message };
    localStorage.setItem("data", JSON.stringify(data));
    Swal.fire({
      icon: "success",
      title: "Message sent successfully!",
    }).then(() => {
      document.getElementById("first-name").value = "";
      document.getElementById("last-name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone-number").value = "";
      document.getElementById("message").value = "";
    });
  }
}

async function getCartnums(token) {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    headers: {
      token: token,
    },
  });
  const result = await response.json();
  if (result.status == "success") {
    document.querySelector(".numOfCartItems").innerHTML = result.numOfCartItems;
  } else {
    document.querySelector(".numOfCartItems").innerHTML = 0;
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
  }
}

async function getWishlistNums(token) {
  await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
    headers: {
      token: token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status == "success") {
        document.querySelector(".numOfWishItems").innerHTML = result.count;
      } else {
        document.querySelector(".numOfWishItems").innerHTML = 0;
        document.querySelector(".loader").classList.remove("fixed");
        document.querySelector(".loader").classList.add("hidden");
      }
    });
  document.querySelector(".loader").classList.remove("fixed");
  document.querySelector(".loader").classList.add("hidden");
}

const btn = document.getElementById("profileBtn");
const menu = document.getElementById("dropdownMenu");
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("hidden");
});
document.addEventListener("click", () => {
  menu.classList.add("hidden");
});

function signOut() {
  Swal.fire({
    icon: "success",
    title: "You are signed out successfully",
  }).then(() => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });
}
