define(["require","exports","module","helper/jquery.slot","hgn!template/timeSlot"],function(e,t){function r(e){this.name=e,this.$elem=$("#"+this.name.toLowerCase()),this.$rows=[];var t,n,r=this.$elem.find(".row-fluid");for(t=0,n=r.length;t<n;t++)this.$rows.push($(r[t]));this.occupied=[],this.$occupied=this.$rows[0],this.$occupied.on("dblclick",".span1",$.proxy(this.toggleOccupiedSpan,this)),$.subscribe("grid:rows:clearEmpty",$.proxy(this.compressRows,this))}function i(e,t,n){var r,i=e.length,o;for(r=0;r<i;r++){o=$(e[r]);if(s(o.data("offset"),o.data("span"),t,n))return!0}}function s(e,t,n,r){var i=e+t,s=n+r;return n>=e&&n<i?!0:s>e&&s<=i?!0:n<=e&&s>=i?!0:!1}function o(e){return e=parseInt(e,10),2+(Math.floor(e/100)-8)*2+(e%100?1:0)}function u(e){var t=e.toUpperCase().split("-");return t[0].indexOf("LAB")>=0?"(LB)":t.length===3?"("+t[0].charAt(0)+t[2].charAt(0)+")":t.length===2?"("+t[0].charAt(0)+t[1].charAt(0)+")":"("+t[0].charAt(0)+")"}function a(e){var t=$(n(e));return t.slot(e),t}e("helper/jquery.slot");var n=e("hgn!template/timeSlot");return r.fn=r.prototype,r.fn.allocate=function(e,t,n,r,i){var s=o(t.startTime),f=o(t.endTime)-s,l=this.hasEmptySlots(s,f);l===-1&&(this.createNewRow(),l=this.$rows.length-1);var c={code:r.get("code"),type:n,shortType:u(t.type),index:e,offset:s,span:f,slot:t,data:r.data,module:r,droppable:i||!1};this.$rows[l].append(a(c)),this.$elem.hasClass("hidden")&&(this.$elem.removeClass("hidden"),$(window).resize())},r.fn.createNewRow=function(){var e=this.$rows[1].clone();e.find(".slot").remove(),this.$rows.push(e),this.$elem.append(e),$(window).resize()},r.fn.compressRows=function(){this.removeEmptyRows(),this.$rows[0].find(".slot, .occupied").length>0?this.mergeRows():this.name==="SATURDAY"&&this.$elem.addClass("hidden"),$(window).resize()},r.fn.removeEmptyRows=function(){var e,t;for(e=this.$rows.length-1;e>1;e--)this.$rows[e].find(".slot").length===0&&(this.$rows[e].remove(),this.$rows.splice(e,1));this.$rows[0].find(".slot, .occupied").length===0&&(e=this.$rows.length===2?1:2,t=this.$rows[e].find(".slot").detach(),this.$rows[0].append(t),e===2&&(this.$rows[2].remove(),this.$rows.splice(e,1))),this.$rows[1].find(".slot").length===0&&this.$rows.length>2&&(t=this.$rows[2].find(".slot").detach(),this.$rows[1].append(t),this.$rows[2].remove(),this.$rows.splice(2,1))},r.fn.mergeRows=function(){var e,t,n,r,i,s;for(e=this.$rows.length-1;e>0;e--){i=this.$rows[e].find(".slot");for(t=i.length-1,n=0;t>=0;t--)s=$(i[t]),r=this._hasEmptySlots(s.data("offset"),s.data("span"),e),r!==-1&&(s.detach(),this.$rows[r].append(s),n++);n!==0&&e!==1&&n===i.length&&(this.$rows[e].remove(),this.$rows.splice(e,1))}},r.fn._hasEmptySlots=function(e,t,n){var r,s,o,u,a,f;for(s=0;s<n;s++){r=!0;if(i(this.$rows[s].find(".slot"),e,t))continue;if(s===0&&i(this.$occupied.find(".occupied"),e,t))continue;if(r)return s}return-1},r.fn.hasEmptySlots=function(e,t){return this._hasEmptySlots(e,t,this.$rows.length)},r.fn.toggleOccupiedSpan=function(e){var t=$(e.currentTarget);t.hasClass("slot")||this._toggleOccupiedGrid(t.find(".grid"),t.index()+1,!0)},r.fn._toggleOccupiedGrid=function(e,t,n){e.toggleClass("occupied"),e.hasClass("occupied")?e.data({offset:t,span:1}):i(this.$rows[1].find(".slot"),t,1)&&this.compressRows(),n&&$.publish("grid:occupy:save",[this.name])},r.fn.addOccupiedSlots=function(e){var t,n,r=this.$occupied.find(".grid");for(t=0;n=e[t];t++)this._toggleOccupiedGrid($(r[n-1]),n)},r.fn.getOccupiedSlots=function(){var e=[],t,n,r=this.$occupied.find(".occupied");for(t=0,n=r.length;t<n;t++)e.push($.data(r[t],"offset"));return e},r});