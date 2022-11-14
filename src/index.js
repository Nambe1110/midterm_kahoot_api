import express from 'express';
import morgan from 'morgan';

import {createRoles} from './libs/initialSetup.js';

import './database.js'
const app = express();
createRoles();


app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.json());

import route from './routes/index.js'
route(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

