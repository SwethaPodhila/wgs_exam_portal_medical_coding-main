const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');
const Course = require('./course.model')

const Exam = sequelize.define('Exam', {
	exam_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	exam_name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	course_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	}
}, {
	tableName: 'exams',
	timestamps: false,
	underscored: true
});

Exam.belongsTo(Course, {foreignKey: 'course_id', as: 'Course'});

module.exports = Exam;
