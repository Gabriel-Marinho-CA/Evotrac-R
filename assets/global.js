function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

class SwiperInstance extends HTMLElement {
  constructor() {
    super();

    this.slide_desktop = parseInt(this.getAttribute("slide-desktop")) || 1;
    this.slide_mobile = parseInt(this.getAttribute("slide-mobile")) || 1;
    this.have_arrows = this.hasAttribute("have-arrow");
    this.arrows_outside = this.hasAttribute("arrows-outside");
    this.have_dots = this.hasAttribute("have-dots");
    this.space_between_desk =
      parseInt(this.getAttribute("space-between-desk")) || 24;
    this.space_between_mobile =
      parseInt(this.getAttribute("space-between-mob")) || 12;
    this.loop = this.hasAttribute("loop");
    this.autoplay = this.hasAttribute("autoplay");
    this.autoplay_speed = parseInt(this.getAttribute("autoplay-speed")) || 4500;
  }

  connectedCallback() {
    this.initSwiper();
  }

  initSwiper() {
    new Swiper(this, {
      loop: this.loop,

      slidesPerView: this.slide_mobile,
      spaceBetween: this.space_between_mobile,

      breakpoints: {
        1024: {
          slidesPerView: this.slide_desktop,
          spaceBetween: this.space_between_desk,
        },
      },

      navigation: this.have_arrows
        ? {
            nextEl: this.arrows_outside
              ? this.parentElement.parentElement.querySelector(
                  ".swiper-button-next"
                )
              : this.querySelector(".swiper-button-next"),
            prevEl: this.arrows_outside
              ? this.parentElement.parentElement.querySelector(
                  ".swiper-button-prev"
                )
              : this.querySelector(".swiper-button-prev"),
          }
        : false,

      pagination: this.have_dots
        ? {
            el: this.querySelector(".swiper-pagination"),
            clickable: true,
          }
        : false,

      autoplay: this.autoplay
        ? {
            delay: this.autoplay_speed,
            disableOnInteraction: false,
          }
        : false,
    });
  }
}

customElements.define("swiper-instance", SwiperInstance);

class ActiveOverlay {
  constructor() {
    this.overlay = document.querySelector(".overlay");
    this.open = false;
    this.overlay.addEventListener('click',this.activeOverlay.bind(this))
  }
  activeOverlay() {
    if (this.open) {
      this.overlay.classList.remove("active");
      this.open = false;
      
      if(cartDrawerControls.minicart.classList.contains('active')) {
        cartDrawerControls.closeMinicart();
      }
    } else {
      this.overlay.classList.add("active");
      this.open = true;
    }
  }
}

let overlayController;
window.addEventListener("load", () => {
  overlayController = new ActiveOverlay();
});
