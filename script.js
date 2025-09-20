// Always start at top on reload / BFCache returns
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e){}
window.addEventListener('load', () => { setTimeout(() => window.scrollTo(0, 0), 0); });
window.addEventListener('pageshow', (e) => { if (e.persisted) window.scrollTo(0, 0); }); // Safari/Firefox BFCache

// Page loader
const loader = document.createElement('div');
loader.className = 'page-loader';
loader.innerHTML = `
    <div class="loader-content">
        <img src="images/loader-logo.png" alt="Loading..." />
        <div class="loading-spinner"></div>
    </div>
`;
document.body.appendChild(loader);

// Fade-in the Join Us rectangle after the loader hides
window.addEventListener('load', () => {
  const rect = document.querySelector('.join-us .rectangle');
  if (!rect) return;
  rect.classList.add('rect-fade');
  // let the class apply, then trigger the transition
  requestAnimationFrame(() => rect.classList.add('in'));
});

// Hide loader when page is loaded
window.addEventListener('load', () => {
    loader.style.display = 'none';
});

// Show loader before navigation
function showLoader() {
    loader.style.display = 'flex';
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation clicks
    const navLinks = {
        'الرئيسية': 'index.html',
        'من نحن': 'about_us.html',
        'منتجاتنا': 'products.html',
        'الأخبار': 'new.html',
        'تواصل معنا': 'contact_us.html',
        'الوظائف': 'join_us.html'
    };
    
    const navLinksFromPages = {
        'الرئيسية': 'index.html',
        'من نحن': 'about_us.html',
        'منتجاتنا': 'products.html',
        'الأخبار': 'new.html',
        'تواصل معنا': 'contact_us.html',
        'الوظائف': 'join_us.html'
    };

    // Function to highlight current page in navigation
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const pageMap = {
            'index.html': 'الرئيسية',
            'home.html': 'الرئيسية',
            'about.html': 'من نحن',
            'about_us.html': 'من نحن',
            'products.html': 'منتجاتنا',
            'news.html': 'الأخبار',
            'new.html': 'الأخبار',
            'contact.html': 'تواصل معنا',
            'contact_us.html': 'تواصل معنا',
            'careers.html': 'الوظائف',
            'join_us.html': 'الوظائف'
        };
        
        // Check if we're at the root (index.html or just '/')
        if (currentPath === '/' || currentPath.endsWith('/') || currentPath.includes('index.html')) {
            document.querySelectorAll('.navbar div, .text-wrapper-12, .text-wrapper-13').forEach(link => {
                if (link.textContent.trim() === 'الرئيسية') {
                    link.style.color = '#007bff';
                    link.style.fontWeight = '700';
                }
            });
            return;
        }

        const currentPage = Object.entries(pageMap).find(([key]) => currentPath.includes(key));
        if (currentPage) {
            document.querySelectorAll('.navbar div, .text-wrapper-12, .text-wrapper-13').forEach(link => {
                if (link.textContent.trim() === currentPage[1]) {
                    link.style.color = '#007bff';
                }
            });
        }
    }

    // Add click event listeners to all navigation items including footer
    document.querySelectorAll(`
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
        .text-wrapper-5,  /* Footer links */
        .text-wrapper-4,  /* Footer links */
        .text-wrapper,    /* Footer contact */
        [class*="text-wrapper"]
    `).forEach(link => {
        const text = link.textContent.trim();
        const isInPagesDir = window.location.pathname.includes('/');
        const currentNavLinks = isInPagesDir ? navLinksFromPages : navLinks;
        
        if (currentNavLinks[text]) {
            link.style.cursor = 'pointer';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showLoader();
                setTimeout(() => {
                    window.location.href = currentNavLinks[text];
                }, 500);
            });
        }
    });

    // Add logo click handler
    document.querySelectorAll('.logo, .logo-2').forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            showLoader();
            setTimeout(() => {
                window.location.href = navLinks['الرئيسية'];
            }, 500);
        });
    });

    // Call highlight function when page loads
    highlightCurrentPage();

    // Handle "Discover Our Products" button
    const discoverProductsBtn = document.querySelector('.text-wrapper-9');
    if (discoverProductsBtn && discoverProductsBtn.textContent.trim() === 'أكتشف منتجاتنا') {
        const productContainer = discoverProductsBtn.closest('.frame-10');
        if (productContainer) {
            productContainer.style.cursor = 'pointer';
            productContainer.addEventListener('click', (e) => {
                e.preventDefault();
                showLoader();
                setTimeout(() => {
                    window.location.href = navLinks['منتجاتنا'];
                }, 500);
            });
        }
    }

    // Banner switching functionality
    if (window.location.href.includes('index.html') || document.querySelector('.home')) {
        console.log('Initializing banner switching functionality...');

        // Banner configuration (now includes 3 images for dynamic switching)
        const banners = [
            '/assets/banner.svg', // original main banner
            'assets/Group 3534.svg', // placeholder 2
        ];
        let currentBannerIndex = 0;
        let isTransitioning = false;

        // Preload images
        banners.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // Main banner image for dynamic switching
        const banner = document.querySelector('/assets/banner.svg');
        // Use the right arrow for switching (use .arrow-outward as fallback)
        let arrow = document.querySelector('.arrow-2');
        if (!arrow) {
            // Try to use the outward arrow as the switch button
            arrow = document.querySelector('.arrow-outward');
        }

        if (!banner || !arrow) {
            console.warn('Banner elements not found, retrying in 1 second...');
            setTimeout(() => {
                const retryBanner = document.querySelector('.image-2');
                let retryArrow = document.querySelector('.arrow-2');
                if (!retryArrow) retryArrow = document.querySelector('.arrow-outward');
                if (!retryBanner || !retryArrow) {
                    console.error('Banner switching elements not found after retry');
                    return;
                }
            }, 1000);
            return;
        }

        // Setup ARIA attributes
        banner.setAttribute('role', 'img');
        banner.setAttribute('aria-label', 'Banner image');
        arrow.setAttribute('role', 'button');
        arrow.setAttribute('aria-label', 'Switch banner image');
        arrow.setAttribute('tabindex', '0');

        // Minimal infinite scrolling - ONLY adds scrolling, preserves all original styling
function initializeInfiniteScroll() {
    // Detect current page
    const isAboutPage = window.location.href.includes('about_us.html') || document.querySelector('.about-us');
    const isProductsPage = window.location.href.includes('products.html') || document.querySelector('.prouducts');
    
    if (!isAboutPage && !isProductsPage) {
        return;
    }
    
    // Select the appropriate container based on page
    let logoContainer;
    
    if (isAboutPage) {
        logoContainer = document.querySelector('.frame-13'); // About us page container
    } else if (isProductsPage) {
        logoContainer = document.querySelector('.frame-37'); // Products page container
    }
    
    if (!logoContainer) {
        return;
    }
    
    // Get all current logos
    const allLogos = Array.from(logoContainer.children);
    
    if (allLogos.length === 0) {
        return;
    }
    
    // Clone the logos for infinite effect
    allLogos.forEach(logo => {
        const clone = logo.cloneNode(true);
        logoContainer.appendChild(clone);
    });
    
    // Add ONLY the scrolling CSS
    const style = document.createElement('style');
    style.textContent = `
        .frame-13, .frame-37 {
            overflow: hidden;
            white-space: nowrap;
        }
        
        .frame-13 > *, .frame-37 > * {
            display: inline-block;
            animation: scroll-brands 20s linear infinite;
        }
        
        @keyframes scroll-brands {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the minimal infinite scroll
initializeInfiniteScroll();

        // Minimal infinite scrolling - ONLY adds scrolling, preserves all original styling
function initializeInfiniteScroll() {
    // Detect current page
    const isAboutPage = window.location.href.includes('about_us.html') || document.querySelector('.about-us');
    const isProductsPage = window.location.href.includes('products.html') || document.querySelector('.prouducts');
    
    if (!isAboutPage && !isProductsPage) {
        return;
    }
    
    // Select the appropriate container based on page
    let logoContainer;
    
    if (isAboutPage) {
        logoContainer = document.querySelector('.frame-13'); // About us page container
    } else if (isProductsPage) {
        logoContainer = document.querySelector('.frame-37'); // Products page container
    }
    
    if (!logoContainer) {
        return;
    }
    
    // Get all current logos
    const allLogos = Array.from(logoContainer.children);
    
    if (allLogos.length === 0) {
        return;
    }
    
    // Clone the logos for infinite effect
    allLogos.forEach(logo => {
        const clone = logo.cloneNode(true);
        logoContainer.appendChild(clone);
    });
    
    // Add ONLY the scrolling CSS
    const style = document.createElement('style');
    style.textContent = `
        .frame-13, .frame-37 {
            overflow: hidden;
            white-space: nowrap;
        }
        
        .frame-13 > *, .frame-37 > * {
            display: inline-block;
            animation: scroll-brands 20s linear infinite;
        }
        
        @keyframes scroll-brands {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the minimal infinite scroll
initializeInfiniteScroll();
        // Banner switching function
        const switchBanner = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            console.log('Switching banner...');
            
            // Visual feedback
            arrow.classList.add('rotating');
            banner.style.opacity = '0';
            banner.style.transform = 'scale(0.95)';

            setTimeout(() => {
                currentBannerIndex = (currentBannerIndex + 1) % banners.length;
                banner.src = banners[currentBannerIndex];
                banner.style.opacity = '1';
                banner.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    arrow.classList.remove('rotating');
                    isTransitioning = false;
                }, 400);
            }, 400);
        };

        // Event listeners
        arrow.addEventListener('click', switchBanner);
        arrow.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchBanner();
            }
        });

        // Add classes for styling
        banner.classList.add('banner-image');
        arrow.classList.add('banner-arrow');

        console.log('Banner switching functionality initialized successfully');
    }
    highlightCurrentPage();

    // Add specific footer contact and links handling
    document.querySelectorAll('[class*="text-wrapper"]').forEach(link => {
        const text = link.textContent.trim();
        
        // Handle contact information
        if (text.includes('@') || text === 'info@battariat.com') {
            link.style.cursor = 'pointer';
            link.addEventListener('click', () => {
                window.location.href = 'mailto:info@battariat.com';
            });
        } else if (text.match(/^\d/) || text === '800 124 0430') {
            link.style.cursor = 'pointer';
            link.addEventListener('click', () => {
                window.location.href = 'tel:' + text.replace(/\s/g, '');
            });
        } 
        // Handle footer navigation
        else if (text === 'الضمان' || text === 'شروط الأستخدام' || text === 'الخصوصية') {
            link.style.cursor = 'pointer';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('This page is coming soon!');
            });
        }
        // Handle Tasnee navigation for specific texts
        else if (text === 'الموقع الألكتروني' || text === 'المتجر الإلكتروني' || text === 'المتجر الاكتروني') {
            link.style.cursor = 'pointer';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://www.tasnee.com/ar', '_blank');
            });
        }
        // Handle general navigation
        else if (navLinks[text]) {
            link.style.cursor = 'pointer';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showLoader();
                setTimeout(() => {
                    window.location.href = navLinks[text];
                }, 500);
            });
        }
    });

    // Handle additional navigation buttons
    document.querySelectorAll('.frame-2, .frame, .text-wrapper-18').forEach(link => {
        const text = link.textContent.trim();
        if (text === 'من نحن') {
            link.style.cursor = 'pointer';
            link.addEventListener('click', () => {
                showLoader();
                window.location.href = navLinks['من نحن'];
            });
        } else if (text === 'المتجر الاكتروني' || text.includes('المتجر')) {
            link.style.cursor = 'pointer';
            link.addEventListener('click', () => {
                window.open('https://www.tasnee.com/ar', '_blank');
            });
        }
    });

    // Social media post hover effects - now only for images
    if (window.location.href.includes('new.html')) {
        const posts = document.querySelectorAll('.group-4 img, .frame-5 img, .frame-27 img');
        posts.forEach(img => {
            img.style.transition = 'transform 0.3s ease';
            img.style.cursor = 'pointer';
        });
    }

    // Dynamic banner switching functionality
    if (window.location.href.includes('index.html')) {
        const banners = [
            {
                src: '/assets/banner.svg',
                alt: 'Home Banner'
            },
            {
                src: 'https://c.animaapp.com/1lwzhgBv/img/472621177-608942485079693-2613384628443662180-n-1@2x.png',
                alt: 'About Us Banner'
            }
        ];
        let currentBannerIndex = 0;
        
        const banner = document.querySelector('/assets/banner.svg');
        const arrow = document.querySelector('.arrow-2');
        
        if (banner && arrow) {
            // Set initial banner
            banner.src = banners[currentBannerIndex].src;
            banner.alt = banners[currentBannerIndex].alt;
            
            // Style the arrow for better UX
            arrow.style.cursor = 'pointer';
            arrow.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            arrow.title = 'Switch Banner';
            
            // Add hover effect to arrow
            arrow.addEventListener('mouseenter', () => {
                arrow.style.transform = 'scale(1.1)';
                arrow.style.opacity = '0.8';
            });
            
            arrow.addEventListener('mouseleave', () => {
                arrow.style.transform = 'scale(1)';
                arrow.style.opacity = '1';
            });
            
            // Banner switching logic with smooth transition
            arrow.addEventListener('click', () => {
                // Prevent multiple clicks during transition
                arrow.style.pointerEvents = 'none';
                
                // Fade out current banner
                banner.style.transition = 'opacity 0.3s ease-in-out';
                banner.style.opacity = '0';
                
                setTimeout(() => {
                    // Switch to next banner
                    currentBannerIndex = (currentBannerIndex + 1) % banners.length;
                    banner.src = banners[currentBannerIndex].src;
                    banner.alt = banners[currentBannerIndex].alt;
                    
                    // Fade in new banner
                    banner.style.opacity = '1';
                    
                    // Re-enable arrow clicks
                    setTimeout(() => {
                        arrow.style.pointerEvents = 'auto';
                    }, 100);
                }, 300);
            });
            
            // Optional: Auto-rotate banners every 5 seconds (uncomment if desired)
            // setInterval(() => {
            //     if (arrow.style.pointerEvents !== 'none') {
            //         arrow.click();
            //     }
            // }, 5000);
        }
    }

    // Handle "View More" button in home page
    const viewMoreButton = document.querySelector('.text-wrapper-5');
    if (viewMoreButton && viewMoreButton.textContent.trim() === 'عرض المزيد') {
        viewMoreButton.style.cursor = 'pointer';
        viewMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            showLoader();
            setTimeout(() => {
                window.location.href = navLinks['الأخبار'];
            }, 500);
        });
    }

    // Store buttons
    const storeButtons = document.querySelectorAll('.text-wrapper-10, .text-wrapper-2');
    storeButtons.forEach(button => {
        if (button.textContent.includes('المتجر')) {
            button.style.cursor = 'pointer';
            button.addEventListener('click', () => {
                // You can replace this with your actual store URL
                window.location.href = 'https://www.tasnee.com/ar';
            });
        }
    });

    // Language switcher - specific handling for different page structures
const langSwitcher = document.querySelector('.text-wrapper-11');
const langContainer = document.querySelector('.overlap-group-3');

if (langSwitcher) {
    // Make both the text and container clickable
    if (langContainer) {
        langContainer.style.cursor = 'pointer';
        langContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentLang = langSwitcher.textContent.trim();
            langSwitcher.textContent = currentLang === 'EN' ? 'AR' : 'EN';
        });
    }
    
    // Also make the text itself clickable as fallback
    langSwitcher.style.cursor = 'pointer';
    langSwitcher.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentLang = langSwitcher.textContent.trim();
        langSwitcher.textContent = currentLang === 'EN' ? 'AR' : 'EN';
    });
}
});



function initializeInfiniteScroll() {
    const isAboutPage = window.location.href.includes('about_us.html');
    const isProductsPage = window.location.href.includes('products.html');

    let targetFrame = null;

    if (isAboutPage) {
        targetFrame = document.querySelector('.frame-13');
    } else if (isProductsPage) {
        targetFrame = document.querySelector('.frame-37');
    }

    if (!targetFrame) return;

    // Create scrolling container
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'brands-scroll-container';

    const scrollTrack = document.createElement('div');
    scrollTrack.className = 'brands-scroll-track';

    // Move all logos inside scrollTrack
    const logos = [...targetFrame.children];
    logos.forEach(logo => scrollTrack.appendChild(logo.cloneNode(true))); // 1st copy
    logos.forEach(logo => scrollTrack.appendChild(logo.cloneNode(true))); // 2nd copy

    scrollContainer.appendChild(scrollTrack);

    // Replace original content
    targetFrame.innerHTML = '';
    targetFrame.appendChild(scrollContainer);
}

// Initialize infinite scroll after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeInfiniteScroll();
});
// --- Minimal animations: counters, socials reveal, شركاؤنا pop ---
(function(){
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // 1) Mark targets with initial animation classes (no HTML edits needed)
  const socialCards = $$('.social-post-card');
  socialCards.forEach(el => el.classList.add('fx-reveal'));

  // شركاؤنا pieces: title + logos bar + partner strip (adjust selectors if needed)
  const partnerEls = [$('.text-wrapper-21'), $('.frame-23'), $('.layer-2')].filter(Boolean);
  partnerEls.forEach(el => el.classList.add('fx-pop'));

  // 2) Reveal on scroll for socials & شركاؤنا
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  [...socialCards, ...partnerEls].forEach(el => io.observe(el));

  // 2b) Hero fade-ins (heading, CTAs, main banner, and Banner Placeholder 1)
const heroEls = [
  document.querySelector('.group-wrapper .element'), // "نفخر بأننا جزء من قصة نجاح..."
  document.querySelector('.frame'),                  // "المتجر الإلكتروني"
  document.querySelector('.frame-2'),                // "من نحن"
  document.querySelector('.image-2'),                // main banner image
  document.querySelector('.overlap-2 .image')        // Banner Placeholder 1
].filter(Boolean);

// Apply fx-reveal with a subtle stagger
heroEls.forEach((el, i) => {
  el.classList.add('fx-reveal');
  el.style.setProperty('--fx-delay', `${i * 0.08}s`);
  io.observe(el);
});

    /* ===== PRODUCTS — mount card FX (no HTML changes) ===== */
(function(){
  if (!document.querySelector('.prouducts')) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer   = window.matchMedia('(pointer: fine)').matches;

  // the three product cards
  const cards = Array.from(document.querySelectorAll('.frame-27, .frame-30, .frame-32'));
  if (!cards.length) return;

  // mark + wire up each card
  cards.forEach((card, cardIdx) => {
    card.classList.add('prod-card');

    // find main (big) product image in this card and mark it
    const imgs = card.querySelectorAll('img');
    if (imgs.length) {
      const mainImg = imgs[imgs.length - 1];   // last image inside the card is the big product
      mainImg.classList.add('prod-photo');
    }

    // mark title + spec rows for stagger
    const infos = card.querySelectorAll('.text-wrapper-17, .frame-29');
    infos.forEach((el, i) => {
      el.classList.add('prod-info');
      el.style.setProperty('--d', `${(0.1 + i * 0.08).toFixed(2)}s`);
    });

    // 3D tilt (desktop/fine pointer only)
    if (!prefersReduce && finePointer) {
      card.classList.add('fx-tilt');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top)  / r.height;
        const rx = ((py - 0.5) * 6).toFixed(2) + 'deg';
        const ry = ((0.5 - px) * 8).toFixed(2) + 'deg';
        card.style.setProperty('--rx', rx);
        card.style.setProperty('--ry', ry);
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      }, { passive:true });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    }
  });

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.25 });

  cards.forEach(c => io.observe(c));
})();

  // 3) Count-up stats (uses the existing text content like "30M+" / "60.5%")
  const counterEls = $$('.section .text-wrapper-4, .div-wrapper .text-wrapper-4');

  const parseTarget = (text) => {
    // Split number and suffix (keeps things like 'M+' or '%')
    const m = text.trim().match(/^([\d.,]+)\s*([^0-9.,]*)$/);
    if (!m) return { value: 0, suffix: '' };
    const value  = parseFloat(m[1].replace(/,/g,''));       // 30 or 60.5
    const suffix = (m[2] || '').trim();                     // 'M+' or '%'
    return { value, suffix };
  };

  const formatVal = (v, suffix) => {
    if (suffix.includes('%')) return v.toFixed(1) + suffix; // 0.0% precision
    if (/M/i.test(suffix)) return Math.round(v) + suffix;   // keep 30M+ look
    return Math.round(v) + suffix;
  };

  const animateTo = (el, target, suffix, ms=1200) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = formatVal(target * eased, suffix);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      const el = e.target;
      const { value, suffix } = parseTarget(el.textContent);
      animateTo(el, value, suffix);
      io2.unobserve(el);
    });
  }, { threshold: 0.6 });
  counterEls.forEach(el => io2.observe(el));
})();

// ===== ABOUT – Number Scramble / Decode (2M & 1995) =====
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.about-us')) return;

  const $ = (s, r=document) => r.querySelector(s);

  // الأهداف: 2M و 1995
  const targets = [
    $('.overlap-9 .text-wrapper-20'), // "2M"
    $('.text-wrapper-29')             // "1995"
  ].filter(Boolean);

  targets.forEach(mountScrambleNumber);

  function mountScrambleNumber(el){
    if (!el || el.dataset.scrambleMounted === '1') return;

    const raw = (el.textContent || '').trim();
    const m = raw.match(/^(\d+)(.*)$/);           // أرقام + لاحقة اختيارية (مثل M)
    if (!m) return;

    const finalDigits = m[1].split('');           // ["2"] أو ["1","9","9","5"]
    const suffixText  = (m[2] || '').trim();      // "M" مثلاً

    // احترام تفضيل تقليل الحركة
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      return; // اترك النص كما هو
    }

    // بناء التفكيك
    const wrap   = document.createElement('span'); wrap.className = 'num-scramble';
    const digits = document.createElement('span'); digits.className = 'digits';
    digits.setAttribute('aria-hidden','true');
    // ابدأ بنفس عدد الخانات (أرقام عشوائية)
    digits.textContent = finalDigits.map(()=> '0').join('');
    wrap.appendChild(digits);

    let suffixEl = null;
    if (suffixText){
      suffixEl = document.createElement('span');
      suffixEl.className = 'suffix';
      suffixEl.textContent = suffixText;
      wrap.appendChild(suffixEl);
    }

    // A11y: نحافظ على النص الأصلي لقارئ الشاشة
    el.setAttribute('aria-label', raw);
    el.textContent = '';
    el.appendChild(wrap);
    el.dataset.scrambleMounted = '1';

    // عند الظهور، شغّل التفكيك
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;

      wrap.classList.add('scrambling');  // يفعّل الـ blur الخفيف
      wrap.classList.add('ready');       // يُظهر اللاحقة (M) في نفس اللحظة

      const charset = '0123456789';
      const totalDuration = 120;        // ms
      const perDigitLag   = 90;          // ms — فرق توقيت بسيط بين الخانات
      const start = performance.now();

      // وقت تثبيت لكل خانة (عشوائي قليلًا لتأثير أجمل)
      const settleAt = finalDigits.map((_, i) =>
        start + 450 + i*perDigitLag + Math.random()*150
      );

      function frame(now){
        let allDone = true;
        let out = '';

        for (let i = 0; i < finalDigits.length; i++){
          if (now < settleAt[i]){
            allDone = false;
            out += charset[(Math.random()*charset.length)|0];
          } else {
            out += finalDigits[i];
          }
        }

        digits.textContent = out;

        if (!allDone){
          requestAnimationFrame(frame);
        } else {
          // انتهت الحركة
          wrap.classList.remove('scrambling');
        }
      }

      requestAnimationFrame(frame);
      io.disconnect();
    }, { threshold: 0.6 });

    io.observe(el);
  }
});

// ===== ABOUT — Typewriter / Spread / Shift / Rise =====
(() => {
  if (!document.querySelector('.about-us')) return;

  const qs = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- A) Typewriter for hero glass caption (.text-wrapper-8) ---------- */
  const caption = qs('.text-wrapper-8');
  if (caption && !prefersReduce) {
    const full = caption.textContent.trim();
    caption.dataset.full = full;
    caption.textContent = '';
    caption.classList.add('typing');

    const segments = (() => {
      try {
        const seg = new Intl.Segmenter('ar', { granularity: 'grapheme' });
        return Array.from(seg.segment(full), s => s.segment);
      } catch { return Array.from(full); }
    })();

    const speed = 22;           // ms per glyph
    const startDelay = 250;     // ms before typing starts
    const ioType = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      ioType.disconnect();
      setTimeout(() => {
        let i = 0;
        const step = () => {
          caption.textContent = segments.slice(0, i).join('');
          i++;
          if (i <= segments.length) {
            setTimeout(step, speed);
          } else {
            caption.classList.remove('typing');
            caption.classList.add('typed');
          }
        };
        step();
      }, startDelay);
    }, { threshold: 0.4 });
    ioType.observe(caption);
  }

  /* ---------- B) Spread-in for vision text (.text-wrapper-25) ---------- */
  const vision = qs('.text-wrapper-25');
  if (vision) {
    if (prefersReduce) {
      // nothing—keep static
    } else {
      const raw = vision.textContent;
      const tokens = raw.split(/(\s+)/).filter(Boolean); // keep spaces
      vision.innerHTML = tokens.map(t => {
        if (/^\s+$/.test(t)) return t; // keep whitespace
        return `<span class="word"><span>${t}</span></span>`;
      }).join('');
      vision.classList.add('spread');
      // stagger
      let idx = 0;
      qa('.word > span', vision).forEach(w => {
        w.style.setProperty('--d', `${(idx++ * 0.06).toFixed(2)}s`);
      });
      const ioSpread = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        vision.classList.add('in');
        ioSpread.disconnect();
      }, { threshold: 0.35 });
      ioSpread.observe(vision);
    }
  }

  /* ---------- C) Shift effect for "نصنع محليًا.. وننافس عالميًا" (.text-wrapper-30) ---------- */
  const slogan = qs('.text-wrapper-30');
  if (slogan) {
    if (!prefersReduce) {
      const text = slogan.textContent.trim();
      const chars = (() => {
        try {
          const seg = new Intl.Segmenter('ar', { granularity: 'grapheme' });
          return Array.from(seg.segment(text), s => s.segment);
        } catch { return Array.from(text); }
      })();
      slogan.innerHTML = chars.map((ch, i) => {
        const dur   = (2.6 + Math.random() * 1.3).toFixed(2);
        const delay = (i * 0.02).toFixed(2);
        const from  = (Math.random() > .5 ? -3 : -1);
        const to    = (Math.random() > .5 ? 1 : 3);
        return `<span style="--dur:${dur}s; --delay:${delay}s; --from:${from}px; --to:${to}px">${ch}</span>`;
      }).join('');
      slogan.classList.add('shift');
      const ioShift = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        slogan.classList.add('play');
        ioShift.disconnect();
      }, { threshold: 0.4 });
      ioShift.observe(slogan);
    }
  }

  /* ---------- D) Vertical slide for header + the 6 cards (إنجازات نفتخر بها) ---------- */
  const header = qs('.text-wrapper-27'); // إنجازات نفتخر بها
  const cards = [
    qs('.rectangle'),     // left image block
    qs('.EFB-wrapper'),   // blue EFB card
    qs('.rectangle-2'),   // top-right image
    qs('.overlap-11'),    // cyan card (ministry)
    qs('.rectangle-4'),   // middle image
    qs('.ISO-wrapper')    // tall blue ISO card
  ].filter(Boolean);

  const slideItems = [header, ...cards].filter(Boolean);
  if (slideItems.length) {
    const ioRise = new IntersectionObserver(es => {
      es.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        ioRise.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    slideItems.forEach((el, i) => {
      if (prefersReduce) return; // keep static
      el.classList.add('rise');
      el.style.setProperty('--d', `${(i * 0.12).toFixed(2)}s`);
      ioRise.observe(el);
    });
  }
})();
// ===== ABOUT — Pop-out caption, remove shift, slide-in شهادات =====
(() => {
  if (!document.querySelector('.about-us')) return;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* --- A) Remove the SHIFT effect from "نصنع محليًا.. وننافس عالميًا" (.text-wrapper-30) --- */
  const slogan = qs('.text-wrapper-30');
  if (slogan) {
    // unwrap any spans from the old shift effect
    const plain = slogan.textContent;
    slogan.classList.remove('shift','play');
    slogan.textContent = plain;
  }

  /* --- B) POP-OUT the hero glass caption (.text-wrapper-8), replacing old typewriter --- */
  const caption = qs('.text-wrapper-8');
  if (caption) {
    // if old typewriter left classes, clear them
    caption.classList.remove('typing','typed');
    // prefer original full text if we stored it earlier
    const full = caption.dataset.full?.trim?.() || caption.textContent.trim();
    caption.textContent = '';

    // wrap words and stagger
    const parts = full.split(/(\s+)/).filter(Boolean); // keep spaces
    caption.innerHTML = parts.map(t => /^\s+$/.test(t) ? t : `<span class="w">${t}</span>`).join('');
    caption.classList.add('popwords');

    // set delays
    let i = 0;
    qa('.w', caption).forEach(w => w.style.setProperty('--d', `${(i++ * 0.05).toFixed(2)}s`));

    // trigger on view
    if (!prefersReduce) {
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        caption.classList.add('in');
        io.disconnect();
      }, { threshold: 0.4 });
      io.observe(caption);
    } else {
      caption.classList.add('in');
    }
  }

  /* --- C) Slide-in for "الشهادات" header + photos + logos --- */
  const shahHeader = qs('.text-wrapper-14'); // "الشهادات"
  const shahPhotos = ['.element-5','.element-6','.element-7','.element-8']
      .map(s => qs(s)).filter(Boolean);
  const shahLogos  = ['.element-9','.bpykpatms','.element-10','.layer-3']
      .map(s => qs(s)).filter(Boolean);

  const slideTargets = [shahHeader, ...shahPhotos, ...shahLogos].filter(Boolean);

  if (slideTargets.length) {
    const ioSlide = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        ioSlide.unobserve(en.target);
      });
    }, { threshold: 0.25 });

    slideTargets.forEach((el, idx) => {
      if (!prefersReduce) {
        el.classList.add('slide-in');
        el.style.setProperty('--d', `${(idx * 0.1).toFixed(2)}s`); // gentle sequence
      }
      ioSlide.observe(el);
    });
  }
})();
/* ===== PRODUCTS — Animate Quality Tests Section ===== */
(() => {
  // Exit if not on the products page
  if (!document.querySelector('.prouducts')) return;

  const qualityTestsHeader = document.querySelector('.group-7 .text-wrapper-31');
  if (!qualityTestsHeader) return;

  // Animation targets in visual order (RTL), pairing icons with text
  const animationTargets = [
    qualityTestsHeader,
    document.querySelector('.element-tif'),      // Icon 1 (Far right)
    document.querySelector('.text-wrapper-29'),   // Text 1
    document.querySelector('.ezgzee-tif'),       // Icon 2
    document.querySelector('.text-wrapper-28'),   // Text 2
    document.querySelector('.nckynf-tif'),      // Icon 3
    document.querySelector('.text-wrapper-27'),   // Text 3
    document.querySelector('.tif'),             // Icon 4
    document.querySelector('.text-wrapper-30'),   // Text 4
    document.querySelector('.element-okma-tif'),  // Icon 5 (Far left)
    document.querySelector('.text-wrapper-26'),   // Text 5
  ].filter(Boolean); // Filter out any null elements if selectors fail

  // Do nothing if there's nothing to animate
  if (animationTargets.length === 0) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add the initial animation class to all targets
  animationTargets.forEach(el => el.classList.add('fx-rise-up'));

  // If the user prefers reduced motion, reveal all elements immediately and stop
  if (prefersReduce) {
    animationTargets.forEach(el => el.classList.add('in'));
    return;
  }

  // Set up the observer to trigger the animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When the header is visible, trigger the whole sequence
        animationTargets.forEach((target, index) => {
          // Set staggered delay for a sequential effect
          target.style.setProperty('--d', `${index * 0.1}s`);
          target.classList.add('in');
        });
        // Stop observing once the animation has been triggered
        observer.unobserve(qualityTestsHeader);
      }
    });
  }, { threshold: 0.3 }); // Trigger when 30% of the header is visible

  observer.observe(qualityTestsHeader);
})();
/* ===== NEWS — Trigger Social Card Flip Animation ===== */
(() => {
  // First, ensure we are on the news page by checking for its root class
  if (!document.querySelector('.news')) return;

  const socialCards = document.querySelectorAll('.social-post-card');
  if (socialCards.length === 0) return;

  // The observer will trigger the animation when a card becomes visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        // Once animated, we don't need to watch it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Start animation when 15% of the card is visible
    rootMargin: "0px 0px -50px 0px" // Start animation a little before it's fully in view
  });

  // Prepare each card for animation
  socialCards.forEach((card, index) => {
    // Add the CSS class that defines the animation's starting state
    card.classList.add('fx-card-flip');
    // Set the custom delay property for the stagger effect
    card.style.setProperty('--d', `${index * 0.1}s`);
    // Tell the observer to watch this card
    observer.observe(card);
  });
})();
/* === banner-rotator-5-7s === */
(function () {
  function startHomeBannerRotator() {
    var hero = document.querySelector('.home .overlap-4');
    if (!hero || hero.dataset.bannerRotator === 'on') return;
    hero.dataset.bannerRotator = 'on';

    // Rotate between current Home banner and About Us (group-2) banner
    var banners = [
      '/assets/banner.svg',
      'https://c.animaapp.com/1lwzhgBv/img/475662958-18492881281031837-8072314904864626091-n-2.png'
    ];

    // Preload images
    banners.forEach(function (src) { var img = new Image(); img.src = src; });

    var i = 0;
    function nextDelay() { return 5000 + Math.floor(Math.random() * 2000); } // 5–7s

    function swap() {
      i = (i + 1) % banners.length;
      hero.style.backgroundImage = 'url("' + banners[i] + '")';
      setTimeout(swap, nextDelay());
    }

    // Show the initial background briefly, then start rotating
    setTimeout(swap, nextDelay());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHomeBannerRotator);
  } else {
    startHomeBannerRotator();
  }
})();
/* === end banner-rotator-5-7s === */
/* === Mobile Fit-Canvas (non-destructive scaler) === */
(function () {
  // Match your desktop design width
  const DESIGN_W = 1440;

  // 'width' => fit to phone width (recommended)
  // 'both'  => fit to width AND height (shows entire page; text may be tiny)
  const MODE = 'width';

  function vp() {
    const vv = window.visualViewport;
    return { w: vv ? vv.width : innerWidth, h: vv ? vv.height : innerHeight };
  }

  function ensureWrap() {
    const canvas = document.querySelector('.overlap-wrapper');
    if (!canvas) return null;
    // If already wrapped, skip
    if (canvas.parentElement && canvas.parentElement.classList.contains('scale-root')) {
      return canvas.parentElement;
    }
    // Build wrappers
    const fitWrapper = document.createElement('div');
    fitWrapper.id = 'fit-wrapper';
    const scaleRoot = document.createElement('div');
    scaleRoot.className = 'scale-root';
    // Insert and move
    canvas.parentNode.insertBefore(fitWrapper, canvas);
    fitWrapper.appendChild(scaleRoot);
    scaleRoot.appendChild(canvas);
    return scaleRoot;
  }

  function fit() {
    const scaleRoot = ensureWrap();
    if (!scaleRoot) return;
    const fitWrapper = document.getElementById('fit-wrapper');
    const canvas = scaleRoot.querySelector('.overlap-wrapper');

    // Reset and enforce natural size
    scaleRoot.style.transform = 'none';
    canvas.style.width = DESIGN_W + 'px';

    // Get the natural (unscaled) height
    const naturalH = canvas.scrollHeight;
    const { w: vw, h: vh } = vp();

    // Base scale (never upscale above 1)
    let s = Math.min(vw / DESIGN_W, 1);
    if (MODE === 'both') s = Math.min(s, vh / naturalH, 1);

    // Apply transform and reserve correct scroll height
    scaleRoot.style.transform = `scale(${s})`;
    fitWrapper.style.height = Math.ceil(naturalH * s) + 'px';
  }

  const schedule = () => requestAnimationFrame(fit);

  // Run/keep in sync with viewport changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { passive: true });
  } else {
    schedule();
  }
  addEventListener('resize', schedule, { passive: true });
  addEventListener('orientationchange', schedule);
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', schedule, { passive: true });
    visualViewport.addEventListener('scroll', schedule, { passive: true });
  }
})();
