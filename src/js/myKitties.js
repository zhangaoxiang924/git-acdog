/**
 * Author：zhoushuanglong
 * Time：2017-12-19 16:42
 * Description：my kitties
 */

import { Url, paging, price, timeLeft, transParams, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    if (!$.cookie('actAddress')) {
        window.location.href = '../html/login.html'
        return false
    }
    const pk = $.cookie('privateKey')
    const addr = $.cookie('actAddress')
    const coolDown = (item) => {
        return `<div class="KittyCard-coldown">
                    <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">
                            ${item.metingtime / 3600 + ' 小時'}
                        </font>
                    </font>
                </div>`
    }

    // 加載中的 loading 狀態
    $('.Loader').css({
        margin: '80px 0 0',
        padding: 0
    })

    // 點擊註銷
    $('.logOutSpan').click(function () {
        $.removeCookie('actAddress')
        $.removeCookie('privateKey')
        $.removeCookie('signJson')
        $.removeCookie('publicKey')

        window.location.href = '../html/login.html'
    })

    // 點擊充值
    $('.site').click(function () {
        $('.siteModal').show()
    })

    $('.siteModal').on('click', '.KittyTransferModal-close', function () {
        $('.siteModal').hide()
    })

    $('.siteModal .chargeSite ul li a').click(function () {
        $('.siteModal').hide()
    })

    $('.sugarModal').on('click', '.KittyTransferModal-close', function () {
        $('.sugarModal').hide()
    })

    // 點擊提現展示列表彈框
    $('.getMoney').click(function (e) {
        e.stopPropagation()
        $('.tips').toggleClass('active')
    })

    let $getCommitButton = $('.Section-modal .getCommitButton')
    let $getCashButton = $('.Section-modal .confirmButton')
    let $getSugarButton = $('.Section-modal .sugarConfirmButton')

    // 點擊弹出领取糖果
    $('.sugar').click(function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'account/checkextraaddr',
            data: {signjson: CryptoJS.AES.decrypt($.cookie('signJson'), addr).toString(CryptoJS.enc.Utf8)},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.sugarModal').show()
                    $('.sugarModal #sugarAddr').val(data.obj)
                } else if (parseInt(data.code) === -1) {
                    $('.sugarModal').show()
                    $('.sugarModal #sugarAddr').val('')
                } else if (parseInt(data.code) === -10) {
                    dogAlert('請勿重複提交！')
                } else if (parseInt(data.code) === -17) {
                    dogAlert('簽名驗證失敗, 請刷新后重新提交！')
                } else {
                    dogAlert('請求出現錯誤！')
                }
            }
        })
    })

    // 糖果弹窗提交地址
    $('.sugarModal #sugarAddr').on('input', function () {
        if ($('#sugarAddr').val().trim() !== '') {
            $getSugarButton.removeClass('Button--disabled')
            $getSugarButton.attr('disabled', false)
        } else {
            $getSugarButton.addClass('Button--disabled')
            $getSugarButton.attr('disabled', true)
        }
    })

    $getSugarButton.click(function () {
        let $password = $('.sugarModal .passport')
        if ($password.val().trim() === '') {
            dogAlert('密码不能为空！')
            $password.val('')
            return false
        } else {
            // 获取私钥
            let bytes = ''
            try {
                bytes = CryptoJS.AES.decrypt(pk, $password.val()).toString(CryptoJS.enc.Utf8)
            } catch (err) {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
            if (bytes && bytes.trim() !== '') {
                $getSugarButton.addClass('Button--disabled')
                $getSugarButton.attr('disabled', true)
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'account/commitextraaddr',
            data: {extraaddr: $('#sugarAddr').val(), signjson: CryptoJS.AES.decrypt($.cookie('signJson'), addr).toString(CryptoJS.enc.Utf8)},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.sugarModal').hide()
                    $('.num').text(0)
                    dogAlert('操作成功！')
                } else {
                    $getSugarButton.removeClass('Button--disabled')
                    $getSugarButton.attr('disabled', false)
                    dogAlert('操作失敗！')
                    return false
                }
            }
        })
    })

    $('.extractBalanceModal .KittyTransferModal-close').click(function () {
        $('.extractBalanceModal').hide()
    })

    $('.extractCommitModal .KittyTransferModal-close').click(function () {
        $('.extractCommitModal').hide()
    })

    // 1 點擊取合約余額彈框
    $('.toAccount').click(function (e) {
        e.stopPropagation()
        $('.tips').toggleClass('active')
        // 合約余額查詢簽名
        // let moneySign = JSON.stringify(ACT.callContract(pk, 'query_balance', '', transParams))
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getcontractbalance', // 查詢合約余額地址
            // data: {sign: moneySign},
            data: {addr: addr},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.commitBannceNum').text(data.obj / 100000 || 0)
                    $('.extractCommitModal').show()
                    $('#extractCommitNum').attr('max', data.obj / 100000 || 0)
                } else {
                    dogAlert('請求出現錯誤！')
                }
            }
        })
    })

    // 2 判斷input 的數值大小 確定取合約按鈕是否可點擊
    $('#extractCommitNum').on({
        'change': function () {
            if ($('#extractCommitNum').val() > 0) {
                $getCommitButton.removeClass('Button--disabled')
                $getCommitButton.attr('disabled', false)
            } else {
                $getCommitButton.addClass('Button--disabled')
                $getCommitButton.attr('disabled', true)
            }
        },
        'input': function () {
            if ($('#extractCommitNum').val() > 0) {
                $getCommitButton.removeClass('Button--disabled')
                $getCommitButton.attr('disabled', false)
            } else {
                $getCommitButton.addClass('Button--disabled')
                $getCommitButton.attr('disabled', true)
            }
        }
    })

    // 3 請求
    $getCommitButton.click(function () {
        let num = $('#extractCommitNum').val()
        if (parseFloat(num) > parseFloat($('#extractCommitNum').attr('max'))) {
            dogAlert('提現數量有誤，請檢查')
            return false
        }

        let $password = $('.extractCommitModal .passport')

        let moneySign = ''

        if ($password.val().trim() === '') {
            dogAlert('密码不能为空！')
            $password.val('')
            return false
        } else {
            // 获取私钥
            let bytes = ''
            try {
                bytes = CryptoJS.AES.decrypt(pk, $password.val()).toString(CryptoJS.enc.Utf8)
            } catch (err) {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
            if (bytes && bytes.trim() !== '') {
                moneySign = JSON.stringify(ACT.callContract(bytes, 'withdraw_balance', `${num}`, transParams))
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            // 取合約余額地址
            url: Url + 'user/drawcontractbalance',
            data: {addr: addr, sign: moneySign},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    dogAlert('操作成功！', function () {
                        $('.extractCommitModal').hide()
                        window.location.href = '../html/activity.html'
                        $('.commitBannceNum').text(0)
                    })
                } else {
                    dogAlert('操作失敗！')
                    return false
                }
            }
        })
    })

    // 1 點擊獲取賬戶余額(轉賬)
    $('.toCash').click(function (e) {
        e.stopPropagation()
        $('.tips').toggleClass('active')
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: addr},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.balanceNum').text(data.obj / 100000 || 0)
                    $('.extractBalanceModal').show()
                    $('#extractNum').attr('max', data.obj / 100000 || 0)
                }
            }
        })
    })

    // 2 判斷 錢包地址是否存在 確定取錢按鈕是否可點擊
    $('.extractBalanceModal #to').on('input', function () {
        if ($('#to').val().trim() !== '') {
            $getCashButton.removeClass('Button--disabled')
            $getCashButton.attr('disabled', false)
        } else {
            $getCashButton.addClass('Button--disabled')
            $getCashButton.attr('disabled', true)
        }
    })

    // 3 轉賬請求
    $getCashButton.click(function () {
        let num = $('#extractNum').val()
        if (parseFloat(num) > parseFloat($('.balanceNum').text())) {
            dogAlert('提現數量有誤，請檢查')
            return false
        }

        let $password = $('.extractBalanceModal .passport')

        let sign = ''

        if ($password.val().trim() === '') {
            dogAlert('密码不能为空！')
            $password.val('')
            return false
        } else {
            // 获取私钥
            let bytes = ''
            try {
                bytes = CryptoJS.AES.decrypt(pk, $password.val()).toString(CryptoJS.enc.Utf8)
            } catch (err) {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
            if (bytes && bytes.trim() !== '') {
                sign = JSON.stringify(ACT.actTransfer(bytes, `${$('#to').val().trim()}`, num * 100000, '', transParams))
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/transferact',
            data: {addr: addr, sign: sign},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.extractBalanceModal').hide()
                    $('.num').text(0)
                    dogAlert('操作成功！')
                } else {
                    dogAlert('操作失敗！')
                    return false
                }
            }
        })
    })

    // 沒狗狀態的顯示
    let noDogHtml = (data) => {
        let html = ''
        data.map((item, index) => {
            html += `<div class="KittiesGrid-item">
                            <a aria-current="false" href=${`../html/dog-detail.html?id=${item.dogid}`}>
                                <div class="KittyCard-wrapper">
                                    <div class="KittyCard u-bg-alt-gold KittyCard--responsive"  style="background-color: ${item.bgcolor}">
                                        <img class="KittyCard-image" src=${item.avatar} alt="Dog # ${item.dogid}">
                                        <div class="KittyCard-status">
                                            <div class="KittyStatus">
                                                <div class="KittyStatus-item">
                                                    <span class="KittyStatus-itemIcon"><i class="Icon Icon--tag"></i></span>
                                                    <span class="KittyStatus-itemText"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">售價</font>
                                                    <span class="KittyStatus-note">
                                                    <small><font style="vertical-align: inherit;">Ξ</font></small></span>
                                                    <span class="KittyStatus-note"><font style="vertical-align: inherit;"> ${price(item)}</font></span></font>
                                                    <span class="KittyStatus-note">
                                                    <small><font style="vertical-align: inherit;"></font></small>
                                                    <font style="vertical-align: inherit;"></font>
                                                    </span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="KittyCard-details">
                                        <div class="KittyCard-subname">
                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Dog # ${item.nickname} · 第 ${item.generation} 代</font></font>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`
        })
        return html
    }

    let nodogDiv = (list) => {
        return `<div class="nodogDiv">
                <div class="Hero" id="nodog">
                    <div class="Container Container--sm Container--center">
                        <h2 class="Hero-h2 u-margin-top-lg"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">妳沒有任何小狗</font></font></h2>
                        <p class="Hero-description">
                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">這裏有壹些小狗正在尋找壹個新家。</font></font>
                        </p>
                        <div class="u-margin-bottom-lg">
                            <div class="KittiesGrid KittiesGrid--colspan-3">
                                ${noDogHtml(list)}
                            </div>
                        </div>
                        <a class="Button Button--larger u-margin-bottom-xs" aria-current="false" href="../html/marketplace.html">
                            <font style="vertical-align: inherit;">
                                <font style="vertical-align: inherit;">查看更多狗</font>
                            </font>
                        </a>
                    </div>
                </div>
            </div>`
    }

    // 狗當前狀態的顯示
    let myKittyStatus = (item) => {
        if (item.status === 0) {
            if (item.cooldownendtime <= Date.parse(new Date())) {
                return ``
            } else {
                if (item.birthtime >= Date.parse(new Date())) {
                    return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--eggplant"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>出生中... </em><em class="coolDownTime" style="font-size: 1.5rem; color: #898989; margin-left: 1.5rem;">${timeLeft(item.cooldownendtime)}</em>
                            </span>
                        </div>
                    </div>
                </div>`
                } else {
                    return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--eggplant"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>生育中... </em><em class="coolDownTime" style="font-size: 1.5rem; color: #898989; margin-left: 1.5rem;">${timeLeft(item.cooldownendtime)}</em>
                            </span>
                        </div>
                    </div>
                </div>`
                }
            }
        } else if (item.status === 1) {
            return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--tag"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>售賣中...</em>
                            </span>
                        </div>
                    </div>
                </div>`
        } else if (item.status === 2) {
            if (item.cooldownendtime <= Date.parse(new Date())) {
                return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--eggplant"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>孕育掛單中...</em>
                            </span>
                        </div>
                    </div>
                </div>`
            } else {
                return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--eggplant"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>孕育冷卻中... ${timeLeft(item.cooldownendtime)}</em><em class="coolDownTime" style="font-size: 1rem; color: #898989; margin-left: 1.5rem;">${timeLeft(item.cooldownendtime)}</em>
                            </span>
                        </div>
                    </div>
                </div>`
            }
        } else if (item.status === 3 || item.status === 4) {
            return `<div class="KittyCard-status">
                        <div class="KittyStatus">
                        <div class="KittyStatus-item">
                            <span class="KittyStatus-itemIcon">
                                <i class="Icon Icon--tag"></i>
                            </span>
                            <span class="KittyStatus-itemText">
                                <em>挂单已过期，请取消...</em>
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

    // 狗 List 的展示
    const htmlTemps = (data) => {
        return data.map((item, index) => {
            if (item.birthtime > Date.parse(new Date())) {
                return `<div class="KittiesGrid-item">
                            <a aria-current="false" class="babyDogBirth">
                                <div class="KittyCard-wrapper">
                                    <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                                        <img class="KittyCard-image" src='../images/icons/babyDog.svg' alt="Dog # ${item.dogid}"/>
                                        ${myKittyStatus(item)}
                                    </div>
                                    <div class="KittyCard-details">
                                        <div class="KittyCard-name">
                                            <em>dog # ${item.dogid}</em>
                                        </div>
                                        <div class="KittyCard-subname">
                                            <font style="vertical-align: inherit;">
                                                <font style="vertical-align: inherit;">
                                                    ${item.nickname || `dog#${item.dogid}`} · 第 ${item.generation} 代
                                                </font>
                                            </font>
                                        </div>
                                        ${coolDown(item)}
                                    </div>
                                </div>
                            </a>
                        </div>`
            } else {
                return `<div class="KittiesGrid-item">
                            <a aria-current="false" href=${item.status === 0 ? `../html/my-dog-detail.html?id=${item.dogid}` : `../html/dog-detail.html?id=${item.dogid}`}>
                                <div class="KittyCard-wrapper">
                                    <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                                        <img class="KittyCard-image" src=${item.avatar} alt="Dog # ${item.dogid}"/>
                                        ${myKittyStatus(item)}
                                    </div>
                                    <div class="KittyCard-details">
                                        <div class="KittyCard-name">
                                            <em>dog # ${item.dogid}</em>
                                        </div>
                                        <div class="KittyCard-subname">
                                            <font style="vertical-align: inherit;">
                                                <font style="vertical-align: inherit;">
                                                    ${item.nickname || `dog#${item.dogid}`} · 第 ${item.generation} 代
                                                </font>
                                            </font>
                                        </div>
                                        ${coolDown(item)}
                                    </div>
                                </div>
                            </a>
                        </div>`
            }
        })
    }

    // 獲取用戶信息
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Url + 'user/getuserinfo',
        data: {addr: addr},
        success: function (data) {
            if (parseInt(data.code) === 1) {
                let info = data.obj
                sessionStorage.setItem('userInfo', JSON.stringify(data.obj))
                $('.ProfileHeader-title em').html(info.nickname)
                $('.ProfileHeader-image').attr('src', info.avatar)
            } else {
                dogAlert('請求出現錯誤')
                return false
            }
        }
    })

    // 獲取狗列表並展示
    paging({
        pagination: '#pagination',
        type: 'POST',
        dataType: 'json',
        url: Url + 'user/getmydoglist',
        data: {
            sequence: '',
            filter: 1,
            pageSize: 12,
            addr: addr
        },
        success: function (data) {
            $('.Loader').remove()
            if (data.code === 1) {
                $('#kittiesGrid').html(htmlTemps(data.marketlist))
            } else if (data.code === 2) {
                $('.ProfileKitties').hide()
                $('#nodogDiv').html(nodogDiv(data.marketlist))
            }
        }
    })
})
