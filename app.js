require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.status(200).send("Routing Server started !!!");
});

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}...`);
});