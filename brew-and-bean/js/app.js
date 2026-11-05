const MENU_ITEMS = [
  { emoji: "☕", name: "Flat White", description: "Double ristretto, silky steamed milk.", price: "₹220" },
  { emoji: "🥐", name: "Butter Croissant", description: "Laminated in-house, baked at 6am.", price: "₹180" },
  { emoji: "🧊", name: "Cold Brew", description: "Steeped 18 hours, served over ice.", price: "₹240" },
  { emoji: "🍫", name: "Mocha", description: "Espresso, dark chocolate, steamed milk.", price: "₹260" },
  { emoji: "🍪", name: "Sea-Salt Cookie", description: "Brown butter, 70% dark chocolate.", price: "₹120" },
  { emoji: "🍵", name: "Masala Chai", description: "Whole spices, simmered the slow way.", price: "₹150" },
];

function renderMenu() {
  const grid = document.getElementById("menu-grid");
  grid.innerHTML = MENU_ITEMS.map(
    (item) => `
      <article class="menu-card">
        <span class="price-badge">${item.price}</span>
        <div class="emoji">${item.emoji}</div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </article>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", renderMenu);
