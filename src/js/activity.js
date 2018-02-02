import { Url, format, dogAlert } from './utils/utils'

$(function () {
    if (!$.cookie('actAddress')) {
        window.location.href = '../html/login.html'
        return false
    }
    const address = $.cookie('actAddress')
    const data = {
        addr: address
    }

    // 取消操作button
    const cancelTip = `<span class="Activity-action-content">處理失敗<img src="../images/icons/cancel.svg" /></span>`

    // 操作成功button
    const successTip = `<span class="Activity-action-content">處理成功<img src="../images/icons/confirm.svg" /></span>`

    // 操作正在處理
    const processing = `<span class="Activity-action-content Announcement-icon">處理中...<img class="u-spin u-spin--slow" src="../images/icons/clock.svg"></span>`

    // 刪除按鈕
    const removeHtml = `<div class="Activity-remove" role="button">
                            <svg class="Activity-remove-image" width="8" height="8" viewbox="0 0 14 14">
                                <path d="M1 13L13 1M13 13L1 1" fill="none" stroke-width="2"></path>
                            </svg>
                        </div>`

    // 沒有信息
    let noActivity = `<div class="ActivityPage-noActivity">
                        <h2 class="ActivityPage-noActivity-heading">
                            <font style="vertical-align: inherit;">
                                <font style="vertical-align: inherit;">還沒有交易信息</font>
                            </font>
                        </h2>
                        <a class="Button Button--larger u-margin-right-xs" aria-current="false" href="../html/marketplace.html"><font style="vertical-align: inherit;">
                                <font style="vertical-align: inherit;">瀏覽小狗</font>
                            </font>
                        </a>
                        <a class="Button Button--larger" aria-current="false" href="../html/faq.html">
                            <font style="vertical-align: inherit;">
                                <font style="vertical-align: inherit;">查閱常見問題</font>
                            </font>
                        </a>
                    </div>`

    // 根據返回的狀態 顯示引起這種狀態的原因
    let messageHtml = (status, message) => {
        let msg = ''
        switch (status) {
            case 0:
                msg = `交易正在處理中，請耐心等待。`
                break
            case 1:
                msg = `交易成功了，恭喜您。`
                break
            case 4:
                msg = `很抱歉，交易出現問題，${message === 'Refund Success!' ? '交易失败，ACT 已退还到账户余额！' : (!message ? '交易失敗，ACT 將會暫存在合約中，您可以在這當的時候取出。' : '失敗原因：' + message)}`
                break
            default:
                msg = `交易正在處理中，請耐心等待。`
                break
        }
        return msg
    }

    // 不同操作返回的描述內容
    const descHtml = (item) => {
        let html = ''
        switch (item.method) {
            case 'bid_dog':
                html = `<div class="Activity-details-text">
                                    妳購買了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    ，${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'breed_dog':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的生育單。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'add_mating':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的孕育單。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'cancel_mating':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的取消孕育請求。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'sell_dog':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的出售單。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'add_auction':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的出售單。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'cancel_auction':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}">${item.param2}</a>
                                    的取消售賣請求。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'bid_mating':
                html = `<div class="Activity-details-text">
                                    妳發起了
                                    <a aria-current="false" href="../html/my-dog-detail.html?id=${item.param2.split(',')[0]}">${item.param2.split(',')[1]}</a>
                                    的繁殖單。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'gift_dog':
                html = `<div class="Activity-details-text">
                                    妳發起了小狗
                                    <a aria-current="false" href="../html/dog-detail.html?id=${item.param1}"> ${item.param2}</a>
                                    的贈送操作。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'act_transfer':
                html = `<div class="Activity-details-text">
                                    妳發起了取出錢包中余額的操作。${messageHtml(item.status, item.message)}
                                </div>`
                break
            case 'draw_contract_balance':
                html = `<div class="Activity-details-text">
                                    妳發起了取出合約中余額的操作。${messageHtml(item.status, item.message)}
                                </div>`
                break
            default:
                html = `<div class="Activity-details-text">
                                    正在拉取操作詳情, 請耐心等待。
                                </div>`
                break
        }
        return html
    }

    //
    const innerHtml = (item, crateTime) => {
        return `<div class="Activity Activity--buy">
                        ${' ' || removeHtml}
                        <div class="Activity-info">
                            <img class="Activity-info-image" src="../images/notification-sire.svg" />
                            <div class="Activity-details">
                                <div class="Activity-details-date">
                                    ${format(crateTime)}
                                </div>
                                ${descHtml(item)}
                            </div>
                        </div>
                        <div class="Activity-action">
                            <a class="Button" href="#" target="_blank" rel="noopener noreferrer">
                                ${item.status === 1 ? successTip : (item.status === 0 ? processing : cancelTip)}
                            </a>
                        </div>
                    </div>`
    }

    let ajax = () => {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'user/gettrixlist',
            data: data,
            success: function (data) {
                let obj = data.obj
                let html = ''
                if (parseInt(data.code) === 1) {
                    if (obj.length === 0) {
                        html = noActivity
                    } else {
                        html = obj.map((item) => {
                            return innerHtml(item, item.createtime)
                        })
                    }
                    $('.activity .ActivityPage-section').html(html)
                } else {
                    dogAlert(data.msg)
                    return false
                }
            }
        })
    }

    ajax()

    let interval = ''
    clearInterval(interval)
    interval = setInterval(ajax, 6000)
})
