import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import { IShoppingKartItem } from './types';
// Original angular email validation regex.
// tslint:disable-next-line: max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const app = express();
const sess = {
  secret: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess));
app.use((req, res, next) => {
  // I HATE CORS!!!!
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/api/checkout', (req, res) => {
  const resJson = {
    invalid: []
  };
  if (typeof req.query.firstname !== 'string' || req.query.length < 2) {
    resJson.invalid.push('Vorname');
  }
  if (typeof req.query.lastname !== 'string' || req.query.length < 2) {
    resJson.invalid.push('Nachname');
  }
  if (typeof req.query.email !== 'string' || !req.query.email.match(EMAIL_REGEXP)) {
    resJson.invalid.push('E-Mail');
  }

  res.send(JSON.stringify(resJson));
});
app.get('/api/shoppingKart', (req, res) => {
  if (!req.session.kartItems) {
    req.session.kartItems = [];
  }
  res.send(JSON.stringify(req.session.kartItems));
});
app.get('/api/shoppingKart/add/:id', (req, res) => {
  if (!req.session.kartItems) {
    req.session.kartItems = [];
  }
  const id = req.params.id;
  let alreadyIsInKart = false;
  req.session.kartItems.forEach(kartItem => {
    if (kartItem.productId === id) {
      kartItem.count += 1;
      alreadyIsInKart = true;
    }
  });
  if (!alreadyIsInKart) {
    const productToAdd: IShoppingKartItem = {
      count: 1,
      productId: id
    };
    req.session.kartItems.push(productToAdd);
  }
  res.send('1');
});
app.get('/api/shoppingKart/remove/:id', (req, res) => {
  if (!req.session.kartItems) {
    req.session.kartItems = [];
  }
  const id = req.params.id;
  req.session.kartItems.forEach((kartItem, index, array) => {
    if (kartItem.productId === id) {
      kartItem.count -= 1;
      if (kartItem.count < 1) {
        console.log(kartItem.count, index, array);
        array.splice(index, 1);
      }
    }
  });
  res.send('1');
});
app.get('/api/shoppingKart/reset', (req, res) => {
  req.session.kartItems = [];
  res.send('1');
});
// app.get('/api/price')


app.use(express.static(path.join(__dirname, '../dist/BBZWGucciStore')));

// app.use('/data', < your route file > );
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/BBZWGucciStore', 'index.html'));
});
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
