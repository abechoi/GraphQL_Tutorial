const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

// const dbURI = 'mongodb+srv://abechoi:[password]@cluster0.eoe0p.mongodb.net/[database]?retryWrites=true&w=majority';
const dbURI = 'mongodb+srv://abechoi:iwbiny319@cluster0.eoe0p.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to database...'); 
    app.listen(4000, () => {
      console.log('Listening to port:4000...');
    });
})
.catch((err) => console.log(err));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));