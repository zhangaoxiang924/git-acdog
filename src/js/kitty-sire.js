import { Url, getQueryString, paging, price, transParams, getDogInfo, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

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
const pk = $.cookie('privateKey')

getDogInfo(getQueryString('id'), function (data) {
    sessionStorage.setItem('dogDetail', JSON.stringify(data))
})

$(function () {
    if (!$.cookie('actAddress')) {
        window.location.href = '../html/login.html'
        return false
    }

    const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))

    const $selectMyDog = $('.selectMyDog')
    const $modalClose = $('.KittySelectModal-close')
    // const dogid = getQueryString('id')

    const htmlTemps = (data) => {
        let html = ''
        data.map((item, index) => {
            let setArr = []
            setArr.push(dogInfo.dogid)
            setArr.push(dogInfo.fatherId)
            setArr.push(dogInfo.motherid)
            setArr.push(item.dogid)
            setArr.push(item.fatherId)
            setArr.push(item.motherid)
            if (item.status === 0 && (item.cooldownendtime < Date.parse(new Date()))) {
                if ([...new Set(setArr)].length < setArr.length) {
                    if (dogInfo.fatherId === 0 || dogInfo.motherid === 0) {
                        if (item.fatherId !== dogInfo.dogid && item.motherid !== dogInfo.dogid) {
                            html += `<div class="KittySelectModal-kitty myDogItem" data-key="${item.dogid}">
                                    <div class="KittyCard-wrapper">
                                        <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                                            <img class="KittyCard-image" src=${item.avatar} alt="Dog # ${item.dogid}">
                                            <div class="KittyCard-status">
                                                <!-- react-empty: 2075 -->
                                            </div>
                                        </div>
                                        <div class="KittyCard-details">
                                            <div class="KittyCard-subname">
                                                Dog # ${item.nickname} · 第${item.generation}代
                                            </div>
                                            ${coolDown(item)}
                                        </div>
                                    </div>
                                </div>`
                        } else {
                            html += ''
                        }
                    } else {
                        if (item.motherid === 0 || item.fatherId === 0) {
                            if (dogInfo.fatherId !== item.dogid && dogInfo.motherid !== item.dogid) {
                                html += `<div class="KittySelectModal-kitty myDogItem" data-key="${item.dogid}">
                                    <div class="KittyCard-wrapper">
                                        <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                                            <img class="KittyCard-image" src=${item.avatar} alt="Dog # ${item.dogid}">
                                            <div class="KittyCard-status">
                                                <!-- react-empty: 2075 -->
                                            </div>
                                        </div>
                                        <div class="KittyCard-details">
                                            <div class="KittyCard-subname">
                                                Dog # ${item.nickname} · 第${item.generation}代
                                            </div>
                                            ${coolDown(item)}
                                        </div>
                                    </div>
                                </div>`
                            } else {
                                html += ''
                            }
                        }
                    }
                } else {
                    html += `<div class="KittySelectModal-kitty myDogItem" data-key="${item.dogid}">
                                    <div class="KittyCard-wrapper">
                                        <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                                            <img class="KittyCard-image" src=${item.avatar} alt="Dog # ${item.dogid}">
                                            <div class="KittyCard-status">
                                                <!-- react-empty: 2075 -->
                                            </div>
                                        </div>
                                        <div class="KittyCard-details">
                                            <div class="KittyCard-subname">
                                                Dog # ${item.nickname} · 第${item.generation}代
                                            </div>
                                            ${coolDown(item)}
                                        </div>
                                    </div>
                                </div>`
                }
            }
        })
        return html
    }

    let selectedDog = (myDogInfo) => {
        return `<div class="SexyTime-card SexyTime-card--matron">
                     <div class="KittyCard-wrapper">
                         <div class="KittyCard u-bg-alt-strawberry KittyCard--responsive">
                            <img class="KittyCard-image" src=${myDogInfo.avatar} alt="dog # ${myDogInfo.dogid}">
                            <div class="KittyCard-status"></div>
                         </div>
                         <div class="KittyCard-details">
                             <div class="KittyCard-subname">
                                <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">dog # ${myDogInfo.nickname} · 第 ${myDogInfo.generation} 代</font></font>
                             </div>
                         </div>
                     </div>
                 </div>`
    }

    let mateButton = `<button class="Button Button--larger Button--love matingButton"><font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">好的，給他們壹些隱私</font>
                    </font>
                </button>`

    let myDogInfo = ''
    $('.kitty-sire .dogSelectModal').on('click', '.myDogItem', function (e) {
        if ($(this).hasClass('myDogItemForbidden')) {
            return false
        } else {
            // 获取我选择的狗信息
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: Url + 'user/getdoginfo',
                data: {dogid: $(this).attr('data-key')},
                success: function (data) {
                    if (parseInt(data.code) === 1) {
                        $('.Section .Hero-description').html(mateButton)
                        $('.kitty-sire .dogSelectModal').hide()
                        myDogInfo = data.obj

                        $('.SexyTime-card--matron').removeClass('SexyTime-card--empty')
                        $('.SexyTime-card--matron').html(selectedDog(myDogInfo))

                        // 獲取基因
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: Url + 'user/getmetinggene',
                            data: {
                                fatherid: myDogInfo.dogid,
                                motherid: getQueryString('id')
                            },

                            success: function (genedata) {
                                if (parseInt(genedata.code) === 1) {
                                    sessionStorage.setItem('geneData', JSON.stringify(genedata))
                                } else if (parseInt(genedata.code) === -2 || parseInt(genedata.code) === -1) {
                                    dogAlert('gene请求出现错误')
                                    return false
                                } else {
                                    dogAlert(genedata.msg)
                                    return false
                                }
                            }
                        })
                    } else if (parseInt(data.code) === -2 || parseInt(data.code) === -1) {
                        dogAlert('获取狗信息请求出现错误')
                        return false
                    }
                }
            })
        }
    })
    $('.kitty-sire .Transaction-item--transfer em').text(price(dogInfo))

    // 如果卖狗人有昵称则显示昵称 否则 获取卖狗人的 ID 后 5 位
    let salerName = dogInfo.accountPojo.nickname || dogInfo.owner.slice(-5)
    $('.kitty-sire .Transaction-item--to').text(salerName)

    $('.kitty-sire .SexyTime-name--sire strong').text(`Dog # ${dogInfo.nickname}`)

    $('.kitty-sire .buyDogImage img ').attr({
        src: dogInfo.avatar,
        alt: `Dog # ${dogInfo.nickname}`
    })

    $('.kitty-sire .KittyStatus-note em').text(price(dogInfo))

    $('.kitty-sire .KittyCard-subname em').text(`Dog # ${dogInfo.nickname} · 第 ${dogInfo.generation} 代 · ${parseFloat(dogInfo.metingtime / 3600) + ' 小時'}`)

    paging({
        pagination: '#pagination',
        type: 'POST',
        dataType: 'json',
        url: Url + 'user/getmydoglist',
        data: {
            sequence: '',
            filter: 1,
            pageSize: 10000,
            addr: addr
        },
        success: function (data) {
            if (data.code === 1) {
                $('.kitty-sire .KittySelectModal-grid').html(htmlTemps(data.marketlist))
            } else {
                $('.kitty-sire .KittySelectModal-grid').html('')
            }
        }
    })

    $selectMyDog.on('click', function () {
        $('.kitty-sire .dogSelectModal').show()
    })
    $modalClose.on('click', function () {
        $('.kitty-sire .dogSelectModal').hide()
    })

    // 弹框关闭
    $('.payModal .KittyTransferModal-close').off('click').on('click', function () {
        $('.payModal').hide()
    })

    // 交配发起
    $('.kitty-sire').on('click', '.matingButton', function (data) {
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
                    let total = parseFloat((parseFloat(price(dogInfo) * times) + parseFloat(0.04 * times)) / times).toFixed(5)
                    $('.payModal').show()
                    $('.payModal .myCountInfo .Addr').text(myAddr)
                    $('.payModal .myCountInfo .myBalance em').text(balance)
                    $('.payModal .sellerCount .salerCountName').text(salerName)
                    $('.payModal .sellerCount .salerAddr').text(salerAddr)
                    $('.payModal .fee .dogPrice').text(price(dogInfo))
                    $('.payModal .fee .totalPrice').text(total)

                    // 判断余额和总数大小
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

                        // 轮询请求余额
                        // let interval = ''
                        // clearInterval(interval)
                        // interval = setInterval(function () { balanceAjax(addr, true, price(dogInfo)) }, 5000)
                    }
                } else {
                    dogAlert('获取余额失败')
                    return false
                }
            }
        })
    })

    // 最终支付
    $('body').on('click', '.payModal .Section .finalPay', function () {
        let mateSign = ''

        let rechargesign = ''

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getservertime',
            data: {},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    let $password = $('.payPassword .passport')

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
                            $('.payModal .Section .finalPay').attr('disabled', true)
                            mateSign = JSON.stringify(ACT.actTransfer(bytes, dogInfo.owner, price(dogInfo) * 97500, '', transParams))
                            rechargesign = JSON.stringify(ACT.actTransfer(bytes, `ACTKfZkJWmqJ6WkJN77PPMCsAXyYD1WRrQQ1`, price(dogInfo) * 2500, '', transParams))
                        } else {
                            alert('密码错误，请重新输入')
                            $password.val('')
                            return false
                        }
                    }

                    let param = {
                        buyerdogid: myDogInfo.dogid,
                        sellerdogid: dogInfo.dogid,
                        buyerdogname: myDogInfo.nickname,
                        sellerdogname: dogInfo.nickname,
                        buyeraddr: addr,
                        selleraddr: dogInfo.owner,
                        paysign: mateSign,
                        feesign: rechargesign
                    }

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: Url + 'market/mating/bid',
                        data: param,
                        success: function (data) {
                            $('.payModal').hide()

                            if (parseInt(data.code) === 1) {
                                dogAlert('購買請求成功', function () {
                                    window.location.href = '../html/activity.html'
                                })
                                // alert('購買請求成功')
                            } else if (parseInt(data.code) === -5) {
                                dogAlert('很遺憾，這只小狗已被其他人搶單~')
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
                                dogAlert('很抱歉, 小狗已經不在孕育中~')
                                return false
                            } else if (parseInt(data.code) === -20) {
                                dogAlert('很抱歉, 您的小狗已經在孕育中~')
                                return false
                            } else {
                                $('.payModal .Section .finalPay').attr('disabled', false)
                                dogAlert(data.msg)
                                return false
                            }
                        }
                    })
                } else {
                    dogAlert('服务器时间请求出错')
                    return false
                }
            }
        })
    })
})
