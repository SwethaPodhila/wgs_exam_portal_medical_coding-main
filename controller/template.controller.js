

exports.take_exam_screen = (req, res) => {
	res.render('take-exam', { user_name: req.user.username,courseId: req.user.course_id });
}