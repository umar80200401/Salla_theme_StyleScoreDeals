import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';

import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
  
    this.modalProduct();
    this.cartSummary();
    this.handleDropdown();
    this.changeMenuDirection()
    this.map();
    this.initFeaturedTabs();
    this.timeStamp();
    this.commonThings();
    this.initiateNotifier();
    this.removeElan();
    this.initiateMobileMenu();
    this.elanSlider();
    if(header_is_sticky){
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateAdAlert();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    initTootTip();
    this.loadModalImgOnclick();

    this.toggleMenuItem();
    //this.toggleSearchDropdown();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  toggleSearchDropdown()
  {
    var searchBox = document.querySelector('#mainnav .s-search-input');
    var searchClose = document.querySelector('#mainnav #search-close');
    var searchResults = document.querySelector('#mainnav .s-search-results');
    var resultsPlaceholder = document.querySelector('#mainnav .s-search-no-results-placeholder');

    searchBox.addEventListener("focus", function()
    {
      searchResults.style.display = "block";

      if(searchBox.value == "" || searchBox.value == null  || searchBox.value == " ")
      {
        searchClose.style.display = "none";
      }
    });

    searchClose.addEventListener("click", function()
    {
      if(searchBox.value == "" || searchBox.value == null  || searchBox.value == " ")
      {
        searchClose.style.display = "none";
      }
      else
      {
        if(searchResults.style.display == "none" || window.getComputedStyle(searchResults).display == "none")
        {
          searchResults.style.display = "block";
        }
        else
        {
          searchResults.style.display = "none";
          searchClose.style.display = "none";
        }

        if(resultsPlaceholder.style.display == "none" || window.getComputedStyle(resultsPlaceholder).display == "none")
        {
          resultsPlaceholder.style.display = "block";
          searchClose.style.display = "none";
        }
      }

    });

    var observerNoResults = new MutationObserver(function()
    {
      if(resultsPlaceholder.style.display == "block" || window.getComputedStyle(resultsPlaceholder).display == "block")
      {
        searchClose.style.display = "block";
      }
      else
      {
        searchClose.style.display = "none";
      }
    });

    observerNoResults.observe(resultsPlaceholder, {attributes: true, childList: true});

    var observerResults = new MutationObserver(function()
    {
      if(searchResults.style.display == "block" || window.getComputedStyle(searchResults).display == "block")
      {
        searchClose.style.display = "block";
      }
      else
      {
        searchClose.style.display = "none";
      }
    });

    observerResults.observe(searchResults, {attributes: true, childList: true});
  }

  toggleMenuItem()
  {
    var menuItem = document.querySelectorAll(".main-menu li");

    menuItem.forEach(function(item)
    {
      item.addEventListener("click", function()
      {
        var submenus = document.querySelectorAll(".main-menu ul");

        if(this.getElementsByTagName("ul")[0].style.display == "none")
        {
          this.getElementsByTagName("ul")[0].style.display = "block";
        }
        else
        {
          this.getElementsByTagName("ul")[0].style.display = "none";
        }
      });
    })
  }


  changeMenuDirection(){
    app.all('.root-level.has-children',item=>{
      if(item.classList.contains('change-menu-dir')) return;
      app.on('mouseover',item,()=>{
        let submenu = item.querySelector('.sub-menu .sub-menu'),
            rect = submenu.getBoundingClientRect();
          (rect.left < 10 || rect.right > window.innerWidth - 10) && app.addClass(item,'change-menu-dir')
      })
    })
  }

  modalProduct(){
    const modal = document.getElementById("productModal")
   
    function getPriceFormat(price) {
        if (!price || price == 0) {
          return salla.config.get("store.settings.product.show_price_as_dash")
            ? "-"
            : "";
        }
    
        return salla.money(price);
      }
    
    this.clickModal = (event)=> {
    
    const modalContent = document.getElementById("modalProduct")
    salla.product.getDetails(event, [
            "images",
            "sold_quantity",
            "category",
          ]).then((response) => {
  
    const product = response.data
    
  
    
    modalContent.innerHTML = `
    <div class="flex flex-col items-start justify-start w-full h-full space-y-1 lg:space-y-5">
      <button type="button" onclick="app.closeModal()" class="flex items-center justify-center w-12 md:w-16 h-12 md:h-[10%] mb-1 lg:mb-8 text-xl bg-white md:bg-transparent rounded-full md:rounded-none font-black fixed z-[9999] md:static md:z-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 121 122" fill="none">
    <path d="M95.7904 32.5835L88.6816 25.416L60.4987 53.8319L32.3158 25.416L25.207 32.5835L53.3899 60.9994L25.207 89.4152L32.3158 96.5827L60.4987 68.1669L88.6816 96.5827L95.7904 89.4152L67.6074 60.9994L95.7904 32.5835Z" fill="#212121"/>
    </svg>
      </button>
      <div class="grid w-full grid-cols-1 lg:grid-cols-2 gap-5 px-2 py-0.5 lg:px-5 lg:py-2 h-[90%]">
        <div class="flex flex-col items-start justify-start w-full h-full">
          <div class="relative w-full  md:h-[500px] flex flex-col space-y-2 lg:space-y-4 items-center justify-start px-3 py-2 lg:px-7 lg:py-5">
            <div id="img-2" class="absolute "></div>
            
            <salla-slider id="thumbs" show-controls="false" type="thumbs" show-thumbs-controls="false">
            <div slot="items">	
              ${product?.images?.map(img => {
                return `
              
                    <img  class="object-contain" style="height:15rem" src="${img?.url}"/>
                
                
                `
              })}
    
              </div>
            
              <div slot="thumbs">
               ${product?.images?.map(img => {
                return `
                 <img  class="object-contain w-72 h-96" src="${img?.url}"/>
                 `
              })}
              </div>
            </salla-slider>
          </div>
        </div>
        <div class="flex flex-col items-start justify-start scroll-modal-tamara lg:overflow-y-auto overflow-y-visible  w-full h-full space-y-2 lg:space-y-5 mb-6 lg:mb-0 pb-8">
          <div class="flex items-center justify-between w-full">
          ${
            product.is_taxable ?
            salla.config.get("user.language_code")    === "ar" ? "السعر شامل الضريبة" : "Price includes tax"
            :
            salla.config.get("user.language_code") === "ar" ? "السعر غير شامل الضريبة" : "Price not includes tax"
            
          }
            <div class="flex items-center justify-end space-x-2">

              <salla-button class="btn--wishlist s-button-wrap hydrated" id="popup-wishlist-btn-${product.id}" data-id="${product.id}" onclick="salla.wishlist.toggle(${product.id})" shape="icon" fill="outline" loader-position="center" color="light" size="medium" width="normal">
                <svg xmlns="http://www.w3.org/2000/svg" width="131" height="135" viewBox="0 0 131 135" fill="none">
      <path d="M65.5013 120.094L57.5867 112.669C29.4763 86.4 10.918 69.075 10.918 47.8125C10.918 30.4875 24.1271 16.875 40.9388 16.875C50.4363 16.875 59.5517 21.4313 65.5013 28.6313C71.4509 21.4313 80.5663 16.875 90.0638 16.875C106.875 16.875 120.085 30.4875 120.085 47.8125C120.085 69.075 101.526 86.4 73.4159 112.725L65.5013 120.094Z" fill="#212121"/>
    </svg>
              </salla-button>
              <salla-social-share url="${product.url}" url-name="${product.name}" platforms="facebook,twitter,whatsapp,email,copy_link"></salla-social-share>
            </div>
          </div>
          <div class="flex items-center justify-start w-full space-x-2 lg:space-x-4">
            
          </div>
          <p class="color-grey text-lg mb-2">${product.name}</p>

          <p class="w-full overflow-auto text-ellipsis text-[#00000096] text-base lg:text-xl text-right">
            ${product.description}
          
          </p>
          <div class="flex items-center justify-start w-full gap-1 -mr-1">
          <img width="30" height="30" src="https://img.icons8.com/emoji/48/fire.png" alt="fire"/>
            <p class="text-base font-bold">${getPriceFormat(product.price)}</p>
          </div>
          <div class="flex items-center justify-start w-full gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="30" viewBox="0 0 89 70" fill="none">
            <g clip-path="url(#clip0_1072_446)">
              <path d="M53.3991 72.3887C62.8984 72.3887 72.0086 68.6584 78.7256 62.0184C85.4426 55.3785 89.2162 46.3727 89.2162 36.9824C89.2162 27.5921 85.4426 18.5864 78.7256 11.9464C72.0086 5.30646 62.8984 1.57617 53.3991 1.57617C43.8998 1.57617 34.7896 5.30646 28.0726 11.9464C21.3556 18.5864 17.582 27.5921 17.582 36.9824C17.582 46.3727 21.3556 55.3785 28.0726 62.0184C34.7896 68.6584 43.8998 72.3887 53.3991 72.3887ZM68.4709 30.6376L52.3532 46.5704C52.0205 46.9002 51.6253 47.1618 51.1902 47.3403C50.755 47.5187 50.2885 47.6106 49.8174 47.6106C49.3463 47.6106 48.8798 47.5187 48.4446 47.3403C48.0095 47.1618 47.6143 46.9002 47.2815 46.5704L40.1181 39.4892C39.4456 38.8244 39.0678 37.9226 39.0678 36.9824C39.0678 36.0422 39.4456 35.1405 40.1181 34.4757C40.7907 33.8108 41.7029 33.4373 42.654 33.4373C43.6051 33.4373 44.5173 33.8108 45.1898 34.4757L49.8174 39.0572L63.3992 25.6241C63.7322 25.2949 64.1276 25.0338 64.5627 24.8556C64.9978 24.6775 65.4641 24.5858 65.9351 24.5858C66.406 24.5858 66.8724 24.6775 67.3075 24.8556C67.7426 25.0338 68.1379 25.2949 68.4709 25.6241C68.8039 25.9533 69.0681 26.3441 69.2483 26.7742C69.4286 27.2043 69.5213 27.6653 69.5213 28.1309C69.5213 28.5964 69.4286 29.0574 69.2483 29.4875C69.0681 29.9176 68.8039 30.3084 68.4709 30.6376Z" fill="#0FA958"/>
            </g>
              <defs>
              <clipPath id="clip0_1072_446">
              <rect width="89" height="103" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            ${
              salla.config.get("user.language_code")    === "ar" ? `<p class="text-base">${product.status === "sale" ? "متوفر" : "غير متوفر"}</p>` : `<p class="text-base">${product.status === "sale" ? "available" : "un available "}</p>`
            }
            
            
          </div>
          <div class="flex items-center justify-start w-full gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 57 73" fill="none">
              <path d="M4.05556 64.8889C4.05556 69.35 7.70556 73 12.1667 73H44.6111C49.0722 73 52.7222 69.35 52.7222 64.8889V16.2222H4.05556V64.8889ZM12.1667 24.3333H44.6111V64.8889H12.1667V24.3333ZM42.5833 4.05556L38.5278 0H18.25L14.1944 4.05556H0V12.1667H56.7778V4.05556H42.5833Z" fill="#334155"/>
            </svg>
            ${
              salla.config.get("user.language_code")    === "ar" ?`<p class="text-base">${product.quantity ? product.quantity :"0" } المتبقى</p>` : `<p class="text-base">${product.quantity ? product.quantity :"0" } remain</p>`
            }
            
          </div>
          ${
          product.sold_quantity ? `<div class="px-1 text-red-400">
    <i class="sicon-fire rtl:ml-1.5 ltr:mr-1.5"></i>${salla.config.get("user.language_code")    === "ar" ?  "تم شراءه" :"Purchased"} 
    <span><span>${product.sold_quantity}</span> </span>
    </div>`:""
                  }
          <div class="flex items-center justify-between w-full space-x-2">
            <p class=" text-2xl">${salla.config.get("user.language_code")    === "ar" ? "الكمية" : "Quantity"}</p>
            <salla-quantity-input max="28" value="1" name="quantity" class="flex justify-end border-gray-200 s-quantity-input hydrated"></salla-quantity-input>
          </div>
          
          
          <div class="w-full rounded-md flex items-center justify-center py-2">
            
            <salla-add-product-button width="wide" product-id="${product.id}">
            
     </salla-add-product-button>
          </div>
        </div>
      </div>
    
        <div id="bigger-view-image" class="hidden fixed z-[2000] w-96 h-96 inset-0">
            <img class="object-cover w-full h-full" />
        </div>
    </div>
    
    `
    });
    modal.classList.replace('hidden', 'flex');
    
    }
    
    this.closeModal = ()=> {
    modal.classList.replace('flex', 'hidden');
    
    }
    
    document.addEventListener("click", (e) => {
      if (e.target.getAttribute("id", "productModal")) {
        this.closeModal();
      }
    })
    
  }

  cartSummary() {
    const cartBtn = document.querySelector('#cart-button');
    const cartBtnSecond = document.querySelector("#cart-button-second")
    const cartPanel = app.element('#cart-summary-panel')
    const continueShopping = document.querySelector("#continue_shopping")
    if(cartBtn){

      cartBtn.addEventListener('click', async event => {
        event.stopPropagation();
        
         const itemsWrap = cartPanel.querySelector('#cart-summary__items'),
          total = cartPanel.querySelector('[data-cart-total]'),
          subTotal = cartPanel.querySelector('#sub-total'),
          count = cartPanel.querySelector('cart-products-count'),
          placeholder = salla.url.asset(salla.config.get('theme.settings.placeholder'));
  
        cartPanel.classList.add('is-opened');
        cartPanel.style.left= 0 
        cartPanel.classList.add('is-loading');
  
        await salla.api.cart.details().then((res) => {
          
          let cart = res.data.cart;
   
          if (cart.items.length) {
            cartPanel.classList.remove('cart-is-empty');
            if(count){
  
              count.innerHTML = '(' + cart.count + ' )';
            }
            if(itemsWrap){
  
              itemsWrap.innerHTML = cart.items.map(item => {
                let item_url = item.product_url || salla.url.get('*/p' + item.product_id);
                return `
                <form onchange="salla.form.onChange('cart.updateItem', event)" id="item-${item.id}">
                  <section class="cart-item bg-white p-2.5 md:p-5 rounded mb-2.5 md:mb-5 relative border border-gray-100">
                      <input type="hidden" name="id" value="${item.id}">
                      
                      <div class="md:flex rtl:space-x-reverse md:space-x-12 items-start justify-between">
                          <div class="flex flex-1 rtl:space-x-reverse space-x-4">
                              <a href="${item_url}" class="shrink-0">
                                <img src="${item.product_image}" alt="${item.product_name}" class="flex-none w-24 h-full rounded object-center object-cover">
                              </a>
                              <div class="space-y-1">
                                  <h2 class="text-gray-900 leading-6 text-lg w-[90%]">
                                      <a href="${item_url}" class="text-base">${item.product_name}</a>
                                  </h2>
    
                                  <div class="flex items-center gap-1.5">
                                    <span class="text-sm text-gray-500 line-through item-regular-price ${item.offer?'':'hidden'}">${ salla.money(item.product_price)}</span>
                                    <span class="item-price">${salla.money(item.price)}</span>
                                  </div>
    
                                  ${item.offer ? `
                                    <div class="flex items-center gap-1.5">
                                      <i class="sicon-discount-calculator text-gray-500 offer-icon"></i>
                                      <span class="text-sm text-gray-500 offer-name">${item.offer.names}</span>
                                    </div>
                                  ` : ``}
    
                                  <p class="text-primary flex-none font-bold text-sm rtl:md:pl-12 ltr:md:pr-12">
                                      <span>${salla.lang.get('pages.cart.total')}:</span>
                                      <span class="inline-block item-total">${ item.is_available ? salla.money(item.total) : salla.lang.get('pages.cart.out_of_stock')}</span>
                                  </p>
                              </div>
                          </div>
    
                          <div class="flex-1 border-t border-gray-100 pt-3 md:border-none mt-5 md:mt-0 flex justify-between items-center md:items-start">
                              
                            <salla-quantity-input cart-item-id="${item.id}" max="{{ product.max_quantity }}"
                                class="transtion transition-color duration-300" aria-label="Quantity"
                                value="${item.quantity}" name="quantity">
                            </salla-quantity-input>
                              
                          </div>
                      </div>
    
                      <span class="absolute top-1.5 rtl:left-1.5 ltr:right-1.5 rtl:xs:left-5 ltr:xs:right-5 xs:top-5">
                          <salla-button type="button" shape="icon" size="medium" color="danger" class="btn--delete" aria-label="Remove from the cart" onclick="salla.cart.deleteItem(${item.id}).then(() => document.querySelector('#item-${item.id}').remove())">
                          <div class=" w-6 h-6 rounded-full bg-[#334155] p-2 flex justify-center items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 63 72" fill="none">
  <path d="M70.7904 7.58352L63.6816 0.416016L35.4987 28.8319L7.31578 0.416016L0.207031 7.58352L28.3899 35.9994L0.207031 64.4152L7.31578 71.5827L35.4987 43.1669L63.6816 71.5827L70.7904 64.4152L42.6074 35.9994L70.7904 7.58352Z" fill="#fff"/>
  </svg>
                          </div>
                          </salla-button>
                      </span>
                  </section>
                </form>
                `
              }).join('');
            }
            if(total){
  
              total.innerHTML = salla.money(cart.total);
            }
  
            if (cart.sub_total && subTotal) {
              subTotal.classList.remove('hidden');
              subTotal.innerHTML = salla.money(cart.sub_total);
            } else
            if(subTotal){
  
              subTotal.classList.add('hidden');
            }
  
          } else {
            if(cartPanel){
  
              cartPanel.classList.add('cart-is-empty');
            }
            if(itemsWrap){
  
              itemsWrap.innerHTML = `
                <div class="no-content-placeholder">
                    <i class="sicon-shopping-bag icon"></i>
                    <p>${salla.lang.get('pages.cart.empty_cart')}</p>
                </div>
              `
            }
          }
        }).finally(() => {
          if(cartPanel){
  
            cartPanel.classList.remove('is-loading');
          }
        })
      })
    }

    if(cartBtnSecond){

      cartBtnSecond.addEventListener('click', async event => {
        event.stopPropagation();
        
         const itemsWrap = cartPanel.querySelector('#cart-summary__items'),
          total = cartPanel.querySelector('[data-cart-total]'),
          subTotal = cartPanel.querySelector('#sub-total'),
          count = cartPanel.querySelector('cart-products-count'),
          placeholder = salla.url.asset(salla.config.get('theme.settings.placeholder'));
  
        cartPanel.classList.add('is-opened');
        cartPanel.style.left= 0 
        cartPanel.classList.add('is-loading');
  
        await salla.api.cart.details().then((res) => {
          
          let cart = res.data.cart;
     
          if (cart.items.length) {
            cartPanel.classList.remove('cart-is-empty');
            if(count){
  
              count.innerHTML = '(' + cart.count + ' )';
            }
            if(itemsWrap){
  
              itemsWrap.innerHTML = cart.items.map(item => {
                let item_url = item.product_url || salla.url.get('*/p' + item.product_id);
                return `
                <form onchange="salla.form.onChange('cart.updateItem', event)" id="item-${item.id}">
                  <section class="cart-item bg-white p-2.5 md:p-5 rounded mb-2.5 md:mb-5 relative border border-gray-100">
                      <input type="hidden" name="id" value="${item.id}">
                      
                      <div class="md:flex rtl:space-x-reverse md:space-x-12 items-start justify-between">
                          <div class="flex flex-1 rtl:space-x-reverse space-x-4">
                              <a href="${item_url}" class="shrink-0">
                                <img src="${item.product_image}" alt="${item.product_name}" class="flex-none w-24 h-full rounded object-center object-cover">
                              </a>
                              <div class="space-y-1">
                                  <h2 class="text-gray-900 leading-6 text-lg w-[90%]">
                                      <a href="${item_url}" class="text-base">${item.product_name}</a>
                                  </h2>
    
                                  <div class="flex items-center gap-1.5">
                                    <span class="text-sm text-gray-500 line-through item-regular-price ${item.offer?'':'hidden'}">${ salla.money(item.product_price)}</span>
                                    <span class="item-price">${salla.money(item.price)}</span>
                                  </div>
    
                                  ${item.offer ? `
                                    <div class="flex items-center gap-1.5">
                                      <i class="sicon-discount-calculator text-gray-500 offer-icon"></i>
                                      <span class="text-sm text-gray-500 offer-name">${item.offer.names}</span>
                                    </div>
                                  ` : ``}
    
                                  <p class="text-primary flex-none font-bold text-sm rtl:md:pl-12 ltr:md:pr-12">
                                      <span>${salla.lang.get('pages.cart.total')}:</span>
                                      <span class="inline-block item-total">${ item.is_available ? salla.money(item.total) : salla.lang.get('pages.cart.out_of_stock')}</span>
                                  </p>
                              </div>
                          </div>
    
                          <div class="flex-1 border-t border-gray-100 pt-3 md:border-none mt-5 md:mt-0 flex justify-between items-center md:items-start">
                              
                            <salla-quantity-input cart-item-id="${item.id}" max="{{ product.max_quantity }}"
                                class="transtion transition-color duration-300" aria-label="Quantity"
                                value="${item.quantity}" name="quantity">
                            </salla-quantity-input>
                              
                          </div>
                      </div>
    
                      <span class="absolute top-1.5 rtl:left-1.5 ltr:right-1.5 rtl:xs:left-5 ltr:xs:right-5 xs:top-5">
                          <salla-button type="button" shape="icon" size="medium" color="danger" class="btn--delete" aria-label="Remove from the cart" onclick="salla.cart.deleteItem(${item.id}).then(() => document.querySelector('#item-${item.id}').remove())">
                          <div class=" w-6 h-6 rounded-full bg-[#334155] p-2 flex justify-center items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 63 72" fill="none">
  <path d="M70.7904 7.58352L63.6816 0.416016L35.4987 28.8319L7.31578 0.416016L0.207031 7.58352L28.3899 35.9994L0.207031 64.4152L7.31578 71.5827L35.4987 43.1669L63.6816 71.5827L70.7904 64.4152L42.6074 35.9994L70.7904 7.58352Z" fill="#fff"/>
  </svg>
                          </div>
                          </salla-button>
                      </span>
                  </section>
                </form>
                `
              }).join('');
            }
            if(total){
  
              total.innerHTML = salla.money(cart.total);
            }
  
            if (cart.sub_total && subTotal) {
              subTotal.classList.remove('hidden');
              subTotal.innerHTML = salla.money(cart.sub_total);
            } else
            if(subTotal){
  
              subTotal.classList.add('hidden');
            }
  
          } else {
            if(cartPanel){
  
              cartPanel.classList.add('cart-is-empty');
            }
            if(itemsWrap){
  
              itemsWrap.innerHTML = `
                <div class="no-content-placeholder">
                    <i class="sicon-shopping-bag icon"></i>
                    <p>${salla.lang.get('pages.cart.empty_cart')}</p>
                </div>
              `
            }
          }
        }).finally(() => {
          if(cartPanel){
  
            cartPanel.classList.remove('is-loading');
          }
        })
      })
    }
    
    
    const closeCartPanel = () => {
      cartPanel.style.left = "-800px";
      cartPanel.classList.remove("is-opened");
  };

  continueShopping.addEventListener("click", (e) => {
    if (cartPanel.classList.contains("is-opened")) {
        
            closeCartPanel();
      
    }
});

  document.addEventListener("click", (e) => {
      if (cartPanel.classList.contains("is-opened")) {
          const target = e.target;
          if (!cartPanel.contains(target)) {
              closeCartPanel();
          }
      }
  });
  }

 

  initFeaturedTabs() {
    app.all('.tab-trigger', el => {
        el.addEventListener('click', ({ currentTarget: btn }) => {
            let id = btn.dataset.componentId;
            // btn.setAttribute('fill', 'solid');
            app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id == btn.dataset.target)
                .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn == btn);

            // fadeIn active tabe
            setTimeout(() => app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id == btn.dataset.target), 100);
        })
    });
    document.querySelectorAll('.s-block-tabs').forEach(block => block.classList.add('tabs-initialized'));
}


  removeElan() {
    const removeElanBtn = document.getElementById("remove-elan");
    if (removeElanBtn) {
      removeElanBtn.addEventListener("click", () => {
        document.getElementById("elan-bannle").remove();
      });
    }
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  loadModalImgOnclick(){
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event)=> {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
            img = modal.querySelector('img'),
            imgSrc = img.dataset.src;
        modal.open();
        
        if(img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      })
    })
  }

  elanSlider() {
    const btnShow = document.getElementById("btn-open");
    const showSlider = document.getElementById("animated-ads");
    if (btnShow) {
      btnShow.addEventListener("click", () => {
        showSlider.classList.toggle("open");
      });
    }
  }

  commonThings(){
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector){
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ')
      })
    }
  }

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
      btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true)
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      if (typeof message == 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast            : true,
        position         : salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer            : 3500,
        didOpen          : (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon            : type,
        title           : message,
        showCloseButton : true,
        timerProgressBar: true
      })
    });
  }

  initiateMobileMenu() {

    this.isElementLoaded('#mobile-menu').then((menu) => {
  
  
    const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");
  
    salla.lang.onLoaded(() => {
      mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
    });
    const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });
  
    this.onClick("a[href='#mobile-menu']", event => {
      document.body.classList.add('menu-opened');
      event.preventDefault() || drawer.close() || drawer.open()
  
    });
    this.onClick(".close-mobile-menu", event => {
      document.body.classList.remove('menu-opened');
      event.preventDefault() || drawer.close()
    });
    });
  
    }

  isElementLoaded(selector){
    return new Promise((resolve=>{
      const interval=setInterval(()=>{
      if(document.querySelector(selector)){
        clearInterval(interval)
        return resolve(document.querySelector(selector))
      }
    },160)
  }))


    };

  initiateStickyMenu() {
    const showSlider = document.getElementById("animated-ads");

    let header = this.element('#mainnav'),
      height = this.element('#mainnav .inner')?.clientHeight;
    //when it's landing page, there is no header
    if (!header) {
      return;
    }

    

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500))
    window.addEventListener('resize', () => this.setHeaderHeight())

    window.addEventListener('scroll', () => {
      if(showSlider){

        window.scrollY >= (document.body.clientHeight / 2) ? showSlider.classList.add('removerElan') : showSlider.classList.remove('removerElan')
      }
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, {passive: true});
  }

  handleDropdown() {
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownButton) {
      dropdownButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
      });
    }
  }

  setHeaderHeight() {
    let height = this.element('#mainnav .inner').clientHeight,
      header = this.element('#mainnav');
    header.style.height = height + 'px';
  }

  /**
   * Because salla caches the response, it's important to keep the alert disabled if the visitor closed it.
   * by store the status of the ad in local storage `salla.storage.set(...)`
   */
  initiateAdAlert() {
    let ad = this.element(".salla-advertisement");

    if (!ad) {
      return;
    }

    if (!salla.storage.get('statusAd-' + ad.dataset.id)) {
      ad.classList.remove('hidden');
    }

    this.onClick('.ad-close', function (event) {
      event.preventDefault();
      salla.storage.set('statusAd-' + ad.dataset.id, 'dismissed');

      anime({
        targets : '.salla-advertisement',
        opacity : [1, 0],
        duration: 300,
        height  : [ad.clientHeight, 0],
        easing  : 'easeInOutQuad',
      });
    });
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({target: btn}) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');
      // Click Outside || Click on close btn
      window.addEventListener('click', ({target: element}) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }
  map() {
    const insertMap = document.getElementById("map-content");
    const map = document.getElementById("map-new");
    const encodedString = map?.innerText;

    const container = document.createElement("div");
    container.innerHTML = encodedString;

    const iframeElement = container.firstChild.textContent;

    const data = `
${iframeElement}
`;
    if (insertMap) {
      insertMap.innerHTML = data;
    }
  }
  timeStamp() {
    const timeStamps = document.getElementsByClassName("time-stamp");
    const inserts = document.getElementsByClassName("insert-time");
    if(timeStamps){
      for (let i = 0; i < timeStamps.length; i++) {
        const timeStamp = timeStamps[i].innerText;
        const insert = inserts[i];
        insert.innerText = new Date(parseInt(timeStamp)).toLocaleDateString();
      }
    }
  
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        const state = {isOpen: false}

        const onOpen = () => anime({
          targets : content,
          duration: 225,
          height  : content.scrollHeight,
          opacity : [0, 1],
          easing  : 'easeOutQuart',
        });

        const onClose = () => anime({
          targets : content,
          duration: 225,
          height  : 0,
          opacity : [1, 0],
          easing  : 'easeOutQuart',
        })

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen
          this.toggleElementClassIf(content, 'is-closed', 'is-opened', () => isOpen);
        }

        trigger.addEventListener('click', () => {
          const {isOpen} = state
          toggleState(isOpen)
          isOpen ? onClose() : onOpen();
        })
      });
  }


  /**
   * Workaround for seeking to simplify & clean, There are three ways to use this method:
   * 1- direct call: `this.anime('.my-selector')` - will use default values
   * 2- direct call with overriding defaults: `this.anime('.my-selector', {duration:3000})`
   * 3- return object to play it letter: `this.anime('.my-selector', false).duration(3000).play()` - will not play animation unless calling play method.
   * @param {string|HTMLElement} selector
   * @param {object|undefined|null|null} options - in case there is need to set attributes one by one set it `false`;
   * @return {Anime|*}
   */
  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  /**
   * These actions are responsible for pressing "add to cart" button,
   * they can be from any page, especially when mega-menu is enabled
   */
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerText = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App).loadTheApp());
