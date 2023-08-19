const UserService = require("../services/user.service");

const error500Message = "Algo deu errado";
const error404Message = "Usuário não encontrado";
const successfullyUpdatedMessage = "Usuário atualizado com sucesso!";
const successfullyDeletedMessage = "Usuário excluído com sucesso!";

const getAll = async (_req, res) => {
  try {
    const users = await UserService.getAll();
    return res.status(200).json(users);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: error500Message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getById(id);

    if (!user) return res.status(404).json({ message: error404Message });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const getByIdAndEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    const user = await UserService.getByIdAndEmail(id, email);

    if (!user) return res.status(404).json({ message: error404Message });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNum } = req.body;
    const newUser = await UserService.createUser(fullName, email, phoneNum);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const { id } = req.params;
    const updatedUser = await UserService.updateUser(id, fullName, email);

    if (!updatedUser) return res.status(404).json({ message: error404Message });

    return res.status(200).json({ message: successfullyUpdatedMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);

    return res.status(200).json({ message: successfullyDeletedMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error500Message });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getAll,
  getById,
  getByIdAndEmail,
  updateUser,
};
