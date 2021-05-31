import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import { IShoppingKartItem } from './types';

declare module 'express-session' {
  export interface SessionData {
    kartItems: IShoppingKartItem[];
  }
}
// Email verification regex.
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
app.use((_req, res, next) => {
  // I HATE CORS!!!!
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/api/checkout', (req, res) => {
  const resJson = {
    invalid: []
  };
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  if (typeof firstname !== 'string' || firstname.length < 2) {
    resJson.invalid.push('Vorname');
  }
  if (typeof lastname !== 'string' || lastname.length < 2) {
    resJson.invalid.push('Nachname');
  }
  if (typeof email !== 'string' || !email.match(EMAIL_REGEXP)) {
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
  const id = +req.params.id;
  let alreadyIsInKart = false;
  req.session.kartItems.forEach((kartItem: IShoppingKartItem) => {
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
  const id = +req.params.id;
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

app.use(express.static(path.join(__dirname, '../dist/BBZWGucciStore')));

app.use((_req: any, res: { sendFile: (arg0: string) => void; }) => {
  res.sendFile(path.join(__dirname, '../dist/BBZWGucciStore', 'index.html'));
});
app.listen(3000, () => {
  console.log('Der Gucci-Store ist verfügbar unter "http://localhost:3000"');
});
