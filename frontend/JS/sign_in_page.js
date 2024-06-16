function getData() {
  // Отримати токен з локального сховища
  const token = localStorage.getItem('token');
  window.location.href = `/?token=${token}`;
}
document.getElementById('loginForm').addEventListener('submit', function(event) {

    event.preventDefault(); // Щоб сторінка не перезавантажувалася при натисканні кнопки
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
   
    // Будуємо об'єкт JSON
           var data = {
             email: email,
             password: password
           };
  
    
           // Відправляємо POST-запит
           fetch('http://localhost:8080/api/sign_in', {
             method: 'POST',
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
            // Успішна авторизація, зберегти токен і перейти на адміністративну сторінку
            console.log('token: ', data.token);
            localStorage.setItem('token', data.token);
            getData();
           })
            .catch(error => {
              console.error('There was an error!', error);
              // Показати повідомлення про помилку користувачеві
              var errorMessage = document.getElementById('errorMessage');
              errorMessage.textContent = 'Помилка авторизації. Перевірте ваші дані та спробуйте ще раз.';
              errorMessage.style.display = 'block';
            
            });
    });
    document.getElementById('togglePassword').addEventListener('click', function() {
      var passwordField = document.getElementById('password');
      var passwordFieldType = passwordField.getAttribute('type');
      if (passwordFieldType === 'password') {
          passwordField.setAttribute('type', 'text');
          this.querySelector('img').src = 'https://img.icons8.com/ios-glyphs/30/000000/invisible.png';
      } else {
          passwordField.setAttribute('type', 'password');
          this.querySelector('img').src = 'https://img.icons8.com/ios-glyphs/30/000000/visible.png';
      }
  });