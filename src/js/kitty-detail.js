import { Url, getQueryString, price, gene, timeLeft, transParams, svgChart, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    // sessionStorage.setItem('dogDetail', '')

    let data = {
        dogid: getQueryString('id')
    }
    const geneK = transParams.contractId.substr(0, 16)
    const pk = $.cookie('privateKey')
    const addr = $.cookie('actAddress')

    const sireButton = `<a class="Button Button--larger Button--buy" aria-current="false" href="../html/dog-sire.html?id=${data.dogid}">立即配對</a>`
    const buyButton = `<a class="Button Button--larger Button--buy" aria-current="false" href="../html/buy.html?id=${data.dogid}">立即購買</a>`
    const cancelSale = `<a class="Button Button--larger Button--buy cancelSaleButton" aria-current="false">取消售賣</a>`
    const cancelSire = `<a class="Button Button--larger Button--buy cancelSireButton" aria-current="false">取消孕育</a>`

    let saleIcon = (item) => {
        if (item.status === 1) {
            return `<div class="KittyStatus-item">
                        <span class="KittyStatus-itemIcon">
                            <i class="Icon Icon--tag"></i>
                        </span>
                        <span class="KittyStatus-itemText">售價<span class="KittyStatus-note"><small>Ξ</small><em class="price-now">${price(item) < 0 ? 0 + ' ACT' : price(item) + ' ACT'}</em></span></span>
                    </div>`
        } else if (item.status === 2) {
            return `<div class="KittyStatus-item">
                        <span class="KittyStatus-itemIcon">
                            <i class="Icon Icon--eggplant"></i>
                        </span>
                        <span class="KittyStatus-itemText">配對價<span class="KittyStatus-note"><small>Ξ</small><em class="price-now">${price(item) < 0 ? 0 + ' ACT' : price(item) + ' ACT'}</em></span></span>
                    </div>`
        } else {
            return ''
        }
    }

    // 彈框關閉
    $('.payModal .KittyTransferModal-close').off('click').on('click', function () {
        $('.payModal').hide()
    })

    // 獲取狗信息
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Url + 'user/getdoginfo',
        data: data,
        success: function (data) {
            if (parseInt(data.code) === 1) {
                sessionStorage.setItem('dogDetail', JSON.stringify(data.obj))
                const $priceNow = $('.price-now')
                const $KittyBannerImage = $('.KittyBanner-image')
                const $dogId = $('#dogId')
                const $generation = $('#generation')
                const $userName = $('#userName')
                const $leftTime = $('#leftTime')
                const $KittyHeaderOwnerImage = $('.KittyHeader-owner-image')
                const $ListAttributes = $('#ListAttributes')
                const $KittiesListItems = $('.KittiesList-items')
                const $actionButton = $('#actionButton')
                const $KittyStatusList = $('.KittyStatus--list')
                const $detailsCondition = $('.KittyHeader-details-condition')

                $KittyStatusList.html(saleIcon(data.obj))

                let priceArr = [parseFloat(data.obj.startprice / 100000), price(data.obj), parseFloat(data.obj.endprice) / 100000]

                $('.endPrice em').text(`Ξ  ${parseFloat(data.obj.endprice) / 100000}`)
                $('.startPrice em').text(`Ξ  ${parseFloat(data.obj.startprice / 100000)}`)

                const chartX = 710
                const chartY = 170

                const startPrice = priceArr[2]
                const curPrice = priceArr[1]
                const endPrice = priceArr[0]

                const curChartX = (curPrice - endPrice) * chartX / (startPrice - endPrice)
                const curChartY = (curPrice - endPrice) * chartY / (startPrice - endPrice)

                $('#svgChart').html(svgChart({
                    x: curChartX - 2,
                    y: curChartY + 3
                }))

                if (data.obj.owner === $.cookie('actAddress')) {
                    if (data.obj.status === 1 || data.obj.status === 3) {
                        $actionButton.html(cancelSale)
                    } else if (data.obj.status === 2 || data.obj.status === 4) {
                        $actionButton.html(cancelSire)
                    } else {
                        $actionButton.html('')
                    }
                } else if (data.obj.status === 2) {
                    $actionButton.html(sireButton)
                } else if (data.obj.status === 1) {
                    $actionButton.html(buyButton)
                } else {
                    $actionButton.html('')
                }

                // 如果賣狗人有昵稱則顯示昵稱 否則 獲取賣狗人的 ID 後 5 位
                let salerName = data.obj.accountPojo.nickname || '小狗收藏家'

                let headSrc = data.obj.accountPojo.avatar

                $detailsCondition.text('生育時間 ' + parseFloat(data.obj.metingtime / 3600) + ' 小時')

                $('.KittyHeader-owner-image img').attr('src', headSrc)

                const priceNum = (data.obj.status === 0 || data.obj.status === 3 || data.obj.status === 4) ? '暫不出售' : price(data.obj)
                $KittyBannerImage.attr({
                    alt: `Dog # ${data.obj.dogid}`,
                    src: data.obj.avatar
                })
                $userName.text(data.obj.owner === $.cookie('actAddress') ? (salerName + ' (妳)') : (salerName))

                $leftTime.text(timeLeft(data.obj.endtime))
                $KittyHeaderOwnerImage.text(data.obj.KittyHeaderOwnerImage)

                $generation.text(data.obj.generation)
                $dogId.text(data.obj.nickname)
                $priceNow.text(priceNum + ' ACT')

                // jie|mi方法
                let Decrypt = (word) => {
                    let key = CryptoJS.enc.Utf8.parse(geneK)

                    let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
                    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
                }

                // 獲取基因
                let attrStr = ''
                let attr = Decrypt(data.obj.gene) || []
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

                // 獲取父母
                let parentStr = ''
                if (data.obj.fatherId === 0 || data.obj.motherid === 0) {
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

                // $('body').on('click', ' .KittiesList-item .babyDogBirth', function () {
                //     dogAlert('请耐心等待小狗诞生')
                // })

                // 獲取子女
                let childrenStr = ''
                if ((data.childs && data.childs.length) === 0 || !data.childs) {
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

    // 最終支付
    $('body').on('click', '.payModal .Section .finalPay', function () {
        const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        if (dogInfo.status === 1 || dogInfo.status === 3) {
            cancelSaleAjax()
        } else if (dogInfo.status === 2 || dogInfo.status === 4) {
            cancelSireAjax()
        }
    })

    // 取消售賣單點擊後彈框
    $('.kitty-details').on('click', '.cancelSaleButton', function () {
        // const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: addr},
            success: function (data) {
                $('.payModal .fee .gasPrice').text(0)
                if (parseInt(data.code) === 1) {
                    let balance = parseInt(data.obj) / 100000 || 0
                    let myAddr = 'ACT******' + addr.slice(-5)
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
                        $('.chargeSiteSection').show()
                        $('.tips').show()

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

    // 取消孕育單
    $('.kitty-details').on('click', '.cancelSireButton', function () {
        // const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/getuserbalance',
            data: {addr: addr},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $('.payModal .fee .gasPrice').text(0)
                    let balance = parseInt(data.obj) / 100000
                    let myAddr = 'ACT******' + addr.slice(-5)
                    let salerAddr = 'ACT******'
                    let salerName = 'ACT幣商'
                    let total = 0
                    $('.payModal').show()
                    $('.payModal .myCountInfo .Addr').text(myAddr)
                    $('.payModal .myCountInfo .myBalance').text(balance)
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
                        $('.recharge').show()
                        $('.chargeSiteSection').show()
                        $('.tips').show()

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
    // 取消狗銷售單請求
    let cancelSaleAjax = (item) => {
        let $password = $('.payPassword .passport')

        let cancelSaleSign = ''

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
                // cancelSaleSign = JSON.stringify(ACT.callContract(bytes, 'cancelAuction', `${getQueryString('id')}`, transParams))
                $('.payModal .Section .finalPay').attr('disabled', true)
                cancelSaleSign = CryptoJS.AES.decrypt($.cookie('signJson'), addr).toString(CryptoJS.enc.Utf8)
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        let data = {
            dogid: dogInfo.dogid,
            nickname: dogInfo.nickname,
            signjson: cancelSaleSign
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/auction/cancel',
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
                    dogAlert('訂單正在處理，請勿重複提交~', function () {
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
    }

    // 取消狗孕育單請求
    let cancelSireAjax = (item) => {
        let $password = $('.payPassword .passport')

        let cancelSireSign = ''

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
                cancelSireSign = CryptoJS.AES.decrypt($.cookie('signJson'), addr).toString(CryptoJS.enc.Utf8)
            } else {
                alert('密码错误，请重新输入')
                $password.val('')
                return false
            }
        }

        // 取消狗孕育單簽名
        const dogInfo = JSON.parse(sessionStorage.getItem('dogDetail'))
        let data = {
            dogid: dogInfo.dogid,
            nickname: dogInfo.nickname,
            signjson: cancelSireSign
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/mating/cancel',
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
                    dogAlert('訂單正在處理，請勿重複提交~', function () {
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
            },
            error: function () {
                dogAlert('請求錯誤!')
                return false
            }
        })
    }
})
