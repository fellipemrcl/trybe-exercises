const fs = require("fs").promises;

const readCharacters = async () => {
  try {
    const data = await fs.readFile("simpsons.json", "utf8");
    const characters = JSON.parse(data);
    characters.forEach((character) => {
      console.log(`${character.id} - ${character.name}`);
    });
  } catch (error) {
    console.error("Erro na leitura do arquivo", error);
  }
};

const findCharacterById = async (id) => {
  try {
    const data = await fs.readFile("simpsons.json", "utf8");
    const characters = JSON.parse(data);
    const character = characters.find((char) => char.id == id);
    if (character) {
      return character;
    } else {
      throw new Error("id não encontrado");
    }
  } catch (error) {
    throw new Error("Erro na leitura do arquivo", error);
  }
};

const removeCharacters = async () => {
  try {
    const data = await fs.readFile('simpsons.json', 'utf8');
    const characters = JSON.parse(data);
    const filteredCharacters = characters.filter(char => char.id !== '6' && char.id !== '10');
    await fs.writeFile('simpsons2.json', JSON.stringify(filteredCharacters));
  } catch (error) {
    console.error('Erro na leitura do arquivo', error);
  }
};

const readAndWriteCharacter = async () => {
  try {
    const data = await fs.readFile('simpsons.json', 'utf8');
    const characters = JSON.parse(data);
    const filteredCharacters = characters.filter(char => parseInt(char.id) <= 4);
    await fs.writeFile('simpsonFamily.json', JSON.stringify(filteredCharacters));
  } catch (error) {
    console.error('Erro na leitura do arquivo', error);
  }

};

const createNelsonMuntz = async () => {
  try {
    const data = await fs.readFile('simpsonFamily.json', 'utf8');
    const characters = JSON.parse(data);
    const charToAdd = { id: '8', name: 'Nelson Muntz' };
    characters.push(charToAdd);
    await fs.writeFile('simpsonFamily.json', JSON.stringify(characters));
  } catch (error) {
    console.error('Erro na leitura do arquivo', error);
  }
};

const replaceNelsonWithMaggie = async () => {
  try {
    const data = await fs.readFile('simpsonFamily.json', 'utf8');
    let characters = JSON.parse(data);
    const charToReplace = { id: '5', name: 'Maggie Simpson' };
    characters = characters.map(char => char.id === '8' ? charToReplace : char);
    await fs.writeFile('simpsonFamily.json', JSON.stringify(characters));
  } catch (error) {
    console.error('Erro na leitura ou escrita do arquivo', error);
  }
}


// readCharacters();
// findCharacterById(1);
// removeCharacters();
// readAndWriteCharacter();
// createNelsonMuntz();
// replaceNelsonWithMaggie();