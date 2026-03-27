window.onload = function () {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  getCategories();
  getProdcts();
  let signed = document.querySelector(".signed");
  let notSigned = document.querySelector(".notSigned");
  if (localStorage.getItem("token")) {
    notSigned.classList.add("hidden");
    getCartnums(localStorage.getItem("token"));
    getWishlistNums(localStorage.getItem("token"));
  } else {
    signed.classList.add("hidden");
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
  }
};

async function getCategories() {
  let response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories",
  );
  let result = await response.json();
  let categories = result.data;
  let categoriesContainer = document.querySelector(".filter");
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `
    <li  id="${category.name}" class="flex items-center gap-3">
                <input
                  id="${category._id}"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  onclick="applyFilters()"
                />
                <label
                  for="${category._id}"
                  class="text-slate-600 font-medium text-sm cursor-pointer"
                  >${category.name}</label
                >
              </li>
    `;
  });
}

function applyFilters() {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");

  let categories = document.querySelectorAll(".filter input");
  let catIds = [];
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].checked) {
      catIds.push(categories[i].id);
    }
  }
  if (catIds.length > 0) {
    getProdctsByCategory(catIds);
  } else {
    getProdcts();
  }
}

async function getProdctsByCategory(catIds) {
  let response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  let result = await response.json();
  let products = result.data;
  let filteredProducts = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < catIds.length; j++) {
      if (products[i].category._id == catIds[j]) {
        filteredProducts.push(products[i]);
      }
    }
  }
  displayProducts(filteredProducts);
}

async function getProdcts() {
  let response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  let result = await response.json();
  let products = result.data;
  displayProducts(products);
}
// random number
function displayProducts(products) {
  if (products.length == 0) {
    let productContainer = document.querySelector(".productContainer");
    productContainer.innerHTML = "";
    productContainer.innerHTML = `<h1 class="text-2xl font-bold text-gray-700">No products found</h1>`;
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
  } else {
    let productContainer = document.querySelector(".productContainer");
    productContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      productContainer.innerHTML += `
                <div id = "${products[i].id}" class="shadow-md p-4 rounded-2xl">
                <img
                src="${products[i].imageCover}"
                alt="${products[i].slug}"
                class="cursor-pointer aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                onclick="window.location.href = '../product/product.html?id=${products[i].id}'"
                />
              <div class="my-4 flex justify-between">
                <div>
                  <h3 onclick="window.location.href = '../product/product.html?id=${products[i].id}'" class="text-lg cursor-pointer font-medium text-gray-700">${products[i].title}</h3>
                  <h3 class="text-sm text-gray-400">${products[i].category.name}</h3>
                </div>
                <p class="mt-2 text-lg font-medium text-gray-900">$${products[i].price}</p>
              </div>
              <div class="mt-4 flex gap-3">
                <button
                  class="flex-1 cursor-pointer bg-indigo-700 hover:bg-indigo-600 text-white font-semibold px-1 py-2 rounded-3xl flex items-center justify-center gap-x-2 transition-colors"
                  onclick="addToCart('${products[i].id}')"
                  >
                  <i class="fa-solid fa-cart-plus"></i>
                </button>
                <button
                  class="cursor-pointer hover:text-red-600 text-gray-700 font-semibold py-2 rounded-3xl flex items-center justify-center gap-x-2 transition-colors"
                onclick="addToWishList('${products[i].id}')">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
              </div>
    `;
    }
    document.querySelector(".loader").classList.remove("fixed");
    document.querySelector(".loader").classList.add("hidden");
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
  document.querySelector(".loader").classList.remove("fixed");
  document.querySelector(".loader").classList.add("hidden");
}

async function addToCart(prodId) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let numOfCart = parseInt(document.querySelector(".numOfCartItems").innerHTML);
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
}

async function addToWishList(prodId) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".loader").classList.add("fixed");
  let numOfWish = parseInt(document.querySelector(".numOfWishItems").innerHTML);

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
}

function signOut() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}
