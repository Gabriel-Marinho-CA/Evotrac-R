class CartDrawer extends HTMLElement {
  constructor() {
    super();
  }
}

class CartDrawerControls {
  constructor() {
    this.minicart = document.querySelector("cart-drawer");
    this.element_open_minicart = document.querySelector('.minicart');

    this.element_open_minicart.addEventListener('click', this.openMinicart.bind(this));
  }
  openMinicart() {
    this.minicart.classList.add("active");
    overlayController.activeOverlay();
  }
  closeMinicart() {
    this.minicart.classList.remove("active");
  }
}


let cartDrawerControls;
window.addEventListener('load', () => {
   cartDrawerControls = new CartDrawerControls();
});