import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

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
      insertImgBtn:'insert',
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
    }
  },
  watch:{
    productTemp:{
      handler:function(newVal){
        const vm = this
          vm.insertImgBtn = newVal.images[newVal.images.length - 1] !== '' ? 'insert' : 'delete'
      },
      deep:true
    }
  },
  mounted() {
    this.isLogin()
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    
  },
  methods: {
    openModal(){
      productModal.show();
    },
    switchImgBtn(status){
      const vm = this 
      vm.insertImgBtn = status 
      status === 'delete' ? vm.productTemp.images.push('') : vm.productTemp.images.splice(-1, 1)
    },
    // addImage(image){
    //   // const img = e.target.value
    //   this.productTemp.images.push(image)
    // },
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
