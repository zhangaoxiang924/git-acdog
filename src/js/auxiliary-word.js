/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import { dogAlert } from './utils/utils'
import CryptoJS from 'crypto-js'

$(function () {
    let $fillInput = $('.auxiliaryWordConfirm')
    let $auxiliaryWord = $('.auxiliaryWord')
    // let $markWords = $('.markWords')
    let $wordButtonSection = $('.wordButtonSection')

    /* 輸入單詞提示功能
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
     */

    let randomWord = ACT.generateRandomPhrase(12)
    $('.auxiliary-word .randomAuxiliaryWordSection .InputButtons--readonly').val(randomWord)

    // 詞隨機排列
    let shuffle = (arr) => {
        let len = arr.length
        for (let i = 0; i < len - 1; i++) {
            let idx = Math.floor(Math.random() * (len - i))
            let temp = arr[idx]
            arr[idx] = arr[len - i - 1]
            arr[len - i - 1] = temp
        }
        return arr
    }

    let aTemp = (arr) => {
        let wordButton = ''
        arr.map((item, index) => {
            wordButton += `<a class="ListAttributes-word-item" data-id=${index} aria-current="false"> ${item}</a>`
        })
        return wordButton
    }

    // 下壹步確認助記詞等
    $('.auxiliary-word .nextStep').on('click', function () {
        if ($wordButtonSection.html() === '') {
            $wordButtonSection.html(aTemp(shuffle($('.auxiliaryWord').val().split(' '))))
        }
        $('.auxiliary-word').removeClass('active')
        $('.transaction-password').addClass('active')
    })

    // 按鈕點擊
    $('.Hero').on('click', '.ListAttributes-word-item', (e) => {
        let innerWord = $(e.target).text()
        if ($(e.target).hasClass('active')) {
            let re = new RegExp(innerWord)
            $fillInput.val($fillInput.val().replace(re, ''))
        } else {
            $fillInput.val($fillInput.val() + innerWord)
        }

        $(e.target).toggleClass('active')
    })

    // 上壹步
    $('.transaction-password .prevStep').on('click', function () {
        $('.auxiliary-word').addClass('active')
        $('.transaction-password').removeClass('active')
    })

    let mnemonic = randomWord.trim()
    let $passport = $('.transaction-password .passport')
    let $passportConfirm = $('.transaction-password .passportConfirm')

    // 密碼 + 助記詞 生成地址
    $('.transaction-password .nextStep').on('click', function () {
        if ($auxiliaryWord.val().trim() !== '' && $auxiliaryWord.val().trim() === $fillInput.val().trim()) {
            if ($passport.val().trim() !== '' && $passport.val() === $passportConfirm.val()) {
                sessionStorage.setItem('actAddress', (ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val())).actAddress))
                $.cookie('publicKey', (ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val())).publicKey))
                sessionStorage.setItem('pkStr', (ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val())).wifPrivateKey))

                // 密钥加密
                let pkEncrypt = CryptoJS.AES.encrypt((ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val())).privateKey), $passport.val()).toString()

                sessionStorage.setItem('privateKey', pkEncrypt)

                window.location.href = '../html/wallet-address.html'
            } else {
                dogAlert('密碼不能為空且兩次輸入需要壹致，請檢查')
                return false
            }
        } else {
            dogAlert('助記詞輸入錯誤，請重新輸入')
            return false
        }
    })
})
