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
    const addTabForm = document.getElementById('addTabForm');

    // Обробка події відправки форми
    addTabForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Отримання значень полів форми
        const tabName = document.getElementById('tabName').value;
        const tabItems = document.getElementById('tabItems').value;

        // Розділення введених елементів за комою
        const tabItemsArray = tabItems.split(',').map(item => item.trim());

        // Логіка для збереження вкладинки на сервері
        saveTabData(tabName, tabItemsArray);

        // Закриття модального вікна
        $('#addTabModal').modal('hide');
    });

    // Функція для збереження вкладинки на сервері
    function saveTabData(tabName, tabItemsArray) {
        if (tabName) {
            console.log('Назва вкладинки:', tabName);
            console.log('Елементи випадаючого списку:', tabItemsArray);

            // Створення об'єкта з даними для відправки на сервер
            const data = {
                tabName: tabName,
                tabItems: tabItemsArray
            };

            // Відправлення POST-запиту на сервер
            fetch('http://', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Дані успішно відправлені на сервер');
                } else {
                    console.error('Помилка при відправці даних на сервер');
                }
            })
            .catch(error => {
                console.error('Помилка при відправці даних на сервер:', error);
            });
        }
    }
});
document.addEventListener("DOMContentLoaded", function() {
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
                <img src="../RESOURCES/IMAGE_ADMIN.png" alt="Image" class="img-fluid mt-3" width="100%" height="100%" data-toggle="modal" data-target="#imageModal">
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
        layout.classList.add('mt-4', 'item');
        layout.style.position = 'relative';
        layout.innerHTML = `<p>Це лише приклад. Введіть Ваш текст!</p>`;
        return layout;
    }

    function createLayout3() {
        const layout = document.createElement('div');
        layout.classList.add('mt-4', 'item');
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
        extendedLink.classList.add('item');
        extendedLink.style.position = 'relative'; // Додати inline стиль
        extendedLink.innerHTML = '<a href="#">Посилання</a>';
        target.querySelector('ul').appendChild(extendedLink);
    }

// Отримати кнопку "Видалити" за її ID
var deleteButton = document.getElementById("deleteButton");

// Додати обробник подій для натискання на кнопку "Видалити"
deleteButton.addEventListener("click", function() {
  // Отримати всі елементи з класом "item"
  var items = document.querySelectorAll(".item");

  // Для кожного елемента додати хрестик
  items.forEach(function(item) {
    var closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;"; // HTML символ хрестика
    closeButton.classList.add("close");
    item.appendChild(closeButton);

    // Додати обробник події для натискання на хрестик
    closeButton.addEventListener("click", function() {
        // Підтвердження видалення
        var confirmDelete = confirm("Ви впевнені, що хочете видалити цей елемент?");

        // Якщо користувач підтвердив видалення
        if (confirmDelete) {
            item.remove(); // Видалити елемент
        }
     
    });
  });
});
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
    
});

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