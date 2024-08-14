import BasePage from "../base-page";
class ProductCard extends HTMLElement {
	
  constructor() {
    super();
  }

  connectedCallback() {
    // Parse product data
    this.product = this.product || JSON.parse(this.getAttribute("product"));
    
    if (window.app?.status === "ready") {
      this.onReady();
    } else {
      document.addEventListener("theme::ready", () => this.onReady());
    }
  }

async  onReady() {
  
    

    this.fitImageHeight = salla.config.get("store.settings.product.fit_type");
    salla.wishlist.event.onAdded((event, id) => this.toggleFavoriteIcon(id));
    salla.wishlist.event.onRemoved((event, id) =>
      this.toggleFavoriteIcon(id, false)
    );
    this.placeholder = salla.url.asset(
      salla.config.get("theme.settings.placeholder")
    );
    this.getProps();

    this.source = salla.config.get("page.slug");
    // If the card is in the landing page, hide the add button and show the quantity
    if (this.source == "landing-page") {
      this.hideAddBtn = true;
      this.showQuantity = window.showQuantity;
    }

    salla.lang.onLoaded(() => {
      // Language
      this.remained = salla.lang.get("pages.products.remained");
      this.donationAmount = salla.lang.get("pages.products.donation_amount");
      this.startingPrice = salla.lang.get("pages.products.starting_price");
      this.addToCart = salla.lang.get("pages.cart.add_to_cart");
      this.outOfStock = salla.lang.get("pages.products.out_of_stock");

      // re-render to update translations
      this.render();
    });

    this.render();
  }

  initCircleBar() {
    let qty = this.product.quantity,
      total = this.product.quantity > 100 ? this.product.quantity * 2 : 100,
      roundPercent = (qty / total) * 100,
      bar = this.querySelector(".s-product-card-content-pie-svg-bar"),
      strokeDashOffsetValue = 100 - roundPercent;
    bar.style.strokeDashoffset = strokeDashOffsetValue;
  }

  toggleFavoriteIcon(id, isAdded = true) {
    document
      .querySelectorAll('.s-product-card-wishlist-btn[data-id="' + id + '"]')
      .forEach((btn) => {
        app.toggleElementClassIf(
          btn,
          "s-product-card-wishlist-added",
          "not-added",
          () => isAdded
        );
        app.toggleElementClassIf(
          btn,
          "pulse-anime",
          "un-favorited",
          () => isAdded
        );
      });
  }

  formatDate(date) {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  getProductBadge() {
    if (this.product.promotion_title) {
      return `<div class="s-product-card-promotion-title">${this.product.promotion_title}</div>`;
    }
    if (this.showQuantity && this.product?.quantity) {
      return `<div
        class="s-product-card-quantity">${this.remained} ${salla.helpers.number(
        this.product?.quantity
      )}</div>`;
    }
    if (this.showQuantity && this.product?.is_out_of_stock) {
      return `<div class="s-product-card-out-badge">${this.outOfStock}</div>`;
    }
    return "";
  }

  getPriceFormat(price) {
    if (!price || price == 0) {
      return salla.config.get("store.settings.product.show_price_as_dash")
        ? "-"
        : "";
    }

    return salla.money(price);
  }

  ratingProduct() {
    let rate = "";

    for (let i = 0; i < 5; i++) {
      if (i <= this.product?.rating?.stars - 1) {
        rate += `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
            <path d="M10.9577 2.47119C6.05909 2.47119 2.09229 6.26095 2.09229 10.9305C2.09229 15.6 6.05909 19.3898 10.9577 19.3898C15.8652 19.3898 19.8409 15.6 19.8409 10.9305C19.8409 6.26095 15.8652 2.47119 10.9577 2.47119ZM14.7204 16.0061L10.9666 13.8489L7.21275 16.0061L8.20667 11.9371L4.89656 9.20479L9.26271 8.8495L10.9666 5.00898L12.6704 8.84104L17.0366 9.19633L13.7265 11.9287L14.7204 16.0061Z" fill="#FFAC0D"/>
          </svg>`;
      } else {
        rate += `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
          <path d="M10.6657 2.47119C5.7671 2.47119 1.80029 6.26095 1.80029 10.9305C1.80029 15.6 5.7671 19.3898 10.6657 19.3898C15.5732 19.3898 19.5489 15.6 19.5489 10.9305C19.5489 6.26095 15.5732 2.47119 10.6657 2.47119ZM14.4284 16.0061L10.6746 13.8489L6.92076 16.0061L7.91468 11.9371L4.60457 9.20479L8.97072 8.8495L10.6746 5.00898L12.3784 8.84104L16.7446 9.19633L13.4345 11.9287L14.4284 16.0061Z" fill="#404553"/>
        </svg>`;
      }
    }

    return rate;
  }

  getProductPrice() {
    let price = "";
    if (this.product.is_on_sale) {
      price = `<div class="shamelBold flex justify-center items-center gap-2 ">
                  <h4 class=" text-center text-[#F77171]">${this.getPriceFormat(this.product.sale_price)}</h4>
                  <span class="before-sale text-center line-through  text-[#404553] ">

                
                ${this.getPriceFormat(this.product.regular_price)}
                </span>
                  
                </div>`;
    } else if (this.product.starting_price) {
      price = `<div class="s-product-card-starting-price shamelBold">
                    <p>${this.startingPrice}</p>
                    <h4> ${this.getPriceFormat(
                      this.product?.starting_price
                    )} </h4>
                </div>`;
    } else {
      price = ` <div class="shamelBold flex justify-center items-center gap-2 h-[26px]"> <h4 class="s-product-card-price  shamelBold !text-[15px]">${this.getPriceFormat(
        this.product?.price
      )}</h4> </div>`;
    }

    return price;
  }

  getAddButtonLabel() {
    if (this.product.status === "sale" && this.product.type === "booking") {
      return salla.lang.get("pages.cart.book_now");
    }

    if (this.product.status === "sale") {
      return salla.lang.get("pages.cart.add_to_cart");
    }

    if (this.product.type !== "donating") {
      return salla.lang.get("pages.products.out_of_stock");
    }

    // donating
    return salla.lang.get("pages.products.donation_exceed");
  }
  imagesLoop(product){
let images = ``
let thumbs=``
    product.map((e) => {
      images +=  `
      <a href="${this.product.url}" class=" block">
      <div style="height: 240px">
    <img
      class="object-cover w-full h-full"
      src="${e.url}"
      alt="${e.alt}"
    /></div></a>`    
    thumbs += `
    <div class=" rounded-full" style="background-color: #334155 ; height : 20px"></div>
    `
    
    });

    return {
      images, 
      thumbs
     }
  }


  getProps() {

    /**
     * fetch product
     */

   
    /**
     * feature color
     */
    this.colorF = this.getAttribute("colorf")
    

    /**
     * color feature card
     */
      this.changeColor = this.hasAttribute("changeColor")
    /**
     * isLimited card
     */
    this.isLimited = this.hasAttribute("isLimited");

    /**
     * Big Product
     */
    this.BigProduct= this.hasAttribute("bigProduct")

    /**
     * is featured
     */
    this.isFeatured = this.hasAttribute("isFeatured")
    /**
     *  Horizontal card.
     */
    this.horizontal = this.hasAttribute("horizontal");

    /**
     *  Support shadow on hover.
     */
    this.shadowOnHover = this.hasAttribute("shadowOnHover");

    /**
     *  Hide add to cart button.
     */
    this.hideAddBtn = this.hasAttribute("hideAddBtn");

    /**
     *  Full image card.
     */
    this.fullImage = this.hasAttribute("fullImage");

    /**
     *  Minimal card.
     */
    this.minimal = this.hasAttribute("minimal");

    /**
     *  Special card.
     */
    this.isSpecial = this.hasAttribute("isSpecial");

    /**
     *  Show quantity.
     */
    this.showQuantity = this.hasAttribute("showQuantity");
  }

  render() {
	let namelength = 100;
	  
    this.classList.add("s-product-card-entry");
	this.classList.add("max-w-[100%]");
  this.setAttribute("id", this.product.id);
    !this.horizontal && !this.fullImage && !this.minimal
      ? this.classList.add("s-product-card-vertical")
      : "";
    this.horizontal && !this.fullImage && !this.minimal
      ? this.classList.add("s-product-card-horizontal")
      : "";
    this.fitImageHeight && !this.isSpecial && !this.fullImage && !this.minimal
      ? this.classList.add("s-product-card-fit-height")
      : "";
    this.isSpecial ? this.classList.add("s-product-card-special") : "";
    this.fullImage ? this.classList.add("s-product-card-full-image") : "";
    this.minimal ? this.classList.add("s-product-card-minimal") : "";
    this.product?.donation ? this.classList.add("s-product-card-donation") : "";
    this.shadowOnHover ? this.classList.add("s-product-card-shadow") : "";
    this.product?.is_out_of_stock
      ? this.classList.add("s-product-card-out-of-stock")
      : "";

    this.innerHTML = `
    ${
     
      this.BigProduct?`
      
      <div id="product-${
        this.product.id
        }" class="product-entry gap-2 product-entry--full-image overflow-hidden  !p-4 flex-col justify-between align-center w-full w-[90%] md:w-[80%] lg:w-[75%] xl:w-[532px]" style="border-radius:40px;background-color:#EAE9E9;">
          <a href="${this.product.id}" class="relative w-full h-[78%] overflow-hidden rounded-md hover:opacity-90 block mt-6">
            <img class="object-contain w-full h-full lazy loaded" src="${this.product.image.url}" alt="${this.product.image.alt}" loading="lazy" >
          </a>
          <a class="block" href="${this.product.url}" class="absolute top-0 bottom-0 left-0 right-0 transition-opacity duration-700  rounded-2xl" ></a>
          <div class="flex flex-col justify-center items-end">
            <div class="flex flex-col justify-between w-full items-center mb-10 gap-2">
                  <div class="flex flex-col justify-center items-center gap-4"> 
                  
                  
              <h1 class="text-sm font-bold leading-6 text-black product-entry__title mt-2">
                <a  href="${this.product.url}" class="shamelBook !text-[32px] ">${this.product.name}</a>
              </h1>
              <div class="flex text-2xl justify-center items-center shamelBold text-[32px] gap-2 ${this.product.is_on_sale && "text-[#F77171]" }">
                <h4 >${this.getPriceFormat(this.product.price)}</h4>
                ${
                  this.product.is_on_sale?`<span class="before-sale text-center line-through font-bold text-[#404553] relative">
                  
                  
                      ${this.getPriceFormat(this.product.regular_price) }
                 
                 
                  </span>`:''
                }
              
</div>
        
</div>        
            </div>
            <div class="w-full rounded-md bg-[#334155] flex items-center justify-center">

    <salla-add-product-button width="wide" class=" py-2" product-id="${this.product.id}">
    
      
</salla-add-product-button>
  </div>
            </div>


${
  this.product.is_on_sale ?`<div class="bg_title_line absolute top-0 lg:top-12 left-0 py-1 px-6" style="background-color:#334155">

  <p class="text-white"> ${
    (100 -
    ((this.product.price / this.product.regular_price) *
      100)).toFixed(0)
  }% ${
    salla.config.get("user.language_code")    === "ar" ? " خصم علي هذا المنتج " : "Discount on this product"
  }
  </p>
  </div>`:''
}
  



                 

        <div class="flex gap-1 flex-col items-center justify-center  mt-auto absolute" style=" top: 18px ; right:7px">
          
          <div class="wishlist h-[30px] w-[30px] flex justify-center items-center" >
          <salla-button onclick="salla.wishlist.toggle(${this.product.id})" shape="icon" fill="outline" color="primary" aria-label="wishlist button" class=" s-button-wrap hydrated">
            <svg xmlns="http://www.w3.org/2000/svg" width="47" height="48" viewBox="0 0 47 48" fill="none">
            <path d="M23.1506 42.4608L20.3714 39.8758C10.5006 30.7304 3.98389 24.6987 3.98389 17.2962C3.98389 11.2646 8.62222 6.52539 14.5256 6.52539C17.8606 6.52539 21.0614 8.11164 23.1506 10.6183C25.2397 8.11164 28.4406 6.52539 31.7756 6.52539C37.6789 6.52539 42.3172 11.2646 42.3172 17.2962C42.3172 24.6987 35.8006 30.7304 25.9297 39.8954L23.1506 42.4608Z" fill="#212121"/>
            </svg>
          </salla-button>
        </div>
        
                <div class="quickview-btn eye-icon h-[30px] w-[30px] flex justify-center items-center" onclick="app.clickModal(${this.product.id})" data-product-id="${this.product.id}">
                    <salla-button  fill="outline"  class="s-button-wrap hydrated flex justify-center items-center" shape="btn" color="primary" size="medium" width="normal">

                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                    <path d="M21.6507 8.90039C12.6924 8.90039 5.04197 14.6021 1.94238 22.6504C5.04197 30.6987 12.6924 36.4004 21.6507 36.4004C30.6091 36.4004 38.2595 30.6987 41.3591 22.6504C38.2595 14.6021 30.6091 8.90039 21.6507 8.90039ZM21.6507 31.8171C16.7057 31.8171 12.6924 27.7104 12.6924 22.6504C12.6924 17.5904 16.7057 13.4837 21.6507 13.4837C26.5957 13.4837 30.6091 17.5904 30.6091 22.6504C30.6091 27.7104 26.5957 31.8171 21.6507 31.8171ZM21.6507 17.1504C18.6765 17.1504 16.2757 19.6071 16.2757 22.6504C16.2757 25.6937 18.6765 28.1504 21.6507 28.1504C24.6249 28.1504 27.0257 25.6937 27.0257 22.6504C27.0257 19.6071 24.6249 17.1504 21.6507 17.1504Z" fill="#212121"/>
                    </svg>

                    </salla-button>
                </div>
              <div class="addToCart h-[30px] w-[30px] flex justify-center items-center" >
                <salla-add-product-button shape="icon" class="addToCart__btn hydrated flex justify-center " product-id="${this.product.id}" product-status="sale" fill="outline" product-type="product">
                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="36" viewBox="0 0 31 36" fill="none">
<path d="M15.6794 13.5916H18.6821V8.53302H23.1861V5.16063H18.6821V0.102051H15.6794V5.16063H11.1754V8.53302H15.6794V13.5916ZM9.67405 28.7673C8.02258 28.7673 6.68639 30.2849 6.68639 32.1397C6.68639 33.9946 8.02258 35.5121 9.67405 35.5121C11.3255 35.5121 12.6767 33.9946 12.6767 32.1397C12.6767 30.2849 11.3255 28.7673 9.67405 28.7673ZM24.6874 28.7673C23.036 28.7673 21.6998 30.2849 21.6998 32.1397C21.6998 33.9946 23.036 35.5121 24.6874 35.5121C26.3389 35.5121 27.6901 33.9946 27.6901 32.1397C27.6901 30.2849 26.3389 28.7673 24.6874 28.7673ZM11.3255 20.3364H22.5105C23.6365 20.3364 24.6274 19.645 25.1378 18.5996L30.933 6.77938L28.3207 5.16063L22.5105 16.964H11.9711L5.57539 1.78824H0.666016V5.16063H3.66869L9.07351 17.9588L7.04671 22.0732C5.95073 24.3327 7.39201 27.0812 9.67405 27.0812H27.6901V23.7088H9.67405L11.3255 20.3364Z" fill="black"/>
</svg>
                </salla-add-product-button>
              </div>
            </div>



          </div>
        </div>
 
      
      `:
      this.isFeatured ? `
      <div  class="flex flex-col items-center overflow-hidden  rounded-xl  relative mx-5" style="width : 250px ; background-color: ${this.colorF} ; box-shadow :0px 0px 10px rgba(0,0,0,.1)">
      ${
        this.product.is_on_sale ?
        `<div class="absolute top-4 left-4 z-10 w-[50px] h-[50px] bg-[#FFAC0D] text-white rounded-full flex justify-center items-center">
         ${
            100 -
            ((this.product.price / this.product.regular_price) *
              100).toFixed(0)
          }%
        </div>`:``
      }
      <div class="absolute md:top-4 top-1 md:right-3  right-[1px] flex flex-col gap-1 z-10">
      <div class="wishlist md:h-auto h-[30px]">
      <salla-button onclick="salla.wishlist.toggle(${this.product.id})" shape="icon" fill="outline" color="primary" aria-label="wishlist button" class=" s-button-wrap hydrated">
        <svg xmlns="http://www.w3.org/2000/svg" width="53" height="53" viewBox="0 0 47 48" fill="none">
        <path d="M23.1506 42.4608L20.3714 39.8758C10.5006 30.7304 3.98389 24.6987 3.98389 17.2962C3.98389 11.2646 8.62222 6.52539 14.5256 6.52539C17.8606 6.52539 21.0614 8.11164 23.1506 10.6183C25.2397 8.11164 28.4406 6.52539 31.7756 6.52539C37.6789 6.52539 42.3172 11.2646 42.3172 17.2962C42.3172 24.6987 35.8006 30.7304 25.9297 39.8954L23.1506 42.4608Z" fill="#212121"/>
        </svg>
      </salla-button>
    </div>
    <div class="quickview-btn eye-icon flex justify-center items-center" onclick="app.clickModal(${this.product.id})" >
        <salla-button  fill="outline"  class="s-button-wrap hydrated " shape="btn" color="primary" size="medium" width="normal">

        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
        <path d="M21.6507 8.90039C12.6924 8.90039 5.04197 14.6021 1.94238 22.6504C5.04197 30.6987 12.6924 36.4004 21.6507 36.4004C30.6091 36.4004 38.2595 30.6987 41.3591 22.6504C38.2595 14.6021 30.6091 8.90039 21.6507 8.90039ZM21.6507 31.8171C16.7057 31.8171 12.6924 27.7104 12.6924 22.6504C12.6924 17.5904 16.7057 13.4837 21.6507 13.4837C26.5957 13.4837 30.6091 17.5904 30.6091 22.6504C30.6091 27.7104 26.5957 31.8171 21.6507 31.8171ZM21.6507 17.1504C18.6765 17.1504 16.2757 19.6071 16.2757 22.6504C16.2757 25.6937 18.6765 28.1504 21.6507 28.1504C24.6249 28.1504 27.0257 25.6937 27.0257 22.6504C27.0257 19.6071 24.6249 17.1504 21.6507 17.1504Z" fill="#212121"/>
        </svg>

        </salla-button>
    </div>
   </div>
      <div class="feature-3">
          <salla-slider  show-controls="false" show-thumbs-controls="false" type="thumbs">
            <div slot="items">
            ${this.imagesLoop(this.product.images).images}
            </div>
            <div slot="thumbs">
            ${this.imagesLoop(this.product.images).thumbs}
          </div>
          </salla-slider>
      </div>
          <div class=" flex flex-col justify-center items-center w-full px-2">
          <div class="overflow-hidden h-8 gap-2 text-center  mt-2">
            <p class="shamelMid md:text-[24px] ">${this.product.name}</p>
          </div>
          <div class="flex justify-center  items-center gap-2 w-full  shamelMid md:text-[17px]">
            
              <span class="after-sale text-center  font-bold text-[#FFAC0D]">${this.getPriceFormat(
                this.product.price
              )}</span>
              ${
                this.product.is_on_sale?
                ` <span class="before-sale text-center line-through font-bold text-[#404553] relative">
                ${this.getPriceFormat(this.product.regular_price)}
                </span>`:``
              }
              
            
            
            
          </div>
          
          <div class="addToCart my-3 w-full rounded-md flex items-center justify-center">
          <salla-add-product-button  class="  hydrated" width="wide" product-id="${this.product.id}">
    
      
</salla-add-product-button>
        </div>
        </div>
    </div>
      `
      :
      this.isLimited
        ? `
        <a href="${
          this.product.url
        }" class="relative flex flex-col items-start justify-start ml-16" style="width:12rem;">
                    ${
                      this.product.is_on_sale ?
                      `
                          <div class="absolute top-0 right-0  w-14 h-19 bg-[#FCDB3D] flex flex-col items-start justify-between">
                          <svg class="mx-auto" style="transform:translate(6px, -3px);" xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewbox="0 0 42 38" fill="none">
                            <g clip-path="url(#clip0_177_18631)">
                              <path d="M7.96631 4.56543V24.3266H13.6494V40.4949L26.9099 18.9372H19.3324L25.0155 4.56543H7.96631Z" fill="#212121"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_177_18631">
                                <rect width="38" height="40" fill="white" transform="translate(0.939941)"/>
                              </clipPath>
                            </defs>
                          </svg>
                          <h3 class="w-full text-sm font-bold text-center py-2">% ${
                            100 -
                            ((this.product.price / this.product.regular_price) *
                              100).toFixed(0)
                          }- </h3>
                        </div>
                          `:``
                    }
                        
                        <div class="w-full flex flex-col justify-center items-center">
                          <div class="w-full h-60 md:h-72">
                            <img class=" w-full h-full mb-2" src="${
                              this.product.image.url
                            }"/>
                          </div>
                          <div class="w-full text-center shamelBook  !text-[24px] my-2">${this.product.name}</div>

                          <div class=" w-full flex justify-center gap-2 items-center ">
                          <p class="  shamelBold text-[22px] font-bold text-center ${this.product.is_on_sale ? "text-[#F77171]": "text-black"} ">${this.getPriceFormat(
                            this.product.price
                          )}</p>
                          ${
                            this.product.is_on_sale ? `
                            <span class="before-sale shamelBold text-[20px] line-through text-center font-bold  relative">
                            ${this.getPriceFormat(this.product.regular_price)}
                            </span>
                            
                            `:``
                          }
                          </div>
                          
               
                          
                        </div>
                      </a>
        `
        : `
      <div class="relative flex flex-col pb-2 shadow rounded justify-center  items-center gap-2 " style="background-color: transparent">
      <div class=" absolute flex flex-col " style=" top:10px ;right:5px ;z-index:11">
       
      <div class="wishlist">
      <salla-button onclick="salla.wishlist.toggle(${
        this.product.id
      })" shape="icon" fill="outline" color="primary" aria-label="wishlist button" class=" s-button-wrap hydrated">
        <svg xmlns="http://www.w3.org/2000/svg" width="47" height="48" viewBox="0 0 47 48" fill="none">
        <path d="M23.1506 42.4608L20.3714 39.8758C10.5006 30.7304 3.98389 24.6987 3.98389 17.2962C3.98389 11.2646 8.62222 6.52539 14.5256 6.52539C17.8606 6.52539 21.0614 8.11164 23.1506 10.6183C25.2397 8.11164 28.4406 6.52539 31.7756 6.52539C37.6789 6.52539 42.3172 11.2646 42.3172 17.2962C42.3172 24.6987 35.8006 30.7304 25.9297 39.8954L23.1506 42.4608Z" fill="#212121"/>
        </svg>
      </salla-button>
    </div>
      <div class="quickview-btn eye-icon flex justify-center items-center" onclick="app.clickModal(${
        this.product.id
      })"  data-product-id="${this.product.id}">
                    <salla-button  fill="outline"  class="s-button-wrap hydrated " shape="btn" color="primary" size="medium" width="normal">

                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                    <path d="M21.6507 8.90039C12.6924 8.90039 5.04197 14.6021 1.94238 22.6504C5.04197 30.6987 12.6924 36.4004 21.6507 36.4004C30.6091 36.4004 38.2595 30.6987 41.3591 22.6504C38.2595 14.6021 30.6091 8.90039 21.6507 8.90039ZM21.6507 31.8171C16.7057 31.8171 12.6924 27.7104 12.6924 22.6504C12.6924 17.5904 16.7057 13.4837 21.6507 13.4837C26.5957 13.4837 30.6091 17.5904 30.6091 22.6504C30.6091 27.7104 26.5957 31.8171 21.6507 31.8171ZM21.6507 17.1504C18.6765 17.1504 16.2757 19.6071 16.2757 22.6504C16.2757 25.6937 18.6765 28.1504 21.6507 28.1504C24.6249 28.1504 27.0257 25.6937 27.0257 22.6504C27.0257 19.6071 24.6249 17.1504 21.6507 17.1504Z" fill="#212121"/>
                    </svg>

                    </salla-button>
                </div>
      </div>
  <div class=" flex justify-center w-full items-center">
      <a class=" w-full rounded-none" href="${this.product?.url}">
        <img class="s-product-card-image rounded-none w-full h-full lazy "
          src=${this.placeholder}
          alt=${this.product?.image?.alt}
          data-src=${this.product?.image?.url || this.product?.thumbnail}
          
        />
        ${!this.fullImage && !this.minimal ? this.getProductBadge() : ""}
      </a>
      ${
        this.fullImage
          ? `<a href="${this.product?.url}" class="s-product-card-overlay"></a>`
          : ""
      }
      
    </div>
    <div>
  </div>
  ${
    !this.hideAddBtn
      ? `<div class="s-product-card-content-footer w-[90%] gap-2">
        <salla-add-product-button fill="outline" 
            class=" w-full"
          product-id="${this.product.id}"
          product-status="${this.product.status}"
          product-type="${this.product.type}">
         
          ${
            this.product.add_to_cart_label
              ? this.product.add_to_cart_label
              : this.getAddButtonLabel()
          }
        </salla-add-product-button>

        ${
          this.horizontal || this.fullImage
            ? `<salla-button 
            shape="icon" 
            fill="outline" 
            color="light" 
            id="card-wishlist-btn-${this.product.id}-horizontal"
            aria-label="Add or remove to wishlist"
            class="s-product-card-wishlist-btn animated"
            onclick="salla.wishlist.toggle(${this.product.id})"
            data-id="${this.product.id}">
            <i class="sicon-heart"></i> 
          </salla-button>`
            : ``
        }
      </div>`
      : ``
  }

      
        <div class="s-product-card-content-sub ${
          this.isSpecial ? "s-product-card-content-extra-padding" : ""
        } flex flex-col justify-center items-center gap-1 px-[0.75em]" style="justify-content : center !important ; margin:0px !important">
        <div >

        ${ (this.product.rating) ? (this.product.rating.count > 0) ?
		`<salla-rating-stars size="large" value="${ this.product.rating.stars }"
		reviews="${ this.product.rating.count }"></salla-rating-stars>` : ``  : '' }
        </div>
        
        <div class="s-product-card-content-main ${
          this.isSpecial ? "s-product-card-content-extra-padding" : ""
        }">
            <h3 class=" text-lg ">
              <a href="${this.product?.url}" class="shamelBook">${(this.product?.name.length > namelength) ? this.product?.name.substring(0, namelength) + "..." : this.product?.name}</a>
            </h3>
  
            ${
              this.product?.subtitle && !this.minimal
                ? `<p class="s-product-card-content-subtitle">${this.product?.subtitle}</p>`
                : ``
            }
          </div>
       
       
           
        ${this.getProductPrice()}
          
        </div>
  </div>
      `
    }
      
      `;
    this.querySelectorAll('[name="donating_amount"]').forEach((element) => {
      element.addEventListener("input", (e) => {
        e.target
          .closest(".s-product-card-content")
          .querySelector("salla-add-product-button")
          .setAttribute("donating-amount", e.target.value);
      });
    });

    // re-init favorite icon
    if (!salla.config.isGuest()) {
      salla.storage
        .get("salla::wishlist", [])
        .forEach((id) => this.toggleFavoriteIcon(id));
    }

    document.lazyLoadInstance?.update(this.querySelectorAll(".lazy"));

    if (this.product?.quantity && this.isSpecial) {
      this.initCircleBar();
    }
  }
}

customElements.define("custom-salla-product-card", ProductCard);
