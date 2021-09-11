'use strict';

function showModal(id) {
  $(`#${id}`)
    .css({
      'font-size': '13px',
      'line-height': '19px',
      color: '#25282a',
    })
    .modal({
      backdrop: false,
    });
}

function modal(id, header, text, error = 'chart error', dsa = false) {
  let footer;
  if (dsa) {
    footer =
      `
    <div class="modal-footer flex">
        <button type="button" class="close" id="save-button" data-dismiss="modal">${chrome.i18n.getMessage('dsa')}</button>
        <button type="button" class="close flex-right" data-dismiss="modal">${chrome.i18n.getMessage('close')}</button>
    </div>`;
  } else {
    footer = '';
  }
  document.body.insertAdjacentHTML('beforeend',
    `
            <div class="spc_modal_container">
                <div class="modal right fade" id="${id}" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header flex">
                                <img src="${chrome.runtime.getURL('../images/icon_16.png')}" alt="Steam Price Chart icon" id="spc-icon">
                                <div id="header-text">${header}</div>
                                <button type="button" class="close flex-right" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p>${text}</p>
                            </div>${footer}
                        </div>
                    </div>
                </div>
            </div>`,
  );

  if (dsa) {
    document.getElementById('save-button').onclick = () => {
      chrome.storage.sync.set({
        [dsa]: true,
      });
    };
  }

  if (document.readyState !== 'complete') setTimeout(showModal.bind(null, id), 1000);
  else showModal(id);

  if (error) throw new Error(error);
}

function regionModal(region) {
  modal('not_supported_modal',
    chrome.i18n.getMessage('regionErrorHeader'),
    chrome.i18n.getMessage('regionErrorText', region));
}

function freeItemModal(name) {
  modal('free_item_modal',
    chrome.i18n.getMessage('freeItemHeader'),
    chrome.i18n.getMessage('freeItemText', name));
}

function showOriginalModal() {
  modal('show_original_data_modal',
    chrome.i18n.getMessage('originalDataHeader'),
    chrome.i18n.getMessage('originalDataText', getName()),
    false);
}

function dataModal() {
  modal('price_data_error_modal',
    chrome.i18n.getMessage('priceDataErrorHeader'),
    chrome.i18n.getMessage('priceDataErrorText', getName()));
}

function updateDelayModal() {
  modal('update_delay_modal',
    chrome.i18n.getMessage('updateDelayHeader'),
    chrome.i18n.getMessage('updateDelayText', getName()),
    false);
}

function timeoutModal() {
  modal('no_response_from_background_modal',
    chrome.i18n.getMessage('timeoutErrorHeader'),
    chrome.i18n.getMessage('timeoutErrorText'),
    false);
}

function cantConnectModal() {
  modal('cant_connect_to_itad_modal',
    chrome.i18n.getMessage('connectErrorHeader'),
    chrome.i18n.getMessage('connectErrorText'),
    false);
}

function bundleModal(name) {
  modal('display_bundle_modal',
    chrome.i18n.getMessage('bundleHeader'),
    chrome.i18n.getMessage('bundleText', name),
    false);
}

function subModal(name) {
  modal('display_sub_modal',
    chrome.i18n.getMessage('subHeader'),
    chrome.i18n.getMessage('subText', name),
    false);
}

function bundleOwnedModal() {
  modal('bundle_owned_modal',
    chrome.i18n.getMessage('bundleOwnedHeader'),
    chrome.i18n.getMessage('bundleOwnedText'));
}

function diffDiscountModal() {
  chrome.storage.sync.get('diffDiscount', (value) => {
    if (!value.diffDiscount) {
      modal('different_discount_modal',
        chrome.i18n.getMessage('diffDiscountHeader'),
        chrome.i18n.getMessage('diffDiscountText'),
        false, 'diffDiscount');
    }
  });
}
