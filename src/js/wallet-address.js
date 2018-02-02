/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import {dogAlert} from '../js/utils/utils'
// import CryptoJS from 'crypto-js'

$(function () {
    let prevUrl = document.referrer
    if (!!$.cookie('actAddress') && (prevUrl.indexOf('auxiliary-word') === -1)) {
        $('.Button, .confirmDiv, .pkSection').remove()
    }

    $('#confirmButton').change(function () {
        if ($(this).is(':checked')) {
            // dogAlert('請確認您已經記錄下助記詞、密碼、錢包地址、密鑰等相關内容！')
            dogAlert('請確認您已經記錄下助記詞、密碼、錢包地址等相關内容！')
        }
    })

    $('.wallet-address .wallet').val($.cookie('actAddress') || sessionStorage.getItem('actAddress'))
    $('.wallet-address .privateKey').val($.cookie('privateKey') || sessionStorage.getItem('privateKey'))

    $('.toEmailName').click(function () {
        if ($('#confirmButton').is(':checked')) {
            window.location.href = '../html/email-name.html'
        } else {
            dogAlert('請勾選提示框！')
        }
    })
})
