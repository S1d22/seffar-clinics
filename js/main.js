document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');

    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!prefersReducedMotion.matches && revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // If reduced motion is preferred, show all elements immediately
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // Smooth Scrolling for anchor links (if browser doesn't support CSS scroll-behavior natively or for specific offsets)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Number Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter');

    if (!prefersReducedMotion.matches && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = +target.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const countStep = () => {
                        frame++;
                        const progress = frame / totalFrames;
                        // easeOut component for smooth slowdown
                        const currentCount = endValue * (1 - (1 - progress) * (1 - progress));

                        target.innerText = Math.ceil(currentCount);

                        if (frame < totalFrames) {
                            requestAnimationFrame(countStep);
                        } else {
                            target.innerText = endValue;
                        }
                    };

                    requestAnimationFrame(countStep);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
        // Fallback for reduced motion
        counters.forEach(counter => {
            counter.innerText = counter.getAttribute('data-target');
        });
    }
});
