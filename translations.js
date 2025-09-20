
/**
 * translations.js
 * Site-wide bilingual support (Arabic ↔ English)
 * - Works with your existing markup (adds fallbacks if data-i18n is missing)
 * - Persists choice in localStorage
 * - Switch using any element with [data-lang-toggle] or with text "EN"/"AR"
 * - Updates placeholders, titles, dir/language, and keeps navigation working
 */

(function () {
  const DEFAULT_LANG = 'ar';

  // --- 1) Dictionary (add more keys as needed) ---
  // Use short keys. Example: data-i18n="nav.home", data-i18n-placeholder="form.phone"
  const dict = {
    // NAV + COMMON
    "nav.home":      { ar: "الرئيسية", en: "Home" },
    "nav.about":     { ar: "من نحن", en: "About Us" },
    "nav.products":  { ar: "منتجاتنا", en: "Products" },
    "nav.news":      { ar: "الأخبار", en: "News" },
    "nav.contact":   { ar: "تواصل معنا", en: "Contact Us" },
    "nav.careers":   { ar: "الوظائف", en: "Careers" },
    "nav.store":     { ar: "المتجر الإلكتروني", en: "Online Store" },
    "nav.explore":   { ar: "أكتشف منتجاتنا", en: "Discover Our Products" },
    "nav.viewMore":  { ar: "عرض المزيد", en: "View more" },

    // HEADERS / SECTIONS (samples)
    "home.hero.h1":  { ar: "بطارية تم صنعها\nداخل المملكة", en: "A Battery\nMade in the Kingdom" },
    "home.hero.p":   { ar: "نسبة المحتوى المحلي في المنتجات", en: "Local content percentage in products" },
    "home.hero.line":{ ar: "نفخر بأننا جزء من قصة نجاح الصناعة السعودية منذ أكثر من 30 عامً", en: "Proud to be part of Saudi industry success for over 30 years" },
    "about.title":   { ar: "من نحن", en: "About Us" },
    "news.title":    { ar: "الأخبار", en: "News" },
    "products.title":{ ar: "منتجاتنا", en: "Our Products" },
    "contact.title": { ar: "تواصل معنا", en: "Contact Us" },
    "careers.title": { ar: "الوظائف", en: "Careers" },

    // FOOTER
    "footer.privacy":   { ar: "الخصوصية", en: "Privacy" },
    "footer.terms":     { ar: "شروط الأستخدام", en: "Terms of Use" },
    "footer.warranty":  { ar: "الضمان", en: "Warranty" },
    "footer.links":     { ar: "روابط مهمة", en: "Important Links" },
    "footer.about":     { ar: "من نحن", en: "About Us" },
    "footer.products":  { ar: "منتجاتنا", en: "Products" },
    "footer.website":   { ar: "الموقع الألكتروني", en: "Website" },
    "footer.news":      { ar: "الأخبار", en: "News" },
    "footer.contact":   { ar: "تواصل معنا", en: "Contact Us" },
    "footer.copyright": { ar: "© جميع الحقوق محفوظة للشركة الوطنية لصناعة البطاريات", en: "© All rights reserved to the National Battery Company" },
    "footer.blurb":     { ar: "منذ 1995، نوفر بطاريات عالية الجودة تلبي احتياجات العملاء، مع التزامنا بالابتكار والجودة. نفخر بثقة عملائنا وحصولنا على جوائز مرموقة، ونعمل لمواكبة رؤية 2030 وتعزيز الصناعة السعودية.", en: "Since 1995, we have provided high‑quality batteries that meet customer needs, with a commitment to innovation and quality. We are proud of our customers’ trust and our awards, and we work to support Vision 2030 and strengthen Saudi industry." },

    // FORMS (placeholders / labels)
    "form.title":        { ar: "نموذج تسجيل الضمان", en: "Warranty Registration Form" },
    "form.fullName":     { ar: "الاسم بالكامل", en: "Full Name" },
    "form.fullName.ph":  { ar: "ادخل اسمك بالكامل", en: "Enter your full name" },
    "form.phone":        { ar: "رقم الجوال", en: "Mobile Number" },
    "form.phone.ph":     { ar: "966XXXXXXXXX+", en: "+966XXXXXXXXX" },
    "form.city":         { ar: "المدينة", en: "City" },
    "form.city.ph":      { ar: "ادخل المدينة", en: "Enter your city" },
    "form.email":        { ar: "البريد الألكتروني", en: "Email" },
    "form.email.ph":     { ar: "ادخل بريدك الألكتروني", en: "Enter your email" },
    "form.distributor":  { ar: "الموزع المعتمد الذي تم الشراء منه", en: "Authorized distributor purchased from" },
    "form.distributor.ph": { ar: "ادخل اسمك الموزع", en: "Enter distributor name" },
  };

  // Fallback dictionary based on literal Arabic text present in the site.
  // If a node lacks data-i18n, we try to match its original Arabic text.
  const literalFallback = {};
  Object.keys(dict).forEach(k => {
    const ar = dict[k].ar;
    const en = dict[k].en;
    literalFallback[ar] = en;
  });

  // --- 2) Helpers ---
  const htmlEl = document.documentElement;

  function setDirFor(lang) {
    if (lang === 'en') {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
      document.body.classList.add('lang-en');
    } else {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ar');
      document.body.classList.remove('lang-en');
    }
  }

  function t(key, lang) {
    const entry = dict[key];
    if (!entry) return null;
    return lang === 'en' ? (entry.en ?? entry.ar) : (entry.ar ?? entry.en);
  }

  function applyNode(node, lang) {
    // text nodes with data-i18n
    if (node.hasAttribute && node.hasAttribute('data-i18n')) {
      const key = node.getAttribute('data-i18n');
      const val = t(key, lang);
      if (val != null) node.textContent = val;
      return;
    }
    // placeholders
    if (node.hasAttribute && node.hasAttribute('data-i18n-placeholder')) {
      const key = node.getAttribute('data-i18n-placeholder');
      const val = t(key, lang);
      if (val != null) node.setAttribute('placeholder', val);
    }
    // titles
    if (node === document.title || node.tagName === 'TITLE') {
      const titleKey = node.getAttribute && node.getAttribute('data-i18n-title');
      if (titleKey) {
        const val = t(titleKey, lang);
        if (val != null) document.title = val;
      }
    }
  }

  function walkAndTranslate(lang) {
    // data-i18n & placeholders
    document.querySelectorAll('[data-i18n],[data-i18n-placeholder],title[data-i18n-title]').forEach(el => {
      applyNode(el, lang);
    });

    // Literal fallback: replace exact Arabic strings if found and if element has no data-i18n
    // We only do this on elements that are likely pure-text labels (divs/spans/a/buttons)
    const labelSelectors = 'div,span,a,button,p,h1,h2,h3,h4,h5,h6';
    document.querySelectorAll(labelSelectors).forEach(el => {
      if (el.hasAttribute('data-i18n')) return; // skip ones handled above
      const raw = (el.textContent || '').trim();
      if (!raw) return;
      // If switching to EN, try converting AR→EN; if to AR, try the opposite using dict
      if (lang === 'en' && literalFallback[raw]) {
        el.textContent = literalFallback[raw];
      } else if (lang === 'ar') {
        // build reverse map lazily
        if (!window.__revMap) {
          window.__revMap = {};
          Object.keys(dict).forEach(k => { window.__revMap[dict[k].en] = dict[k].ar; });
        }
        if (window.__revMap[raw]) el.textContent = window.__revMap[raw];
      }
    });

    // Placeholders literal fallback
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el => {
      if (el.hasAttribute('data-i18n-placeholder')) return;
      const ph = el.getAttribute('placeholder') || '';
      if (lang === 'en' && literalFallback[ph]) {
        el.setAttribute('placeholder', literalFallback[ph]);
      } else if (lang === 'ar' && window.__revMap && window.__revMap[ph]) {
        el.setAttribute('placeholder', window.__revMap[ph]);
      }
    });

    // Titles
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n-title');
      const val = t(key, lang);
      if (val) document.title = val;
    }
  }

  function saveLang(lang) { try { localStorage.setItem('site_lang', lang); } catch(_){} }
  function loadLang() { try { return localStorage.getItem('site_lang') || DEFAULT_LANG; } catch(_) { return DEFAULT_LANG; } }

  function applyLang(lang) {
    setDirFor(lang);
    walkAndTranslate(lang);
    ensureRoutesStayClickable();
  }

  // --- 3) Keep navigation working regardless of label text ---
  // If elements have [data-route], we use it; otherwise we try by label matching (both AR & EN)
  const routeMap = {
    'الرئيسية': 'index.html',
    'Home': 'index.html',
    'من نحن': 'about_us.html',
    'About Us': 'about_us.html',
    'منتجاتنا': 'products.html',
    'Products': 'products.html',
    'الأخبار': 'new.html',
    'News': 'new.html',
    'تواصل معنا': 'contact_us.html',
    'Contact Us': 'contact_us.html',
    'الوظائف': 'https://www.tasnee.com/ar/contact-us/careers',
    'Careers': 'https://www.tasnee.com/ar/contact-us/careers'
  };

  function ensureRoutesStayClickable() {
    const clickable = document.querySelectorAll(`
      .navbar div, 
      .frame-19 div, 
      .frame-20 div, 
      .frame-21 div, 
      .frame-23 div, 
      .frame-24 div, 
      .text-wrapper-12, 
      .text-wrapper-13, 
      .text-wrapper-18, 
      .text-wrapper-19, 
      .text-wrapper-21, 
      .text-wrapper-22, 
      .text-wrapper-23,
      .text-wrapper-5,  
      .text-wrapper-4,  
      .text-wrapper
    `);
    clickable.forEach(el => {
      if (el.__routeBound) return; // avoid duplicates
      el.__routeBound = true;
      el.addEventListener('click', (e) => {
        const route = el.getAttribute('data-route');
        if (route) {
          e.preventDefault();
          window.location.href = route;
          return;
        }
        const label = (el.textContent || '').trim();
        if (routeMap[label]) {
          e.preventDefault();
          window.location.href = routeMap[label];
        }
      }, true);
    });
  }

  // --- 4) Toggle handling ---
  function bindToggles() {
    // Prefer explicit [data-lang-toggle]
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => switchLang());
    });

    // Fallback: any element whose text is exactly "EN" or "AR"
    document.querySelectorAll('body *').forEach(el => {
      const text = (el.textContent || '').trim();
      if (text === 'EN' || text === 'AR') {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => switchLang());
      }
    });
  }

  function switchLang() {
    const current = loadLang();
    const next = current === 'ar' ? 'en' : 'ar';
    saveLang(next);
    applyLang(next);
    // Update visible toggle text if any
    document.querySelectorAll('[data-lang-toggle]').forEach(el => {
      el.textContent = next === 'en' ? 'AR' : 'EN';
    });
    // Also flip any plain "EN"/"AR" text
    document.querySelectorAll('body *').forEach(el => {
      const t = (el.textContent || '').trim();
      if (t === 'EN') el.textContent = 'AR';
      else if (t === 'AR') el.textContent = 'EN';
    });
  }

  // --- 5) Init ---
  document.addEventListener('DOMContentLoaded', () => {
    const lang = loadLang();
    applyLang(lang);
    bindToggles();
  });

  // Optional: expose for console debugging
  window.__setLang = (l) => { saveLang(l); applyLang(l); };
})();
