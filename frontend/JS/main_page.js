$('.carousel').carousel({
    interval: 3000  // Інтервал в мілісекундах, наприклад, 2000 мс = 2 сек.
  });
document.addEventListener('DOMContentLoaded', function () {
    const moreButton = document.getElementById('moreDropdown');
  const moreMenu = document.getElementById('more-menu');

  moreButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (moreMenu.style.display === 'block') {
      moreMenu.style.display = 'none';
    } else {
      moreMenu.style.display = 'block';
    }
  });

  document.addEventListener('click', function(event) {
    if (!moreButton.contains(event.target) && !moreMenu.contains(event.target)) {
      moreMenu.style.display = 'none';
    }
  });
    const images = document.querySelectorAll('.img-fluid');
  
    images.forEach(image => {
      image.addEventListener('click', function () {
        openImageModal(this.src);
      });
    });
  
    // Function to open the image modal
    function openImageModal(imageSrc) {
      // Create a modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'image-overlay';
  
      // Create an image element within the modal
      const modalImage = document.createElement('img');
      modalImage.src = imageSrc;
      modalImage.className = 'modal-img';
  
      // Append the image to the overlay
      overlay.appendChild(modalImage);
  
      // Append the overlay to the body
      document.body.appendChild(overlay);
  
      // Attach a click event listener to the overlay to close it
      overlay.addEventListener('click', function () {
        // Remove the overlay when clicked
        overlay.remove();
      });
    }

// SEARCH--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const placeholders = ['Новини', 'Коледж', 'Адреса'];
    let currentIndex = 0;
    const searchField = document.getElementById('searchField');

    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            searchField.setAttribute('placeholder', text.substring(0, i + 1));
            setTimeout(() => {
                typeWriter(text, i + 1, fnCallback);
            }, 100);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    function changePlaceholder() {
        currentIndex = (currentIndex + 1) % placeholders.length;
        const text = placeholders[currentIndex];
        typeWriter(text, 0, () => {
            setTimeout(() => {
                changePlaceholder();
            }, 2000);
        });
    }

    changePlaceholder();

    
    function clearHighlights() {
      const highlightedElements = document.querySelectorAll('.highlight');
      highlightedElements.forEach(element => {
          const parent = element.parentNode;
          parent.replaceChild(document.createTextNode(element.textContent), element);
          parent.normalize();
      });
  }

  function getBackgroundColor(element) {
      while (element) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
              return bgColor;
          }
          element = element.parentElement;
      }
      return 'white'; // default background color
  }

  function getTextColor(backgroundColor) {
      const [r, g, b] = backgroundColor.match(/\d+/g).map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? '#750014' : 'white';
  }

  function highlightText(searchText) {
      clearHighlights();

      if (!searchText) return;

      const regex = new RegExp(searchText, 'gi'); // 'g' for global and 'i' for case insensitive
      const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

      while (textNode = textNodes.nextNode()) {
          const textContent = textNode.nodeValue;
          if (regex.test(textContent)) {
              const parentNode = textNode.parentNode;
              const fragment = document.createDocumentFragment();

              let lastIndex = 0;
              textContent.replace(regex, (match, index) => {
                  fragment.appendChild(document.createTextNode(textContent.slice(lastIndex, index)));
                  const span = document.createElement('span');
                  span.classList.add('highlight');
                  span.textContent = match;

                  const backgroundColor = getBackgroundColor(parentNode);
                  span.style.textDecorationColor = getTextColor(backgroundColor);

                  fragment.appendChild(span);
                  lastIndex = index + match.length;
              });
              fragment.appendChild(document.createTextNode(textContent.slice(lastIndex)));
              parentNode.replaceChild(fragment, textNode);
          }
      }
  }

  document.getElementById("searchField").addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
          const searchText = event.target.value.trim();
          highlightText(searchText);
      }
  });

  //MAIN--------------------------------------------------------------------------------------------------------------------------------------------------------------
  window.addEventListener("scroll", revealOnScroll);

        function revealOnScroll() {
            var reveals = document.querySelectorAll('.hidden');
            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var revealTop = reveals[i].getBoundingClientRect().top;
                var revealPoint = 50;

                if (revealTop < windowHeight - revealPoint) {
                    reveals[i].classList.add('active');
                } else {
                    reveals[i].classList.remove('active'); // Remove the 'active' class if element is not in view
                }
            }
        }

        revealOnScroll();

        


    // ВЗЯТТЯ ВСІЄЇ ІНФОРМАЦІЇ З СЕРВЕРУ --------------------------------------------------------------------------------------------------------------------------------------------------------------
// Maximum number of items to display
const maxItems = 4;

// Глобальна змінна для збереження pageId
let globalPageId = null;

// Function to fetch Page ID from the server
function getPageIdFromServer() {
    let currentUrl = new URL(window.location.href);
    currentUrl.search = '';

    fetch('http://localhost:8080/api/page', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'URL': currentUrl.href
        }
    })
    .then(response => response.json())
    .then(data => {
        const pageId = data.id;
        globalPageId=pageId;
        fetchBlocks(pageId);
    })
    .catch(error => {
        console.error('Помилка при отриманні ідентифікатора сторінки:', error);
    });
}

// Fetch data from the server
fetch('http://localhost:8080/api/tabs', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
     // Extract tabs array from the response
     const tabs = data.tabs;
     
     // Find the parent element of the "+" button
     const addTabButton = document.querySelector('.nav-item:last-child');
     const navbarNav = document.querySelector('#navbar-items');

      // Loop through the fetched tabs and add each to the navbar
     tabs.forEach(tab => {
         const tabId = tab.ID;
         const tabName = tab.Name;
         const tabPages = tab.Pages; // Fetch the pages array from the current tab
     
         // Check if the tab name is not "main_page_admin"
         if (tabName !== "main_page_admin") {
             // Loop through the pages of the current tab
             tabPages.forEach(page => {
                 const pageId = page.ID;
                 const pageName = page.Name;
     
                 const newTab = document.createElement('li');
                 newTab.className = 'nav-item change';
                 newTab.innerHTML = `
                     <a class="nav-link items tabName" style="position: relative; color: white;" href="http://localhost:8080/tmpl?&pageId=${pageId}&tabName=${tabName}" pageId="${pageId}" tabCounter="${tabId}">
                         ${tabName}
                     </a>
                 `;
                 navbarNav.insertBefore(newTab, addTabButton);
             });
         }
     });

    updateNavbar(); // Update the navbar to apply the limit and "More" functionality

    // Add event listeners to tabs
    document.querySelectorAll('.nav-link.items.tabName').forEach(tab => {
        tab.addEventListener('click', (event) => {
           
            const pageId = tab.getAttribute('pageId');
            globalPageId = pageId; // Update the global variable
            fetchBlocks(pageId);
        });
    });

    // Call function to fetch pageId dynamically
    getPageIdFromServer();
})
.catch(error => {
    console.error('Error fetching tabs from the server:', error);
});


// Function to update the navbar when new items are added dynamically
function updateNavbar() {
    const navItems = Array.from(document.querySelectorAll('#navbar-items .nav-item:not(#more-dropdown)'));
    const moreDropdown = document.getElementById('more-dropdown');
    const moreMenu = document.getElementById('more-menu');

    // Clear the 'More' menu
    moreMenu.innerHTML = '';

    // Hide all items beyond the maxItems limit and move them to 'More'
    if (navItems.length > maxItems) {
        navItems.slice(maxItems).forEach(item => {
            item.style.display = 'none';
            const clonedItem = item.cloneNode(true);
            clonedItem.style.display = 'block';
            moreMenu.appendChild(clonedItem);
        });
        moreDropdown.style.display = 'block';
    } else {
        navItems.forEach(item => {
            item.style.display = 'block';
        });
        moreDropdown.style.display = 'none';
    }
}

// getPageIdFromServer1();
// // Function to fetch Page ID from the server
// function getPageIdFromServer1() {
//     let currentUrl = new URL(window.location.href);
//     currentUrl.search = '';
    

//     fetch('http://localhost:8080/api/page', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'URL': currentUrl.href
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const pageId = data.id;
//         fetchBlocks(pageId);
//     })
//     .catch(error => {
//         console.error('Помилка при отриманні ідентифікатора сторінки:', error);
//     });
// }

// Функція для отримання блоків на основі ідентифікатора сторінки
function fetchBlocks(pageId) {
    fetch('http://localhost:8080/api/blocks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'PageID': pageId
        }
    })
    .then(response => response.json())
    .then(data => {
        const blocks = data.blocks;
        const mainContent = document.querySelector('#mainContent');
        const sideContent = document.querySelector('.sideContent ul'); // Вибираємо ul
        
        blocks.forEach(block => {
            const blockContent = createBlockElement(block);
            if (block.Type === 'block link') {
                addNewBlock1(blockContent, sideContent);
            } else {
                addNewBlock1(blockContent, mainContent);
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання блоків з сервера:', error);
    });
}
// const sideContent1 = document.getElementById('sideContent');
// Функція для створення відповідного блоку на основі типу
function createBlockElement(block) {
    let layout;

    switch (block.Type) {
        case 'block image+text':
            layout = createLayoutIT(block.ID, block.ImageSrc, block.Text);
            break;
        case 'block text':
            layout = createLayoutT(block.ID, block.Text);
            break;
        case 'block text+link':
            layout = createLayoutTL(block.ID, block.Text, block.Link, block.LinkText);
            break;
        case 'block link':
            layout = createLink(block.ID, block.Link, block.LinkText);
            break;
        default:
            console.error('Невідомий тип блоку:', block.type);
    }

    return layout;
}


// Оновлені функції для створення блоків з даними
function createLayoutIT(ID, ImageSrc, Text) {
    const layout = document.createElement('div');
    layout.classList.add('layoutIT', 'row', 'align-items-center', 'hidden');
    layout.style.position = 'relative';
    layout.setAttribute('blockCounter', ID);
    layout.setAttribute('blockSent', true);
    layout.innerHTML = `
    <hr class="split-hr">
        <div class="col-lg-4 item">
            <img src="${ImageSrc}" alt="Image" class="img-fluid mt-3" width="100%" height="100%" data-toggle="modal" data-target="#imageModal">
        </div>
        <div class="col-lg-8 item">
            <p class="editor">${Text}</p>
        </div>
    `;
    layout.querySelector('img').addEventListener('click', function() {
        openImageModal(layout.querySelector('img').src);
    });

    return layout;
}

function createLayoutT(ID, Text) {
    const layout = document.createElement('div');
    layout.classList.add('layoutT', 'item', 'editor', 'hidden');
    layout.style.position = 'relative';
    layout.setAttribute('blockCounter', ID);
    layout.setAttribute('blockSent', true);
    layout.innerHTML = `
    <hr class="split-hr">
    <p class="item" style="position: relative;">${Text}</p>
    `;
    return layout;
}

function createLayoutTL(ID, Text, Link, LinkText) {
    const layout = document.createElement('div');
    layout.classList.add('layoutTL', 'item','hidden');
    layout.style.position = 'relative';
    layout.setAttribute('blockCounter', ID);
    layout.setAttribute('blockSent', true);
    layout.innerHTML = `
    <hr class="split-hr">
        <div class="editor">
            <p class="item" style="position: relative;">${Text}</p>
        </div>
        <div>
            <a class="linkA" href="${Link}">${LinkText}</a>
        </div>
    `;
    return layout;
}


function createLink(ID, Link, LinkText) {
    const linkItem = document.createElement('li');
    linkItem.classList.add('item', 'linK'); // Змінив 'linK' на 'link'
    linkItem.setAttribute('blockCounter', ID);
    linkItem.setAttribute('blockSent', true);
    linkItem.style.position = 'relative';
    const linkElement = document.createElement('a'); // Створюємо елемент <a>
    linkElement.classList.add('linkA'); // Додаємо клас 'linkA'
    linkElement.href = Link;
    linkElement.textContent = LinkText;
    linkItem.appendChild(linkElement); // Додаємо <a> як дочірній елемент <li>
    return linkItem;
}


function addNewBlock1(content, target) {
   
        target.appendChild(content);
   
}
// tabName();
//   function tabName(){
//     fetch('http://localhost:8080/api/tabs', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
// .then(response => response.json())
// .then(data => {
//     // Extract tabs array from the response
//     const tabs = data.tabs;

    

//     let currentPageName = '';

//     // Loop through the fetched tabs and add each to the navbar
//     tabs.forEach(tab => {
        
//         const tabUrl = tab.Url;
//         const tabName = tab.Name;

//         // Check if the tab name is not "main_page_admin"
//         if (tabName !== "main_page_admin") {
           
//             // Check if the current URL matches the tab URL
//             if (window.location.href === tabUrl) {
//                 currentPageName = tabName;
//             }
//         }
//     });

//     // Set the page name using the current tab name
//     setPageName(currentPageName);

// })
// .catch(error => {
//     console.error('Error fetching tabs from the server:', error);
// });
//   }


// // Function to set the page name
// function setPageName(pageName) {
//     const pageNameSpan = document.getElementById('page-name-placeholder');
//     if (pageNameSpan) {
//         pageNameSpan.textContent = pageName;
//     }
// }


  });
  