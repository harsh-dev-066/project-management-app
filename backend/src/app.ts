import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./schema/schema";
const { ruruHTML } = require("ruru/server");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    // rootValue: root,
  })
);

// Serve the GraphiQL IDE.
if (process.env.NODE_ENV === "development") {
  app.get("/", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });
}

export default app;
