let path = require('path');

let express = require('express');

const port = process.env.PORT || 8080;


let app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(port, (err) => {
    console.log('Server started on http://localhost:%s', port);
});