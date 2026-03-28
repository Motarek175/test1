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

    getWishlistItems(localStorage.getItem("token"));
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
        window.location.reload();
        signed.classList.add("hidden");
      }
    });
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
      } else {
        document.querySelector(".numOfWishItems").innerHTML = 0;
        document.querySelector(".loader").classList.remove("fixed");
        document.querySelector(".loader").classList.add("hidden");
      }
    });
}

async function getWishlistItems(token) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/wishlist",
    {
      headers: {
        token: token,
      },
    },
  );
  const result = await response.json();
  if (result.status == "success") {
    const products = result.data;
    displayProduct(products);
  }
  document.querySelector(".loader").classList.remove("fixed");
  document.querySelector(".loader").classList.add("hidden");
}

function displayProduct(products) {
  let wishlistGrid = document.querySelector(".wishlist-grid");
  wishlistGrid.innerHTML = "";
  products.forEach((product) => {
    wishlistGrid.innerHTML += `
          <div
            id="${product.id}"
            class="wishlist-card group bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div class="relative cursor-pointer flex items-center justify-center" onclick="window.location.href = '../product/product.html?id=${product.id}'">
              <img
                src="${product.imageCover}"
                alt="Wireless Headphones"
                class="w-60 h-60 object-contain transition-transform duration-500"
              />
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl cursor-pointer font-semibold text-gray-900" onclick="window.location.href = '../product/product.html?id=${product.id}'">
                    ${product.title.slice(0, 40)}
                  </h3>
                  <p class="text-gray-500 text-sm mt-px">
                    ${product.description.slice(0, 65)}
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-semibold text-indigo-600"
                    >$${product.price}</span
                  >
                </div>
              </div>
              <div class="mt-8 flex gap-3">
                <button
                  onclick="addToCart(this)"
                  class="flex-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-3xl flex items-center justify-center gap-x-2 transition-colors"
                >
                  <i class="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </button>
                <button
                  onclick="removeFromWishlist(this)"
                  class="flex-1 cursor-pointer border-2 border-gray-200 hover:border-red-200 hover:text-red-600 text-gray-700 font-semibold py-4 rounded-3xl flex items-center justify-center gap-x-2 transition-colors"
                >
                  <i class="fa-solid fa-trash-can"></i>
                  Remove
                </button>
              </div>
            </div>
          </div>
    `;
  });
}

async function addToCart(ele) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let numOfCart = parseInt(document.querySelector(".numOfCartItems").innerHTML);
  let productId = ele.closest(".wishlist-card").id;
  let response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
    method: "POST",
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: productId,
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
}

async function removeFromWishlist(ele) {
  let productId = ele.closest(".wishlist-card").id;
  let response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
      },
    },
  );
  response.json().then(() => {
    Swal.fire({
      icon: "success",
      title: "Product removed from wishlist successfully",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      document.querySelector(".loader").classList.remove("hidden");
      document.querySelector(".loader").classList.add("fixed");
      getWishlistNums(localStorage.getItem("token"));
      getWishlistItems(localStorage.getItem("token"));
    });
  });
}

async function clearWishlist() {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let products = document.querySelectorAll(".wishlist-card");
  console.log(products.length);
  if (products.length > 0) {
    products.forEach(async (product) => {
      let productId = product.id;
      let response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      response.json().then(() => {
        Swal.fire({
          icon: "success",
          title: "Products removed from wishlist successfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          getWishlistNums(localStorage.getItem("token"));
          getWishlistItems(localStorage.getItem("token"));
        });
      });
    });
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    Swal.fire({
      icon: "info",
      title: "You have no products in your wishlist",
      showConfirmButton: false,
      timer: 1000,
    });
  }
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
