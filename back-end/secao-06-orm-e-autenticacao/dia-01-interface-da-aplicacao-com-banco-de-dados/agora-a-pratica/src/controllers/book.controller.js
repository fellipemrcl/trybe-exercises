const BookService = require("../services/book.service");

const error404Message = "Book not found!";
const error500Message = "Something went wrong!";
const successfullyUpdatedMessage = "Book successfully updated!";
const successfullyDeletedMessage = "Book successfully deleted!";

const getByAuthor = async (req, res) => {
  try {
    const { author } = req.query;
    const books = await BookService.getByAuthor(author);

    if (!books) return res.status(404).json({ message: error404Message });

    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);

    if (!book) return res.status(404).json({ message: error404Message });

    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const getAll = async (req, res) => {
  try {
    const { author } = req.query;
    let books;

    if (author) {
      books = await BookService.getByAuthor(author);
    } else {
      books = await BookService.getAll();
    }
    return res.status(200).json(books);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, pageQuantity, publisher } = req.body;
    const newBook = await BookService.createBook(title, author, pageQuantity, publisher);

    return res.status(201).json(newBook);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, pageQuantity, publisher } = req.body;
    const { id } = req.params;
    const updatedBook = await BookService.updateBook(
      id,
      title,
      author,
      pageQuantity,
      publisher
    );

    if (!updatedBook) return res.status(404).json({ message: error404Message });

    return res.status(200).json({ message: successfullyUpdatedMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await BookService.deleteBook(id);

    return res.status(200).json({ message: successfullyDeletedMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: successfullyDeletedMessage });
  }
};

module.exports = {
  createBook,
  deleteBook,
  getAll,
  getByAuthor,
  getById,
  updateBook,
};
