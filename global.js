//全局JS，适用PC和App
//LengJun 2017-3-27
/*
* 目前只有来源追踪功能，
* 	URL追踪：获取URL的参数并添加到所有带有“a-url”class的a链接上。
* 	站内页面追踪：获取当前页的html名称并添加到所有带有“a-url”class的a链接上。
*
* */
;(function(){
	//页面与页面之间的专跳。
	//获取html的文件名
	function URLhtmName(){
		var test = window.location.href;
		test = test.split('/');
		var nameArr =test[test.length-1];
		if(nameArr==""){
			return;
		}
		var hName = nameArr.match(/(\S*).htm/)[1]
		return hName;
	}
	//获取url中的参数
	function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
	function initialTrack(){
		var urlsw = getQueryString('sw');
		var urlsa = getQueryString('sa');
		var htmName =URLhtmName();
		$('a.a-url').each(function(){
			var aurl = this.href;
			var thisd =this;
			if (urlsw != null && urlsa != null){
				var param = 'sw=' + urlsw + '&sa=' + urlsa + '&hName=' + htmName;
				addURLPara(thisd,aurl,param);
			}else{
                var param ='hName=' + htmName;
				addURLPara(thisd,aurl,param);
			}
		});
	}
	function addURLPara(thisd,aurl,param){
		var q = aurl.indexOf('?');
		var hash = aurl.indexOf('#');
		if (q >= 0){
			if (hash >= 0) {
				var sp = aurl.split('#');
				thisd.href = sp[0] + '&' + param + '#' + sp[1];
			} else {
				thisd.href = aurl + '&' + param;
			}
		} else{
			if (hash >= 0) {
				var sp = aurl.split('#');
				thisd.href = sp[0] + '?' + param + '#' + sp[1];
			} else {
				thisd.href = aurl + '?' + param;
			}
		}
	}
	function addhidden(){
		var urlhName = getQueryString('hName');
		if(urlhName != null){
			var hiddenHtm ="<input type='hidden' id='urlHName' value='" + urlhName + "'>";
			$('body').prepend(hiddenHtm);
		}else{
			return;
		}
	}
	//运行a标签监听
	initialTrack();
	//将来源放入input
	addhidden();
})();
