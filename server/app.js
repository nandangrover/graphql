const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors= require('cors');

const app = express();


const db = 'mongodb+srv://nandan:nandan123@gql-nandan.wc2bg.mongodb.net/gql-nandan?retryWrites=true&w=majority';

// Allow cross origin request
app.use(cors());


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
