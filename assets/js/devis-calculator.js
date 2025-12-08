// Script de calcul pour le formulaire de devis Fabrice Auto

document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si le formulaire de devis existe sur la page
  const devisForm = document.getElementById('devisForm');
  if (!devisForm) return;

  // Prix de base des services
  const servicePrices = {
    'nettoyage_interieur': 80,
    'detachage_sieges': 60,
    'renovation_phares': 50,
    'lustrage_carrosserie': 70
  };

  // Prix des options
  const optionPrices = {
    'traitement_odeurs': 20,
    'protection_tissus': 30,
    'urgence': 25
  };

  // Majorations par type de véhicule
  const vehicleMultipliers = {
    'citadine': 1.0,    // Pas de majoration
    'berline': 1.1,     // +10%
    'suv': 1.2,         // +20%
    'utilitaire': 1.15, // +15%
    'autre': 1.0        // Pas de majoration
  };

  // Majorations par état du véhicule
  const conditionMultipliers = {
    'bon': 1.0,     // Pas de majoration
    'moyen': 1.1,   // +10%
    'mauvais': 1.25 // +25%
  };

  // Gestion des étapes du formulaire
  const steps = document.querySelectorAll('.form-step');
  let currentStep = 0;

  // Fonction pour afficher une étape
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });
    currentStep = stepIndex;
    updateRecap(); // Mettre à jour le récapitulatif à chaque changement d'étape
  }

  // Boutons "Suivant"
  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
      const nextStepId = this.getAttribute('data-next');
      const nextStepIndex = Array.from(steps).findIndex(step => step.id === nextStepId);

      // Valider l'étape courante avant de passer à la suivante
      if (validateStep(currentStep)) {
        showStep(nextStepIndex);
      }
    });
  });

  // Boutons "Précédent"
  document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function() {
      const prevStepId = this.getAttribute('data-prev');
      const prevStepIndex = Array.from(steps).findIndex(step => step.id === prevStepId);
      showStep(prevStepIndex);
    });
  });

  // Validation d'une étape
  function validateStep(stepIndex) {
    const step = steps[stepIndex];
    let isValid = true;

    // Validation de l'étape 1 (coordonnées)
    if (stepIndex === 0) {
      const requiredFields = step.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          markFieldAsInvalid(field);
          isValid = false;
        } else {
          markFieldAsValid(field);
        }
      });
    }

    // Validation de l'étape 2 (services)
    if (stepIndex === 1) {
      const typeVehicule = document.getElementById('type_vehicule');
      const services = step.querySelectorAll('input[name="services"]:checked');

      if (!typeVehicule.value) {
        markFieldAsInvalid(typeVehicule);
        isValid = false;
      } else {
        markFieldAsValid(typeVehicule);
      }

      if (services.length === 0) {
        alert('Veuillez sélectionner au moins un service.');
        isValid = false;
      }
    }

    return isValid;
  }

  // Marquer un champ comme invalide
  function markFieldAsInvalid(field) {
    field.parentElement.classList.add('error');
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'Ce champ est obligatoire';
      field.parentElement.appendChild(errorMsg);
    }
  }

  // Marquer un champ comme valide
  function markFieldAsValid(field) {
    field.parentElement.classList.remove('error');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }

  // Calcul du prix total
  function calculatePrice() {
    let total = 0;

    // Prix des services sélectionnés
    const selectedServices = document.querySelectorAll('input[name="services"]:checked');
    let servicesPrice = 0;
    selectedServices.forEach(service => {
      servicesPrice += parseInt(service.getAttribute('data-price')) || 0;
    });

    // Prix des options
    const selectedOptions = document.querySelectorAll('input[name="options"]:checked');
    let optionsPrice = 0;
    selectedOptions.forEach(option => {
      optionsPrice += parseInt(option.getAttribute('data-price')) || 0;
    });

    // Majoration véhicule
    const vehicleType = document.getElementById('type_vehicule').value;
    const vehicleCondition = document.getElementById('etat_vehicule').value;

    let vehicleMultiplier = vehicleMultipliers[vehicleType] || 1.0;
    let conditionMultiplier = conditionMultipliers[vehicleCondition] || 1.0;

    // Appliquer les majorations uniquement sur les services (pas sur les options)
    const basePrice = servicesPrice;
    const vehicleSurcharge = basePrice * (vehicleMultiplier - 1);
    const conditionSurcharge = basePrice * (conditionMultiplier - 1);

    total = servicesPrice + optionsPrice + vehicleSurcharge + conditionSurcharge;

    return {
      services: servicesPrice,
      options: optionsPrice,
      vehicleSurcharge: Math.round(vehicleSurcharge),
      conditionSurcharge: Math.round(conditionSurcharge),
      total: Math.round(total)
    };
  }

  // Mettre à jour le récapitulatif
  function updateRecap() {
    // Coordonnées
    document.getElementById('recap-nom').textContent = `Nom : ${document.getElementById('nom').value || 'Non renseigné'}`;
    document.getElementById('recap-telephone').textContent = `Téléphone : ${document.getElementById('telephone').value || 'Non renseigné'}`;
    document.getElementById('recap-email').textContent = `Email : ${document.getElementById('email').value || 'Non renseigné'}`;
    document.getElementById('recap-ville').textContent = `Ville : ${document.getElementById('ville').value || 'Non renseigné'}`;

    // Véhicule
    const vehicleTypeSelect = document.getElementById('type_vehicule');
    const vehicleTypeText = vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex]?.text || 'Non sélectionné';
    document.getElementById('recap-vehicule').textContent = `Véhicule : ${vehicleTypeText}`;

    const conditionSelect = document.getElementById('etat_vehicule');
    const conditionText = conditionSelect.options[conditionSelect.selectedIndex]?.text || 'Non spécifié';
    document.getElementById('recap-etat').textContent = `État : ${conditionText}`;

    // Services sélectionnés
    const servicesContainer = document.getElementById('recap-services');
    servicesContainer.innerHTML = '';
    document.querySelectorAll('input[name="services"]:checked').forEach(service => {
      const label = service.parentElement.textContent.trim();
      const div = document.createElement('div');
      div.textContent = `• ${label}`;
      servicesContainer.appendChild(div);
    });

    // Options sélectionnées
    const optionsContainer = document.getElementById('recap-options');
    optionsContainer.innerHTML = '';
    document.querySelectorAll('input[name="options"]:checked').forEach(option => {
      const label = option.parentElement.textContent.trim();
      const div = document.createElement('div');
      div.textContent = `• ${label}`;
      optionsContainer.appendChild(div);
    });

    // Prix
    const prices = calculatePrice();
    document.getElementById('price-services').textContent = `${prices.services}€`;
    document.getElementById('price-options').textContent = `${prices.options}€`;
    document.getElementById('price-majoration').textContent = `${prices.vehicleSurcharge + prices.conditionSurcharge}€`;
    document.getElementById('price-total').textContent = `${prices.total}€`;
  }

  // Écouter les changements pour mettre à jour le récapitulatif
  document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('change', updateRecap);
    element.addEventListener('input', updateRecap);
  });

  // Soumission du formulaire
  devisForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validation finale
    if (!validateStep(currentStep)) {
      alert('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    if (!document.getElementById('consent').checked) {
      alert('Veuillez accepter les conditions de traitement des données.');
      return;
    }

    // Afficher le spinner
    const submitBtn = document.getElementById('submit-devis');
    const submitText = submitBtn.querySelector('.submit-text');
    const spinner = submitBtn.querySelector('.loading-spinner');

    submitText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simuler l'envoi (dans une vraie implémentation, utiliser fetch() vers un backend)
    setTimeout(() => {
      // Générer une référence unique
      const reference = `FA-${Date.now().toString().slice(-8)}`;
      document.getElementById('reference-number').textContent = reference;

      // Passer à l'étape de confirmation avec option de réservation
      showStep(3);

      // Réinitialiser le bouton
      submitText.style.display = 'inline';
      spinner.style.display = 'none';
      submitBtn.disabled = false;

      // Envoyer les données (simulation)
      const formData = {
        nom: document.getElementById('nom').value,
        telephone: document.getElementById('telephone').value,
        email: document.getElementById('email').value,
        ville: document.getElementById('ville').value,
        message: document.getElementById('message').value,
        type_vehicule: document.getElementById('type_vehicule').value,
        etat_vehicule: document.getElementById('etat_vehicule').value,
        services: Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value),
        options: Array.from(document.querySelectorAll('input[name="options"]:checked')).map(cb => cb.value),
        prix_total: calculatePrice().total,
        reference: reference,
        date: new Date().toISOString()
      };

      console.log('Données du devis envoyées :', formData);
      // Ici, vous pourriez utiliser : fetch('/api/devis', { method: 'POST', body: JSON.stringify(formData) })

      // Préparer les données pour la réservation
      window.devisData = formData;

    }, 1500);
  });

  // Bouton "Nouvelle demande"
  document.getElementById('new-devis')?.addEventListener('click', function() {
    devisForm.reset();
    showStep(0);
    updateRecap();
  });

  // Bouton "Réserver maintenant"
  document.getElementById('reserver-maintenant')?.addEventListener('click', function() {
    // Récupérer les données du devis
    const devisData = window.devisData || {};

    // Rediriger vers la page de réservation avec pré-remplissage
    const params = new URLSearchParams({
      nom: devisData.nom || '',
      telephone: devisData.telephone || '',
      email: devisData.email || '',
      services: devisData.services?.join(',') || '',
      prix: devisData.prix_total || '',
      reference: devisData.reference || ''
    });

    window.location.href = `/reservation/?${params.toString()}`;
  });

  // Bouton "Réserver plus tard"
  document.getElementById('reserver-plus-tard')?.addEventListener('click', function() {
    // Afficher un message de confirmation
    const confirmationDiv = document.querySelector('.confirmation-message');
    const originalHTML = confirmationDiv.innerHTML;

    confirmationDiv.innerHTML = `
      <div class="confirmation-icon">📋</div>
      <h3>Devis sauvegardé !</h3>
      <p>Votre devis a été enregistré avec la référence : <strong>${window.devisData?.reference || ''}</strong></p>
      <p>Vous pouvez réserver votre créneau à tout moment en utilisant cette référence.</p>
      <p>Conservez bien ce numéro : <strong>${window.devisData?.reference || ''}</strong></p>
      <div class="confirmation-actions">
        <button type="button" class="btn btn-primary" id="new-devis">Nouvelle demande</button>
        <a href="/reservation/" class="btn btn-success">Réserver maintenant</a>
      </div>
    `;

    // Réattacher l'événement
    document.getElementById('new-devis')?.addEventListener('click', function() {
      devisForm.reset();
      showStep(0);
      updateRecap();
    });
  });

  // Initialiser le récapitulatif
  updateRecap();

  // Ajouter des tooltips pour les prix
  document.querySelectorAll('[data-price]').forEach(element => {
    element.addEventListener('mouseenter', function() {
      const price = this.getAttribute('data-price');
      this.title = `Prix : ${price}€`;
    });
  });

  // Validation en temps réel
  document.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', function() {
      if (!this.value.trim()) {
        markFieldAsInvalid(this);
      } else {
        markFieldAsValid(this);
      }
    });
  });
});
