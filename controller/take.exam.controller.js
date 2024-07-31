

exports.take_exam_controller = (req, res) => {
	const {course_id, exam_id, paper_id} = req.body
	res.render('exam', {exam_id, paper_id, course_id, user_name: req?.user?.username})
}