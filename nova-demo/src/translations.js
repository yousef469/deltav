export const TRANSLATIONS = {
    en: {
        dashboard: "NOVA DASHBOARD",
        emergency: "EMERGENCY / SOS",
        vault: "SURVIVAL VAULT",
        farming: "FARMING",
        repairing: "REPAIRING",
        education: "EDUCATION",
        coding: "CODING",
        chess: "CHESS",
        nav: "NAVIGATOR",
        tools: "TOOLS",
        ai_status: "Hardened Core Active",
        search_placeholder: "Type survival query...",
        back: "BACK",
        done: "DONE",
        yes: "YES",
        no: "NO",
        compass: "COMPASS",
        beacon: "BEACON (SOS)",
        timer: "WATER TIMER",
        nearest: "NEAREST RESCUE",
        guidance: "Guidance",
        lat: "Lat",
        lon: "Lon",
        turn: "TURN",
        white: "WHITE",
        black: "BLACK",
        start: "START",
        stop: "STOP",
        reset: "RESET",
        how_to_play: "HOW TO PLAY",
        survival_nav: "SURVIVAL NAV",
        nearest_civilization: "NEAREST CIVILIZATION",
        celestial: "CELESTIAL",
        dist: "DIST",
        pos: "POS"
    },
    ar: {
        dashboard: "لوحة تحكم نوفا",
        emergency: "الطوارئ / استغاثة",
        vault: "خزنة البقاء",
        farming: "الزراعة",
        repairing: "الإصلاح",
        education: "التعليم",
        coding: "البرمجة",
        chess: "شطرنج",
        nav: "الملاح",
        tools: "الأدوات",
        ai_status: "النواة الصلبة نشطة",
        search_placeholder: "اكتب استفسار البقاء...",
        back: "رجوع",
        done: "تم",
        yes: "نعم",
        no: "لا",
        compass: "البوصلة",
        beacon: "إشارة الاستغاثة",
        timer: "مؤقت المياه",
        nearest: "أقرب نقطة إنقاذ",
        guidance: "التوجيه",
        lat: "خط عرض",
        lon: "خط طول",
        turn: "دور",
        white: "الأبيض",
        black: "الأسود",
        start: "ابدأ",
        stop: "إيقاف",
        reset: "إعادة تعيين",
        how_to_play: "كيف تلعب",
        survival_nav: "ملاح البقاء",
        nearest_civilization: "أقرب حضارة",
        celestial: "فلكي",
        dist: "المسافة",
        pos: "الموقع"
    },
    zh: {
        dashboard: "新星仪表盘",
        emergency: "紧急 / SOS",
        vault: "生存宝库",
        farming: "农业",
        repairing: "维修",
        education: "教育",
        coding: "编程",
        chess: "象棋",
        nav: "导航员",
        tools: "工具",
        ai_status: "硬化核心已激活",
        search_placeholder: "输入生存查询...",
        back: "返回",
        done: "完成",
        yes: "是",
        no: "否",
        compass: "指南针",
        beacon: "信标 (SOS)",
        timer: "饮水计时器",
        nearest: "最近救援",
        guidance: "指导",
        lat: "纬度",
        lon: "经度",
        turn: "回合",
        white: "白方",
        black: "黑方",
        start: "开始",
        stop: "停止",
        reset: "重置",
        how_to_play: "如何玩",
        survival_nav: "生存导航",
        nearest_civilization: "最近的文明",
        celestial: "天文",
        dist: "距离",
        pos: "位置",
        chess_guide: "选择一个棋子并点击一个有效的方格。棋子按照标准国际象棋规则移动。"
    }
};

export const SURVIVAL_CONTENT = {
    farming: {
        en: [
            { id: "soil", title: "Soil Preparation", content: "Dig 12\" deep. Mix in 30% compost. Test with vinegar: if it fizzes, soil is alkaline. Add wood ash for potassium. If acidic, add crushed eggshells." },
            { id: "seed", title: "Seed Preservation", content: "Dry seeds thoroughly. Store in air-tight glass jars with silica gel. Keep in cool, dark place. Label with date and variety." },
            { id: "pest", title: "Natural Pest Control", content: "Interplant marigolds to repel nematodes. Use neem oil spray for fungal issues. Release ladybugs for aphid control." }
        ],
        ar: [
            { id: "soil", title: "تجهيز التربة", content: "احفر بعمق 12 بوصة. اخلط 30% سماد. اختبر بالخل: إذا فارت، فالتربة قلوية. أضف رماد الخشب للبوتاسيوم." },
            { id: "seed", title: "حفظ البذور", content: "جفف البذور تماماً. خزنها في برطمانات زجاجية محكمة الإغلاق مع هلام السيليكا. ضعها في مكان بارد." },
            { id: "pest", title: "مكافحة الآفات الطبيعية", content: "ازرع القطيفة لطرد الديدان. استخدم رش زيت النيم للمشاكل الفطرية. استخدم الدعسوقة للمن." }
        ],
        zh: [
            { id: "soil", title: "土壤准备", content: "挖掘12英寸深。拌入30%堆肥。用醋测试：如果起泡，土壤是碱性的。加入木灰补充钾。" },
            { id: "seed", title: "种子保存", content: "彻底干燥种子。储存在带硅胶的密封玻璃瓶中。存放在阴凉黑暗的地方。标明日期。" },
            { id: "pest", title: "天然害虫防治", content: "间种万寿菊以驱避线虫。使用印楝油喷雾解决真菌问题。释放瓢虫控制蚜虫。" }
        ]
    },
    repairing: {
        en: [
            { id: "knots", title: "Essential Knots", content: "Bowline: Fixed loop. Clove Hitch: Fasten to pole. Taut-line: Adjustable tension. Figure-8: Stopper knot." },
            { id: "solar", title: "Solar Grid Maintenance", content: "Clean panels with distilled water. Angle should be Latitude + 15 degrees in winter. Check inverter fuses monthly." },
            { id: "pump", title: "Hand Pump Repair", content: "Replace leather washers if suction fails. Keep joints lubricated with food-grade grease. Check for air leaks in intake." }
        ],
        ar: [
            { id: "knots", title: "عقد أساسية", content: "البولين: حلقة ثابتة. الوتد: للربط بعمود. عقدة التوتر: قابلة للتعديل. الرقم 8: عقدة توقف." },
            { id: "solar", title: "صيانة الشبكة الشمسية", content: "نظف الألواح بالماء المقطر. الزاوية = خط العرض + 15 درجة شتاءً. افحص المصاهر شهرياً." },
            { id: "pump", title: "إصلاح المضخة اليدوية", content: "استبدل الحلقات الجلدية إذا فشل الشفط. حافظ على تشحيم الوصلات. افحص تسرب الهواء." }
        ],
        zh: [
            { id: "knots", title: "基本绳结", content: "称人结：固定环。双节结：系在柱子上。紧绳结：可调节张力。八字结：止动结。" },
            { id: "solar", title: "太阳能电网维护", content: "用蒸馏水清洁面板。冬季角度应为纬度+15度。每月检查逆变器保险丝。" },
            { id: "pump", title: "手摇泵维修", content: "如果吸力失效，更换皮革垫圈。用食品级油脂保持接头润滑。检查进气口是否漏气。" }
        ]
    },
    education: {
        en: [
            { id: "physics", title: "Mechanical Advantage", content: "Pulleys: Force = Weight / Number of Ropes. Levers: Force x Arm = Load x Arm. Essential for lifting heavy debris." },
            { id: "chemistry", title: "Survival Chemistry", content: "Making Soap: Ash + Fat. Making Bleach: Saltwater + Electrolysis. Charcoal: Controlled burning of wood in low oxygen." }
        ],
        ar: [
            { id: "physics", title: "الميزة الميكانيكية", content: "البكرات: القوة = الوزن / عدد الحبال. الروافع: القوة × الذراع = الحمل × الذراع. ضروري لرفع الأنقاض." },
            { id: "chemistry", title: "كيمياء البقاء", content: "صنع الصابون: رماد + دهون. صنع المبيض: مياه مالحة + تحليل كهربائي. الفحم: حرق الخشب تحت أكسجين منخفض." }
        ],
        zh: [
            { id: "physics", title: "机械利益", content: "滑轮：力 = 重量 / 绳索数量。杠杆：力 × 臂 = 负载 × 臂。对于举起沉重碎屑至关重要。" },
            { id: "chemistry", title: "生存化学", content: "制作肥皂：灰烬 + 脂肪。制作漂白剂：盐水 + 电解。木炭：在低氧环境下受控燃烧木材。" }
        ]
    },
    coding: {
        en: [
            { id: "bash", title: "Shell Survival", content: "Keep scripts simple. Use absolute paths. Log everything to /tmp/survival.log. Always have a backup on physical read-only media." },
            { id: "net", title: "Mesh Networking", content: "LoRa configurations: 433MHz for range. Use encryption (AES-256). Peer-to-peer relaying is critical for offline comms." }
        ],
        ar: [
            { id: "bash", title: "البقاء في الحزمة", content: "اجعل السكربتات بسيطة. استخدم مسارات مطلقة. سجل كل شيء. احتفظ ونسخة احتياطية في وسائط للقراءة فقط." },
            { id: "net", title: "شبكات المش", content: "إعدادات LoRa: تردد 433 ميجاهرتز للمدى. استخدم التشفير. التتابع من نظير لنظير ضروري للاتصال." }
        ],
        zh: [
            { id: "bash", title: "Shell 生存", content: "保持脚本简单。使用绝对路径。将所有内容记录到日志中。始终在物理只读介质上保留备份。" },
            { id: "net", title: "网状网络", content: "LoRa 配置：433MHz 以获取范围。使用 AES-256 加密。点对点中继对于离线通信至关重要。" }
        ]
    }
};

export const EMERGENCY_TREES = {
    en: {
        bleeding: {
            title: "BLEEDING CONTROL",
            nodes: {
                start: { q: "Is the bleeding soaking through clothes?", yes: "heavy_pressure", no: "clean_wound" },
                heavy_pressure: { q: "ACTION: Apply direct pressure with cloth. Is it still bleeding?", yes: "tourniquet", no: "bandage" },
                tourniquet: { q: "ACTION: Apply tourniquet high and tight above wound.", type: "END" },
                bandage: { q: "ACTION: Apply pressure bandage and elevate.", type: "END" },
                clean_wound: { q: "ACTION: Wash with clean water and bandage.", type: "END" }
            }
        }
    },
    ar: {
        bleeding: {
            title: "التحكم في النزيف",
            nodes: {
                start: { q: "هل ينفذ الدم من خلال الملابس؟", yes: "heavy_pressure", no: "clean_wound" },
                heavy_pressure: { q: "إجراء: اضغط مباشرة بقطعة قماش. هل لا يزال ينزف؟", yes: "tourniquet", no: "bandage" },
                tourniquet: { q: "إجراء: ضع عصبة (تورنيكيه) فوق الجرح بقوة.", type: "END" },
                bandage: { q: "إجراء: ضع ضمادة ضاغطة وارفع العضو.", type: "END" },
                clean_wound: { q: "إجراء: اغسل بالماء النضيف وضمد الجرح.", type: "END" }
            }
        }
    },
    zh: {
        bleeding: {
            title: "止血控制",
            nodes: {
                start: { q: "血迹渗透衣服了吗？", yes: "heavy_pressure", no: "clean_wound" },
                heavy_pressure: { q: "行动：用布直接按压。还在流血吗？", yes: "tourniquet", no: "bandage" },
                tourniquet: { q: "行动：在伤口上方紧紧缠绕止血带。", type: "END" },
                bandage: { q: "行动：包扎压力绷带并抬高部位。", type: "END" },
                clean_wound: { q: "行动：用清水冲洗并包扎。", type: "END" }
            }
        }
    }
};

export const AI_PROTOCOLS = {
    en: {
        "water": "💧 WATER PROTOCOL: Boil 1-3 mins. Use sand/charcoal filter. Look for swarming insects or birds flying low to find hidden sources.",
        "fire": "🔥 FIRE PROTOCOL: Use lens or friction. Clear 3ft perimeter. Keep wood dry under A-frame shelter. Use dry grass/birch bark as tinder.",
        "bleeding": "🩸 BLEEDING: Direct pressure for 15 mins with clean cloth. Elevate wound. Use tourniquet high and tight ONLY if limb loss is imminent.",
        "lost": "🌲 LOST: S.T.O.P. (Sit, Think, Observe, Plan). Mark your path. Stay in one place. Signal 3 times for international distress.",
        "shelter": "⛺ SHELTER: Insulation from ground is top priority. Build lean-to with debris. Avoid valleys due to cold air sink and flash floods."
    },
    ar: {
        "water": "💧 بروتوكول المياه: اغلِ لمدة 1-3 دقائق. استخدم مرشح الرمل/الفحم. ابحث عن الحشرات للعثور على المصادر.",
        "fire": "🔥 بروتوكول النار: استخدم العدسة أو الاحتكاك. نظف المنطقة المحيطة 3 أقدام. حافظ على جفاف الخشب تحت مأوى A-frame.",
        "bleeding": "🩸 النزيف: ضغط مباشر لمدة 15 دقيقة بقطعة قماش نظيفة. ارفع العضو. استخدم العصبة كملاذ أخير فقط.",
        "lost": "🌲 الضياع: اجلس، فكر، راقب، خطط. ابقَ في مكانك. اطلق إشارة استغاثة 3 مرات.",
        "shelter": "⛺ المأوى: العزل عن الأرض هو الأولوية. ابنِ مأوى مائلاً باستخدام الأنقاض. تجنب الوديان بسبب الهواء البارد والسيول."
    },
    zh: {
        "water": "💧 水源协议：煮沸1-3分钟。使用沙/炭过滤器。观察昆虫活动或飞得较低的鸟类以寻找隐藏水源。",
        "fire": "🔥 火源协议：使用透镜或摩擦。清理3英尺周界。在A型架避难所下保持木柴干燥。",
        "bleeding": "🩸 出血：使用干净的布直接按压15分钟。抬高伤口。仅在最后手段时使用止血带。",
        "lost": "🌲 迷路：静坐、思考、观察、计划。待在一个地方。发出3次国际求救信号。",
        "shelter": "⛺ 避难所：地面绝缘是首要任务。利用瓦砾建造斜棚。避开山谷以免寒冷空气下沉或山洪暴发。"
    }
};
