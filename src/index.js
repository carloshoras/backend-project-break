const express = require('express');
const app = express();
require('dotenv').config();
const { dbConnection } = require('./config/db.js');
const routes = require('./routes/productRoutes.js');
const methodOverride = require('method-override')
// const swaggerUI = require('swagger-ui-express')
// const docs = require('../docs/index')
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.static('public'));

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs))

app.use('/api', routes)

app.use('/', routes);

dbConnection();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));