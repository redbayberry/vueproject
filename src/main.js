// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Seller from 'components/seller/seller'
import Goods from 'components/goods/goods'
import Ratings from 'components/Ratings/Ratings'
import App from './App'

Vue.config.productionTip = false

import 'common/stylus/index.styl'
Vue.use(VueRouter)
Vue.use(VueResource)

// 路由表
const routes = [
  {path: '/seller', component: Seller},
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings}
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})
// 刚开始打开网页是默认激活一个链接
router.push('/seller')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
