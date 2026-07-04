const RESTAURANT = {
  name: "Walnut & Ember Cafe",
  tagline: "A cinematic cafe menu for the table in front of you.",
  locationLabel: "TableLens Phase 1 Demo",
  currency: "₹",
  theme: "dark-walnut-gold",
  demoNote: "Tap any dish to preview it in 3D."
};

const MENU = [
  {
    id: "signature-burger",
    name: "Signature Burger",
    category: "Burgers",
    price: 249,
    type: "non-veg",
    spice: "medium",
    description: "Smoky grilled chicken, melted cheese, charred onion jam, and a toasted brioche bun built for a rich cafe-table preview.",
    tags: ["Smoky", "Cheese", "Chef Pick"],
    portionNote: "Best for one person.",
    image: "./assets/images/burger.jpg",
    modelGlb: "./assets/models/burger.glb",
    modelUsdz: "./assets/models/burger.usdz",
    accent: "#d89b45"
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    category: "Drinks",
    price: 159,
    type: "veg",
    spice: "none",
    description: "Cold-brew style coffee over ice with a creamy finish, designed as a tall glass serving for a relaxed cafe stop.",
    tags: ["Cold", "Creamy", "Cafe Classic"],
    portionNote: "Tall glass serving.",
    image: "./assets/images/iced-coffee.jpg",
    modelGlb: "./assets/models/iced-coffee.glb",
    modelUsdz: "./assets/models/iced-coffee.usdz",
    accent: "#c88755"
  },
  {
    id: "chocolate-dessert",
    name: "Chocolate Dessert",
    category: "Desserts",
    price: 199,
    type: "veg",
    spice: "none",
    description: "A glossy chocolate plate with deep cocoa notes, soft cream, and a warm finish for a small indulgent dessert moment.",
    tags: ["Rich", "Sweet", "Shareable"],
    portionNote: "Small plate dessert.",
    image: "./assets/images/chocolate-dessert.jpg",
    modelGlb: "./assets/models/chocolate-dessert.glb",
    modelUsdz: "./assets/models/chocolate-dessert.usdz",
    accent: "#b56d4c"
  }
];
