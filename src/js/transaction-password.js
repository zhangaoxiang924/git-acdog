/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */
import { dogAlert } from './utils/utils'

$(function () {
    let mnemonic = localStorage.getItem('mnemonic')
    let $passport = $('.transaction-password .passport')
    let $passportConfirm = $('.transaction-password .passportConfirm')

    $('.transaction-password .nextStep').on('click', function () {
        if ($passport.val().trim() !== '' && $passport.val() === $passportConfirm.val()) {
            localStorage.setItem('actAddress', (ACT.generateKey(ACT.calcBIP39Seed(mnemonic, $passport.val())).actAddress))
            window.location.href = '../html/wallet-address.html'
        } else {
            dogAlert('密碼不能為空且兩次輸入需要壹致，請檢查')
            return false
        }
    })
})
