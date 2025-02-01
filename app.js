require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter');
const product = require('./routes/product')


const db = require('./config/mongodb.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
db.connect();

app.use("/users",usersRouter);
app.use("/product",product);

const PORT=5000;//process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}...`);
});