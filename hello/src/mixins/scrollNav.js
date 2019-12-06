/**
 *  滚动导航公共逻辑
    1. 使用nav-key属性标记nav头与nav体
    2. nav头监听click方法navClick
    3. 需要调用 navScrollInit 传递必要参数
 */

export default {
  data() {
    return {
      navActiveKey: '' // 当前选择的类
    };
  },
  watch: {
    navActiveKey(n) {
      // 只在点击导航时监听
      if(this.fromClick) {
        let curr = this.navItems.find(item => item.key == n);
        if(curr) {
          this.navScrollTo({
            top: curr.el.offsetTop+ this.navOffset,
            behavior: this.navAnimate && 'smooth'
          });
        } else {
          this.fromClick = false;
        }
      }

      this.navs.forEach(item => {
        if(item.key == n) {
          item.el.classList.add('active');
        } else {
          item.el.classList.remove('active');
        }
      });
    }
  },
  created() {
    this.navs = [];
    this.navItems = [];
    this.navLastScrollTime = null;
  },
  deactivated() {
    this.navActiveKey = "";
  },
  methods: {
    // 点击导航
    navClick(evt) {
      let key = typeof evt == 'string'? evt:
        evt.currentTarget.getAttribute(this.navAttrName);
      if(key === this.navActiveKey) {
        return;
      }
      this.fromClick = true;
      this.navActiveKey = key;
    },
    // 记录定位元素的坐标
    navRefreshItem() {
      let curr = new Date().getTime();
      let diff = curr - (this.navLastScrollTime || 0);
      let diff2 = curr - (this.navLastHeightCalTime || 0);
      if(diff2>300) {
        this.navScrollTopMax = this.scrollEl.scrollHeight - this.scrollEl.offsetHeight;
        this.navLastHeightCalTime = curr;
      }

      // 短时间大量修改抛弃
      if(diff<=2000) {
        return;
      }

      // 提取包含定位属性navAttrName的元素，保存到数组
      let navAttr2Arr = (container) => {
        return Array.prototype.filter.call(container.children, item => {
          return item.getAttribute(this.navAttrName);
        }).map(item => {
          return {
            key: item.getAttribute(this.navAttrName),
            el: item
          };
        });
      };

      // 导航栏元素
      this.navs = navAttr2Arr(this.navTopEl);
      // 定位元素
      this.navItems = navAttr2Arr(this.navItemWrapperEl);

      this.navLastScrollTime = curr;
      this.navItems.forEach(item => {
        item.top = item.el.offsetTop+ this.navOffset;
      });
    },
    // polyfill 滚动动画
    navScrollTo({top, behavior}) {
      if(behavior != 'smooth' || !window.requestAnimationFrame) {
        this.scrollEl.scrollTop = top;
        return;
      }

      let start = this.scrollEl.scrollTop;
      let currTop = start;
      let diff = Math.round((top - currTop)/15);
      diff = diff>=0? Math.max(diff, 5): Math.min(diff, -5);
      let ant = () => {
        currTop = currTop + diff;
        currTop = start<=top? Math.min(currTop, top): Math.max(currTop, top);
        this.scrollEl.scrollTop = currTop;
        if(currTop == top) {
          this.fromClick = false;
          return;
        }
        this.navAniTimer = requestAnimationFrame(ant);
      };
      cancelAnimationFrame(this.navAniTimer);
      ant();

    },
    navMountScroll(evt) {
      let currScrollTop = evt.currentTarget.scrollTop;
      // 只在用户滚动时监听
      if(!this.fromClick) {
        // 每次滚动重新计算下坐标
        this.navRefreshItem();
        // 定位
        let idx = this.navItems.findIndex(item => currScrollTop<item.top);
        let len = this.navItems.length;
        let last = len - 1;
        idx = idx<0? last: Math.max(idx-1, 0);
        // 倒数第2个，此时如果接近底部，那么直接选倒数第一个
        if(idx == last - 1) {
          if(this.navScrollTopMax - currScrollTop<50) {
            idx = last
          }
        }
        this.navActiveKey = this.navItems[idx].key;
      }
    },
    /*
      navTopWrapper: 导航容器
      navItemWrapper: 内容容器
      scrollEl: 滚动容器
      offset: 定位偏移
      animate: 是否使用动画
    */
    navScrollInit({navTopWrapper, navItemWrapper, animate = true, offset = 0, scrollEl}) {
      if(!navTopWrapper || !navItemWrapper || !scrollEl) {
        throw new Error('导航参数缺失，需等待dom初始化完毕');
      }
      this.navAttrName = 'nav-key';
      this.navAnimate = animate;
      this.navTopEl = navTopWrapper;
      this.navItemWrapperEl = navItemWrapper;
      this.navOffset = offset;
      this.scrollEl = scrollEl;

      this.$nextTick(this.navRefreshItem);
      // 监听容器scroll
      this.scrollEl.removeEventListener('scroll', this.navMountScroll);
      this.scrollEl.addEventListener('scroll', this.navMountScroll);
    }
  }
};