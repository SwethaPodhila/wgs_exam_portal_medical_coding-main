const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Course = require('../model/course.model');


exports.login_screen_student = (req, res) => {
	res.render('auth', { header: "Student Login", role: 'student', page_type: 'login', role: 'student' })
}

exports.login_screen_teacher = (req, res) => {
	res.render('auth', { header: "Teacher Login", role: 'teacher', page_type: 'login', role: 'teacher' })
}

exports.login_screen_admin = (req, res) => {
	res.render('auth', { header: "Admin Login", role: 'admin', page_type: 'login', role: 'admin' })
}

// exports.register_screen_student = (req, res) => {
// 	res.render('auth', { header: "Student Sign Up", role: 'student', page_type: 'sign_up', role: 'student' })
// }

exports.register_screen_student = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('auth', { 
            header: "Student Sign Up", 
            role: 'student', 
            page_type: 'sign_up', 
            courses: courses 
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.render('auth', { 
            header: "Student Sign Up", 
            role: 'student', 
            page_type: 'sign_up', 
            courses: [] 
        });
    }
};

exports.register_screen_teacher = (req, res) => {
	res.render('auth', { header: "Teacher Sign Up", role: 'teacher', page_type: 'sign_up', role: 'teacher' })
}

exports.register_screen_admin = (req, res) => {
	res.render('auth', { header: "Admin Sign Up", role: 'admin', page_type: 'sign_up', role: 'admin' })
}

exports.signup = async (req, res) => {
    try {
        const { username, password, first_name, last_name, email, mobile, course_id, role } = req.body;
        // Ensure that course is provided in the request body
        if (!course_id && role === 'student') {
            return res.status(400).json({ message: 'Course is required' });
        }
        // Find the course in the database based on the provided course ID
        if (role === 'student') {
            const selectedCourse = await Course.findByPk(course_id);
            if (!selectedCourse) {
                return res.status(404).json({ message: 'Selected course not found' });
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await User.create({
                username,
                password: hashedPassword,
                first_name,
                last_name,
                email,
                mobile,
                course_id: selectedCourse.course_id,
                role
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await User.create({
                username,
                password: hashedPassword,
                email,
                mobile,
                role
            });
        }
        res.status(200).redirect('/users/' + role + '/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).send('Username, password, and role are required');
    }

	try {
		const user = await User.findOne({ where: { username } });
		if (!user) {
			return res.status(400).render('auth', { 
				header: "Login", 
				role: role, 
				page_type: 'login', 
				message: "Invalid credentials" 
			});
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).render('auth', { 
				header: "Login", 
				role: role, 
				page_type: 'login', 
				message: "Invalid credentials" 
			});
		}
	
		const token = jwt.sign({ id: user.id }, 'medi_coding_token', { expiresIn: '5h' });
	
		res.cookie('token', token, { httpOnly: true });
	
		if (role === 'teacher') {
			return res.status(200).redirect('/teacher/dashboard');
		} else if (role === 'admin') {
			return res.status(200).redirect('/admin/dashboard');
		} else if (role === 'student') {
			if (user.is_approved) {
				return res.status(200).redirect('/student/dashboard');
			} else {
				// Render the login page with a message
				return res.render('auth', { 
					header: "Student Login", 
					role: 'student', 
					page_type: 'login', 
					message: "Your account is not approved yet. Please wait for approval." 
				});
			}
		}
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).render('auth', { 
			header: "Login", 
			role: role, 
			page_type: 'login', 
			message: "An error occurred. Please try again." 
		});
	}
	
};

exports.logout = (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('token');

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }

        // Set no-cache headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const role = req.user.role; 
        if (role === 'teacher') {
            return res.redirect('/users/teacher/login');
        } else if (role === 'admin') {
            return res.redirect('/admin/login');
        } else if (role === 'student') {
            return res.redirect('/users/student/login');
        } else {
            return res.redirect('/login');
        }
    });
};

exports.getCounts = async (req, res) => {
    try {
        const studentCount = await User.count({ where: { role: 'student' } });
        const teacherCount = await User.count({ where: { role: 'teacher' } });

        res.render('counts', { studentCount, teacherCount });
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ message: 'An error occurred while fetching counts.' });
    }
};


exports.listStudents = async (req, res) => {
    try {
        const students = await User.findAll({ where: { role: 'student' }, include: [{ model: Course, as: 'Course' }] });
        res.render('students', { students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'An error occurred while fetching students.' });
    }
};

exports.editStudentForm = async (req, res) => {
    try {
        const student = await User.findByPk(req.params.id);
        const courses = await Course.findAll();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.render('editStudent', { student, courses });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'An error occurred while fetching student.' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { first_name, last_name, email, mobile, course_id } = req.body;
        const student = await User.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.update({ first_name, last_name, email, mobile, course_id });
        res.redirect('/users/students');
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'An error occurred while updating student.' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await User.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.destroy();
        res.redirect('/users/students');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'An error occurred while deleting student.' });
    }
};