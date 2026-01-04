// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
      
      // Animation des barres du menu hamburger
      const iconBars = this.querySelectorAll('.icon-bar');
      if (this.classList.contains('active')) {
        iconBars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        iconBars[1].style.opacity = '0';
        iconBars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        iconBars[0].style.transform = 'none';
        iconBars[1].style.opacity = '1';
        iconBars[2].style.transform = 'none';
      }
    });
  }
  
  // Fermer le menu lors du clic sur un lien
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        
        const iconBars = menuToggle.querySelectorAll('.icon-bar');
        iconBars[0].style.transform = 'none';
        iconBars[1].style.opacity = '1';
        iconBars[2].style.transform = 'none';
      }
    });
  });
  
  // Animation au défilement
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animate-fade-in');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  
  // Exécuter une fois au chargement
  animateOnScroll();
  
  // Gestion des formulaires
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      
      try {
        // Afficher un indicateur de chargement
        submitButton.disabled = true;
        submitButton.innerHTML = 'Envoi en cours...';
        
        // Ici, vous pouvez ajouter le code pour envoyer les données du formulaire
        // Par exemple, avec fetch() vers une API
        
        // Simulation d'un envoi réussi
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Afficher un message de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Votre message a bien été envoyé ! Nous vous répondrons dès que possible.';
        this.appendChild(successMessage);
        
        // Réinitialiser le formulaire
        this.reset();
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
        
      } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire:', error);
        
        // Afficher un message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-error';
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.appendChild(errorMessage);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
        
      } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  });
  
  // Amélioration de l'accessibilité
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Ajouter le focus pour les utilisateurs au clavier
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });
});
