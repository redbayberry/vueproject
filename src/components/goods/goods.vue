<template>
<div>
  <div class="goods">
  	<div class="menu-wrapper" ref="menuWrapper">
     <ul>
       <li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex === index}" @click="selectMenu(index,$event)">         
         <span class="text"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
       </li>
     </ul> 
    </div>
  	<div class="foods-wrapper" ref="foodsWrapper">
     <ul>
       <li v-for="item in goods" class="food-list food-list-hook"><!--food-list-hook没有实际的样式，用在js中-->
         <h1 class="title">{{item.name}}</h1>
         <ul>
           <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
             <div class="icon">
               <img :src="food.icon" width="57" height="57">
             </div>
             <div class="content">
               <h2 class="name">{{food.name}}</h2>
               <p class="desc">{{food.description}}</p>
               <div class="extra">
                 <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
               </div>
               <div class="price">
                 <span class="now">￥{{food.price}}</span>
                 <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
               </div>
               <!-- 绝对定位 -->
               <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" v-on:addCart="addcart"></cartcontrol>
               </div>
             </div>
           </li>
         </ul>
       </li>
     </ul> 
    </div>
    <!-- 一般元素上时，ref 指DOM元素，绑定在组件上时，ref 为一组件实例。 -->
    <shopcart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
  </div>
  <food :food="selectedFood" ref="food" @addCart="addcart"></food>
</div>
</template>
<script>
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [], // 得到每一组食物当对于其父元素的offsetTop
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      // 通过2层遍历，找到所有被选择的foods
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count > 0) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  mounted() {
    this.classMap = ['decrease', 'discount', 'guarantee', 'special', 'invoice']
    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    _initScroll() {
      console.log(this.$refs.menuWrapper)
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3 // 实时追踪滚动的位置
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.offsetHeight
        this.listHeight.push(height)
      }
    },
    selectMenu(index, event) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return
      }
      console.log(food)
      this.selectedFood = food
      this.$refs.food.show()
    },
    _drop(target) {
      console.log(target)
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    addcart(target) {
      this._drop(target)
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.goods
  position: absolute
  display: flex
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width:56px
      line-height: 14px
      padding: 0 12px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text
          border-none()       
      .icon
        margin-right: 2px
        icon(12px,12px,3)
      .text
        display: table-cell
        font-size: 12px
        vertical-align:middle
        border-1px(rgba(7,17,27,0.2))        
  .foods-wrapper
    flex: 1	
    .title
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      padding-left: 14px
      background: #f3f5f7
      font-size: 12px
      color: rgb(147,153,159)
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      &.border-1px
        border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height:14px
          font-size: 14px
          color: rgb(7,17,27)
        .desc,.extra  
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
        .desc
          margin-bottom: 8px
          line-height: 12px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240,20,20)
          .old
            font-size: 10px
            color: rgb(147,153,159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
          
</style>
