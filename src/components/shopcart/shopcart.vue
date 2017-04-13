<template>
<div class="shopcart">
  <div class="content">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo" :class="{highlight:totalCount>0}">
          <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
        </div>
        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
      </div>
      <div class="price" :class="{highlight:totalPrice>0}">&yen;{{totalPrice}}</div>
      <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right">
      <div class="pay" :class="payClass">{{payDesc}}</div>
    </div>
  </div>
  <div class="ball-container">
    <div v-for="ball in balls" key="ball">
      <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>        
      </transition>
    </div>
  </div>
</div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.shopcart
  position: fixed
  left: 0
  bottom: 0
  width: 100%
  height: 48px
  z-index: 50
  .content
    display: flex
    background: #141d27
    font-size: 0
    color: rgba(255,255,255,0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        position: relative
        top: -10px
        width: 56px
        height:56px
        box-sizing: border-box
        vertical-align: top
        padding: 6px
        margin: 0 12px
        background: #141d27
        border-radius: 50%
        .logo
          width:100%
          height:100%
          background: #2b343c
          border-radius: 50%
          text-align: center
          &.highlight
            background: rgb(0,160,220)
          .icon-shopping_cart
            line-height: 44px
            font-size:24px
            color:#80858a
            &.highlight
              color: #fff       
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px          
          font-size: 9px
          font-weight: 700
          color: #fff
          z-index: 51 
          background: rgb(240,20,20)
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
      .price
        display: inline-block
        line-height: 24px // 为什么不直接写line-height，因为还有一个border-right
        vertical-align: top
        margin-top: 12px
        padding-right: 12px
        box-sizing: border-box
        border-right: 1px solid rgba(255,255,255,0.1)
        font-size: 16px
        font-weight: 700
        &.highlight
          color: #fff
      .desc
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 12px
        line-height: 24px
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        font-size: 12px
        font-weight: 700
        text-align: center
        &.not-enough
          background: #2b333b
        &.enough
          background: #008234
          color: #fff          
  .ball-container
    .ball
      position: fixed// 相对于视口作动画
      left: 32px
      bottom: 22px
      z-index: 200
      transition: all 5s linear
      // transition: all 5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius:50%
        background: rgb(0,0,0)
        transition: all 5s linear
      
        
</style>
<script>
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 10,
            count: 1
          }]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropballs: []// 下落的小球
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return `去结算`
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    }
  },
  methods: {
    drop(el) {
      // 这里面的el是从别的组件传过来的加号的dom
      // console.log(el)
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true// 小球的状态变为true,通过这句话触发动画
          ball.el = el// 保存小球出发的地方的dom元素
          this.dropballs.push(ball)
          return
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // getBoundingClientRect是dom元素到浏览器可视范围的距离，不包括滚动卷起的部分
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32// x方向的偏移，32是小球落入点与下边的距离
          let y = -(window.innerHeight - rect.top - 22)// y 的偏移
          el.style.display = ''// 小球显示
          el.style.webkitTransform = `translate3D(0,${y}px,0)`// 外层元素作y方向上的动画
          el.style.transform = `translate3D(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3D(${x}px,0,0)`
          inner.style.transform = `translate3D(${x}px,0,0)`
        }
      }
    },
    enter(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight// 主要是引起浏览器重绘
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3D(0,0,0)'// 外层元素作y方向上的动画
        el.style.transform = 'translate3D(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3D(0,0,0)'
        inner.style.transform = 'translate3D(0,0,0)'
        console.log(new Date())
        el.addEventListener('transitioned', done)
        done()
      })
    },
    afterEnter(el) {
      console.log(new Date())
      let ball = this.dropballs.shift()
      if (ball) {
        console.log('hhh')
        ball.show = false
        el.style.display = 'none'
      }
    }
  }
}
</script>
