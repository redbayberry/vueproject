<template>
  <div class="cartcontrol">
  <!-- 左右的加减都是字体 -->
    <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>
<script>
// 但是为什么要重新引入vue呢
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      // 会输出2个event，都是mouseEvent，有一个event的_constructed是true
      console.log(event)
      if (!event._constructed) {
        return
      }
      console.log('click')
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('addCart', event.target)
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>
<style lang="stylus">
.cartcontrol
  font-size: 0 // 让空格引起的间隙为0
  .cart-decrease
    display: inline-block
    padding: 6px// 增加加减号的点击区域，同时又不让样式发生变化, 
    &.move-enter-active,&.move-leave-active
      transition: all 0.3s linear
      .inner
        display: inline-block
        transform: rotate(0)
        transition: all 0.3s linear
    &.move-enter,&.move-leave-active
      opacity: 0
      transform: translate3D(24px,0,0)// 用translate3D是为了用硬件加速
      .inner
        transform: rotate(180deg)
    .inner
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)           
  .cart-count
    display: inline-block
    width: 12px // 减去加减号两边的padding，就剩下12px了]
    vertical-align: top
    padding-top: 6px
    font-size: 10px
    line-height: 24px
    text-align: center
    color: rgb(147,153,159)
  .cart-add
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0,160,220)
</style>
