

exports.see_exams_screen = (req, res) => {
	res.render('examAdded', { user_name: req.user.username,courseId: req.user.course_id });
}