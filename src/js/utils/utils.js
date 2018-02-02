
// let Url = 'http://192.168.68.5:8084/lk-blockchain-dog/'
// let Url = 'http://192.168.68.6:8081/lk-blockchain-dog/'
// let Url = 'http://192.168.68.4:8084/lk-blockchain-dog/'
// let Url = 'https://rest.acdog.hk/lk-blockchain-dog/' // 正式
// let Url = 'http://47.52.198.203:8395/lk-blockchain-dog/' // 测试
// let Url = 'http://192.168.84.27:8084/lk-blockchain-dog/' // 简
// let Url = 'http://192.168.90.245:8081/lk-blockchain-dog/' // 拓
// let Url = 'http://192.168.67.22:9080/lk-blockchain-dog/' // 馮
// let Url = 'http://127.0.0.1:9080/lk-blockchain-dog/' // 馮
let Url = 'http://192.168.0.164:8080/lk-blockchain-dog/' // 馮

/**
 * HTML：<div id="pagination"></div>
 * JS：paging({
            pagination: '#pagination',
            type: 'POST',
            dataType: 'json',
            url: Url + 'market/getorderlist',
            data: {
                sequence: '',
                filter: 1,
                pageSize: 12
            },
            success: function (data) {
                console.log(data)
            }
        })
 */

// 合約參數
const transParams = {
    transactionFee: 1000,
    maxCallContractCost: 5000,
    // contractId: 'CONFA2si9J1sjeQT7inqZjv99DWZ9iSbS2oL', // 正式
    contractId: 'CON6M4vHpgmnuF6KJcYsXBoHgh5dvhgKf9Gp', // 测试
    // chainId: '6a1cb528f6e797e58913bff7a45cdd4709be75114ccd1ccb0e611b808f4d1b75' // 正式
    chainId: '5260ca3470af412ea1dc9fd647903901b9adb4d618effec8f4f9479eaa0c9c69' // 测试
}

const paging = (obj) => {
    const $pagination = $(obj.pagination)
    getData(obj.data.currentPage || 1)

    $(document).off('click').on('click', '.Pagination button', function () {
        const pageNum = parseInt($(this).data('page'))
        const pageCount = parseInt($(this).data('count'))
        if (pageNum !== 0 && pageNum !== pageCount + 1) {
            getData(pageNum)
        }
        return false
    })

    function getData (pageNum) {
        $('#pagingLoader').show()
        $.ajax({
            type: obj.type,
            dataType: obj.dataType,
            url: obj.url,
            data: Object.assign(obj.data, {currentPage: pageNum}),
            success: function (data) {
                obj.success.call(this, data)
                pagingNum(data)
            },
            error: function () {
                $('#pagingLoader').hide()
            }
        })
    }

    function pagingNum (data) {
        let pageShowNum = 10
        let pageShowNumHalf = pageShowNum / 2

        let pageStr = `<div class="Pagination">`
        let paginationPages = `<div class="Pagination-pages">`
        let paginationPrevNext = `<div>`

        let forStartNum = 1
        if (data.pagecount > pageShowNum) {
            if (data.curpage > pageShowNumHalf) {
                forStartNum = data.curpage - pageShowNumHalf
            }

            if (data.curpage > data.pagecount - pageShowNum) {
                forStartNum = data.pagecount - pageShowNum + 1
            }
        } else {
            pageShowNum = data.pagecount
        }

        for (let i = forStartNum; i < forStartNum + pageShowNum; i++) {
            const currentPage = data.curpage === i ? 'Pagination-page--active' : ''
            paginationPages += `<button class="Pagination-page ${currentPage}" data-page="${i}" data-count="${data.pagecount}">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">${i}</font>
                        </font>
                    </button>`
        }
        paginationPages += `</div>`

        const prevPage = data.curpage === 1 ? 'Pagination-button--disabled' : ''
        const nextPage = data.curpage === data.pagecount ? 'Pagination-button--disabled' : ''
        paginationPrevNext += data.pagecount === 0 ? '' : `<button class="Pagination-button ${prevPage}" data-page="${data.curpage - 1}" data-count="${data.pagecount}">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">上壹頁</font>
                        </font>
                    </button>
                    <button class="Pagination-button ${nextPage}" data-page="${data.curpage + 1}" data-count="${data.pagecount}">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">下壹頁</font>
                        </font>
                    </button>`
        paginationPrevNext += `</div>`

        pageStr += paginationPages + paginationPrevNext + `<div class="paging-loader" id="pagingLoader"><img src="../images/icons/loading.svg"/></div></div>`
        $pagination.html(pageStr)
    }
}

const add0 = (m) => { return m < 10 ? '0' + m : m }

const format = (timeStamp) => {
    let time = new Date(timeStamp)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mm = time.getMinutes()
    let s = time.getSeconds()
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

/**
 * 獲取地址參數
 * JS：getQueryString('name')
 */
const getQueryString = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

/**
 * 計算價格
 * JS：price(obj)
 */
const price = (item) => {
    // 倍率
    let times = Math.pow(10, 5)

    // 結束時間 / 開始時間 / 結束價格 / 開始價格 / 現在時間
    let ET = item.endtime
    let BT = item.begintime
    let EP = item.endprice / times
    let SP = item.startprice / times
    let NT = item.servertime
    // 價格計算公式 並保存成 5 位小數
    return parseFloat((parseInt(SP * times) + parseInt((EP - SP) * (NT - BT) / (ET - BT) * times)) / times).toFixed(5)
}

const gene = {
    '1': '聖誕使者 #ffbebe',
    '2': '創世眾 #ffbebe',
    '3': '螺旋迷宮 #ffeec0',
    '4': '精白 #ffeec0',
    '5': '茜色 #ffeec0',
    '6': '獒 #ffd9fe',
    '7': '困倦 #ffd9fe',
    '8': '開心的 #ffd9fe',
    '9': '折線 #ffd9fe',
    '10': '破碎大陸 #ffd9fe',
    '11': '彤 #ffd9fe',
    '12': '秋田 #c0e1ff',
    '13': '薩摩耶 #c0e1ff',
    '14': '專注 #c0e1ff',
    '15': '疑惑 #c0e1ff',
    '16': '高興的 #c0e1ff',
    '17': '調皮的 #c0e1ff',
    '18': '蓬鬆 #c0e1ff',
    '19': '昏黃 #c0e1ff',
    '20': '薑黃 #c0e1ff',
    '21': '碧藍 #c0e1ff',
    '22': '鴨黃 #c0e1ff',
    '23': '馬里努阿 #ccf6d3',
    '24': '喜樂蒂 #ccf6d3',
    '25': '無謂 #ccf6d3',
    '26': '眩暈 #ccf6d3',
    '27': '自信的 #ccf6d3',
    '28': '饞的 #ccf6d3',
    '29': '迷你 #ccf6d3',
    '30': '細長 #ccf6d3',
    '31': '獵虎 #ccf6d3',
    '32': '酡顏 #ccf6d3',
    '33': '月白 #ccf6d3',
    '34': '草綠 #ccf6d3',
    '35': '石青 #ccf6d3',
    '36': '青蓮 #ccf6d3',
    '37': '紫 #ccf6d3',
    '38': '洋紅 #ccf6d3',
    '39': '青翠 #ccf6d3',
    '40': '阿拉斯加 #f9f8f6',
    '41': '梗 #f9f8f6',
    '42': '混亂 #f9f8f6',
    '43': '盯 #f9f8f6',
    '44': '不知所措 #f9f8f6',
    '45': '呆滯的 #f9f8f6',
    '46': '小心的 #f9f8f6',
    '47': '嚴肅的 #f9f8f6',
    '48': '尖尾 #f9f8f6',
    '49': '粗曲線 #f9f8f6',
    '50': '曲線 #f9f8f6',
    '51': '楓葉 #f9f8f6',
    '52': '魚肚白 #f9f8f6',
    '53': '水紅 #f9f8f6',
    '54': '墨色 #f9f8f6',
    '55': '霜色 #f9f8f6',
    '56': '縞 #f9f8f6',
    '57': '灰 #f9f8f6',
    '58': '黎 #f9f8f6',
    '59': '赭 #f9f8f6',
    '60': '寶藍 #f9f8f6',
    '61': '品紅 #f9f8f6',
    '62': '松花 #f9f8f6',
    '63': '聖誕使者 #ffbebe',
    '64': '創世眾 #ffbebe',
    '65': '創世神 #ffbebe',
    '66': '創世神 #ffbebe',
    '67': '2018 #ffbebe'
}

// 計算剩余時間
const timeLeft = (endTime) => {
    if (endTime === 0 || !endTime) {
        return '暫無'
    } else {
        let leftTime = endTime - Date.parse(new Date())
        let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10)
        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10)
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10)
        // let seconds = parseInt(leftTime / 1000 % 60, 10)
        if (days >= 1) {
            return days + ' 天'
        } else if (hours >= 1) {
            return hours + ' 小時'
        } else if (minutes >= 1) {
            return minutes + ' 分鐘'
        } else if (minutes >= 0) {
            return '即將結束'
        } else {
            return '暫無'
        }
    }
}

// 余額不足時輪詢余額
// 請求余額
const balanceAjax = (addr, toOther, dogPrice) => {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Url + 'user/getuserbalance',
        data: {addr: addr},
        success: function (data) {
            if (parseInt(data.code) === 1) {
                let balance = parseInt(data.obj) / 100000
                let times = Math.pow(10, 5)
                let getDogPrice = toOther ? parseFloat(dogPrice * times) : 0
                let total = parseFloat((parseFloat(getDogPrice) + parseFloat($('.payModal .fee .gasPrice').text() * times)) / times)

                $('.payModal .myCountInfo .myBalance em').text(balance)

                // 判斷余額和總數大小
                if (balance > total) {
                    $('.finalPay').removeClass('Button--disabled')
                    $('.recharge').hide()
                    $('.tips').hide()
                }
            } else {
                dogAlert('獲取余額失敗')
                return false
            }
        }
    })
}

// 獲取狗信息
const getDogInfo = (id, fn) => {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Url + '/user/getdoginfo',
        data: {dogid: id},
        success: function (data) {
            if (parseInt(data.code) === 1) {
                fn(data.obj)
            } else {
                dogAlert('獲取狗信息失敗')
                return false
            }
        }
    })
    return fn
}

// 生成 svg 價格趨勢表
const svgChart = (obj) => {
    return `<svg class="AuctionGraph-chart" viewBox="0 0 720 180">
                        <defs>
                            <linearGradient id="grad" x2="0" y2="1">
                                <stop offset="0" stop-color="#f5eae2" stop-opacity="0.4"></stop>
                                <stop offset="1" stop-color="#fff"></stop>
                            </linearGradient>
                        </defs>
                        <polygon points="5,5 6.102480439814815,5.173732326388887 715,175 715,175 5,175 5,5"
                                 fill="url(#grad)"></polygon>
                        <rect x="5" y="5" width="710" height="170" fill="none" stroke="#f5eae2" stroke-width="2"></rect>
                        <line x1="241.66666666666666" x2="241.66666666666666" y1="5" y2="175" stroke="#f5eae2"
                              stroke-width="2"></line>
                        <line x1="478.3333333333333" x2="478.3333333333333" y1="5" y2="175" stroke="#f5eae2"
                              stroke-width="2"></line>
                        <line x1="5" x2="6.102480439814815" y1="5" y2="5.173732326388887" stroke="#ff9b6a"
                              stroke-width="2"></line>
                        <line x1="6.102480439814815" x2="715" y1="5.173732326388887" y2="175" stroke="#f5eae2"
                              stroke-width="2"></line>
                        <circle cx="715" cy="175" r="5" fill="#f5eae2"></circle>
                        <circle cx="${obj.x || 0}" cy="${obj.y || 0}" r="5" fill="#ff9b6a"></circle>
                        <circle cx="5" cy="5" r="5" fill="#ff9b6a"></circle>
                    </svg>`
}

const checkEmail = (email) => {
    const myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
    if (myReg.test(email)) {
        return true
    } else {
        return false
    }
}

// 弹框
const dogAlert = (content, fn) => {
    const htmlStr = `<div class="Modal alertModal" id="alertModal">
        <div class="Modal-content">
            <div class="KittyTransferModal">
                <div class="Section alertContent">
                    <span>${content}</span>
                </div>
                <div class="Section">
                    <button class="alertConfirm Button">
                        <em>確定</em>
                    </button>
                </div>
            </div>
        </div>
    </div>`

    if ($('#alertModal').length === 0) {
        $('body').append(htmlStr)
    }

    $('.alertConfirm').click(function () {
        if (fn) {
            fn()
        }
        $('#alertModal').remove()
        return false
    })
}

// 浏览器提醒
const userAgent = window.navigator.userAgent.toLowerCase()
const isPc = () => {
    const Agents = ['android', 'iphone', 'ipad', 'ipod', 'windows phone']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
        if (userAgent.indexOf(Agents[i]) > 0) {
            flag = false
            break
        }
    }
    return flag
}

const browserTips = () => {
    window.onload = function () {
        let styleSheet = 'body,div,p,a,h1,h3{margin:0;padding:0;}' +
            'a{text-decoration:none;cursor:pointer}' +
            'html,body{height:100%}' +
            '.browser-tips-mask{position:fixed;left:0;top:0;background:url("../images/black-bg.png");height:100%;width:100%;z-index:9998;}' +
            '.browser-tips{margin-left:-300px;position:fixed;left:50%;top:200px;background:#fff;border-radius:5px;height:450px;width:600px;color:#454545;z-index:9999;}' +
            '.browser-tips a.browser-tips-close{position:absolute;right:5px;top:5px;background:url("../images/close-btn.png") no-repeat center;height:32px;width:32px;cursor:pointer;}' +
            '.browser-tips h1{margin:75px auto 50px;display:block;width:460px;color:#ba5750;font-size:36px;text-align:center;}' +
            '.browser-tips h3{margin:20px auto 0;width:460px;color:#764b45;font-size:16px;line-height:46px;}' +
            '.browser-tips p{margin:50px auto 0;width:600px;text-align:center;}' +
            '.browser-tips p a{margin:0 10px;display:inline-block;height:51px;width:200px;color:#b74c44;font-size:16px;line-height:51px;text-align:center;}' +
            '.browser-tips p a:hover{color:#0050b5}'

        loadStyleString(styleSheet)

        if (isPc() && userAgent.toLowerCase().indexOf('chrome') === -1 && userAgent.toLowerCase().indexOf('safari') === -1) {
            createEle()

            // IE7及以下
            let ieVersion = parseInt(userAgent.match(/msie\s\d+/)[0].match(/\d+/)[0] || userAgent.match(/trident\s?\d+/)[0])
            if (ieVersion <= 7) {
                document.body.innerHTML = '<div class="browser-tips-mask" id="browserTipsMask">' +
                    '<div class="browser-tips" id="browserTips">' +
                    '<a class="browser-tips-close" id="browserTipsClose"></a>' +
                    '<h1>浏览器提醒</h1>' +
                    '<h3>为了获得更好的用户体验，推荐使用Chrome浏览器，请下载。</h3>' +
                    '<p>' +
                    '<a href="http://rj.baidu.com/soft/detail/14744.html?ald&qq-pf-to=pcqq.group">Chrome for Windows</a>' +
                    '<a href="http://rj.baidu.com/soft/detail/25718.html">Chrome for Mac</a>' +
                    '</p></div></div>'
            }
        }
    }

    // 关闭
    $('body').on('click', '#browserTipsClose', function () {
        document.getElementById('browserTipsMask').style.display = 'none'
        document.getElementById('browserTips').style.display = 'none'
    })

    function createEle () {
        let body = document.body

        let mask = document.createElement('div')
        mask.setAttribute('class', 'browser-tips-mask')
        mask.setAttribute('id', 'browserTipsMask')
        body.appendChild(mask)

        let tips = document.createElement('div')
        tips.setAttribute('class', 'browser-tips')
        tips.setAttribute('id', 'browserTips')
        body.appendChild(tips)

        let close = document.createElement('a')
        close.setAttribute('class', 'browser-tips-close')
        close.setAttribute('id', 'browserTipsClose')
        tips.appendChild(close)

        let h1 = document.createElement('h1')
        h1.innerText = '浏览器提醒'
        tips.appendChild(h1)

        let h3 = document.createElement('h3')
        h3.innerText = '为了获得更好的用户体验，推荐使用Chrome浏览器，请下载。'
        tips.appendChild(h3)

        let p = document.createElement('p')
        tips.appendChild(p)

        createA('http://rj.baidu.com/soft/detail/14744.html?ald&qq-pf-to=pcqq.group', 'Chrome for Windows')
        createA('http://rj.baidu.com/soft/detail/25718.html', 'Chrome for Mac')

        function createA (href, text) {
            let a = document.createElement('a')
            a.setAttribute('href', href)
            a.setAttribute('target', '_blank')
            a.innerText = text
            p.appendChild(a)
        }
    }

    function loadStyleString (css) {
        let style = document.createElement('style')
        style.type = 'text/css'
        try {
            style.appendChild(document.createTextNode(css))
        } catch (ex) {
            style.styleSheet.cssText = css
        }
        let head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
    }
}

/* const data = [
 {
 info: '第二条弹aafsdfas幕',
 href: 'http://www.yaseng.org

 ',
 color: '#ffd334',
 bottom: 0
 }, {
 info: '第二条afasdf弹幕',
 href: 'http://www.yaseng.org

 ',
 color: '#ffd334',
 bottom: 10
 }, {
 info: '第二fhjfghjfg条弹幕',
 href: 'http://www.yaseng.org

 ',
 color: '#ffd334',
 bottom: 20
 }
 ]

 // 每条弹幕发送间隔
 let looperTime = 3 * 1000
 let items = data
 // 弹幕总数
 let total = data.length
 // 是否首次执行
 let runOnce = true
 // 弹幕索引
 let index = 0
 // 先执行一次
 barrager()
 // 定时器
 let looper

 function barrager () {
 if (runOnce) {
 // 如果是首次执行,则设置一个定时器,并且把首次执行置为false
 looper = setInterval(barrager, looperTime)
 runOnce = false
 }
 // 发布一个弹幕
 $('body').barrager(items[index])
 // 索引自增
 index++
 // 所有弹幕发布完毕，清除计时器。
 if (index === total) {
 console.log('aaa')
 clearInterval(looper)
 return false
 }
 } */

export {
    Url,
    gene,
    transParams,
    paging,
    getQueryString,
    format,
    price,
    timeLeft,
    balanceAjax,
    getDogInfo,
    svgChart,
    checkEmail,
    dogAlert,
    browserTips
}
