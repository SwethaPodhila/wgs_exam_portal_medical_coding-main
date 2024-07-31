
exports.teacher_dashboard = (req, res) => {
    res.render('teacher-dashboard', { user_name: req?.user?.username ? (req.user.username.length > 15 ? req.user.username.slice(0, 15) + "..." : req.user.username) : "" })
};
