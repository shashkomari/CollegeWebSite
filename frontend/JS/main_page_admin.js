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
  });
  document.addEventListener('DOMContentLoaded', function () {
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
        layout.style.bottom = '-15px';
        layout.style.right = '15px'
        layout.innerHTML = `
            <div class="col-lg-4">
                <img src="../RESOURCES/IMAGE_ADMIN.png" alt="Image" class="img-fluid mt-3" width="100%" height="100%" data-toggle="modal" data-target="#imageModal">
            </div>
            <div class="col-lg-8">
                <p>Це лише приклад. Замініть картинку та введіть Ваш текст!</p>
            </div>
        `;
        return layout;
    }

    function createLayout2() {
        const layout = document.createElement('div');
        layout.classList.add('mt-4', 'item');
        layout.style.position = 'relative';
        layout.style.bottom = '-15px';
        layout.style.right = '15px'
        layout.innerHTML = `<p>Це лише приклад. Введіть Ваш текст!</p>`;
        return layout;
    }

    function createLayout3() {
        const layout = document.createElement('div');
        layout.classList.add('mt-4', 'item');
        layout.style.position = 'relative';
        layout.style.bottom = '-15px';
        layout.style.right = '15px'
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



});