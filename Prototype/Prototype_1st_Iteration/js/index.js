
const drawer = document.getElementById("inviteDrawer");
const inviteBtn = document.getElementById("inviteBtn");
const closeBtn = document.getElementById("inviteClose");

inviteBtn.addEventListener("click", () => {
  drawer.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  drawer.classList.add("hidden");
});


const featuredData = [
  { img: "featured1.png", alt: "Featured 1" },
  { img: "featured2.png", alt: "Featured 2" },
  { img: "featured3.png", alt: "Featured 3" }
];

const featuredContainer = document.getElementById("featuredCards");

function renderFeaturedCards() {
  featuredContainer.innerHTML = "";
  featuredData.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.alt;

    card.appendChild(img);
    featuredContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderFeaturedCards);
