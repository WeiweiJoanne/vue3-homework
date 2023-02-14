const { Form, Field, ErrorMessage } = VeeValidate
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL('./js/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

import productModal from './product-modal.js';
const url = "https://vue3-course-api.hexschool.io/v2/";
const path = "petshome";

const app = Vue.createApp({
  data(){
    return {
      user:{},
      products:[],
      showProductId:null
    }
  },
  mounted() {
    const vm=this
    axios.get(`${url}api/${path}/products/all`)
      .then(res=>{
        vm.products = res.data.products
      })
  },
  methods: {
    onSubmit() {
      console.log('submit');
    },
    showProductDetail(id){
      this.showProductId = id
    },
    addToCart(id,qty=1){
     // / v2 / api / { api_path } / cart
     const data = {
       data: {
         product_id: id,
         qty: qty
       }
     }
      axios.post(`${url}api/${path}/cart`,data)
        .then(res => {
          
          this.$refs.refModal.hideModal();
        })
    }
  },
  components:{
    productModal,
  }
})
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app')
