!function t(e,n,i){function r(a,s){if(!n[a]){if(!e[a]){var h="function"==typeof require&&require;if(!s&&h)return h(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return r(n?n:t)},c,c.exports,t,e,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=void 0,a=void 0,s=64,h=function(){function t(){i(this,t),this.color="#000",this.curve="A",this.rules={A:"-BF+AFA+FB-",B:"+AF-BFB-FA+"},this.current=0,this.iterations=7,this.vertexes=[],this.drawRate=10}return r(t,[{key:"getUnit",value:function(t,e){return e/Math.floor(Math.pow(2,t))}},{key:"getCurve",value:function(t,e,n){for(var i=t,r=0;r<n;r++)i=this.generation(i,e);return i}},{key:"generation",value:function(t,e){var n="",i=!0,r=!1,o=void 0;try{for(var a,s=t[Symbol.iterator]();!(i=(a=s.next()).done);i=!0){var h=a.value;n+=e[h]?e[h]:h}}catch(t){r=!0,o=t}finally{try{!i&&s.return&&s.return()}finally{if(r)throw o}}return n}},{key:"resize",value:function(t,e){o=t,a=e;var n=this.getUnit(this.iterations,Math.min(o,a)-2*s);this.curve=this.getCurve("A",this.rules,this.iterations),this.vertexes=this.points(this.curve,n)}},{key:"update",value:function(t){var e=this.vertexes.length;this.current+=this.drawRate,this.current=Math.min(this.current,e)}},{key:"drawCalls",value:function(t,e,n){var i=!0,r=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done);i=!0){var h=a.value;switch(h){case"F":t.beginPath(),t.moveTo(0,0),t.lineTo(n,0),t.stroke(),t.closePath(),t.translate(n,0);break;case"-":t.rotate(-Math.PI/2);break;case"+":t.rotate(Math.PI/2)}}}catch(t){r=!0,o=t}finally{try{!i&&s.return&&s.return()}finally{if(r)throw o}}}},{key:"points",value:function(t,e){var n=[],i=0,r={x:0,y:0},o=!0,a=!1,s=void 0;try{for(var h,u=t[Symbol.iterator]();!(o=(h=u.next()).done);o=!0){var c=h.value;switch(c){case"F":var f={x:r.x,y:r.y};f.x+=e*Math.cos(i),f.y+=e*Math.sin(i),n.push(f),r=f;break;case"-":i+=-Math.PI/2;break;case"+":i+=Math.PI/2}}}catch(t){a=!0,s=t}finally{try{!o&&u.return&&u.return()}finally{if(a)throw s}}return n}},{key:"render",value:function(t){t.save(),t.fillStyle="#fff",t.fillRect(0,0,o,a),t.strokeStyle=this.color,t.translate(0,a),o>a?t.translate((o-a)/2,0):t.translate(0,-(a-o)/2),t.translate(s,-s),t.beginPath(),t.moveTo(0,0);for(var e=void 0,n=0;n<this.current;n++)e=this.vertexes[n],t.lineTo(e.x,e.y);t.stroke(),t.restore()}}]),t}();n.default=h},{}],2:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}var r=t("@lejeunerenard/voyeur"),o=i(r),a=t("2d-context"),s=i(a),h=t("./app"),u=i(h),c=window.devicePixelRatio,f=new u.default,d=(0,s.default)({scale:c}),l=d.canvas;document.body.appendChild(l),l.width=window.innerWidth,l.height=window.innerHeight,f.resize(l.width,l.height);var p=new o.default(l,28,{framerate:60});p.capture=!!JSON.parse(localStorage.capture||"false"),p.update=f.update.bind(f),p.render=f.render.bind(f,d),p.start()},{"./app":1,"2d-context":3,"@lejeunerenard/voyeur":5}],3:[function(t,e,n){var i=t("get-canvas-context");e.exports=function(t){return i("2d",t)}},{"get-canvas-context":4}],4:[function(t,e,n){function i(t,e){if("string"!=typeof t)throw new TypeError("must specify type string");if(e=e||{},"undefined"==typeof document&&!e.canvas)return null;var n=e.canvas||document.createElement("canvas");"number"==typeof e.width&&(n.width=e.width),"number"==typeof e.height&&(n.height=e.height);var i,r=e;try{var o=[t];0===t.indexOf("webgl")&&o.push("experimental-"+t);for(var a=0;a<o.length;a++)if(i=n.getContext(o[a],r))return i}catch(t){i=null}return i||null}e.exports=i},{}],5:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=t("ccapture.js"),s=i(a),h=t("object-assign"),u=i(h),c=t("defined"),f=i(c),d=function(){function t(e){var n=arguments.length<=1||void 0===arguments[1]?0:arguments[1],i=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];r(this,t);var o=(0,f.default)(i.capture,!1),a=.5,s=(0,f.default)(i.framerate,60);(0,u.default)(this,{canvas:e,scale:a,framerate:s,render:function(){},update:function(){},captureLength:n,capture:o})}return o(t,[{key:"start",value:function(){var t=this,e=this.capture;e?!function(){var e=function t(){if(a>=n*i)return o.stop(),void o.save();var e=1e3/i;h.update(e),h.render(e),o.capture(r),a++,requestAnimationFrame(t)},n=t.captureLength,i=t.framerate,r=t.canvas,o=new s.default({format:"jpg",verbose:!0,name:"output",framerate:i});o.start();var a=0,h=t;e()}():!function(){var e=function t(e){e-=i,i+=e,n.update(e),n.render(e),requestAnimationFrame(t)},n=t,i=0;requestAnimationFrame(e)}()}}]),t}();n.default=d,e.exports=n.default},{"ccapture.js":6,defined:7,"object-assign":8}],6:[function(t,e,n){(function(t){function i(t,e,n){function i(t){var e=t.split(/[:;,]/),t=e[1],e=("base64"==e[2]?atob:decodeURIComponent)(e.pop()),n=e.length,i=0,r=new Uint8Array(n);for(i;i<n;++i)r[i]=e.charCodeAt(i);return new f([r],{type:t})}function r(t,e){if("download"in u)return u.href=t,u.setAttribute("download",l),u.innerHTML="downloading...",u.style.display="none",h.body.appendChild(u),setTimeout(function(){u.click(),h.body.removeChild(u),!0===e&&setTimeout(function(){a.URL.revokeObjectURL(u.href)},250)},66),!0;var n=h.createElement("iframe");h.body.appendChild(n),e||(t="data:"+t.replace(/^data:([\w\/\-\+]+)/,s)),n.src=t,setTimeout(function(){h.body.removeChild(n)},333)}var o,a=window,s="application/octet-stream",n=n||s,h=document,u=h.createElement("a"),c=function(t){return""+t},f=a.Blob||a.MozBlob||a.WebKitBlob||c,d=a.MSBlobBuilder||a.WebKitBlobBuilder||a.BlobBuilder,l=e||"download";if("true"==""+this&&(t=[t,n],n=t[0],t=t[1]),(""+t).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/))return navigator.msSaveBlob?navigator.msSaveBlob(i(t),l):r(t);try{o=t instanceof f?t:new f([t],{type:n})}catch(e){d&&(o=new d,o.append([t]),o=o.getBlob(n))}if(navigator.msSaveBlob)return navigator.msSaveBlob(o,l);if(a.URL)r(a.URL.createObjectURL(o),!0);else{if("string"==typeof o||o.constructor===c)try{return r("data:"+n+";base64,"+a.btoa(o))}catch(t){return r("data:"+n+","+encodeURIComponent(o))}e=new FileReader,e.onload=function(){r(this.result)},e.readAsDataURL(o)}return!0}window.Whammy=function(){function t(t,n){for(var i=e(t),i=[{id:440786851,data:[{data:1,id:17030},{data:1,id:17143},{data:4,id:17138},{data:8,id:17139},{data:"webm",id:17026},{data:2,id:17031},{data:2,id:17029}]},{id:408125543,data:[{id:357149030,data:[{data:1e6,id:2807729},{data:"whammy",id:19840},{data:"whammy",id:22337},{data:u(i.duration),id:17545}]},{id:374648427,data:[{id:174,data:[{data:1,id:215},{data:1,id:29637},{data:0,id:156},{data:"und",id:2274716},{data:"V_VP8",id:134},{data:"VP8",id:2459272},{data:1,id:131},{id:224,data:[{data:i.width,id:176},{data:i.height,id:186}]}]}]},{id:475249515,data:[]}]}],o=i[1],s=o.data[2],h=0,c=0;h<t.length;){var f={id:187,data:[{data:Math.round(c),id:179},{id:183,data:[{data:1,id:247},{data:0,size:8,id:241}]}]};s.data.push(f);var d=[],f=0;do d.push(t[h]),f+=t[h].duration,h++;while(h<t.length&&3e4>f);var l=0,d={id:524531317,data:[{data:Math.round(c),id:231}].concat(d.map(function(t){var e=a({discardable:0,frame:t.data.slice(4),invisible:0,keyframe:1,lacing:0,trackNum:1,timecode:Math.round(l)});return l+=t.duration,{data:e,id:163}}))};o.data.push(d),c+=f}for(c=h=0;c<o.data.length;c++)3<=c&&(s.data[c-3].data[1].data[1].data=h),f=r([o.data[c]],n),h+=f.size||f.byteLength||f.length,2!=c&&(o.data[c]=f);return r(i,n)}function e(t){for(var e=t[0].width,n=t[0].height,i=t[0].duration,r=1;r<t.length;r++){if(t[r].width!=e)throw"Frame "+(r+1)+" has a different width";if(t[r].height!=n)throw"Frame "+(r+1)+" has a different height";if(0>t[r].duration||32767<t[r].duration)throw"Frame "+(r+1)+" has a weird duration (must be between 0 and 32767)";i+=t[r].duration}return{duration:i,width:e,height:n}}function n(t){for(var e=[];0<t;)e.push(255&t),t>>=8;return new Uint8Array(e.reverse())}function i(t){for(var e=[],t=(t.length%8?Array(9-t.length%8).join("0"):"")+t,n=0;n<t.length;n+=8)e.push(parseInt(t.substr(n,8),2));return new Uint8Array(e)}function r(t,e){for(var a=[],s=0;s<t.length;s++)if("id"in t[s]){var h=t[s].data;if("object"==typeof h&&(h=r(h,e)),"number"==typeof h)if("size"in t[s]){for(var u=t[s].size,c=new Uint8Array(u),u=u-1;0<=u;u--)c[u]=255&h,h>>=8;h=c}else h=i(h.toString(2));if("string"==typeof h){for(c=new Uint8Array(h.length),u=0;u<h.length;u++)c[u]=h.charCodeAt(u);h=c}for(var u=h.size||h.byteLength||h.length,c=0,f=56;0<f;f-=7)if(u>Math.pow(2,f)-2){c=f/7;break}u=u.toString(2),f=Array(8*(c+1)+1).join("0"),c=Array(c+1).join("0")+1,u=f.substr(0,f.length-u.length-c.length)+u,c+=u,a.push(n(t[s].id)),a.push(i(c)),a.push(h)}else a.push(t[s]);return e?(a=o(a),new Uint8Array(a)):new Blob(a,{type:"video/webm"})}function o(t,e){null==e&&(e=[]);for(var n=0;n<t.length;n++)"object"==typeof t[n]?o(t[n],e):e.push(t[n]);return e}function a(t){var e=0;if(t.keyframe&&(e|=128),t.invisible&&(e|=8),t.lacing&&(e|=t.lacing<<1),t.discardable&&(e|=1),127<t.trackNum)throw"TrackNumber > 127 not supported";return[128|t.trackNum,t.timecode>>8,255&t.timecode,e].map(function(t){return String.fromCharCode(t)}).join("")+t.frame}function s(t){for(var e=t.RIFF[0].WEBP[0],n=e.indexOf("*"),i=0,r=[];4>i;i++)r[i]=e.charCodeAt(n+3+i);return i=r[1]<<8|r[0],n=16383&i,i=r[3]<<8|r[2],{width:n,height:16383&i,data:e,riff:t}}function h(t){for(var e=0,n={};e<t.length;){var i=t.substr(e,4);if(n[i]=n[i]||[],"RIFF"==i||"LIST"==i){var r=parseInt(t.substr(e+4,4).split("").map(function(t){return t=t.charCodeAt(0).toString(2),Array(8-t.length+1).join("0")+t}).join(""),2),o=t.substr(e+4+4,r),e=e+(8+r);n[i].push(h(o))}else"WEBP"==i?n[i].push(t.substr(e+8)):n[i].push(t.substr(e+4)),e=t.length}return n}function u(t){return[].slice.call(new Uint8Array(new Float64Array([t]).buffer),0).map(function(t){return String.fromCharCode(t)}).reverse().join("")}function c(t,e){this.frames=[],this.duration=1e3/t,this.quality=e||.8}return c.prototype.add=function(t,e){if("undefined"!=typeof e&&this.duration)throw"you can't pass a duration if the fps is set";if("undefined"==typeof e&&!this.duration)throw"if you don't have the fps set, you need to have durations here.";if(t.canvas&&(t=t.canvas),t.toDataURL)t=t.getContext("2d").getImageData(0,0,t.width,t.height);else if("string"!=typeof t)throw"frame must be a a HTMLCanvasElement, a CanvasRenderingContext2D or a DataURI formatted string";if("string"==typeof t&&!/^data:image\/webp;base64,/gi.test(t))throw"Input must be formatted properly as a base64 encoded DataURI of type image/webp";this.frames.push({image:t,duration:e||this.duration})},c.prototype.encodeFrames=function(t){if(this.frames[0].image instanceof ImageData){var e=this.frames,n=document.createElement("canvas"),i=n.getContext("2d");n.width=this.frames[0].image.width,n.height=this.frames[0].image.height;var r=function(o){var a=e[o];i.putImageData(a.image,0,0),a.image=n.toDataURL("image/webp",this.quality),o<e.length-1?setTimeout(function(){r(o+1)},1):t()}.bind(this);r(0)}else t()},c.prototype.compile=function(e,n){this.encodeFrames(function(){var i=new t(this.frames.map(function(t){var e=s(h(atob(t.image.slice(23))));return e.duration=t.duration,e}),e);n(i)}.bind(this))},{Video:c,fromImageArray:function(e,n,i){return t(e.map(function(t){return t=s(h(atob(t.slice(23)))),t.duration=1e3/n,t}),i)},toWebM:t}}(),function(){function t(t){var e,n=new Uint8Array(t);for(e=0;e<t;e+=1)n[e]=0;return n}var e="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");window.utils={},window.utils.clean=t,window.utils.pad=function(t,e,n){return t=t.toString(n||8),"000000000000".substr(t.length+12-e)+t},window.utils.extend=function(e,n,i,r){return n=t((parseInt((n+i)/r)+1)*r),n.set(e),n},window.utils.stringToUint8=function(e,n,i){var r,o,n=n||t(e.length),i=i||0;for(r=0,o=e.length;r<o;r+=1)n[i]=e.charCodeAt(r),i+=1;return n},window.utils.uint8ToBase64=function(t){var n,i,r=t.length%3,o="";for(n=0,i=t.length-r;n<i;n+=3)r=(t[n]<<16)+(t[n+1]<<8)+t[n+2],o+=e[r>>18&63]+e[r>>12&63]+e[r>>6&63]+e[63&r];switch(o.length%4){case 1:o+="=";break;case 2:o+="=="}return o}}(),function(){var t,e=window.utils;t=[{field:"fileName",length:100},{field:"fileMode",length:8},{field:"uid",length:8},{field:"gid",length:8},{field:"fileSize",length:12},{field:"mtime",length:12},{field:"checksum",length:8},{field:"type",length:1},{field:"linkName",length:100},{field:"ustar",length:8},{field:"owner",length:32},{field:"group",length:32},{field:"majorNumber",length:8},{field:"minorNumber",length:8},{field:"filenamePrefix",length:155},{field:"padding",length:12}],window.header={},window.header.structure=t,window.header.format=function(n,i){var r=e.clean(512),o=0;return t.forEach(function(t){var e,i,a=n[t.field]||"";for(e=0,i=a.length;e<i;e+=1)r[o]=a.charCodeAt(e),o+=1;o+=t.length-e}),"function"==typeof i?i(r,o):r}}(),function(){function t(t){this.written=0,e=(t||20)*r,this.out=i.clean(e),this.blocks=[],this.length=0}var e,n=window.header,i=window.utils,r=512;t.prototype.append=function(t,e,o){var a,s,h,u,c,f;if("string"==typeof e)e=i.stringToUint8(e);else if(e.constructor!==Uint8Array.prototype.constructor)throw"Invalid input type. You gave me: "+e.constructor.toString().match(/function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/)[1];"function"==typeof o&&(o={}),o=o||{},h=o.mode||511,u=o.mtime||Math.floor(+new Date/1e3),c=o.uid||0,f=o.gid||0,a={fileName:t,fileMode:i.pad(h,7),uid:i.pad(c,7),gid:i.pad(f,7),fileSize:i.pad(e.length,11),mtime:i.pad(u,11),checksum:"        ",type:"0",ustar:"ustar  ",owner:o.owner||"",group:o.group||""},s=0,Object.keys(a).forEach(function(t){var e,n=a[t];for(t=0,e=n.length;t<e;t+=1)s+=n.charCodeAt(t)}),a.checksum=i.pad(s,6)+"\0 ",t=n.format(a),o=Math.ceil(t.length/r)*r,h=Math.ceil(e.length/r)*r,this.blocks.push({header:t,input:e,headerLength:o,inputLength:h})},t.prototype.save=function(){var t=[],e=[],n=0,i=Math.pow(2,20),o=[];return this.blocks.forEach(function(t){n+t.headerLength+t.inputLength>i&&(e.push({blocks:o,length:n}),o=[],n=0),o.push(t),n+=t.headerLength+t.inputLength}),e.push({blocks:o,length:n}),e.forEach(function(e){var n=new Uint8Array(e.length),i=0;e.blocks.forEach(function(t){n.set(t.header,i),i+=t.headerLength,n.set(t.input,i),i+=t.inputLength}),t.push(n)}),t.push(new Uint8Array(2*r)),new Blob(t,{type:"octet/stream"})},t.prototype.clear=function(){this.written=0,this.out=i.clean(e)},window.Tar=t}(),function(t){function e(t,n){if({}.hasOwnProperty.call(e.cache,t))return e.cache[t];var i=e.resolve(t);if(!i)throw Error("Failed to resolve module "+t);var r={id:t,require:e,filename:t,exports:{},loaded:!1,parent:n,children:[]};n&&n.children.push(r);var o=t.slice(0,t.lastIndexOf("/")+1);return e.cache[t]=r.exports,i.call(r.exports,r,r.exports,o,t),r.loaded=!0,e.cache[t]=r.exports}e.modules={},e.cache={},e.resolve=function(t){return{}.hasOwnProperty.call(e.modules,t)?e.modules[t]:void 0},e.define=function(t,n){e.modules[t]=n};var n=function(e){return e="/",{title:"browser",version:"v0.10.26",browser:!0,env:{},argv:[],nextTick:t.setImmediate||function(t){setTimeout(t,0)},cwd:function(){return e},chdir:function(t){e=t}}}();e.define("/gif.coffee",function(t){function n(t,e){function n(){this.constructor=t}for(var i in e)({}).hasOwnProperty.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t}var i,r,o,a,s;o=e("events",t).EventEmitter,i=e("/browser.coffee",t),s=function(t){function e(t){var e,n;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(t);for(e in r)n=r[e],null!=this.options[e]||(this.options[e]=n)}return n(e,t),r={workerScript:"gif.worker.js",workers:2,repeat:0,background:"#fff",quality:10,width:null,height:null,transparent:null},a={delay:500,copy:!1},e.prototype.setOption=function(t,e){return this.options[t]=e,null==this._canvas||"width"!==t&&"height"!==t?void 0:this._canvas[t]=e},e.prototype.setOptions=function(t){var e,n,i=[];for(e in t)({}).hasOwnProperty.call(t,e)&&(n=t[e],i.push(this.setOption(e,n)));return i},e.prototype.addFrame=function(t,e){var n,i;null==e&&(e={}),n={},n.transparent=this.options.transparent;for(i in a)n[i]=e[i]||a[i];if(null!=this.options.width||this.setOption("width",t.width),null!=this.options.height||this.setOption("height",t.height),"undefined"!=typeof ImageData&&null!=ImageData&&t instanceof ImageData)n.data=t.data;else if("undefined"!=typeof CanvasRenderingContext2D&&null!=CanvasRenderingContext2D&&t instanceof CanvasRenderingContext2D||"undefined"!=typeof WebGLRenderingContext&&null!=WebGLRenderingContext&&t instanceof WebGLRenderingContext)e.copy?n.data=this.getContextData(t):n.context=t;else{if(null==t.childNodes)throw Error("Invalid image");e.copy?n.data=this.getImageData(t):n.image=t}return this.frames.push(n)},e.prototype.render=function(){var t;if(this.running)throw Error("Already running");if(null==this.options.width||null==this.options.height)throw Error("Width and height must be set prior to rendering");this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=function(t){for(var e=0,n=function(){var t;t=[];for(var e=0;0<=this.frames.length?e<this.frames.length:e>this.frames.length;0<=this.frames.length?++e:--e)t.push(e);return t}.apply(this,arguments).length;e<n;++e)t.push(null);return t}.call(this,[]),t=this.spawnWorkers();for(var e=0,n=function(){var e;e=[];for(var n=0;0<=t?n<t:n>t;0<=t?++n:--n)e.push(n);return e}.apply(this,arguments).length;e<n;++e)this.renderNextFrame();return this.emit("start"),this.emit("progress",0)},e.prototype.abort=function(){for(var t;t=this.activeWorkers.shift(),!(null==t);)console.log("killing active worker"),t.terminate();return this.running=!1,this.emit("abort")},e.prototype.spawnWorkers=function(){var t;return t=Math.min(this.options.workers,this.frames.length),function(){var e;e=[];for(var n=this.freeWorkers.length;this.freeWorkers.length<=t?n<t:n>t;this.freeWorkers.length<=t?++n:--n)e.push(n);return e}.apply(this,arguments).forEach(function(t){return function(e){var n;return console.log("spawning worker "+e),n=new Worker(t.options.workerScript),n.onmessage=function(t){return function(e){return t.activeWorkers.splice(t.activeWorkers.indexOf(n),1),t.freeWorkers.push(n),t.frameFinished(e.data)}}(t),t.freeWorkers.push(n)}}(this)),t},e.prototype.frameFinished=function(t){console.log("frame "+t.index+" finished - "+this.activeWorkers.length+" active"),this.finishedFrames++,this.emit("progress",this.finishedFrames/this.frames.length),this.imageParts[t.index]=t;t:{for(var t=this.imageParts,e=0,n=t.length;e<n;++e)if(e in t&&null===t[e]){t=!0;break t}t=!1}return t?this.renderNextFrame():this.finishRendering()},e.prototype.finishRendering=function(){var t,e,n,i,r,o,a;for(t=r=0,o=this.imageParts.length;t<o;++t)e=this.imageParts[t],r+=(e.data.length-1)*e.pageSize+e.cursor;r+=e.pageSize-e.cursor,console.log("rendering finished - filesize "+Math.round(r/1e3)+"kb"),t=new Uint8Array(r),o=0,r=0;for(var s=this.imageParts.length;r<s;++r){e=this.imageParts[r];for(var h=0,u=e.data.length;h<u;++h)a=e.data[h],n=h,t.set(a,o),o+=n===e.data.length-1?e.cursor:e.pageSize}return i=new Blob([t],{type:"image/gif"}),this.emit("finished",i,t)},e.prototype.renderNextFrame=function(){var t,e,n;if(0===this.freeWorkers.length)throw Error("No free workers");return this.nextFrame>=this.frames.length?void 0:(t=this.frames[this.nextFrame++],n=this.freeWorkers.shift(),e=this.getTask(t),console.log("starting frame "+(e.index+1)+" of "+this.frames.length),this.activeWorkers.push(n),n.postMessage(e))},e.prototype.getContextData=function(t){return t.getImageData(0,0,this.options.width,this.options.height).data},e.prototype.getImageData=function(t){var e;return null!=this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.width=this.options.width,this._canvas.height=this.options.height),e=this._canvas.getContext("2d"),e.setFill=this.options.background,e.fillRect(0,0,this.options.width,this.options.height),e.drawImage(t,0,0),this.getContextData(e)},e.prototype.getTask=function(t){var e,n;if(e=this.frames.indexOf(t),n={index:e,last:e===this.frames.length-1,delay:t.delay,transparent:t.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,repeat:this.options.repeat,canTransfer:"chrome"===i.name},null!=t.data)n.data=t.data;else if(null!=t.context)n.data=this.getContextData(t.context);else{if(null==t.image)throw Error("Invalid frame");n.data=this.getImageData(t.image)}return n},e}(o),t.exports=s}),e.define("/browser.coffee",function(t){var e,n,i,r,o;r=navigator.userAgent.toLowerCase(),i=navigator.platform.toLowerCase(),o=r.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,"unknown",0],n="ie"===o[1]&&document.documentMode,e={name:"version"===o[1]?o[3]:o[1],version:n||parseFloat("opera"===o[1]&&o[4]?o[4]:o[2]),platform:{name:r.match(/ip(?:ad|od|hone)/)?"ios":(r.match(/(?:webos|android)/)||i.match(/mac|win|linux/)||["other"])[0]}},e[e.name]=!0,e[e.name+parseInt(e.version,10)]=!0,e.platform[e.platform.name]=!0,t.exports=e}),e.define("events",function(t,e){n.EventEmitter||(n.EventEmitter=function(){});var i=e.EventEmitter=n.EventEmitter,r="function"==typeof Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};i.prototype.setMaxListeners=function(t){this._events||(this._events={}),this._events.maxListeners=t},i.prototype.emit=function(t){if("error"===t&&(!this._events||!this._events.error||r(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var e=this._events[t];if(!e)return!1;if("function"!=typeof e){if(r(e)){for(var n=Array.prototype.slice.call(arguments,1),e=e.slice(),i=0,o=e.length;i<o;i++)e[i].apply(this,n);return!0}return!1}switch(arguments.length){case 1:e.call(this);break;case 2:e.call(this,arguments[1]);break;case 3:e.call(this,arguments[1],arguments[2]);break;default:n=Array.prototype.slice.call(arguments,1),e.apply(this,n)}return!0},i.prototype.addListener=function(t,e){if("function"!=typeof e)throw Error("addListener only takes instances of Function");if(this._events||(this._events={}),this.emit("newListener",t,e),this._events[t])if(r(this._events[t])){if(!this._events[t].warned){var n;n=void 0!==this._events.maxListeners?this._events.maxListeners:10,n&&0<n&&this._events[t].length>n&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),console.trace())}this._events[t].push(e)}else this._events[t]=[this._events[t],e];else this._events[t]=e;return this},i.prototype.on=i.prototype.addListener,i.prototype.once=function(t,e){var n=this;return n.on(t,function i(){n.removeListener(t,i),e.apply(this,arguments)}),this},i.prototype.removeListener=function(t,e){if("function"!=typeof e)throw Error("removeListener only takes instances of Function");if(!this._events||!this._events[t])return this;var n=this._events[t];if(r(n)){var i=n.indexOf(e);if(0>i)return this;n.splice(i,1),0==n.length&&delete this._events[t]}else this._events[t]===e&&delete this._events[t];return this},i.prototype.removeAllListeners=function(t){return t&&this._events&&this._events[t]&&(this._events[t]=null),this},i.prototype.listeners=function(t){return this._events||(this._events={}),this._events[t]||(this._events[t]=[]),r(this._events[t])||(this._events[t]=[this._events[t]]),this._events[t]}}),t.GIF=e("/gif.coffee")}.call(this,this),function(){function r(t){return t&&t.Object===Object?t:null}function o(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function a(t){var e={};this.settings=t,this.on=function(t,n){e[t]=n},this.emit=function(t){var n=e[t];n&&n.apply(null,Array.prototype.slice.call(arguments,1))},this.filename=t.name||o(),this.mimeType=this.extension=""}function s(t){a.call(this,t),this.extension=".tar",this.mimeType="application/x-tar",this.fileExtension="",this.tape=null,this.count=0}function h(t){s.call(this,t),this.type="image/png",this.fileExtension=".png"}function u(t){s.call(this,t),this.type="image/jpeg",this.fileExtension=".jpg",this.quality=t.quality/100||.8}function c(t){"image/webp"!==document.createElement("canvas").toDataURL("image/webp").substr(5,10)&&console.log("WebP not supported - try another export format"),a.call(this,t),t.quality=t.quality/100||.8,this.extension=".webm",this.mimeType="video/webm",this.baseFilename=this.filename,this.frames=[],this.part=1}function f(t){a.call(this,t),t.quality=t.quality/100||.8,this.encoder=new FFMpegServer.Video(t),this.encoder.on("process",function(){this.emit("process")}.bind(this)),this.encoder.on("finished",function(t,e){var n=this.callback;n&&(this.callback=void 0,n(t,e))}.bind(this)),this.encoder.on("progress",function(t){this.settings.onProgress&&this.settings.onProgress(t)}.bind(this)),this.encoder.on("error",function(t){alert(JSON.stringify(t,null,2))}.bind(this))}function d(t){a.call(this,t),this.framerate=this.settings.framerate,this.type="video/webm",this.extension=".webm",this.mediaRecorder=this.stream=null,this.chunks=[]}function l(t){a.call(this,t),t.quality=31-(30*t.quality/100||10),t.workers=t.workers||4,this.extension=".gif",this.mimeType="image/gif",this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.sizeSet=!1,this.encoder=new GIF({workers:t.workers,quality:t.quality,workerScript:t.workersPath+"gif.worker.js"}),this.encoder.on("progress",function(t){this.settings.onProgress&&this.settings.onProgress(t)}.bind(this)),this.encoder.on("finished",function(t){var e=this.callback;e&&(this.callback=void 0,e(t))}.bind(this))}function p(t){function e(){function t(){return this._hooked||(this._hooked=!0,this._hookedTime=this.currentTime||0,this.pause(),V.push(this)),this._hookedTime+T.startTime}p("Capturer start"),w=window.Date.now(),v=w+T.startTime,b=window.performance.now(),y=b+T.startTime,window.Date.prototype.getTime=function(){return v},window.Date.now=function(){return v},window.setTimeout=function(t,e){var n={callback:t,time:e,triggerTime:v+e};return C.push(n),p("Timeout set to "+n.time),n},window.clearTimeout=function(t){for(var e=0;e<C.length;e++)C[e]==t&&(C.splice(e,1),p("Timeout cleared"))},window.setInterval=function(t,e){var n={callback:t,time:e,triggerTime:v+e};return _.push(n),p("Interval set to "+n.time),n},window.clearInterval=function(){return p("clear Interval"),null},window.requestAnimationFrame=function(t){O.push(t)},window.performance.now=function(){return y},Object.defineProperty(HTMLVideoElement.prototype,"currentTime",{get:t}),Object.defineProperty(HTMLAudioElement.prototype,"currentTime",{get:t})}function n(){A=!1,k.stop(),p("Capturer stop"),window.setTimeout=R,window.setInterval=U,window.clearTimeout=q,window.requestAnimationFrame=W,window.Date.prototype.getTime=H,window.Date.now=z,window.performance.now=N}function r(){R(a,0,void 0)}function o(){var t=F/T.framerate;(T.frameLimit&&F>=T.frameLimit||T.timeLimit&&t>=T.timeLimit)&&(n(),s());var e=new Date(null);e.setSeconds(t),L.textContent=2<T.motionBlurFrames?"CCapture "+T.format+" | "+F+" frames ("+j+" inter) | "+e.toISOString().substr(11,8):"CCapture "+T.format+" | "+F+" frames | "+e.toISOString().substr(11,8)}function a(){var t=(F+j/T.motionBlurFrames)*(1e3/T.framerate);v=w+t,y=b+t,V.forEach(function(e){e._hookedTime=t/1e3}),o(),p("Frame: "+F+" "+j);for(var e=0;e<C.length;e++)v>=C[e].triggerTime&&(R(C[e].callback,0,void 0),C.splice(e,1));for(e=0;e<_.length;e++)v>=_[e].triggerTime&&(R(_[e].callback,0,void 0),_[e].triggerTime+=_[e].time);O.forEach(function(t){R(t,0,v-x)}),O=[]}function s(t){t||(t=function(t){return i(t,k.filename+k.extension,k.mimeType),!1}),k.save(t)}function p(t){g&&console.log(t)}function m(t){var e=E[t];e&&e.apply(null,Array.prototype.slice.call(arguments,1))}var g,v,w,y,b,k,T=t||{},C=[],_=[],F=0,j=0,O=[],A=!1,E={};T.framerate=T.framerate||60,T.motionBlurFrames=2*(T.motionBlurFrames||1),g=T.verbose||!1,T.step=1e3/T.framerate,T.timeLimit=T.timeLimit||0,T.frameLimit=T.frameLimit||0,T.startTime=T.startTime||0;var L=document.createElement("div");L.style.position="absolute",L.style.left=L.style.top=0,L.style.backgroundColor="black",L.style.fontFamily="monospace",L.style.fontSize="11px",L.style.padding="5px",L.style.color="red",L.style.zIndex=1e5,T.display&&document.body.appendChild(L);var S,I,D=document.createElement("canvas"),M=D.getContext("2d");p("Step is set to "+T.step+"ms");var t={gif:l,webm:c,ffmpegserver:f,png:h,jpg:u,"webm-mediarecorder":d},P=t[T.format];if(!P)throw"Error: Incorrect or missing format: Valid formats are "+Object.keys(t).join(", ");if(k=new P(T),k.step=r,k.on("process",a),k.on("progress",function(t){m("progress",t)}),0=="performance"in window&&(window.performance={}),Date.now=Date.now||function(){return(new Date).getTime()},0=="now"in window.performance){var B=Date.now();performance.timing&&performance.timing.navigationStart&&(B=performance.timing.navigationStart),window.performance.now=function(){return Date.now()-B}}var R=window.setTimeout,U=window.setInterval,q=window.clearTimeout,W=window.requestAnimationFrame,z=window.Date.now,N=window.performance.now,H=window.Date.prototype.getTime,V=[];return{start:function(){e(),k.start(),A=!0},capture:function(t){if(A)if(2<T.motionBlurFrames){for(D.width===t.width&&D.height===t.height||(D.width=t.width,D.height=t.height,S=new Uint16Array(4*D.height*D.width),M.fillStyle="#0",M.fillRect(0,0,D.width,D.height)),M.drawImage(t,0,0),I=M.getImageData(0,0,D.width,D.height),t=0;t<S.length;t+=4)S[t]+=I.data[t],S[t+1]+=I.data[t+1],S[t+2]+=I.data[t+2];if(j++,j>=.5*T.motionBlurFrames){for(var t=I.data,e=0;e<S.length;e+=4)t[e]=2*S[e]/T.motionBlurFrames,t[e+1]=2*S[e+1]/T.motionBlurFrames,t[e+2]=2*S[e+2]/T.motionBlurFrames;for(M.putImageData(I,0,0),k.add(D),F++,j=0,p("Full MB Frame! "+F+" "+v),e=0;e<S.length;e+=4)S[e]=0,S[e+1]=0,S[e+2]=0;gc()}else r()}else k.add(t),F++,p("Full Frame! "+F)},stop:n,save:s,on:function(t,e){E[t]=e}}}var m={function:!0,object:!0},g=m[typeof n]&&n&&!n.nodeType?n:void 0,v=m[typeof e]&&e&&!e.nodeType?e:void 0,w=v&&v.exports===g?g:void 0,y=r(g&&v&&"object"==typeof t&&t),b=r(m[typeof self]&&self),k=r(m[typeof window]&&window),m=r(m[typeof this]&&this),y=y||k!==(m&&m.window)&&k||b||m||Function("return this")();"gc"in window||(window.gc=function(){}),HTMLCanvasElement.prototype.toBlob||Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(t,e,n){for(var n=atob(this.toDataURL(e,n).split(",")[1]),i=n.length,r=new Uint8Array(i),o=0;o<i;o++)r[o]=n.charCodeAt(o);t(new Blob([r],{type:e||"image/png"}))}}),function(){if(0=="performance"in window&&(window.performance={}),Date.now=Date.now||function(){return(new Date).getTime()},0=="now"in window.performance){var t=Date.now();performance.timing&&performance.timing.navigationStart&&(t=performance.timing.navigationStart),
window.performance.now=function(){return Date.now()-t}}}();var x=window.Date.now();a.prototype.start=function(){},a.prototype.stop=function(){},a.prototype.add=function(){},a.prototype.save=function(){},a.prototype.dispose=function(){},a.prototype.safeToProceed=function(){return!0},a.prototype.step=function(){console.log("Step not set!")},s.prototype=Object.create(a.prototype),s.prototype.start=function(){this.dispose()},s.prototype.add=function(t){var e=new FileReader;e.onload=function(){this.tape.append(("0000000"+this.count).slice(-7)+this.fileExtension,new Uint8Array(e.result)),this.count++,this.step()}.bind(this),e.readAsArrayBuffer(t)},s.prototype.save=function(t){t(this.tape.save())},s.prototype.dispose=function(){this.tape=new Tar,this.count=0},h.prototype=Object.create(s.prototype),h.prototype.add=function(t){t.toBlob(function(t){s.prototype.add.call(this,t)}.bind(this),this.type)},u.prototype=Object.create(s.prototype),u.prototype.add=function(t){t.toBlob(function(t){s.prototype.add.call(this,t)}.bind(this),this.type,this.quality)},c.prototype=Object.create(a.prototype),c.prototype.start=function(){this.dispose()},c.prototype.add=function(t){this.frames.push(t.toDataURL("image/webp",this.quality)),0<this.settings.autoSaveTime&&this.frames.length/this.settings.framerate>=this.settings.autoSaveTime?this.save(function(t){this.filename=this.baseFilename+"-part-"+("0000000"+this.part).slice(-7),i(t,this.filename+this.extension,this.mimeType),this.dispose(),this.part++,this.filename=this.baseFilename+"-part-"+("0000000"+this.part).slice(-7),this.step()}.bind(this)):this.step()},c.prototype.save=function(t){if(this.frames.length){var e=Whammy.fromImageArray(this.frames,this.settings.framerate),e=new Blob([e],{type:"octet/stream"});t(e)}},c.prototype.dispose=function(){this.frames=[]},f.prototype=Object.create(a.prototype),f.prototype.start=function(){this.encoder.start(this.settings)},f.prototype.add=function(t){this.encoder.add(t)},f.prototype.save=function(t){this.callback=t,this.encoder.end()},f.prototype.safeToProceed=function(){return this.encoder.safeToProceed()},d.prototype=Object.create(a.prototype),d.prototype.add=function(t){this.stream||(this.stream=t.captureStream(this.framerate),this.mediaRecorder=new MediaRecorder(this.stream),this.mediaRecorder.start(),this.mediaRecorder.ondataavailable=function(t){this.chunks.push(t.data)}.bind(this)),this.step()},d.prototype.save=function(t){this.mediaRecorder.onstop=function(){var e=new Blob(this.chunks,{type:"video/webm"});this.chunks=[],t(e)}.bind(this),this.mediaRecorder.stop()},l.prototype=Object.create(a.prototype),l.prototype.add=function(t){this.sizeSet||(this.encoder.setOption("width",t.width),this.encoder.setOption("height",t.height),this.sizeSet=!0),this.canvas.width=t.width,this.canvas.height=t.height,this.ctx.drawImage(t,0,0),this.encoder.addFrame(this.ctx,{copy:!0,delay:this.settings.step}),this.step()},l.prototype.save=function(t){this.callback=t,this.encoder.render()},(k||b||{}).CCapture=p,"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return p}):g&&v?(w&&((v.exports=p).CCapture=p),g.CCapture=p):y.CCapture=p}()}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(t,e,n){e.exports=function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]}},{}],8:[function(t,e,n){"use strict";function i(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}function r(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;var i=Object.getOwnPropertyNames(e).map(function(t){return e[t]});if("0123456789"!==i.join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(t){r[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(t){return!1}}var o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=r()?Object.assign:function(t,e){for(var n,r,s=i(t),h=1;h<arguments.length;h++){n=Object(arguments[h]);for(var u in n)o.call(n,u)&&(s[u]=n[u]);if(Object.getOwnPropertySymbols){r=Object.getOwnPropertySymbols(n);for(var c=0;c<r.length;c++)a.call(n,r[c])&&(s[r[c]]=n[r[c]])}}return s}},{}]},{},[2]);