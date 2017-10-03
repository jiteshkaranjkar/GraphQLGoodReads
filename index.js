const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schema');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("Server is up and listening at 4000");
})