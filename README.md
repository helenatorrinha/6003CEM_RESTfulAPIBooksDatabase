# RESTful API service for managing a books database that provides CRUD operations for books, authors, genres, reviews, and users, taking into consideration both regular users and administrators. 

For Books, depending on the role, users can perform operations such as create, get, get by id, update, and delete book entries. 
Each book entry contains information about its id, title, author, genre, publication date, description, ISBN, and image. 

Authors can be managed similarly, allowing users (depending on the role), to add new authors, retrieve author details (for all the authors or based on the author id), update existing records, or remove authors as necessary.
Each author entry contains information about its id, first name, last name, description and avatar image. 

Genres are integral to categorizing books, and this API allows for the management of genres with CRUD operations, enabling users (depending on the role), to define, retrieve (all the genres or based on the genre id), update, and delete genres.
Each genre entry contains information about its id, name and description. 

Reviews provide valuable insights into books, and this API facilitates the creation, retrieval (get all or get by book's id), updating, and deletion of reviews. 
Each review entry contains information about its id, book id that is referred to, the user id who wrote it, its message, when it was created and when it was modified. 

Users are managed with permissions in mind. Regular users have access to basic CRUD operations for managing their own profiles and accessing book information, while administrators have additional privileges, including the ability to manage users, books, genres, authors and reviews.
Each user entry contains information about its id, username, first name, last name, password, email, avatar image and role. 

## To run the back end API: 
nodemon .
The application will be accessible in https://squaremember-decimalvalid-3030.codio-box.uk

## To run the tests: 
npm test

## To access the database ( 6003cem ): 
mysql

## Users and passwords
All the users passwords in the database are: hashed_password
Admin account: alice123
Example user account: bob456
