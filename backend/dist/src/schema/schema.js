"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Project type
const ProjectType = new graphql_1.GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return prisma.client.findUnique({
                    where: {
                        id: parent.clientId,
                    },
                });
            },
        },
        clientId: { type: graphql_1.GraphQLString },
    }),
});
// Client type
const ClientType = new graphql_1.GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
    }),
});
// Quries
const RootQyery = new graphql_1.GraphQLObjectType({
    name: "RootQyeryType",
    fields: {
        // get all projects
        projects: {
            type: new graphql_1.GraphQLList(ProjectType),
            resolve(parent, args) {
                return prisma.project.findMany();
            },
        },
        // get project by id
        project: {
            type: ProjectType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return prisma.project.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
        // get all clients
        clients: {
            type: new graphql_1.GraphQLList(ClientType),
            resolve(parent, args) {
                return prisma.client.findMany();
            },
        },
        // get client by id
        client: {
            type: ClientType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return prisma.client.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
        // get all projects of a client
        projectsByClientId: {
            type: new graphql_1.GraphQLList(ProjectType),
            args: { clientId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, { clientId }) {
                return prisma.project.findMany({
                    where: {
                        clientId: clientId,
                    },
                });
            },
        },
    },
});
const ProjectStatusEnumType = new graphql_1.GraphQLEnumType({
    name: "ProjectStatusEnum",
    values: {
        InProgress: { value: "InProgress" },
        Completed: { value: "Completed" },
        OnHold: { value: "OnHold" },
        Cancelled: { value: "Cancelled" },
    },
});
const ProjectStatusUpdateEnumType = new graphql_1.GraphQLEnumType({
    name: "ProjectStatusUpdateEnum",
    values: {
        InProgress: { value: "InProgress" },
        Completed: { value: "Completed" },
        OnHold: { value: "OnHold" },
        Cancelled: { value: "Cancelled" },
    },
});
// Mutations
const mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        // add client
        addClient: {
            type: ClientType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                phone: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return prisma.client.create({
                    data: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    },
                });
            },
        },
        // delete client by id
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                return prisma.client.delete({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
        // create project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                status: { type: new graphql_1.GraphQLNonNull(ProjectStatusEnumType) },
                clientId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(_, { name, description, status, clientId }) {
                console.log({ clientId });
                try {
                    const newProject = prisma.project.create({
                        data: {
                            name,
                            description,
                            status,
                            clientId,
                        },
                    });
                    return newProject;
                }
                catch (error) {
                    // Handle error
                    console.error("Error creating project:", error);
                    throw new Error("Failed to create project");
                }
            },
        },
        // delete project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                return prisma.project.delete({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
        // delete multiple projects
        deleteMultipleProject: {
            type: new graphql_1.GraphQLList(ProjectType),
            args: {
                ids: { type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLID)) },
            },
            resolve(parent, { ids }) {
                return Promise.all(ids.map((id) => prisma.project.delete({
                    where: { id },
                })));
            },
        },
        // update project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                name: { type: graphql_1.GraphQLString },
                description: { type: graphql_1.GraphQLString },
                status: { type: ProjectStatusUpdateEnumType },
            },
            resolve(_, { id, name, description, status }) {
                return prisma.project.update({
                    where: {
                        id,
                    },
                    data: {
                        name,
                        description,
                        status,
                    },
                });
            },
        },
    },
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQyery,
    mutation,
});
exports.default = schema;
