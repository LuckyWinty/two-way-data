(function(window, undefined) {
  var Hue = function(opt) {
    var el = document.querySelector(opt.el);
    var data = opt.data || {};
    return Hue.prototype.init(el, data);
  };

  Hue.prototype = {
    constructor: Hue,
         // 要实现类数组,必须要有这两个属性
    length: 0,
    splice: [].splice,

    init: function(el, data) {
      this.el = el;
      this.data = data;

      // 返回所有含有``h-*``属性的元素
      this.elems = this.bindNodesArr(el);
    
      this.bindText();
      this.bindModel();
      return this;
    },

    // 返回所有含有``h-*``属性的元素 [array]
    bindNodesArr: function(el) {
      var arr = [],
          childs = el.childNodes,
          len = childs.length,
          i, j,
          attr,
          lenAttr;
      if (len) {
        for (i = 0; i < len; i++) {
          el = childs[i];

          if (el.nodeType === 1) {
            for (j = 0, lenAttr = el.attributes.length; j < lenAttr; j++) {
              attr = el.attributes[j];
              if (attr.nodeName.indexOf('h-') >= 0) {
                arr.push(el);
                break;
              }
            }
            arr = arr.concat(this.bindNodesArr(el));
          }
        }
      }
      return arr;
    },
    // **前端数据劫持**
    defineObj: function(obj, prop, value) {
      var _value = value || '',
          _this = this;

      try {
        Object.defineProperty(obj, prop, {
          get: function() {
            return _value;
          },
          set: function(newVal) {
            _value = newVal;
            _this.bindText();
          },
          enumerable: true,
          configurable: true
        });
      } catch (error) {
        // IE8+ 才开始支持defineProperty,这也是Vue.js不支持IE8的原因
        console.log("Browser must be IE8+ !");
      }
    },

    bindModel: function() {
      var modelDOMs = this.el.querySelectorAll('[h-model]'),
          lenModel = modelDOMs.length;

      var _this = this,
          i,
            // h-model属性值
            propModel;

      for (i = 0; i < lenModel; i++) {
        propModel = modelDOMs[i].getAttribute('h-model');

        // 因为define model后, model值会为空显得不那么友好...  所以加这一段
        // tofix.........
        modelDOMs[i].value = this.data[propModel] || '';

        // 前端数据劫持
        this.defineObj(this.data, propModel);
        if (document.addEventListener) {
            // 这里不能是keydown, 否则model和text会有一个字符差bug，因为keydown时,e.target.value还未变化
          modelDOMs[i].addEventListener('keyup', function(e) {
            e = e || window.event;
            _this.data[propModel] = e.target.value;
          }, false);
        } else {
          modelDOMs[i].attachEvent('onkeyup', function(e) {
            e = e || window.event;
            _this.data[propModel] = e.target.value;
          }, false);
        }

      }
    },
    bindText: function() {
      var textDOMs = this.el.querySelectorAll('[h-text]'),
          lenText = textDOMs.length,
          prppText,
          j;

      for (j = 0; j < lenText; j++) {
        propText = textDOMs[j].getAttribute('h-text');
        textDOMs[j].innerHTML = this.data[propText] || '';
      }
    }
  }
  Hue.prototype.init.prototype = Hue.prototype;
  window.Hue = Hue;

})(window);
    // test...
Hue({
  el: '.app',
  data: {
    demo: '大轰大轰'
  }
});