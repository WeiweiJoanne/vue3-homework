import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
// const { createApp } = Vue

const url = 'https://vue3-course-api.hexschool.io/v2/'
const path = 'petshome'

let productModal = null;


const app = {
  data() {
    return {
      products: [],
      isActive: null,
      isLoading: true,
      modalFor: null,
      productTemp: {
        title: '',
        category: '',
        unit: '',
        originPrice: '',
        price: '',
        description: '',
        content: '',
        bigImage: '',
        images: []
      },
      // newProduct: {
      //   title: '123',
      //   category: 'category',
      //   unit: 'unit',
      //   originPrice: 'originPrice',
      //   price: 'price',
      //   description: 'description',
      //   content: 'content',
      //   bigImage: 'bigImage',
      //   images: []
      // },
    }
  },
  mounted() {
    this.isLogin()
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    
  },
  computed:{
    
  },
  methods: {
    openModal(){
      productModal.show();
    },
    addImage(e){
      const img = e.target.value
      this.newProduct.images.push(img)
      console.log("🚀 ~ file: products.js:36 ~ addImage ~ img", this.newProduct.images)
    },
    productDetail(num) {
      const vm = this;
      vm.isActive = num
    },
    isLogin(){
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)petsHome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token
  
      const checkLoginAPI = `${url}api/user/check`
      const getProductsAPI = `${url}api/${path}/admin/products/all`
  
      axios.post(checkLoginAPI)
        .then(res => {
          axios.get(getProductsAPI)
            .then(res => {
              this.products = Object.values(res.data.products)
              this.isLoading = false
            })
            .catch(err => console.log(err))
        })
        .catch(err => {
          window.location.href = './login.html'
        })
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
