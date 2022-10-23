# EarthBnB
![image](https://i.imgur.com/82DMOew.png)


***
### An AirBnB Clone

EarthBnB is a full stack application that is inspired by AirBnB. It can be used to discover or host unique accommodations all over the world! Visit the [live link](https://airbnb-aa-adpham.herokuapp.com/) to explore the world!

***

### Getting Started

Create a .env file located in the root of the backend folder formatted similarly to the .env.example file located in the same directory.

Run the following commands to run the application locally:
```js
npm install
cd backend/
npx dotenv sequelize db:migrate
npx dotenv sequelize-cli db:seed:all
npm start
cd ../frontend/
npm start
```
Upon completion, the site should launch in your local browser. Recommended: Google Chrome.
***

[API DOCUMENTATION](https://github.com/Allendpham/AirBnB/wiki/API-Documentation)

Documentation of the API routes used to make requests to the database.

***
[DATABASE SCHEMA](https://github.com/Allendpham/AirBnB/wiki/Database-Schema)

SQLite3 database schema.

***
[FEATURE LIST](https://github.com/Allendpham/AirBnB/wiki/Feature-List)

List of the functional features of the app.

***
[REDUX STORE SHAPE](https://github.com/Allendpham/AirBnB/wiki/Redux-Store-Shape)

Pseudo code that illustrates the state of the Redux store for the two features that will be implemented.

***
### Technologies Used
### Frontend
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

### Backend
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

### Hosting
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

***
### Feature Descriptions
* Users can create an account or log in to an existing account
![image](https://i.imgur.com/3SQCm6h.png)
![image](https://i.imgur.com/4F3Lejz.png)

* Upon successful log in or sign up:
* Users can host/create a new spot listing to display publicly and can also update and delete the spot
![image](https://i.imgur.com/YYhfYKA.png)
![image](https://i.imgur.com/fOjmh3V.png)

* Users can create reviews on a spot listing as well as delete it after having left the review
![image](https://i.imgur.com/yh5DEGl.png)

### Contact Information
Have any questions or want to start a conversation? Contact Allen Pham at any of the options below:
Email: Allendpham@gmail.com
[LinkedIn](https://www.linkedin.com/in/allen-pham/)

### Future Features
* A fully functional bookings feature to allow users to create, edit, or delete bookings for spot listings
* A search filter to filter spots based on location or price
* Use of the Google Maps Platform to display accurate location information of spot listings
