const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateHashTags = async (texto) => {
  try {
    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Gere EXATAMENTE 3 hashtags focadas no engajamento para o seguinte texto. É OBRIGATÓRIO retornar 3 hashtags. Retorne apenas as palavras com # separadas por espaço. Texto: "${texto}"`;

    const result = await model.generateContent(prompt);
    const textoPuro = result.response.text().trim();
    
    // Extrai todas as hashtags corretamente independentemente de como a IA retornar
    let arrayDeHashtags = textoPuro.match(/#[^\\s#]+/g) || [];
    
    // Garantir que sempre existam exatamente 3 hashtags (preenche com fallbacks se faltar)
    const fallbacks = ['#HashTalk', '#B2B', '#Networking', '#Inovacao', '#Tecnologia'];
    while (arrayDeHashtags.length < 3) {
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (!arrayDeHashtags.includes(randomFallback)) {
        arrayDeHashtags.push(randomFallback);
      }
    }
    
    // Se a IA retornar mais que 3, corta para exatamente 3
    return arrayDeHashtags.slice(0, 3);
  } catch (error) {
    console.error("Erro na API do Gemini, usando hashtags de fallback:", error.message);
    return ['#HashTalk', '#B2B', '#Networking'];
  }
};

module.exports = { generateHashTags };
