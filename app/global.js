define(["require","exports","module","util/store"],function(e,t){var n=e("util/store"),r=["key","user","status"];(function(){var t=Function,i=(new t("return this"))();i.planner||(i.planner={}),planner.version="0.7.9",planner.school=n.get("app:school")||null,planner.list={modules:"modules",previews:"previews"},planner.weekDays=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],planner.slotPopover=n.get("app:slotPopover")||!0,planner.slotType=n.get("app:slotType")||"location",planner.get=function(e){return this[e]},planner.set=function(e,t){$.inArray(e,r)===-1&&(this[e]=t,n.set("app:"+e,t),$.publish("app:"+e,[t]))},planner.loadCss=function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=e,document.getElementsByTagName("head")[0].appendChild(t)},planner.analytics=function(){i._gaq&&i._gaq.push($.makeArray(arguments))},planner.trackEvent=function(e,t){planner.analytics("_trackEvent",e,t)},planner.trackPageView=function(e,t){planner.analytics("_trackPageview",t?t+"="+e:e)}})()});