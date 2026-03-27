window.onload = function () {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let signed = document.querySelector(".signed");
  let notSigned = document.querySelector(".notSigned");
  if (localStorage.getItem("token")) {
    notSigned.classList.add("hidden");
    getCartnums(localStorage.getItem("token"));
    getWishlistNums(localStorage.getItem("token"));
    getCartItems(localStorage.getItem("token"));
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
        window.location.href = "../index.html";
        signed.classList.add("hidden");
      }
    });
  }
};

async function getCartnums(token) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    headers: {
      token: token,
    },
  });
  const result = await response.json();
  if (result.status == "success") {
    document.querySelector(".numOfCartItems").innerHTML = result.numOfCartItems;
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    document.querySelector(".numOfCartItems").innerHTML = 0;
  }
}

async function getWishlistNums(token) {
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
    document.querySelector(".numOfWishItems").innerHTML = result.count;
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    document.querySelector(".numOfWishItems").innerHTML = 0;
  }
}

async function getCartItems(token) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  const response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
    headers: {
      token: token,
    },
  });
  const result = await response.json();
  if ((result.status = "success")) {
    const cartTotalPrice = Number(result.data.totalCartPrice);
    document.querySelector(".totalPrice").innerHTML = `$${cartTotalPrice}`;
    const shipping = 5;
    document.querySelector(".shipping").innerHTML = `$${shipping}`;
    document.querySelector(".total").innerHTML =
      `$${Math.round(cartTotalPrice + shipping)}`;
    const products = result.data.products;
    displayProduct(products);
  }
  getCartnums(localStorage.getItem("token"));
  getWishlistNums(localStorage.getItem("token"));
  document.querySelector(".loader").classList.remove("fixed");
  document.querySelector(".loader").classList.add("hidden");
}

function displayProduct(products) {
  let cartSection = document.querySelector(".cartSection");
  cartSection.innerHTML = "";
  products.forEach((product) => {
    cartSection.innerHTML += `
      <div
            class="p-6 bg-white shadow-sm border border-gray-300 rounded-md relative"
          >
            <div
              id="${product.product.id}"
              class="cart flex items-center max-sm:flex-col gap-4 max-sm:gap-6"
            >
              <div class="w-52 cursor-pointer h-52 shrink-0" onclick="window.location.href = '../product/product.html?id=${product.product.id}'">
                <img
                  src="${product.product.imageCover}"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="sm:border-l sm:pl-4 sm:border-gray-300 w-full">
                <h3 class="text-base cursor-pointer font-semibold text-slate-900" onclick="window.location.href = '../product/product.html?id=${product.product.id}'">
                  ${product.product.title}
                </h3>
                <h3 class="mt-2 text-base font-semibold text-slate-400">
                  Rate Average : ${product.product.ratingsAverage}
                </h3>
                <hr class="border-gray-300 my-4" />
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div class="flex items-center gap-4">
                    <h4 class="text-sm font-semibold text-slate-900">
                      Quantity:
                    </h4>
                    <button
                      type="button"
                      class="dec flex items-center justify-center w-[18px] h-[18px] bg-blue-600 outline-none rounded-sm cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-2 fill-white"
                        viewBox="0 0 124 124"
                      >
                        <path
                          d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>
                    <span
                      class="quantity font-semibold text-base leading-[16px]"
                      >${product.count}</span
                    >
                    <button
                      type="button"
                      class="inc flex items-center justify-center w-[18px] h-[18px] bg-blue-600 outline-none rounded-sm cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-2 fill-white"
                        viewBox="0 0 42 42"
                      >
                        <path
                          d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center">
                    <h4 class="text-base font-semibold text-slate-900">
                      Price: $${product.price}
                    </h4>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="del w-3 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 absolute top-3.5 right-3.5"
                      viewBox="0 0 320.591 320.591"
                    >
                      <path
                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
  });
  document.querySelectorAll(".inc").forEach((btn) => {
    btn.addEventListener("click", increment);
  });
  document.querySelectorAll(".dec").forEach((btn) => {
    btn.addEventListener("click", decrement);
  });
  document.querySelectorAll(".del").forEach((btn) => {
    btn.addEventListener("click", deleteItem);
  });
}

function increment() {
  let prodId = this.closest(".cart").id;
  this.parentNode.querySelector(".quantity").innerHTML++;
  updateQuantity(prodId, this.parentNode.querySelector(".quantity").innerHTML);
}

function decrement() {
  let prodId = this.closest(".cart").id;
  this.parentNode.querySelector(".quantity").innerHTML--;
  updateQuantity(prodId, this.parentNode.querySelector(".quantity").innerHTML);
}

async function updateQuantity(prodId, quantity) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v2/cart/${prodId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        count: quantity,
      }),
    },
  );
  const result = await response.json();
  if (result.status == "success") {
    getCartItems(localStorage.getItem("token"));
  }
}

async function deleteItem() {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let prodId = this.closest(".cart").id;
  await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${prodId}`, {
    method: "DELETE",
    headers: {
      token: localStorage.getItem("token"),
    },
  }).then(() => {
    Swal.fire({
      icon: "success",
      title: "Product deleted successfully",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      getCartnums(localStorage.getItem("token"));
      getCartItems(localStorage.getItem("token"));
    });
  });
}

async function clearCart() {
  let cartSection = document.querySelectorAll(".cartSection div");
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  if (cartSection.length > 0) {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v2/cart",
      {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
    response.json().then(() => {
      getCartnums(localStorage.getItem("token"));
      getCartItems(localStorage.getItem("token"));
    });
  } else {
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
    Swal.fire({
      icon: "info",
      title: "Cart is empty",
      text: "There is nothing to clear",
      timer: 1000,
      showConfirmButton: false,
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
