// PLACEHOLDER: All names, locations, experience, and project details below are fictional demo content.
window.PORTFOLIO_DATA = {
  defaultLocale: "en",
  localeNames: { en: "English", ar: "العربية" },
  settings: {
    // PLACEHOLDER: Replace with the access key from your Web3Forms dashboard.
    web3FormsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  },
  locales: {
    en: {
      direction: "ltr",
      documentTitle: "Omar Khalil — Systems Engineer & Android Developer",
      description:
        "Portfolio of Omar Khalil, a Computer Systems Engineering student exploring Android development and low-level systems programming.",
      status: {
        regionLabel: "Profile status",
        name: "Omar Khalil",
        locationLabel: "LOCATION",
        location: "Amman, Jordan",
        localTimeLabel: "LOCAL TIME",
        available: "Open to internships",
      },
      skipLink: "Skip to content",
      navigation: {
        label: "Main navigation",
        about: "About",
        skills: "Skills",
        projects: "Projects",
        contact: "Contact",
      },
      live: {
        uptimeLabel: "UPTIME",
        scrollLabel: "Scroll progress",
        backToTop: "Back to top",
        footerBuild: "Built with HTML / CSS / JS",
      },
      controls: {
        languageLabel: "Switch language",
        languageTarget: "العربية",
        localeCode: "EN",
        themeLabel: "Toggle light theme",
        lightMode: "LIGHT",
        darkMode: "DARK",
      },
      hero: {
        eyebrow: "SYSTEMS ENGINEERING / ANDROID",
        title: "Systems-minded engineer. Android developer.",
        titleParts: [
          { text: "Systems-minded engineer. " },
          { text: "Android developer.", accent: true },
        ],
        description:
          "Computer Systems Engineering student building Android apps with Kotlin and exploring how software interacts with hardware through C++, Linux, and systems projects.",
        projectsLink: "Inspect selected projects",
        contactLink: "Contact",
        metrics: [
          { label: "PROJECTS", value: 3, suffix: "" },
          { label: "YEARS BUILDING", value: 2, suffix: "+" },
          { label: "CORE LANGUAGES", value: 4, suffix: "" },
        ],
        specLabel: "PROFILE / 0001",
        diagramLabel: "Android system architecture",
        architecture: [
          { id: "hardware", label: "Hardware" },
          { id: "kernel", label: "Kernel" },
          { id: "drivers", label: "Drivers" },
          { id: "runtime", label: "Android Runtime" },
          { id: "app", label: "App" },
        ],
        terminal: {
          label: "TERMINAL / SESSION 01",
          windowTitle: "systems-shell — active",
          tabs: ["console", "logcat"],
          prompt: "engineer@systems:~$",
          accessibleLabel: "Illustrative terminal session",
          steps: [
            { command: "id -un", output: "systems-engineering-student" },
            { command: "printf '%s\\n' Android Kotlin C++ Linux", output: "Android · Kotlin · C++ · Linux" },
          ],
          // PLACEHOLDER: These lines are illustrative, not commands from a real environment.
          showAnimation: true,
          logLevels: [
            { level: "I", message: "runtime initialized · pid=2048" },
            { level: "D", message: "frame scheduler ready · 60Hz" },
            { level: "W", message: "cache nearing soft limit · 82%" },
            { level: "E", message: "sample fault event · handled" },
          ],
        },
        monitor: {
          title: "SYSTEM MONITOR",
          liveLabel: "LIVE",
          labels: { cpu: "CPU", memory: "MEMORY", network: "NETWORK" },
          units: { cpu: "%", memory: "MiB", network: "Mb/s" },
          // PLACEHOLDER: Seed drives deterministic simulated readings, not real device telemetry.
          seed: 27,
        },
        now: {
          label: "NOW",
          title: "Prototyping system telemetry",
          updated: "Updated today · 09:40",
          status: "IN PROGRESS",
        },
        spec: [
          ["ROLE", "Systems Engineering Student", "layers"],
          ["FOCUS", "Android / Kotlin / Compose", "android"],
          ["SYSTEMS", "C++ / Linux", "chip"],
          ["BASED IN", "Amman, Jordan", "location"],
        ],
      },
      about: {
        index: "01 / ABOUT",
        title: "A systems-first perspective",
        circuitLabel: "Simplified systems circuit diagram",
        activityLabel: "Contribution activity over the last 52 weeks",
        activityHeading: "ACTIVITY / LAST 52 WEEKS",
        // PLACEHOLDER: Deterministic generated activity levels are for visual demonstration only.
        activitySeed: 27,
        paragraphs: [
          "I am a Computer Systems Engineering student who enjoys turning practical problems into small, maintainable Android applications.",
          "Alongside Kotlin development, I study computer architecture, Linux, and C++ to better understand the layers beneath an app.",
        ],
        // PLACEHOLDER: Example-only figures; replace with accurate personal numbers before publishing.
        metrics: [
          { label: "YEARS BUILDING PROJECTS", value: 2, suffix: "+" },
          { label: "PROJECTS", value: 3, suffix: "" },
        ],
      },
      skills: {
        index: "02 / SKILLS",
        title: "Technical toolkit",
        groups: [
          { name: "Languages", items: ["Kotlin", "C++", "C", "Bash", "JavaScript"] },
          { name: "Platforms", items: ["Android", "Linux"] },
          {
            name: "Tools",
            items: ["Jetpack Compose", "Room", "Coroutines", "Git", "CMake"],
          },
        ],
      },
      projects: {
        index: "03 / PROJECTS",
        title: "Selected work",
        columns: {
          name: "PROJECT",
          type: "TYPE",
          technologies: "TECH STACK",
          year: "YEAR",
          status: "STATUS",
        },
        stats: { stars: "STARS", forks: "FORKS", loc: "LINES" },
        links: {
          source: "Source",
          live: "Live",
          sourcePending: "Source pending",
          livePending: "Live preview pending",
        },
        architectureLabel: "Architecture",
        projectStates: {
          active: "ACTIVE",
          maintained: "MAINTAINED",
          archived: "ARCHIVED",
        },
        items: [
          {
            name: "Daymark — Task Planner",
            type: "Android",
            category: "android",
            lifecycle: "active",
            technologies: ["Kotlin", "Compose", "Room", "Coroutines"],
            architecture: ["Compose UI", "ViewModel", "Room"],
            previewLines: ["Good morning, Omar", "3 tasks today", "Review architecture notes"],
            loc: "1.2k",
            year: "2026",
            status: "Prototype",
            description:
              "A local-first task planner concept with daily lists, Room persistence, and a simple Compose interface. Demo entry; implementation and outcomes are illustrative.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: Demo values only; replace with the real repository and its statistics.
            fallbackStats: { stars: "0", forks: "0" },
          },
          {
            name: "Procscope — Process Explorer",
            type: "Systems",
            category: "systems",
            lifecycle: "maintained",
            technologies: ["C++", "Linux", "CMake"],
            architecture: ["CLI", "/proc", "Linux kernel"],
            previewLines: ["$ procscope --sort cpu", "PID 2048  12.4%", "PID 1120   4.8%"],
            loc: "860",
            year: "2025",
            status: "Study project",
            description:
              "A command-line exploration of Linux process and memory information, designed to practice systems programming and resource handling. Demo entry; details are illustrative.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: Demo values only; replace with the real repository and its statistics.
            fallbackStats: { stars: "0", forks: "0" },
          },
          {
            name: "Pulseboard — Runtime Console",
            type: "Web",
            category: "web",
            lifecycle: "active",
            technologies: ["HTML", "CSS", "JavaScript", "SVG"],
            architecture: ["UI", "SVG charts", "Telemetry state"],
            previewLines: ["Runtime / status", "CPU 42% · MEM 68%", "Last sync · 1s ago"],
            loc: "540",
            year: "2026",
            status: "Demo",
            description:
              "A compact browser-based system dashboard concept with SVG telemetry charts and a responsive status view. Demo entry; readings and implementation details are illustrative.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: Demo values only; replace with the real repository and its statistics.
            fallbackStats: { stars: "0", forks: "0" },
          },
        ],
      },
      contact: {
        index: "04 / CONTACT",
        title: "Start a conversation",
        socialLabel: "Contact links",
        description:
          "For project enquiries, collaboration, or technical discussions, send a message below.",
        links: {
          // PLACEHOLDER: Add verified public profile URLs.
          email: { label: "Email", href: "" },
          github: { label: "GitHub", href: "" },
          linkedin: { label: "LinkedIn", href: "" },
        },
        responseTime: {
          label: "RESPONSE TIME",
          value: "Usually within 2 days",
        },
        form: {
          nameLabel: "NAME",
          emailLabel: "EMAIL",
          messageLabel: "MESSAGE",
          submit: "Send message",
          sending: "Sending…",
          success: "Message sent. Thank you.",
          error: "Message could not be sent. Please try again.",
          validationError: "Check the highlighted fields before sending.",
          setup: "Add your Web3Forms access key in data/data.js to enable sending.",
        },
      },
      footer: { copyright: "© 2026 Omar Khalil", version: "v1.0" },
    },
    ar: {
      direction: "rtl",
      documentTitle: "عمر خليل — مهندس أنظمة ومطوّر Android",
      description:
        "ملف أعمال عمر خليل، طالب هندسة أنظمة حاسوب يستكشف تطوير Android وبرمجة الأنظمة منخفضة المستوى.",
      status: {
        regionLabel: "حالة الملف الشخصي",
        name: "عمر خليل",
        locationLabel: "الموقع",
        location: "عمّان، الأردن",
        localTimeLabel: "التوقيت المحلي",
        available: "متاح للتدريب",
      },
      skipLink: "انتقل إلى المحتوى",
      navigation: {
        label: "التنقل الرئيسي",
        about: "عنّي",
        skills: "المهارات",
        projects: "المشاريع",
        contact: "التواصل",
      },
      live: {
        uptimeLabel: "مدة التشغيل",
        scrollLabel: "تقدّم التمرير",
        backToTop: "العودة للأعلى",
        footerBuild: "بُني باستخدام HTML / CSS / JS",
      },
      controls: {
        languageLabel: "تغيير اللغة",
        languageTarget: "English",
        localeCode: "AR",
        themeLabel: "تبديل المظهر الفاتح",
        lightMode: "فاتح",
        darkMode: "داكن",
      },
      hero: {
        eyebrow: "هندسة الأنظمة / أندرويد",
        title: "مهندس بعقلية الأنظمة. مطوّر أندرويد.",
        titleParts: [
          { text: "مهندس بعقلية الأنظمة. " },
          { text: "مطوّر أندرويد.", accent: true },
        ],
        description:
          "طالب هندسة أنظمة حاسوب يبني تطبيقات Android باستخدام Kotlin، ويستكشف تفاعل البرمجيات مع العتاد عبر C++ وLinux ومشاريع الأنظمة.",
        projectsLink: "استعرض المشاريع المختارة",
        contactLink: "تواصل معي",
        metrics: [
          { label: "المشاريع", value: 3, suffix: "" },
          { label: "سنوات تطوير", value: 2, suffix: "+" },
          { label: "لغات أساسية", value: 4, suffix: "" },
        ],
        specLabel: "الملف / 0001",
        diagramLabel: "مخطط معمارية نظام Android",
        architecture: [
          { id: "hardware", label: "العتاد" },
          { id: "kernel", label: "النواة" },
          { id: "drivers", label: "المشغّلات" },
          { id: "runtime", label: "بيئة Android" },
          { id: "app", label: "التطبيق" },
        ],
        terminal: {
          label: "الطرفية / الجلسة 01",
          windowTitle: "systems-shell — نشطة",
          tabs: ["console", "logcat"],
          prompt: "engineer@systems:~$",
          accessibleLabel: "جلسة طرفية توضيحية",
          steps: [
            { command: "id -un", output: "systems-engineering-student" },
            { command: "printf '%s\\n' Android Kotlin C++ Linux", output: "Android · Kotlin · C++ · Linux" },
          ],
          // PLACEHOLDER: These lines are illustrative, not commands from a real environment.
          showAnimation: true,
          logLevels: [
            { level: "I", message: "تم تهيئة بيئة التشغيل · pid=2048" },
            { level: "D", message: "مجدول الإطارات جاهز · 60Hz" },
            { level: "W", message: "الذاكرة المؤقتة تقترب من الحد · 82%" },
            { level: "E", message: "حدث خطأ تجريبي · تمت معالجته" },
          ],
        },
        monitor: {
          title: "مراقبة النظام",
          liveLabel: "مباشر",
          labels: { cpu: "المعالج", memory: "الذاكرة", network: "الشبكة" },
          units: { cpu: "%", memory: "MiB", network: "Mb/s" },
          // PLACEHOLDER: البذرة تولّد قراءات محاكاة ثابتة النمط، وليست قياسات حقيقية للجهاز.
          seed: 27,
        },
        now: {
          label: "الآن",
          title: "أطوّر نموذجًا لمراقبة النظام",
          updated: "آخر تحديث · 09:40",
          status: "قيد العمل",
        },
        spec: [
          ["الدور", "طالب هندسة أنظمة حاسوب", "layers"],
          ["التخصص", "Android / Kotlin / Compose", "android"],
          ["الأنظمة", "C++ / Linux", "chip"],
          ["الموقع", "عمّان، الأردن", "location"],
        ],
      },
      about: {
        index: "01 / عنّي",
        title: "منظور يبدأ من الأنظمة",
        circuitLabel: "رسم مبسّط لدائرة أنظمة",
        activityLabel: "مخطط نشاط توضيحي خلال آخر 52 أسبوعًا",
        activityHeading: "النشاط / آخر 52 أسبوعًا",
        // PLACEHOLDER: مستويات النشاط المولّدة ثابتة للتوضيح البصري فقط.
        activitySeed: 27,
        paragraphs: [
          "أنا طالب هندسة أنظمة حاسوب أستمتع بتحويل المشكلات العملية إلى تطبيقات Android صغيرة وسهلة الصيانة.",
          "إلى جانب تطوير Kotlin، أدرس معمارية الحاسوب وLinux وC++ لفهم الطبقات التي تعمل أسفل التطبيق.",
        ],
        // PLACEHOLDER: أرقام توضيحية فقط؛ استبدلها بأرقامك الدقيقة قبل النشر.
        metrics: [
          { label: "سنوات تطوير المشاريع", value: 2, suffix: "+" },
          { label: "المشاريع", value: 3, suffix: "" },
        ],
      },
      skills: {
        index: "02 / المهارات",
        title: "الأدوات التقنية",
        groups: [
          { name: "لغات البرمجة", items: ["Kotlin", "C++", "C", "Bash", "JavaScript"] },
          { name: "المنصات", items: ["Android", "Linux"] },
          {
            name: "الأدوات",
            items: ["Jetpack Compose", "Room", "Coroutines", "Git", "CMake"],
          },
        ],
      },
      projects: {
        index: "03 / المشاريع",
        title: "أعمال مختارة",
        columns: {
          name: "المشروع",
          type: "النوع",
          technologies: "التقنيات",
          year: "السنة",
          status: "الحالة",
        },
        stats: { stars: "النجوم", forks: "التفرعات", loc: "الأسطر" },
        links: {
          source: "المصدر",
          live: "معاينة مباشرة",
          sourcePending: "المصدر غير متاح",
          livePending: "المعاينة غير متاحة",
        },
        architectureLabel: "المعمارية",
        projectStates: {
          active: "نشط",
          maintained: "قيد الصيانة",
          archived: "مؤرشف",
        },
        items: [
          {
            name: "Daymark — مخطّط المهام",
            type: "Android",
            category: "android",
            lifecycle: "active",
            technologies: ["Kotlin", "Compose", "Room", "Coroutines"],
            architecture: ["واجهة Compose", "ViewModel", "Room"],
            previewLines: ["صباح الخير، عمر", "3 مهام اليوم", "مراجعة ملاحظات المعمارية"],
            loc: "1.2k",
            year: "2026",
            status: "نموذج أولي",
            description:
              "تصوّر لمخطّط مهام محلي يتضمن قوائم يومية وتخزين Room وواجهة Compose بسيطة. هذا إدخال توضيحي؛ التنفيذ والنتائج افتراضية.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: قيم توضيحية؛ أضف المستودع الحقيقي وإحصاءاته.
            fallbackStats: { stars: "0", forks: "0" },
          },
          {
            name: "Procscope — مستكشف العمليات",
            type: "أنظمة",
            category: "systems",
            lifecycle: "maintained",
            technologies: ["C++", "Linux", "CMake"],
            architecture: ["سطر الأوامر", "/proc", "نواة Linux"],
            previewLines: ["$ procscope --sort cpu", "PID 2048  12.4%", "PID 1120   4.8%"],
            loc: "860",
            year: "2025",
            status: "مشروع دراسي",
            description:
              "استكشاف عبر سطر الأوامر لمعلومات العمليات والذاكرة في Linux، بهدف التدريب على برمجة الأنظمة وإدارة الموارد. هذا إدخال توضيحي وتفاصيله افتراضية.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: قيم توضيحية؛ أضف المستودع الحقيقي وإحصاءاته.
            fallbackStats: { stars: "0", forks: "0" },
          },
          {
            name: "Pulseboard — لوحة التشغيل",
            type: "Web",
            category: "web",
            lifecycle: "active",
            technologies: ["HTML", "CSS", "JavaScript", "SVG"],
            architecture: ["واجهة", "مخططات SVG", "حالة القياسات"],
            previewLines: ["التشغيل / الحالة", "CPU 42% · MEM 68%", "آخر تحديث · قبل ثانية"],
            loc: "540",
            year: "2026",
            status: "تجريبي",
            description:
              "تصوّر لوحة نظام داخل المتصفح مع مخططات SVG للقياسات وعرض حالة متجاوب. إدخال توضيحي؛ القراءات وتفاصيل التنفيذ افتراضية.",
            repository: "",
            codeUrl: "",
            liveUrl: "",
            // PLACEHOLDER: قيم توضيحية؛ أضف المستودع الحقيقي وإحصاءاته.
            fallbackStats: { stars: "0", forks: "0" },
          },
        ],
      },
      contact: {
        index: "04 / التواصل",
        title: "لنبدأ حوارًا",
        socialLabel: "روابط التواصل",
        description:
          "للاستفسار عن مشروع أو التعاون أو النقاشات التقنية، أرسل رسالة عبر النموذج.",
        links: {
          // PLACEHOLDER: Add verified public profile URLs.
          email: { label: "البريد الإلكتروني", href: "" },
          github: { label: "GitHub", href: "" },
          linkedin: { label: "LinkedIn", href: "" },
        },
        responseTime: {
          label: "متوسط زمن الرد",
          value: "عادةً خلال يومين",
        },
        form: {
          nameLabel: "الاسم",
          emailLabel: "البريد الإلكتروني",
          messageLabel: "الرسالة",
          submit: "إرسال الرسالة",
          sending: "جارٍ الإرسال…",
          success: "تم إرسال الرسالة. شكرًا لك.",
          error: "تعذّر إرسال الرسالة. حاول مرة أخرى.",
          validationError: "تحقّق من الحقول المحددة قبل الإرسال.",
          setup: "أضف مفتاح Web3Forms في data/data.js لتفعيل الإرسال.",
        },
      },
      footer: { copyright: "© 2026 عمر خليل", version: "v1.0" },
    },
  },
};
