import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql';

const Application = new GraphQLObjectType({
  name: 'Application',
  description: '',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Application name',
      resolve: (app) => app.appName,
    },
    version: {
      type: GraphQLString,
      description: 'Application version',
      resolve: (app) => app.appVersion,
    },
  }
});

export default Application;
