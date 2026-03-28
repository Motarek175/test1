window.onload = async function () {
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
  getCategories();
  getBrands();
  getProdcts();
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

async function getCategories() {
  let response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories",
  );
  let result = await response.json();
  let categories = result.data;
  let categoriesContainer = document.querySelector(".categories");
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `
    <div id="${category._id}"
        >
          <div class="aspect-square rounded-full overflow-hidden mx-auto">
            <img
              src="${category.image}"
              alt="product1"
              class="h-full w-full object-cover object-top rounded-lg"
            />
          </div>
          <div class="mt-3 text-center">
            <h4 class="text-slate-900 text-sm font-semibold">${category.name}</h4>
          </div>
        </div>
    `;
  });
}

async function getBrands() {
  let response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
  let result = await response.json();
  let brand = result.data;
  let brandContainer = document.querySelector(".brands");
  brandContainer.innerHTML = "";
  brand.forEach((brand) => {
    brandContainer.innerHTML += `
    <div id="${brand._id}"
        class="">
          <div class="mx-auto ">
            <img
              src="${brand.image}"
              alt="product1"
              class="h-full w-full object-cover object-top rounded-lg"
            />
          </div>
        </div>
    `;
  });
}

async function getProdcts() {
  let response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  let result = await response.json();
  let products = result.data;
  newArrivals(products);
}

function newArrivals(products) {
  let newArrivals = document.querySelector(".newArrivals");
  for (let i = 0; i < 4; i++) {
    let randNum = Math.floor(Math.random() * products.length);
    newArrivals.innerHTML += `
                <div class="group" id="${products[randNum].id}">
              <div onclick="window.location.href = '../product/product.html?id=${products[randNum].id}'" class="relative cursor-pointer overflow-hidden rounded-lg mb-4">
                <img
                  src="${products[randNum].imageCover}"
                  alt="${products[randNum].slug}"
                  class="w-full h-80"
                />
              </div>
              <div>
                <h3 onclick="window.location.href = '../product/product.html?id=${products[randNum].id}'" class="cursor-pointer font-medium text-gray-900">
                  ${products[randNum].title.slice(0, 30)}
                </h3>
                <h3 class="font-small text-gray-500 mb-2">
                  ${products[randNum].brand.name}
                </h3>
                <h3 class="font-small text-gray-500 mb-2">
                Rate: ${products[randNum].ratingsAverage} (out of ${products[randNum].ratingsQuantity} ratings)
                </h3>
                <p class="text-gray-900 font-medium">$${products[randNum].price}</p>
              </div>
            </div>
    `;
  }
}

function signOut() {
  Swal.fire({
    icon: "success",
    title: "You are signed out successfully",
  }).then(() => {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
  });
}
