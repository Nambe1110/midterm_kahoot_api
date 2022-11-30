import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { createRoles } from './libs/initialSetup.js';
import './modules/passport.js'
import './database.js'
const app = express();
createRoles();

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: ["SEKRIT3", "SEKRIT2", "SEKRIT1"]
    })
);

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());   
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

import route from './routes/index.js'
route(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

