const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

//parsers
app.use(express.json());
app.use(express.urlencoded({encoded: true}));
app.use(express.static(path.join(__dirname, 'public'))); //for every request
//find the static files here in this public folder
app.set('view engine', 'ejs'); //backend renders ejs pages

//directing user details into specified folder
app.get("/", function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render("index.ejs", {files: files});
    })
});


//displaying user details
app.get("/file/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    })
});

//Updating user details
app.get("/edit/:filename", function(req, res){
    res.render('edit', {filename: req.params.filename});
});

app.post("/edit/", function(req, res){
   fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, function(err){
        res.redirect("/")
   })
});

app.post('/create', function(req, res) {
    const filename = req.body.title.split(' ').join('') + '.txt';
    const filepath = `./files/${filename}`;

    fs.writeFile(filepath, req.body.details, function(err) {
        if (err) {
            console.error("Error writing file:", err);
            res.status(500).send("Error writing file");
        } else {
            res.redirect("/"); // Redirects to the homepage after successful file creation
        }
    });
});



/*app.get("/profile/:username", function(req, res){
    res.send(`welcome, ${req.params.username}`);
});

app.get("/profile/:username/:age", function(req, res){
    res.send(`welocome, ${req.params.username} of age ${req.params.age}`);
}); */


/*********************Using query parameters*****************************
 

app.get("/:userdata", function(req, res) {
    const { FullName, UserName, Email, Password, ProductLink, ProductList } = req.query;

    let message = `Welcome, ${req.params.userdata}`;
    if (FullName) message += `, Full Name: ${FullName}`;
    if (UserName) message += `, Username: ${UserName}`;
    if (Email) message += `, Email: ${Email}`;
    if (Password) message += `, Password: ${Password}`;
    if (ProductLink) message += `, Product Link: ${ProductLink}`;
    if (ProductList) message += `, Wishlist: ${ProductList}`;

    res.send(message);
});
*/


app.listen(8080, function(){
    console.log("Functioning properly.");
});