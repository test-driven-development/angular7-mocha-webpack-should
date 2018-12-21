import express from 'express';
import multer from 'multer';

const router = express.Router();
const UPLOADS = './uploads/';
const upload = multer({dest: UPLOADS}).single('file');

router.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(422).send("error")
    }

    console.log(req.file);
    console.log(req.file.path);
    console.log(req.file.originalname);

    return res.status(201)
      .json({'message': 'success'});
  });
});

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);

app.all('*', (req, res) => {
  res.json({nook: false});
});

export default app;
