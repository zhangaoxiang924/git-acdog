/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import {browserTips} from './utils/utils'
import JsSHA from 'jssha'
import { base58 } from '../js-not-lint/bs58'
import { Buffer } from 'buffer'
import eccrypto from 'eccrypto'

$(function () {
    function loginOrNot () {
        if ($.cookie('actAddress')) {
            $('.hasLogin').addClass('active')
            $('.notLogin').removeClass('active')
        } else {
            $('.hasLogin').removeClass('active')
            $('.notLogin').addClass('active')
        }
    }
    loginOrNot()

    $('.beginButton').attr('href', !$.cookie('actAddress') ? '../html/login.html' : '../html/marketplace.html')

    browserTips()
})

// callSign 方法加密后生成签名,暴露给 window 对象
function SHA (hashType, data) {
    let shaObj = new JsSHA('SHA-' + hashType, 'HEX')
    shaObj.update(data)
    return shaObj.getHash('HEX')
}

window.callSign = function (msg, privateKey, fn) {
    let baText = Buffer.from(msg, 'utf-8')
    msg = Buffer.from(SHA('256', baText.toString('hex')), 'hex')
    eccrypto.sign(base58.decode(privateKey).slice(1, 33), msg).then(function (sig) {
        fn(sig.toString('hex'))
    })
}
