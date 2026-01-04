---
title: "Contact & Devis"
description: "Contactez Fabrice Jouit pour un devis personnalisé de nettoyage intérieur, rénovation de phares ou lustrage à domicile sur Marseille." 
---

<div class="contact-container">
  <div class="contact-info">
    <h1>Contactez-moi</h1>
    <p>Pour toute demande de devis ou renseignement, n'hésitez pas à me contacter par téléphone, WhatsApp ou via le formulaire.</p>
    
    <div class="contact-methods">
      <div class="contact-method">
        <div class="contact-icon">📞</div>
        <div>
          <h3>Téléphone</h3>
          <p><a href="tel:{{ .Site.Params.phone }}">{{ .Site.Params.phone }}</a></p>
          <p>Disponible du lundi au samedi de 8h à 19h</p>
        </div>
      </div>
      
      <div class="contact-method">
        <div class="contact-icon">💬</div>
        <div>
          <h3>WhatsApp</h3>
          <p><a href="https://wa.me/33614031995?text=Bonjour%20Fabrice,%20j'aimerais%20obtenir%20un%20devis." class="whatsapp-link">Envoyer un message</a></p>
          <p>Réponse rapide garantie</p>
        </div>
      </div>
      
      <div class="contact-method">
        <div class="contact-icon">✉️</div>
        <div>
          <h3>Email</h3>
          <p><a href="mailto:{{ .Site.Params.email }}">{{ .Site.Params.email }}</a></p>
          <p>Réponse sous 24h ouvrées</p>
        </div>
      </div>
    </div>
    
    <div class="business-hours">
      <h3>Horaires d'ouverture</h3>
      <ul>
        <li><strong>Lundi - Vendredi :</strong> 8h - 19h</li>
        <li><strong>Samedi :</strong> 9h - 18h</li>
        <li><strong>Dimanche :</strong> Fermé</li>
      </ul>
    </div>
    
    <div class="emergency-contact">
      <h3>Urgence ?</h3>
      <p>Pour les demandes urgentes en dehors des horaires d'ouverture, n'hésitez pas à m'envoyer un SMS.</p>
    </div>
  </div>
  
  <div class="contact-form">
    <h2>Demande de devis</h2>
    <p>Remplissez ce formulaire pour une demande de devis personnalisé. Je vous recontacterai dans les plus brefs délais.</p>
    
    <form id="contactForm" class="contact-form-fields">
      <div class="form-group">
        <label for="name">Nom complet *</label>
        <input type="text" id="name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="phone">Téléphone *</label>
        <input type="tel" id="phone" name="phone" required>
      </div>
      
      <div class="form-group">
        <label for="vehicle">Véhicule (marque, modèle, année)</label>
        <input type="text" id="vehicle" name="vehicle">
      </div>
      
      <div class="form-group">
        <label for="service">Service souhaité *</label>
        <select id="service" name="service" required>
          <option value="">Sélectionnez un service</option>
          <option value="nettoyage">Nettoyage intérieur complet</option>
          <option value="detachage">Détachage de sièges/moquettes</option>
          <option value="phares">Rénovation de phares</option>
          <option value="lustrage">Lustrage extérieur</option>
          <option value="forfait">Forfait complet</option>
          <option value="autre">Autre demande</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      
      <div class="form-group checkbox-group">
        <input type="checkbox" id="privacy" name="privacy" required>
        <label for="privacy">J'accepte la politique de confidentialité *</label>
      </div>
      
      <div class="form-group">
        <button type="submit" class="btn">Envoyer la demande</button>
      </div>
      
      <div id="formSuccess" class="form-success" style="display: none;">
        Votre message a bien été envoyé ! Je vous recontacte très rapidement.
      </div>
      
      <div id="formError" class="form-error" style="display: none;">
        Une erreur est survenue. Veuillez réessayer ou me contacter par téléphone.
      </div>
    </form>
  </div>
</div>

<section class="map-section">
  <h2>Zone d'intervention</h2>
  <p>Je me déplace à votre domicile ou sur votre lieu de travail dans tout Marseille et ses environs.</p>
  
  <div class="map-container">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.0603376633405!2d5.369757315483164!3d43.2966732791357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c10d0ff0a0c1%3A0x40819d5bdae2a3c0!2sMarseille!5e0!3m2!1sfr!2sfr!4v1620000000000!5m2!1sfr!2sfr" 
      width="100%" 
      height="450" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy">
    </iframe>
  </div>
  
  <div class="coverage">
    <h3>Villes principales desservies :</h3>
    <div class="cities">
      <div class="city-group">
        <h4>Bouches-du-Rhône (13)</h4>
        <ul>
          <li>Marseille (tous arrondissements)</li>
          <li>Aix-en-Provence</li>
          <li>Vitrolles</li>
          <li>Marignane</li>
          <li>Les Pennes-Mirabeau</li>
        </ul>
      </div>
      
      <div class="city-group">
        <h4>Var (83) - Sur demande</h4>
        <ul>
          <li>Aubagne</li>
          <li>La Ciotat</li>
          <li>Saint-Cyr-sur-Mer</li>
          <li>Bandol</li>
        </ul>
      </div>
    </div>
    
    <p class="note">
      <strong>Note :</strong> Des frais de déplacement peuvent s'appliquer en fonction de la distance.
      Contactez-moi pour plus d'informations.
    </p>
  </div>
</section>
