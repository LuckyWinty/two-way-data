;(function(){
    var Wue=function(params){
        this.el=document.querySelector(params.el);
        this.data=params.data;
        // this.els=this.getBindElement(el);
        this.init();
    };
    Wue.prototype={
        constructor:Wue,
        init:function(){
             this.bindText();
             this.bindModel();
        },
        defineObj:function(obj,prop,value){
          var val=value||'';
          var _that=this;

          try{
            Object.defineProperty(obj,prop,{
               get:function(){
                return val;
               },
               set:function(newVal){
                val=newVal;
                _that.bindText();
               }
            })

          }catch (err){
            console.log('Browser not support!')
          }  

        },
        // getBindElement:function(el){
        //     var directives={},
        //         childs=el.childNodes,
        //         len=childs.length;

        //     if(len){
        //         for(var i=0;i<len;i++){  //遍历每一个子元素
        //             ele=childs[i];
        //             if(ele.nodeType===1){  
        //                 for(var j=0;j<ele.attributes.length;j++){//遍历当前元素的所有属性
        //                     if(ele.attributes[j].nodeName.indexOf('w-')>=0){
        //                         if(directives[ele.attributes[j].nodeName]){
        //                             directives[ele.attributes[j].nodeName].push(ele);
        //                         }else{
        //                             directives[ele.attributes[j].nodeName]=[];
        //                             directives[ele.attributes[j].nodeName].push(ele);
        //                         }
        //                     }
        //                 }  
        //             }
        //         }
        //     }    
        //  return directives;
        // },
        bindText:function(){
          var textDOMs=this.el.querySelectorAll('[w-text]'),
          bindText;

          for(var i=0;i<textDOMs.length;i++){
             bindText=textDOMs[i].getAttribute('w-text');
             textDOMs[i].innerHTML=this.data[bindText]; 
          }
        },
        bindModel:function(){
          var modelDOMs=this.el.querySelectorAll('[w-model]'),
          bindModel;

          var _that=this;

          for(var i=0;i<modelDOMs.length;i++){
            bindModel=modelDOMs[i].getAttribute('w-model');

            modelDOMs[i].value=this.data[bindModel]||'';

            //数据劫持
            this.defineObj(this.data,bindModel);
            if(document.addEventListener){
                modelDOMs[i].addEventListener('keyup',function(event) {
                    console.log('test');
                    e=event||window.event;
                    _that.data[bindModel]=e.target.value;
                },false);
            }else{
                modelDOMs[i].attachEvent('onkeyup',function(event){
                    e=event||window.event;
                    _that.data[bindModel]=e.target.value;   
                },false);
            }
          }  
        }
    }
    window['Wue']=Wue;
})()