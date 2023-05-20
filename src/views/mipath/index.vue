<template>
  <div class="app-container documentation-container">
    <a class="document-btn" target="_blank" href="https://store.akveo.com/products/vue-java-admin-dashboard-spring?utm_campaign=akveo_store-Vue-Vue_demo%2Fgithub&utm_source=vue_admin&utm_medium=referral&utm_content=demo_English_button">Java backend integration</a>
    <a class="document-btn" target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/">Documentation</a>
    <a class="document-btn" target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">Github Repository</a>
    <a class="document-btn" target="_blank" href="https://panjiachen.gitee.io/vue-element-admin-site/zh/">国内文档</a>
    <dropdown-menu class="document-btn" :items="articleList" title="系列文章" />
    <a class="document-btn" target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/zh/job/">内推招聘</a>
  </div>
</template>

<script>
import DropdownMenu from '@/components/Share/DropdownMenu'
import axios from 'axios'

export default {
  name: 'Documentation',
  components: { DropdownMenu },
  data() {
    return {
      articleList: [
        { title: 'EJEMPLO DE LISTA DESPLEGABLE', href: 'https://juejin.im/post/59097cd7a22b9d0065fb61d2' },
        { title: 'Genial', href: 'https://juejin.im/post/591aa14f570c35006961acac' },
        { title: 'Producto 153', href: 'https://juejin.im/post/593121aa0ce4630057f70d35' },
        { title: 'No te detengas por nada', href: 'https://juejin.im/post/595b4d776fb9a06bbe7dba56' },
        { title: 'Haz lo que te gusta hacer', href: 'https://juejin.im/post/5c92ff94f265da6128275a85' },
        { title: 'Confía en ti mismo', href: 'https://segmentfault.com/a/1190000009090836' },
        { title: 'No desperdicies el tiempo', href: 'https://juejin.im/post/59bb864b5188257e7a427c09' },
        { title: 'Chorizo', href: 'https://juejin.im/post/59bb864b5188257e7a427c09' },
        { title: 'Gerigonze', href: 'https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc' }
      ]
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.getCompanies()
  },
  methods: {
    getCompanies() {
      console.log('TOKEN MARICONINI: ' + window.localStorage.getItem('tkn'))

      axios.get('http://23.23.76.112:3000/PruebaApi').then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
