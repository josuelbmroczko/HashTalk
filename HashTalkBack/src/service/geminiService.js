const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateHashTags = async (texto) => {
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Extraia ou crie 3 hashtags focadas no engajamento para o seguinte texto. Retorne apenas as palavras com #. Texto: "${texto}"`;

  const result = await model.generateContent(prompt);
  const textoPuro = result.response.text().trim();
  const arrayDeHashtags = textoPuro.split('\n').filter(tag => tag.trim() !== '');
  
  return arrayDeHashtags;


};

module.exports = { generateHashTags };
