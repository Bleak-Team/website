document.addEventListener("DOMContentLoaded", () => {
    // 0. Detecção Automática do Tema do Sistema
    const htmlElement = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applySystemTheme(e) {
        if (e.matches) {
            htmlElement.classList.add('dark-mode');
        } else {
            htmlElement.classList.remove('dark-mode');
        }
    }

    // Aplica o estado inicial baseado na preferência atual do sistema
    applySystemTheme(mediaQuery);

    // Ouve alterações em tempo real caso o usuário mude o tema do sistema operacional/navegador
    mediaQuery.addEventListener('change', applySystemTheme);

    // 1. Scroll Fade-in Observer
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    // 2. Automated & Manual Carousels for Games (10 seconds interval)
    const carousels = document.querySelectorAll('.game-media-container');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentIndex = 0;
        let slideInterval;

        if (slides.length <= 1) return;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 10000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                resetTimer();
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
                resetTimer();
            });
        }

        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', () => startTimer());

        startTimer();
    });

    // 3. Gallery Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 4. Interactive Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxMedia = document.getElementById('lightbox-media');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxAuthor = document.getElementById('lightbox-author');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.getAttribute('data-title');
                const author = item.getAttribute('data-author');
                const imgElement = item.querySelector('img');

                lightboxTitle.textContent = title;
                lightboxAuthor.textContent = author;

                if (imgElement) {
                    lightboxMedia.innerHTML = `<img src="${imgElement.src}" alt="${title}">`;
                } else {
                    lightboxMedia.innerHTML = `<div style="padding: 2rem; text-align: center;">[ Visualização Ampliada: ${title} ]</div>`;
                }

                lightbox.classList.add('open');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('open');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                lightbox.classList.remove('open');
            }
        });
    }
});