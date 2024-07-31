const User = require("../model/user.model");
const nodemailer = require('nodemailer');
const Course = require("../model/course.model"); // Make sure to import the Course model



exports.admin_dashboard = (req, res) => {
    res.render('admin-dashboard', { user_name: req?.user?.username ? (req.user.username.length > 15 ? req.user.username.slice(0, 15) + "..." : req.user.username) : "" })
};

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kedharnathwingspan@gmail.com', 
        pass: 'mkllvovrphzsqgnz' 
    }
});

exports.approveStudentLogins = async (req, res) => {
    try {
        const students = await User.findAll({
            where: {
                role: 'student'
            },
            include: [
                {
                    model: Course,
                    attributes: ['course_name'],
                    as: 'Course'
                }
            ]
        });

        res.render('approve-student-login', { students, user_name: req?.user?.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Assume you have your User model imported as User
/*
// Controller to approve a user
exports.approveUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's approval status
        user.is_approved = true;
        await user.save();

        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
*/

// Controller to approve a user
exports.approveUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's approval status
        user.is_approved = true;
        await user.save();

        // Send email to the user
        const mailOptions = {
            from: user.email, // Sender address from user's email in the database
            to: user.email, // Receiver address (user's email)
            subject: 'Account Activation', // Subject line
            html: `Hi ${user.username},<br><br>Your account has been approved. Click on this <a href="https://wgs-exams-portal.onrender.com">link</a> to login to your account.` // HTML content of the email
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to reject a user
exports.rejectUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's approval status
        user.is_approved = false;
        await user.save();

        res.status(200).json({ message: 'User rejected successfully' });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};