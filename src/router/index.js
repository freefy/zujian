import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Select from '@/views/select/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/select',
      name:'select-name',
      component:Select
    }
  ]
})
