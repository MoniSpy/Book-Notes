-- Create a databases in postgres
-- name:books
-- password:123456! 

-- Delete table if exits 
DROP TABLE IF EXISTS books,notes;

-- Create books table 
CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  isbn TEXT,
  title TEXT,
  author TEXT,
  description TEXT,
  review TEXT,
  rating INT,
  image_path TEXT,
  date_read TEXT
);

-- Create notes tabel 
CREATE TABLE notes(
  id SERIAL PRIMARY KEY,
  note TEXT,
  book_id INT REFERENCES books(id)
);


-- Insert some data 
INSERT INTO books (isbn,title,author, description, review,rating,image_path,date_read) 
VALUES 

( 
'978-0340733509',
'The power of now',
'Edkart Tolle',
'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 
Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors
 now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. 
 Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 
Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors
 now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. 
 Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
'10',
'assets/images/bookcover.png',
'10-10-2021'),

(
'978-0340733509',
'The power of now',
'Edkart Tolle',
'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 
Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors
 now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. 
 Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 
Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors
 now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. 
 Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
'10',
'assets/images/bookcover.png',
'10-01-2021')











