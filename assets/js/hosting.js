(function () {
  var debugEnabled = true;
  var inventoryUrl = 'antenna-inventory.json';
  var offerIds = [
    'available-gutter-clip-repeater',
    'available-pole-mount-repeater'
  ];

  function logDebug(message, data) {
    if (!debugEnabled || !window.console || typeof window.console.debug !== 'function') {
      return;
    }

    if (typeof data === 'undefined') {
      window.console.debug('[antenna-inventory]', message);
      return;
    }

    window.console.debug('[antenna-inventory]', message, data);
  }

  function logWarning(message, data) {
    if (!debugEnabled || !window.console || typeof window.console.warn !== 'function') {
      return;
    }

    if (typeof data === 'undefined') {
      window.console.warn('[antenna-inventory]', message);
      return;
    }

    window.console.warn('[antenna-inventory]', message, data);
  }

  function getInventoryItem(inventory, offerId) {
    if (!inventory || !Object.prototype.hasOwnProperty.call(inventory, offerId)) {
      logDebug('Inventory item not found for offer.', {
        offerId: offerId
      });

      return null;
    }

    logDebug('Inventory item found for offer.', {
      offerId: offerId,
      inventoryItem: inventory[offerId]
    });

    return inventory[offerId];
  }

  function quantityIsSoldOut(inventoryItem) {
    if (!inventoryItem || typeof inventoryItem.quantityAvailable === 'undefined') {
      logDebug('Inventory item has no quantityAvailable value. Treating as not sold out.', {
        inventoryItem: inventoryItem
      });

      return false;
    }

    var quantityAvailable = Number(inventoryItem.quantityAvailable);
    var isSoldOut = quantityAvailable <= 0;

    logDebug('Checked inventory quantity.', {
      quantityAvailable: quantityAvailable,
      isSoldOut: isSoldOut,
      inventoryItem: inventoryItem
    });

    return isSoldOut;
  }

  function bothOffersAreSoldOut(inventory) {
    var soldOutStatuses = offerIds.map(function (offerId) {
      var inventoryItem = getInventoryItem(inventory, offerId);

      return {
        offerId: offerId,
        isSoldOut: quantityIsSoldOut(inventoryItem)
      };
    });

    var allSoldOut = soldOutStatuses.every(function (soldOutStatus) {
      return soldOutStatus.isSoldOut;
    });

    logDebug('Checked whether both offers are sold out.', {
      soldOutStatuses: soldOutStatuses,
      allSoldOut: allSoldOut
    });

    return allSoldOut;
  }

  function setApplicationVisibility(isVisible) {
    var elements = document.querySelectorAll('[data-host-application-section], [data-host-application-link]');

    logDebug('Setting application visibility.', {
      isVisible: isVisible,
      elementCount: elements.length
    });

    elements.forEach(function (element) {
      element.hidden = !isVisible;
    });
  }

  function applyInventory(inventory) {
    logDebug('Applying inventory response.', {
      inventory: inventory
    });

    var shouldShowApplication = !bothOffersAreSoldOut(inventory);

    logDebug('Computed application visibility from inventory.', {
      shouldShowApplication: shouldShowApplication
    });

    setApplicationVisibility(shouldShowApplication);
  }

  function loadInventory() {
    logDebug('Loading inventory.', {
      inventoryUrl: inventoryUrl
    });

    fetch(inventoryUrl, { cache: 'no-store' })
      .then(function (response) {
        logDebug('Inventory fetch completed.', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        });

        if (!response.ok) {
          throw new Error('Unable to load antenna inventory.');
        }

        return response.json();
      })
      .then(function (inventory) {
        logDebug('Inventory JSON parsed successfully.', {
          inventory: inventory
        });

        applyInventory(inventory);
      })
      .catch(function (error) {
        logWarning('Inventory load failed. Showing application by default.', {
          error: error
        });

        setApplicationVisibility(true);
      });
  }

  if (document.readyState === 'loading') {
    logDebug('Document is still loading. Waiting for DOMContentLoaded.');

    document.addEventListener('DOMContentLoaded', loadInventory);
  } else {
    logDebug('Document already loaded. Loading inventory now.');

    loadInventory();
  }
}());