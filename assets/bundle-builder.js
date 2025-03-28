document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper
  const swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });

  class BundleBuilder {
    constructor() {
      this.init();
      this.bundleSize = 2;
      this.selectedProducts = [];
      this.bindEvents();
    }

    init() {
      this.container = document.querySelector('.bundle-builder-section');
      if (!this.container) return;
      
      this.bundleSlots = this.container.querySelector('.bundle-slots');
      this.bundleOptions = this.container.querySelectorAll('.bundle-option');
      this.addMoreBtn = this.container.querySelector('.add-more-btn');
      this.addToCartBtn = this.container.querySelector('.add-to-cart-btn');
      this.currentPriceElement = this.container.querySelector('.price-current');
      this.originalPriceElement = this.container.querySelector('.price-original');
      this.bundleSizeText = this.container.querySelector('.bundle-size');
      
      this.updateBundleUI();
    }

    bindEvents() {
      if (!this.container) return;

      // Bundle size selection
      this.bundleOptions?.forEach(option => {
        option.addEventListener('click', () => this.changeBundleSize(option));
      });

      // Add to bundle buttons
      const addButtons = this.container.querySelectorAll('.add-to-bundle-btn');
      addButtons.forEach(button => {
        button.addEventListener('click', (e) => this.addToBundle(e.currentTarget));
      });

      // Add more button
      this.addMoreBtn?.addEventListener('click', () => this.incrementBundleSize());

      // Add to cart button
      this.addToCartBtn?.addEventListener('click', () => this.addBundleToCart());
    }

    changeBundleSize(option) {
      this.bundleOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      this.bundleSize = parseInt(option.dataset.size);
      this.updateBundleUI();
    }

    addToBundle(button) {
      if (this.selectedProducts.length >= this.bundleSize) {
        alert('Bundle is full! Please remove items or increase bundle size.');
        return;
      }

      const productData = {
        id: button.dataset.productId,
        variantId: button.dataset.variantId,
        title: button.dataset.productTitle,
        price: parseFloat(button.dataset.productPrice),
        image: button.dataset.productImage
      };

      this.selectedProducts.push(productData);
      button.disabled = true;
      this.updateBundleUI();
    }

    incrementBundleSize() {
      let currentSize = this.bundleSize;
      let nextOption = Array.from(this.bundleOptions).find(option => {
        let size = parseInt(option.dataset.size);
        return size > currentSize;
      });

      if (nextOption) {
        this.changeBundleSize(nextOption);
      }
    }

    updateBundleUI() {
      if (!this.bundleSlots) return;

      // Update slots
      this.bundleSlots.innerHTML = '';
      for (let i = 0; i < this.bundleSize; i++) {
        const slot = document.createElement('div');
        slot.className = 'bundle-slot';
        
        if (this.selectedProducts[i]) {
          slot.classList.add('filled');
          slot.innerHTML = `
            <img src="${this.selectedProducts[i].image}" alt="${this.selectedProducts[i].title}">
            <div class="slot-remove" data-index="${i}">✕</div>
          `;
          
          slot.querySelector('.slot-remove').addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            this.removeFromBundle(index);
          });
        } else {
          slot.classList.add('empty');
        }
        
        this.bundleSlots.appendChild(slot);
      }

      // Update bundle size text
      if (this.bundleSizeText) {
        this.bundleSizeText.textContent = `${this.bundleSize} Case of 12 x 17 oz bot`;
      }

      // Calculate prices
      const totalPrice = this.calculateTotalPrice();
      const discountedPrice = this.calculateDiscountedPrice(totalPrice);

      // Update price displays
      if (this.currentPriceElement) {
        this.currentPriceElement.textContent = `£${discountedPrice.toFixed(2)}`;
      }
      if (this.originalPriceElement) {
        this.originalPriceElement.textContent = `£${totalPrice.toFixed(2)}`;
      }

      // Update add to cart button
      if (this.addToCartBtn) {
        this.addToCartBtn.disabled = this.selectedProducts.length < this.bundleSize;
      }

      // Update add buttons
      const addButtons = this.container.querySelectorAll('.add-to-bundle-btn');
      addButtons.forEach(button => {
        const productId = button.dataset.productId;
        const isSelected = this.selectedProducts.some(p => p.id === productId);
        button.disabled = isSelected || this.selectedProducts.length >= this.bundleSize;
      });

      // Update add more button
      if (this.addMoreBtn) {
        const remaining = this.bundleSize - this.selectedProducts.length;
        this.addMoreBtn.textContent = `ADD ${remaining} MORE`;
        this.addMoreBtn.style.display = remaining > 0 ? 'block' : 'none';
      }
    }

    calculateTotalPrice() {
      return this.selectedProducts.reduce((sum, product) => sum + parseFloat(product.price), 0);
    }

    calculateDiscountedPrice(totalPrice) {
      const discountPercentage = 10; // 10% discount
      return totalPrice * (1 - discountPercentage / 100);
    }

    removeFromBundle(index) {
      const removedProduct = this.selectedProducts[index];
      this.selectedProducts.splice(index, 1);
      
      // Re-enable the add button for the removed product
      const addButton = this.container.querySelector(`[data-product-id="${removedProduct.id}"]`);
      if (addButton) {
        addButton.disabled = false;
      }
      
      this.updateBundleUI();
    }

    async addBundleToCart() {
      if (this.selectedProducts.length !== this.bundleSize) {
        alert('Please complete your bundle before adding to cart.');
        return;
      }

      try {
        this.addToCartBtn.disabled = true;
        this.addToCartBtn.textContent = 'Adding to Cart...';

        const bundleId = new Date().getTime();
        const items = this.selectedProducts.map(product => ({
          id: product.variantId,
          quantity: 1,
          properties: {
            '_bundle_id': bundleId,
            '_bundle_size': this.bundleSize
          }
        }));

        const formData = {
          items: items
        };

        const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Redirect to cart page
        window.location.href = window.Shopify.routes.root + 'cart';

      } catch (error) {
        console.error('Error adding bundle to cart:', error);
        alert('There was an error adding your bundle to cart. Please try again.');
      } finally {
        this.addToCartBtn.disabled = false;
        this.addToCartBtn.textContent = 'ADD TO CART';
      }
    }
  }

  // Initialize the bundle builder
  new BundleBuilder();
});