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

    function showModal() {
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

    if (document.readyState != 'complete') {
        setTimeout(showModal, 1000);
    } else showModal();

    if (error) throw new Error(error);
}

function dataError(name) {
    modal('price_data_error_modal', chrome.i18n.getMessage('priceDataErrorHeader'), chrome.i18n.getMessage('priceDataErrorText', name), 'Price data error');
}