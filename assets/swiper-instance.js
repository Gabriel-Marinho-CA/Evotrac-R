class SwiperInstance extends HTMLElement {
  constructor() {
    super();

    this.slide_desktop = parseInt(this.getAttribute("slide-desktop")) || 1;
    this.slide_mobile = parseInt(this.getAttribute("slide-mobile")) || 1;
    this.have_arrows = this.hasAttribute("have-arrow");
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
            nextEl: this.querySelector(".swiper-button-next"),
            prevEl: this.querySelector(".swiper-button-prev"),
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