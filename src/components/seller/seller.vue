<template>
  <div class="seller" ref="seller">
  	<div cass="seller-content">
     <div class="overview">
       <h1 class="title">{{seller.name}}</h1>
       <div class="desc">
         <star :size="36" :score="seller.score"></star>
         <span class="text">({{seller.ratingCount}})</span>
         <span class="text">月售{{seller.sellCount}}单</span>
       </div>
       <div class="favorite">
         <span class="icon-favorite" :class="{active:favorite}" @click="toggleFavorite"></span>
         <span class="text">{{favoriteText}}</span>
       </div>
       <ul class="remark">
         <li class="block">
           <h2>起送价</h2>
           <div class="content">
             <span class="stress">{{seller.minPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2>商家配送</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2>平均配送时间</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryTime}}</span>元
           </div>
         </li>
       </ul>
     </div>
     <split></split>
     <div class="bulletin">
       <h1 class="title">公告与活动</h1>
       <div class="content-wrapper border-1px">
         <p class="content">{{seller.bulletin}}</p>
       </div>
       <ul v-if="seller.supports" class="supports">
        <li class="support-item border-1px" v-for="(item,index) in seller.supports">
          <span class="icon" :class="classMap[item.type]"></span>
          <span class="text">{{item.description}}</span>
        </li>
       </ul>       
     </div>
     <split></split>
     <div class="pics">
       <h1 class="title">商家实景</h1>
       <div class="pic-list" ref="picWrapper">
        <ul ref="picList">
          <li v-for="pic in seller.pics" class="pic-item">
            <img :src="pic" alt="" width="120" height="90">
          </li>
        </ul> 
       </div>       
     </div> 
     <split></split>
     <div class="info">
       <h1 class="title border-1px">商家信息</h1>
       <ul class="info-list">
         <li v-for="info in seller.infos" class="info-item border-1px">{{info}}</li>
       </ul>
     </div>    
    </div>
  </div>
</template>
<script>
import star from 'components/star/star'
import split from 'components/split/split'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from 'common/js/store'
export default {
  props: {
    seller: Object
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  data() {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  watch: {
    // 不加的话在最开始刷新下进去该页面时不会滚动
    seller() {
      this.$nextTick(() => {
        this._initSellerScroll()
        this._initPicScroll()
      })
    }
  },
  mounted() {
    // 在转到别的页面再跳到该页面时,组件重新背渲染，但是seller没有改变，加上keep-alive后，切走后，这段逻辑不会重新执行
    this.$nextTick(() => {
      this._initSellerScroll()
      this._initPicScroll()
    })
  },
  methods: {
    _initSellerScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPicScroll() {
      if (this.seller.pics) {
        let picWidth = 120
        let marginR = 6
        let width = (picWidth + marginR) * this.seller.pics.length - marginR
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    toggleFavorite(event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  components: {
    star,
    split
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.seller
  position: absolute
  top: 174px
  left: 0
  bottom: 0
  width: 100%
  overflow: hidden
  .overview
    position: relative
    padding: 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .desc
      padding-bottom: 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      .star
        display: inline-block
        vertical-align: top
        margin-right: 8px
      .text
        margin-right: 12px
        display: inline-block
        vertical-align: top
        line-height: 18px       
        font-size: 10px
        color: rgb(77, 85, 93)
    .remark
      display: flex
      padding-top: 18px
      .block
        flex: 1
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        &:last-child
          border-right: none
        h2
          margin-bottom: 4px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .content
          line-height:24px
          font-size: 10px
          color: rgb(7, 17, 27)
          .stress
            font-size: 24px
    .favorite
      position: absolute
      width: 50px
      right: 11px
      top: 18px
      text-align: center
      .icon-favorite
        display: block
        margin-bottom: 4px
        line-height: 24px
        font-size: 24px
        color: #d4d6d9
        &.active
          color: rgb(240, 20, 20)
      .text
        line-height: 10px
        font-size: 10px
        color: rgb(77, 85, 93)   
  .bulletin
    padding: 18px 18px 0
    .title      
      margin-bottom: 8px
    .content-wrapper
      padding: 0 12px 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .content
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)       
    .supports
      .support-item
        padding: 16px 12px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          margin-right: 6px
          icon(16px,16px,4)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
  .pics
    padding: 18px
    .title
      margin-bottom: 12px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .pic-list
      width: 100%
      overflow: hidden
      white-space: nowrap
      font-size: 0
      .pic-item
        display: inline-block
        margin-right: 6px
        width: 120px
        height: 90px
        &:last-child
          margin-right: 0
  .info
    padding: 18px 18px 0 18px
    color: rgb(7, 17, 27)
    .title
      padding-bottom: 12px
      line-height: 14px
      font-size: 14px      
      border-1px(rgba(7, 17, 27, 0.1))
    .info-list
      .info-item
        padding: 16px 12px
        line-height: 16px
        font-size: 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        
          
      
    
</style>
