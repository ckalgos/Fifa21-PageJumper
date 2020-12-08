// ==UserScript==
// @name         FUT 21 Jumper with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @updateURL    https://github.com/chithakumar13/Fifa21-PageJumper/blob/master/jumper.user.js
// @description  FUT Page Jumper
// @author       CK Algos
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/* 
// ==/UserScript==

(function () {
    'use strict';

    UTMarketSearchResultsViewController.prototype._requestItems = function (l) {
        let pageVal = jQuery('#ab_page_number').val();
        if (pageVal && !isNaN(pageVal)) {
            l = parseInt(pageVal);
        }

        pageVal = jQuery('#ab_result_page_number').val();
        if (pageVal && !isNaN(pageVal)) {
            l = parseInt(pageVal);
            jQuery('#ab_result_page_number').val('');
        }

        resultJumperInterface();

        this._paginationViewModel.stopAuctionUpdates(),
            services.Item.searchTransferMarket(this._searchCriteria, l).observe(this, function _onRequestItemsComplete(e, t) {
                if (e.unobserve(this),
                    !t.success)
                    return NetworkErrorManager.checkCriticalStatus(t.status) ? void NetworkErrorManager.handleStatus(t.status) : (services.Notification.queue([services.Localization.localize("popup.error.searcherror"), enums.UINotificationType.NEGATIVE]),
                        void this.getNavigationController().popViewController());
                if (0 < this._searchCriteria.offset && 0 === t.data.items.length)
                    this._requestItems(l - 1);
                else {
                    var i = this._paginationViewModel.getNumItemsPerPage()
                        , o = t.data.items.slice();
                    if (this.onDataChange.notify({
                        items: o
                    }),
                        o.length > i && (o = o.slice(0, i)),
                        this._paginationViewModel.setPageItems(o),
                        this._paginationViewModel.setPageIndex(l),
                        this._selectedItem && 0 < o.length) {
                        var n = this._paginationViewModel.getIndexByItemId(this._selectedItem.id);
                        0 < n && this._paginationViewModel.setIndex(n),
                            this._selectedItem = null
                    }
                    var s = this.getView()
                        , r = null;
                    if (!this._stadiumViewmodel || this._searchCriteria.type !== SearchType.VANITY && this._searchCriteria.type !== SearchType.CLUB_INFO && this._searchCriteria.type !== SearchType.BALL || (r = this._stadiumViewmodel.getStadiumProgression(this._searchCriteria.subtypes)),
                        s.setItems(this._paginationViewModel.getCurrentPageItems(), r),
                        s.setPaginationState(1 < l, t.data.items.length > i),
                        utils.JS.isValid(this._compareItem) && !this._squadContext) {
                        var a = utils.JS.find(o, function (e) {
                            return e.getAuctionData().tradeId === this._compareItem.getAuctionData().tradeId
                        }
                            .bind(this));
                        utils.JS.isValid(a) ? this._pinnedListItem.setItem(a) : this._paginationViewModel.setPinnedItem(this._compareItem)
                    } else
                        !isPhone() && 0 < o.length && s.selectListRow(this._paginationViewModel.getCurrentItem().id)
                }
                this._paginationViewModel.startAuctionUpdates()
            })
    }

    window.UTSnipeFilterViewController = function () {
        UTAppSettingsViewController.call(this);
        this._jsClassName = 'UTSnipeFilterViewController';
    };

    utils.JS.inherits(UTSnipeFilterViewController, UTAppSettingsViewController);

    window.jumperInterface = function () {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            window.hasLoadedAll = true;
        }

        if (window.hasLoadedAll && jQuery(".search-prices").length) {
            if (jQuery('.search-prices').first().length) {
                {
                    if (!jQuery('#ab_page_number').length) {
                        jQuery(".search-prices").first().append(`<div> 
                            <div class="search-price-header"> 
                                   <h1>Page Number:</h1>
                            </div>
                            <div class="price-filter"> 
                                    <div class="ut-numeric-input-spinner-control">
                                        <input type="tel" id="ab_page_number" class="numericInput" placeholder="1" /> 
                                    </div> 
                            </div> 
                    </div>`
                        );
                    }
                }
            }
        } else {
            window.setTimeout(jumperInterface, 1000);
        }
    }

    window.resultJumperInterface = function () {
        if (jQuery(".flat.pagination.prev").length) {
            if (jQuery('.flat.pagination.prev').first().length) {
                if (!jQuery('#ab_result_page_number').length) {
                    jQuery(".flat.pagination.prev").first().after(`<div>  
                            <div class="price-filter"> 
                                    <div class="ut-numeric-input-spinner-control">
                                        <input type="tel" id="ab_result_page_number" class="numericInput" placeholder="Next Page Number" /> 
                                    </div> 
                            </div> 
                    </div>`
                    );
                }
            }
        }
    }

    jumperInterface(); 
})();
