const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

// dummy data
var books = [
  { name: 'Name of the wind1', genre: 'Fantasy1', id: '1', authorid: '1'},
  { name: 'Name of the wind2', genre: 'Fantasy2', id: '2', authorid: '2'},
  { name: 'Name of the wind3', genre: 'Fantasy3', id: '3', authorid: '3'},
  { name: 'Name of the wind4', genre: 'Fantasy4', id: '4', authorid: '2'},
  { name: 'Name of the wind5', genre: 'Fantasy5', id: '5', authorid: '3'},
  { name: 'Name of the wind6', genre: 'Fantasy6', id: '6', authorid: '2'},
  { name: 'Name of the wind7', genre: 'Fantasy7', id: '7', authorid: '1'},
]

var authors = [
  { name: 'Nandan Grover 1', age: 63, id: '1'},
  { name: 'Nandan Grover 2', age: 42, id: '2'},
  { name: 'Nandan Grover 3', age: 23, id: '3'},
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    genre: { type: GraphQLString },
    author:{
      type: AuthorType,
      resolve: (parent, args) => _.find(authors, { id: parent.authorid }),
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => _.filter(books, { authorid: parent.id })
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve: (parent, args) => _.find(books, { id: args.id }),
    },
    author: {
      type: AuthorType,
      args: {id: { type: GraphQLID }},
      resolve: (parent, args) => _.find(authors, { id: args.id }),
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args) => authors,
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
    type: AuthorType,
    args: {
      name: { type: GraphQLString },
      age: { type: GraphQLInt }
    },
    resolve: (parent, args) => {
      let author = new Author({
        name: args.name,
        age: args.age
      });
      return author.save();
    }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID},
      },
      resolve: (parent, args) => {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});