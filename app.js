const express = require("express");
      app = express();
      bodyParser = require("body-parser");
      mongoose = require("mongoose");

mongoose.connect('mongodb+srv://Mayixa:flingan95@mayixa-avcru.azure.mongodb.net/blog?retryWrites=true&w=majority', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to mongoDB!')
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// mongoose config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const blog = mongoose.model('blog', blogSchema)

// restful routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
    blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        };
    });
});

app.get('/blogs/new', (req, res) => {
    res.render('new');
});

app.post('/blogs', (req, res) => {
    blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        };
    });
});

app.get('/blogs/:id', (req, res) => {
    blog.findById(req.params.id, (err, blogFound) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: blogFound});
        };
    });
});

app.get('/blogs/:id/edit', (req, res) => {
    blog.findById(req.params.id, (err, blogFound) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: blogFound});
        };
    });
});


// localhost
app.listen(3000, () => {
    console.log('Blog Server Started');
});