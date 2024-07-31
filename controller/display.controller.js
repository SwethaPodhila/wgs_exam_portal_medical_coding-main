// Import the Question model
const Question = require('../model/questions.model');

// Define a function to fetch questions with options
exports.getAllQuestionsWithOptions = async () => {
    try {
        const questions = await Question.findAll();
        return questions;
    } catch (err) {
        throw new Error(err.message);
    }
};
