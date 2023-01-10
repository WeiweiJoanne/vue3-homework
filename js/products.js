import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
// const { createApp } = Vue

const url = 'https://vue3-course-api.hexschool.io/v2/'
const path = 'petshome'


const app = {
  data() {
    return {
      products: [],
      isActive: null,
      isLoading: true
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)petsHome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token

    const checkLoginAPI = `${url}api/user/check`
    const getProductsAPI = `${url}api/${path}/admin/products/all`

    axios.post(checkLoginAPI)
      .then(res => {
        axios.get(getProductsAPI)
          .then(res => {
            console.log(res.data.products);
            this.products = Object.values(res.data.products)
            this.isLoading = false
          })
          .catch(err => console.log(err))
      })
      .catch(err => {
        window.location.href = './login.html'
      })
  },
  methods: {
    productDetail(num) {
      const vm = this;
      vm.isActive = num
    },
    logOut() {
      const logOutApi = `${url}logout`
      axios.post(logOutApi)
        .then(res => {
          if (res.data.success) {
            alert(res.data.message)
            window.location.href = './login.html'
          }
        })
        .catch(err => console.log(err))
    }
  }
}
createApp(app).mount('#app')
