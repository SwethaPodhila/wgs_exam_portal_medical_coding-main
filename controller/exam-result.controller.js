const ExamResult = require('../model/exam-result.model');
const Exam = require('../model/exam.model');
const Course = require('../model/course.model');
const Paper = require('../model/paper.model');
const User = require('../model/user.model');


exports.createExamResult = async (req, res) => {
	try {
		const examResultData = {
			...req.body,
			student_id: req.user.id,
		};
		const examResult = await ExamResult.create(examResultData);
		res.status(201).json(examResult);
	} catch (err) {
		console.error(err);
		res.status(500).json({message: 'Server Error'});
	}
}

/*
exports.getAllExamResults = async (req, res) => {
	try {
		const examResults = await ExamResult.findAll();
		res.status(200).json(examResults);
	} catch (err) {
		console.error(err);
		res.status(500).json({message: 'Server Error'});
	}
}
*/
// exports.getAllExamResults = async (req, res) => {
//     try {
//         const studentId = req.user.id; // Assuming the user ID is stored in req.user
//         const examResults = await ExamResult.findAll({
//             where: { student_id: studentId }
//         });
// 		console.log(examResults)
//         res.render('exam-results', { examResults, user_name: req?.user?.username });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


exports.getAllExamResults = async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming the user ID is stored in req.user
        const examResults = await ExamResult.findAll({
            where: { student_id: studentId },
            include: [
                { model: Exam, as: 'Exam' },
                { model: Course, as: 'Course' },
               // { model: Paper, as: 'Paper' }
            ]
        });
        res.render('exam-results', { examResults, user_name: req?.user?.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExamResultsWithOptions = async (req, res) => {
    try {
     //   const studentId = req.user.id; // Assuming the user ID is stored in req.user
        const examResults = await ExamResult.findAll({
           // where: { student_id: studentId },
            include: [
                { model: Exam, as: 'Exam' },
                { model: Course, as: 'Course' },
				{ model: User, as: 'User' },
               // { model: Paper, as: 'Paper' }
            ]
        });
        res.render('exam-results-all', { examResults, user_name: req?.user?.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getExamResultById = async (req, res) => {
	try {
		const examResult = await ExamResult.findByPk(req.params.id);
		if (!examResult) {
			res.status(404).json({message: 'Exam result not found'});
			return;
		}
		res.status(200).json(examResult);
	} catch (err) {
		console.error(err);
		res.status(500).json({message: 'Server Error'});
	}
}

exports.updateExamResult = async (req, res) => {
	try {
		const examResult = await ExamResult.findByPk(req.params.id);
		if (!examResult) {
			res.status(404).json({message: 'Exam result not found'});
			return;
		}
		await examResult.update(req.body);
		res.status(200).json(examResult);
	} catch (err) {
		console.error(err);
		res.status(500).json({message: 'Server Error'});
	}
}

exports.deleteExamResult = async (req, res) => {
	try {
		const examResult = await ExamResult.findByPk(req.params.id);
		if (!examResult) {
			res.status(404).json({message: 'Exam result not found'});
			return;
		}
		await examResult.destroy();
		res.status(204).end();
	} catch (err) {
		console.error(err);
		res.status(500).json({message: 'Server Error'});
	}
}