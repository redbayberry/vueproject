<template>
<div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
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
        <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
        <div v-for="(ball,index) in balls">
          <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>        
          </transition>
        </div>
    </div>
    <transition name="fold"> 
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>    
      </div>
    </transition>
  </div>
  <transition name="fade">
  <div class="list-mask" v-show="listShow" @click='hideList'></div>
  </transition>
</div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
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
      transition: all 1s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius:50%
        background: rgb(0,160,220)
        transition: all 1s linear
        
  .shopcart-list
    position: absolute
    left: 0 
    top: 0
    z-index: -1
    width: 100%
    transform: translate3d(0,-100%,0)
    &.fold-enter-active,&.fold-leave-active
      transition: all 0.5s
    &.fold-enter,&.fold-leave-active
      transform: translate3d(0,0,0)
    .list-header
      padding: 0 18px
      height: 40px
      line-height: 40px
      background: #f3f5f7      
      font-weight: 200
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 14px
        color: rgb(7,17,27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0,160,220)
    .list-content
      padding: 0 18px
      max-height: 217px// 指定最大高度
      background: #fff
      overflow: hidden
      .food
        position: relative
        padding: 12px 0
        color: rgb(7,17,27)
        border-1px(rgba(7,17,27,0.1))
        .name
          font-size: 14px
          line-height: 24px
        .price
          position: absolute
          line-height: 24px
          right: 90px
          bottom: 12px
          color: rgb(240,20,20)
          font-weight: 700
        .cartcontrol-wrapper
          position: absolute
          right: 0px
          bottom: 6px
.list-mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 40
  backdrop-filter: blur(10px)
  background: rgba(7,17,27,0.6)
  &.fade-enter-active,&.fade-leave-active
    transition: all 0.5s
  &.fade-enter,&.fade-leave-active
    opacity: 0
    background: rgba(7,17,27,0)
     
</style>
<script>
import cartcontrol from 'components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
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
      dropballs: [], // 下落的小球
      fold: true// 默认折叠
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
    },
    listShow() {
      // 当没有选中商品时
      if (!this.totalCount) {
        this.fold = true
        return false// 默认是折叠的
      }
      let show = !this.fold
      if (show) {
        // 难道每次重新渲染的时候都要新建一个BScroll吗，所以需要判断一下
        if (!this.scroll) {
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
            // console.log(this.scroll)
          })
        } else {
          this.$nextTick(() => {
            this.scroll.refresh()
          })
        }
      }
      return show
    }
  },
  methods: {
    drop(el) {
      // 这里面的el是从别的组件传过来的加号的dom
      // console.log(el)
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) { // 查询小球的状态，如果是false,没有显示，那就变成true，只要找到一个球了就返回
          ball.show = true// 小球的状态变为true,通过这句话触发动画
          ball.el = el// 保存小球出发的地方的dom元素
          this.dropballs.push(ball)// 将要掉下去的球状态保存起来
          return
        }
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return
      } else {
        this.fold = !this.fold
      }
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList() {
      this.fold = true
    },
    pay() {
      window.alert(`需要付款${this.totalPrice}`)
    },
    beforeEnter(el) {
      console.log('before')
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) { // 前面drop里已经将一个小球的show变成true了
          console.log('sss')
          // getBoundingClientRect是dom元素到浏览器可视范围的距离，不包括滚动卷起的部分
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32// x方向的偏移，32是小球落入点与下边的距离
          let y = -(window.innerHeight - rect.top - 22)// y 的偏移
          console.log(x, y)
          el.style.display = ''// 小球显示
          el.style.webkitTransform = `translate3D(0,${y}px,0)`// 外层元素作y方向上的动画
          el.style.tmransform = `translate3D(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3D(${x}px,0,0)`
          inner.style.transform = `translate3D(${x}px,0,0)`
        }
      }
    },
    // 加了参数done()结果不出来，去掉后仍然可以进入afterEnter
    enter(el) {
      console.log('enter')
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight// 主要是引起浏览器重绘
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3D(0,0,0)'// 外层元素作y方向上的动画
        el.style.transform = 'translate3D(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3D(0,0,0)'
        inner.style.transform = 'translate3D(0,0,0)'
        // el.addEventListener('transitioned', done)
        // done()
      })
    },
    afterEnter(el) {
      console.log('after')
      let ball = this.dropballs.shift()
      if (ball) { // 动画完成后回到最初的状态，show变成false
        ball.show = false
        el.style.display = 'none'
      }
      el.style.transition = ''
      el.style.webkitTransition = ''
      let inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transition = ''
      inner.style.webkitTransition = ''
    }
  },
  components: {
    cartcontrol
  }
}
</script>
