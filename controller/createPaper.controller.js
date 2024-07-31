

exports.see_paper_screen = (req, res) => {
	res.render('createPaper', { user_name: req.user.username,courseId: req.user.course_id });
}