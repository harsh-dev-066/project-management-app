import * as dotenv from "dotenv";
dotenv.config();
import app from "./src/app";

const startApp = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
};

startApp();
