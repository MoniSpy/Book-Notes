Description:

This is a Web Application made using the Express/Node.js platform. It allows the user to create entries for books they have read, such as notes, reviews, date read, title, author. etc. The books covers are fetched from a public API (The Open Library Covers API https://openlibrary.org/dev/docs/api/covers)  and saved locally.  The data is persisted in a PostgreSQL database and supports all CRUD operations.
How to run this project locally:

1.	Download the files to a local folder.
2.	Use the file ‘queries.sql’ for instructions and commands to create a PostgreSQL database and schemas.
3.	Run npm install to install all dependencies.
4.	Run node index.js to start the server. 
5.	Server will run on port 3000, open http://localhost:3000/ to view the web application.
