/*
 * 工具方法
 */
import { mill2hms } from 'app/utils/cms/timeOperator';
// 函数节流相关方法
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';


/**
  * [数字保证小数位]
  */
export const numToFixed = (num, digit = 2) => {
  const _num = parseFloat(num);
  if (_num) {
    return _num.toFixed(digit);
  } else {
    return '0.00';
  }
};

// 只覆盖obj存在的字段
export const safeAssign = (obj, obj2) => {
  var isObject = obj => Object.prototype.toString.apply(obj) === '[object Object]';
  if (!isObject(obj) || !isObject(obj2)) {
    return;
  }
  let keys = Object.keys(obj2);
  Object.keys(obj).forEach((key1) => {
    if (keys.indexOf(key1) >= 0) {
      // 对象递归
      if(isObject(obj[key1])) {
          safeAssign(obj[key1], obj2[key1]);
      } else if(obj2[key1] !== undefined){
          obj[key1] = obj2[key1];
      }
    }
  });
};


export {throttle, debounce};

// defer形式promise
export const promiseDefer = function() {
  var ret = {};
  let dfd = new Promise(function(resolve, reject) {
      ret.resolve = resolve;
      ret.reject = reject;
  });
  ret.promise = dfd
  return ret;
};

/*
  countDownTime 倒计时时长
  onUpdate  倒计时更新的回调
*/
export class CountDown {
  constructor(data) {
    if(data) {
      this.start(data);
    }
  }

  init({countDownTime, onUpdate}) {
    this.timer = null;
    this.countDownTime = countDownTime || 0;
    this.startClientTime = new Date().getTime();
    this.onUpdate = onUpdate || function() {};
  }

  stop() {
    clearTimeout(this.timer);
  }

  start(data) {
    this.stop();
    this.init(data);
    this._start();
  }

  _start() {
    const EMPTY = {
      h: '00', m: '00', s: '00',
      countDownTime: 0
    };
    if(!this.countDownTime || this.countDownTime<=0) {
      return;
    }

    // 时间加0补齐
    var t2str = function(value) {
      const v = +value;
      return v > 9 ? value : `0${value}`;
    };

    var func = () => {
      const diff = new Date().getTime() - this.startClientTime;
      const currDiff = this.countDownTime - diff;
      // 倒计时结束，刷新商品状态
      if (currDiff < 0) {
        this.onUpdate(EMPTY);
        return;
      }

      let countDownTime = Math.max(currDiff, 0);
      const hms = mill2hms(countDownTime);
      this.onUpdate({
        h: t2str(hms.hour), m: t2str(hms.minute), s: t2str(hms.sec),
        countDownTime: countDownTime
      });

      this.timer = setTimeout(func, 300);
    };
    func();
  }
};

// polyfill以防没有
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(val) {
      return this.indexOf(val) != -1;
    }
  });
}
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(check) {
      let index = -1;
      if(!this) {
        throw new TypeError('this is null or not defined');
      }
      if(typeof check == 'function') {
        for(var i=0, len=this.length; i<len; i++) {
          if(check(this[i])) {
            index = i;
            break;
          }
        }
      } else {
        throw new TypeError(`${check} is not founction`);
        return;
      }
      return index;
    }
  });
}
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    value: function(str) {
      if(!this) {
        throw new TypeError('this is null or not defined');
      }
      let index = -1;
      index = this.indexOf(str);
      return index === 0;
    }
  });
}
// 删除数组中某个元素
Object.defineProperty(Array.prototype, 'remove', {
  value: function(val) {
    let index = -1;
    if(typeof val == 'function') {
      index = this.findIndex(val);
    } else {
      index = this.findIndex((v) => {
        return v == val;
      });
    }
    if(index !== -1) {
      return this.splice(index, 1);
    }
    return null;
  }
});
