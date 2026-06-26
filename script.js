/**
 * Villa Sole - Casa Famiglia
 * Interazioni UI: menu, caroselli, FAQ, lightbox, form contatti
 */

function initScrollToTopOnRefresh() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function scrollToTop() {
        window.scrollTo(0, 0);
    }

    function isPageReload() {
        const navEntry = performance.getEntriesByType('navigation')[0];
        return navEntry && navEntry.type === 'reload';
    }

    if (!isPageReload()) return;

    scrollToTop();
    window.addEventListener('load', scrollToTop);
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || isPageReload()) {
            scrollToTop();
        }
    });
}

initScrollToTopOnRefresh();

function initHamburgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');
    const header = document.querySelector('.site-header');
    const closeBtn = document.querySelector('.menu-close-btn');

    if (!menuToggle || !navOverlay) return;

    menuToggle.addEventListener('click', function () {
        const isActive = this.classList.toggle('active');
        navOverlay.classList.toggle('active');
        this.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');

    if (!slides.length) return;

    let currentSlide = 0;
    let interval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.setAttribute('aria-selected', 'false');
        });

        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
            indicators[index].setAttribute('aria-selected', 'true');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startCarousel() {
        interval = setInterval(nextSlide, 6000);
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopCarousel();
            startCarousel();
        });
    });

    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', stopCarousel);
        heroCarousel.addEventListener('mouseleave', startCarousel);
    }

    startCarousel();
}

function initContactForms() {
    const forms = document.querySelectorAll('.contact-form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const existingMessages = form.querySelectorAll('.form-success, .form-error');
            existingMessages.forEach(msg => msg.remove());

            const consentCheckbox = form.querySelector('input[type="checkbox"][name="consent"]');
            if (consentCheckbox && !consentCheckbox.checked) {
                showFormMessage(form, 'È necessario accettare la Privacy Policy e i Termini e Condizioni.', 'error');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';

            setTimeout(() => {
                showFormMessage(form, 'Grazie! La tua richiesta è stata registrata. Ti ricontatteremo al più presto.', 'success');
                form.reset();
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 1200);
        });
    });
}

function showFormMessage(form, message, type) {
    const existing = form.querySelector('.form-success, .form-error');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = type === 'success' ? 'form-success' : 'form-error';
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const color = type === 'success' ? '#4CAF50' : '#f44336';
    msg.innerHTML = '<i class="fas fa-' + icon + '"></i> ' + message;
    msg.style.cssText = 'margin-top: 1rem; padding: 1rem; background: rgba(' + (type === 'success' ? '76, 175, 80' : '244, 67, 54') + ', 0.1); border-radius: 8px; color: ' + color + '; text-align: center;';
    form.appendChild(msg);

    setTimeout(() => msg.remove(), 6000);
}

function initGalleryCarousel() {
    const track = document.getElementById('galleryTrack');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.gallery-slide'));
    const prev = document.querySelector('.gallery-carousel .prev');
    const next = document.querySelector('.gallery-carousel .next');
    let index = 0;

    function update() {
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
    }

    function go(delta) {
        index = (index + delta + slides.length) % slides.length;
        update();
    }

    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));

    let startX = 0;
    let isDown = false;
    track.addEventListener('pointerdown', (e) => {
        isDown = true;
        startX = e.clientX;
        track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointerup', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        isDown = false;
    });
    track.addEventListener('pointercancel', () => { isDown = false; });

    update();
}

function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answerId = this.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
                    if (otherAnswer) otherAnswer.classList.remove('active');
                }
            });

            this.setAttribute('aria-expanded', !isExpanded);
            if (answer) {
                answer.classList.toggle('active', !isExpanded);
            }
        });
    });
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!galleryItems.length || !lightbox) return;

    let currentIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryImages.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', () => openLightbox(index));
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImage.src = ''; }, 300);
    }

    function updateLightboxContent() {
        const image = galleryImages[currentIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
        lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
        lightboxNext.style.display = currentIndex < galleryImages.length - 1 ? 'flex' : 'none';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; updateLightboxContent(); } });
    lightboxNext.addEventListener('click', () => { if (currentIndex < galleryImages.length - 1) { currentIndex++; updateLightboxContent(); } });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; updateLightboxContent(); }
        if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) { currentIndex++; updateLightboxContent(); }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initHamburgerMenu();

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    initHeroCarousel();
    initGalleryCarousel();
    initContactForms();
    initFaqAccordion();
    initLightbox();
});
