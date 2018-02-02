/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */
import { Url, getQueryString, price, transParams, getDogInfo, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    if (!$.cookie('actAddress')) {
        window.location.href = '../html/login.html'
        return false
    }

    let dogid = getQueryString('id')
    getDogInfo(dogid, function (data) {
        if (data.startprice === 0 || data.endprice === 0) {
            window.location.href = '../html/my-dogs.html'
            return false
        } else {
            sessionStorage.setItem('dogDetail', JSON.stringify(data))
        }
    })
    let dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
    let pk = $.cookie('privateKey')
    let addr = $.cookie('actAddress')

    // 從緩存中獲取售價
    let nowPrice = price(dogInfo)

    // 將售價添加到需要的位置
    $('.KittyStatus-note em').text(nowPrice)
    $('.Transaction-item--transfer em').text(nowPrice)
    $('.strongPrice em').text(nowPrice)

    // 狗名字
    $('.Transaction-title em').text(`妳正要買 ${dogInfo.nickname}`)
    $('.strongName em').text(dogInfo.nickname)

    // 狗名字
    $('.KittyBanner-image').attr({
        src: `${dogInfo.avatar}`,
        alt: `Dog # ${dogInfo.dogid}`
    })

    // 如果賣狗人有昵稱則顯示昵稱 否則 獲取賣狗人的 ID 後 5 位
    let salerName = dogInfo.accountPojo.nickname || '小狗收藏家'

    $('.strongSaler em').text(salerName)

    $('.saler em').text(salerName)

    // 獲取狗點擊時的最新價格
    // let clickPrice = () => {
    //     let nowPrice = 0
    //     $.ajax({
    //         type: 'GET',
    //         dataType: 'json',
    //         url: Url + '/user/getdoginfo',
    //         data: {dogid: getQueryString('id')},
    //         success: function (data) {
    //             if (parseInt(data.code) === 1) {
    //                 nowPrice = price(data.obj)
    //             } else if (parseInt(data.code) === -2 || parseInt(data.code) === -1) {
    //                 alert('獲取最新價格失敗~')
    //                 return false
    //             }
    //         }
    //     })
    //     return nowPrice
    // }

    // 購買請求
    let buyAjax = () => {
        let $password = $('.payPassword .passport')

        let selleraddr = dogInfo.owner

        let paysign = ''
        let feesign = ''

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
                // sign = JSON.stringify(ACT.actTransfer(bytes, `${$('#to').val().trim()}`, num * 100000, '', transParams))
                $('.payModal .Section .finalPay').attr('disabled', true)
                paysign = JSON.stringify(ACT.actTransfer(bytes, `${selleraddr}`, nowPrice * 97500, '', transParams))
                feesign = JSON.stringify(ACT.actTransfer(bytes, `ACTKfZkJWmqJ6WkJN77PPMCsAXyYD1WRrQQ1`, nowPrice * 2500, '', transParams))
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        let obj = {
            buyeraddr: addr,
            dogid: dogid,
            selleraddr: selleraddr,
            nickname: dogInfo.nickname,
            feesign: feesign,
            paysign: paysign
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/dog/bid',
            data: $.param(obj),
            // data: form,
            success: function (data) {
                $('.payModal').hide()

                if (parseInt(data.code) === 1) {
                    dogAlert('購買請求成功', function () {
                        window.location.href = '../html/activity.html'
                    })
                    // alert('購買請求成功')
                } else if (parseInt(data.code) === -5) {
                    dogAlert('很遺憾，這只小狗已被其他人買下~')
                    return false
                } else if (parseInt(data.code) === -6) {
                    dogAlert('很抱歉，支付签名時小狗主人验证失败，請重試~')
                    return false
                } else if (parseInt(data.code) === -7) {
                    dogAlert('很抱歉，支付時小狗價格验证失败，請返回重新購買~')
                    return false
                } else if (parseInt(data.code) === -8) {
                    dogAlert('很抱歉，支付時费率验证失败，請返回重新購買~')
                    return false
                } else if (parseInt(data.code) === -9) {
                    dogAlert('很抱歉，支付時小狗费率地址验证错误，請返回重新購買~')
                    return false
                } else if (parseInt(data.code) === -2) {
                    dogAlert('更新失敗, 請刷新頁面后重試~')
                    return false
                } else if (parseInt(data.code) === -16) {
                    dogAlert('很抱歉，功能暫時關閉，开放时间请关注公告~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -14 || parseInt(data.code) === -10) {
                    dogAlert('很遺憾, 小狗已被別人搶先下單~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -13) {
                    dogAlert('狗狗不屬於您, 您無權進行操作~', function () {
                        window.location.href = '../html/my-dogs.html'
                    })
                    return false
                } else if (parseInt(data.code) === -12) {
                    dogAlert('很遺憾, 支付签名广播失败, 請刷新后重新提交~')
                    return false
                } else if (parseInt(data.code) === -11) {
                    dogAlert('很遺憾, 费率签名广播失败, 請刷新后重新提交~')
                    return false
                } else if (parseInt(data.code) === -17) {
                    dogAlert('簽名驗證失敗, 請刷新后重新提交~')
                    return false
                } else if (parseInt(data.code) === -18) {
                    dogAlert('很抱歉, 小狗已經不在售賣中~')
                    return false
                } else {
                    $('.payModal .Section .finalPay').attr('disabled', false)
                    dogAlert(data.msg)
                    return false
                }
            }
        })
    }

    // 彈框關閉
    $('.payModal .KittyTransferModal-close').off('click').on('click', function () {
        $('.payModal').hide()
    })

    // 展示付款彈框
    $('.buy .Section .Button--buy').off('click').on('click', function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: addr},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.payModal .fee .gasPrice').text(0.04)
                    let balance = parseInt(data.obj) / 100000 || 0
                    let myAddr = 'ACT******' + addr.slice(-5)
                    let salerAddr = 'ACT******' + dogInfo.owner.slice(-5)
                    let times = Math.pow(10, 5)
                    let total = parseFloat((parseFloat(nowPrice * times) + parseFloat(0.04 * times)) / times).toFixed(5)
                    $('.payModal').show()
                    $('.payModal .myCountInfo .Addr').text(myAddr)
                    $('.payModal .myCountInfo .myBalance em').text(balance)
                    $('.payModal .sellerCount .salerCountName').text(salerName)
                    $('.payModal .sellerCount .salerAddr').text(salerAddr)
                    $('.payModal .fee .dogPrice').text(nowPrice)
                    $('.payModal .fee .totalPrice').text(total)

                    // 比較余額和總額的大小
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
                        // setInterval(function () { balanceAjax(addr, true, nowPrice) }, 5000)
                    }
                } else {
                    dogAlert('獲取余額失敗')
                    return false
                }
            }
        })
    })

    // 最終支付
    $('body').on('click', '.payModal .Section .finalPay', function () {
        buyAjax()
    })
})
