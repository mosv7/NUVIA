# تشغيل NUVIA

المشروع متقسم إلى `apps/web` للـReact، و`apps/api` للـNode/Express/Mongoose، و`apps/ai-service` كهيكل FastAPI أساسي لفحص التشغيل فقط. تحليل الـAI لسه مش منفذ. كود JavaScript الحالي محفوظ؛ TypeScript خطوة منفصلة.

## أول تشغيل

استخدم Node.js >=22.13 وpnpm 11.25.0. لو pnpm مش موجود، ثبّته بـ`npm install --global pnpm@11.25.0`، ثم من جذر المشروع:

```sh
pnpm install --frozen-lockfile
pnpm setup:local
```

ضيف اتصال MongoDB في `.env` مع الحفاظ على مفتاح البريد المتولد. استخدم Atlas أو MongoDB محلية شغالة كـreplica set؛ النسخة standalone مش كفاية للمعاملات. ما ترفعش بيانات الاتصال أو الرسائل على Git.

```sh
pnpm db:check
pnpm db:setup
pnpm dev
```

الأمر الأخير بيشغّل الفرونت والـAPI وعامل البريد مع بعض. Ctrl+C بيوقف المجموعة اللي شغّلها. مش بيشغّل MongoDB ولا بيغيّر الداتابيز تلقائيًا. `START-LAPTOP.cmd` بيشغّل نفس المجموعة على Windows بعد الإعداد.

افتح `http://127.0.0.1:5173/#/signup`. بعد التسجيل افتح رسالة التأكيد المناسبة في `.local/mail/` واتبع الرابط الموجود في `text`، ثم سجّل الدخول واحفظ النشاط والفرع. جرّب Refresh والخروج والدخول للتأكد من استمرار البيانات. رسائل التطوير محلية، مش بتوصل Gmail؛ الإرسال الحقيقي يحتاج SMTP.

شاشة Overview وFeedback الفاضية متوقعة؛ الاستبيانات واستقبال الردود والتحليل لسه مش منفذين. المعاينات ببيانات تجريبية موجودة في `/preview/`، وممكن تشغيلها بدون باك بـ`pnpm dev:web`.

للتشغيل المنفصل استخدم `pnpm dev:web` و`pnpm dev:api` و`pnpm mail:work`، كل أمر في تيرمنال لوحده. ما تشغّلش الأوامر المنفصلة مع `pnpm dev` على نفس البورتات.

## اختياري للمطورين

- FastAPI: استخدم Python >=3.11 وuv، ثم `uv sync --project apps/ai-service --locked` و`pnpm dev:ai`. الموجود فحص liveness فقط على بورت 8000، مش تحليل.
- Docker: بعد تشغيل Docker وتجهيز مفتاح البريد، `docker compose up --build -d` بيشغّل بيئة محلية منفصلة بداتابيز خاصة بها. الحسابات الموجودة في Atlas أو الداتابيز المحلية الأخرى مش بتتنقل تلقائيًا. التفاصيل في [دليل البنية المحلية](../infra/README.md).
- الاختبارات: `pnpm test` و`pnpm test:e2e:accounts`، وفحوصات الكود `pnpm lint` و`pnpm format:check` و`pnpm build`.

راجع [README](../README.md)، و[دليل التطوير](development/monorepo.md)، و[عقود الـAPI](api/README.md)، و[الموديلز](architecture/mongodb-models.md). الفيتشر ليست الشاملة في [خريطة المشروع](product/feature-list.md).
