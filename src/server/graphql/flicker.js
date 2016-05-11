/* eslint-disable max-len */
import config from '../config.js';
import fetch from 'isomorphic-fetch';
import { plural as pluralize } from 'pluralize';
import { List, fromJS } from 'immutable';

import {
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import {
  fromGlobalId,
  connectionFromArray,
  nodeDefinitions,
  connectionDefinitions,
} from 'graphql-relay';

import { mapToInternalType } from './mapper.js';


async function fetchResource(url) {
  const response = await fetch(url);
  if (response.status >= 400) {
    throw new Error('Resource unavailable!');
  }

  const text = await response.text();
  const toJson = text
    .replace(/^[^{]*/, '')
    .replace(/\)$/, '');
  return JSON.parse(toJson);
}

export async function getObjectsByType(type, subtype, args, selector = '', enforcePaginator = false) {
  const {
    page,
    pageSize,
  } = args;
  const skip = (page - 1) * pageSize;

  const plural = pluralize(type);
  const typeName = `${plural}.${subtype}`;
  const fullSelector = selector.split('.');
  const resourceURL = `https://www.flickr.com/services/rest/?method=flickr.${typeName}&format=json&api_key=${config.flickerKey}&page=${page}&per_page=${pageSize}`;
  const json = await fetchResource(resourceURL);
  const data = fromJS(json);
  const objects = data.getIn(fullSelector, List());

  return {
    objects: enforcePaginator
      ? objects
        .skip(skip)
        .take(pageSize)
        .toJS()
      : objects.toJS(),
    totalCount: data.getIn([fullSelector[0], 'total'], 0),
  };
}

export async function getObjectByType(type, subtype, idString) {
  const plural = pluralize(type);
  const typeName = `${plural}.${subtype}`;
  const resourceURL = `https://www.flickr.com/services/rest/?method=flickr.${typeName}&format=json&api_key=${config.flickerKey}&${idString}`;
  const json = await fetchResource(resourceURL);
  const wrapper = Object.keys(json)[0];

  return json[wrapper];
}

export function createRootListConnection(name, flickerType, flickerSubtype, graphQLType, dataFinder = '', enforcePaginator = false) {
  const plural = `${flickerType}s`;

  const { connectionType } = connectionDefinitions({
    name,
    nodeType: graphQLType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (c) => c.totalCount,
      },
      [plural]: {
        type: new GraphQLList(graphQLType),
        resolve: (c) => c.edges.map((e) => e.node),
      },
    }),
  });

  return {
    type: connectionType,
    args: {
      pageSize: {
        type: GraphQLInt,
        defaultValue: 15,
        description: 'Set page size.',
      },
      page: {
        type: GraphQLInt,
        defaultValue: 1,
        description: 'Set page number.',
      },
    },
    resolve: async (rootObject, args) => {
      const { objects, totalCount } = await getObjectsByType(flickerType, flickerSubtype, args, dataFinder, enforcePaginator);

      return {
        ...connectionFromArray(objects, args),
        totalCount,
      };
    }
  };
}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type } = fromGlobalId(globalId);
    return type;
  },
  (type) => mapToInternalType(type)
);

export { nodeInterface, nodeField };
