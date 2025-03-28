class BundleBuilder {
    constructor() {
      this.init();
      this.bundleSize = 2;
      this.selectedProducts = [];
      this.originalPrice = 169.00; // Set your original price here
      this.discountPercentage = 20; // Set your discount percentage here
      this.bindEvents();
    }
  
    init() {
      this.container = document.querySelector('.bundle-builder-section');
      this.productsContainer = this.container.querySelector('.bundle-products');
      this.bundleSlots = this.container.querySelector('.bundle-slots');
      this.bundleOptions = this.container.querySelectorAll('.bundle-option');
      this.addMoreBtn = this.container.querySelector('.add-more-btn');
      this.addToCartBtn = this.container.querySelector('.add-to-cart-btn');
      this.currentPriceElement = this.container.querySelector('.price-current');
      this.originalPriceElement = this.container.querySelector('.price-original');
      this.prevButton = this.container.querySelector('.prev-button');
      this.nextButton = this.container.querySelector('.next-button');
      this.selectedProductsContainer = this.container.querySelector('.selected-products');
      this.totalPriceElement = this.container.querySelector('.total-price');
    }
  
    bindEvents() {
      // Slider navigation
      this.prevButton.addEventListener('click', () => this.slide('prev'));
      this.nextButton.addEventListener('click', () => this.slide('next'));
  
      // Bundle size selection
      this.bundleOptions.forEach(option => {
        option.addEventListener('click', () => this.changeBundleSize(option));
      });
  
      // Add to bundle buttons
      const addButtons = this.container.querySelectorAll('.add-to-bundle-btn');
      addButtons.forEach(button => {
        button.addEventListener('click', (e) => this.addToBundle(e.target));
      });
  
      // Add more button
      this.addMoreBtn.addEventListener('click', () => this.incrementBundleSize());
  
      // Add to cart button
      this.addToCartBtn.addEventListener('click', () => this.addBundleToCart());
    }
  
    slide(direction) {
      const scrollAmount = 240; // Width of product card + gap
      if (direction === 'prev') {
        this.productsContainer.scrollLeft -= scrollAmount;
      } else {
        this.productsContainer.scrollLeft += scrollAmount;
      }
    }
  
    changeBundleSize(option) {
      // Remove active class from all options
      this.bundleOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      option.classList.add('active');
      
      // Update bundle size
      this.bundleSize = parseInt(option.querySelector('.option-quantity').textContent);
      
      // Update UI
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
      this.updateBundleUI();
    }
  
    incrementBundleSize() {
      // Find next bundle option
      let currentSize = this.bundleSize;
      let nextOption = Array.from(this.bundleOptions).find(option => {
        let size = parseInt(option.querySelector('.option-quantity').textContent);
        return size > currentSize;
      });
  
      if (nextOption) {
        this.changeBundleSize(nextOption);
      }
    }
  
    updateBundleUI() {
      // Update slots
      this.bundleSlots.innerHTML = '';
      for (let i = 0; i < this.bundleSize; i++) {
        const slot = document.createElement('div');
        slot.className = 'bundle-slot';
        
        if (this.selectedProducts[i]) {
          slot.classList.add('filled');
          const img = document.createElement('img');
          img.src = this.selectedProducts[i].image;
          img.alt = this.selectedProducts[i].title;
          slot.appendChild(img);
  
          // Add remove button
          const removeBtn = document.createElement('div');
          removeBtn.className = 'slot-remove';
          removeBtn.textContent = '✕';
          removeBtn.addEventListener('click', () => this.removeFromBundle(i));
          slot.appendChild(removeBtn);
        } else {
          slot.classList.add('empty');
        }
        
        this.bundleSlots.appendChild(slot);
      }
  
      // Update prices
      const originalTotal = this.bundleSize * this.originalPrice;
      const discountedTotal = originalTotal * (1 - this.discountPercentage / 100);
      
      this.currentPriceElement.textContent = `£${discountedTotal.toFixed(2)}`;
      this.originalPriceElement.textContent = `£${originalTotal.toFixed(2)}`;
  
      // Update add to cart button
      this.addToCartBtn.disabled = this.selectedProducts.length < this.bundleSize;
  
      // Update all ADD buttons in the slider
      const addButtons = this.container.querySelectorAll('.add-to-bundle-btn');
      addButtons.forEach(button => {
        button.disabled = this.selectedProducts.length >= this.bundleSize;
      });
  
      // Update selected products display
      this.selectedProductsContainer.innerHTML = '';
      this.selectedProducts.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'selected-product';
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <div class="selected-product-info">
            <div class="selected-product-title">${product.title}</div>
            <div class="selected-product-price">£${product.price.toFixed(2)}</div>
          </div>
          <button type="button" class="selected-product-remove" aria-label="Remove ${product.title}">✕</button>
        `;
  
        // Add remove button functionality
        productElement.querySelector('.selected-product-remove').addEventListener('click', () => {
          this.removeFromBundle(index);
        });
  
        this.selectedProductsContainer.appendChild(productElement);
      });
  
      // Update total price
      const total = this.selectedProducts.reduce((sum, product) => sum + product.price, 0);
      this.totalPriceElement.textContent = `£${total.toFixed(2)}`;
  
      // Update add more button text
      const remaining = this.bundleSize - this.selectedProducts.length;
      this.addMoreBtn.textContent = `ADD ${remaining} MORE`;
      this.addMoreBtn.disabled = remaining === 0;
    }
  
    removeFromBundle(index) {
      this.selectedProducts.splice(index, 1);
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
  
        // Create items array for checkout URL
        const items = this.selectedProducts.map(product => ({
          id: parseInt(product.variantId),
          quantity: 1,
          properties: {
            '_bundle_group': 'Bundle ' + new Date().getTime(),
            '_bundle_size': this.bundleSize
          }
        }));
  
        // Create checkout URL with items
        const checkoutItems = items.map(item => {
          const properties = Object.entries(item.properties).map(([key, value]) => 
            `${encodeURIComponent(`properties[${key}]`)}=${encodeURIComponent(value)}`
          ).join('&');
          return `items[${encodeURIComponent(item.id)}][quantity]=${item.quantity}&${properties}`;
        }).join('&');
  
        // Redirect to checkout
        window.location.href = `${window.Shopify.routes.root}checkout?${checkoutItems}`;
  
      } catch (error) {
        console.error('Error adding bundle to cart:', error);
        alert(error.message || 'There was an error adding your bundle to cart. Please try again.');
        this.addToCartBtn.disabled = false;
        this.addToCartBtn.textContent = 'Add Bundle to Cart';
      }
    }
  }
  
  // Initialize the bundle builder when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new BundleBuilder();
  });
  