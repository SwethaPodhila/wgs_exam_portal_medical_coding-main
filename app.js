
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser');
const port = 3000;

const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/users.routes');
const courseRouter = require('./routes/course.routes');
const templateRouter = require('./routes/template.routes');
const paperRouter = require('./routes/paper.routes');
const examRouter = require('./routes/exam.routes');
const takeExamRouter = require('./routes/take.exam.routes');
const questionRouter = require('./routes/questions.routes');
const resultRouter = require('./routes/exam-result.routes');
const studentRouter = require('./routes/student.routes');
const adminRouter = require('./routes/admin.routes');
const teacherRouter = require('./routes/teacher.routes');
const displayRouter = require('./routes/display.routes');
const addedRouter = require('./routes/added.routes');
const namesRouter = require('./routes/names.routes');
const examAddedRouter = require('./routes/examAdded.routes');
const addedTeacherRouter = require('./routes/added_teacher.routes');
const addedExamRouter = require('./routes/added_exam.routes');
const createPaperRouter = require('./routes/createPaper.routes');

const sequelize = require('./config/db.config');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware to redirect root URL to student login
app.get('/', (req, res) => {
    res.redirect('/users/student/login');
});

// Middleware to add no-cache headers
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/users/student/login');
    }
    try {
        jwt.verify(token, 'medi_coding_token');
        next();
    } catch (err) {
        return res.redirect('/users/student/login');
    }
}

app.use('/users', usersRouter);
app.use('/course', courseRouter);
app.use('/template', templateRouter);
app.use('/paper', paperRouter);
app.use('/exam', examRouter);
app.use('/take', takeExamRouter);
app.use('/question', questionRouter);
app.use('/result', resultRouter);
app.use('/teacher', indexRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/allquestions', displayRouter);
app.use('/add', addedRouter);
app.use('/names', namesRouter);
app.use('/examadded', examAddedRouter);
app.use('/added', addedTeacherRouter);
app.use('/adding', addedExamRouter);
app.use('/createPaper', createPaperRouter);


app.use(authenticateToken);

// Handle 404 errors with custom logic
app.use(function (req, res, next) {
    if (req.originalUrl.startsWith('/users/student')) {
        return res.redirect('/users/student/login');
    } else if (req.originalUrl.startsWith('/users/teacher')) {
        return res.redirect('/users/teacher/login');
    } else if (req.originalUrl.startsWith('/admin')) {
        return res.redirect('/admin/login');
    }
    next(createError(404));
});

// Error handling middleware
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = app;
