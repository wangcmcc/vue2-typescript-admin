declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// 声明全局方法
declare module 'vue/types/vue' {
  import VueRouter, {Route} from 'vue-router'
  import Vue from 'vue'
  interface Vue {
    $message: any;
    $router: VueRouter;
    $route: Route;
  }
}

declare module '*.js'
