function getData() {
  // Отримати токен з локального сховища
  const token = localStorage.getItem('token');
  window.location.href = '/main_page_admin?token=${token}';
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
            });
    });