/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */
import { Url, checkEmail, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    let address = sessionStorage.getItem('actAddress')
    let $email = $('input[type="email"]')
    let $nick = $('input[type="text"]')
    $('.skip, .finish').on('click', () => {
        const emailVal = $.trim($email.val())
        const nickVal = $.trim($nick.val())
        if (emailVal === '') {
            dogAlert('郵箱地址不能為空')
        } else if (checkEmail(emailVal) === false) {
            dogAlert('請輸入正確的郵箱地址')
        } else if (nickVal === '') {
            dogAlert('昵稱不能為空')
        } else {
            let obj = {
                addr: address,
                email: emailVal,
                nickname: nickVal
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: Url + 'account/register',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function (data) {
                    if (parseInt(data.code) === 1) {
                        $.cookie('actAddress', sessionStorage.getItem('actAddress'), {expires: 0.5})
                        $.cookie('privateKey', sessionStorage.getItem('privateKey'), {expires: 0.5})

                        sessionStorage.removeItem('actAddress')
                        sessionStorage.removeItem('privateKey')
                        dogAlert('註冊成功!', function () {
                            window.callSign($.cookie('actAddress'), sessionStorage.getItem('pkStr'), function (signData) {
                                let signJson = JSON.stringify({addr: obj.addr, key: $.cookie('publicKey'), sign: signData})
                                // 私钥签名加密
                                let signJsonEncrypt = CryptoJS.AES.encrypt(signJson, obj.addr).toString()
                                $.cookie('signJson', signJsonEncrypt, {expires: 0.5})
                                $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    url: Url + 'account/login',
                                    data: {addr: obj.addr, signjson: signJson},
                                    success: function (loginData) {
                                        if (parseInt(loginData.code) === 1) {
                                            sessionStorage.removeItem('pkStr')
                                            window.location.href = '../html/marketplace.html'
                                        } else {
                                            dogAlert('服務器擁堵, 請稍候!')
                                        }
                                    }
                                })
                            })
                        })
                    } else if (parseInt(data.code) === -2 || parseInt(data.code) === -1) {
                        dogAlert('請求出現錯誤：' + data.msg)
                        return false
                    }
                }
            })
        }
    })
})
