
 
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

    

   //SIDEBAR----------------------------------------------------------------------------------------------------------------------------------------------------------------
    const sidebar1 = document.querySelector('.sidebar');
    const fullScreenImage = document.querySelector('.full-screen-image');
    const offset = 100; // Налаштування відступу в пікселях

    window.addEventListener('scroll', () => {
        const imageBottom = fullScreenImage.getBoundingClientRect().bottom;
        if (imageBottom <= offset) {
            sidebar1.classList.remove('hidden');
        } else {
            sidebar1.classList.add('hidden');
        }
    });
    // ВЗЯТТЯ ВСІЄЇ ІНФОРМАЦІЇ З СЕРВЕРУ --------------------------------------------------------------------------------------------------------------------------------------------------------------
// Maximum number of items to display
const maxItems = 4;
const token = localStorage.getItem('token');
// Глобальна змінна для збереження pageId
let globalPageId = null;
// Функція для отримання pageId з URL-адреси
function getPageIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('pageId');
}
// Функція для очищення вмісту сторінки
function clearPageContent() {
    const contentArea = document.getElementById('mainContent'); // припустимо, що вміст сторінки знаходиться в елементі з id 'content-area'
    if (contentArea) {
        contentArea.innerHTML = ''; // очищаємо вміст
    }
}

// Перевірка наявності pageId в URL-адресі при завантаженні сторінки
window.addEventListener('load', () => {
    const pageIdFromUrl = getPageIdFromUrl();
    if (pageIdFromUrl) {
        globalPageId = pageIdFromUrl;
        fetchBlocks(pageIdFromUrl);
    }
});

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
                 <a class="nav-link items tabName" style="position: relative; color: white;" href="http://localhost:8080/tmpl?token=${token}" tabCounter="${pageId}">
                     ${pageName}
                 </a>
             `;
             navbarNav.insertBefore(newTab, addTabButton);
                
         });
     }
 });

// Set href for navbar-brand
const navbarBrand = document.querySelector('.navbar-brand');
navbarBrand.href = `http://localhost:8080/?token=${token}`;
    updateNavbar(); // Update the navbar to apply the limit and "More" functionality
// Add event listeners to tabs
document.querySelectorAll('.nav-link.items.tabName').forEach(tab => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        const pageId = tab.getAttribute('tabCounter');
        globalPageId = pageId; // Update the global variable
        clearPageContent();
        fetchBlocks(pageId);
    });
});
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


// Функція для отримання блоків на основі ідентифікатора сторінки
function fetchBlocks(pageId) {
    // Функція для отримання блоків на основі pageId
    console.log(`Fetching blocks for pageId: ${pageId}`);
    fetch('http://localhost:8080/api/blocks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'pageId': pageId
        }
    })
    .then(response => response.json())
    .then(data => {
        const blocks = data.blocks;
        const mainContent = document.getElementById('mainContent');
        const sideContent = document.querySelector('#sideContent ul'); // Вибираємо ul
        
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
    layout.classList.add('layoutIT', 'row', 'align-items-center', 'items', 'block');
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
    layout.classList.add('layoutT', 'items', 'editor', 'block');
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
    layout.classList.add('layoutTL', 'items', 'block');
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
    linkItem.classList.add('items', 'linK', 'block'); // Змінив 'linK' на 'link'
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

 

//ЗОБРАЖЕННЯ(МОДУЛЬНЕ ВІКНО) --------------------------------------------------------------------------------------------------------------------------------------------------------------
    
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
    
     
    // ВКЛАДИНКИ --------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    const addTabForm = document.getElementById('addTabForm');

    addTabForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var tabName = document.getElementById('tabName').value;
       
       
        // Будуємо об'єкт JSON
               var data = {
                 "type": 'tab',
                 "name": tabName
               };
        // Відправка даних на сервер за допомогою Fetch API та JSON
        fetch('http://localhost:8080/api/tab', {
        method: 'POST',
        headers: {
            
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
      
    })
    .then(response => response.json())
    .then(data => {
        console.log('Відповідь від сервера:', data);
        // Отримання id з відповіді сервера
    const tabId = data.id;
    // const tabUrl = data.page_url;

    // Створення нового елементу вкладинки
    const newTab = document.createElement('li');
    newTab.className = 'nav-item';
    newTab.innerHTML = `
        <a class="nav-link items tabName" style="position: relative; color: white;" href="http://localhost:8080/tmpl?token=${token}" tabCounter="${tabId}">
            ${tabName}
        </a>
    `;

    // Знаходимо батьківський елемент кнопки "+"
    // Знайти елемент, перед яким треба вставити нову вкладку
    const addTabButton = document.querySelector('.nav-item:last-child');

    // Вставити нову вкладку перед кнопкою "+"
    addTabButton.parentNode.insertBefore(newTab, addTabButton);
    
    // Очистити поле вводу після відправки форми
    document.getElementById('tabName').value = '';

    })
    
    .catch(error => {
        console.error('Помилка:', error);
    });


        // Закриття модального вікна
        $('#addTabModal').modal('hide');
    });
     
    // ПІДВКЛАДИНКИ ТА БЛОКИ --------------------------------------------------------------------------------------------------------------------------------------

    function getBlockInfo(block, pageId) {
        let blockInfo = null;
    
        if (block.classList.contains('layoutIT')) {
            blockInfo = {
                type: 'block image+text',
                imageSrc: block.querySelector('img').src,
                text: block.querySelector('.col-lg-8').textContent.trim(),
                pageId: pageId
            };
        } else 
        if (block.classList.contains('layoutT')) {
            blockInfo = {
                type: 'block text',
                text: block.textContent.trim(),
                pageId: pageId
            };
        } else if (block.classList.contains('layoutTL')) {
            let linkElement = block.querySelector('a');
            blockInfo = {
                type: 'block text+link',
                text: block.querySelector('p').textContent.trim(),
                link: linkElement.getAttribute('href'),
                linkText: linkElement.textContent.trim(),
                pageId: pageId
            };
        } else if (block.classList.contains('linK')) {
            let linkElement = block.querySelector('a');
            blockInfo = {
                type: 'block link',
                link: linkElement.getAttribute('href'),
                linkText: linkElement.textContent.trim(),
                pageId: pageId
            };
        }
    
        return blockInfo;
    }
    

    const sidebar = document.querySelector('.sidebar');
    const sideContent = document.getElementById('sideContent');
    const mainContent = document.getElementById('mainContent');

    // Add 'active' class to sidebar and main content when page loads
    sidebar.classList.add('active');
    mainContent.classList.add('active');

    // Handle the click event of the "Додати" button
    document.getElementById("addTextButton").addEventListener("click", function () {
        // Show the modal for selecting text options
        $('#textOptionsModal').modal('show');
    });

    // Handle the click event of the "Застосувати" button inside the modal
    document.getElementById("applyOption").addEventListener("click", function () {
        // Get the selected option
        const selectedOption = document.querySelector('input[name="textOption"]:checked').value;

      
// Display the corresponding layout based on the selected option
switch (selectedOption) {
    case "option1":
        // Handle option 1: Картинка + Текст
        addNewBlock1(createLayout1(), mainContent);
        break;
    case "option2":
        // Handle option 2: Тільки Текст
        addNewBlock1(createLayout2(), mainContent);
        break;
    case "option3":
        // Handle option 3: Текст + Посилання
        addNewBlock1(createLayout3(), mainContent);
        break;
    case "option4":
        // Handle option 4: Поширене Посилання
        addExtendedLink(sideContent);
        break;
    // case "subOption":
    //     // Open the modal for adding a sub-tab
    //     $('#addSubTabModal').modal('show');
    //     break;    
    default:
        console.log("No option selected");
}
// Функція для отримання ідентифікатора сторінки (pageId) з сервера
function getPageIdFromServer( ) {
    console.log('Fetching page ID:', globalPageId); // Add this for debugging

    // Get block information
    const layout1Blocks = document.querySelectorAll('.layoutIT');
    const layout2Blocks = document.querySelectorAll('.layoutT');
    const layout3Blocks = document.querySelectorAll('.layoutTL');
    const layoutLink = document.querySelectorAll('.linK');

    layout1Blocks.forEach((block) => {
        const blockInfo = getBlockInfo(block, globalPageId);
        if (blockInfo && !block.hasAttribute('blockSent')) {
            blockInfo.block = block; // Add block property to blockInfo object
            sendBlockInfo(blockInfo); // Send block info to the server
        }
    });

    layout2Blocks.forEach((block) => {
        const blockInfo = getBlockInfo(block, globalPageId);
        if (blockInfo && !block.hasAttribute('blockSent')) {
            blockInfo.block = block; // Add block property to blockInfo object
            sendBlockInfo(blockInfo); // Send block info to the server
        }
    });

    layout3Blocks.forEach((block) => {
        const blockInfo = getBlockInfo(block, globalPageId);
        if (blockInfo && !block.hasAttribute('blockSent')) {
            blockInfo.block = block; // Add block property to blockInfo object
            sendBlockInfo(blockInfo); // Send block info to the server
        }
    });

    layoutLink.forEach((block) => {
        const blockInfo = getBlockInfo(block, globalPageId);
        if (blockInfo && !block.hasAttribute('blockSent')) {
            blockInfo.block = block; // Add block property to blockInfo object
            sendBlockInfo(blockInfo); // Send block info to the server
        }
    });
}
getPageIdFromServer();

// Функція для відправлення блоку на сервер
function sendBlockInfo(blockInfo) {
    fetch('http://localhost:8080/api/block', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blockInfo)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response with block information:', data);

        // Check if the block exists before setting the attribute
        if (blockInfo.block) {
            const blockIdFromServer = data.id; // Assuming this is the block id from the server
            blockInfo.block.setAttribute('blockCounter', blockIdFromServer); // Assign blockCounter value to the block
            blockInfo.block.setAttribute('blockSent', true); // Mark the block as sent
        }
    })
    .catch(error => {
        console.error('Помилка при відправці блоку:', error);
    });
}



// Close the modal
$('#textOptionsModal').modal('hide');
        
    });

    // Function to create layouts
    function createLayout1() {
        const layout = document.createElement('div');
        layout.classList.add('layoutIT', 'row', 'align-items-center', 'items', 'block');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        // layout.setAttribute('id', 'editor'); // Додаємо id до елементу
        layout.innerHTML = `
        <hr class="split-hr">
            <div class="col-lg-4 item">
                <img src="/static/RESOURCES/IMAGE_ADMIN.png" alt="Image" class="img-fluid mt-3" width="100%" height="100%" data-toggle="modal" data-target="#imageModal">
            </div>
            <div class="col-lg-8 item">
                <p class="editor">Це лише приклад. Замініть картинку та введіть Ваш текст!</p>
            </div>
        `;
    
    // Додаємо обробник події 'click' для зображення
    layout.querySelector('img').addEventListener('click', function() {
        // Відкриваємо модальне вікно при кліку на зображення
        openImageModal(layout.querySelector('img').src);
    });

    return layout;
    }

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

    function createLayout2() {
        const layout = document.createElement('div');
        layout.classList.add('layoutT', 'items', 'editor', 'block');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        layout.innerHTML = `
        <hr class="split-hr">
        <p class="item" style="position: relative;">Це лише приклад. Введіть Ваш текст!</p>
        `;
        return layout;
    }

    function createLayout3() {
        const layout = document.createElement('div');
        layout.classList.add('layoutTL', 'items', 'block');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        // layout.setAttribute('id', 'editor'); // Додаємо id до елементу
        layout.innerHTML = `
       <hr class="split-hr">
        <div class="editor">
            <p class="item" style="position: relative;">Це лише приклад. Введіть Ваш текст та посилання!</p>
        </div>
        <div>
            <a class="linkA" href="#">Посилання</a>
        </div>
        `;
        return layout;
    }

    // Function to add new blocks to the specified content
    function addNewBlock1(content, target) {
        target.appendChild(content);
    }

    // Function to add extended link to side content
    function addExtendedLink(target) {
        const extendedLink = document.createElement('li');
        extendedLink.classList.add('linK','item');
        extendedLink.style.position = 'relative'; // Додати inline стиль
        extendedLink.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        extendedLink.innerHTML = '<a class="linkA" href="#">Посилання</a>';
        target.querySelector('ul').appendChild(extendedLink);
    }


    // ВИДАЛЕННЯ ---------------------------------------------------------------------------------------------------------------------------------------------
    
  // Function to delete a tab
function deleteTab(id) {
    fetch('http://localhost:8080/api/tab', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'id': id
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tab deleted:', data);
    })
    .catch(error => {
        console.error('Error deleting tab:', error);
    });
}

// Function to delete a block
function deleteBlock(id) {
    fetch('http://localhost:8080/api/block', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'id': id
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Block deleted:', data);
    })
    .catch(error => {
        console.error('Error deleting block:', error);
    });
}

// Отримати кнопку "Видалити" за її ID
var deleteButton = document.getElementById("deleteButton");

// Додати обробник подій для натискання на кнопку "Видалити"
deleteButton.addEventListener("click", function() {
    // Отримати всі елементи з класом "item"
    var items = document.querySelectorAll(".items");

    // Для кожного елемента додати хрестик та обробник події для видалення
    items.forEach(function(item) {
        var closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;"; // HTML символ хрестика
        closeButton.classList.add("close");
        item.appendChild(closeButton);

        closeButton.addEventListener("click", function() {
            // Підтвердження видалення
            var confirmDelete = confirm("Ви впевнені, що хочете видалити цей елемент?");

            // Якщо користувач підтвердив видалення
            if (confirmDelete) {
                // Визначити тип елементу (таб чи блок) та отримати відповідний ID
                var id;

                if (item.classList.contains('tabName')) {
                    id = item.getAttribute('tabCounter');
                    deleteTab(id);
                } else if (['layoutIT', 'layoutT', 'layoutTL', 'linK'].some(className => item.classList.contains(className))) {
                    id = item.getAttribute('blockCounter');
                    deleteBlock(id);
                } else {
                    console.error('Unknown item type for element:', item);
                    return;
                }

                item.remove(); // Видалити елемент з DOM
            }
        });
    });
});
// РЕДАГУВАННЯ -------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("changeButton").addEventListener("click", function() {
    var items = document.querySelectorAll('.item, .items');
    // var mainItems = document.querySelectorAll('main .item');
    var editorInitialized = false;
    var blocks = document.querySelectorAll('.block');
    var tabs = document.querySelectorAll('.change');
    var button = document.querySelectorAll('.nav-item');

    // Перебираємо кожен елемент і додаємо обробник подій для редагування
    items.forEach(function(item) {
        item.contentEditable = true; // Дозволяємо редагування тексту
    });
    blocks.forEach(function(block) {
        // Create and insert the "Save" button
        var saveButton = document.createElement('button');
        saveButton.innerText = 'Зберегти';
        saveButton.className = 'saveButton';
        block.parentElement.insertBefore(saveButton, block.nextSibling);

        // Add click event listener for the "Save" button
        saveButton.addEventListener('click', function() {
            // Get block information
            var blockInfo = getBlockInfo(block);
            if (blockInfo) {
                // Strip styles before sending data
                blockInfo.plainText = stripStyles(blockInfo.text);
                sendPutRequest(blockInfo);
            }
        });
    });
// Create and insert the "Save" button before the first tab
if (button.length > 0) {
    var saveButton = document.createElement('button');
    saveButton.innerHTML = '&#10004;';  // Checkmark symbol
    saveButton.className = 'saveButtonTab';
    button[0].parentElement.insertBefore(saveButton, button[0]);


    // Змінна для збереження змінених таб
    let changedTabs = [];

    // Функція для додавання таби до змінених
    function addChangedTab(tab) {
        if (!changedTabs.includes(tab)) {
            changedTabs.push(tab);
        }
    }

    // Додамо обробник події click для кожної таби
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Оновлюємо змінені таби при кліці на табу
            addChangedTab(tab);
        });
    });

    // Додаємо обробник події click для кнопки "Зберегти"
    saveButton.addEventListener('click', function() {
        // Перевіряємо, чи є змінені таби
        if (changedTabs.length > 0) {
            // Отримуємо інформацію про кожну змінену табу та відправляємо її
            changedTabs.forEach(function(tab) {
                var tabInfo = getTabsInfo(tab);
                if (tabInfo) {
                    sendPutRequestTab(tabInfo);
                }
            });
            // Після відправлення очищаємо змінені таби
            changedTabs = [];
        } else {
            console.log('Жодна таба не була змінена');
        }
    });
}


    
    var closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(function(closeButton) {
        closeButton.style.display = 'none'; // Приховуємо хрестик
    });

    if (!editorInitialized) {
        var mainEditors = document.querySelectorAll('main .editor');
        mainEditors.forEach(function(editorElement) {
            ClassicEditor.create(editorElement, {
                toolbar: {
                    items: [
                        'heading', '|', 'bold', 'italic', '|',
                        'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|', 'undo', 'redo'
                    ]
                }
            }).then(editorInstance => {
                editorInstance.model.document.on('change:data', () => {
                    editorElement.innerHTML = editorInstance.getData();
                });
            }).catch(error => {
                console.error(error);
            });
        });

        editorInitialized = true;
    }

    document.querySelectorAll('.item img').forEach(function(img) {
        img.addEventListener('click', function() {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.addEventListener('change', function() {
                var file = this.files[0];
                var formData = new FormData();
                formData.append('file', file);  // Додаємо обраний файл у formData
                getBlockInfo(img.parentNode, formData);  // Передаємо батьківський елемент та formData
            });
            fileInput.click();
        });
    });

    var links = document.querySelectorAll('a.linkA');
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            openEditModal(link);
        });
    });

    function openEditModal(link) {
        var linkName = link.textContent;
        var linkUrl = link.getAttribute('href');
        document.getElementById('linkName').value = linkName;
        document.getElementById('linkUrl').value = linkUrl;
        $('#editLinkModal').modal('show');

        document.getElementById('saveLink').addEventListener('click', function() {
            var editedLinkName = document.getElementById('linkName').value;
            var editedLinkUrl = document.getElementById('linkUrl').value;
          
                link.textContent = editedLinkName;
                link.href = editedLinkUrl;
                $('#editLinkModal').modal('hide');
            // }
        });
    }
    function getTabsInfo(tab) {
        let tabInfo = {
            id: null, // За замовчуванням, якщо не знайдено атрибут 'tabCounter'
            name: "-"
        };
    
        let tabAnchor = tab.querySelector('a.tabName'); // Знайти <a> елемент з класом 'tabName' всередині 'tab'
    
        if (tabAnchor) {
            tabInfo.id = tabAnchor.getAttribute('tabCounter'); // Отримати значення атрибута 'tabCounter' з <a> елемента
            tabInfo.name = tabAnchor.textContent.trim(); // Отримати текстовий вміст з <a> елемента і очистити від зайвих пробілів
        }
    
        return tabInfo; // Повернути об'єкт з інформацією про вкладинку
    }

    function getBlockInfo(block, formData) { 
        let blockInfo = {
            id: block.getAttribute('blockCounter') || "-",
            type: "-",
            imageSrc: "-",
            text: "-",
            plainText: "-",
            link: "-",
            linkText: "-"
        };

        if (block.classList.contains('layoutIT')) {
            blockInfo.type = 'block image+text';
            blockInfo.imageSrc = formData.get('file') ? block.querySelector('img').src : "-";
            blockInfo.text = block.innerHTML.trim() || "-";
        } else if (block.classList.contains('layoutT')) {
            blockInfo.type = 'block text';
            blockInfo.text = block.innerHTML.trim() || "-";
        } else if (block.classList.contains('layoutTL')) {
            let linkElement = block.querySelector('a');
            blockInfo.type = 'block text+link';
            blockInfo.text = block.querySelector('p') ? block.querySelector('p').innerHTML.trim() : "-";
            blockInfo.link = linkElement ? linkElement.getAttribute('href') : "-";
            blockInfo.linkText = linkElement ? linkElement.textContent.trim() : "-";
    
        } else if (block.classList.contains('linK')) {
            let linkElement = block.querySelector('a');
            blockInfo.type = 'block link';
            blockInfo.link = linkElement ? linkElement.getAttribute('href') : "-";
            blockInfo.linkText = linkElement ? linkElement.textContent.trim() : "-";
        }

        return blockInfo;
    }
        
        
       
        function stripStyles(html) {
            var tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }
    function sendPutRequest(data) {
        fetch('http://localhost:8080/api/block', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }
    function sendPutRequestTab(data) {
        fetch('http://localhost:8080/api/tab', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }
  
}); 


});
