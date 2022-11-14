import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useFindAndModify: true,
    // useCreateIndex: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err))