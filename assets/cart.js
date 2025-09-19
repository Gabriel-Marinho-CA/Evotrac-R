class CartHooks {

  constructor() {
    this.currentController = null;
  }

  onCartUpdate() {
    return fetch(`${routes.cart_url}?section_id=cart-drawer`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const selectors = ["cart-items", ".cart-drawer__footer", ".buble-quantity"];
        const newQuantityBuble = html.querySelector('.buble-quantity').innerText;
        for (const selector of selectors) {
          const targetElement = document.querySelector(selector);
          const sourceElement = html.querySelector(selector);
          if (targetElement && sourceElement) {
            targetElement.replaceWith(sourceElement);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
  onUpdateQuantity(line_id, qtd) {
    if (this.currentController) {
      this.currentController.abort();
    }

    this.currentController = new AbortController();

    const body = JSON.stringify({
      id: line_id,
      quantity: qtd
    });


    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), signal: this.currentController.signal, ...{ body } })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        return this.onCartUpdate();
      })
      .catch((err) => {
        console.error(err);
      })
  }
  onRemoveItem(line_id) {
    if (this.currentController) {
      this.currentController.abort();
    }
    this.currentController = new AbortController();
    const body = JSON.stringify(
      {
        id: line_id,
        quantity: 0
      }
    )

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), signal: this.currentController.signal, ...{ body } })
      .then(res => {
        if (res.ok) {
          this.onCartUpdate();
        }
      })
      .catch((err) => {
        console.error(err);
      })
  }
}

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.cartHooks = new CartHooks;
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => {
        if (event.source == "cart-items") return;

        return this.cartHooks.onCartUpdate();
      }
    );
  }
  onUpdateQuantity(line_id, quantity) {
    return this.cartHooks.onUpdateQuantity(line_id, quantity);
  }
}

customElements.define("cart-items", CartItems);


class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.cartInstance = new CartHooks;
    this.line_id = this.dataset.removeItemId;

    this.addEventListener('click', () => this.cartInstance.onRemoveItem(this.line_id));
  }

}
customElements.define("cart-remove-item", CartRemoveButton);

let cartItems;
window.addEventListener('load', () => {
  cartItems = new CartItems();
});

