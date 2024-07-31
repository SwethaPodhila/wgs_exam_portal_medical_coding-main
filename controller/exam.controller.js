const Exam = require('../model/exam.model');

exports.createExam = async (req, res) => {
	try {
		const {exam_name, course_id} = req.body;
		const exam = await Exam.create({exam_name, course_id});
		res.status(201).json(exam);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
};

exports.getAllExams = async (req, res) => {
	try {
		const exams = await Exam.findAll({
			include: 'Course' 
		});
		res.json(exams);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.getExamById = async (req, res) => {
	try {
		const {id} = req.params;
		const exam = await Exam.findByPk(id, {
			include: 'Course' // Assuming you have a relation named 'Course' in your model
		});
		if (!exam) {
			return res.status(404).json({message: 'Exam not found'});
		}
		res.json(exam);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.updateExam = async (req, res) => {
	try {
		const {id} = req.params;
		const {exam_name, course_id} = req.body;
		const exam = await Exam.findByPk(id);
		if (!exam) {
			return res.status(404).json({message: 'Exam not found'});
		}
		await exam.update({exam_name, course_id});
		res.json(exam);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
};

exports.deleteExam = async (req, res) => {
	try {
		const {id} = req.params;
		const exam = await Exam.findByPk(id);
		if (!exam) {
			return res.status(404).json({message: 'Exam not found'});
		}
		await exam.destroy();
		res.json({message: 'Exam deleted successfully'});
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.getExamsByCourse = async (req, res) => {
	try {
		const {course_id} = req.params;
		const exams = await Exam.findAll({
			where: {course_id}
		});

		res.json(exams);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

