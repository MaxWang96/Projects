'use strict';

// function for creating modals that display various error messages
function modal(id, header, text, error) {
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

    if (document.readyState != 'complete') {
        setTimeout(showModal.bind(null, id), 1000);
    } else showModal(id);

    if (error) throw new Error(error);
}

function showModal(id) {
    $(`#${id}`)
        .css({
            'font-size': '13px',
            'color': '#25282a',
            'line-height': '19px',
        })
        .modal({
            backdrop: false
        });
}

function regionModal(region) {
    modal('not_supported_modal',
        chrome.i18n.getMessage('regionErrorHeader'),
        chrome.i18n.getMessage('regionErrorText', region),
        'Region not supported');
}

function freeItemModal(name) {
    modal('free_item_modal',
        chrome.i18n.getMessage('freeItemHeader'),
        chrome.i18n.getMessage('freeItemText', name),
        'This item is free, stopped drawing the chart');
}

function dataModal(name) {
    modal('price_data_error_modal',
        chrome.i18n.getMessage('priceDataErrorHeader'),
        chrome.i18n.getMessage('priceDataErrorText', name),
        'Price data error');
}

function timeoutModal() {
    modal('no_response_from_background_modal',
        'Background Error',
        'Sorry, something went wrong when fetching the price data.',
        'Background Error');
}

function cantConnectModal() {
    modal("cant_connect_to_itad_modal",
        "Can't Connect to ITAD",
        "Sorry, Steam Price Chart fail to connect to IsThereAnyDeal.com to get the price history data.",
        "Can't Connect: ITAD");
}

function bundleModal(name) {
    modal('display_bundle_modal',
        chrome.i18n.getMessage('bundleHeader'),
        chrome.i18n.getMessage('bundleText', name),
        false);
}