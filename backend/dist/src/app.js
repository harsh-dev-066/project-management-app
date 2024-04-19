"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("graphql-http/lib/use/express");
const schema_1 = __importDefault(require("./schema/schema"));
const { ruruHTML } = require("ruru/server");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Create and use the GraphQL handler.
app.all("/graphql", (0, express_2.createHandler)({
    schema: schema_1.default,
    // rootValue: root,
}));
// Serve the GraphiQL IDE.
if (process.env.NODE_ENV === "development") {
    app.get("/", (_req, res) => {
        res.type("html");
        res.end(ruruHTML({ endpoint: "/graphql" }));
    });
}
exports.default = app;
