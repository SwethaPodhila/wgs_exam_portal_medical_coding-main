// paper.controller.js

const Question = require('../model/questions.model');
const Paper = require('../model/paper.model');
const User = require('../model/user.model'); // Assuming the user model file path

exports.renderPaper = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        const courseId = user ? user.course_id : null;

        if (!courseId) {
            return res.status(400).json({ message: 'User has no associated course' });
        }

        const allQuestions = await Question.findAll({
            where: { course_id: courseId }
        });

        const questionSets = chunkArray(allQuestions, 6);

        const shuffledQuestions = [];
        questionSets.forEach((questions, index) => {
            shuffleArray(questions);
            const examId = `exam_${index + 1}`; 
            questions.forEach(question => question.exam_id = examId);
            shuffledQuestions.push(...questions);
        });

        res.render('paper', { questions: shuffledQuestions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


exports.createPaper = async (req, res) => {
	try {
		const {paper_name, course_id} = req.body;
		const paper = await Paper.create({paper_name, course_id});
		res.status(201).json(paper);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
};

exports.getAllPapers = async (req, res) => {
    try {
        const papers = await Paper.findAll();
        res.render('paper', { papers }); // Pass the papers to the paper.ejs template
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPaperById = async (req, res) => {
	try {
		const {id} = req.params;
		const paper = await Paper.findByPk(id);
		if (!paper) {
			return res.status(404).json({message: 'Paper not found'});
		}
		res.json(paper);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.updatePaper = async (req, res) => {
	try {
		const {id} = req.params;
		const {paper_name, course_id} = req.body;
		const paper = await Paper.findByPk(id);
		if (!paper) {
			return res.status(404).json({message: 'Paper not found'});
		}
		await paper.update({paper_name, course_id});
		res.json(paper);
	} catch (err) {
		res.status(400).json({message: err.message});
	}
};

exports.deletePaper = async (req, res) => {
	try {
		const {id} = req.params;
		const paper = await Paper.findByPk(id);
		if (!paper) {
			return res.status(404).json({message: 'Paper not found'});
		}
		await paper.destroy();
		res.json({message: 'Paper deleted successfully'});
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};

exports.getPapersByCourse = async (req, res) => {
	try {
		const {course_id} = req.params;
		const papers = await Paper.findAll({
			where: {course_id}
		});

		res.json(papers);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};