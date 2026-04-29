(function () {
  var inventoryUrl = 'antenna-inventory.json';
  var soldOutClassName = 'application-pricing-card-sold-out';

  var soldOutOfferContent = {
    'offer-gutter-clip-repeater': {
      webpSrcset: 'assets/img/waunamesh/application-gutter-clip-repeater-900.webp',
      imageSrc: 'assets/img/waunamesh/application-gutter-clip-repeater.jpg',
      imageAlt: 'A compact gutter clip style solar repeater shown as out of stock',
      pillText: 'Out of stock',
      valueText: 'Unavailable',
      descriptionText: 'This gutter clip repeater option is currently out of stock. Applications can still be reviewed, but this repeater is unavailable until supply is restocked.'
    },
    'offer-pole-mount-repeater': {
      webpSrcset: 'assets/img/waunamesh/application-pole-mount-repeater-900.webp',
      imageSrc: 'assets/img/waunamesh/application-pole-mount-repeater.jpg',
      imageAlt: 'A pole mounted solar repeater shown as out of stock',
      pillText: 'Out of stock',
      valueText: 'Unavailable',
      descriptionText: 'This pole mount repeater option is currently out of stock. Applications can still be reviewed, but this repeaters is unavailable until supply is restocked.'
    }
  };

  function rememberDefaultContent(card) {
    var source = card.querySelector('[data-inventory-source]');
    var image  = card.querySelector('[data-inventory-image]');
    var pill   = card.querySelector('[data-inventory-pill]');
    var value  = card.querySelector('[data-inventory-value]');
    var description = card.querySelector('[data-inventory-description]');

    if (source && !source.dataset.defaultSrcset) {
      source.dataset.defaultSrcset = source.getAttribute('srcset') || '';
    }

    if (image && !image.dataset.defaultSrc) {
      image.dataset.defaultSrc = image.getAttribute('src') || '';
      image.dataset.defaultAlt = image.getAttribute('alt') || '';
    }

    if (pill && !pill.dataset.defaultText) {
      pill.dataset.defaultText = pill.textContent;
    }

    if (value && !value.dataset.defaultText) {
      value.dataset.defaultText = value.textContent;
    }

    if (description && !description.dataset.defaultText) {
      description.dataset.defaultText = description.textContent;
    }
  }

  function setText(element, text) {
    if (element && typeof text === 'string') {
      element.textContent = text;
    }
  }

  function setImage(source, image, webpSrcset, imageSrc, imageAlt) {
    if (source && webpSrcset) {
      source.setAttribute('srcset', webpSrcset);
    }

    if (image && imageSrc) {
      image.setAttribute('src', imageSrc);
    }

    if (image && imageAlt) {
      image.setAttribute('alt', imageAlt);
    }
  }

  function markOfferSoldOut(card, content) {
    var source = card.querySelector('[data-inventory-source]');
    var image  = card.querySelector('[data-inventory-image]');
    var pill   = card.querySelector('[data-inventory-pill]');
    var value  = card.querySelector('[data-inventory-value]');
    var description = card.querySelector('[data-inventory-description]');

    card.classList.add(soldOutClassName);
    card.setAttribute('aria-label', (card.dataset.offerName || 'Repeater option') + ' out of stock');

    setImage(source, image, content.webpSrcset, content.imageSrc, content.imageAlt);
    setText(pill, content.pillText);
    setText(value, content.valueText);
    setText(description, content.descriptionText);
  }

  function markOfferAvailable(card) {
    var source = card.querySelector('[data-inventory-source]');
    var image  = card.querySelector('[data-inventory-image]');
    var pill   = card.querySelector('[data-inventory-pill]');
    var value  = card.querySelector('[data-inventory-value]');
    var description = card.querySelector('[data-inventory-description]');

    card.classList.remove(soldOutClassName);
    card.removeAttribute('aria-label');

    setImage(
      source,
      image,
      source ? source.dataset.defaultSrcset : '',
      image ? image.dataset.defaultSrc : '',
      image ? image.dataset.defaultAlt : ''
    );
    setText(pill, pill ? pill.dataset.defaultText : '');
    setText(value, value ? value.dataset.defaultText : '');
    setText(description, description ? description.dataset.defaultText : '');
  }

  function quantityIsSoldOut(inventoryItem) {
    if (!inventoryItem || typeof inventoryItem.quantityAvailable === 'undefined') {
      return false;
    }

    return Number(inventoryItem.quantityAvailable) <= 0;
  }

  function applyInventory(inventory) {
    var cards = document.querySelectorAll('[data-antenna-offer]');

    cards.forEach(function (card) {
      var offerId = card.dataset.antennaOffer;
      var inventoryItem = inventory[offerId];
      var soldOutContent = soldOutOfferContent[offerId];

      rememberDefaultContent(card);

      if (quantityIsSoldOut(inventoryItem) && soldOutContent) {
        markOfferSoldOut(card, soldOutContent);
      } else {
        markOfferAvailable(card);
      }
    });
  }

  function loadInventory() {
    fetch(inventoryUrl, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Unable to load antenna inventory.');
        }

        return response.json();
      })
      .then(applyInventory)
      .catch(function () {
        document.querySelectorAll('[data-antenna-offer]').forEach(rememberDefaultContent);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInventory);
  } else {
    loadInventory();
  }
}());
