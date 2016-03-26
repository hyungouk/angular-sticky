function escapeHtml(a){return String(a).replace(/[&<>"'\/]/g,function(a){return entityMap[a]})}function trimIndent(a){for(var b=a.split("\n"),c=0,d=b.length-1;null==nonSpace.exec(b[c])&&c<b.length;)c+=1;for(;null==nonSpace.exec(b[d])&&d>=c;)d-=1;for(var e=nonSpace.exec(b[c]).index,f="",g=c;d>=g;g++)f=f+b[g].slice(e-1)+(d>g?"\n":"");return f.replaceAll("	","&nbsp;&nbsp;")}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},nonSpace=/\S/;String.prototype.replaceAll=function(a,b){var c=this;return c.replace(new RegExp(a,"g"),b)};var demo=angular.module("demo",["ui.router","ui.bootstrap","demo.utils.strings","demo.utils.dom","demo.directive.scroll-along","hl.sticky"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("root",{"abstract":!0,url:"",views:{"@":{templateUrl:"views/layout.html",controller:"RootController"},"header@root":{templateUrl:"views/header.html"},"footer@root":{templateUrl:"views/footer.html"}}}).state("root.home",{url:"/",views:{"content@root":{templateUrl:"views/getting-started.html",controller:"HomeController"}}}).state("root.api",{"abstract":!0,url:"/api",views:{"content@root":{templateUrl:"views/api/page.html"}}}).state("root.api.directive",{url:"/directive/:name",templateUrl:function(a){return"views/api/directives/"+a.name+".html"}}).state("root.api.service",{url:"/service/:name",templateUrl:function(a){return"views/api/services/"+a.name+".html"}}).state("root.demo-container",{"abstract":!0,views:{"content@root":{templateUrl:"views/demo.html",controller:"DemoCtrl"}}}).state("root.demo-container.demo",{url:"/demo/:name",templateUrl:function(a){return"views/demos/"+a.name+".html"},controller:["$rootScope","$stateParams",function(a,b){a.demoName=b.name}]}).state("root.about",{url:"/about",views:{"content@root":{templateUrl:"views/about.html",controller:"AboutController"}}})}]).config(["$controllerProvider",function(a){a.allowGlobals()}]).controller("RootController",["$rootScope","$document",function(a,b){a.$on("$stateChangeSuccess",function(){b[0].body.scrollTop=b[0].documentElement.scrollTop=0})}]).controller("HomeController",["$scope",function(a){}]).controller("DemoCtrl",["$rootScope","$scope","$sce","$timeout","$stateParams","$savedContent",function(a,b,c,d,e,f){var g=["intro","html","js","css"];b.content={},b.hasContent=function(a){return b.content[a]},a.$watch("demoName",function(a){b.demoName=a}),b.$on("$stateChangeStart",function(){angular.forEach(g,function(a){f[a]=null})}),b.$on("$stateChangeSuccess",function(){d(function(){angular.forEach(f,function(a,d){b.content[d]=c.trustAsHtml(a)})})})}]).controller("AboutController",["$scope",function(a){}]).filter("firstToUpperCase",["s",function(a){return function(b){return a.firstToUpperCase(b)}}]).factory("$savedContent",function(){return{}}).directive("saveContent",["$savedContent",function(a){return{restrict:"A",compile:function(b,c){a[c.saveContent]=b.html()}}}]).directive("applyContent",["$savedContent",function(a){return{restrict:"EAC",compile:function(b,c){var d=b.html();return function(b,c,e){function f(){var b=a[e.applyContent];b||(b=d);var f=e.highlightLang;"html"==f&&(b=escapeHtml(b)),b=trimIndent(b);var g=prettyPrintOne(b,f);c.html(g)}angular.isDefined(e.contentWatch)?b.$watch(f):f()}}}}]).directive("scrollTo",["$log","offset",function(a,b){return{restrict:"A",priority:100,link:function(c,d,e){angular.isDefined(e.scrollTo)||""===e.scrollTo||a.error('Directive "scroll-to" must have a value. E.g.: scroll-to="element-id"');var f=null;$(d).mousedown(function(){c.$apply(function(){f||(f=document.getElementById(e.scrollTo),null===f&&a.warn('Element with id "'+e.scrollTo+'" does not exist')),b.scrollToElement(f)})}),c.$on("$destroy",function(){f=null})}}}]);angular.module("demo.utils.strings",[]).factory("s",function(){var a={};return a.textFromHtml=function(a){return a?String(a).replace(/<[^>]+>/gm,""):""},a.firstToUpperCase=function(a){var b=a.trim();return b.substr(0,1).toUpperCase()+b.substr(1)},a.firstToLowerCase=function(a){var b=a.trim();return b.substr(0,1).toLowerCase()+b.substr(1)},a.camelCase=function(a){return a.toLowerCase().replace(/-(.)/g,function(a,b){return b.toUpperCase()})},a}),angular.module("demo.utils.dom",["hl.sticky","smoothScroll"]).service("offset",["$document","hlStickyStack","smoothScroll",function(a,b,c){var d=angular.element(a)[0];this.getElement=function(a){return angular.isString(a)?d.getElementById(a):a},this.top=function(a){var b=0;if(a=this.getElement(a),!a||!a.offsetParent)return null;do b+=a.offsetTop,a=a.offsetParent;while(a);return b},this.totalStickyStackHeightAtElement=function(a){return b().heightAt("top",this.top(a))},this.scrollToElement=function(a){a=this.getElement(a);var b={offset:this.totalStickyStackHeightAtElement(a)};return c(a,b),b}}]),angular.module("demo.directive.scroll-along",[]).directive("hlScrollAlong",["$window",function(a){return{restrict:"EA",transclude:!0,replace:!0,template:'<div class="scroll-along-container"><div class="content" ng-transclude></div></div>',link:function(b,c,d){function e(a){var c=a.clientY-f(h);g.css("top",Math.max(0,c+window.pageYOffset)),b.$apply()}function f(a){var b=0;if(a&&a.offsetParent)do b+=a.offsetTop,a=a.offsetParent;while(a);return b}var g=angular.element(c[0]),h=angular.element(g.parent())[0];angular.element(a).bind("scroll",e),angular.element(a).bind("mousemove",e)}}}]),angular.module("hl.sticky",[]).factory("mediaQuery",function(){return{matches:function(a){return a&&(matchMedia("("+a+")").matches||matchMedia(a).matches)}}}).factory("hlStickyStack",["$document","DefaultStickyStackName",function(a,b){function c(a){a=a||{};var c=a.name||b;if(e[c])return e[c];var f=1039,g=[],h={};return h.options=a,h.stackName=c,h.add=function(a,b){return angular.isString(a)&&""!==a||(a=h.length()),b.id=a,b.zIndex=f,g.push(b),f-=1,b},h.get=function(a){for(var b=0;b<g.length;b++)if(a==g[b].id)return g[b];return!1},h.index=function(a){for(var b=0;b<g.length;b++)if(a==g[b].id)return b;return-1},h.range=function(a,b){return g.slice(a,b)},h.all=function(){return g},h.keys=function(){for(var a=[],b=0;b<g.length;b++)a.push(g[b].id);return a},h.top=function(){return g[g.length-1]},h.remove=function(a){for(var b=0;b<g.length;b++)if(a==g[b].id)return f+=1,g.splice(b,1)[0];return!1},h.removeTop=function(){return f+=1,g.splice(g.length-1,1)[0]},h.length=function(){return g.length},h.height=function(a){var b=0;return angular.forEach(g,function(c){b+=c.computedHeight(a)}),b},h.heightAt=function(a,b){for(var c,d,e=b-1,f=0,h=0;h<g.length;h++)c=g[h],c.sticksAtPosition(a,e)&&(d=c.computedHeight(a,e-f),f+=d,b-=d);return f},h.heightCurrent=function(a){return h.heightAt(a,window.pageYOffset||d.scrollTop)},e[c]=h,h}var d=a[0].documentElement,e={};return c}]).factory("hlStickyElement",["$document","$log","hlStickyStack","throttle","mediaQuery",function(a,b,c,d,e){return function(d,f){function g(){return C?z:z=s(E)-J-v()}function h(){return C?A:A=t(E)-K-w()}function i(){return C}function j(a,c){if(!m())return!1;switch(a){case"top":return k(c);case"bottom":return l(c);default:b.error('Unknown anchor "'+a+'"')}return!1}function k(a){a=void 0!==a?a:window.pageYOffset||D.scrollTop();var b=a-(F.clientTop||0);return b>=g()}function l(a){a=void 0!==a?a:window.pageYOffset||D.scrollTop();var b=a+window.innerHeight;return b<=h()}function m(){return G===!1||e.matches(G)}function n(){var a=j(L);a&&!C?o():!a&&C&&p(),C&&"top"===L&&(d.css("top",J+u(L)-y()+"px"),d.css("width",q()+"px"))}function o(){C=!0,d.addClass(H);var a=E.getBoundingClientRect(),b={width:q()+"px",position:"fixed",left:a.left+"px","z-index":N.get(R).zIndex-(O.zIndex||0)};b["margin-"+L]=0,d.css(b),I&&(B=B||angular.element("<div>"),B.css("height",r()+"px"),d.after(B))}function p(){C=!1,d.removeClass(H),d.attr("style",P.style),B&&B.remove()}function q(){return E.offsetWidth}function r(){return E.offsetHeight}function s(a){var b=0;if(a&&a.offsetParent)do b+=a.offsetTop,a=a.offsetParent;while(a);return b}function t(a){return a.offsetTop+a.clientHeight}function u(a){var b=N.index(R),c=0;return"top"===a&&O.top>0&&(c+=O.top),b>0&&N.range(0,b).forEach(function(b){b.isSticky()&&(c+=b.computedHeight(a))}),c}function v(){return u("top")}function w(){return u("bottom")}function x(a,b){return"top"===a?Math.max(0,r()-y(b)+J):0}function y(a){if(null===M&&(M=void 0!==f.container?angular.isString(f.container)?$("#"+f.container)[0]:f.container:!1),M){var b=!(null===a||void 0===a),c=M.getBoundingClientRect(),d=b?s(M)+c.height-a:c.bottom;return Math.max(0,J+u(L)+r()-d)}return 0}f=f||{};var z,A,B,C=!1,D=angular.element(a[0].body),E=d[0],F=a[0].documentElement,G=angular.isDefined(f.mediaQuery)?f.mediaQuery:!1,H=angular.isString(f.stickyClass)&&""!==f.stickyClass?f.stickyClass:"is-sticky",I=angular.isDefined(f.usePlaceholder)?f.usePlaceholder:!0,J=f.offsetTop?parseInt(f.offsetTop):0,K=f.offsetBottom?parseInt(f.offsetBottom):0,L="string"==typeof f.anchor?f.anchor.toLowerCase().trim():"top",M=null,N=f.stack||c(),O={top:0,bottom:0},P={style:d.attr("style")||""},Q=N.add(f.id,{isSticky:i,computedHeight:x,sticksAtPosition:j}),R=Q.id,S={};return S.draw=function(a){a=a||{};var b=a.offset;b&&(O.top=b.top||0,O.bottom=b.bottom||0,O.zIndex=b.zIndex),a.force===!0&&p(),n()},S.destroy=function(){p(),N.remove(R)},S}}]).constant("DefaultStickyStackName","default-stack").provider("hlStickyElementCollection",function(){var a=0,b={collections:{},defaults:{checkDelay:250},elementsDefaults:{},$get:["$rootScope","$window","$document","$log","DefaultStickyStackName","hlStickyElement","hlStickyStack","throttle",function(c,d,e,f,g,h,i,j){function k(){a++,a>1||(s=j(n,b.defaults.checkDelay,{leading:!1}),t.on("resize",s),t.on("scroll",m),q=c.$on("$viewContentLoaded",s),r=c.$on("$includeContentLoaded",s),s())}function l(){a--,a>0||(t.off("resize",s),t.off("scroll",m),q(),r())}function m(){o()}function n(){o({force:!0})}function o(a){angular.forEach(b.collections,function(b){b.draw(a)})}function p(a){a&&angular.isObject(a)||(f.warn("Must supply an options object"),a={}),a=angular.extend({},b.elementsDefaults,a);var c=a.name||g;if(b.collections[c])return b.collections[c];var d=i({name:c}),e=[],j={};return j.addElement=function(a,b){b=b||{},b.stack=d;var c=h(a,b);return e.push({stickyElement:c,element:a}),c},j.removeElement=function(a){for(var b,c=e.length;c--;)if(angular.isString(a)&&"#"+e[c].element.id===a||e[c].element===a){b=c;break}var d=e.splice(b,1)[0];return d.stickyElement.destroy(),d},j.draw=function(b){var c={};if(a.parent){var d=i({name:a.parent});c.offset={top:d.heightCurrent("top"),zIndex:d.length()}}angular.extend(c,b||{}),angular.forEach(e,function(a){a.stickyElement.draw(c)})},j.destroy=function(){angular.forEach(angular.copy(e),function(a){j.removeElement(a)}),delete b.collections[c],l()},j.trackedElements=function(){return e},b.collections[c]=j,k(),j}var q,r,s,t=angular.element(d);return p}]};return b}).directive("hlSticky",["$log","$window","$document","hlStickyElementCollection",function(a,b,c,d){return{restrict:"A",transclude:!0,replace:!0,template:'<div class="hl-sticky" ng-transclude></div>',link:function(a,b,c){var e=d({name:c.collection,parent:c.collectionParent}),f={id:c.hlSticky};angular.forEach(["mediaQuery","stickyClass","usePlaceholder","offsetTop","offsetBottom","anchor","container"],function(a){f[a]=c[a]}),e.addElement(b,f),a.$on("$destroy",function(){e.destroy()})}}}]).factory("throttle",["$timeout",function(a){return function(b,c,d){var e=null;return d=d||{},function(){var f=this,g=arguments;e||(d.leading!==!1&&b.apply(f,g),e=a(function(){e=null,d.trailing!==!1&&b.apply(f,g)},c,!1))}}}]);