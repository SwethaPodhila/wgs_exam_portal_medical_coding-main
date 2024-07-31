const Question = require('../model/questions.model');
const Sequelize = require('sequelize');
const Exam = require('../model/exam.model');
const User = require('../model/user.model');

exports.see_questions_screen = (req, res) => {
	res.render('added', { user_name: req.user.username,courseId: req.user.course_id });
}


exports.getAllQuestions = async (req, res) => {
	try {
		const questions = await Question.findAll(
			{
				where: {teacher_id: req?.user?.id},
			});
            res.render('questions', { questions });
		//res.json(questions);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.getAllQuestionsGroupedByExam = async (req, res) => {
    try {
        // Fetch all questions for the logged-in teacher
        const questions = await Question.findAll({
            where: { teacher_id: req.user.id },
            order: [['exam_id', 'ASC']] // Order by exam_id ascending
        });

        // Organize questions into groups by exam_id
        const questionsByExam = {};
        questions.forEach(question => {
            const examId = question.exam_id;
            if (!questionsByExam[examId]) {
                questionsByExam[examId] = [];
            }
            questionsByExam[examId].push(question);
        });

        // Prepare response data as an array of questions grouped by exam_id
        const response = Object.keys(questionsByExam).map(examId => ({
            exam_id: examId,
            questions: questionsByExam[examId]
        }));

        res.json(response); // Send JSON response with grouped questions
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};