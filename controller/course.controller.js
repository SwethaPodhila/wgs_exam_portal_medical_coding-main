const Course = require('../model/course.model');

exports.createCourse = async (req, res) => {
	try {
		const {course_name} = req.body;
		const course = await Course.create({course_name});
		res.status(201).json(course);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
}

exports.getAllCourses = async (req, res) => {
	try {
		const courses = await Course.findAll();
		res.json(courses);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
}

exports.getCourseById = async (req, res) => {
	try {
		const {id} = req.params;
		const course = await Course.findByPk(id);
		if (!course) {
			return res.status(404).json({message: 'Course not found'});
		}
		res.json(course);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
}

exports.updateCourse = async (req, res) => {
	try {
		const {id} = req.params;
		const {course_name} = req.body;
		const course = await Course.findByPk(id);
		if (!course) {
			return res.status(404).json({message: 'Course not found'});
		}
		await course.update({course_name});
		res.json(course);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
}

exports.deleteCourse = async (req, res) => {
	try {
		const {id} = req.params;
		const course = await Course.findByPk(id);
		if (!course) {
			return res.status(404).json({message: 'Course not found'});
		}
		await course.destroy();
		res.json({message: 'Course deleted successfully'});
	} catch (err) {
		res.status(500).json({message: err.message});
	}
}