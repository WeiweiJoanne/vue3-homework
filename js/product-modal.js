const url = "https://vue3-course-api.hexschool.io/v2/";
const path = "petshome";
export default {
  data() {
    return {
      modal:{},
      temProduct: {},
      qty: 1
    }
  },
  props: ['showProductId','addToCart'],
  watch:{
    showProductId(){
      // /v2/api / { api_path } / product / { id }
      const vm = this
      axios.get(`${url}api/${path}/product/${vm.showProductId}`)
        .then(res => {
          vm.temProduct = res.data.product
          vm.modal.show()
        })
    }
  },
  methods: {
    hideModal(){
      this.modal.hide()
    }
  },
  template: `
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" ref="modal"
        aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                <span> {{ temProduct.title }}</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-6">
                  <img class="img-fluid" :src="temProduct.imageUrl" alt="">
                </div>
                <div class="col-sm-6">
                  <span class="badge bg-primary rounded-pill"></span>
                  <p>商品描述： {{temProduct.description}}</p>
                  <p>商品內容： {{temProduct.content}}</p>
                  <div class="h5" v-if="temProduct.origin_price === temProduct.price"> {{temProduct.price}} 元</div>
                  <div v-else>
                    <del class="h6" >原價 {{temProduct.origin_price}}  元</del>
                    <div class="h5" >現在只要 {{temProduct.price}} 元</div>
                  </div>
                  <div>
                    <div class="input-group">
                      <select class="form-control" v-model="qty">
                        <option v-for="i in 20">{{i}}</option>  
                      </select>  
                      <button type="button" class="btn btn-primary" @click="addToCart(temProduct.id,qty)">加入購物車</button>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
  `,
  mounted() {
    //  this.$refs.modal 元件的DOM
    this.modal = new bootstrap.Modal(this.$refs.modal)
    // this.modal.show()
  },
}
