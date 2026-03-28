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
    localStorage.setItem("cartId", result.cartId);
    displayOrder(result.data);
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

function displayOrder(data) {
  if (data.products.length == 0) {
    document.querySelector(".check").innerHTML = `
<main class="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">    
    <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance  sm:text-7xl">
      Your cart is empty
    </h1>
    <p class="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
      You don’t have any items in your cart yet, so you can’t proceed to checkout.
      Start adding some products to continue.
    </p>
    
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="../shop/shop.html" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        Browse products
      </a>
    </div>
  </div>
</main>
    `;
  } else {
    const cartTotalPrice = Number(data.totalCartPrice);
    const shipping = 5;
    document.querySelector(".subtotal").innerHTML = `$${data.totalCartPrice}`;
    document.querySelector(".shipping").innerHTML = `$${shipping}`;
    document.querySelector(".total").innerHTML =
      `$${Math.round(cartTotalPrice + shipping)}`;
    let products = data.products;
    let userCart = document.querySelector(".userCart");
    userCart.innerHTML = "";
    products.forEach((product) => {
      userCart.innerHTML += `
    <div class="flex items-start gap-4">
                  <div class="w-24 h-24 flex p-3 shrink-0 bg-white rounded-md">
                    <img
                      src="${product.product.imageCover}"
                      class="w-full object-contain"
                    />
                  </div>
                  <div class="w-full">
                    <h3 class="text-sm text-slate-900 font-semibold">
                      ${product.product.title}
                    </h3>
                    <ul class="text-xs text-slate-900 space-y-2 mt-3">
                      <li class="flex flex-wrap gap-4">
                        Quantity <span class="ml-auto">${product.count}</span>
                      </li>
                      <li class="flex flex-wrap gap-4">
                        Total Price
                        <span class="ml-auto font-semibold">$${product.count * product.price}</span>
                      </li>
                    </ul>
                  </div>
                </div>
    `;
    });
  }
}

async function placeOrder() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("address").value;
  let phone = document.getElementById("phone").value;
  let city = document.getElementById("city").value;
  let postalCode = document.getElementById("postalCode").value;
  if (!name || !email || !address || !phone || !city || !postalCode) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "All fields are required! Enter all fields to place your order.",
    });
  } else {
    let cartId = localStorage.getItem("cartId");
    let shippingAddress = {
      details: address,
      phone: phone,
      city: city,
      postalCode: postalCode,
    };
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ shippingAddress }),
      },
    );
    let result = await response.json();
    if (result.status == "success") {
      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully",
      }).then(() => {
        window.location.href = "../index.html";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
    }
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
