document.addEventListener('DOMContentLoaded', function () {
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

    // Створення нового елементу вкладинки
    const newTab = document.createElement('li');
    newTab.className = 'nav-item';
    newTab.innerHTML = `
        <a class="nav-link item tabName" style="position: relative;" href="#" tabCounter="${tabId}">
            ${tabName}
        </a>
    `;

    
    // Знаходимо батьківський елемент кнопки "+"
    // Знайти елемент, перед яким треба вставити нову вкладку
    const addTabButton = document.querySelector('.nav-item:last-child');

    // Вставити нову вкладку перед кнопкою "+"
    addTabButton.parentNode.insertBefore(newTab, addTabButton);

    })
    .catch(error => {
        console.error('Помилка:', error);
    });


        // Закриття модального вікна
        $('#addTabModal').modal('hide');
    });
     
    // ПІДВКЛАДИНКИ ТА БЛОКИ --------------------------------------------------------------------------------------------------------------------------------------


    // // let tabCounter = 7;
    // let blockCounter = 6;

//     // Отримання інформації про вкладки
// function getTabsInfo(tabNames, tabItems) {
//     const tabs = [];
//     // const tabItemsArray = tabItems.split(',').map(item => item.trim());
    

//     tabNames.forEach((tabName, index) => {
//         const itemsArray = tabItems[index].split(',').map(item => item.trim());

//         tabs.push({
//             name: `${tabName} - ${tabCounter}`,
//             items: itemsArray
//         });

//         tabCounter++;
//     });

//     return tabs;
// }

//     // Отримання інформації про блоки
// function getBlocksInfo() {
//     const blocks = [];
//     const layout1Blocks = document.querySelectorAll('.layout1');
//     const layout2Blocks = document.querySelectorAll('.layout2');
//     const layout3Blocks = document.querySelectorAll('.layout3');
//     const layoutLink = document.querySelectorAll('.link');

//     layout1Blocks.forEach((block) => {
//         blocks.push({
//             type: 'block image+text',
//             imageSrc: block.querySelector('img').src,
//             text: block.querySelector('.col-lg-8').textContent.trim()
//         });
        
//     });

//     layout2Blocks.forEach((block) => {
//         blocks.push({
//             type: 'block text_only',
//             text: block.textContent.trim()
//         });
        
//     });

//     layout3Blocks.forEach((block) => {
//         blocks.push({
//             type: 'block text+link',
//             text: block.querySelector('p').textContent.trim(),
//             link: block.querySelector('a').getAttribute('href')
//         });
        
//     });

//     layoutLink.forEach((block) => {
//         blocks.push({
//             type: 'block link',
//             link: block.querySelector('a').getAttribute('href')
//         });
        
//     });

//     return blocks;
// }

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
        addNewBlock(createLayout1(), mainContent);
        break;
    case "option2":
        // Handle option 2: Тільки Текст
        addNewBlock(createLayout2(), mainContent);
        break;
    case "option3":
        // Handle option 3: Текст + Посилання
        addNewBlock(createLayout3(), mainContent);
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
// Close the modal
$('#textOptionsModal').modal('hide');

        
    });

    // Function to create layouts
    function createLayout1() {
        const layout = document.createElement('div');
        layout.classList.add('layout1', 'row', 'align-items-center', 'item');
        layout.style.position = 'relative';
        layout.innerHTML = `
            <div class="col-lg-4">
                <img src="/static/RESOURCES/IMAGE_ADMIN.png" alt="Image" class="img-fluid mt-3" width="100%" height="100%" data-toggle="modal" data-target="#imageModal">
            </div>
            <div class="col-lg-8">
                <p>Це лише приклад. Замініть картинку та введіть Ваш текст!</p>
            </div>
        `;
        // Додаємо обробник події 'click' для зображення
        layout.querySelector('img').addEventListener('click', function() {
        // Отримуємо елемент input для вибору файлу
        var fileInput = document.createElement('input');
        fileInput.type = 'file';

        // Додаємо обробник події 'change', який викликається при виборі файлу
        fileInput.addEventListener('change', function() {
            // Отримуємо вибраний файл
            var file = this.files[0];

            // Створюємо об'єкт FileReader
            var reader = new FileReader();

            // Обробляємо подію 'load', яка виникає при завантаженні файлу
            reader.addEventListener('load', function() {
                // Встановлюємо src атрибут фото на базі URL зображення
                layout.querySelector('img').src = this.result;
            });

            // Читаємо вміст файлу як URL
            reader.readAsDataURL(file);
        });

        // Клікаємо на елемент input для вибору файлу, щоб відкрити вікно вибору файлу
        fileInput.click();
    });
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
        layout.classList.add('layout2','mt-4', 'item');
        layout.style.position = 'relative';
        layout.innerHTML = `<p>Це лише приклад. Введіть Ваш текст!</p>`;
        return layout;
    }

    function createLayout3() {
        const layout = document.createElement('div');
        layout.classList.add('layout3','mt-4', 'item');
        layout.style.position = 'relative';
        layout.innerHTML = `
            <p>Це лише приклад. Введіть Ваш текст та посилання!</p>
            <a href="#">Посилання</a>
        `;
        return layout;
    }

    // Function to add new blocks to the specified content
    function addNewBlock(content, target) {
        target.appendChild(content);
    }

    // Function to add extended link to side content
    function addExtendedLink(target) {
        const extendedLink = document.createElement('li');
        extendedLink.classList.add('link','item');
        extendedLink.style.position = 'relative'; // Додати inline стиль
        extendedLink.innerHTML = '<a href="#">Посилання</a>';
        target.querySelector('ul').appendChild(extendedLink);
    }
// // Функція для завантаження вкладинок з сервера
// function loadTabsFromServer() {
//     fetch('url/для/запиту/вкладинок')
//       .then(response => response.json())
//       .then(data => {
//         // Отримано дані про вкладинки з сервера
//         const tabsSelect = document.getElementById('existingTabs');
  
//         // Очищаємо випадаючий список
//         tabsSelect.innerHTML = '';
  
//         // Додаємо опції для кожної вкладинки
//         data.forEach(tab => {
//           const option = document.createElement('option');
//           option.value = tab.id; // Припустимо, що вкладинки мають поле id
//           option.textContent = tab.name; // Припустимо, що вкладинки мають поле name
//           tabsSelect.appendChild(option);
//         });
//       })
//       .catch(error => {
//         console.error('Помилка при завантаженні вкладинок:', error);
//       });
//   }
  
//   // Функція для відправлення нової підвкладинки на сервер
//   function saveSubTabToServer(subTabData) {
//     fetch('url/для/збереження/підвкладинки', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(subTabData)
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Помилка при відправленні підвкладинки');
//       }
//       return response.json();
//     })
//     .then(data => {
//         console.log('Підвкладинка успішно збережена:', data);
//         // Додаткові дії після успішного збереження
//         handleSubTabData(data); // Додавання підвкладинки до навбару
//     })
//     .catch(error => {
//         console.error('Помилка при збереженні підвкладинки:', error);
//     });
    
//   }
//   // Функція для додавання підвкладинок до вкладинки в навбарі
// function addSubTabToNavbar(tabId, subTabName) {
//     // Знайдемо елемент в навбарі зі співпадаючим tabId
//     const tabItems = document.querySelectorAll('.tabItems');
//     tabItems.forEach(item => {
//         if (item.getAttribute('tabCounter') === tabId) {
//             // Створимо новий пункт меню для підвкладинки
//             const subTabItem = document.createElement('a');
//             subTabItem.classList.add('dropdown-item', 'item');
//             subTabItem.setAttribute('style', 'position: relative;');
//             subTabItem.textContent = subTabName;
//             item.nextElementSibling.appendChild(subTabItem);
//         }
//     });
// }

// // Приймаємо дані підвкладинки та додаємо їх до навбару
// function handleSubTabData(data) {
//     // Отримання даних про вкладинку та підвкладинку
//     const tabId = data.tabId;
//     const subTabName = data.name;

//     // Додаємо підвкладинку до відповідної вкладинки в навбарі
//     addSubTabToNavbar(tabId, subTabName);
// }

//   // Прослуховування події кліку на кнопку "Зберегти" у формі
//   document.getElementById('saveSubTab').addEventListener('click', function(event) {
//     event.preventDefault();
  
//     // Отримання даних форми
//     const existingTabId = document.getElementById('existingTabs').value;
//     const subTabTitle = document.getElementById('subTabTitle').value;
  
//     // Формування об'єкта з даними підвкладинки
//     const subTabData = {
//       tabId: existingTabId,
//       name: subTabTitle,
//     };
  
//     // Відправлення даних на сервер
//     saveSubTabToServer(subTabData);
//     $('#addSubTabModal').modal('hide');
//   });
  
//   // Завантаження вкладинок з сервера при завантаженні сторінки
//   window.addEventListener('load', function() {
//     loadTabsFromServer();
//   });

    // function sendDeleteRequest(data) {
        

    //     fetch('url_для_вашого_сервера', {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log('Success:', data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // }

    // ВИДАЛЕННЯ ---------------------------------------------------------------------------------------------------------------------------------------------
    
// Отримати кнопку "Видалити" за її ID
var deleteButton = document.getElementById("deleteButton");

// Додати обробник подій для натискання на кнопку "Видалити"
deleteButton.addEventListener("click", function() {
    // Отримати всі елементи з класом "item"
    var items = document.querySelectorAll(".item");
    // var itemsToDelete = [];

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
                // var itemTabCounter = item.getAttribute("tabCounter");
                // var itemBlockCounter = item.getAttribute("blockCounter");
                // var itemImageSrc = item.querySelector("img"); // Отримати посилання на зображення
                

               

                item.remove(); // Видалити елемент

                // itemsToDelete.push({
                //     tabCounter: itemTabCounter,
                //     blockCounter: itemBlockCounter,
                //     imageSrc: itemImageSrc
                // });
            }
        });
    });

    // var dataToDelete = {
    //     items: itemsToDelete
    // };

    // sendDeleteRequest(dataToDelete);
});

// РЕДАГУВАННЯ -------------------------------------------------------------------------------------------------------------------------------------------
// Функція, яка буде викликана при натисканні на кнопку "Редагувати"
document.getElementById("changeButton").addEventListener("click", function() {
    // Отримуємо всі елементи div з класом 'item'
    var items = document.querySelectorAll('.item');
    
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
    
       // Отримуємо всі посилання на сторінці
    var links = document.querySelectorAll('a');

    // Додаємо обробник подій до кожного посилання
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


            // // Закриваємо модальне вікно
            // $('#editLinkModal').modal('hide');
            // Формуємо об'єкт змінених даних для відправки на сервер
//             var updatedData = {
//                 BlockPictureAndText: [],
//                 BlockJustText: [],
//                 BlockTextAndLink: [],
//                 Tabs: [],
//                 Links: []
//             };

//             // Додамо змінені дані блоків з зображеннями та текстом
//             items.forEach(function(item) {
//                 var blockCounter = item.getAttribute('blockCounter');
//                 var imgSrc = item.querySelector('img').src;
//                 var textContent = item.textContent.trim();

//                 if (item.classList.contains('layout1')) {
//                     updatedData.BlockPictureAndText.push({
//                         blockCounter: blockCounter,
//                         Picture: imgSrc,
//                         Text: textContent
//                     });
//                 } else if (item.classList.contains('layout2')) {
//                     updatedData.BlockJustText.push({
//                         blockCounter: blockCounter,
//                         Text: textContent
//                     });
//                 } else if (item.classList.contains('layout3')) {
//                     updatedData.BlockTextAndLink.push({
//                         blockCounter: blockCounter,
//                         Text: textContent,
//                         LinkName : editedLinkName,
//                         LinkUrl: editedLinkUrl
//                     });
//                 } else if (item.classList.contains('tabName') || item.classList.contains('tabItems')) {
//                     updatedData.Tabs.push({
//                         tabCounter: item.getAttribute('tabCounter'),
//                         TabName: tabName,
//                         TabItems: tabItems
//                     });
//                 } else if (item.classList.contains('link')) {
//                     updatedData.Links.push({
//                         blockCounter: blockCounter,
//                         LinkName : editedLinkName,
//                         LinkUrl: editedLinkUrl,
//                         LinkFile: editedLinkFile
//                     });
//                 }
//             });

//             // Відправляємо змінені дані на сервер методом PUT
//             sendPutRequest(updatedData);
        });
    }
});

// // Функція для відправки даних на сервер методом PUT
// function sendPutRequest(data) {
//     fetch('url_для_вашого_сервера', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Success:', data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }
//  });
   


// Функція, яка буде викликана при натисканні на фото
document.querySelector('.item img').addEventListener('click', function(event) {
    // Перевіряємо, чи є якась змінна, яка вказує на режим редагування
    if (document.querySelector('.item').contentEditable === "true") {
        // Якщо так, то перериваємо подальше виконання функції
        // Отримуємо елемент input для вибору файлу
    var fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Додаємо обробник події 'change', який викликається при виборі файлу
    fileInput.addEventListener('change', function() {
        // Отримуємо вибраний файл
        var file = this.files[0];

        // Створюємо об'єкт FileReader
        var reader = new FileReader();

        // Обробляємо подію 'load', яка виникає при завантаженні файлу
        reader.addEventListener('load', function() {
            // Встановлюємо src атрибут фото на базі URL зображення
            document.querySelector('.item img').src = this.result;
        });

        // Читаємо вміст файлу як URL
        reader.readAsDataURL(file);
    });

    // Клікаємо на елемент input для вибору файлу, щоб відкрити вікно вибору файлу
    fileInput.click();

    // Інша дія, яку ви хочете виконати при кліку на фото (відкривання модального вікна)
    // Цю дію можна додати тут, якщо потрібно
    }
   else{
    return;
   }



});

});

