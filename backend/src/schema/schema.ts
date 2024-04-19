import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
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
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQyery = new GraphQLObjectType({
  name: "RootQyeryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return prisma.project.findMany();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return prisma.project.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return prisma.client.findMany();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
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

const schema = new GraphQLSchema({
  query: RootQyery,
});

export default schema;
