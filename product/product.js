window.onload = function () {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let signed = document.querySelector(".signed");
  let notSigned = document.querySelector(".notSigned");
  let prodId = location.search.split("=")[1];
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
    document.querySelector(".userName").classList.add("hidden");
  }
  displayProduct(prodId);
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
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
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
        document.querySelector(".loader").classList.remove("fixed");
        document.querySelector(".loader").classList.add("hidden");
      } else {
        document.querySelector(".numOfWishItems").innerHTML = 0;
        document.querySelector(".loader").classList.remove("fixed");
        document.querySelector(".loader").classList.add("hidden");
      }
    });
}

async function displayProduct(prodId) {
  let prodDetail = document.querySelector(".prodDetail");
  await fetch(`https://ecommerce.routemisr.com/api/v1/products/${prodId}`)
    .then((response) => response.json())
    .then((result) => {
      const data = result.data;
      prodDetail.innerHTML = `
              <!-- Product Images -->
        <div class="w-full  md:px-4 mb-8">
          <img
            src="${data.imageCover}"
            alt="Product"
            class="rounded-lg mx-auto shadow-md mb-4 w-86 h-86"
            id="mainImage"
          />
          <div
            class="grid grid-cols-4 gap-4 py-4 justify-center overflow-x-auto"
          >
            ${data.images
              .map(
                (image, i) =>
                  `<img src="${image}" alt="Product" class="rounded-lg cursor-pointer hover:scale-90 shadow-md" onclick="changeMainImage('${image}')"/>`,
              )
              .join("")}
          </div>
        </div>
        <!-- Product Details -->
        <div class="w-full md:px-4">
          <h2 class="text-3xl font-bold mb-2">${data.title}</h2>
          <p class="text-gray-600 mb-4">Category: ${data.category.name}</p>
          <div class="mb-4">
            <span class="text-2xl font-bold mr-2">${data.price}</span>
          </div>
          <div class="flex items-center mb-4">
            <p class="font-medium">
              Rate: <span class="ml-2 text-gray-600 ratingsAverage">${data.ratingsAverage} </span>
              <span class="ratingsQuantity">(${data.ratingsQuantity} reviews)</span>
            </p>
          </div>
          <p class="text-gray-700 mb-6">
            ${data.description}
          </p>

          <div class="flex space-x-4 mb-6">
            <button
              class="hover:bg-indigo-600 cursor-pointer flex gap-2 items-center text-white px-6 py-2 rounded-md bg-indigo-700"
            onclick="addToCart('${prodId}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              Add to Cart
            </button>
            <button
              class="bg-gray-200 cursor-pointer flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-red-600 hover:text-white"
            onclick="addToWishlist('${prodId}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Wishlist
            </button>
          </div>
        </div>
      `;
    });
}

function changeMainImage(image) {
  document.getElementById("mainImage").src = image;
}

async function addToCart(prodId) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let numOfCart = parseInt(document.querySelector(".numOfCartItems").innerHTML);
  if (localStorage.getItem("token")) {
    let response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: prodId,
      }),
    });
    response.json().then((result) => {
      if (result.numOfCartItems === numOfCart) {
        Swal.fire({
          icon: "info",
          title:
            "Product already added to cart! but the quantity has been updated by 1",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          document.querySelector(".loader").classList.remove("fixed");
          document.querySelector(".loader").classList.add("hidden");
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Product added to cart successfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          getCartnums(localStorage.getItem("token"));
        });
      }
    });
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    Swal.fire({
      icon: "info",
      title: "You are not signed in",
      text: "You should sign in first to see your cart",
      showConfirmButton: true,
      confirmButtonText: "Sign In",
      confirmButtonColor: "#4f39f6",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../authentication/signin/signin.html";
      } else {
        window.location.href = "#";
        signed.classList.add("hidden");
      }
    });
  }
}

async function addToWishlist(prodId) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let numOfWish = parseInt(document.querySelector(".numOfWishItems").innerHTML);
  if (localStorage.getItem("token")) {
    let response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/wishlist`,
      {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: prodId,
        }),
      },
    );
    response.json().then((result) => {
      if (result.data.length === numOfWish) {
        Swal.fire({
          icon: "info",
          title: "Product already added to wishlist",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          document.querySelector(".loader").classList.remove("fixed");
          document.querySelector(".loader").classList.add("hidden");
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Product added to wishlist successfully",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          getWishlistNums(localStorage.getItem("token"));
        });
      }
    });
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    Swal.fire({
      icon: "info",
      title: "You are not signed in",
      text: "You should sign in first to see your cart",
      showConfirmButton: true,
      confirmButtonText: "Sign In",
      confirmButtonColor: "#4f39f6",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../authentication/signin/signin.html";
      } else {
        window.location.href = "#";
        signed.classList.add("hidden");
      }
    });
  }
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
