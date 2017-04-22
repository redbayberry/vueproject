<template>
<div class="ratingselect">
  <div class="rating-type border-1px">
    <span class="block positive" @click="select(2,$event)" :class="{active:selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
    <span class="block positive" @click="select(0,$event)" :class="{active:selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
    <span class="block negative" @click="select(1,$event)" :class="{active:selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
  </div>
  <!-- onlyContent为true时，为选中状态 -->
  <div class="switch" :class="{on:onlyContent}" @click="toggleContent">
    <span class="icon-check_circle"></span>
    <span class="text">只看内容的评价</span>
  </div>
</div>
</template>
<style lang="stylus">
@import "../../common/stylus/mixin"
.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7,17,17,0.1))
    font-size: 0
    .block
      padding: 8px 12px
      margin-right: 8px
      border-radius: 1px
      font-size: 12px
      color: rgb(77,85,93)
      &.active
        color: #fff
      .count
        font-size: 8px
        margin-left: 2px
      &.positive
        background: rgba(0,160,220,0.2)
        &.active
          background: rgb(0,160,220)
      &.negative
        background: rgba(77,85,93,0.2)
        &.active
          background: rgba(77,85,93,0.2)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7,17,27,0.1)
    font-size: 0
    color: rgb(147,153,159)
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top// 用middle也可以
      margin-right: 4px
      font-size: 24px
    .text
      display: inline-block
      vertical-align: top
      font-size: 12px
    
        
      
</style>
<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    selectType: {
      type: Number,
      // 默认全选
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return
      }
      console.log('test')
      // 不能在子组件上直接更改父组件传过来的参数
      // this.selectType = type
      this.$emit('select', type)
    },
    toggleContent() {
      if (!event._constructed) {
        return
      }
      this.$emit('content')
    }
  }
}
</script>
