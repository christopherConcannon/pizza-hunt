const router = require('express').Router();
const htmlRoutes = require('./html/html-routes');

router.use('/', htmlRoutes);

// non-existent routes 404
router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
