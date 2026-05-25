import axios from "axios";

export const translateText = async (text, targetLanguage) => {
  try {
    if (!text) return "";

    const response = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      null,
      {
        params: {
          q: text,

          source: "en",

          target: targetLanguage,

          format: "text",

          key: process.env.GOOGLE_TRANSLATE_API_KEY,
        },
      },
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation Error:", error.response?.data || error.message);

    return text;
  }
};
