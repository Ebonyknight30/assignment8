function renderNavbar() {
    let nav = document.querySelector('#navbar');
    let btn;
    
    // Create hamburger menu button
    let hamburger = document.createElement('div');
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('class', 'Navbar-button Hamburger-menu');
    hamburger.setAttribute('tabindex', '0');
    hamburger.innerHTML = 'MENU <span role="img" aria-label="Menu icon">&equiv;</span>';
    hamburger.addEventListener('click', toggleHamburger);
    nav.append(hamburger);
    
    let menuContainer = document.createElement('div');
    menuContainer.setAttribute('id', 'menu-container');
    
    function createNavButton(text, onClickHandler) {
        let button = document.createElement('div');
        button.setAttribute('role', 'button');
        button.setAttribute('class', 'Navbar-button');
        button.setAttribute('tabindex', '0');
        button.innerHTML = text;
        button.addEventListener('click', onClickHandler);
        menuContainer.append(button);
    }

    createNavButton('OUTLET MALL SHOPPING', showWelcome);
    createNavButton('View Return Policy', showReturnInfo);
    createNavButton('View Shopping Cart', showCart);

    nav.append(menuContainer);
}

function toggleHamburger() {
    let menu = document.getElementById('menu-container');
    menu.classList.toggle('active');
}

function renderProduct(product) {
    let div = document.createElement('div');
    div.setAttribute('class', 'Item');
    
    div.innerHTML = `
        <div class="Item-rating" aria-label="Product rating: ${product.rating} stars">
            <span role="img" aria-label="Star icon">&#11088;</span>
            ${product.rating}
        </div>
        <div class="Item-imageWrapper">
          <img src="${product.thumbnail}" alt="${product.title}" />
        </div>
        <div class="Item-details">
          <div class="Item-button" role="button" tabindex="0" onclick="addToCart(${product.price})">
              <span role="img" aria-label="Shopping cart icon">&#128722;</span>
              \$${product.price}
          </div>
          <div class="Item-title">${product.title}</div>
          <p class="Item-description">${product.description}</p>
        </div>
    `;
    return div;
}

function renderProducts(products) {
    let productContainer = document.querySelector('#products_div');
    productContainer.innerHTML = ''; // Clear previous products
    products.forEach(product => {
        productContainer.appendChild(renderProduct(product));
    });
}

document.addEventListener('DOMContentLoaded', function () {
    function updateGrid() {
        let productContainer = document.querySelector('#products_div');
        let width = window.innerWidth;
        
        if (width > 1100) {
            productContainer.style.display = 'grid';
            productContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else if (width > 900) {
            productContainer.style.display = 'grid';
            productContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            productContainer.style.display = 'grid';
            productContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
        }
    }
    window.addEventListener('resize', updateGrid);
    updateGrid();

    // Fetch and render products from internal JSON files (page0 - page19)
    let productPromises = [];
    for (let i = 0; i < 20; i++) {
        productPromises.push(fetch(`static/data/page${i}.json`).then(res => res.json()));
    }

    Promise.all(productPromises)
        .then(pages => {
            let allProducts = pages.flat(); // Combine all product arrays
            renderProducts(allProducts);
        })
        .catch(error => console.error('Error fetching products:', error));
});
