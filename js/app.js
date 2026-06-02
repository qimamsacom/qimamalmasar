// Print Address - Core Application Script

let appState = {};
let currentLang = 'ar'; // Default language is Arabic

// Load state from localStorage or use defaultCompanyData
function initStore() {
  const savedData = localStorage.getItem('printadd_company_data');
  let loadedFromCache = false;
  if (savedData) {
    try {
      appState = JSON.parse(savedData);
      loadedFromCache = true;
    } catch (e) {
      console.error("Failed to parse saved state, loading default data.", e);
      appState = JSON.parse(JSON.stringify(defaultCompanyData));
    }
  } else {
    appState = JSON.parse(JSON.stringify(defaultCompanyData));
  }

  // Deep merge to ensure all new configuration keys exist in appState
  const mergeDeep = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        mergeDeep(target[key], source[key]);
      } else if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  };
  mergeDeep(appState, defaultCompanyData);

  // Auto-reset old cache to show the new Qimam Almasar Company profile immediately
  if (loadedFromCache && appState.general && appState.general.nameEn === 'Print Address') {
    appState = JSON.parse(JSON.stringify(defaultCompanyData));
    saveState();
  }

  // Migration: If portfolio is still using unsplash URLs, reload them to use the local premium images
  if (appState.portfolio && appState.portfolio.length > 0 && appState.portfolio[0].image.includes('unsplash.com')) {
    appState.portfolio = JSON.parse(JSON.stringify(defaultCompanyData.portfolio));
    appState.seo.ogImage = defaultCompanyData.seo.ogImage;
    saveState();
  }

  // Migration: If services count < 6 or portfolio count < 8, sync them to include new additions
  if (!appState.services || appState.services.length < 6) {
    appState.services = JSON.parse(JSON.stringify(defaultCompanyData.services));
    saveState();
  }
  if (!appState.portfolio || appState.portfolio.length < 8) {
    appState.portfolio = JSON.parse(JSON.stringify(defaultCompanyData.portfolio));
    saveState();
  }

  applyThemeVariables();
}

function saveState() {
  localStorage.setItem('printadd_company_data', JSON.stringify(appState));
  applyThemeVariables();
}

function applyThemeVariables() {
  const root = document.documentElement;
  root.style.setProperty('--primary-hue', appState.theme.primaryHue);
  root.style.setProperty('--primary-sat', appState.theme.primarySaturation + '%');
  root.style.setProperty('--primary-light', appState.theme.primaryLightness + '%');
  
  if (appState.theme.isDarkMode) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }
}

// Update Page Meta tags & Schema.org for SEO compliance
function updateSeoMeta() {
  const lang = currentLang;

  // 1. Browser Title
  document.title = lang === 'ar' ? appState.seo.metaTitleAr : appState.seo.metaTitleEn;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = lang === 'ar' ? appState.seo.metaDescAr : appState.seo.metaDescEn;

  // 3. Meta Keywords
  let metaKeys = document.querySelector('meta[name="keywords"]');
  if (!metaKeys) {
    metaKeys = document.createElement('meta');
    metaKeys.name = "keywords";
    document.head.appendChild(metaKeys);
  }
  metaKeys.content = appState.seo.metaKeywords;

  // 4. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = appState.seo.canonicalUrl;

  // 5. OpenGraph (Facebook / WhatsApp sharing preview) & Twitter Cards
  const seoData = {
    "og:title": lang === 'ar' ? appState.seo.metaTitleAr : appState.seo.metaTitleEn,
    "og:description": lang === 'ar' ? appState.seo.metaDescAr : appState.seo.metaDescEn,
    "og:image": appState.seo.ogImage,
    "og:url": appState.seo.canonicalUrl,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": lang === 'ar' ? appState.seo.metaTitleAr : appState.seo.metaTitleEn,
    "twitter:description": lang === 'ar' ? appState.seo.metaDescAr : appState.seo.metaDescEn,
    "twitter:image": appState.seo.ogImage
  };

  for (const [property, value] of Object.entries(seoData)) {
    let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.name = property;
      }
      document.head.appendChild(meta);
    }
    meta.content = value;
  }

  // 6. JSON-LD Structured Schema (Google LocalBusiness & Organization)
  let schemaScript = document.getElementById('dynamic-schema-ld');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.type = "application/ld+json";
    schemaScript.id = "dynamic-schema-ld";
    document.head.appendChild(schemaScript);
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": lang === 'ar' ? appState.general.nameAr : appState.general.nameEn,
    "url": appState.seo.canonicalUrl,
    "logo": appState.seo.ogImage,
    "image": appState.seo.ogImage,
    "description": lang === 'ar' ? appState.seo.metaDescAr : appState.seo.metaDescEn,
    "telephone": appState.contact.phone,
    "email": appState.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": lang === 'ar' ? appState.contact.addressAr : appState.contact.addressEn,
      "addressLocality": "Riyadh",
      "addressCountry": "SA"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": lang === 'ar' ? `خدمات ${appState.general.nameAr}` : `${appState.general.nameEn} Services`,
      "itemListElement": appState.services.map((srv, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": lang === 'ar' ? srv.nameAr : srv.nameEn,
          "description": lang === 'ar' ? srv.descAr : srv.descEn
        }
      }))
    }
  };

  schemaScript.text = JSON.stringify(schemaData, null, 2);
}

// Render dynamic website elements
function renderSite() {
  const lang = currentLang;
  
  // Set document direction & update page metadata tags
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  updateSeoMeta();

  // 1. Logo
  const logoBox = document.getElementById('navbar-logo');
  if (logoBox) {
    logoBox.innerHTML = `
      <div class="logo-icon-box">
        <i class="fas fa-helmet-safety"></i>
      </div>
      <div class="logo-text-box">
        <span class="logo-title">${lang === 'ar' ? appState.general.logoTextAr : appState.general.logoTextEn}</span>
        <span class="logo-sub">${lang === 'ar' ? appState.general.logoSubAr : appState.general.logoSubEn}</span>
      </div>
    `;
  }

  // 2. Navigation items
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    const navItems = lang === 'ar' ? [
      { text: "الرئيسية", link: "#home" },
      { text: "من نحن", link: "#about" },
      { text: "خدماتنا", link: "#services" },
      { text: "أعمالنا", link: "#portfolio" },
      { text: "تواصل معنا", link: "#contact" }
    ] : [
      { text: "Home", link: "#home" },
      { text: "About Us", link: "#about" },
      { text: "Services", link: "#services" },
      { text: "Portfolio", link: "#portfolio" },
      { text: "Contact", link: "#contact" }
    ];

    let navHtml = '';
    navItems.forEach((item, index) => {
      const activeClass = index === 0 ? 'active' : '';
      navHtml += `<li><a href="${item.link}" class="nav-link ${activeClass}">${item.text}</a></li>`;
    });
    
    // Language switcher
    navHtml += `
      <li>
        <button class="btn-lang" onclick="toggleLanguage()">
          <i class="fas fa-globe"></i> ${lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </li>
    `;
    
    // Theme toggle
    navHtml += `
      <li>
        <button class="btn-toggle-theme" onclick="toggleTheme()" aria-label="Toggle Theme">
          <i class="fas ${appState.theme.isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
        </button>
      </li>
    `;

    // Admin login button
    navHtml += `
      <li>
        <button class="btn-admin-login" onclick="toggleAdminOverlay()">
          <i class="fas fa-user-shield"></i> ${lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </button>
      </li>
    `;

    navMenu.innerHTML = navHtml;
  }

  // 3. Hero Section
  const heroBadge = document.querySelector('.hero-badge span');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroPrimaryBtn = document.getElementById('hero-primary-btn');
  const heroSecondaryBtn = document.getElementById('hero-secondary-btn');
  
  if (heroBadge) heroBadge.textContent = lang === 'ar' ? appState.hero.badgeAr : appState.hero.badgeEn;
  if (heroTitle) heroTitle.textContent = lang === 'ar' ? appState.hero.titleAr : appState.hero.titleEn;
  if (heroSubtitle) heroSubtitle.textContent = lang === 'ar' ? appState.hero.subtitleAr : appState.hero.subtitleEn;
  if (heroPrimaryBtn) {
    heroPrimaryBtn.innerHTML = `${lang === 'ar' ? appState.hero.primaryBtnAr : appState.hero.primaryBtnEn} <i class="fas ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'}"></i>`;
    heroPrimaryBtn.href = "#services";
  }
  if (heroSecondaryBtn) {
    heroSecondaryBtn.innerHTML = `<i class="fab fa-whatsapp"></i> ${lang === 'ar' ? appState.hero.secondaryBtnAr : appState.hero.secondaryBtnEn}`;
    heroSecondaryBtn.href = `https://wa.me/${appState.contact.whatsapp}`;
    heroSecondaryBtn.target = "_blank";
  }

  // Floating elements
  const floatCard1 = document.getElementById('float-card-1');
  const floatCard2 = document.getElementById('float-card-2');
  if (floatCard1) {
    const icon1 = appState.hero.card1Icon || 'fa-ruler-combined';
    const title1 = lang === 'ar' ? appState.hero.card1TitleAr : appState.hero.card1TitleEn;
    const sub1 = lang === 'ar' ? appState.hero.card1SubAr : appState.hero.card1SubEn;
    floatCard1.innerHTML = `
      <i class="fas ${icon1} floating-card-icon"></i>
      <h5 style="font-weight:700; margin-bottom:5px;">${title1}</h5>
      <p style="font-size:0.8rem; color:var(--text-2);">${sub1}</p>
    `;
  }
  if (floatCard2) {
    const icon2 = appState.hero.card2Icon || 'fa-clipboard-check';
    const title2 = lang === 'ar' ? appState.hero.card2TitleAr : appState.hero.card2TitleEn;
    const sub2 = lang === 'ar' ? appState.hero.card2SubAr : appState.hero.card2SubEn;
    floatCard2.innerHTML = `
      <i class="fas ${icon2} floating-card-icon"></i>
      <h5 style="font-weight:700; margin-bottom:5px;">${title2}</h5>
      <p style="font-size:0.8rem; color:var(--text-2);">${sub2}</p>
    `;
  }

  // 4. About Section
  const aboutTitle = document.getElementById('about-title');
  const aboutSubtitle = document.getElementById('about-subtitle');
  const aboutText = document.getElementById('about-text');
  
  if (aboutTitle) aboutTitle.textContent = lang === 'ar' ? appState.about.titleAr : appState.about.titleEn;
  if (aboutSubtitle) aboutSubtitle.textContent = lang === 'ar' ? appState.about.subtitleAr : appState.about.subtitleEn;
  if (aboutText) aboutText.textContent = lang === 'ar' ? appState.about.contentAr : appState.about.contentEn;

  // About Stats
  const statsContainer = document.getElementById('about-stats-container');
  if (statsContainer) {
    let statsHtml = '';
    appState.about.stats.forEach((stat, idx) => {
      // Extract target number and suffix (like + or %) from the string
      const numMatch = stat.value.replace(/,/g, '').match(/\d+/);
      const targetVal = numMatch ? parseInt(numMatch[0], 10) : 0;
      const suffix = stat.value.replace(/[\d,]/g, '');

      statsHtml += `
        <div class="glass-card stat-card" data-aos="fade-up" data-aos-delay="${idx * 100}">
          <div class="stat-number count-up" data-target="${targetVal}" data-suffix="${suffix}">0${suffix}</div>
          <div class="stat-label">${lang === 'ar' ? stat.labelAr : stat.labelEn}</div>
        </div>
      `;
    });
    statsContainer.innerHTML = statsHtml;
  }

  // 5. Services Section
  const srvTitle = document.getElementById('services-title');
  const srvSubtitle = document.getElementById('services-subtitle');
  if (srvTitle) srvTitle.textContent = lang === 'ar' ? "خدماتنا المتميزة" : "Our Premium Services";
  if (srvSubtitle) srvSubtitle.textContent = lang === 'ar' ? "نقدم لك باقة متكاملة من خدمات الدعاية والإعلان والطباعة الرقمية بأحدث التقنيات" : "We provide a comprehensive package of marketing, branding, and printing solutions.";

  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid) {
    let servicesHtml = '';
    appState.services.forEach((srv, idx) => {
      servicesHtml += `
        <div class="glass-card service-card" data-aos="fade-up" data-aos-delay="${idx * 100}">
          <div class="service-icon-box">
            <i class="fas ${srv.icon || 'fa-star'}"></i>
          </div>
          <h4>${lang === 'ar' ? srv.nameAr : srv.nameEn}</h4>
          <p>${lang === 'ar' ? srv.descAr : srv.descEn}</p>
        </div>
      `;
    });
    servicesGrid.innerHTML = servicesHtml;
  }

  // 6. Portfolio Section
  const portTitle = document.getElementById('portfolio-title');
  const portSubtitle = document.getElementById('portfolio-subtitle');
  if (portTitle) portTitle.textContent = lang === 'ar' ? "معرض أعمالنا" : "Our Visual Portfolio";
  if (portSubtitle) portSubtitle.textContent = lang === 'ar' ? "نظرة سريعة على بعض المشاريع التي قمنا بتنفيذها لعملائنا بكل فخر" : "A brief look at some of the branding and printing projects we proudly delivered.";

  // Render filters
  const filterWrap = document.getElementById('portfolio-filters');
  if (filterWrap) {
    const categories = new Set();
    appState.portfolio.forEach(item => {
      categories.add(lang === 'ar' ? item.categoryAr : item.categoryEn);
    });

    let filtersHtml = `<button class="filter-btn active" data-filter="all">${lang === 'ar' ? 'الكل' : 'All'}</button>`;
    categories.forEach(cat => {
      filtersHtml += `<button class="filter-btn" data-filter="${cat}">${cat}</button>`;
    });
    filterWrap.innerHTML = filtersHtml;

    const filterButtons = filterWrap.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');
        filterPortfolioItems(filterVal);
      });
    });
  }

  // Render items
  filterPortfolioItems('all');

  // 7. Contact Section
  const contactTitle = document.getElementById('contact-title');
  const contactSubtitle = document.getElementById('contact-subtitle');
  if (contactTitle) contactTitle.textContent = lang === 'ar' ? "تواصل معنا" : "Contact Us";
  if (contactSubtitle) contactSubtitle.textContent = lang === 'ar' ? "نحن هنا لمساعدتك والإجابة على أي استفسارات تخص مشروعك القادم" : "We are here to support and reply to any questions for your next project.";

  // Contact list
  const contactInfoList = document.getElementById('contact-info-list');
  if (contactInfoList) {
    contactInfoList.innerHTML = `
      <div class="glass-card contact-item">
        <div class="contact-icon"><i class="fas fa-phone"></i></div>
        <div class="contact-details">
          <h6>${lang === 'ar' ? 'اتصل بنا' : 'Call Us'}</h6>
          <p dir="ltr">${appState.contact.phone}</p>
        </div>
      </div>
      <div class="glass-card contact-item">
        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
        <div class="contact-details">
          <h6>${lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</h6>
          <p>${appState.contact.email}</p>
        </div>
      </div>
      <div class="glass-card contact-item">
        <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
        <div class="contact-details">
          <h6>${lang === 'ar' ? 'الموقع' : 'Location'}</h6>
          <p>${lang === 'ar' ? appState.contact.addressAr : appState.contact.addressEn}</p>
        </div>
      </div>
    `;
  }

  // Contact Form
  const contactFormCard = document.getElementById('contact-form-card');
  if (contactFormCard) {
    contactFormCard.innerHTML = `
      <h3>${lang === 'ar' ? 'أرسل لنا طلبك' : 'Send Us Your Request'}</h3>
      <form id="site-contact-form" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label">${lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
          <input type="text" class="form-input" required placeholder="${lang === 'ar' ? 'أدخل اسمك هنا' : 'Enter your name'}">
        </div>
        <div class="admin-row" style="margin-bottom:0;">
          <div class="form-group">
            <label class="form-label">${lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input type="tel" class="form-input" required placeholder="${lang === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}">
          </div>
          <div class="form-group">
            <label class="form-label">${lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input type="email" class="form-input" required placeholder="name@company.com">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${lang === 'ar' ? 'تفاصيل طلبك' : 'Your Request Details'}</label>
          <textarea class="form-input" required placeholder="${lang === 'ar' ? 'اشرح لنا نوع المطبوعات أو الخدمات التي تحتاجها...' : 'Describe what kind of printing or services you need...'}"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; border-radius:10px;">
          ${lang === 'ar' ? 'إرسال الطلب الآن' : 'Send Message Now'} <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    `;
  }

  // Map Iframe
  const mapContainer = document.getElementById('map-iframe-container');
  if (mapContainer && appState.contact.mapIframe) {
    mapContainer.innerHTML = `<iframe src="${appState.contact.mapIframe}" allowfullscreen="" loading="lazy"></iframe>`;
  }

  // 8. Footer
  const footerLogo = document.getElementById('footer-logo');
  if (footerLogo) {
    footerLogo.innerHTML = `
      <div class="logo-icon-box" style="margin: 0 auto 10px auto;">
        <i class="fas fa-helmet-safety"></i>
      </div>
      <h4 style="font-weight:900; font-size:1.4rem;">${lang === 'ar' ? appState.general.nameAr : appState.general.nameEn}</h4>
      <p style="color:var(--text-3); font-size:0.85rem; margin-top:4px;">${lang === 'ar' ? appState.general.logoSubAr : appState.general.logoSubEn}</p>
    `;
  }

  const footerSocials = document.getElementById('footer-socials');
  if (footerSocials) {
    footerSocials.innerHTML = `
      <a href="https://wa.me/${appState.contact.whatsapp}" target="_blank" class="social-btn"><i class="fab fa-whatsapp"></i></a>
      <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
      <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
      <a href="mailto:${appState.contact.email}" class="social-btn"><i class="far fa-envelope"></i></a>
    `;
  }

  const copyright = document.getElementById('footer-copyright');
  if (copyright) {
    copyright.innerHTML = lang === 'ar' 
      ? `&copy; ${new Date().getFullYear()} جميع الحقوق محفوظة لـ ${appState.general.nameAr}.` 
      : `&copy; ${new Date().getFullYear()} All rights reserved for ${appState.general.nameEn}.`;
  }
  const waFloat = document.getElementById('whatsapp-float-btn');
  if (waFloat) {
    waFloat.href = `https://wa.me/${appState.contact.whatsapp}`;
    const tooltip = waFloat.querySelector('.whatsapp-tooltip');
    if (tooltip) {
      tooltip.textContent = lang === 'ar' ? 'تواصل معنا واتساب' : 'Chat on WhatsApp';
    }
  }

  setupScrollSpy();
  initCounterAnimations();

  // Refresh AOS after rendering new dynamic content
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

function filterPortfolioItems(filterVal) {
  const lang = currentLang;
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;

  let portfolioHtml = '';
  let count = 0;
  appState.portfolio.forEach(item => {
    const itemCategory = lang === 'ar' ? item.categoryAr : item.categoryEn;
    if (filterVal === 'all' || itemCategory === filterVal) {
      portfolioHtml += `
        <div class="glass-card portfolio-card" data-aos="zoom-in" data-aos-delay="${count * 80}">
          <div class="portfolio-img-box">
            <img src="${item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}" alt="${lang === 'ar' ? item.titleAr : item.titleEn}">
          </div>
          <div class="portfolio-info">
            <span class="portfolio-badge">${itemCategory}</span>
            <h5>${lang === 'ar' ? item.titleAr : item.titleEn}</h5>
          </div>
        </div>
      `;
      count++;
    }
  });

  portfolioGrid.innerHTML = portfolioHtml;

  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

// Navigation helpers
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  renderSite();
}

function toggleTheme() {
  appState.theme.isDarkMode = !appState.theme.isDarkMode;
  saveState();
  renderSite();
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.onscroll = () => {
    let current = '';
    const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
    
    const navbar = document.getElementById('navbar');
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
}

// Contact form placeholder handler
function handleFormSubmit(e) {
  e.preventDefault();
  alert(currentLang === 'ar' 
    ? 'تم إرسال طلبك بنجاح! سيتواصل معك أحد مستشارينا قريباً.' 
    : 'Your request has been sent successfully! Our consultant will contact you shortly.');
  e.target.reset();
}


/* ==========================================================================
   Admin Panel Operations
   ========================================================================== */
let isAdminLoggedIn = false;

function toggleAdminOverlay() {
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;

  if (overlay.style.display === 'flex') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'flex';
    if (!isAdminLoggedIn) {
      showAdminLogin();
    } else {
      showAdminDashboard();
    }
  }
}

// Username and Password Verification
function verifyAdminLogin() {
  const userInput = document.getElementById('admin-user-field');
  const passInput = document.getElementById('admin-pass-field');
  if (!userInput || !passInput) return;

  const validUsername = appState.auth.username || 'admin';
  const validPassword = appState.auth.password || '1234';

  if (userInput.value === validUsername && passInput.value === validPassword) {
    isAdminLoggedIn = true;
    showAdminDashboard();
  } else {
    alert(currentLang === 'ar' ? 'خطأ في اسم المستخدم أو كلمة المرور!' : 'Invalid username or password!');
  }
}

function showAdminLogin() {
  const container = document.getElementById('admin-panel-container');
  if (!container) return;

  container.className = 'glass-card login-overlay';
  container.innerHTML = `
    <i class="fas fa-lock" style="font-size:3rem; margin-bottom:16px; color:var(--primary);"></i>
    <h3>${currentLang === 'ar' ? 'لوحة التحكم السريّة' : 'Protected Control Panel'}</h3>
    <p>${currentLang === 'ar' ? 'الرجاء إدخال اسم المستخدم ورمز الدخول لتعديل هويات ومواقع الشركات.' : 'Enter username and password to manage companies configuration.'}</p>
    
    <div class="form-group" style="width:100%; text-align:right;">
      <label class="form-label">${currentLang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
      <input type="text" id="admin-user-field" class="form-input" placeholder="admin" style="text-align:center;">
    </div>
    
    <div class="form-group" style="width:100%; text-align:right; margin-bottom:24px;">
      <label class="form-label">${currentLang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
      <input type="password" id="admin-pass-field" class="form-input" placeholder="****" style="text-align:center;">
    </div>

    <button class="btn btn-primary" style="width:100%; border-radius:10px;" onclick="verifyAdminLogin()">
      ${currentLang === 'ar' ? 'تسجيل الدخول' : 'Login'}
    </button>
  `;

  // Allow enter key submission on inputs
  const submitOnEnter = (e) => { if (e.key === 'Enter') verifyAdminLogin(); };
  document.getElementById('admin-user-field').addEventListener('keypress', submitOnEnter);
  document.getElementById('admin-pass-field').addEventListener('keypress', submitOnEnter);
}

function showAdminDashboard() {
  const container = document.getElementById('admin-panel-container');
  if (!container) return;

  container.className = 'glass-card admin-panel';
  container.innerHTML = `
    <div class="admin-header">
      <h2><i class="fas fa-sliders"></i> ${currentLang === 'ar' ? 'لوحة التحكم الفنية للشركات' : 'Admin Control Panel'}</h2>
      <button class="admin-close" onclick="toggleAdminOverlay()"><i class="fas fa-times"></i></button>
    </div>
    <div class="admin-body">
      <div class="admin-sidebar">
        <button class="admin-tab-btn active" onclick="switchAdminTab(event, 'tab-general')"><i class="fas fa-cog"></i> ${currentLang === 'ar' ? 'عام و حماية' : 'General & Auth'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-seo')"><i class="fas fa-search-plus"></i> ${currentLang === 'ar' ? 'أرشفة SEO' : 'SEO Meta'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-hero')"><i class="fas fa-desktop"></i> ${currentLang === 'ar' ? 'الرئيسية' : 'Hero'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-about')"><i class="fas fa-info-circle"></i> ${currentLang === 'ar' ? 'من نحن' : 'About'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-services')"><i class="fas fa-print"></i> ${currentLang === 'ar' ? 'الخدمات' : 'Services'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-portfolio')"><i class="fas fa-images"></i> ${currentLang === 'ar' ? 'أعمالنا' : 'Portfolio'}</button>
        <button class="admin-tab-btn" onclick="switchAdminTab(event, 'tab-contact')"><i class="fas fa-phone"></i> ${currentLang === 'ar' ? 'اتصال' : 'Contact'}</button>
      </div>
      
      <div class="admin-content-pane">
        <!-- GENERAL & AUTH TAB -->
        <div id="tab-general" class="admin-tab-content active">
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">اسم الشركة (عربي)</label>
              <input type="text" id="adm-name-ar" class="form-input" value="${appState.general.nameAr}">
            </div>
            <div class="form-group">
              <label class="form-label">اسم الشركة (En)</label>
              <input type="text" id="adm-name-en" class="form-input" value="${appState.general.nameEn}">
            </div>
          </div>
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">شعار الشركة (عربي)</label>
              <input type="text" id="adm-logo-ar" class="form-input" value="${appState.general.logoTextAr}">
            </div>
            <div class="form-group">
              <label class="form-label">شعار الشركة (En)</label>
              <input type="text" id="adm-logo-en" class="form-input" value="${appState.general.logoTextEn}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">تعديل لون المظهر العام للموقع (العلامة التجارية)</label>
            <div class="color-picker-wrapper">
              <input type="range" id="adm-color-hue" class="color-picker-slider" min="0" max="360" value="${appState.theme.primaryHue}" oninput="syncAdminColorPreview(this.value)">
              <div id="adm-color-preview" class="color-picker-preview"></div>
            </div>
          </div>
          
          <h4 style="margin-top:40px; margin-bottom:15px; border-top:1px solid var(--glass-border); padding-top:20px; color:var(--primary); font-weight:800;">
            ${currentLang === 'ar' ? 'تعديل بيانات الدخول للوحة التحكم' : 'Control Panel Credentials'}
          </h4>
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">اسم مستخدم جديد</label>
              <input type="text" id="adm-auth-user" class="form-input" value="${appState.auth.username}">
            </div>
            <div class="form-group">
              <label class="form-label">كلمة مرور جديدة</label>
              <input type="password" id="adm-auth-pass" class="form-input" value="${appState.auth.password}">
            </div>
          </div>
        </div>

        <!-- SEO TAB (COMPREHENSIVE OPTIMIZATION) -->
        <div id="tab-seo" class="admin-tab-content">
          <h3 style="margin-bottom:20px; font-weight:800; color:var(--primary);"><i class="fas fa-globe"></i> إعدادات الأرشفة والـ SEO لـ Google</h3>
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">عنوان الميتا (Meta Title - عربي)</label>
              <input type="text" id="adm-seo-title-ar" class="form-input" value="${appState.seo.metaTitleAr}">
              <p class="admin-control-desc">العنوان الذي يظهر في نتائج بحث جوجل (موصى به: 50-60 حرفاً)</p>
            </div>
            <div class="form-group">
              <label class="form-label">عنوان الميتا (Meta Title - En)</label>
              <input type="text" id="adm-seo-title-en" class="form-input" value="${appState.seo.metaTitleEn}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">وصف الميتا (Meta Description - عربي)</label>
            <textarea id="adm-seo-desc-ar" class="form-input" style="min-height:70px;">${appState.seo.metaDescAr}</textarea>
            <p class="admin-control-desc">الوصف الذي يظهر تحت العنوان في نتائج البحث (موصى به: 150-160 حرفاً)</p>
          </div>
          <div class="form-group">
            <label class="form-label">وصف الميتا (Meta Description - En)</label>
            <textarea id="adm-seo-desc-en" class="form-input" style="min-height:70px;">${appState.seo.metaDescEn}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">الكلمات المفتاحية (Keywords separated by comma)</label>
            <input type="text" id="adm-seo-keywords" class="form-input" value="${appState.seo.metaKeywords}">
          </div>
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">الرابط الرئيسي (Canonical URL)</label>
              <input type="text" id="adm-seo-canonical" class="form-input" value="${appState.seo.canonicalUrl}">
              <p class="admin-control-desc">الرابط الأساسي للموقع لتجنب تكرار المحتوى بمحركات البحث.</p>
            </div>
            <div class="form-group">
              <label class="form-label">صورة معاينة النشر (OpenGraph Image)</label>
              <input type="text" id="adm-seo-ogimage" class="form-input" value="${appState.seo.ogImage}">
              <p class="admin-control-desc">رابط الصورة المعروضة عند مشاركة موقعك على السوشيال ميديا.</p>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">رابط النطاق لتوليد خرائط الأرشفة (Sitemap Domain)</label>
            <input type="text" id="adm-seo-domain" class="form-input" value="${appState.seo.sitemapDomain || 'https://printadd.sa'}">
          </div>

          <h4 style="margin-top:30px; margin-bottom:15px; border-top:1px solid var(--glass-border); padding-top:20px; color:var(--primary); font-weight:800;">
            أدوات وملفات الأرشفة التلقائية (SEO Assets Generators):
          </h4>
          <div class="admin-row">
            <div class="glass-card" style="padding:15px; border-color:var(--glass-border);">
              <h5 style="margin-bottom:8px; font-weight:700;"><i class="fas fa-sitemap"></i> ملف الخارطة Sitemap.xml</h5>
              <p style="font-size:0.75rem; color:var(--text-3); margin-bottom:12px;">ملف الخريطة يسهل زحف وفهرسة روبوتات Google للموقع.</p>
              <button class="btn btn-secondary" style="font-size:0.8rem; padding:8px 16px;" onclick="downloadSitemapXml()">توليد وتحميل Sitemap.xml</button>
            </div>
            <div class="glass-card" style="padding:15px; border-color:var(--glass-border);">
              <h5 style="margin-bottom:8px; font-weight:700;"><i class="fas fa-robot"></i> ملف التوجيه Robots.txt</h5>
              <p style="font-size:0.75rem; color:var(--text-3); margin-bottom:12px;">يوجه عناكب محركات البحث للمسارات المسموح أرشفتها.</p>
              <button class="btn btn-secondary" style="font-size:0.8rem; padding:8px 16px;" onclick="downloadRobotsTxt()">توليد وتحميل Robots.txt</button>
            </div>
          </div>
        </div>

        <!-- HERO TAB -->
        <div id="tab-hero" class="admin-tab-content">
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">شعار القسم الصغير (عربي)</label>
              <input type="text" id="adm-hero-badge-ar" class="form-input" value="${appState.hero.badgeAr}">
            </div>
            <div class="form-group">
              <label class="form-label">شعار القسم الصغير (En)</label>
              <input type="text" id="adm-hero-badge-en" class="form-input" value="${appState.hero.badgeEn}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">العنوان الرئيسي (عربي)</label>
            <textarea id="adm-hero-title-ar" class="form-input">${appState.hero.titleAr}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">العنوان الرئيسي (En)</label>
            <textarea id="adm-hero-title-en" class="form-input">${appState.hero.titleEn}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">الوصف الفرعي (عربي)</label>
            <textarea id="adm-hero-desc-ar" class="form-input">${appState.hero.subtitleAr}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">الوصف الفرعي (En)</label>
            <textarea id="adm-hero-desc-en" class="form-input">${appState.hero.subtitleEn}</textarea>
          </div>

          <!-- Card 1 & Card 2 Configuration -->
          <h4 style="margin-top:25px; margin-bottom:15px; border-top:1px solid var(--glass-border); padding-top:20px; color:var(--primary); font-weight:800;">
            تعديل البطاقات العائمة بالقسم العلوي (Floating Cards)
          </h4>
          <div class="glass-card" style="padding: 20px; margin-bottom: 20px; border-color: var(--glass-border);">
            <h5 style="margin-bottom: 15px; font-weight: 700; color: var(--primary);">البطاقة الأولى (Card 1)</h5>
            <div class="admin-row">
              <div class="form-group">
                <label class="form-label">العنوان (عربي)</label>
                <input type="text" id="adm-hero-card1-title-ar" class="form-input" value="${appState.hero.card1TitleAr || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (En)</label>
                <input type="text" id="adm-hero-card1-title-en" class="form-input" value="${appState.hero.card1TitleEn || ''}">
              </div>
            </div>
            <div class="admin-row">
              <div class="form-group">
                <label class="form-label">الوصف الفرعي (عربي)</label>
                <input type="text" id="adm-hero-card1-sub-ar" class="form-input" value="${appState.hero.card1SubAr || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">الوصف الفرعي (En)</label>
                <input type="text" id="adm-hero-card1-sub-en" class="form-input" value="${appState.hero.card1SubEn || ''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">أيقونة البطاقة (FontAwesome class)</label>
              <input type="text" id="adm-hero-card1-icon" class="form-input" value="${appState.hero.card1Icon || 'fa-ruler-combined'}">
            </div>
          </div>

          <div class="glass-card" style="padding: 20px; border-color: var(--glass-border);">
            <h5 style="margin-bottom: 15px; font-weight: 700; color: var(--primary);">البطاقة الثانية (Card 2)</h5>
            <div class="admin-row">
              <div class="form-group">
                <label class="form-label">العنوان (عربي)</label>
                <input type="text" id="adm-hero-card2-title-ar" class="form-input" value="${appState.hero.card2TitleAr || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (En)</label>
                <input type="text" id="adm-hero-card2-title-en" class="form-input" value="${appState.hero.card2TitleEn || ''}">
              </div>
            </div>
            <div class="admin-row">
              <div class="form-group">
                <label class="form-label">الوصف الفرعي (عربي)</label>
                <input type="text" id="adm-hero-card2-sub-ar" class="form-input" value="${appState.hero.card2SubAr || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">الوصف الفرعي (En)</label>
                <input type="text" id="adm-hero-card2-sub-en" class="form-input" value="${appState.hero.card2SubEn || ''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">أيقونة البطاقة (FontAwesome class)</label>
              <input type="text" id="adm-hero-card2-icon" class="form-input" value="${appState.hero.card2Icon || 'fa-clipboard-check'}">
            </div>
          </div>
        </div>

        <!-- ABOUT TAB -->
        <div id="tab-about" class="admin-tab-content">
          <div class="form-group">
            <label class="form-label">نص من نحن (عربي)</label>
            <textarea id="adm-about-content-ar" class="form-input" style="min-height:150px;">${appState.about.contentAr}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">نص من نحن (En)</label>
            <textarea id="adm-about-content-en" class="form-input" style="min-height:150px;">${appState.about.contentEn}</textarea>
          </div>
        </div>

        <!-- SERVICES TAB -->
        <div id="tab-services" class="admin-tab-content">
          <div id="admin-services-list"></div>
          <button class="btn-add-item" onclick="addNewServiceField()"><i class="fas fa-plus"></i> إضافة خدمة جديدة</button>
        </div>

        <!-- PORTFOLIO TAB -->
        <div id="tab-portfolio" class="admin-tab-content">
          <div id="admin-portfolio-list"></div>
          <button class="btn-add-item" onclick="addNewPortfolioField()"><i class="fas fa-plus"></i> إضافة مشروع جديد</button>
        </div>

        <!-- CONTACT TAB -->
        <div id="tab-contact" class="admin-tab-content">
          <div class="admin-row">
            <div class="form-group">
              <label class="form-label">رقم الهاتف</label>
              <input type="text" id="adm-contact-phone" class="form-input" value="${appState.contact.phone}">
            </div>
            <div class="form-group">
              <label class="form-label">رقم واتساب (مثل: 966501200001)</label>
              <input type="text" id="adm-contact-whatsapp" class="form-input" value="${appState.contact.whatsapp}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">البريد الإلكتروني</label>
            <input type="email" id="adm-contact-email" class="form-input" value="${appState.contact.email}">
          </div>
          <div class="form-group">
            <label class="form-label">العنوان الجغرافي (عربي)</label>
            <input type="text" id="adm-contact-address-ar" class="form-input" value="${appState.contact.addressAr}">
          </div>
          <div class="form-group">
            <label class="form-label">العنوان الجغرافي (En)</label>
            <input type="text" id="adm-contact-address-en" class="form-input" value="${appState.contact.addressEn}">
          </div>
          <div class="form-group">
            <label class="form-label">رابط خريطة Google (Iframe Source URL)</label>
            <input type="text" id="adm-contact-map" class="form-input" value="${appState.contact.mapIframe}">
          </div>
        </div>
      </div>
    </div>
    
    <div class="admin-actions-bar">
      <div class="admin-actions-group">
        <button class="btn btn-secondary btn-admin" style="padding:10px 15px;" onclick="downloadActiveConfig()"><i class="fas fa-download"></i> تصدير البيانات (JSON)</button>
        <button class="btn btn-secondary btn-admin" style="padding:10px 15px;" onclick="triggerConfigUpload()"><i class="fas fa-upload"></i> استيراد ملف البيانات</button>
        <input type="file" id="config-upload-input" style="display:none;" accept=".json" onchange="uploadConfigJson(event)">
      </div>
      <div class="admin-actions-group">
        <button class="btn btn-secondary btn-admin" style="padding:10px 15px;" onclick="bundleAndDownloadStaticSite()"><i class="fas fa-file-code"></i> تحميل قالب الموقع المتكامل</button>
        <button class="btn btn-primary btn-admin" style="padding:10px 25px; border-radius:8px;" onclick="saveAdminData()"><i class="fas fa-save"></i> حفظ البيانات</button>
      </div>
    </div>
  `;

  syncAdminColorPreview(appState.theme.primaryHue);
  renderAdminServicesForm();
  renderAdminPortfolioForm();
}

function switchAdminTab(e, tabId) {
  const buttons = document.querySelectorAll('.admin-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  e.currentTarget.classList.add('active');

  const contents = document.querySelectorAll('.admin-tab-content');
  contents.forEach(pane => pane.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function syncAdminColorPreview(hue) {
  const root = document.documentElement;
  root.style.setProperty('--primary-hue', hue);
  const preview = document.getElementById('adm-color-preview');
  if (preview) {
    preview.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
  }
}

// Dynamic Forms: Services
function renderAdminServicesForm() {
  const container = document.getElementById('admin-services-list');
  if (!container) return;

  let html = '';
  appState.services.forEach((srv, index) => {
    html += `
      <div class="list-editor-item" data-index="${index}">
        <div class="list-editor-inputs">
          <div class="admin-row" style="margin-bottom:0;">
            <input type="text" class="form-input srv-input-name-ar" placeholder="اسم الخدمة (عربي)" value="${srv.nameAr}">
            <input type="text" class="form-input srv-input-name-en" placeholder="اسم الخدمة (En)" value="${srv.nameEn}">
          </div>
          <div class="admin-row" style="margin-bottom:0;">
            <input type="text" class="form-input srv-input-desc-ar" placeholder="الوصف (عربي)" value="${srv.descAr}">
            <input type="text" class="form-input srv-input-desc-en" placeholder="الوصف (En)" value="${srv.descEn}">
          </div>
          <input type="text" class="form-input srv-input-icon" placeholder="أيقونة FontAwesome مثل: fa-print" value="${srv.icon || 'fa-star'}">
        </div>
        <button class="btn-item-delete" onclick="deleteServiceField(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addNewServiceField() {
  syncServiceInputsToState();
  appState.services.push({
    nameAr: "خدمة جديدة",
    nameEn: "New Service",
    descAr: "شرح مبسط عن الخدمة هنا",
    descEn: "Simple description here",
    icon: "fa-star"
  });
  renderAdminServicesForm();
}

function deleteServiceField(index) {
  syncServiceInputsToState();
  appState.services.splice(index, 1);
  renderAdminServicesForm();
}

function syncServiceInputsToState() {
  const items = document.querySelectorAll('#admin-services-list .list-editor-item');
  const activeServices = [];
  items.forEach(item => {
    const idx = parseInt(item.getAttribute('data-index'), 10);
    activeServices.push({
      id: `srv-${idx + 1}`,
      nameAr: item.querySelector('.srv-input-name-ar').value,
      nameEn: item.querySelector('.srv-input-name-en').value,
      descAr: item.querySelector('.srv-input-desc-ar').value,
      descEn: item.querySelector('.srv-input-desc-en').value,
      icon: item.querySelector('.srv-input-icon').value
    });
  });
  appState.services = activeServices;
}

// Dynamic Forms: Portfolio
function renderAdminPortfolioForm() {
  const container = document.getElementById('admin-portfolio-list');
  if (!container) return;

  let html = '';
  appState.portfolio.forEach((port, index) => {
    html += `
      <div class="list-editor-item" data-index="${index}">
        <div class="list-editor-inputs">
          <div class="admin-row" style="margin-bottom:0;">
            <input type="text" class="form-input port-input-title-ar" placeholder="عنوان المشروع (عربي)" value="${port.titleAr}">
            <input type="text" class="form-input port-input-title-en" placeholder="عنوان المشروع (En)" value="${port.titleEn}">
          </div>
          <div class="admin-row" style="margin-bottom:0;">
            <input type="text" class="form-input port-input-cat-ar" placeholder="التصنيف (عربي) مثل: لوحات" value="${port.categoryAr}">
            <input type="text" class="form-input port-input-cat-en" placeholder="التصنيف (En) مثل: Signage" value="${port.categoryEn}">
          </div>
          <input type="text" class="form-input port-input-image" placeholder="رابط صورة المشروع" value="${port.image}">
        </div>
        <button class="btn-item-delete" onclick="deletePortfolioField(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addNewPortfolioField() {
  syncPortfolioInputsToState();
  appState.portfolio.push({
    titleAr: "مشروع جديد",
    titleEn: "New Project",
    categoryAr: "لوحات",
    categoryEn: "Signage",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  });
  renderAdminPortfolioForm();
}

function deletePortfolioField(index) {
  syncPortfolioInputsToState();
  appState.portfolio.splice(index, 1);
  renderAdminPortfolioForm();
}

function syncPortfolioInputsToState() {
  const items = document.querySelectorAll('#admin-portfolio-list .list-editor-item');
  const activePort = [];
  items.forEach(item => {
    const idx = parseInt(item.getAttribute('data-index'), 10);
    activePort.push({
      id: `port-${idx + 1}`,
      titleAr: item.querySelector('.port-input-title-ar').value,
      titleEn: item.querySelector('.port-input-title-en').value,
      categoryAr: item.querySelector('.port-input-cat-ar').value,
      categoryEn: item.querySelector('.port-input-cat-en').value,
      image: item.querySelector('.port-input-image').value
    });
  });
  appState.portfolio = activePort;
}

// Save Admin Data
function saveAdminData() {
  syncServiceInputsToState();
  syncPortfolioInputsToState();

  // General Settings & Auth Settings
  appState.general.nameAr = document.getElementById('adm-name-ar').value;
  appState.general.nameEn = document.getElementById('adm-name-en').value;
  appState.general.logoTextAr = document.getElementById('adm-logo-ar').value;
  appState.general.logoTextEn = document.getElementById('adm-logo-en').value;
  
  appState.auth.username = document.getElementById('adm-auth-user').value;
  appState.auth.password = document.getElementById('adm-auth-pass').value;

  appState.theme.primaryHue = parseInt(document.getElementById('adm-color-hue').value, 10);

  // SEO Settings
  appState.seo.metaTitleAr = document.getElementById('adm-seo-title-ar').value;
  appState.seo.metaTitleEn = document.getElementById('adm-seo-title-en').value;
  appState.seo.metaDescAr = document.getElementById('adm-seo-desc-ar').value;
  appState.seo.metaDescEn = document.getElementById('adm-seo-desc-en').value;
  appState.seo.metaKeywords = document.getElementById('adm-seo-keywords').value;
  appState.seo.canonicalUrl = document.getElementById('adm-seo-canonical').value;
  appState.seo.ogImage = document.getElementById('adm-seo-ogimage').value;
  appState.seo.sitemapDomain = document.getElementById('adm-seo-domain').value;

  // Hero Section
  appState.hero.badgeAr = document.getElementById('adm-hero-badge-ar').value;
  appState.hero.badgeEn = document.getElementById('adm-hero-badge-en').value;
  appState.hero.titleAr = document.getElementById('adm-hero-title-ar').value;
  appState.hero.titleEn = document.getElementById('adm-hero-title-en').value;
  appState.hero.subtitleAr = document.getElementById('adm-hero-desc-ar').value;
  appState.hero.subtitleEn = document.getElementById('adm-hero-desc-en').value;

  // Save Floating Cards configurations
  appState.hero.card1TitleAr = document.getElementById('adm-hero-card1-title-ar').value;
  appState.hero.card1TitleEn = document.getElementById('adm-hero-card1-title-en').value;
  appState.hero.card1SubAr = document.getElementById('adm-hero-card1-sub-ar').value;
  appState.hero.card1SubEn = document.getElementById('adm-hero-card1-sub-en').value;
  appState.hero.card1Icon = document.getElementById('adm-hero-card1-icon').value;

  appState.hero.card2TitleAr = document.getElementById('adm-hero-card2-title-ar').value;
  appState.hero.card2TitleEn = document.getElementById('adm-hero-card2-title-en').value;
  appState.hero.card2SubAr = document.getElementById('adm-hero-card2-sub-ar').value;
  appState.hero.card2SubEn = document.getElementById('adm-hero-card2-sub-en').value;
  appState.hero.card2Icon = document.getElementById('adm-hero-card2-icon').value;

  // About Section
  appState.about.contentAr = document.getElementById('adm-about-content-ar').value;
  appState.about.contentEn = document.getElementById('adm-about-content-en').value;

  // Contact Section
  appState.contact.phone = document.getElementById('adm-contact-phone').value;
  appState.contact.whatsapp = document.getElementById('adm-contact-whatsapp').value;
  appState.contact.email = document.getElementById('adm-contact-email').value;
  appState.contact.addressAr = document.getElementById('adm-contact-address-ar').value;
  appState.contact.addressEn = document.getElementById('adm-contact-address-en').value;
  appState.contact.mapIframe = document.getElementById('adm-contact-map').value;

  saveState();
  renderSite();

  alert(currentLang === 'ar' ? 'تم حفظ التعديلات وتحديث الموقع والـ SEO بنجاح!' : 'Changes and SEO settings saved successfully!');
  toggleAdminOverlay();
}

// Robots.txt Generator
function downloadRobotsTxt() {
  const domain = appState.seo.sitemapDomain || "https://printadd.sa";
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${domain.endsWith('/') ? domain : domain + '/'}sitemap.xml`;
  
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = "robots.txt";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Sitemap.xml Generator
function downloadSitemapXml() {
  const domain = appState.seo.sitemapDomain || "https://printadd.sa";
  const cleanDomain = domain.endsWith('/') ? domain : domain + '/';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Home Route
  xml += `  <url>\n    <loc>${cleanDomain}</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
  
  // Section links
  const sections = ["#about", "#services", "#portfolio", "#contact"];
  sections.forEach(sec => {
    xml += `  <url>\n    <loc>${cleanDomain}${sec}</loc>\n    <priority>0.80</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
  });
  
  xml += `</urlset>`;
  
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = "sitemap.xml";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import / Export JSON
function downloadActiveConfig() {
  syncServiceInputsToState();
  syncPortfolioInputsToState();

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  
  const cleanName = appState.general.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
  downloadAnchor.setAttribute("download", `config-${cleanName}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function triggerConfigUpload() {
  document.getElementById('config-upload-input').click();
}

function uploadConfigJson(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (parsedData.general && parsedData.services && parsedData.contact) {
        appState = parsedData;
        saveState();
        renderSite();
        alert(currentLang === 'ar' ? 'تم استيراد ملف البيانات بنجاح!' : 'Data file imported successfully!');
        showAdminDashboard();
      } else {
        alert(currentLang === 'ar' ? 'الملف المرفوع غير متوافق!' : 'The uploaded JSON file is invalid!');
      }
    } catch (err) {
      alert(currentLang === 'ar' ? 'حدث خطأ في قراءة ملف JSON' : 'Failed to parse JSON file!');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Static HTML Compiler & Downloader
async function bundleAndDownloadStaticSite() {
  syncServiceInputsToState();
  syncPortfolioInputsToState();

  try {
    const cssRes = await fetch('css/style.css');
    const cssText = await cssRes.text();

    const cursorRes = await fetch('js/cursor-trail.js');
    const cursorText = await cursorRes.text();

    const appRes = await fetch('js/app.js');
    let appText = await appRes.text();

    let htmlRes = await fetch('index.html');
    let htmlText = await htmlRes.text();

    htmlText = htmlText.replace(
      '<link rel="stylesheet" href="css/style.css">',
      `<style>\n${cssText}\n</style>`
    );

    htmlText = htmlText.replace(
      '<script src="js/default-data.js"></script>',
      `<script>\nconst defaultCompanyData = ${JSON.stringify(appState, null, 2)};\n</script>`
    );

    htmlText = htmlText.replace(
      '<script src="js/cursor-trail.js"></script>',
      `<script>\n${cursorText}\n</script>`
    );

    htmlText = htmlText.replace(
      '<script src="js/app.js"></script>',
      `<script>\n${appText}\n</script>`
    );

    const htmlBlob = new Blob([htmlText], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(htmlBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    
    const cleanName = appState.general.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadAnchor.download = `index-${cleanName}.html`;
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(blobUrl);

    alert(currentLang === 'ar' ? 'تم إنشاء ملف الموقع المتكامل بنجاح!' : 'Static website compiled and downloaded successfully!');
  } catch (error) {
    console.error("Bundling error: ", error);
    alert(currentLang === 'ar' 
      ? 'فشل الإنشاء التلقائي. يرجى تشغيل الموقع على خادم محلي (localhost) لتجنب قيود الحماية CORS في المتصفح.' 
      : 'Bundling failed. Make sure you run the app on a local web server to avoid browser CORS policy restrictions.');
  }
}

// Count-up stats animations using IntersectionObserver
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number.count-up');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        animateCount(target, targetVal, suffix);
        obs.unobserve(target); // Only animate once
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, targetVal, suffix) {
  let startTimestamp = null;
  const duration = 1600; // 1.6 seconds transition

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Easing: easeOutQuad
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * targetVal);
    
    element.textContent = currentValue.toLocaleString() + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = targetVal.toLocaleString() + suffix;
    }
  }
  
  window.requestAnimationFrame(step);
}

// App Launch
window.addEventListener('DOMContentLoaded', () => {
  initStore();
  renderSite();
});
