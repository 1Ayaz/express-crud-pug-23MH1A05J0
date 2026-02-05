const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.render('index', { title: 'Student List', students });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Show create form
exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Add New Student' });
};

// Create student
exports.createStudent = async (req, res) => {
    try {
        await Student.create(req.body);
        res.redirect('/');
    } catch (error) {
        res.status(400).render('create', {
            title: 'Add New Student',
            error: error.message,
            student: req.body
        });
    }
};

// Show edit form
exports.getEditForm = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.render('edit', { title: 'Edit Student', student });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.redirect('/');
    } catch (error) {
        const student = await Student.findById(req.params.id);
        res.status(400).render('edit', {
            title: 'Edit Student',
            error: error.message,
            student: { ...req.body, _id: req.params.id }
        });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error.message);
    }
};
