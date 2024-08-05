const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');
const Exam = require('./exam.model');

const Question = sequelize.define('Question', {
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	question_text: {
		type: DataTypes.TEXT,
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	option1: {
		type: DataTypes.TEXT,
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	option2: {
		type: DataTypes.TEXT,
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	option3: {
		type: DataTypes.TEXT,
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	option4: {
		type: DataTypes.TEXT,
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	correct_answer: {
		type: DataTypes.STRING(255),
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	marks: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	course_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	exam_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	explanation_text: {
		type: DataTypes.TEXT,
		allowNull: false, 
		collate: 'utf8_unicode_ci'
	},
	teacher_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	}
}, {
	tableName: 'questions',
	timestamps: false,
	underscored: true
});

Question.belongsTo(Exam, { foreignKey: 'exam_id', as: 'Exam' });

module.exports = Question;
 