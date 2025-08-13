import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (error, files) => {
        res.render("index", { file: files });
    });
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description, (err) => {
        res.redirect('/');
    });
});

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        res.render('show', { desc: data, filename: req.params.filename.replace('.txt', '') })
    })
})

app.get('/edit/:editname', (req, res) => {
    res.render("edit", { editname: req.params.editname });
})

app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}.txt`, (err) => {
          res.redirect('/');
    })
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
