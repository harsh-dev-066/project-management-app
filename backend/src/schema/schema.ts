import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { PrismaClient } from "@prisma/client";
import { Project } from "../types/types";

const prisma = new PrismaClient();

// Project type
const ProjectType: any = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
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
    clientId: { type: GraphQLString },
  }),
});

// Client type
const ClientType: any = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Quries
const RootQyery = new GraphQLObjectType({
  name: "RootQyeryType",
  fields: {
    // get all projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return prisma.project.findMany();
      },
    },
    // get project by id
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
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
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return prisma.client.findMany();
      },
    },
    // get client by id
    client: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
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
      type: new GraphQLList(ProjectType),
      args: { clientId: { type: new GraphQLNonNull(GraphQLID) } },
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

const ProjectStatusEnumType = new GraphQLEnumType({
  name: "ProjectStatusEnum",
  values: {
    InProgress: { value: "InProgress" },
    Completed: { value: "Completed" },
    OnHold: { value: "OnHold" },
    Cancelled: { value: "Cancelled" },
  },
});

const ProjectStatusUpdateEnumType = new GraphQLEnumType({
  name: "ProjectStatusUpdateEnum",
  values: {
    InProgress: { value: "InProgress" },
    Completed: { value: "Completed" },
    OnHold: { value: "OnHold" },
    Cancelled: { value: "Cancelled" },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // add client
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
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
        id: { type: new GraphQLNonNull(GraphQLID) },
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(ProjectStatusEnumType) },
        clientId: { type: new GraphQLNonNull(GraphQLString) },
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
        } catch (error) {
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
        id: { type: new GraphQLNonNull(GraphQLID) },
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
      type: new GraphQLList(ProjectType),
      args: {
        ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
      },
      resolve(parent, { ids }) {
        return Promise.all(
          ids.map((id: string) =>
            prisma.project.delete({
              where: { id },
            })
          )
        );
      },
    },
    // update project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
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

const schema = new GraphQLSchema({
  query: RootQyery,
  mutation,
});

export default schema;
