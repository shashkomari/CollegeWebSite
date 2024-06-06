$('.carousel').carousel({
    interval: 3000  // Інтервал в мілісекундах, наприклад, 2000 мс = 2 сек.
  });
 
document.addEventListener('DOMContentLoaded', function () {
    
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
        const tabUrl = tab.Url;
        const tabName = tab.Name;

        // Check if the tab name is not "main_page_admin"
        if (tabName !== "main_page_admin") {
            const newTab = document.createElement('li');
            newTab.className = 'nav-item';
            newTab.innerHTML = `
                <a class="nav-link items tabName" style="position: relative; color: white;" href="${tabUrl}" tabCounter="${tabId}">
                    ${tabName}
                </a>
            `;

            // Insert new tab before the "+" button
            navbarNav.insertBefore(newTab, addTabButton);
        }
    });

    updateNavbar(); // Update the navbar to apply the limit and "More" functionality
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


getPageIdFromServer1();
// Function to fetch Page ID from the server
function getPageIdFromServer1() {
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
        fetchBlocks(pageId);
    })
    .catch(error => {
        console.error('Помилка при отриманні ідентифікатора сторінки:', error);
    });
}

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
    layout.classList.add('layoutIT', 'row', 'align-items-center', 'hidden', 'items');
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
    layout.classList.add('layoutT', 'items', 'editor', 'hidden');
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
    layout.classList.add('layoutTL', 'items','hidden');
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
    linkItem.classList.add('items', 'linK'); // Змінив 'linK' на 'link'
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
    const tabUrl = data.page_url;

    // Створення нового елементу вкладинки
    const newTab = document.createElement('li');
    newTab.className = 'nav-item';
    newTab.innerHTML = `
        <a class="nav-link items tabName" style="position: relative; color: white;" href="${tabUrl}" tabCounter="${tabId}">
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
function getPageIdFromServer() {
    let currentUrl = new URL(window.location.href); // Створюємо об'єкт URL з поточного URL

    // Видаляємо все після знака питання (?)
    currentUrl.search = '';

    // Відправляємо запит GET на сервер для отримання pageId
    fetch('http://localhost:8080/api/page', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'URL' : currentUrl.href
        }
    })
    .then(response => response.json())
    .then(data => {
        const pageId = data.id; // Retrieved page identifier (pageId)

        // Get block information
        const layout1Blocks = document.querySelectorAll('.layoutIT');
        const layout2Blocks = document.querySelectorAll('.layoutT');
        const layout3Blocks = document.querySelectorAll('.layoutTL');
        const layoutLink = document.querySelectorAll('.linK');

        layout1Blocks.forEach((block) => {
            const blockInfo = getBlockInfo(block, pageId);
            if (blockInfo && !block.hasAttribute('blockSent')) {
                blockInfo.block = block; // Add block property to blockInfo object
                sendBlockInfo(blockInfo); // Send block info to the server
            }
        });

        layout2Blocks.forEach((block) => {
            const blockInfo = getBlockInfo(block, pageId);
            if (blockInfo && !block.hasAttribute('blockSent')) {
                blockInfo.block = block; // Add block property to blockInfo object
                sendBlockInfo(blockInfo); // Send block info to the server
            }
        });

        layout3Blocks.forEach((block) => {
            const blockInfo = getBlockInfo(block, pageId);
            if (blockInfo && !block.hasAttribute('blockSent')) {
                blockInfo.block = block; // Add block property to blockInfo object
                sendBlockInfo(blockInfo); // Send block info to the server
            }
        });

        layoutLink.forEach((block) => {
            const blockInfo = getBlockInfo(block, pageId);
            if (blockInfo && !block.hasAttribute('blockSent')) {
                blockInfo.block = block; // Add block property to blockInfo object
                sendBlockInfo(blockInfo); // Send block info to the server
            }
        });
    })
    .catch(error => {
        console.error('Помилка при отриманні ідентифікатора сторінки:', error);
    });
}

// Викликаємо функцію для отримання ідентифікатора сторінки
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
        layout.classList.add('layoutIT', 'row', 'align-items-center', 'items');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        // layout.setAttribute('id', 'editor'); // Додаємо id до елементу
        layout.innerHTML = `
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
        layout.classList.add('layoutT', 'items', 'editor');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        layout.innerHTML = `
        <p class="item" style="position: relative;">Це лише приклад. Введіть Ваш текст!</p>
        `;
        return layout;
    }

    function createLayout3() {
        const layout = document.createElement('div');
        layout.classList.add('layoutTL', 'items');
        layout.style.position = 'relative';
        layout.setAttribute('blockCounter', ''); // Додаємо атрибут з пустим значенням
        // layout.setAttribute('id', 'editor'); // Додаємо id до елементу
        layout.innerHTML = `
       
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
//     let pageId = null;
// getPageIdFromServer2();
//     // Function to fetch Page ID from the server
//     function getPageIdFromServer2() {
//         // Find the first tab element with the class 'tabName'
//         let tabElement = document.querySelector('.nav-link.item.tabName');
//         if (!tabElement) {
//             console.error('Не вдалося знайти елемент вкладки з класом "tabName".');
//             return;
//         }
    
//         // Get the URL from the tab element's href attribute
//         let tabUrl = tabElement.getAttribute('href');
    
//         fetch('http://localhost:8080/api/page', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'URL': tabUrl
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             pageId = data.id;
//         })
//         .catch(error => {
//             console.error('Помилка при отриманні ідентифікатора сторінки:', error);
//         });
//     }
    
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
// Ініціалізація редактора CKEditor
var editorInitialized = false; // Прапорець для перевірки, чи редактор вже ініційований

// Функція, яка буде викликана при натисканні на кнопку "Редагувати"
document.getElementById("changeButton").addEventListener("click", function() {
    // Отримуємо всі елементи div з класом 'item'
    var items = document.querySelectorAll('.item') && document.querySelectorAll('.items');
    var mainItems = document.querySelectorAll('main .item');
    
    // Перебираємо кожен елемент і додаємо обробник подій для редагування
    items.forEach(function(item) {
        item.contentEditable = true; // Дозволяємо редагування тексту
    });
    
        // Отримати всі елементи з класом "close" (хрестики)
        var closeButtons = document.querySelectorAll(".close");
        
        // Перебираємо кожен хрестик і приховуємо його
        closeButtons.forEach(function(closeButton) {
            closeButton.style.display = 'none'; // Приховуємо хрестик
        });
        if (!editorInitialized) { // Перевірка, чи редактор вже ініційований
            var mainEditors = document.querySelectorAll('main .editor');
            mainEditors.forEach(function(editorElement, index) {
                ClassicEditor
                    .create(editorElement, {
                        toolbar: {
                            items: [
                                'heading',
                                '|',
                                'bold',
                                'italic',
                                '|',
                                'bulletedList',
                                'numberedList',
                                '|',
                                'outdent',
                                'indent',
                                '|',
                                'undo',
                                'redo'
                            ]
                        }
                    })
                    .then(editorInstance => {
                        // Додаємо обробник події 'blur' для збереження змін
                        editorInstance.model.document.on('change:data', () => {
                            // Отримуємо дані з редактора та оновлюємо вміст відповідного елемента
                            editorElement.innerHTML = editorInstance.getData();
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        
            editorInitialized = true; // Позначте, що редактор вже ініційований
        }

    // Додаємо обробник події для зміни зображення при натисканні на кожне зображення
    document.querySelectorAll('.item img').forEach(function(img) {
        img.addEventListener('click', function(event) {
            // Викликаємо файлову систему для вибору нового зображення
            var fileInput = document.createElement('input');
            fileInput.type = 'file';

            // Додаємо обробник події 'change', який викликається при виборі файлу
            fileInput.addEventListener('change', function() {
                // Отримуємо вибраний файл
                var file = this.files[0];
                var formData = new FormData(); // Створюємо об'єкт FormData для передачі файлу

                formData.append('file', file); // Додаємо файл до FormData

                fetch('url_для_завантаження_зображення', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Встановлюємо src атрибут фото на базі URL зображення з сервера
                    img.src = data.filePath; // Припустимо, що сервер повертає шлях до збереженого зображення
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });

            fileInput.click();
        });
    });
     // Отримуємо всі посилання з класом linkA на сторінці
var links = document.querySelectorAll('a.linkA');

// Додаємо обробник подій до кожного посилання з класом linkA
links.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Забороняємо стандартну дію посилання
        openEditModal(link); // Відкриваємо модальне вікно для редагування
    });
});

    // Функція для відкриття модального вікна для редагування
    function openEditModal(link) {
        // Отримуємо назву та посилання посилання, на яке натиснули
        var linkName = link.textContent;
        var linkUrl = link.getAttribute('href');

        // Заповнюємо форму в модальному вікні з отриманими значеннями
        document.getElementById('linkName').value = linkName;
        document.getElementById('linkUrl').value = linkUrl;
        // document.getElementById('linkFile').value = linkFile;

        // Відкриваємо модальне вікно
        $('#editLinkModal').modal('show');

        // Додаємо обробник події для збереження даних при натисканні на кнопку "Зберегти"
        document.getElementById('saveLink').addEventListener('click', function () {
            // Отримуємо змінені значення з форми
            var editedLinkName = document.getElementById('linkName').value;
            var editedLinkUrl = document.getElementById('linkUrl').value;
            var editedLinkFile = document.getElementById('linkFile').files[0];

            // // Змінюємо текст та посилання посилання, на яке натиснули
            // link.textContent = editedLinkName;
            // link.href = editedLinkUrl || editedLinkFile;


// Якщо файл обраний, використовуємо його як посилання
if (editedLinkFile) {
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
        var linkFile = event.target.result;
        link.textContent = editedLinkName;
        link.href = linkFile;
        $('#editLinkModal').modal('hide');
        // Отправка данных на сервер методом PUT з updatedData
    };
    fileReader.readAsDataURL(editedLinkFile);
} else {
    // Використовуємо URL, яке ввів користувач в поле посилання
    link.textContent = editedLinkName;
    link.href = editedLinkUrl;
    $('#editLinkModal').modal('hide');
    // Отправка данных на сервер методом PUT з updatedData
}
// Функція для отримання інформації про блок
function getBlockInfo(block, blockCounter) {
    let blockInfo = null;

    if (block.classList.contains('layoutIT')) {
        blockInfo = {
            blockCounter: blockCounter,
            image: block.querySelector('img').src,
            text: block.textContent.trim()
        };
    } else if (block.classList.contains('layoutT')) {
        blockInfo = {
            blockCounter: blockCounter,
            text: block.textContent.trim()
        };
    } else if (block.classList.contains('layoutTL')) {
        let linkElement = block.querySelector('a');
        blockInfo = {
            blockCounter: blockCounter,
            text: block.querySelector('p').textContent.trim(),
            link: linkElement.getAttribute('href'),
            linkText: linkElement.textContent.trim(),
        };
    // // }
    // } else if (block.classList.contains('tabName') || block.classList.contains('tabItems')) {
    } else if (block.classList.contains('tabName')) {
        blockInfo = {
            tabCounter: block.getAttribute('tabCounter'),
            tabName: block.querySelector('.tabName').textContent.trim(),
            // TabItems: block.querySelector('.tabItems').textContent.trim()
        };
    } else if (block.classList.contains('linK')) {
        let linkElement = block.querySelector('a');
        blockInfo = {
            blockCounter: blockCounter,
            link: linkElement.getAttribute('href'),
            linkText: linkElement.textContent.trim(),
        };
    }

   
    // Перевірка на null і додавання "-" для незміненої інформації
    if (blockInfo !== null) {
        for (const key in blockInfo) {
            if (blockInfo[key] === "") {
                blockInfo[key] = "—";
            }
        }
    }

    return blockInfo;
}

// Функція для відправки даних про блок на сервер методом PUT
function sendPutRequest(data) {
    fetch('url_для_вашого_сервера', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

items.forEach(function(item) {
    var blockCounter = item.getAttribute('blockCounter');
    var blockInfo = getBlockInfo(item, blockCounter); // Отримуємо інформацію про блок за допомогою функції getBlockInfo

    // Перевіряємо, чи є інформація про блок
    if (blockInfo !== null) {
        // Відправляємо дані про блок на сервер методом PUT
        sendPutRequest(blockInfo);
    }
});
            
        });
    }
});


});

