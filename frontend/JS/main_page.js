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
    
 
  //   fetch('http://localhost:8080/api/tabs') // Адреса API для отримання масиву вкладинок
  //   .then(response => response.json())
  //   .then(data => {
  //       // Обробка отриманих даних
  //       displayTabs(data); // Виклик функції для відображення вкладинок у навбарі
  //   })
  //   .catch(error => {
  //       console.error('Помилка:', error);
  //   });
    

  //   function displayTabs(tabsData) {
  //     const navbarNav = document.querySelector('#navbarNav .navbar-nav');
  
  //     tabsData.forEach(tab => {
  //         const newTab = document.createElement('li');
  //         newTab.className = 'nav-item dropdown';
  
  //         const dropdownToggle = document.createElement('a');
  //         dropdownToggle.className = 'nav-link dropdown-toggle';
  //         dropdownToggle.href = tab.url; // Припустимо, що в об'єкті даних для кожної вкладинки є поле "url"
  //         dropdownToggle.setAttribute('role', 'button');
  //         dropdownToggle.setAttribute('data-toggle', 'dropdown');
  //         dropdownToggle.setAttribute('aria-haspopup', 'true');
  //         dropdownToggle.setAttribute('aria-expanded', 'false');
  //         dropdownToggle.textContent = tab.name; // Припустимо, що в об'єкті даних для кожної вкладинки є поле "name"
  
  //         const dropdownMenu = document.createElement('div');
  //         dropdownMenu.className = 'dropdown-menu';
  //         dropdownMenu.setAttribute('aria-labelledby', dropdownToggle.id);
  
  //         tab.subTabs.forEach(subTab => {
  //             const dropdownItem = document.createElement('a');
  //             dropdownItem.className = 'dropdown-item';
  //             dropdownItem.href = subTab.url; // Припустимо, що в об'єкті даних для кожної підвкладинки є поле "url"
  //             dropdownItem.textContent = subTab.name; // Припустимо, що в об'єкті даних для кожної підвкладинки є поле "name"
  //             dropdownMenu.appendChild(dropdownItem);
  //         });
  
  //         newTab.appendChild(dropdownToggle);
  //         newTab.appendChild(dropdownMenu);
  //         navbarNav.appendChild(newTab);
  //     });
  // }
  


  });
  