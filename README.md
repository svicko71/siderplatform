# 🚀 Sider Educational Platform

<div align="center">
  <h1>منصة سايدر التعليمية</h1>
  <p>منصة تعليمية متكاملة مع لوحة تحكم للمدرسين، نظام دفع فوري، ورفع فيديوهات</p>
</div>

---

## 📋 المميزات الرئيسية

### ✨ المميزات العامة
- 🎨 تصميم عصري وجذاب مع لوجو متحرك
- 🌍 دعم كامل للغة العربية (RTL)
- 📱 متجاوب مع جميع الأجهزة
- 🔐 نظام مصادقة آمن
- 👋 رسالة ترحيب "أهلاً بيك يا صديقي"

### 👨‍🏫 واجهة المدرس
- 📊 لوحة تحكم متقدمة
- ➕ إنشاء وإدارة الكورسات
- 🎥 رفع الفيديوهات مع شريط تقدم
- 📝 إضافة الدروس والمحتوى
- 💰 متابعة الأرباح والطلاب
- ⭐ عرض التقييمات

### 🔐 نظام المصادقة
- 📧 تسجيل دخول عادي (إيميل وباسورد)
- 🔵 تسجيل دخول بجوجل (Google OAuth)
- 📘 تسجيل دخول بفيسبوك (Facebook OAuth)
- 👨‍👩‍👧 دعم حسابات ولي الأمر
- 📞 ربط الطالب بولي الأمر عن طريق رقم الهاتف

### 💳 بوابة الدفع
- 💰 تكامل مع Paymob (للسوق المصري)
- 💳 دفع بالبطاقات الائتمانية
- 📱 دفع بالمحافظ الإلكترونية
- 🏪 دفع عن طريق فوري

### 👑 لوحة تحكم الأدمن
- 📊 إحصائيات شاملة
- ✅ الموافقة على الكورسات
- 👨‍🏫 إدارة المدرسين
- 💰 تقارير مالية

---

## 🛠️ التقنيات المستخدمة

### Backend
- Node.js
- Express.js
- PostgreSQL
- Passport.js (OAuth)
- JWT Authentication
- Multer (File Upload)

### Frontend
- HTML5
- CSS3 (Modern)
- Vanilla JavaScript
- SVG Animations

---

## 📦 التثبيت على Replit

### الخطوة 1: إنشاء مشروع جديد

1. افتح [Replit](https://replit.com)
2. اضغط على "Create Repl"
3. اختر "Node.js" كنوع المشروع
4. سمّي المشروع "sider-platform"

### الخطوة 2: رفع الملفات

قم برفع جميع الملفات إلى Replit:
```
sider-platform/
├── server.js
├── setup.js
├── package.json
├── .env.example
├── public/
│   ├── teacher-dashboard.html
│   └── login.html
└── uploads/
    ├── videos/
    └── images/
```

### الخطوة 3: إعداد قاعدة البيانات

1. في Replit، اذهب إلى قسم "Secrets"
2. أضف PostgreSQL database من قسم "Database"
3. ستحصل على DATABASE_URL تلقائياً

أو استخدم خدمة خارجية:
- [ElephantSQL](https://www.elephantsql.com/) (مجاني)
- [Supabase](https://supabase.com/) (مجاني)
- [Railway](https://railway.app/) (مجاني)

### الخطوة 4: إعداد المتغيرات البيئية

في Replit Secrets، أضف المتغيرات التالية:

```env
# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=sider_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Server
PORT=3000
NODE_ENV=production
BASE_URL=https://your-repl-name.your-username.repl.co

# JWT
JWT_SECRET=your_very_secret_key_here_change_this

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-repl.repl.co/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://your-repl.repl.co/auth/facebook/callback

# Paymob (optional)
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id

# Session
SESSION_SECRET=another_random_secret_key
```

### الخطوة 5: إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. اذهب إلى "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. اختر "Web application"
6. أضف Authorized redirect URIs:
   ```
   https://your-repl.repl.co/auth/google/callback
   http://localhost:3000/auth/google/callback
   ```
7. احفظ CLIENT_ID و CLIENT_SECRET

### الخطوة 6: إعداد Facebook OAuth

1. اذهب إلى [Facebook Developers](https://developers.facebook.com/)
2. أنشئ تطبيق جديد
3. أضف "Facebook Login" product
4. في Settings > Basic، احفظ App ID و App Secret
5. في Facebook Login > Settings، أضف Valid OAuth Redirect URIs:
   ```
   https://your-repl.repl.co/auth/facebook/callback
   http://localhost:3000/auth/facebook/callback
   ```

### الخطوة 7: تشغيل المشروع

في Replit Console:

```bash
# 1. تثبيت الحزم
npm install

# 2. إنشاء قاعدة البيانات
node setup.js

# 3. تشغيل السيرفر
npm start
```

---

## 🔧 الإعداد المحلي (على جهازك)

```bash
# 1. Clone المشروع
git clone <your-repo-url>
cd sider-platform

# 2. تثبيت الحزم
npm install

# 3. نسخ ملف البيئة
cp .env.example .env

# 4. تعديل ملف .env بمعلوماتك

# 5. إنشاء قاعدة البيانات
node setup.js

# 6. تشغيل السيرفر
npm start
```

---

## 📝 استخدام المنصة

### تسجيل الدخول

#### للمدرس:
1. اذهب إلى `/login.html`
2. اختر "إنشاء حساب"
3. املأ البيانات واختر "مدرس"
4. أو استخدم Google/Facebook

#### للطالب:
1. نفس الخطوات لكن اختر "طالب"
2. يمكن إضافة رقم هاتف ولي الأمر (اختياري)

#### للأدمن:
```
البريد: admin@sider.com
الباسورد: admin123
```

### إضافة كورس (للمدرس)

1. سجل دخول كمدرس
2. اذهب إلى "كورساتي"
3. اضغط "إضافة كورس جديد"
4. املأ البيانات:
   - عنوان الكورس
   - الوصف
   - المادة
   - السعر
   - صورة الكورس
5. احفظ الكورس

### إضافة دروس

1. افتح الكورس
2. اضغط "الدروس"
3. اضغط "إضافة درس"
4. املأ البيانات:
   - عنوان الدرس
   - الوصف
   - رقم الترتيب
   - مدة الدرس
   - رفع فيديو الدرس (يصل إلى 100MB)
5. انتظر اكتمال الرفع
6. احفظ الدرس

### نشر الكورس

1. بعد إضافة الدروس
2. اضغط "نشر" على الكورس
3. سيذهب الكورس للمراجعة من الأدمن
4. بعد الموافقة، سيظهر في المنصة

---

## 🗄️ هيكل قاعدة البيانات

### الجداول الرئيسية:

- **users** - المستخدمين (طلاب، مدرسين، أدمن، أولياء أمور)
- **teacher_profiles** - ملفات المدرسين
- **subjects** - المواد الدراسية
- **courses** - الكورسات
- **lessons** - الدروس
- **enrollments** - التسجيلات
- **payments** - المدفوعات
- **reviews** - التقييمات
- **notifications** - الإشعارات

---

## 🔌 API Endpoints

### المصادقة
```
POST /api/auth/register      - تسجيل حساب جديد
POST /api/auth/login         - تسجيل الدخول
GET  /auth/google            - OAuth بجوجل
GET  /auth/facebook          - OAuth بفيسبوك
```

### المدرس
```
GET  /api/teacher/dashboard           - إحصائيات المدرس
GET  /api/teacher/courses             - كورسات المدرس
POST /api/teacher/courses             - إنشاء كورس جديد
PUT  /api/teacher/courses/:id         - تعديل كورس
POST /api/teacher/courses/:id/publish - نشر كورس
POST /api/teacher/courses/:id/lessons - إضافة درس
GET  /api/teacher/courses/:id/lessons - دروس الكورس
```

### الأدمن
```
GET  /api/admin/dashboard        - إحصائيات الأدمن
GET  /api/admin/teachers         - جميع المدرسين
GET  /api/admin/courses/pending  - الكورسات المعلقة
POST /api/admin/courses/:id/review - موافقة/رفض كورس
```

### عام
```
GET /api/subjects  - المواد المتاحة
GET /api/courses   - الكورسات المنشورة
```

---

## 📱 الشاشات

### 1. شاشة الترحيب
- لوجو متحرك كبير
- رسالة "أهلاً بيك يا صديقي!"
- تظهر لمدة 3 ثواني

### 2. شاشة تسجيل الدخول
- تسجيل دخول عادي
- تسجيل دخول بجوجل
- تسجيل دخول بفيسبوك
- إنشاء حساب (طالب/مدرس/ولي أمر)

### 3. لوحة تحكم المدرس
- إحصائيات (كورسات، طلاب، أرباح، تقييم)
- إدارة الكورسات
- إضافة كورسات جديدة
- رفع الفيديوهات
- متابعة الطلاب

### 4. لوحة تحكم الأدمن
- إحصائيات عامة
- إدارة المدرسين
- الموافقة على الكورسات
- التقارير المالية

---

## 🎨 التخصيص

### تغيير الألوان
في ملفات HTML، عدّل المتغيرات في `:root`:

```css
:root {
  --coral-red: #E94560;    /* اللون الأساسي */
  --gold: #F5C518;         /* لون الذهبي */
  --dark-bg: #0F0F1A;      /* الخلفية الداكنة */
  --card-bg: #1A1A2E;      /* خلفية الكروت */
}
```

### تغيير اللوجو
عدّل ملف SVG في القسم المناسب من HTML

---

## 🚀 التحسينات المستقبلية

- [ ] نظام الإشعارات الحية (WebSockets)
- [ ] تطبيق موبايل (React Native)
- [ ] نظام البث المباشر
- [ ] اختبارات وكويزات
- [ ] شهادات إلكترونية
- [ ] نظام المحادثات
- [ ] تقارير متقدمة
- [ ] دعم لغات إضافية

---

## 🐛 حل المشاكل الشائعة

### المشكلة: لا يعمل رفع الفيديو
**الحل:**
- تأكد من أن مجلد `uploads/videos` موجود
- تحقق من صلاحيات الكتابة
- تأكد من حجم الملف أقل من 100MB

### المشكلة: لا يعمل Google OAuth
**الحل:**
- تأكد من إضافة Redirect URI الصحيح
- تحقق من GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET
- تأكد من تفعيل Google+ API

### المشكلة: خطأ في قاعدة البيانات
**الحل:**
- تأكد من تشغيل `node setup.js`
- تحقق من معلومات الاتصال بقاعدة البيانات
- تأكد من أن PostgreSQL يعمل

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع قسم "حل المشاكل"
2. تحقق من Console للأخطاء
3. تأكد من إعدادات البيئة

---

## 📄 الترخيص

MIT License - يمكنك استخدام المشروع بحرية

---

## 👨‍💻 المطور

تم التطوير بواسطة **Sider Team**

---

## 🌟 المساهمة

نرحب بالمساهمات! يمكنك:
- فتح Issue للإبلاغ عن مشكلة
- إرسال Pull Request لإضافة ميزة
- مشاركة أفكارك لتحسين المنصة

---

<div align="center">
  <h3>✨ بالتوفيق في مشروعك! ✨</h3>
  <p>لا تنسَ وضع نجمة ⭐ إذا أعجبك المشروع</p>
</div>
