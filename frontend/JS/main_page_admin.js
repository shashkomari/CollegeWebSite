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
