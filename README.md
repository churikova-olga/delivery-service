#API-приложение

*** 
###Описание

Бэкенд-приложение службы доставки. Реализовано 3 модуля: 
* ####Модуль пользователя
Отвечает за аунтифекацию пользователей. Все пароли хэшированы
* ####Модуль объявлений
Позволяет просматривать, удалять, обновлять, а так же добавлять новые объявления. Для получения полного функционала необхидимо зарегестрироваться
* ####Модуль чат
Позволяет переписываться с другим пользователей в режиме реального времени

*** 
###Используемые технологии

* ###Node.js
* ###Passport.js
* ###Socket.io

*** 

###Запуск приложения
<strong>Для запуска приложения необходим docker</strong> <br>
1. Скачать репозиторий
2. Создать файл .env <br> *DB_USERNAME <br> 
*DB_PASSWORD <br> *DB_NAME<br> *DB_HOST=mongodb://mongodb:27017 <br> 
*COOKIE_SECRET <br> *PORT
3. Выполнить команду <strong>docker-compose up</strong>

***
Функционал проверялся в Postman. <br>
Socket.io проверялся в Postman webSocket request