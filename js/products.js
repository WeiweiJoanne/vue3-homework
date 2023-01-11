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
      insertImgBtn: 'insert',
      productTemp: {
        title: '',
        category: '',
        unit: '',
        origin_price: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 0,
        imageUrl: '',
        imagesUrl: []
      },
    }
  },
  watch: {
    productTemp: {
      handler: function (newVal) {
        const vm = this
        vm.insertImgBtn = newVal.imagesUrl[newVal.imagesUrl.length - 1] !== '' ? 'insert' : 'delete'
      },
      deep: true
    }
  },
  mounted() {
    this.isLogin()
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

  },
  methods: {
    addProduct() {
      
      const vm = this
      const objVal = Object.values(vm.productTemp)
      let isValidForm = objVal.includes('') ? false: true

      if (!isValidForm){
        alert('請將欄位填寫完畢')
      }else{
        const addProductAPI = `${url}api/${path}/admin/product`
        const data = {
          data: vm.productTemp
        }
        axios.post(addProductAPI, data)
          .then(res=> {
            vm.productTemp = { imagesUrl:[] }
            vm.getProductAll()
            productModal.hide();
          })
          .catch(err=> console.log(err))
      }
    },
    openModal() {
      productModal.show();
    },
    switchImgBtn(status) {
      const vm = this
      vm.insertImgBtn = status
      status === 'delete' ? vm.productTemp.imagesUrl.push('') : vm.productTemp.imagesUrl.splice(-1, 1)
    },
    productDetail(num) {
      const vm = this;
      vm.isActive = num
    },
    getProductAll(){
      const getProductsAPI = `${url}api/${path}/admin/products/all`
      axios.get(getProductsAPI)
        .then(res => {
          this.products = Object.values(res.data.products)
          this.isLoading = false
        })
        .catch(err => console.log(err))
    },
    isLogin() {
      const vm = this
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)petsHome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token

      const checkLoginAPI = `${url}api/user/check`
      

      axios.post(checkLoginAPI)
        .then(res => {
          vm.getProductAll()
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
