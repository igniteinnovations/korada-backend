import dotenv from "dotenv";

dotenv.config();

import { translateText } from "./src/utils/translate.js";

const test = async () => {
  const translated = await translateText("Hello Andhra Pradesh", "te");

  console.log(translated);
};

test();
