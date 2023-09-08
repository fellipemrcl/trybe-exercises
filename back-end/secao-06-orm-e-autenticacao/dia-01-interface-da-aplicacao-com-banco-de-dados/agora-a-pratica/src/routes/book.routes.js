const route = require("express").Router();
const { bookController } = require("../controllers");

route.get("/", bookController.getAll);

route.post("/", bookController.createBook);

route.get("/:id", bookController.getById);

route.put("/:id", bookController.updateBook);

route.delete("/:id", bookController.deleteBook);

module.exports = route;
