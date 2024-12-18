import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//Get the current directory path
const _dirname = dirname(fileURLToPath(import.meta.url));

//Iinitialise express, set port to 3000
const app = express();
const port = 3000;

// New client set up
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books2",
    password: "123456!",
    port: 5432,
  });

// Conect to database
db.connect();

//MIDDLEWEAR
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//FUNCTIONS

//Fecth and save book cover
async function fetchSaveCover(isbn){
  //API url cover
  const url=`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  const fileName=isbn;
  const imagePath= `/public/assets/images/covers/${fileName}.jpg`;
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const fileStream = fs.createWriteStream(_dirname + imagePath);
    // Pipe the image data from the API response to the file stream.
    response.data.pipe(fileStream); 
    console.log(`Image saved: ${fileName}.jpg`);
  } catch (error) {
    console.log("Error fetching or saving cover: ", error); 
  }
}

// Get all books from database
async function getAllBooks(){
  const books=await db.query("SELECT * FROM books;");
  return books.rows;
}

//Get date 
function getDate(date){
  let day = ("0" + date.getDate()).slice(-2);  //Get day
  let month = ("0" + (date.getMonth() + 1)).slice(-2);// get current month
  let year = date.getFullYear(); // get current year
  let shorter_Date=(year + "-" + month + "-" + day);
  return shorter_Date;
}

// Fetch notes from database.
async function fetchNotes(id) {
  try { 
      // Database query selecting relevant columns.
      const result = await db.query(
          'SELECT notes.id, notes.book_id, isbn, title, author, description,  rating, image_path, date_read, notes.note FROM books LEFT JOIN notes ON books.id = notes.book_id WHERE books.id = $1 ORDER BY notes.id DESC', [id]); 
          return result.rows;
  } catch (error) {
      console.error('Error fetching notes:', error);
  }
}

// Format data.
function formatData(data) {
  if (data[0].description || data[0].review || data[0].note) {

      data.forEach((item) => {
          // Format description
          if (item.description) {
              item.description = item.description.replace(/<br>/g, ''); // Remove existing <br> tags
              if (item.description.includes('\n')) {
                  item.description = item.description.split('\n').join('<br>'); // Replace newline characters
              }
            }
          // Format review
          if (item.review) {
        
              item.review = item.review.replace(/<br>/g, '');
              if (item.review.includes('\n')) {
                
                  item.review = item.review.split('\n').join('<br>');
              }
          }
          // Format note
          if (item.note) {
            console.log("note");
              item.note = item.note.replace(/<br>/g, '');
              if (item.note.includes('\n')) {
                console.log(" nested note");
                  item.note = item.note.split('\n').join('<br>');
              }
          }
      });
  } 
  return data;
}

//Function to delete isbn
function deleteImage(isbn){
  var filePath = `/public/assets/images/covers/${isbn}.jpg`; 
  console.log(filePath);
  //Delete file if exists 
  try {
    fs.unlinkSync(_dirname+filePath);
  }
  catch(err){
    console.log(err);
  }
}


//GET home page
app.get("/", async (req, res) => {   
  let result=await getAllBooks();
  const formattedbooks=formatData(result);
      res.render("index.ejs", {books:formattedbooks});
  });

//ADD NEW BOOK
//GET  new book form page
 app.get("/newBook", (req,res) => {
  res.render("new.ejs");
});

//POST request for new book.
app.post("/newBook/add", async (req, res) => {
  const newEntry = req.body; // Request data from html form
  const ISBN=req.body.isbn.trim();
  fetchSaveCover(ISBN); // Pass ISBN trimed
  const imagePath = `assets/images/covers/${ISBN}.jpg`; // Create a book cover image path for saving to database.
  const timeStamp = getDate(new Date()); // Create timestamp for the log entry.
  try {
      // Save everything to database.
      await db.query('INSERT INTO books (isbn, title, author, description, rating, image_path, date_read, review) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [   ISBN,
              newEntry.title,
              newEntry.author,
              newEntry.description,
              newEntry.rating,
              imagePath,
              timeStamp,
              newEntry.review
          ]);
      //Redirect to the home page
      res.redirect('/')
  } catch (error) {
      console.log(error);
  }
});

// DELETE BOOK 
// Handle POST route for '/delete/book/:id' to delete a book and its notes.
app.post('/books/:bookId/delete', async (req, res) => {
  const deleteBookId = req.params.bookId;
  try {
     const response= await db.query('SELECT isbn FROM books WHERE id= $1',
     [deleteBookId]); 
     const isbn=response.rows[0].isbn;
     //Delete image from Public folder
     deleteImage(isbn);
     //Delete notes from db 
     await db.query('DELETE FROM notes WHERE book_id = $1', [deleteBookId]);
    //Delete book from database
     await db.query('DELETE FROM books WHERE id = $1', [deleteBookId]);
     //Redirect homepage
     res.redirect('/');
  } catch (error) {
     console.log(error);
  }
 });

//BOOK NOTES
//GET route to display notes for a specific book.
app.get('/notes/:bookId', async (req, res) => {
  // Request book id from html parmeters
  const bookId = req.params.bookId;
  console.log(bookId);
  try {
      //Fetch notes for the specified book id.
      const notes = await fetchNotes(bookId); 
      //Format notes.
      const formattedNotes = formatData(notes); 
      console.log("formated note:"+JSON.stringify(formattedNotes,null,4));
      //Render notes
      res.render('notes.ejs', { 
        book: formattedNotes, 
        bookId:bookId
      });
    } catch (error) {
      console.log(error);
  }
});

// POST request to add new notes.
app.post('/notes/:bookId/add', async (req, res) => {
  // request book id from html parmeters
  const bookId = req.params.bookId; 
  //Request new note content from html parametres
  const note = req.body.newNote;
  // Pass the note to server and save to database using the book id.
  try {
      await db.query('INSERT INTO notes (note, book_id) VALUES ($1, $2)', [note, bookId]);
      //Reload page with new information.
      res.redirect(`/notes/${bookId}`); 
  } catch (error) {
      console.log(error);
  }
});

//POST request to update a note.
app.post('/notes/:noteId/update', async (req, res) => {
  const updatedNote = req.body.noteToUpdate;
  const updateNoteId = req.params.noteId;
  const bookId = req.body.bookId;
  // Pass note id, note and book id to server and query database to update the note.
  try {
      await db.query('UPDATE notes SET note = ($1) WHERE id = $2', [updatedNote, updateNoteId]);
      res.redirect(`/notes/${bookId}`);
  } catch (error) {
      console.log(error);
  }
});

//POST request to delete a note.
app.post('/notes/:noteId/delete', async (req, res) => {
  const deleteNoteId = req.params.noteId;
  const bookId = req.body.bookId;
  // Pass note id and book id to server and query database to delete the note using the note id.
  try {
     await db.query('DELETE FROM notes WHERE id = $1', [deleteNoteId]);
     res.redirect(`/notes/${bookId}`);
  } catch (error) {
     console.log(error);
  }
 });


//BOOK SORTERS
//Sort books by title, rating or date read
app.get("/book" ,async (req,res)=>{
  const currentSortOption = req.query.sort; 
  let result = null;

  try {
      // Sort the books using ORDER BY according to link clicked.
      if (currentSortOption === undefined || currentSortOption === 'title') {
        console.log("sorting by title");
          result = await db.query(
              'SELECT * FROM books ORDER BY title ASC');
      }
      else if (currentSortOption === 'date') {
          result = await db.query(
              'SELECT * FROM books ORDER BY date_read DESC');
      }
      else if (currentSortOption === 'rating') {
          result = await db.query(
              'SELECT * FROM books ORDER BY rating DESC');
      }
      
      // Format the book details, replacing newline characters with <br> tags.
      const formattedDetails = formatData(result.rows); 
     
      // Render home page with sorted date 
      res.render('index.ejs', { books: formattedDetails, sortOption: currentSortOption }); 
  } catch (error) {
      console.log(error);
  }

});

//SET UP PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
