define(["require","exports","module"],function(e,t){function n(e){var t={startYear:2012,endYear:2013,acadYear:"2012/2013",semester:2},n=e.getFullYear(),r=e.getMonth();return r<=4?(t.startYear=n-1,t.endYear=n,t.semester=2):r>=11?(t.startYear=n,t.endYear=n+1,t.semester=2):(t.startYear=n,t.endYear=n+1,t.semester=1),t.acadYear=t.startYear+"/"+t.endYear,t}function r(e){var t=e.getFullYear(),n=e.getMonth(),r,i=0;n<=4?r=new Date(t+"-01-01 00:00:00 GMT+0800"):n>=11?r=new Date(t+1+"-01-01 00:00:00 GMT+0800"):r=new Date(t+"-08-01 00:00:00 GMT+0800");for(;;){if(r.getDay()===1)break;r.setDate(r.getDate()+1)}return r.setDate(r.getDate()+7),r}t.Semester=n(new Date),t.getSemester=function(e){return n(e||new Date)},t.getWeekOneDate=function(e){return r(e||new Date)},t.getWeekOneDateOfWeekday=function(e,t){var n=r(t||new Date),i=$.inArray(e.toUpperCase(),planner.weekDays);return i<0?n:(n.setDate(n.getDate()+i),n)},t.getDateFormatted=function(e){var t=""+e.getFullYear(),n=("0"+(e.getMonth()+1)).slice(-2),r=("0"+e.getDate()).slice(-2),i=("0"+e.getHours()).slice(-2),s=("0"+e.getMinutes()).slice(-2);return r+"-"+n+"-"+t+" "+i+":"+s+":00"},t.getTimeIndex=function(e){return e=parseInt(e,10),2+(Math.floor(e/100)-8)*2+(e%100?1:0)}});