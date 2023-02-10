const { Form, Field, ErrorMessage } = VeeValidate
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL('/js/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

import productModal from './product-modal.js';
const url = "https://vue3-course-api.hexschool.io/v2/";
const path = "petshome";

const app = Vue.createApp({
  data() {
    return {
      user: {},
      products: [],
      carts: [],
      showProductId: null,
      isLoading: true
    }
  },
  mounted() {
    const vm = this
    axios.get(`${url}api/${path}/products/all`)
      .then(res => {
        vm.products = res.data.products
        vm.isLoading = false
      })
      .catch(err=> console.log(err))
      vm.getCart()
    
  },
  methods: {
    onSubmit() {
      const vm = this
      if(carts.length > 0){
        alert('建立訂單')
        vm.user = {}
        vm.carts = []
      }else{
        alert('請選購商品後再結帳')
      }
    },
    showProductDetail(id) {
      const vm = this
      vm.isLoading = true
      vm.showProductId = id
    },
    addToCart(id, qty = 1) {
      // / v2 / api / { api_path } / cart
      const vm = this
      vm.isLoading = true
      const data = {
        data: {
          product_id: id,
          qty: qty
        }
      }
      axios.post(`${url}api/${path}/cart`, data)
        .then(res => {
          vm.getCart()
          vm.$refs.refModal.hideModal();
          vm.isLoading = false
        })
        .catch(err=> console.log(err))
    },
    getCart() {
      // /v2/api/{api_path}/cart
      const vm = this
      axios.get(`${url}api/${path}/cart`)
        .then(res => {
          const data = res.data.data.carts
          vm.carts = data
        })
        .catch(err=> console.log(err))
    },
    deleteCart(id) {
      // /v2/api/{api_path}/cart/{id}

      const vm = this
      vm.isLoading = true
      if (id === 'all') {
        axios.delete(`${url}api/${path}/carts`)
          .then(res => {
            console.log(res)
            if (res.data.success) {
              alert(res.data.message)
              vm.getCart()
              vm.isLoading = false
            }else{
              alert(res.data.message)
            }
          })
          .catch(err=> console.log(err))
      } else {
        axios.delete(`${url}api/${path}/cart/${id}`)
          .then(res => {
            if (res.data.success) {
              alert(res.data.message)
              vm.getCart()
              vm.isLoading = false
            }else{
              alert(res.data.message)
            }
          })
          .catch(err=> console.log(err))
      }


    }
  },
  computed:{
    total(){
      const vm = this
      let total = 0;
      vm.carts.forEach(e=>{
        total += e.final_total
      })
      return total;
    }
  },
  watch:{
    carts:{
      handler(){
        const vm = this
        console.log(vm)
        vm.total
      },
      deep:true
    }
  },
  components: {
    productModal,
    loading: VueLoading.Component
  }
})
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app')
