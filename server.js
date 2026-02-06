const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.fieldname === 'video' ? 'uploads/videos' : 'uploads/images';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100000000 // 100MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed!'), false);
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }
      
      // Create new user
      const newUser = await pool.query(
        `INSERT INTO users (email, full_name, google_id, role, email_verified, avatar_url) 
         VALUES ($1, $2, $3, $4, true, $5) RETURNING *`,
        [profile.emails[0].value, profile.displayName, profile.id, 'student', profile.photos[0]?.value]
      );
      
      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'picture']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let result = await pool.query('SELECT * FROM users WHERE facebook_id = $1', [profile.id]);
      
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }
      
      const newUser = await pool.query(
        `INSERT INTO users (email, full_name, facebook_id, role, email_verified, avatar_url) 
         VALUES ($1, $2, $3, $4, true, $5) RETURNING *`,
        [profile.emails[0].value, `${profile.name.givenName} ${profile.name.familName}`, profile.id, 'student', profile.photos[0]?.value]
      );
      
      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================

// Regular registration
app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
  body('phone').notEmpty(),
  body('role').isIn(['student', 'teacher', 'parent'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, full_name, phone, role, parent_phone } = req.body;
    
    // Check if email exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // If student, check for parent
    let parent_id = null;
    if (role === 'student' && parent_phone) {
      const parent = await pool.query('SELECT id FROM users WHERE phone = $1 AND role = $2', [parent_phone, 'parent']);
      if (parent.rows.length > 0) {
        parent_id = parent.rows[0].id;
      }
    }
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, parent_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, role`,
      [email, password_hash, full_name, phone, role, parent_id]
    );
    
    const user = result.rows[0];
    
    // Create teacher profile if role is teacher
    if (role === 'teacher') {
      await pool.query('INSERT INTO teacher_profiles (user_id) VALUES ($1)', [user.id]);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`/?token=${token}`);
  }
);

// Facebook OAuth routes
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`/?token=${token}`);
  }
);

// ==================== TEACHER ROUTES ====================

// Get teacher dashboard stats
app.get('/api/teacher/dashboard', authenticateJWT, authorize('teacher'), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Get stats
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM courses WHERE teacher_id = $1) as total_courses,
        (SELECT COUNT(DISTINCT e.student_id) FROM enrollments e 
         JOIN courses c ON e.course_id = c.id WHERE c.teacher_id = $1) as total_students,
        (SELECT COALESCE(SUM(p.amount), 0) FROM payments p 
         JOIN courses c ON p.course_id = c.id 
         WHERE c.teacher_id = $1 AND p.status = 'completed') as total_revenue,
        (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r 
         JOIN courses c ON r.course_id = c.id WHERE c.teacher_id = $1) as avg_rating
    `, [teacherId]);
    
    // Get recent enrollments
    const enrollments = await pool.query(`
      SELECT e.*, u.full_name as student_name, c.title as course_title
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.teacher_id = $1
      ORDER BY e.enrolled_at DESC
      LIMIT 10
    `, [teacherId]);
    
    res.json({
      stats: stats.rows[0],
      recentEnrollments: enrollments.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Get teacher courses
app.get('/api/teacher/courses', authenticateJWT, authorize('teacher'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.name_ar as subject_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollment_count,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE course_id = c.id) as rating
      FROM courses c
      LEFT JOIN subjects s ON c.subject_id = s.id
      WHERE c.teacher_id = $1
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create new course
app.post('/api/teacher/courses', authenticateJWT, authorize('teacher'), upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, subject_id, price, discount_price } = req.body;
    const thumbnail_url = req.file ? `/uploads/images/${req.file.filename}` : null;
    
    const result = await pool.query(`
      INSERT INTO courses (teacher_id, subject_id, title, description, price, discount_price, thumbnail_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft')
      RETURNING *
    `, [req.user.id, subject_id, title, description, price, discount_price, thumbnail_url]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
app.put('/api/teacher/courses/:id', authenticateJWT, authorize('teacher'), upload.single('thumbnail'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject_id, price, discount_price } = req.body;
    
    let query = `UPDATE courses SET title = $1, description = $2, subject_id = $3, price = $4, discount_price = $5, updated_at = NOW()`;
    let values = [title, description, subject_id, price, discount_price];
    
    if (req.file) {
      query += `, thumbnail_url = $6 WHERE id = $7 AND teacher_id = $8 RETURNING *`;
      values.push(`/uploads/images/${req.file.filename}`, id, req.user.id);
    } else {
      query += ` WHERE id = $6 AND teacher_id = $7 RETURNING *`;
      values.push(id, req.user.id);
    }
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Publish course (submit for review)
app.post('/api/teacher/courses/:id/publish', authenticateJWT, authorize('teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE courses 
      SET status = 'pending', updated_at = NOW()
      WHERE id = $1 AND teacher_id = $2
      RETURNING *
    `, [id, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course submitted for review', course: result.rows[0] });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ error: 'Failed to publish course' });
  }
});

// Add lesson with video upload
app.post('/api/teacher/courses/:courseId/lessons', 
  authenticateJWT, 
  authorize('teacher'), 
  upload.single('video'), 
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, duration_minutes, order_number, is_free } = req.body;
      
      // Verify course ownership
      const course = await pool.query('SELECT id FROM courses WHERE id = $1 AND teacher_id = $2', [courseId, req.user.id]);
      if (course.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      const video_url = req.file ? `/uploads/videos/${req.file.filename}` : null;
      const video_filename = req.file ? req.file.filename : null;
      const video_size = req.file ? req.file.size : null;
      
      const result = await pool.query(`
        INSERT INTO lessons (course_id, title, description, video_url, video_filename, video_size, duration_minutes, order_number, is_free)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [courseId, title, description, video_url, video_filename, video_size, duration_minutes, order_number, is_free === 'true']);
      
      // Update course total lessons
      await pool.query('UPDATE courses SET total_lessons = total_lessons + 1 WHERE id = $1', [courseId]);
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Add lesson error:', error);
      res.status(500).json({ error: 'Failed to add lesson' });
    }
});

// Get course lessons
app.get('/api/teacher/courses/:courseId/lessons', authenticateJWT, authorize('teacher'), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM lessons 
      WHERE course_id = $1 
      ORDER BY order_number ASC
    `, [courseId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// ==================== ADMIN ROUTES ====================

// Admin dashboard stats
app.get('/api/admin/dashboard', authenticateJWT, authorize('admin'), async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') as total_teachers,
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM courses WHERE is_published = true) as published_courses,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed') as total_revenue
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Get all teachers
app.get('/api/admin/teachers', authenticateJWT, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*, tp.specialization, tp.rating, tp.total_students, tp.is_verified,
        (SELECT COUNT(*) FROM courses WHERE teacher_id = u.id) as courses_count,
        (SELECT COALESCE(SUM(p.amount), 0) FROM payments p 
         JOIN courses c ON p.course_id = c.id 
         WHERE c.teacher_id = u.id AND p.status = 'completed') as total_earnings
      FROM users u
      LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
      WHERE u.role = 'teacher'
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Get pending courses for approval
app.get('/api/admin/courses/pending', authenticateJWT, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.full_name as teacher_name, s.name_ar as subject_name
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN subjects s ON c.subject_id = s.id
      WHERE c.status = 'pending'
      ORDER BY c.updated_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get pending courses error:', error);
    res.status(500).json({ error: 'Failed to fetch pending courses' });
  }
});

// Approve/reject course
app.post('/api/admin/courses/:id/review', authenticateJWT, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'
    
    const status = action === 'approve' ? 'approved' : 'rejected';
    const is_published = action === 'approve';
    
    const result = await pool.query(`
      UPDATE courses 
      SET status = $1, is_published = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, is_published, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // TODO: Send notification to teacher
    
    res.json({ message: `Course ${action}d successfully`, course: result.rows[0] });
  } catch (error) {
    console.error('Review course error:', error);
    res.status(500).json({ error: 'Failed to review course' });
  }
});

// ==================== PUBLIC ROUTES ====================

// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects WHERE is_active = true ORDER BY name_ar');
    res.json(result.rows);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get published courses
app.get('/api/courses', async (req, res) => {
  try {
    const { subject_id, search } = req.query;
    
    let query = `
      SELECT c.*, u.full_name as teacher_name, s.name_ar as subject_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollment_count,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE course_id = c.id) as rating
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN subjects s ON c.subject_id = s.id
      WHERE c.is_published = true
    `;
    
    const values = [];
    
    if (subject_id) {
      query += ` AND c.subject_id = $${values.length + 1}`;
      values.push(subject_id);
    }
    
    if (search) {
      query += ` AND (c.title ILIKE $${values.length + 1} OR c.description ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sider Platform API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sider Platform server running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
});
