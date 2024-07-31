const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');
const Course = require('./course.model'); // Import the Exam model

const Paper = sequelize.define('Paper', {
	paper_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	paper_name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		collate: 'utf8_unicode_ci'
	},
	course_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	}
}, {
	tableName: 'papers',
	timestamps: false,
	underscored: true
});

// Define associations
Paper.belongsTo(Course, {foreignKey: 'course_id', as: 'Course'});

module.exports = Paper;
