<style lang="sass" scoped>
@import "~app/css/_config";
.scroll-view {
  position: relative;
  flex: auto;
  overflow-y: auto;
  transform: translate3d(0,0,0);
  .scroll-bottom {
    height: 1rem;
    font-size: 0.24rem;
    color: $text-remind;
    line-height: 1rem;
    text-align: center;
    img {
      display: inline-block; vertical-align: middle;
    }
    span {
      display: inline-block; vertical-align: middle;
      margin-left: .1rem;
    }
  }
}
</style>

<template>
  <div class="scroll-view" :style="evaStyle" @scroll="hanlderScroll">
    <slot></slot>
    <div class="scroll-bottom" v-if="withBottom">
      <p v-show="loading"><img src="~app/image/loading/loading.gif" width="24" /><span>加载中</span></p>
      <p v-show="finish"><span>-已经到底啦-</span></p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      background: String,
      withBottom: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      finish: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      evaStyle() {
        let _style = {};
        if (this.background) _style.backgroundColor = this.background;
        return _style;
      }
    },
    methods: {
      hanlderScroll(e) {
        this.$emit('onScroll', e);
        if (this.loading || this.finish) return false
        let ctn = e.currentTarget
        if (ctn.scrollTop+ ctn.offsetHeight > ctn.scrollHeight - 30) {
          this.$emit('loadData')
        }
      }
    }
  }
</script>