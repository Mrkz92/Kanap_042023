---
presentation:
  width: 1280
  height: 1024
  theme: serif.css
  enableSpeakerNotes: true
---

<!-- slide -->

# Presentation du projet Kanap

- Scénario utilisateur
- Explication du code

<!-- slide -->

## Scénario utilisateur

- Découverte de la page d'accueil

  - Visite d'une page produit
  - Envoi dans le panier sans option
  - Envoi dans le panier avec option
  - Visite d'une autre page produit
  - Envoi dans le panier avec option en deux fois

    - Vérification des produits dans la page page
    - Modification de la quatité d'un et la suppression de l'autre
    - Remplissage du formulaire avec des infos invalides
    - Rectification des infos et envoi de la commande

      - Découverte de la page confirmation

<aside class="notes">
  Bien montrer que le site est réactif, que les ajouts et modifications de données sont bien pris en comptes et que les erreurs utilisateurs et problèmes serveur sont anticipés.
  Etre rapide
</aside>

<!-- slide -->

## Page d'accueil

- Récupération des données et affichage des produits
- Panne serveur

<aside class="notes"></aside>

<!-- slide -->

## Page produit

- Affichage du produit en fonction de l'id présente dans l'url
  - Gestion des options de sélection
    - Choix des couleurs
    - Choix de la quantité
- Envoi des données produit dans le panier
- Panne serveur

<aside class="notes"></aside>

<!-- slide -->

## Page panier

- Panier
  - Récupération des données dans le local storage et l'API
  - Affichage dans le panier
  - Gestion du panier
- Formulaire
  - Gestion du bon fonctionnement du formulaire
  - Envoi des données du panier et du formulaire si valides vers l'API et récupération de l'orderId
  - Redirection vers la page confirmation
- Panne serveur

<aside class="notes"></aside>

<!-- slide -->

## Page confirmation

- Récupération et affichage de l'orderId
- Panne serveur

<aside class="notes"></aside>
