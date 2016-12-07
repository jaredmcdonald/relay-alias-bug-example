import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLUnionType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const URLRequiredType = new GraphQLObjectType({
  name: 'URLRequired',
  isTypeOf(item) {
    return item.type === 1;
  },
  fields: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const URLNotRequiredType = new GraphQLObjectType({
  name: 'URLNotRequired',
  isTypeOf(item) {
    return item.type === 2;
  },
  fields: {
    url: {
      type: GraphQLString,
    },
  },
});

const ContentUnionType = new GraphQLUnionType({
  name: 'ContentUnion',
  types: [URLRequiredType, URLNotRequiredType],
});

const HomeType = new GraphQLObjectType({
  name: 'Home',
  fields: {
    content: {
      type: new GraphQLList(ContentUnionType),
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    home: {
      type: HomeType,
      resolve: () => ({
        content: [
          { type: 1, url: 'https://www.google.com' },
          { type: 2, url: 'https://www.yahoo.com' },
        ],
      })
    },
  },
});

const Schema = new GraphQLSchema({ query: QueryType });

export default Schema;
