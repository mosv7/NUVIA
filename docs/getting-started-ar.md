# تشغيل NUVIA

الباك يستخدم Node.js وMongoDB. خدمة الذكاء الاصطناعي Python/FastAPI ستكون مرحلة لاحقة.

## التشغيل على اللابتوب

أول مرة من فولدر المشروع:

```cmd
npm ci
npm run setup:local
npm run db:check
```

احتفظ ببيانات Atlas في `.local/config/atlas-credentials.env` أو `.env` فقط؛ الملفات دي مستبعدة من Git. ملف `.env.example` يوضح أسماء الإعدادات بدون أسرار.

افتح ثلاثة تيرمنال وشغّل أمرًا في كل واحد:

```cmd
npm run dev:backend
```

```cmd
npm run mail:work
```

```cmd
npm run dev
```

افتح `http://127.0.0.1:5173/#/signup`. بعد التسجيل افتح أحدث رسالة تأكيد داخل `.local/mail/` محليًا واتبع الرابط في `text`، ثم سجّل الدخول واحفظ بيانات النشاط والفرع. الرسائل محلية أثناء التطوير؛ إرسال بريد حقيقي يحتاج إعداد SMTP.

`START-LAPTOP.cmd` يشغّل الفرونت، والباك وعامل البريد يحتاجان التيرمنالين الآخرين.

للمعاينة التجريبية بدون باك: `http://127.0.0.1:5173/preview/#/dashboard`. بيانات العرض والمساعد التجريبي منفصلان عن حسابك الحقيقي.

تفاصيل الإعداد والأوامر في [دليل الباك](development/backend.md). الشغل على فرع `codex/backend-foundation`؛ دمج `main` يحتاج مراجعة الـPR. لا تستخدم force push.
