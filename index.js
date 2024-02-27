const Koa = require('koa');
const app = new Koa();

const authors = require('./routes/authors.js')
const books = require('./routes/books.js');
const genres = require('./routes/genres.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/users.js');
const special = require('./routes/special.js')

app.use(authors.routes());
app.use(books.routes());
app.use(genres.routes());
app.use(reviews.routes());
app.use(users.routes());
app.use(special.routes());

let port = process.env.PORT || 3000;

app.listen(port);

