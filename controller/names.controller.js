

exports.see_course_screen = (req, res) => {
	res.render('names', { user_name: req.user.username,courseId: req.user.course_id });
}