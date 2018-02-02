/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import { Url, dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    let num = 12 // 助記詞數量
    ACT.generateRandomPhrase(num)
    let $fillInput = $('.login-fill-auxiliary-word .InputButtons-input')
    let $markWords = $('.markWords')

    $('body').click(function () {
        $markWords.removeClass('active')
    })

    // 返回焦點位置
    function getCursortPosition (ctrl) {
        let CaretPos = 0
        if (document.selection) {
            ctrl.focus()
            let Sel = document.selection.createRange()
            Sel.moveStart('character', -ctrl.value.length)
            CaretPos = Sel.text.length
        } else if (ctrl.selectionStart || ctrl.selectionStart === '0') CaretPos = ctrl.selectionStart
        return (CaretPos)
    }

    $fillInput.on('keyup', function (e) {
        let valueArr = $fillInput.val().trim().split(/\s+/g)

        if (e.keyCode === 32 || e.keyCode === 8 || e.keyCode === 46 || getCursortPosition($(this)[0]) !== $(this).val().length) {
            $markWords.removeClass('active')
            return false
        }

        if ($fillInput.val().trim() !== '') {
            let randomWord = ACT.findNearestWord(valueArr[valueArr.length - 1])
            let li = randomWord.split(' ').map((item) => {
                return `<li>${item}</li>`
            })
            $markWords.addClass('active').html(li).find('li').on('click', function (e) {
                valueArr[valueArr.length - 1] = $(this).html()
                $fillInput.val(valueArr.join(' ') + ' ')
                $markWords.removeClass('active')
                $fillInput.focus()
            })
        } else {
            $markWords.removeClass('active')
        }
    })

    $('.pkLoginButton').on('click', function () {
        $('.Hero').removeClass('active')
        $('.login-by-privateKey, .loginMethod').addClass('active')
        $(this).removeClass('active')
    })

    $('.mLoginButton').on('click', function () {
        $('.loginMethod, .Hero').addClass('active')
        $('.login-by-privateKey').removeClass('active')
        $(this).removeClass('active')
    })

    // 助記詞登陸點擊
    let loginFunction = () => {
        let mnemonic = $fillInput.val().trim()
        let $passport = $('.login-transaction-password .passport')

        if (mnemonic === '') {
            dogAlert('請輸入助記詞！')
            return false
        }

        let res = ACT.findPhraseErrors($fillInput.val().trim())

        if (res) {
            if (res === 'Invalid mnemonic') {
                dogAlert(`助記詞輸入有誤，並且數量為${num}個，請檢查輸入內容`)
                return false
            } else {
                let resArr = res.split(' ')
                dogAlert(`${resArr[0]} 不在詞庫內，您是否在尋找 ${resArr[resArr.length - 1]}`)
                return false
            }
        }

        if ($passport.val().trim() !== '' && mnemonic !== '') {
            let addInfo = ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val()))
            let actAddress = addInfo.actAddress
            let privateKey = addInfo.privateKey
            let publicKey = addInfo.publicKey
            let pkStr = addInfo.wifPrivateKey
            let obj = {addr: actAddress, pk: privateKey, publickey: publicKey, pkStr: pkStr}
            window.callSign(actAddress, pkStr, function (data) {
                obj.sign = data
                loginAjax(obj)
            })
        } else {
            dogAlert('請輸入登陸密碼')
            return false
        }
    }

    // 密鑰登陸點擊
    let pkloginFunction = () => {
        let pk = $('.privateKey').val().trim()

        if (pk === '') {
            dogAlert('請輸入私鑰！')
            return false
        } else {
            let actAddress = ACT.priv2address(pk)
            let data = {addr: actAddress, pk: pk}
            loginAjax(data)
        }
    }

    $('.Main .nextStep').on('click', function () {
        if ($('.mLoginButton').hasClass('active')) {
            pkloginFunction()
        } else {
            loginFunction()
        }
    })

    // window.addEventListener('keydown', function (e) {
    //     if (e.keyCode === 13) {
    //         loginFunction()
    //         return false
    //     }
    // })

    // 登陸請求
    const loginAjax = (obj) => {
        let $passport = $('.login-transaction-password .passport')
        let privatekey = ACT.generateKey(ACT.calcBIP39Seed($fillInput.val().trim(), $passport.val())).privateKey
        let signJson = JSON.stringify({addr: obj.addr, key: obj.publickey, sign: obj.sign})
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Url + 'account/login',
            data: {addr: obj.addr, signjson: signJson},
            success: function (data) {
                if (parseInt(data.code) === 1) {
                    $.cookie('actAddress', obj.addr, {expires: 0.5})

                    // 私钥签名加密
                    let signJsonEncrypt = CryptoJS.AES.encrypt(signJson, obj.addr).toString()
                    $.cookie('signJson', signJsonEncrypt, {expires: 0.5})

                    // 密钥加密
                    let pkEncrypt = CryptoJS.AES.encrypt((privatekey), $passport.val()).toString()

                    $.cookie('privateKey', pkEncrypt, {expires: 0.5})

                    window.location.href = '../html/my-dogs.html'
                } else if (parseInt(data.code) === -2 || parseInt(data.code) === -1) {
                    if ($('.mLoginButton').hasClass('active')) {
                        dogAlert('私鑰輸入有誤，請重新輸入')
                        return false
                    } else {
                        dogAlert('助記詞或密碼錯誤，請重新輸入')
                        return false
                    }
                }
            }
        })
    }
})
