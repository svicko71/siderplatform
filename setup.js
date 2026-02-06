const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up Sider Database...\n');

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    console.log('✅ UUID extension enabled');

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin', 'parent')) NOT NULL,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        google_id VARCHAR(255) UNIQUE,
        facebook_id VARCHAR(255) UNIQUE,
        parent_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_users_facebook ON users(facebook_id);
    `);
    console.log('✅ Users table created');

    // Teacher Profiles
    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        bio TEXT,
        specialization VARCHAR(100),
        experience_years INTEGER,
        education_level VARCHAR(100),
        hourly_rate DECIMAL(10,2),
        total_students INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        bank_account VARCHAR(100),
        id_document_url TEXT,
        certificate_urls JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Teacher profiles table created');

    // Subjects
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name_ar VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        description TEXT,
        icon_url TEXT,
        grade_level VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Subjects table created');

    // Courses
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        teacher_id UUID REFERENCES users(id),
        subject_id UUID REFERENCES subjects(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2),
        thumbnail_url TEXT,
        duration_hours INTEGER,
        total_lessons INTEGER DEFAULT 0,
        enrollment_count INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        is_published BOOLEAN DEFAULT false,
        status VARCHAR(20) CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
      CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject_id);
      CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
      CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
    `);
    console.log('✅ Courses table created');

    // Lessons
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url TEXT,
        video_filename VARCHAR(255),
        video_size BIGINT,
        duration_minutes INTEGER,
        order_number INTEGER NOT NULL,
        is_free BOOLEAN DEFAULT false,
        attachments JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_number);
    `);
    console.log('✅ Lessons table created');

    // Enrollments
    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES users(id),
        course_id UUID REFERENCES courses(id),
        enrolled_at TIMESTAMP DEFAULT NOW(),
        progress_percentage DECIMAL(5,2) DEFAULT 0,
        completed_at TIMESTAMP,
        last_accessed TIMESTAMP,
        UNIQUE(student_id, course_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
    `);
    console.log('✅ Enrollments table created');

    // Payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        course_id UUID REFERENCES courses(id),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'EGP',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
        payment_gateway VARCHAR(50),
        paymob_order_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);
    `);
    console.log('✅ Payments table created');

    // Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        student_id UUID REFERENCES users(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(course_id, student_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);
    `);
    console.log('✅ Reviews table created');

    // Notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        action_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
    `);
    console.log('✅ Notifications table created');

    // Insert default subjects
    await client.query(`
      INSERT INTO subjects (name_ar, name_en, grade_level, icon_url) VALUES
        ('الرياضيات', 'Mathematics', 'all', '📐'),
        ('العلوم', 'Science', 'all', '🔬'),
        ('اللغة العربية', 'Arabic Language', 'all', '📝'),
        ('اللغة الإنجليزية', 'English Language', 'all', '🗣️'),
        ('الفيزياء', 'Physics', 'secondary', '⚛️'),
        ('الكيمياء', 'Chemistry', 'secondary', '🧪'),
        ('الأحياء', 'Biology', 'secondary', '🧬'),
        ('التاريخ', 'History', 'all', '📚'),
        ('الجغرافيا', 'Geography', 'all', '🌍'),
        ('البرمجة', 'Programming', 'all', '💻')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Default subjects inserted');

    // Insert admin user (password: admin123)
    await client.query(`
      INSERT INTO users (email, password_hash, full_name, phone, role, email_verified)
      VALUES (
        'admin@sider.com',
        '$2a$10$YourHashedPasswordHere',
        'المسؤول الرئيسي',
        '01000000000',
        'admin',
        true
      )
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Admin user created');

    console.log('\n✨ Database setup completed successfully!\n');
    console.log('📧 Admin Email: admin@sider.com');
    console.log('🔑 Admin Password: admin123\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

setupDatabase().catch(console.error);
