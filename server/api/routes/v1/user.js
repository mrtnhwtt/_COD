const express = require('express');
const router = express.Router();

const service = require('../../services/v1/user');

const security = require('../../middlewares/security');

router.get('/:id', security.checkJWT, service.getById);

router.put('/add', service.add);

router.patch('/update', security.checkJWT, service.update);

router.delete('/delete', security.checkJWT, service.delete);

router.post('/auth', service.auth);

module.exports = router;