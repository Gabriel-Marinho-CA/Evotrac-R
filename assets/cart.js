class CartItems extends HTMLElement {
  constructor() {
    super();
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => {
        if (event.source == "cart-items") return;

        return this.onCartUpdate();
      }
    );
  }

  onCartUpdate() {
    return fetch(`${routes.cart_url}?section_id=cart-drawer`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const selectors = ["cart-items", ".cart-drawer__footer",".buble-quantity"];
        const newQuantityBuble = html.querySelector('.buble-quantity').innerText;
        for (const selector of selectors) {
          const targetElement = document.querySelector(selector);
          const sourceElement = html.querySelector(selector);
          if (targetElement && sourceElement) {
            targetElement.replaceWith(sourceElement);
          }
        }

        setTimeout(() => {
          cartDrawerControls.openMinicart();
          document.querySelector(".overlay").classList.add('active');
          this.updateQuantyBuble(newQuantityBuble);

        },ON_CHANGE_DEBOUNCE_TIMER ) 
      })
      .catch((e) => {
        console.error(e);
      });
  }

  updateQuantyBuble(newQty) {
    document.querySelector('.cart-count-span').innerText = newQty;
  }
}

customElements.define("cart-items", CartItems);
