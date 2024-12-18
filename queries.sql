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


-- Insert sample data
INSERT INTO books (isbn, title, author, description, review, rating, image_path, date_read) 
VALUES 
( 
'978-034478359',
'My Book Cover',
'MA Spyher',
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
'8',
'assets/images/bookcover.png',
'10-10-2021')

INSERT INTO books (isbn, title, author, description, review, rating, date_read) 
VALUES 
(
'978-090782900',
'My New Book',
'MASI Edwards',
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
'10','29-01-2021')



INSERT INTO notes(note, book_id)
VALUES
('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis tempus elit. Sed aliquet vel enim et cursus. Etiam ac urna suscipit diam commodo faucibus. 
Vestibulum imperdiet iaculis dui. Aliquam finibus, turpis eget pellentesque pulvinar, eros tortor cursus lacus, eu dignissim lectus urna sed ipsum.',1),
('Quisque accumsan lorem massa, nec blandit tortor sollicitudin quis. Proin id elementum sem. Aenean scelerisque enim id ante vestibulum, ac tristique est faucibus. Maecenas volutpat aliquam ligula, 
a venenatis elit pretium nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',2)







