import {Url, getQueryString, getDogInfo, dogAlert} from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    let address = $.cookie('actAddress')
    let pk = $.cookie('privateKey')
    let id = getQueryString('id')

    getDogInfo(id, function (data) {
        sessionStorage.setItem('dogDetail', JSON.stringify(data))
    })

    const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail')) || ''

    $('.KittyAuction-description em').text(dogInfo.nickname)
    $('.KittyHeader-name-text em').text(dogInfo.nickname)
    let img = `<img class="KittyBanner-image" src=${dogInfo.avatar} alt="dog # ${dogInfo.dogid}">`
    $('.KittyBanner-container a').html(img)

    $('.AuctionForm').submit(function () {
        let $startprince = $('#input-startPrice').val()
        let $endprince = $('#input-endPrice').val()
        if (parseFloat($startprince) <= parseFloat($endprince)) {
            dogAlert('開始價需高於結束價！請重新輸入')
            return false
        }
        // 彈出支付框
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: address},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.payModal .fee .gasPrice').text(0)
                    let balance = parseInt(data.obj) / 100000 || 0
                    let myAddr = 'ACT******' + address.slice(-5)
                    // let salerAddr = 'ACT******' + dogInfo.owner.slice(-5)
                    let salerAddr = 'ACT******'
                    let total = 0
                    let salerName = 'ACT幣商'

                    $('.payModal').show()
                    $('.payModal .myCountInfo .Addr').text(myAddr)
                    $('.payModal .myCountInfo .myBalance em').text(balance)
                    $('.payModal .sellerCount .salerCountName').text(salerName)
                    $('.payModal .sellerCount .salerAddr').text(salerAddr)
                    $('.payModal .fee .dogPrice').text(0)
                    $('.payModal .fee .totalPrice').text(total)

                    // 判斷余額和總數大小
                    if (balance > total) {
                        $('.finalPay').removeClass('Button--disabled')
                        $('.recharge').hide()
                        $('.tips').hide()
                    } else {
                        $('.finalPay').addClass('Button--disabled')
                        $('.recharge').show().click(function () {
                            window.open('http://www.feixiaohao.com/coinmarket/achain/')
                        })
                        $('.tips').show()
                        $('.chargeSiteSection').show()

                        // 輪詢請求余額
                        // let interval = ''
                        // clearInterval(interval)
                        // interval = setInterval(function () { balanceAjax(address, false) }, 5000)
                    }
                } else {
                    dogAlert('獲取余額失敗')
                    return false
                }
            }
        })

        return false
    })

    // 彈框關閉
    $('.payModal .KittyTransferModal-close').off('click').on('click', function () {
        $('.payModal').hide()
    })

    // 最終支付
    $('body').on('click', '.payModal .Section .finalPay', function () {
        const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        let $startprince = $('#input-startPrice').val()
        let $endprince = $('#input-endPrice').val()
        let $duration = $('#input-duration').val() * 24 * 3600000

        let $password = $('.payPassword .passport')

        let sellSign = ''

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
                return false
            }
            if (bytes && bytes.trim() !== '') {
                // 獲取掛狗交易單簽名
                // sellSign = JSON.stringify(ACT.callContract(bytes, 'addAuction', `${id}|${$startprince}|${$endprince}|${$duration}`, transParams))
                $('.payModal .Section .finalPay').attr('disabled', true)
                sellSign = CryptoJS.AES.decrypt($.cookie('signJson'), address).toString(CryptoJS.enc.Utf8)
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        let data = {
            startprice: $startprince,
            endprice: $endprince,
            durationtime: $duration,
            dogid: id,
            signjson: sellSign,
            nickname: dogInfo.nickname
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/auction/add',
            data: data,
            success: function (data) {
                $('.payModal').hide()

                if (parseInt(data.code) === 1) {
                    dogAlert('請求成功', function () {
                        window.location.href = '../html/activity.html'
                    })
                } else if (parseInt(data.code) === -2) {
                    dogAlert('更新失敗, 請刷新頁面后重試~')
                    return false
                } else if (parseInt(data.code) === -16) {
                    dogAlert('很抱歉，功能暫時關閉，开放时间请关注公告~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -14 || parseInt(data.code) === -10) {
                    dogAlert('挂單已經存在，請勿重複提交~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -13) {
                    dogAlert('狗狗不屬於您, 您無權進行操作~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -17) {
                    dogAlert('簽名驗證失敗, 請刷新后重新提交~')
                    return false
                } else {
                    $('.payModal .Section .finalPay').attr('disabled', false)
                    dogAlert(data.msg)
                    return false
                }
            }
        })
    })
})
