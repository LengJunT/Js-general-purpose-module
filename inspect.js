//抽取通用的表单验证
//LengJun 2017-3-16
/*作用，对表单进行验证成功返回true
*   参数设置：
*       data-insp="" 定义需要做那些验证，字符串，用“,”分隔
*           unNull：不为空验证;
*           length：长度验证；
*       data-length="" 定义长度范围，字符串，用“ , ”分隔
*           最多支持两位，“2,8”表示长度范围是2~8
*           如果是一位，表示最小长度。“10”，表示最小长度是10
*       data-tit="" 验证不通过的提示。
*       如：
*       <input type="text" name="n.tel" id="phoneNum" data-insp="unNull,length" data-length="3,3" data-tit="不能少於３"/>
*   外部调用：
*    var domID =[   传入需要验证的筛选条件。ID,class或者其他jquery筛选条件
*         '#phoneNum','#name','#companyName'
*        ]
*        var insp = new Inspect(domID); 将构造函数绑定到insp中并执行。
*        insp.result    result是验证的返回值，true为验证通过。
*    后期扩展：
*       可以直接在Inspect的原型上写验证函数。完成之后将调用方法写在types对象中即可。
*
*注：基于jquery的dome选择器和data方法。
*/
;(function(){
    var types = {'unNull':function(dome){
            return Inspect.prototype.unEmpty(dome);
        },
        'length':function(dome){
            console.log('length');
            return Inspect.prototype._length(dome);
        }};
    var Inspect =function (domID){
        this.result = this.init(domID);
    };
    
    Inspect.prototype = {
        constructor: Inspect,
        init: function(domID){
            return this._transfer(domID);
        },
        //中转站，根据dom节点上的设置判断需要哪些判断并执行相应的方法。
        _transfer: function(domID){
            var insState= false;
            var docLength = domID.length;
            for(var i=0;i < docLength; i++){
                var dome = $(domID[i]);
                var inspectType = dome.data("insp");
                if(inspectType ===undefined){
                    continue;
                }
                if(inspectType.indexOf(',')>0){
                    var inspectTypeArr = inspectType.split(',');
                }else{
                    var inspectTypeArr = inspectType;
                }
                var typeObg = types;
                console.log(inspectTypeArr);
                for(var a=0;a < inspectTypeArr.length; a++){
                    var keyInsp = inspectTypeArr[a];
                    if(typeof typeObg[keyInsp] != 'undefined'){
                        if(typeof typeObg[keyInsp] == "function"){
                           var state= typeObg[keyInsp](dome);
                           if(!state){
                                insState = false;
                                return false
                            }else{
                                insState = true;
                            }
                        }
                    }
                }
            }
            if(insState){
               return true;
            }else {
                return false;
            }
        },
        //不为空验证
        unEmpty: function(dome){
            var dataTyp ='unN';
                if( dome.val().trim() ==""){
                    this._insPrompt(dome,dataTyp);
                    return false;
                } else{
                    return true;
                }
        },
        //长度验证
        _length: function(dome){
            var dataTyp = 'tit';
            var domleng = dome.val().length;
            var domeInsParam = this._hasInsParam(dome,'length');
            if(domeInsParam == '' || domeInsParam == undefined){
                return true;
            }else if(typeof domeInsParam === "object"){
                if(domleng >= domeInsParam[0] && domleng <= domeInsParam[1]){
                    return true;
                }else {
                    this._insPrompt(dome,dataTyp);
                    return false;
                }
            }else if(typeof domeInsParam === "number"){
                if(domleng < domeInsParam){
                    this._insPrompt(dome,dataTyp);
                    return false;
                }else{
                    return true;
                }
            }
            return false;
        },
        //提示
        _insPrompt: function(dome,dataTyp){
            var prompTitle = this._hasInsParam(dome,dataTyp);
            this._popupTemp(prompTitle)
        },
        //验证参数
        _hasInsParam: function(dome,typeParam){
            var tParam = dome.data(typeParam);
            if(typeParam == 'length'){
                if(typeof tParam == "string"){
                    return tParam.split(',');
                }else {
                    return tParam;
                }
            }
            return tParam;
        },
        //提示模板
        _popupTemp:function (title) {
            var temp= '<div id="popErr" class="success-mask" style="z-index:20001;">'+
                            '<div class="success-content txt-center">'+
                            '<div class="txt-center err-title">'+title+'</div>'+
                            '<div class="btn btn-ok txt-center">确定</div>'+
                            '</div>'+
                        '</div>';
            $('body').append(temp);
            $('body').on('click','.btn-ok',function () {
                Inspect.prototype.removePopup('#popErr');
            })
        },
        //删除提示模板
        removePopup:function (popupId) {
            $(popupId).remove();
        }
    };
    window.Inspect = Inspect;
})();
