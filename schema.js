const fetch = require('node-fetch');
const util = require('util');
const xml2jsParser  = require('xml2js').parseString;
const parseXML = util.promisify(xml2jsParser);
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');

const BookType = new GraphQLObjectType({
    name:'Book',
    description:'...',
    fields:() => ({
                title:{ type: GraphQLString,
                resolve:xml => xml.title[0]
            },
            isbn:{ 
                type: GraphQLString,
                resolve:xml => xml.isbn[0]
            }
    })
})

const AuthorType = new GraphQLObjectType({
     name: 'Author',
     description:'...',
     fields: ()=> ({
        name:{ 
            type: GraphQLString, 
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books:{
            type: new GraphQLList(BookType),
            resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
        }         
     }) 
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:'query',
        description:'...',
        fields:() => ({
            author: {
                type:AuthorType,
                args:{
                    id: { type: GraphQLInt }
                },
                resolve:(root, args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=r6riWFRC2BciUodJErUhdQ`
                ).then(response => response.text())
                .then(parseXML)
            }
        })
    })
})