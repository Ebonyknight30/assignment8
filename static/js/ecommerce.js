/* Hint: No need to make any changes here - but still useful to read for reference! */

const maxPageCount = 19;

let isLoading = false;
let pages = [];
let page = 0;

function fetchPage(pageNumber) {
    isLoading = true; // "Lock" loading (prevents double fetches)
    let productsDiv = document.querySelector('#products_div');
    
    // Create a loading spinner to indicate loading
    let loadSpinner = document.createElement('div');
    loadSpinner.setAttribute('class', 'loader');
    productsDiv.append(loadSpinner);
    
    function runFetch() {
        fetch('./static/data/page' + pageNumber + '.json')
            .then(response => response.json())
            .then(data => {
                // Set the state of the new information
                pages.push(data); // (Note: Currently, the pages variable is not use)

                loadSpinner.remove(); // Remove "loading" spinner                
                renderProducts(data.products); // Render products to div
                
                // "Unlock" loading (prevents double fetches)
                isLoading = false;
            });
    }
    
    setTimeout(runFetch, 2000); // Delay all fetch requests by an extra 2 seconds
}

function doScroll() {
    let bottomOfView = window.scrollY + window.innerHeight;
    let totalHeight = document.body.offsetHeight;
    let extraPixels = 100; // Start fetching 100px before it gets to the end
    if (bottomOfView + extraPixels > totalHeight) {
        // It's within 100 pixels of the end, time to fetch
        if (!isLoading) {
            // Only run if it's not currently loading (e.g. don't "double fetch")
            if (page < maxPageCount) { // More pages!
                page++; // increment to next page
                fetchPage(page); // Fetch the next page!
            }
        }
    }
}

let cartPrice = 0;
function addToCart(price) {
    cartPrice = cartPrice + price; // just add the price for now
    showShopModal('<h1>$' + price + '</h1><p>&#x2713; Added to cart.</p>');
}

function showShopModal(content) {
    let modalDiv = document.querySelector('#modal_div');
    modalDiv.innerHTML = `
      <div class="Modal-bg" onclick="this.parentNode.innerHTML = ''">
      </div>
      <div class="Modal-window">
          <button class="Modal-close" onclick="this.parentNode.parentNode.innerHTML = ''">
              <span role="img" aria-label="close modal">&times;</span>
          </button>
          ${ content }
      </div>
    `;
}

function setupShop() {
    renderNavbar();
    window.addEventListener('scroll', doScroll);
    fetchPage(0); // Start fetching right away
}

setTimeout(setupShop, 100); // Activate after 100 ms
