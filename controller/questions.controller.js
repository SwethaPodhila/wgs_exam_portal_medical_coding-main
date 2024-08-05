const Question = require('../model/questions.model');
const Sequelize = require('sequelize');
const Exam = require('../model/exam.model');
const User = require('../model/user.model');

exports.createQuestion = async (req, res) => {
    try {
        const { question_text, option1, option2, option3, option4, correct_answer, marks, course_id, exam_id, explanation_text } = req.body;

        // Trim and sanitize inputs
        const sanitizedQuestionText = question_text.trim();
        const sanitizedOption1 = option1.trim();
        const sanitizedOption2 = option2.trim();
        const sanitizedOption3 = option3.trim();
        const sanitizedOption4 = option4.trim();
        const sanitizedExplanationText = explanation_text.trim();
        const sanitizedCorrectAnswer = correct_answer.trim();

        // Validate required fields
        if (!sanitizedQuestionText || !sanitizedOption1 || !sanitizedOption2 || !sanitizedOption3 || !sanitizedOption4 || !correct_answer || !marks || !course_id || !exam_id || !sanitizedExplanationText) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Save question to database
        const question = await Question.create({
            question_text: sanitizedQuestionText,
            option1: sanitizedOption1,
            option2: sanitizedOption2,
            option3: sanitizedOption3,
            option4: sanitizedOption4,
            correct_answer: sanitizedCorrectAnswer,
            marks,
            course_id,
            exam_id,
            explanation_text: sanitizedExplanationText,
            teacher_id: req.user.id  // Assuming req.user.id is available and contains the teacher's ID
        });

        res.status(201).json(question);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create question.' });
    }
};


/*  previous working code
exports.createQuestion = async (req, res) => {
    try {
        const { question_text, option1, option2, option3, option4, correct_answer, marks, course_id, exam_id, explanation_text } = req.body;

        const sanitizedQuestionText = question_text.trim();
        const sanitizedOption1 = option1.trim();
        const sanitizedOption2 = option2.trim();
        const sanitizedOption3 = option3.trim();
        const sanitizedOption4 = option4.trim();
        const sanitizedExplanationText = explanation_text.trim();

        const question = await Question.create({
            question_text: sanitizedQuestionText,
            option1: sanitizedOption1,
            option2: sanitizedOption2,
            option3: sanitizedOption3,
            option4: sanitizedOption4,
            correct_answer: correct_answer.trim(),
            marks,
            course_id,
            exam_id,
            explanation_text: sanitizedExplanationText,
            teacher_id: req?.user?.id
        });

        console.log(req?.user?.id, req.user, "test");
        res.status(201).json(question);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: { teacher_id: req.user.id }
        });
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};
*/

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: { teacher_id: req.user.id }
        });
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};


exports.getAllQuestionsByTeacher = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [{
                model: Exam,
                as: 'Exam', // Include exam details if needed
                attributes: ['exam_name']
            }],
            order: [['teacher_id', 'ASC'], ['question_id', 'ASC']] // Optional: Order by teacher_id and question_id
        });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No questions found.' });
        }

        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};

exports.getAllQuestionsGroupedByExam = async (req, res) => {
    try {
        // Fetch all questions for the logged-in teacher with exam details
        const questions = await Question.findAll({
            where: { teacher_id: req.user.id },
            include: [{
                model: Exam,
                as: 'Exam', // Use the alias defined in the association
                attributes: ['exam_name']
            }],
            order: [['exam_id', 'ASC']]
        });

        // Organize questions into groups by exam_name
        const questionsByExam = {};
        questions.forEach(question => {
            const examName = question.Exam.exam_name; // Access exam_name from the included model
            if (!questionsByExam[examName]) {
                questionsByExam[examName] = [];
            }
            questionsByExam[examName].push(question);
        });

        // Prepare response data as an array of questions grouped by exam_name
        const response = Object.keys(questionsByExam).map(examName => ({
            exam_name: examName,
            questions: questionsByExam[examName]
        }));

        res.json(response); // Send JSON response with grouped questions
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};    

exports.getAllQuestionsByExam = async (req, res) => {
    try {
        // Fetch all questions
        const questions = await Question.findAll({
            order: [['exam_id', 'ASC']] 
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


exports.getQuestionsByExamAndTeacher = async (req, res) => {
    try {
        const { examId, teacherId } = req.params;

        // Fetch questions from the database based on examId and teacherId
        const questions = await Question.findAll({
            where: {
                exam_id: examId,
                teacher_id: teacherId
            }
        });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam and teacher.' });
        }

        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions by exam ID and teacher ID:', err);
        res.status(500).json({ message: 'Failed to fetch questions.' });
    }
};

exports.getAllQuestionsByExamId = async (examId) => {
    try {
        const questions = await Question.findAll({
            where: { exam_id: examId }
        });
        return questions;
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.getQuestionById = async (req, res) => {
	try {
		const {id} = req.params;
		const question = await Question.findByPk(id);
		if (!question) {
			return res.status(404).json({message: 'Question not found'});
		}
		res.json(question);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, option1, option2, option3, option4, correct_answer, marks, course_id, exam_id, explanation_text } = req.body;

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Trim spaces and sanitize inputs
        const sanitizedQuestionText = question_text.trim();
        const sanitizedOption1 = option1.trim();
        const sanitizedOption2 = option2.trim();
        const sanitizedOption3 = option3.trim();
        const sanitizedOption4 = option4.trim();
        const sanitizedExplanationText = explanation_text.trim();
        const sanitizedCorrectAnswer = correct_answer.trim();


        await question.update({
            question_text: sanitizedQuestionText,
            option1: sanitizedOption1,
            option2: sanitizedOption2,
            option3: sanitizedOption3,
            option4: sanitizedOption4,
            correct_answer: sanitizedCorrectAnswer,
            marks,
            course_id,
            exam_id,
            explanation_text: sanitizedExplanationText
        });

        res.json(question);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        await question.destroy();
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
/*
exports.getAllQuestionsByCriteria = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        const exams = await Exam.findAll({ where: { course_id } });

        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this course.' });
        }

        // Total number of questions to retrieve
        const totalQuestions = 100;

        // Calculate questions per exam
        const questionsPerExam = Math.ceil(totalQuestions / exams.length);

        let allQuestions = [];

        for (let exam of exams) {
            const questions = await Question.findAll({
                where: { exam_id: exam.exam_id },
                order: Sequelize.literal('RAND()'),
                limit: questionsPerExam
            });
            allQuestions = allQuestions.concat(questions);
        }

        res.json(allQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
*/
/*
// based on prasanna madam tought and also cpc exam model
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

exports.getAllQuestionsByCriteria = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        const exams = await Exam.findAll({ where: { course_id } });

        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this course.' });
        }

        const questionsCountPerExam = [
            6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 4, 5, 7, 3, 3, 10
        ];

        let allQuestions = [];

        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];
            const limit = questionsCountPerExam[i] || 0; 

            let questions = await Question.findAll({
                where: { exam_id: exam.exam_id },
                limit: limit
            });

            shuffleArray(questions);

            allQuestions = allQuestions.concat(questions);
        }

        res.json(allQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
*/
/* current working code user by user showing different questions
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

exports.getAllQuestionsByCriteria = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        const exams = await Exam.findAll({ where: { course_id } });

        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this course.' });
        }

        const questionsCountPerExam = [
            6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 4, 5, 7, 3, 3, 10
        ];

        let allQuestions = [];
        let usedQuestionIds = new Set();

        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];
            const limit = questionsCountPerExam[i] || 0;

            // Fetch all questions for the exam
            let questions = await Question.findAll({
                where: { exam_id: exam.exam_id }
            });

            // Filter out used questions
            questions = questions.filter(question => !usedQuestionIds.has(question.question_id));

            // Shuffle and select the required number of questions
            shuffleArray(questions);
            let selectedQuestions = questions.slice(0, limit);

            // Add selected questions to the result array and mark them as used
            selectedQuestions.forEach(question => usedQuestionIds.add(question.question_id));
            allQuestions = allQuestions.concat(selectedQuestions);
        }

        res.json(allQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
*/

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};


const getAllQuestionsByCriteriaVersion1 = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        const exams = await Exam.findAll({ where: { course_id } });

        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this course.' });
        }

        const questionsCountPerExam = [
            6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 4, 5, 7, 3, 3, 10
        ];

        let allQuestions = [];
        let usedQuestionIds = new Set();

        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];
            const limit = questionsCountPerExam[i] || 0;

            // Fetch all questions for the exam
            let questions = await Question.findAll({
                where: { exam_id: exam.exam_id }
            });

            // Filter out used questions
            questions = questions.filter(question => !usedQuestionIds.has(question.question_id));

            // Shuffle and select the required number of questions
            shuffleArray(questions);
            let selectedQuestions = questions.slice(0, limit);

            // Add selected questions to the result array and mark them as used
            selectedQuestions.forEach(question => {
                usedQuestionIds.add(question.question_id);
                question.dataValues.exam_id = exam.exam_id; // Include exam_id in the response
            });
            allQuestions = allQuestions.concat(selectedQuestions);
        }

        res.json(allQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// Second version of the function (for course_id !== 1)
const getAllQuestionsByCriteriaVersion2 = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        const exams = await Exam.findAll({ where: { course_id } });

        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this course.' });
        }

        // Total number of questions to retrieve
        const totalQuestions = 100;

        // Calculate questions per exam
        const questionsPerExam = Math.ceil(totalQuestions / exams.length);

        let allQuestions = [];

        for (let exam of exams) {
            const questions = await Question.findAll({
                where: { exam_id: exam.exam_id },
                order: Sequelize.literal('RAND()'),
                limit: questionsPerExam
            });
            questions.forEach(question => {
                question.dataValues.exam_id = exam.exam_id; // Include exam_id in the response
            });
            allQuestions = allQuestions.concat(questions);
        }

        res.json(allQuestions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// Main function to choose which version to execute
exports.getAllQuestionsByCriteria = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const course_id = user ? user.course_id : null;

        if (!course_id) {
            return res.status(400).json({ message: 'User does not have an associated course.' });
        }

        if (course_id === 1) {
            // Execute version 1 for course_id === 1
            await getAllQuestionsByCriteriaVersion1(req, res);
        } else {
            // Execute version 2 for other course_ids
            await getAllQuestionsByCriteriaVersion2(req, res);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


exports.getQuestionsByPaperId = async (req, res) => {
    try {
        const { paperId } = req.params;
        const questions = await Question.findAll({ where: { paper_id: paperId } });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
