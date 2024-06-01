$('.carousel').carousel({
    interval: 2000  // Інтервал в мілісекундах, наприклад, 2000 мс = 2 сек.
  });
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
  