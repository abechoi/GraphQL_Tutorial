const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
   } = graphql;

// dummy data
/*
var books = [
  {name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '5f31438d7be9dbacc5940c8a'},
  {name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '5f3143967be9dbacc5940c8b'},
  {name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '5f3143a67be9dbacc5940c8c'},
  {name: 'The Heroes of Ages', genre: 'Fantasy', id: '4', authorId: '5f3143967be9dbacc5940c8b'},
  {name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '5f3143a67be9dbacc5940c8c'},
  {name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '5f3143a67be9dbacc5940c8c'}
];
var authors = [
  {name: 'Patrick Rothfuss', age: 44, id: '1'},
  {name: 'Brandon Sanderson', age: 42, id: '2'},
  {name: 'Terry Pratchett', age: 66, id: '3'}
];
*/

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: {
      type: AuthorType,
      resolve(parent, args){
        console.log(parent);
        //return _.find(authors, {id: parent.authorId});
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        console.log(parent);
        //return _.filter(books, { authorId: parent.id});
        return Book.find({authorId: parent.id});
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from db / other source
        console.log(typeof(args.id));
        //return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        //return _.find(authors, {id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        //return books;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        //return authors;
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
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
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query:RootQuery,
  mutation:Mutation
});