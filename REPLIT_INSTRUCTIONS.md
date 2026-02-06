# 🎯 تعليمات الرفع على Replit - خطوة بخطوة

## 📦 الملفات الموجودة:

```
sider-platform/
├── 📄 server.js                    → السيرفر الرئيسي
├── 📄 setup.js                     → إعداد قاعدة البيانات
├── 📄 package.json                 → الحزم المطلوبة
├── 📄 .env.example                 → مثال للمتغيرات
├── 📄 .replit                      → إعدادات Replit
├── 📄 replit.nix                   → Nix configuration
├── 📄 .gitignore                   → ملفات مستثناة
├── 📄 README.md                    → الدليل الكامل
├── 📄 QUICKSTART.md                → دليل البدء السريع
│
├── 📁 public/
│   ├── teacher-dashboard.html     → واجهة المدرس
│   └── login.html                 → صفحة تسجيل الدخول
│
└── 📁 uploads/
    ├── videos/                    → الفيديوهات المرفوعة
    └── images/                    → الصور المرفوعة
```

---

## 🚀 خطوات الرفع على Replit

### الخطوة 1: إنشاء Repl جديد

1. افتح [Replit.com](https://replit.com)
2. اضغط "+ Create Repl"
3. اختر "Node.js" من القائمة
4. اكتب اسم المشروع: `sider-platform`
5. اضغط "Create Repl"

### الخطوة 2: رفع الملفات

**طريقة 1: السحب والإفلات**
- اسحب كل الملفات والمجلدات إلى Replit مباشرة

**طريقة 2: رفع ملف ZIP**
1. ضع كل الملفات في مجلد واحد
2. اضغط بزر الماوس الأيمن → Compress/ZIP
3. في Replit، اضغط على الثلاث نقاط بجانب Files
4. اختر "Upload file"
5. ارفع ملف ZIP
6. في Shell اكتب: `unzip sider-platform.zip`

**طريقة 3: عن طريق GitHub**
1. ارفع الملفات على GitHub repository
2. في Replit، اختر "Import from GitHub"
3. الصق رابط الـ repository

### الخطوة 3: إعداد قاعدة البيانات المجانية

اختر إحدى الطرق التالية:

#### 🐘 ElephantSQL (الأسهل - موصى به)

1. اذهب إلى: https://www.elephantsql.com
2. اضغط "Get a managed database today"
3. سجل حساب مجاني (Sign up)
4. اضغط "Create New Instance"
5. املأ المعلومات:
   - Name: `sider-db`
   - Plan: اختر "Tiny Turtle (Free)"
6. اضغط "Select Region"
7. اختر أقرب منطقة جغرافية
8. اضغط "Review" ثم "Create instance"
9. اضغط على اسم القاعدة الجديدة
10. احفظ هذه المعلومات:
    - **Server**: مثل `trumpet.db.elephantsql.com`
    - **User & Default database**: نفس القيمة
    - **Password**: الباسورد الطويل

#### 🔷 Supabase (بديل ممتاز)

1. اذهب إلى: https://supabase.com
2. اضغط "Start your project"
3. سجل حساب مجاني
4. اضغط "New project"
5. املأ المعلومات:
   - Name: `sider-platform`
   - Database Password: اختر باسورد قوي
   - Region: اختر أقرب منطقة
6. اضغط "Create new project"
7. انتظر حتى يكتمل الإعداد (1-2 دقيقة)
8. اذهب إلى Settings → Database
9. احفظ معلومات Connection pooling:
   - Host
   - Database name
   - User
   - Password
   - Port

### الخطوة 4: إعداد Secrets في Replit

1. في Replit، ابحث عن أيقونة 🔒 في القائمة الجانبية
2. اضغط عليها لفتح "Secrets"
3. أضف المتغيرات التالية واحداً تلو الآخر:

```env
# معلومات قاعدة البيانات
DB_HOST = [الصق Server من ElephantSQL/Supabase]
DB_PORT = 5432
DB_NAME = [الصق Database name]
DB_USER = [الصق User]
DB_PASSWORD = [الصق Password]

# إعدادات السيرفر
PORT = 3000
NODE_ENV = production
BASE_URL = https://sider-platform.YOUR-USERNAME.repl.co

# مفاتيح الأمان (غيّرها!)
JWT_SECRET = SiderPlatform2024SecretKeyPleaseChangeThis
SESSION_SECRET = AnotherRandomSecretForSessions2024

# Google OAuth (اختياري - يمكن إضافته لاحقاً)
GOOGLE_CLIENT_ID = (اتركه فارغاً الآن)
GOOGLE_CLIENT_SECRET = (اتركه فارغاً الآن)
GOOGLE_CALLBACK_URL = https://sider-platform.YOUR-USERNAME.repl.co/auth/google/callback

# Facebook OAuth (اختياري)
FACEBOOK_APP_ID = (اتركه فارغاً الآن)
FACEBOOK_APP_SECRET = (اتركه فارغاً الآن)
FACEBOOK_CALLBACK_URL = https://sider-platform.YOUR-USERNAME.repl.co/auth/facebook/callback
```

**⚠️ مهم:**
- غيّر `YOUR-USERNAME` باسم مستخدمك في Replit
- غيّر `JWT_SECRET` و `SESSION_SECRET` إلى قيم عشوائية

### الخطوة 5: تشغيل المشروع

في Replit Shell (أسفل الشاشة):

```bash
# 1. تثبيت الحزم
npm install
```

انتظر حتى يكتمل التثبيت (1-2 دقيقة)

```bash
# 2. إنشاء قاعدة البيانات والجداول
node setup.js
```

يجب أن ترى رسائل نجاح مثل:
```
✅ UUID extension enabled
✅ Users table created
✅ Teacher profiles table created
...
✨ Database setup completed successfully!
```

```bash
# 3. تشغيل السيرفر
npm start
```

أو اضغط زر "Run" الأخضر في أعلى الصفحة

### الخطوة 6: اختبار المنصة

1. اضغط على زر "Open in new tab" في Replit
2. أو اذهب مباشرة إلى:
   ```
   https://sider-platform.YOUR-USERNAME.repl.co/login.html
   ```

3. يجب أن ترى صفحة تسجيل الدخول مع:
   - اللوجو المتحرك
   - خيارات التسجيل
   - أزرار Google و Facebook (حتى لو لم تعملها بعد)

### الخطوة 7: إنشاء حساب مدرس واختبار

1. في صفحة Login، اضغط "إنشاء حساب"
2. املأ البيانات:
   - الاسم الكامل
   - البريد الإلكتروني
   - رقم الهاتف
   - كلمة المرور
   - اختر "مدرس" 👨‍🏫
3. اضغط "إنشاء حساب"
4. يجب أن تُنقل تلقائياً إلى Dashboard المدرس
5. جرّب:
   - إضافة كورس جديد
   - رفع صورة للكورس
   - إضافة درس
   - رفع فيديو (حتى 100MB)

---

## ✅ Checklist - تأكد من كل شيء

- [ ] قاعدة البيانات تم إنشاؤها على ElephantSQL/Supabase
- [ ] جميع الملفات مرفوعة على Replit
- [ ] Secrets تم إضافتها بشكل صحيح
- [ ] `npm install` تم بنجاح بدون أخطاء
- [ ] `node setup.js` تم بنجاح وظهرت علامات ✅
- [ ] السيرفر يعمل على port 3000
- [ ] صفحة Login تفتح بدون مشاكل
- [ ] يمكن إنشاء حساب جديد
- [ ] Dashboard المدرس يظهر بشكل صحيح
- [ ] يمكن إضافة كورس جديد
- [ ] يمكن رفع صور
- [ ] يمكن رفع فيديوهات

---

## 🔧 حل المشاكل الشائعة

### ❌ خطأ: "Cannot find module"

**الحل:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ خطأ: "connect ECONNREFUSED"

**السبب:** لا يمكن الاتصال بقاعدة البيانات

**الحل:**
1. تحقق من صحة معلومات DB في Secrets
2. تأكد من أن قاعدة البيانات شغالة على ElephantSQL/Supabase
3. جرّب الاتصال مباشرة من ElephantSQL Console

### ❌ خطأ: "Port 3000 is already in use"

**الحل:**
- اضغط "Stop" ثم "Run" مرة أخرى
- أو أعد تشغيل Repl كاملاً

### ❌ صفحة Login لا تفتح

**الحل:**
```bash
# تأكد من وجود المجلد public
ls -la public/

# إذا لم يكن موجوداً
mkdir -p public
# ثم ارفع ملفات HTML مرة أخرى
```

### ❌ لا يمكن رفع الفيديوهات

**الحل:**
```bash
# أنشئ المجلدات المطلوبة
mkdir -p uploads/videos uploads/images
chmod 755 uploads uploads/videos uploads/images
```

### ❌ Google/Facebook OAuth لا يعمل

**ملاحظة:** هذا طبيعي إذا لم تعد OAuth بعد!

**للتشغيل بدون OAuth:**
- استخدم التسجيل العادي بالإيميل والباسورد
- يمكنك إعداد OAuth لاحقاً (راجع README.md)

---

## 🎯 خطوات ما بعد التشغيل

### 1. تغيير باسورد الأدمن

```sql
-- استخدم هذا الكود في database console:
UPDATE users 
SET password_hash = '$2a$10$[new-hash-here]' 
WHERE email = 'admin@sider.com';
```

أو سجل دخول كأدمن وغيّر الباسورد من الإعدادات

### 2. إعداد Google OAuth (اختياري)

راجع القسم الخاص في `README.md`

### 3. إعداد Facebook OAuth (اختياري)

راجع القسم الخاص في `README.md`

### 4. إعداد بوابة الدفع Paymob

1. سجل حساب على [Paymob.com](https://paymob.com)
2. احصل على:
   - API Key
   - Integration ID
   - iFrame ID
   - HMAC Secret
3. أضفها في Replit Secrets

### 5. ربط Domain خاص (اختياري)

في Replit:
1. اذهب إلى Settings
2. قسم Domains
3. اربط الدومين الخاص بك

---

## 📱 استخدام المنصة

### حساب الأدمن الافتراضي:
```
Email: admin@sider.com
Password: admin123
```

### إنشاء حساب مدرس:
1. اذهب لصفحة Login
2. اختر "إنشاء حساب"
3. اختر دور "مدرس"
4. املأ البيانات

### إضافة كورس:
1. من Dashboard المدرس
2. "كورساتي" → "+ إضافة كورس جديد"
3. املأ البيانات وارفع صورة
4. احفظ

### إضافة دروس:
1. افتح الكورس
2. "الدروس" → "إضافة درس"
3. ارفع الفيديو (شريط التقدم سيظهر)
4. احفظ

### نشر الكورس:
1. بعد إضافة الدروس
2. اضغط "نشر"
3. سيذهب للمراجعة من الأدمن
4. الأدمن يقبل أو يرفض

---

## 🎨 تخصيص المنصة

### تغيير الألوان:

في `public/teacher-dashboard.html` و `public/login.html`

ابحث عن:
```css
:root {
  --coral-red: #E94560;
  --dark-red: #C0392B;
  --gold: #F5C518;
  --dark-bg: #0F0F1A;
  --card-bg: #1A1A2E;
}
```

غيّر القيم حسب ذوقك!

### تغيير اللوجو:

ابحث عن `<svg class="logo-svg">` وعدّل شكل SVG

---

## 📞 محتاج مساعدة؟

1. **راجع QUICKSTART.md** للتعليمات السريعة
2. **راجع README.md** للدليل الكامل
3. **تحقق من Console** في Replit للأخطاء
4. **جرّب إعادة تشغيل** السيرفر

---

## 🌟 مميزات جاهزة للاستخدام:

✅ تسجيل دخول آمن  
✅ Dashboard مدرس متقدم  
✅ رفع فيديوهات مع progress bar  
✅ إدارة كورسات كاملة  
✅ نظام موافقات الأدمن  
✅ قاعدة بيانات قوية  
✅ تصميم عصري متجاوب  
✅ لوجو متحرك  
✅ دعم كامل للعربية  
✅ حسابات ولي أمر  

---

## 🎉 مبروك!

منصتك التعليمية الآن جاهزة وشغالة 100%! 🚀

**لا تنسَ:**
- غيّر باسورد الأدمن
- غيّر JWT_SECRET
- اعمل Backup لقاعدة البيانات

---

**بالتوفيق في مشروعك! ✨**

أي سؤال أو استفسار، راجع الملفات الأخرى أو Console للأخطاء.
