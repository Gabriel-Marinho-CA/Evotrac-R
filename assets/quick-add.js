class AddToCart extends HTMLButtonElement {
  constructor() {
    super();
    this.product_id = parseInt(this.getAttribute("data-product-id"));
    this.addEventListener("click", this.onSubmitHandler.bind(this));
  }

  onSubmitHandler() {
    const config = fetchConfig("javascript");
    // config.headers["X-Requested-With"] = "XMLHttpRequest";
    // delete config.headers["Content-Type"];

    const productObj = {
      items: [
        {
          id: this.product_id,
          quantity: 1,
        },
      ],
    };

    config.body = JSON.stringify(productObj);

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        publish(PUB_SUB_EVENTS.cartUpdate, {
          source: "quick-add",
          productVariantId: this.product_id,
          cartData: response,
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {

      });
  }
}
customElements.define("add-to-cart", AddToCart, {
  extends:'button'
});
