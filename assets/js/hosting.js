(function () {
  var inventoryUrl = 'antenna-inventory.json';
  var offerIds = [
    'offer-gutter-clip-repeater',
    'offer-pole-mount-repeater'
  ];

  function getInventoryItem(inventory, offerId) {
    if (!inventory || !Object.prototype.hasOwnProperty.call(inventory, offerId)) {
      return null;
    }

    return inventory[offerId];
  }

  function quantityIsSoldOut(inventoryItem) {
    if (!inventoryItem || typeof inventoryItem.quantityAvailable === 'undefined') {
      return false;
    }

    return Number(inventoryItem.quantityAvailable) <= 0;
  }

  function bothOffersAreSoldOut(inventory) {
    return offerIds.every(function (offerId) {
      return quantityIsSoldOut(getInventoryItem(inventory, offerId));
    });
  }

  function setApplicationVisibility(isVisible) {
    document.querySelectorAll('[data-host-application-section], [data-host-application-link]').forEach(function (element) {
      element.hidden = !isVisible;
    });
  }

  function applyInventory(inventory) {
    setApplicationVisibility(!bothOffersAreSoldOut(inventory));
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
        setApplicationVisibility(true);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInventory);
  } else {
    loadInventory();
  }
}());
