var express = require('express');
var router = express.Router();

const userRoute = require('./user');

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', async (req, res) => {
  res.status(200).json({
    name: 'API',
    version: '1.0',
    status: 200,
    message: 'Hi mom!'
  });
});

router.use('/users', userRoute);

module.exports = router;
