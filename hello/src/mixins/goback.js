/**
 * 兼容app，判断是后退还是关闭页面
 */

export default {
  beforeRouteEnter(to, from, next) {
    // this.pageFrom = from;
    next(vm => {
      vm.$data.$pageFrom = from;
      // mixins next执行顺序有问题
      window.backPressed = window.backPressed || vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    // app跳转到最后一页需要关闭webview
    window.backPressed = undefined;
    next();
  },
  data() {
    return {
      $pageFrom: null
    };
  },
  methods: {
    goBack() {
      let pageFrom = this.$data.$pageFrom;
      this.currHash = window.location.hash;
      setTimeout(() => {
        var currHash = window.location.hash;
        if(currHash == this.currHash && window.appMethod) {
          appMethod.closeWebPage();
        }
      }, 300);
      if ((pageFrom && pageFrom.matched.length) || history.length>1) {
        this.$router.back();
      } else {
        if (appMethod && appMethod.closeWebPage) {
          appMethod.closeWebPage();
        } else {
          history.go(-1);
        }
      }
    }
  }
};