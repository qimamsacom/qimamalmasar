const defaultCompanyData = {
  auth: {
    username: "admin",
    password: "1234"
  },
  theme: {
    primaryHue: 205,       // Steel blue/royal construction hue (0-360)
    primarySaturation: 80, // 0-100
    primaryLightness: 45,  // 0-100
    isDarkMode: true,
    fontFamily: "'Tajawal', sans-serif"
  },
  seo: {
    metaTitleAr: "شركة قمم المسار للمقاولات العامة | تشييد وبناء وبنية تحتية بالرياض",
    metaTitleEn: "Qimam Almasar Co. | General Contracting & Construction in Riyadh",
    metaDescAr: "شركة قمم المسار للمقاولات العامة في الرياض والسعودية: حلول المقاولات العامة وتشييد المباني وأعمال البنية التحتية وحلول التصميم والتنفيذ المتكاملة بأعلى معايير الجودة والسلامة المهنية.",
    metaDescEn: "Qimam Almasar Co. is a leading construction and contracting company in Riyadh & Saudi Arabia, providing general contracting, building construction, infrastructure works, and design-build solutions.",
    metaKeywords: "قمم المسار, شركة مقاولات الرياض, تشييد مباني السعودية, بنية تحتية الرياض, أعمال كهربائية, MEP الرياض, Qimam Almasar Co",
    canonicalUrl: "https://qimamsa.com/",
    ogImage: "images/og_preview.png",
    sitemapDomain: "https://qimamsa.com"
  },
  general: {
    nameAr: "قمم المسار",
    nameEn: "Qimam Almasar",
    logoTextAr: "قِـمم المســـــار",
    logoTextEn: "Qimam Almasar",
    logoSubAr: "للمقاولات العامة",
    logoSubEn: "General Contracting"
  },
  hero: {
    badgeAr: "شريككم في البناء والتقدم المهني",
    badgeEn: "Your Partner in Construction & Progress",
    titleAr: "نشيد المستقبل ونبني مجتمعات الغد بحلول هندسية مستدامة",
    titleEn: "Shaping the Skylines of Tomorrow with Enduring Engineering Solutions",
    subtitleAr: "مؤسسة رائدة في تشييد المباني السكنية والتجارية، أعمال البنية التحتية الفائقة، وحلول التصميم والتشطيب المتكاملة بأعلى معايير السلامة والجودة العالمية.",
    subtitleEn: "A leading force in general contracting, building construction of residential & commercial projects, high-quality infrastructure, and seamless design & build solutions.",
    primaryBtnAr: "استكشف خدماتنا الهندسية",
    primaryBtnEn: "Explore Our Engineering Services",
    secondaryBtnAr: "تواصل مع الإدارة الهندسية",
    secondaryBtnEn: "Contact Engineering Dept",
    whatsappLink: "https://wa.me/966540618168",
    
    // Floating Cards (Construction related)
    card1TitleAr: "دقة وجودة هندسية",
    card1TitleEn: "Engineering Precision & Quality",
    card1SubAr: "مطابقة لأعلى المواصفات الفنية والمعايير",
    card1SubEn: "Complies with top technical specifications",
    card1Icon: "fa-ruler-combined",
    
    card2TitleAr: "التزام تام بالمواعيد",
    card2TitleEn: "Strict Deadline Commitment",
    card2SubAr: "تسليم المشاريع بالوقت والميزانية",
    card2SubEn: "Delivering on schedule and within budget",
    card2Icon: "fa-clipboard-check"
  },
  about: {
    titleAr: "عن شركة قمم المسار",
    titleEn: "About Qimam Almasar Co.",
    subtitleAr: "نبني الثقة والابتكار في كل هيكل نشيده",
    subtitleEn: "Building trust and innovation in every structure we build",
    contentAr: "شركة قمم المسار للمقاولات العامة هي شركة رائدة في قطاع التشييد والإنشاءات بالمملكة العربية السعودية ومقرها الرياض. منذ تأسيسنا، قمنا ببناء سمعة قوية مبنية على الجودة والأمانة والموثوقية عبر القطاعات السكنية والتجارية والبنية التحتية. يضم فريقنا نخبة من المهندسين المؤهلين والتقنيين المهرة، حيث نقدم حلولاً متكاملة من الفكرة والتصميم إلى التنفيذ وتسليم المفتاح الملتزم بالميزانية والوقت.",
    contentEn: "Qimam Almasar Co. is a leading construction and contracting company dedicated to delivering excellence in Riyadh and across Saudi Arabia. Since our establishment, we have built a solid reputation for quality, integrity, and reliability across residential, commercial, and infrastructure sectors. With a team of highly qualified engineers and architects, we provide comprehensive turnkey solutions on time and within budget.",
    stats: [
      { labelAr: "مشروع منجز", labelEn: "Completed Projects", value: "150+" },
      { labelAr: "معدات وآليات ثقيلة", labelEn: "Modern Fleet Equipments", value: "60+" },
      { labelAr: "سنوات من الخبرة والتميز", labelEn: "Years of Experience", value: "8+" },
      { labelAr: "الالتزام بالسلامة والجودة HSE", labelEn: "HSE Compliance Rate", value: "100%" }
    ]
  },
  services: [
    {
      id: "srv-1",
      nameAr: "المقاولات العامة والتشييد",
      nameEn: "General Contracting & Construction",
      descAr: "إدارة مشاريع البناء والإنشاءات بالكامل بدقة متناهية ومسؤولية كاملة، بالتنسيق بين كافة المراحل والعمالة والموارد للتسليم بالوقت والميزانية المحددة.",
      descEn: "Turnkey project management from excavation to handover with absolute accountability, coordinating all phases, trades, and schedules.",
      icon: "fa-helmet-safety"
    },
    {
      id: "srv-2",
      nameAr: "تشييد المباني السكنية والتجارية",
      nameEn: "Building Construction",
      descAr: "تنفيذ وتشييد المجمعات السكنية، الفلل الفاخرة، الأبراج الإدارية، والمباني الصناعية والمستشفيات، بالدمج بين الإبداع المعماري والمتانة الإنشائية الهيكلية.",
      descEn: "Execution of residential compounds, luxury villas, commercial towers, healthcare facilities, and educational institutions combining structural stability with creative design.",
      icon: "fa-building"
    },
    {
      id: "srv-3",
      nameAr: "أعمال البنية التحتية الفائقة",
      nameEn: "Infrastructure Works",
      descAr: "شريط واسع من حلول البنية التحتية يضم رصف وتعبيد الطرق، خطوط التغذية والخدمات، شبكات الصرف الصحي والمياه، لتكون العمود الفقري للمجتمعات الحديثة.",
      descEn: "High-quality infrastructure projects including roads, utility networks, water distribution lines, drainage systems, and civil works.",
      icon: "fa-road"
    },
    {
      id: "srv-4",
      nameAr: "حلول التصميم والتنفيذ المتكاملة",
      nameEn: "Design & Build Solutions",
      descAr: "تقديم خدمات هندسية متكاملة تدمج بين التصميم الإنشائي والمعماري والتنفيذ الفعلي لتسريع وتيرة تسليم المشاريع، تقليص النفقات، وتحقيق الرؤية على الواقع.",
      descEn: "Streamlined design and build capabilities that integrate blueprints with physical assembly, ensuring a seamless transition from concept to reality.",
      icon: "fa-compass-drafting"
    },
    {
      id: "srv-5",
      nameAr: "تنظيم المعارض والمؤتمرات",
      nameEn: "Exhibitions & Conferences Organization",
      descAr: "تخطيط وتجهيز وتنظيم المعارض والمؤتمرات الإقليمية والدولية وتصنيع منصات العرض المخصصة بأحدث التجهيزات والحلول الهندسية المتكاملة.",
      descEn: "Planning, designing, and organizing local and international exhibitions, manufacturing custom booths and stages with cutting-edge engineering solutions.",
      icon: "fa-cubes"
    },
    {
      id: "srv-6",
      nameAr: "الاستشارات الهندسية والفنية",
      nameEn: "Engineering & Technical Consulting",
      descAr: "تقديم الدراسات والاستشارات الفنية المتقدمة، وإعداد جداول الكميات ودراسات الجدوى للمشاريع الإنشائية تحت إشراف نخبة من المهندسين الاستشاريين ذوي الخبرة.",
      descEn: "Providing advanced technical and engineering consultations, bill of quantities (BOQ) preparation, and project feasibility studies by senior consulting engineers.",
      icon: "fa-users-gear"
    }
  ],
  portfolio: [
    {
      id: "port-1",
      titleAr: "بناء وتشييد الفلل الفاخرة والمجمعات",
      titleEn: "Construction of Luxury Villas & Compounds",
      categoryAr: "تشييد وإنشاء",
      categoryEn: "Construction",
      image: "images/portfolio_1.png"
    },
    {
      id: "port-2",
      titleAr: "أعمال التشطيب الداخلي الفاخر والواجهات",
      titleEn: "Premium Facade & Interior Finishing",
      categoryAr: "تشطيبات",
      categoryEn: "Finishing",
      image: "images/portfolio_2.png"
    },
    {
      id: "port-3",
      titleAr: "تأسيس الأنظمة الكهربائية وتوزيع لوحات الضغط",
      titleEn: "Electrical Installations & DB Boards Setup",
      categoryAr: "أعمال كهربائية",
      categoryEn: "Electrical",
      image: "images/portfolio_3.png"
    },
    {
      id: "port-4",
      titleAr: "تأسيس البنية الذكية للتحكم بالمنزل الذكي",
      titleEn: "Smart Home Control Cabling & Infrastructure",
      categoryAr: "أنظمة ذكية",
      categoryEn: "Smart Home",
      image: "images/portfolio_4.png"
    },
    {
      id: "port-5",
      titleAr: "شبكات التكييف المركزي والميكانيكا MEP",
      titleEn: "MEP, Centrifugal Pumps & HVAC System Installations",
      categoryAr: "أعمال MEP",
      categoryEn: "MEP",
      image: "images/portfolio_5.png"
    },
    {
      id: "port-6",
      titleAr: "تأسيس أنظمة السلامة ومضخات مكافحة الحريق",
      titleEn: "Fire Fighting Pipework & Pump Stations",
      categoryAr: "مكافحة الحريق",
      categoryEn: "Fire Fighting",
      image: "images/portfolio_6.png"
    },
    {
      id: "port-7",
      titleAr: "مشروع بنان بضاحية الفرسان الرياض",
      titleEn: "Banan Residential Project, Dahiyat Al Fursan, Riyadh",
      categoryAr: "تشييد وإنشاء",
      categoryEn: "Construction",
      image: "images/banan_fursan.jpg"
    },
    {
      id: "port-8",
      titleAr: "أعمال تشطيبات متكاملة للمباني والفلل",
      titleEn: "Integrated Finishing Works for Buildings & Villas",
      categoryAr: "تشطيبات",
      categoryEn: "Finishing",
      image: "images/finishing_integrated.jpg"
    }
  ],
  contact: {
    phone: "+966 54 061 8168",
    email: "info@qimamsa.com",
    addressAr: "المملكة العربية السعودية، الرياض، حي الملك عبد العزيز، شارع ابن كثير، 7743",
    addressEn: "7743 Ibn Katheer St, King Abdulaziz Dist, Riyadh, Kingdom of Saudi Arabia",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.783637152011!2d46.7265882759!3d24.717088078044706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03875567a5b3%3A0x7d8787f0b6e92b8c!2zSWJuIEthdGhlZXIsIEtpbmcgQWJkdWxheml6LCBSaXlhZGggMTIyMzMsIFNhdWRpIEFyYWJpYQ!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    whatsapp: "966540618168"
  }
};

// Export to window if running in browser
if (typeof window !== 'undefined') {
  window.defaultCompanyData = defaultCompanyData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = defaultCompanyData;
}
