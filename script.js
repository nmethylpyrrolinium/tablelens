import { TimingSystem } from "./engine/core/TimingSystem.js";
import { PointerSystem } from "./engine/interaction/PointerSystem.js";
import { QualityManager } from "./engine/utilities/QualityManager.js";
import { WebGLExperience } from "./engine/renderer/WebGLRenderer.js";
import { TableScene } from "./engine/scene/TableScene.js";
import { CameraController } from "./engine/camera/CameraController.js";
import { CardPhysicsSystem } from "./engine/ui/CardPhysics.js";
import { ScrollRevealSystem } from "./engine/ui/ScrollReveals.js";

(function () {
  "use strict";

  const REQUIRED_CATEGORIES = ["All", "Burgers", "Drinks", "Desserts"];
  let activeCategory = "All";
  let reduceMotion = false;
  let timing;
  let pointerSystem;
  let cardPhysics;
  let scrollReveals;

  function safeQuerySelector(selector, root = document) {
    return root ? root.querySelector(selector) : null;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function getCurrentPage() {
    return document.body.dataset.page || "unknown";
  }

  function getDishIdFromURL() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function formatPrice(price) {
    const currency = window.RESTAURANT?.currency || (typeof RESTAURANT !== "undefined" ? RESTAURANT.currency : "₹") || "₹";
    return `${currency}${Number(price || 0).toLocaleString("en-IN")}`;
  }

  function getMenu() {
    return Array.isArray(window.MENU) ? window.MENU : (typeof MENU !== "undefined" && Array.isArray(MENU) ? MENU : []);
  }

  function getRestaurant() {
    return window.RESTAURANT || (typeof RESTAURANT !== "undefined" ? RESTAURANT : null);
  }

  function getCategories(menu) {
    const categories = new Set(REQUIRED_CATEGORIES);
    menu.forEach((dish) => dish.category && categories.add(dish.category));
    return Array.from(categories);
  }

  function typeLabel(type) {
    return type === "non-veg" ? "Non-veg" : "Veg";
  }

  function renderMenuPage() {
    const menu = getMenu();
    const restaurant = getRestaurant();
    if (!menu.length) {
      renderMenuCards([]);
      const empty = safeQuerySelector("#menuEmpty");
      if (empty) empty.textContent = "Menu data is unavailable. Please check menu-data.js.";
      return;
    }
    if (restaurant) {
      const location = safeQuerySelector("#restaurant-location");
      const name = safeQuerySelector("#restaurant-name");
      const tagline = safeQuerySelector("#restaurant-tagline");
      const note = safeQuerySelector("#restaurant-note");
      if (location) location.textContent = restaurant.locationLabel;
      if (name) name.textContent = restaurant.name;
      if (tagline) tagline.textContent = restaurant.tagline;
      if (note) note.textContent = restaurant.demoNote;
    }
    renderCategoryFilters(getCategories(menu));
    renderMenuCards(menu);
    initCardTilt();
  }

  function renderCategoryFilters(categories) {
    const rail = safeQuerySelector("#categoryFilters");
    if (!rail) return;
    rail.innerHTML = categories.map((category) => `
      <button class="category-pill${category === activeCategory ? " active" : ""}" type="button" data-category="${escapeHTML(category)}" aria-pressed="${category === activeCategory}">${escapeHTML(category)}</button>
    `).join("");
    rail.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      setActiveCategory(button.dataset.category);
    }, { once: false });
  }

  function setActiveCategory(category) {
    activeCategory = category || "All";
    document.querySelectorAll(".category-pill").forEach((button) => {
      const isActive = button.dataset.category === activeCategory;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    const items = activeCategory === "All" ? getMenu() : getMenu().filter((dish) => dish.category === activeCategory);
    renderMenuCards(items);
    initCardTilt();
  }

  function renderMenuCards(items) {
    const grid = safeQuerySelector("#menuCards");
    const empty = safeQuerySelector("#menuEmpty");
    if (!grid) return;
    grid.innerHTML = items.map((dish) => `
      <article class="dish-card tilt-card" style="--dish-accent:${escapeHTML(dish.accent)}">
        <a class="dish-card-link" href="./dish.html?id=${encodeURIComponent(dish.id)}" aria-label="View ${escapeHTML(dish.name)} in 3D">
          <div class="dish-image" data-image="${escapeHTML(dish.image)}">
            <img src="${escapeHTML(dish.image)}" alt="${escapeHTML(dish.name)}" loading="lazy" onerror="this.remove();">
          </div>
          <div class="dish-card-body">
            <div class="card-kicker"><span>${escapeHTML(dish.category)}</span><span class="price">${formatPrice(dish.price)}</span></div>
            <h3>${escapeHTML(dish.name)}</h3>
            <p>${escapeHTML(dish.description)}</p>
            <div class="badge-row">
              <span class="badge ${dish.type === "non-veg" ? "nonveg" : "veg"}">${typeLabel(dish.type)}</span>
              <span class="badge">Spice: ${escapeHTML(dish.spice)}</span>
            </div>
            <p class="portion">${escapeHTML(dish.portionNote)}</p>
            <span class="button card-button">View in 3D</span>
          </div>
        </a>
      </article>
    `).join("");
    if (empty) empty.classList.toggle("hidden", items.length > 0);
  }

  function hasModelAssets(dish) {
    return Boolean(dish?.modelGlb && dish?.modelUsdz);
  }

  function getRelatedDishes(currentDish) {
    return getMenu().filter((dish) => dish.id !== currentDish.id).slice(0, 2);
  }

  function renderDishPage() {
    const id = getDishIdFromURL();
    const dish = getMenu().find((item) => item.id === id);
    if (!dish) return renderDishNotFound();
    renderDishDetail(dish);
    initCardTilt();
  }

  function renderDishDetail(dish) {
    const root = safeQuerySelector("#dishRoot");
    if (!root) return;
    const related = getRelatedDishes(dish);
    root.innerHTML = `
      <a class="back-button" href="./menu.html">← Back to menu</a>
      <section class="dish-detail-grid">
        <div class="dish-copy">
          <p class="eyebrow">${escapeHTML(dish.category)}</p>
          <h1>${escapeHTML(dish.name)}</h1>
          <div class="dish-meta"><span class="price large">${formatPrice(dish.price)}</span><span class="badge ${dish.type === "non-veg" ? "nonveg" : "veg"}">${typeLabel(dish.type)}</span><span class="badge">Spice: ${escapeHTML(dish.spice)}</span></div>
          <p class="detail-description">${escapeHTML(dish.description)}</p>
          <p class="portion">${escapeHTML(dish.portionNote)}</p>
          <div class="tag-row">${dish.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        </div>
        <section class="viewer-card" aria-labelledby="viewer-title">
          <div class="viewer-heading"><h2 id="viewer-title">3D table preview</h2><p>On supported phones, tap the AR button to place this dish on your table.</p></div>
          <div class="model-stage" id="modelStage"></div>
          <p class="fallback-note">If AR is not available, you can still rotate the 3D preview.</p>
        </section>
      </section>
      <section class="related-section" aria-labelledby="related-title"><h2 id="related-title">Related dishes</h2><div class="related-grid">${related.map((item) => `<a class="related-card tilt-card" href="./dish.html?id=${encodeURIComponent(item.id)}"><span>${escapeHTML(item.category)}</span><strong>${escapeHTML(item.name)}</strong><em>${formatPrice(item.price)}</em></a>`).join("")}</div></section>
    `;
    renderModelViewer(dish);
  }

  function renderModelViewer(dish) {
    const stage = safeQuerySelector("#modelStage");
    const template = safeQuerySelector("#modelViewerTemplate");
    if (!stage || !template || !hasModelAssets(dish)) {
      if (stage) stage.innerHTML = `<div class="model-fallback"><strong>3D model unavailable</strong><p>The expected model path is missing from this dish data.</p></div>`;
      return;
    }
    const viewer = template.content.firstElementChild.cloneNode(true);
    viewer.setAttribute("src", dish.modelGlb);
    viewer.setAttribute("ios-src", dish.modelUsdz);
    viewer.setAttribute("poster", dish.image);
    viewer.setAttribute("alt", `3D model of ${dish.name}`);
    viewer.addEventListener("error", () => {
      stage.innerHTML = `<div class="model-fallback"><strong>3D preview could not load</strong><p>Replace the placeholder file at ${escapeHTML(dish.modelGlb)} with a valid GLB model. The AR paths remain wired for deployment.</p></div>`;
    }, { once: true });
    stage.appendChild(viewer);
  }

  function renderDishNotFound() {
    const root = safeQuerySelector("#dishRoot");
    if (!root) return;
    root.innerHTML = `<section class="not-found glass-panel"><p class="eyebrow">Dish not found</p><h1>Dish not found</h1><p>The menu item may not exist, or the link may be missing a valid dish id.</p><a class="button button-primary" href="./menu.html">Back to menu</a></section>`;
  }

  function initCardTilt() {
    cardPhysics?.scan();
    scrollReveals?.scan();
  }

  function initExperienceSystems() {
    timing = new TimingSystem({ reducedMotion: reduceMotion });
    pointerSystem = new PointerSystem({ timing, reducedMotion: reduceMotion });
    cardPhysics = new CardPhysicsSystem({ timing, reducedMotion: reduceMotion });
    scrollReveals = new ScrollRevealSystem({ reducedMotion: reduceMotion });
    document.body.classList.toggle("reduced-motion", reduceMotion);
    initLandingScene();
    scrollReveals.scan();
    timing.start();
  }

  function initLandingScene() {
    const canvas = safeQuerySelector("#tableLensScene");
    if (!canvas || reduceMotion) return;
    const quality = new QualityManager();
    new WebGLExperience({
      canvas,
      timing,
      pointer: pointerSystem,
      quality,
      reducedMotion: reduceMotion,
      createScene: () => new TableScene({ particleScale: quality.particleScale, pointer: pointerSystem, reducedMotion: reduceMotion }),
      createCameraController: (camera) => new CameraController(camera, { pointer: pointerSystem, reducedMotion: reduceMotion })
    });
  }

  function initReducedMotion() {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion = media.matches;
    media.addEventListener?.("change", (event) => { reduceMotion = event.matches; });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReducedMotion();
    initExperienceSystems();
    if (getCurrentPage() === "menu") renderMenuPage();
    if (getCurrentPage() === "dish") renderDishPage();
  });
}());
