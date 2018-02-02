/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */
import { Url } from './utils/utils'

$(function () {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Url + 'announce/getannounce',
        data: {
            version: 'chinese'
        },
        success: function (data) {
            if (data.code === -2) {
                $('#content').html('<div class="noWord">新功能銳意開發中，請關注進一步資訊！</div>')
            }
            $('#content').html(data.obj)
        }
    })
})
