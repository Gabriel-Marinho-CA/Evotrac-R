class ProductVariantes extends HTMLFieldSetElement {
  constructor() {
    super();
    this.currentController = null;
    this.addEventListener("change", this.onChange.bind(this));
  }

  onChange(event) {
    const input = event.target;

    if (input.tagName !== "INPUT") return;

    const requestUrl = input.value;
    this.changeVariant(requestUrl);
    
    this.querySelectorAll(".wrapper-op").forEach((el) =>
      el.classList.remove("active")
    );

    this.querySelector(".wrapper-op:has(input:checked)").classList.add(
      "active"
    );
  }

  async changeVariant(requestUrl) {
    this.updateUrl(requestUrl);

    try {
      const request = await fetch(`${window.shopUrl}${requestUrl}`);
      const response = await request.text();

      const html = new DOMParser().parseFromString(response, "text/html");

      const productPriceDOM = document.querySelector("#product .price-area");
      const productPrice = html.querySelector("#product .price-area");

      productPriceDOM.innerHTML = productPrice.innerHTML;
    } catch (error) {
      console.error("Erro ao trocar variante:", error);
    }
  }

  updateUrl(newUrl) {
    if (!newUrl.startsWith("/")) {
      newUrl = "/" + newUrl;
    }

    window.history.replaceState({}, "", newUrl);
  }

  _setupRequest() {
    if (this.currentController) this.currentController.abort();
    this.currentController = new AbortController();
    return this.currentController.signal;
  }
}

customElements.define("variant-options", ProductVariantes, {
  extends: "fieldset",
});
