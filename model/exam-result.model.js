// exam-results.model.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Exam = require('./exam.model');
const Course = require('./course.model');
const User = require('./user.model');
const Paper = require('./paper.model');


const ExamResult = sequelize.define('ExamResult', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    result: {
        type: DataTypes.ENUM('Pass', 'Fail'),
        collate: 'utf8_unicode_ci',
        defaultValue: null
    },
    number_of_questions: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    questions_answered: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    correct_answers: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    wrong_answers: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    percentage_scored: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },results:{
        type: DataTypes.TEXT('long'),
        defaultValue: null
    }
}, {
    tableName: 'ExamResults',
    timestamps: false
});

ExamResult.belongsTo(Exam, { foreignKey: 'exam_id', as: 'Exam' });
ExamResult.belongsTo(Course, { foreignKey: 'course_id', as: 'Course' });
ExamResult.belongsTo(User, { foreignKey: 'student_id', as: 'User' });

module.exports = ExamResult;