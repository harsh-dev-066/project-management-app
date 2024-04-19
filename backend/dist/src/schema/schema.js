"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Project type
const ProjectType = new graphql_1.GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return prisma.client.findUnique({
                    where: {
                        id: parent.id,
                    },
                });
            },
        },
    }),
});
// Client type
const ClientType = new graphql_1.GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
    }),
});
const RootQyery = new graphql_1.GraphQLObjectType({
    name: "RootQyeryType",
    fields: {
        projects: {
            type: new graphql_1.GraphQLList(ProjectType),
            resolve(parent, args) {
                return prisma.project.findMany();
            },
        },
        project: {
            type: ProjectType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return prisma.project.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
        clients: {
            type: new graphql_1.GraphQLList(ClientType),
            resolve(parent, args) {
                return prisma.client.findMany();
            },
        },
        client: {
            type: ClientType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return prisma.client.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
    },
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQyery,
});
exports.default = schema;
