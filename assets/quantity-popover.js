class QuantityPopOver extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.input = this.querySelector('input');
        if (!this.input) return;
        this.line_id = this.input.dataset.quantityVariantId;
        this.decrease_button = this.querySelector('.minus');
        this.increase_button = this.querySelector('.plus');
        this.current_quantity = parseInt(this.input.value);


        this.decrease_button.addEventListener('click', ()=> {
            cartItems.onUpdateQuantity(this.line_id, this.current_quantity - 1);
        })
        this.increase_button.addEventListener('click', () => {
            console.log(this.current_quantity)
            cartItems.onUpdateQuantity(this.line_id, this.current_quantity + 1);
        })
    }
}

customElements.define('quantity-popover', QuantityPopOver);