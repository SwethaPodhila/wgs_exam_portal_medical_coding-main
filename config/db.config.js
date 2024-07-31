const Sequelize = require('sequelize');

const sequelize = new Sequelize('wgshe7j6_exams', 'wgshe7j6_exams', 'Wingspan@123', {
	host: "162.241.123.162",
	dialect: 'mysql'
});

module.exports = sequelize;