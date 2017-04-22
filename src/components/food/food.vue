<template>
<transition name="move">
  <div class="food" v-show="showFlag" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @addCart="addFood"></cartcontrol>       
        </div>
        <!-- 没有count这个属性或者count等于0的时候 - 是一点击就隐藏了，所以加个动画，为了得到这个元素 -->
        <transition name="fade">
          <div @click.stop="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
        </transition>
      </div>
      <split v-show="food.info"></split>
      <!-- 有的food没有info -->
      <div class="info" v-show="food.info">
        <h1 class="title">{{food.name}}</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @select="selectRating" @content="toggleContent"></ratingselect>
        <div class="rating-wrapper">
        <!-- 有评价时 -->
          <ul v-show="food.ratings && food.ratings.length">
            <li v-for="rating in food.ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">          
              <div class="user">
                <span class="username">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <!-- 没有评价时的文案 -->
          <div class="no-rating" v-show="!food.ratings">暂无评价</div>
        </div>
      </div>     
    </div>   
  </div>
  </transition>
</template>
<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
// export default 就不需要大括号，export一个函数，就需要要大括号
import {formatDate} from 'common/js/date'
import ratingselect from 'components/ratingselect/ratingselect'
import split from 'components/split/split'
import Vue from 'vue'
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    food: Object
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    // 如果方法是私有的，可以加下划线
    // show方法实在goods里面调用的
    show() {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        console.log(this.$refs.food)
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    addFirst(event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.food, 'count', 1)
      this.$emit('addCart', event.target)
    },
    addFood(target) {
      this.$emit('addCart', target)
    },
    selectRating(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
      console.log('selectType')
    },
    toggleContent() {
      // 因为我们改变选择的时候，dom改变了，以前滚动到的位置会不对，所以在DOM更新后在把scroll更新下
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow(type, text) {
      // 如果只显示内容选中，那么没有内容的就不显示
      if (this.onlyContent && !text) {
        return false
      }
      // 剩下的就是不选中只显示按钮时，全部的话就都显示，返回true，为推荐或吐槽是，rateType与当前内容相同时则返回true
      if (this.selectType === ALL) {
        return true
      } else {
        return this.selectType === type
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      // 把一些通过的方法放在一个模块里面
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin"
// 相对与整个屏幕定位，覆盖了整个屏幕
.food
  position: fixed
  top: 0
  left: 0
  bottom: 48px
  width: 100%
  background: #fff
  // z-index要低于list-mask
  z-index: 30
  transform:translate3d(0, 0, 0)
  &.move-enter-active,&.move-leave-active
    transition: all 0.2s linear
  &.move-enter,&.move-leave-active
    transform: translate3d(100%, 0, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    // 给padding设置百分比的时候，是以盒子的宽度为基准的
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff      
  .content
    padding: 18px
    position: relative
    .title
      lin-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7,17,27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      font-size: 0
      color: rgb(147,153,159)
      .sell-count,.rating
        font-size: 10px
      .sell-count
        margin-right: 12px
    .price
      line-height: 24px
      font-weight: 700
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240,20,20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147,153,159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      background: rgb(0, 160, 220)
      color: #fff
      &.fade-enter-active,&.fade-leave-active
        transition: all 0.2s
      &.fade-enter,&.fade-leave-active
        opacity: 0
  .info
    padding: 18px
    .title
      line-height: 14px
      font-size: 14px
      margin-bottom: 6px
      color: rgb(7,17,27)
    .text
      padding: 0 8px
      line-height: 24px
      font-size: 12px
      font-weight: 200
      color: rgb(77,85,93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7,17,27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .username
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            display: inline-block
            vertical-align: middle
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7,17,27)
          .icon-thumb_up,.icon-thumb_down
            display: inline-block
            vertical-align: middle
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0,160,220)
          .icon-thumb_down
            color: rgb(147,153,159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147,153,159)
          
    
            
                   
      
</style>
