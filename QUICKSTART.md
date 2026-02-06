# 🚀 دليل البدء السريع - Sider Platform

## خطوات التشغيل على Replit (5 دقائق فقط!)

### 1️⃣ رفع المشروع على Replit

1. اذهب إلى [Replit.com](https://replit.com)
2. اضغط "+ Create Repl"
3. اختر "Import from GitHub" أو "Upload files"
4. ارفع جميع الملفات

### 2️⃣ إنشاء قاعدة بيانات مجانية

**الطريقة الأولى: ElephantSQL (الأسهل)**

1. اذهب إلى [ElephantSQL.com](https://www.elephantsql.com/)
2. سجل حساب مجاني
3. اضغط "Create New Instance"
4. اختر "Tiny Turtle (Free)"
5. اختر اسم للقاعدة واضغط "Select Region"
6. اختر أقرب منطقة لك
7. اضغط "Review" ثم "Create Instance"
8. احفظ معلومات الاتصال:
   - Server
   - User & Default database
   - Password

**الطريقة الثانية: Supabase**

1. اذهب إلى [Supabase.com](https://supabase.com)
2. سجل حساب مجاني
3. اضغط "New Project"
4. املأ البيانات واحفظ الباسورد
5. في Settings > Database، احفظ معلومات Connection

### 3️⃣ إعداد المتغيرات في Replit

في Replit، اضغط على الأيقونة 🔒 (Secrets) في القائمة الجانبية:

```
DB_HOST = [من ElephantSQL أو Supabase]
DB_PORT = 5432
DB_NAME = [اسم القاعدة]
DB_USER = [اسم المستخدم]
DB_PASSWORD = [الباسورد]

JWT_SECRET = Sider2024SecretKeyChangeThis
SESSION_SECRET = AnotherRandomSecretKey2024

PORT = 3000
NODE_ENV = production
BASE_URL = https://[اسم-repl-الخاص-بك].repl.co
```

### 4️⃣ تشغيل المشروع

في Replit Shell (أسفل الشاشة):

```bash
# تثبيت الحزم
npm install

# إنشاء قاعدة البيانات
node setup.js

# تشغيل السيرفر
npm start
```

### 5️⃣ اختبار المنصة

1. اضغط "Open in new tab" في Replit
2. أو اذهب إلى: `https://[اسم-repl-الخاص-بك].repl.co/login.html`
3. سجل حساب جديد كمدرس
4. استمتع! 🎉

---

## ⚡ للتشغيل بدون Google/Facebook OAuth

إذا لم تكن تريد إعداد OAuth الآن، يمكنك:

1. حذف الأزرار من `login.html`:
```javascript
// احذف أو علّق على هذا الكود:
<a href="/auth/google" class="btn-social btn-google">
<a href="/auth/facebook" class="btn-social btn-facebook">
```

2. استخدم التسجيل العادي بالإيميل والباسورد

---

## 🎯 حساب الأدمن الافتراضي

```
البريد: admin@sider.com
الباسورد: admin123
```

**⚠️ مهم جداً:** غيّر باسورد الأدمن بعد أول تسجيل دخول!

---

## 🎥 إعداد رفع الفيديوهات

### إنشاء المجلدات المطلوبة

في Replit Shell:

```bash
mkdir -p uploads/videos
mkdir -p uploads/images
```

أو يدوياً:
1. اضغط "Add folder" في Replit
2. أنشئ مجلد `uploads`
3. داخله أنشئ `videos` و `images`

---

## 🔧 حل المشاكل السريع

### المشكلة: "Cannot connect to database"

**الحل:**
```bash
# تحقق من معلومات قاعدة البيانات في Secrets
# تأكد من أن القاعدة شغالة على ElephantSQL/Supabase
# جرّب إعادة تشغيل السيرفر
```

### المشكلة: "Module not found"

**الحل:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: "Port already in use"

**الحل:**
- أعد تشغيل Repl كله
- أو غيّر PORT في Secrets

---

## 📱 استخدام المنصة

### كمدرس:

1. **إنشاء حساب:**
   - اذهب لصفحة Login
   - اضغط "إنشاء حساب"
   - اختر "مدرس"
   - املأ البيانات

2. **إضافة كورس:**
   - من Dashboard، اضغط "كورساتي"
   - اضغط "+ إضافة كورس جديد"
   - املأ البيانات وارفع صورة
   - احفظ

3. **إضافة دروس:**
   - افتح الكورس
   - اضغط "الدروس"
   - ارفع الفيديوهات (حتى 100MB)
   - احفظ

4. **نشر الكورس:**
   - بعد إضافة الدروس
   - اضغط "نشر"
   - انتظر موافقة الأدمن

### كأدمن:

1. سجل دخول بحساب الأدمن
2. اذهب لـ "الكورسات المعلقة"
3. راجع الكورسات
4. اقبل أو ارفض

---

## 🎨 تخصيص المنصة

### تغيير الألوان:

في ملف `teacher-dashboard.html` و `login.html`:

```css
:root {
  --coral-red: #E94560;    /* غيّر هنا */
  --gold: #F5C518;         /* وهنا */
}
```

### تغيير اللوجو:

ابحث عن `<svg class="logo-svg">` في الملفات وعدّله

---

## ✅ Checklist للتأكد من كل شيء يعمل

- [ ] قاعدة البيانات متصلة
- [ ] ملف .env أو Secrets مضبوط
- [ ] المجلدات uploads/videos و uploads/images موجودة
- [ ] npm install تم بنجاح
- [ ] node setup.js تم بنجاح
- [ ] السيرفر شغال على port 3000
- [ ] يمكن فتح صفحة Login
- [ ] يمكن إنشاء حساب جديد
- [ ] يمكن تسجيل الدخول
- [ ] Dashboard المدرس يفتح
- [ ] يمكن إضافة كورس
- [ ] يمكن رفع فيديو

---

## 🎉 مبروك!

لو وصلت لهنا يبقى المنصة شغالة 100% 🚀

### خطوات إضافية (اختيارية):

1. **إعداد Google OAuth** (راجع README.md)
2. **إعداد Facebook OAuth** (راجع README.md)
3. **إعداد Paymob** (للدفع الفوري)
4. **إضافة Domain خاص بك**

---

## 📞 محتاج مساعدة؟

1. راجع `README.md` للتفاصيل الكاملة
2. تحقق من Console في Replit للأخطاء
3. جرّب إعادة تشغيل السيرفر

---

**بالتوفيق! 🌟**
