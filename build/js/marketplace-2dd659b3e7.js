webpackJsonp([14],{10:function(t,e){t.exports=$},57:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),function(t){var e=n(35);t(function(){var n=t(".KittiesGrid"),a=t(".Filter-select");t(".Filter-tabs .Filter-tab").removeClass("Filter-tab--active"),a.val(sessionStorage.getItem("dogSequence")||"5");var i="";sessionStorage.getItem("signature")?i=sessionStorage.getItem("signature"):(i=Math.random().toString(36).substr(2),sessionStorage.setItem("signature",i)),t(".marketplace").off("click").on("click",".Pagination button",function(){var e=parseInt(t(this).data("page"));sessionStorage.setItem("dogCurrPage",e)});var s=function(t){return'<div class="KittyCard-coldown">\n                    <font style="vertical-align: inherit;">\n                        <font style="vertical-align: inherit;">'+parseFloat(t.metingtime/3600)+" 小時</font>\n                    </font>\n                </div>"},l=function(t){return 0===t.status?"":1===t.status?'<div class="KittyCard-status">\n                        <div class="KittyStatus">\n                        <div class="KittyStatus-item">\n                            <span class="KittyStatus-itemIcon">\n                                <i class="Icon Icon--tag"></i>\n                            </span>\n                            <span class="KittyStatus-itemText">\n                                <font style="vertical-align: inherit;">\n                                    <font style="vertical-align: inherit;">售價</font>\n                                    <span class="KittyStatus-note">\n                                        <small>\n                                            <font style="vertical-align: inherit;">Ξ</font>\n                                        </small>\n                                    </span>\n                                    <span class="KittyStatus-note">\n                                        <font style="vertical-align: inherit;">'+Object(e.j)(t)+' <em class="ACT" style="font-weight: bold"> ACT</em></font>\n                                    </span>\n                                </font>\n                            </span>\n                        </div>\n                    </div>\n                </div>':2===t.status?'<div class="KittyCard-status">\n                        <div class="KittyStatus">\n                        <div class="KittyStatus-item">\n                            <span class="KittyStatus-itemIcon">\n                                <i class="Icon Icon--eggplant"></i>\n                            </span>\n                            <span class="KittyStatus-itemText">\n                                <font style="vertical-align: inherit;">\n                                    <font style="vertical-align: inherit;">售價</font>\n                                    <span class="KittyStatus-note">\n                                        <small>\n                                            <font style="vertical-align: inherit;">Ξ</font>\n                                        </small>\n                                    </span>\n                                    <span class="KittyStatus-note">\n                                        <font style="vertical-align: inherit;">'+Object(e.j)(t)+' <em class="ACT" style="font-weight: bold"> ACT</em></font>\n                                    </span>\n                                </font>\n                            </span>\n                        </div>\n                    </div>\n                </div>':'<div class="KittyStatus-item">\n                    <span class="KittyStatus-itemIcon">\n                        <i class="Icon Icon--tag"></i>\n                    </span>\n                    <span class="KittyStatus-itemText">\n                        <font style="vertical-align: inherit;">\n                            <font style="vertical-align: inherit;">售價</font>\n                            <span class="KittyStatus-note">\n                                <small>\n                                    <font style="vertical-align: inherit;">Ξ</font>\n                                </small>\n                            </span>\n                            <span class="KittyStatus-note">\n                                <font style="vertical-align: inherit;">'+Object(e.j)(t)+"</font>\n                            </span>\n                        </font>\n                    </span>\n                </div>"},r=function(t,e){var n=Math.random().toString(36).substr(2);return'<div class="KittiesGrid-item">\n                    <a aria-current="false" href="../html/dog-detail.html?id='+t.dogid+'">\n                        <div class="KittyCard-wrapper">\n                            <div class="KittyCard u-bg-alt-topaz KittyCard--responsive" style="background-color: '+t.bgcolor+'">\n                                <img class="KittyCard-image" src="'+t.avatar+"?v_"+n+'" alt="Dog # '+t.dogid+'"/>\n                                '+l(t)+"\n                                "+(1===t.official?'<span class="KittyCard-newBadge">\n                        <svg class="NewBadge" width="100%" height="100%" viewBox="0 0 38 38">\n                            <g fill="none" fill-rule="evenodd">\n                                <path d="M37.985 0L0 37.985V0h37.985z" fill="#f88834"></path>\n                                <text fill="#FFF" font-family="Calibre-Semibold, Calibre" font-size="12" font-weight="500" letter-spacing=".4" transform="rotate(-45 13.581 14.581)">\n                                    <tspan x="3.081" y="16.581">官方</tspan>\n                                </text>\n                            </g>\n                        </svg>\n                    </span>':"")+'\n                            </div>\n                            <div class="KittyCard-details">\n                                <div class="KittyCard-subname">\n                                    <font style="vertical-align: inherit;">\n                                        <font style="vertical-align: inherit;">'+t.nickname+" · 第 "+t.generation+" 代</font>\n                                    </font>\n                                </div>\n                                "+s(t)+"\n                            </div>\n                        </div>\n                    </a>\n                </div>"},o=[],c="",g=function(s){c=s;var l=a.val();Object(e.i)({pagination:"#pagination",type:"POST",dataType:"json",url:e.a+s,data:{reqid:i,sequence:l,filter:1,pageSize:12,currentPage:parseInt(sessionStorage.getItem("dogCurrPage"))},success:function(a){if(sessionStorage.setItem("dogSequence",l),1===a.code){t(".Loader").remove(),o=a.marketlist;var i=o.map(function(t,n){return r(t,Object(e.j)(t))});n.html(i)}else{if(-10===a.code)return!1;n.html(""),Object(e.d)("請求出現錯誤")}}})};switch(t("body").on("click","#checkNewDog",function(){g("market/getzerolist")}),parseInt(sessionStorage.getItem("dogType"))){case 1:t(".Filter-tabs .salingDog").addClass("Filter-tab--active"),g("market/getorderlist");break;case 2:t(".Filter-tabs .siringDog").addClass("Filter-tab--active"),g("market/getfertilitylist");break;case 3:t(" ").insertBefore(t(".KittiesGallery")),t(".Filter-tabs .zeroDog").addClass("Filter-tab--active"),g("market/getzerolist");break;case 4:t(".Filter-tabs .allDog").addClass("Filter-tab--active"),g("market/getalllist");break;default:t(".Filter-tabs .salingDog").addClass("Filter-tab--active"),g("market/getorderlist")}a.change(function(){sessionStorage.removeItem("dogCurrPage"),g(c)}),t(".marketplace .Filter-container .salingDog").off("click").on("click",function(){sessionStorage.setItem("dogType",1),sessionStorage.removeItem("dogCurrPage"),t(this).addClass("Filter-tab--active").siblings().removeClass("Filter-tab--active"),t(".BrowseAnnouncement").remove(),g("market/getorderlist")}),t(".marketplace .Filter-container .siringDog").off("click").on("click",function(){sessionStorage.setItem("dogType",2),sessionStorage.removeItem("dogCurrPage"),t(this).addClass("Filter-tab--active").siblings().removeClass("Filter-tab--active"),t(".BrowseAnnouncement").remove(),g("market/getfertilitylist")}),t(".marketplace .Filter-container .zeroDog").off("click").on("click",function(){sessionStorage.setItem("dogType",3),sessionStorage.removeItem("dogCurrPage"),t(this).addClass("Filter-tab--active").siblings().removeClass("Filter-tab--active"),t(".BrowseAnnouncement").remove(),t(" ").insertBefore(t(".KittiesGallery")),g("market/getzerolist")}),t(".marketplace .Filter-container .allDog").off("click").on("click",function(){sessionStorage.setItem("dogType",4),sessionStorage.removeItem("dogCurrPage"),t(this).addClass("Filter-tab--active").siblings().removeClass("Filter-tab--active"),t(".BrowseAnnouncement").remove(),g("market/getalllist")})})}.call(e,n(10))}},[57]);