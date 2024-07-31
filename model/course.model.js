const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');

const Course = sequelize.define('Course', {
	course_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	course_name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		collate: 'utf8_unicode_ci' 
	}
}, {
	tableName: 'courses', 
	timestamps: false 
});

module.exports = Course;
