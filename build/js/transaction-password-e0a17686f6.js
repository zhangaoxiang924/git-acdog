webpackJsonp([12],{10:function(t,e){t.exports=$},96:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),function(t){var e=a(35);t(function(){var a=localStorage.getItem("mnemonic"),n=t(".transaction-password .passport"),o=t(".transaction-password .passportConfirm");t(".transaction-password .nextStep").on("click",function(){if(""===n.val().trim()||n.val()!==o.val())return Object(e.d)("密碼不能為空且兩次輸入需要壹致，請檢查"),!1;localStorage.setItem("actAddress",ACT.generateKey(ACT.calcBIP39Seed(a,n.val())).actAddress),window.location.href="../html/wallet-address.html"})})}.call(e,a(10))}},[96]);