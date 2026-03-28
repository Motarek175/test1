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
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    signed.classList.add("hidden");
  }
};

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
    document.querySelector(".userName").classList.add("hidden");
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

function signOut() {
  Swal.fire({
    icon: "success",
    title: "You are signed out successfully",
  }).then(() => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });
}
