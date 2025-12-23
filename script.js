/**
 * Groomd Landing Page Scripts
 * Lightweight vanilla JS for carousel and interactions
 */

(function() {
    'use strict';

    // ===================================
    // Sticky Navigation
    // ===================================
    function initStickyNav() {
        const nav = document.getElementById('stickyNav');
        const hero = document.querySelector('.hero');

        if (!nav || !hero) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        nav.classList.remove('visible');
                    } else {
                        nav.classList.add('visible');
                    }
                });
            },
            { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
        );

        observer.observe(hero);
    }

    // ===================================
    // Features Carousel
    // ===================================
    function initFeaturesCarousel() {
        const track = document.querySelector('.features-track');
        const slides = document.querySelectorAll('.feature-slide');
        const prevBtn = document.querySelector('.features-nav .carousel-btn.prev');
        const nextBtn = document.querySelector('.features-nav .carousel-btn.next');
        const dotsContainer = document.getElementById('featuresDots');
        const titleEl = document.querySelector('.feature-title');
        const descEl = document.querySelector('.feature-desc');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let autoplayInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to feature ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('#featuresDots .carousel-dot');

        function updateFeatureInfo() {
            const currentSlide = slides[currentIndex];
            const title = currentSlide.dataset.title;
            const desc = currentSlide.dataset.desc;

            // Fade out, update, fade in
            titleEl.style.opacity = '0';
            descEl.style.opacity = '0';

            setTimeout(() => {
                titleEl.textContent = title;
                descEl.textContent = desc;
                titleEl.style.opacity = '1';
                descEl.style.opacity = '1';
            }, 150);
        }

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            updateFeatureInfo();
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            updateCarousel();
            resetAutoplay();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Button controls
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch/swipe support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            resetAutoplay();
        });

        // Mouse drag support for desktop
        let mouseStartX = 0;
        let isMouseDragging = false;

        track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            track.style.cursor = 'grabbing';
            stopAutoplay();
        });

        track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        track.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            track.style.cursor = 'grab';

            const diff = mouseStartX - e.clientX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            resetAutoplay();
        });

        track.addEventListener('mouseleave', () => {
            if (isMouseDragging) {
                isMouseDragging = false;
                track.style.cursor = 'grab';
            }
        });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Initialize
        track.style.cursor = 'grab';
        startAutoplay();

        // Pause on hover
        const carousel = document.querySelector('.features-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }
    }

    // ===================================
    // Smooth scroll for anchor links
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===================================
    // Initialize on DOM ready
    // ===================================
    function init() {
        initStickyNav();
        initFeaturesCarousel();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
