import { Url, getQueryString, gene, transParams, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

const pk = $.cookie('privateKey')
const addr = $.cookie('actAddress')

$(function () {
    sessionStorage.setItem('dogDetail', '')

    const geneK = transParams.contractId.substr(0, 16)

    let dataId = {
        dogid: getQueryString('id')
    }

    $.ajax({
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
                let count = 0
                data.marketlist.map((item, index) => {
                    if (item.status !== 0) {
                        count++
                    }
                })
                if (count >= 5) {
                    $('.KittyHeader-actions').html('挂單總數不能超過 5 單！')
                }
            } else {
                dogAlert('個人狗列表請求出錯')
            }
        }
    })

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: Url + 'user/getdoginfo',
        data: dataId,
        success: function (data) {
            if (parseInt(data.code) === 1) {
                if (data.obj.owner !== addr) {
                    window.location.href = '../html/marketplace.html'
                    return false
                }

                $('.sireButton a').attr('href', `../html/my-dog-sire.html?id=${dataId.dogid}`)
                $('.sellButton a').attr('href', `../html/my-dog-sell.html?id=${dataId.dogid}`)

                let info = data.obj
                sessionStorage.setItem('dogDetail', JSON.stringify(info))

                if (info.cooldownendtime >= Date.parse(new Date())) {
                    $('.KittyHeader-actions').html('生育中，暫時不能進行任何操作！')
                }

                const $ListAttributes = $('#ListAttributes')
                const $KittiesListItems = $('.KittiesList-items')
                const $detailsCondition = $('.KittyHeader-details-condition')

                $detailsCondition.text('生育時間 ' + parseFloat(data.obj.metingtime / 3600) + ' 小時')

                $('.KittyHeader-name-text em').text(info.nickname)
                $('.KittyHeader-details-generation span em').text(`第 ${info.generation} 代`)
                $('.dogid em').text(`dog # ${info.dogid}`)
                let img = `<img class="KittyBanner-image" src=${info.avatar} alt="dog # ${info.dogid}">`
                $('.KittyBanner-container .active').html(img)

                let headSrc = data.obj.accountPojo.avatar

                $('.KittyHeader-owner-image img').attr('src', headSrc)

                // jie|mi方法
                let Decrypt = (word) => {
                    let key = CryptoJS.enc.Utf8.parse(geneK)
                    let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
                    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
                }

                // 獲取基因
                let attrStr = ''
                let attr = Decrypt(info.gene) || []
                if (attr.length === 0) {
                    attrStr += ''
                } else {
                    $('.geneDiv').addClass('active')
                    JSON.parse(Decrypt(data.obj.gene)).l.map((item, index) => {
                        let geneStr = gene[item] || `${item}`
                        let geneArr = geneStr.split(' ')
                        attrStr += `<a class="ListAttributes-item ListAttributes-item--color" aria-current="false" style="background-color: ${geneArr.length > 1 ? geneArr[1] : '#fff'}">
                                        <font style="vertical-align: inherit;">
                                            <font style="vertical-align: inherit;"> ${geneArr.length > 1 ? geneArr[0] : item} </font>
                                        </font>
                                    </a>`
                    })
                }
                $ListAttributes.html(attrStr)

                // 獲取狗父母
                let parentStr = ''
                if (info.fatherId === 0 || info.motherid === 0) {
                    $('.dogParents').hide()
                } else {
                    $('.parentsDiv').addClass('active')
                    let parents = []
                    parents.push(data.farther)
                    parents.push(data.mother)
                    parents.map((item, index) => {
                        parentStr += `<div class="KittiesList-item">
                                            <a aria-current="false" href="../html/dog-detail.html?id=${item.dogid}">
                                                <div class="KittyCard-wrapper">
                                                    <div class="KittyCard u-bg-alt-mintgreen KittyCard--thumbnail">
                                                        <img class="KittyCard-image" src="${item.avatar}" alt="Dog # ${item.dogid}"/>
                                                        <div class="KittyCard-status">
                                                        </div>
                                                    </div>
                                                    <div class="KittyCard-details">
                                                        <div class="KittyCard-subname">
                                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Dog # ${item.nickname} · 第 ${item.generation} 代</font>
                                                            </font>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`
                    })
                }
                $KittiesListItems.html(parentStr)

                // 獲取子女
                let childrenStr = ''
                if ((data.childs && data.childs.length === 0) || !data.childs) {
                    $('.childrenDiv').hide()
                } else {
                    $('.childrenDiv').addClass('active')
                    data.childs.map((item, index) => {
                        if (item.birthtime > Date.parse(new Date())) {
                            childrenStr += `<div class="KittiesList-item">
                                             <a aria-current="false" class="babyDogBirth">
                                                <div class="KittyCard-wrapper">
                                                    <div class="KittyCard u-bg-alt-mintgreen KittyCard--thumbnail">
                                                        <img class="KittyCard-image" src="../images/icons/babyDog.svg" alt="Dog # ${item.dogid}"/>
                                                        <div class="KittyCard-status">
                                                        </div>
                                                    </div>
                                                    <div class="KittyCard-details">
                                                        <div class="KittyCard-subname">
                                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Dog # ${item.nickname} · 第 ${item.generation} 代</font>
                                                            </font>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`
                        } else {
                            childrenStr += `<div class="KittiesList-item">
                                             <a aria-current="false" href="../html/dog-detail.html?id=${item.dogid}">
                                                <div class="KittyCard-wrapper">
                                                    <div class="KittyCard u-bg-alt-mintgreen KittyCard--thumbnail">
                                                        <img class="KittyCard-image" src="${item.avatar}" alt="Dog # ${item.dogid}"/>
                                                        <div class="KittyCard-status">
                                                        </div>
                                                    </div>
                                                    <div class="KittyCard-details">
                                                        <div class="KittyCard-subname">
                                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Dog # ${item.nickname} · 第 ${item.generation} 代</font>
                                                            </font>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`
                        }
                    })
                }
                if (childrenStr === '') {
                    $('.childrenDiv').hide()
                } else {
                    $('#childrenList').html(childrenStr)
                }
            } else if (parseInt(data.code) === -2 || parseInt(data.code) === -1) {
                dogAlert('請求出現錯誤')
                return false
            }
        }
    })

    $('.giftButton').click(function () {
        $('.giftModal').show()
    })

    $('.giftModal .KittyTransferModal-close').click(function () {
        $('.giftModal').hide()
    })

    let $giftButton = $('.Section button')
    $('.giftModal #to').on('input', function () {
        if ($('#to').val().trim() !== '') {
            $giftButton.removeClass('Button--disabled')
            $giftButton.attr('disabled', false)
        } else {
            $giftButton.addClass('Button--disabled')
            $giftButton.attr('disabled', true)
        }
    })

    // 支付彈框關閉
    $('.payModal .KittyTransferModal-close').off('click').on('click', function () {
        $('.payModal').hide()
    })

    // 最終支付
    $('body').on('click', '.payModal .Section .finalPay', function () {
        let friendAddr = $('.giftModal #to').val()

        let $password = $('.payPassword .passport')

        let giftSign = ''

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
                giftSign = CryptoJS.AES.decrypt($.cookie('signJson'), addr).toString(CryptoJS.enc.Utf8)
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        let obj = {
            dogid: getQueryString('id'),
            nickname: JSON.parse(sessionStorage.getItem('dogDetail')).nickname,
            signjson: giftSign,
            addr: friendAddr
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/dog/gift',
            data: obj,
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

    // 贈送請求
    $giftButton.click(function () {
        // 彈出支付框
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: addr},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.payModal .fee .gasPrice').text(0)
                    let balance = parseInt(data.obj) / 100000 || 0
                    let myAddr = 'ACT******' + addr.slice(-5)
                    // let salerAddr = 'ACT******' + dogInfo.owner.slice(-5)
                    let salerAddr = 'ACT******'
                    let total = 0
                    let salerName = 'ACT******'

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
                        // interval = setInterval(function () { balanceAjax(addr, false) }, 5000)
                    }
                } else {
                    dogAlert('獲取余額失敗')
                    return false
                }
            }
        })
    })
})
