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

function modal(id, header, text, error = true) {
  document.body.insertAdjacentHTML('beforeend', `
            <div class="spc_modal_container">
                <div class="modal right fade" id="${id}" role="dialog">
                    <div class="modal-dialog" style='width:230px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <p><img src="${chrome.runtime.getURL('../images/icon_48.png')}" style='width:15px;height:15px;vertical-align:middle;'> ${header} <p>
                            </div>
                            <div class="modal-body">
                                <p style="margin:0px;">${text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

  if (document.readyState !== 'complete') setTimeout(showModal.bind(null, id), 1000);
  else showModal(id);

  if (error) throw new Error('chart error');
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

function dataModal(name) {
  modal('price_data_error_modal',
    chrome.i18n.getMessage('priceDataErrorHeader'),
    chrome.i18n.getMessage('priceDataErrorText', name));
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

function bundleOwnedModal() {
  modal('bundle_owned_modal',
    chrome.i18n.getMessage('bundleOwnedHeader'),
    chrome.i18n.getMessage('bundleOwnedText'));
}
