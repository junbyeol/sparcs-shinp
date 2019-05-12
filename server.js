const express = require('express');
const app = express();

app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.set('views',__dirname+'/public/views');
app.engine('html',require('ejs').renderFile);

app.get('/',(req,res) => {
    res.render('login.html');
});

const server = app.listen(8000, () => {
    console.log('server is running at port 8000');
})