document.addEventListener('DOMContentLoaded', () => {
  // Animation des sections au défilement
  const faders = document.querySelectorAll('.fade-in-section');

  const appearOptions = {
    threshold: 0.2, // Trigger when 20% of the item is visible
    rootMargin: "0px 0px -100px 0px" // Start loading 100px before it enters viewport
  };

  const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('is-visible');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Lazy loading des images avec animation de fondu
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Si l'image n'a pas encore de src, on le charge
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }

          // Si l'image n'a pas encore de srcset, on le charge
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
          }

          // Une fois l'image chargée, on ajoute la classe loaded
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          }, { once: true });

          // En cas d'erreur, on affiche quand même l'image
          img.addEventListener('error', () => {
            img.classList.add('loaded');
          }, { once: true });

          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Commence à charger 200px avant d'entrer dans la vue
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
      }
      img.classList.add('loaded');
    });
  }

  // Bouton "Retour en haut"
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Micro-interactions pour les cartes de service
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // Animation de pulse pour les éléments importants
  const pulseElements = document.querySelectorAll('.pulse-animation');

  pulseElements.forEach(element => {
    element.addEventListener('animationiteration', () => {
      // Réinitialiser l'animation après chaque itération
      element.style.animation = 'none';
      setTimeout(() => {
        element.style.animation = 'pulse 2s infinite';
      }, 10);
    });
  });
});
