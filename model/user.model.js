const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Course = require('./course.model');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    mobile: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Course,
            key: 'course_id'
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'teacher', 'student'],
        defaultValue: 'student',
        allowNull: false
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: 'users',
    timestamps: false
});

User.belongsTo(Course, { foreignKey: 'course_id', as: 'Course' });

module.exports = User;
