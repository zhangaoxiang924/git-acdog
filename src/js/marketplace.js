/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import { Url, paging, price, dogAlert } from './utils/utils'

$(function () {
    let $KittiesGrid = $('.KittiesGrid')
    let $FilterSelect = $('.Filter-select')
    $('.Filter-tabs .Filter-tab').removeClass('Filter-tab--active')

    $FilterSelect.val(sessionStorage.getItem('dogSequence') || '5')

    let randomCode = ''
    if (!sessionStorage.getItem('signature')) {
        randomCode = Math.random().toString(36).substr(2)
        sessionStorage.setItem('signature', randomCode)
    } else {
        randomCode = sessionStorage.getItem('signature')
    }

    $('.marketplace').off('click').on('click', '.Pagination button', function () {
        const pageNum = parseInt($(this).data('page'))
        sessionStorage.setItem('dogCurrPage', pageNum)
    })

    let newOrNot = `<span class="KittyCard-newBadge">
                        <svg class="NewBadge" width="100%" height="100%" viewBox="0 0 38 38">
                            <g fill="none" fill-rule="evenodd">
                                <path d="M37.985 0L0 37.985V0h37.985z" fill="#f88834"></path>
                                <text fill="#FFF" font-family="Calibre-Semibold, Calibre" font-size="12" font-weight="500" letter-spacing=".4" transform="rotate(-45 13.581 14.581)">
                                    <tspan x="3.081" y="16.581">官方</tspan>
                                </text>
                            </g>
                        </svg>
                    </span>`

    let coolDown = (item) => {
        return `<div class="KittyCard-coldown">
                    <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">${parseFloat(item.metingtime / 3600) + ' 小時'}</font>
                    </font>
                </div>`
    }

    let zeroProduct = ` ` || `<div class="BrowseAnnouncement">
            <div class="Container Container--lg">
                <div class="Announcement">
                    <div class="Announcement-icon">
                        <img class="u-spin u-spin--slow" src="../images/icons/clock.svg" alt=""/>
                    </div>
                    <h2 class="Announcement-message">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">新的“0代”小狗大約每30分鐘到達壹次！</font>
                        </font>
                    </h2>
                    <div class="Announcement-cta" id="checkNewDog">
                        <button class="Button Button--cta">
                            <font style="vertical-align: inherit;">
                                <font style="vertical-align: inherit;">檢查新的小狗！</font>
                            </font>
                        </button>
                    </div>
                </div>
            </div>
        </div>`

    // let checkDisplay = `<div class="BrowseAnnouncement">
    //         <div class="Container Container--lg">
    //             <div class="Announcement">
    //                 <div class="Announcement-icon">
    //                     <img class="u-spin u-spin--slow" src="../images/icons/clock.svg" alt=""/>
    //                 </div>
    //                 <h2 class="Announcement-message">
    //                     <font style="vertical-align: inherit;">
    //                         <font style="vertical-align: inherit;">檢測 GM 官方小狗的狀態</font>
    //                     </font>
    //                 </h2>
    //                 <div class="Announcement-cta" id="checkDisplay">
    //                     <button class="Button Button--cta">
    //                         <font style="vertical-align: inherit;">
    //                             <font style="vertical-align: inherit;">檢查狀態</font>
    //                         </font>
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>`

    let myKittyStatus = (item) => {
        if (item.status === 0) {
            return ''
        } else if (item.status === 1) {
            return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--tag"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <font style="vertical-align: inherit;">
                                    <font style="vertical-align: inherit;">售價</font>
                                    <span class="KittyStatus-note">
                                        <small>
                                            <font style="vertical-align: inherit;">Ξ</font>
                                        </small>
                                    </span>
                                    <span class="KittyStatus-note">
                                        <font style="vertical-align: inherit;">${price(item)} <em class="ACT" style="font-weight: bold"> ACT</em></font>
                                    </span>
                                </font>
                            </span>
                        </div>
                    </div>
                </div>`
        } else if (item.status === 2) {
            return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--eggplant"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <font style="vertical-align: inherit;">
                                    <font style="vertical-align: inherit;">售價</font>
                                    <span class="KittyStatus-note">
                                        <small>
                                            <font style="vertical-align: inherit;">Ξ</font>
                                        </small>
                                    </span>
                                    <span class="KittyStatus-note">
                                        <font style="vertical-align: inherit;">${price(item)} <em class="ACT" style="font-weight: bold"> ACT</em></font>
                                    </span>
                                </font>
                            </span>
                        </div>
                    </div>
                </div>`
        } else {
            return `<div class="KittyStatus-item">
                    <span class="KittyStatus-itemIcon">
                        <i class="Icon Icon--tag"></i>
                    </span>
                    <span class="KittyStatus-itemText">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">售價</font>
                            <span class="KittyStatus-note">
                                <small>
                                    <font style="vertical-align: inherit;">Ξ</font>
                                </small>
                            </span>
                            <span class="KittyStatus-note">
                                <font style="vertical-align: inherit;">${price(item)}</font>
                            </span>
                        </font>
                    </span>
                </div>`
        }
    }

    let tempHtml = (item, price) => {
        let vision = Math.random().toString(36).substr(2)
        return `<div class="KittiesGrid-item">
                    <a aria-current="false" href="../html/dog-detail.html?id=${item.dogid}">
                        <div class="KittyCard-wrapper">
                            <div class="KittyCard u-bg-alt-topaz KittyCard--responsive" style="background-color: ${item.bgcolor}">
                                <img class="KittyCard-image" src="${item.avatar}?v_${vision}" alt="Dog # ${item.dogid}"/>
                                ${myKittyStatus(item)}
                                ${item.official === 1 ? newOrNot : ''}
                            </div>
                            <div class="KittyCard-details">
                                <div class="KittyCard-subname">
                                    <font style="vertical-align: inherit;">
                                        <font style="vertical-align: inherit;">${item.nickname} · 第 ${item.generation} 代</font>
                                    </font>
                                </div>
                                ${coolDown(item)}
                            </div>
                        </div>
                    </a>
                </div>`
    }

    let marketlist = []

    let curUrl = ''

    let ajaxHtml = (url) => {
        curUrl = url
        let sequence = $FilterSelect.val()
        paging({
            pagination: '#pagination',
            type: 'POST',
            dataType: 'json',
            url: Url + url,
            data: {
                reqid: randomCode,
                sequence: sequence,
                filter: 1,
                pageSize: 12,
                currentPage: parseInt(sessionStorage.getItem('dogCurrPage'))
            },
            success: function (data) {
                sessionStorage.setItem('dogSequence', sequence)
                if (data.code === 1) {
                    $('.Loader').remove()
                    marketlist = data.marketlist
                    let allDog = marketlist.map((item, index) => {
                        return tempHtml(item, price(item))
                    })
                    $KittiesGrid.html(allDog)
                } else if (data.code === -10) {
                    return false
                } else {
                    $KittiesGrid.html('')
                    dogAlert('請求出現錯誤')
                }
            }
        })
    }

    // 檢查是否有新的狗
    $('body').on('click', '#checkNewDog', function () {
        ajaxHtml('market/getzerolist')
    })

    // 進入頁面之後默認信息
    switch (parseInt(sessionStorage.getItem('dogType'))) {
        case 1:
            $('.Filter-tabs .salingDog').addClass('Filter-tab--active')
            ajaxHtml('market/getorderlist')
            break
        case 2:
            $('.Filter-tabs .siringDog').addClass('Filter-tab--active')
            ajaxHtml('market/getfertilitylist')
            break
        case 3:
            $(zeroProduct).insertBefore($('.KittiesGallery'))
            $('.Filter-tabs .zeroDog').addClass('Filter-tab--active')
            ajaxHtml('market/getzerolist')
            break
        case 4:
            $('.Filter-tabs .allDog').addClass('Filter-tab--active')
            ajaxHtml('market/getalllist')
            break
        // case 5:
        //     $('.Filter-tabs .gmdog').addClass('Filter-tab--active')
        //     $(checkDisplay).insertBefore($('.KittiesGallery'))
        //     ajaxHtml('gm/gmmarket/getorderlist')
        //     break
        default:
            $('.Filter-tabs .salingDog').addClass('Filter-tab--active')
            ajaxHtml('market/getorderlist')
            break
    }

    $FilterSelect.change(function () {
        sessionStorage.removeItem('dogCurrPage')
        ajaxHtml(curUrl)
    })

    $('.marketplace .Filter-container .salingDog').off('click').on('click', function () {
        sessionStorage.setItem('dogType', 1)
        sessionStorage.removeItem('dogCurrPage')
        $(this).addClass('Filter-tab--active').siblings().removeClass('Filter-tab--active')
        $('.BrowseAnnouncement').remove()
        ajaxHtml('market/getorderlist')
    })

    $('.marketplace .Filter-container .siringDog').off('click').on('click', function () {
        sessionStorage.setItem('dogType', 2)
        sessionStorage.removeItem('dogCurrPage')
        $(this).addClass('Filter-tab--active').siblings().removeClass('Filter-tab--active')
        $('.BrowseAnnouncement').remove()
        ajaxHtml('market/getfertilitylist')
    })

    $('.marketplace .Filter-container .zeroDog').off('click').on('click', function () {
        sessionStorage.setItem('dogType', 3)
        sessionStorage.removeItem('dogCurrPage')
        $(this).addClass('Filter-tab--active').siblings().removeClass('Filter-tab--active')
        $('.BrowseAnnouncement').remove()
        $(zeroProduct).insertBefore($('.KittiesGallery'))
        ajaxHtml('market/getzerolist')
    })

    $('.marketplace .Filter-container .allDog').off('click').on('click', function () {
        sessionStorage.setItem('dogType', 4)
        sessionStorage.removeItem('dogCurrPage')
        $(this).addClass('Filter-tab--active').siblings().removeClass('Filter-tab--active')
        $('.BrowseAnnouncement').remove()
        ajaxHtml('market/getalllist')
    })

    // let secretAjax = (url) => {
    //     curUrl = url
    //     let sequence = $('.Filter-select').val() || ''
    //     paging({
    //         pagination: '#pagination',
    //         type: 'POST',
    //         dataType: 'json',
    //         url: Url + url,
    //         data: {
    //             reqid: randomCode,
    //             sequence: sequence,
    //             filter: 1,
    //             pageSize: 12,
    //             key: 'Fq1gd5CGtVGHjsJk'
    //         },
    //         success: function (data) {
    //             if (data.code === 1) {
    //                 $('.Loader').remove()
    //                 marketlist = data.marketlist
    //                 let allDog = marketlist.map((item, index) => {
    //                     return tempHtml(item, price(item))
    //                 })
    //                 $KittiesGrid.html(allDog)
    //             } else if (data.code === -10) {
    //                 return false
    //             } else {
    //                 $KittiesGrid.html('')
    //                 dogAlert('請求出現錯誤')
    //             }
    //         }
    //     })
    // }
    //
    // $('.marketplace .Filter-container .gmdog').off('click').on('click', function () {
    //     $(this).addClass('Filter-tab--active').siblings().removeClass('Filter-tab--active')
    //     sessionStorage.setItem('dogType', 5)
    //     sessionStorage.removeItem('dogCurrPage')
    //     $('.BrowseAnnouncement').remove()
    //     $(checkDisplay).insertBefore($('.KittiesGallery'))
    //     secretAjax('gm/gmmarket/getorderlist')
    // })
    //
    // // 檢查官方狗的狀態
    // $('body').on('click', '#checkDisplay', function () {
    //     $.ajax({
    //         type: 'POST',
    //         dataType: 'json',
    //         url: Url + 'gm/gmmarket/display',
    //         data: {},
    //         success: function (data) {
    //             if (data.code === 1 || data.code === -10) {
    //                 return false
    //             } else {
    //                 dogAlert('請求出現錯誤')
    //             }
    //         }
    //     })
    // })
})
