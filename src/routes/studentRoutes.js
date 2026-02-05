const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/create', studentController.getCreateForm);
router.post('/create', studentController.createStudent);
router.get('/edit/:id', studentController.getEditForm);
router.post('/edit/:id', studentController.updateStudent);
router.post('/delete/:id', studentController.deleteStudent);

module.exports = router;
