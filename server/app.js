const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();


const db = 'mongodb://nandan:nandan123@ds011258.mlab.com:11258/gql-nandan';


mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDb connected ...')
  })
  .catch(err => console.log(err));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now listening to port 4000'))