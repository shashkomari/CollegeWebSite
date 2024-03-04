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
           .then(function(response) {
             if (response.ok) {
               // Обробляємо відповідь
               console.log(response);
             } else {
               response.json().then(function(data) {
               var errorMessage = data.Error;
               alert(errorMessage);
             });
             }
           })
           .catch(function(error) {
             // Обробляємо помилку
             console.error(error);
           });
    });