import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2/";
const path = "petshome";

let productModal = null;

const app = {
  data() {
    return {
      products: [],
      isActive: null,
      isLoading: true,
      modalFor: null,
      insertImgBtn: "insert",
      productTemp: {},
    };
  },
  watch: {
    productTemp: {
      handler: function (newVal) {
        const vm = this;
        if (Object.keys(vm.productTemp).includes("imagesUrl")) {
          vm.insertImgBtn =
            newVal.imagesUrl[newVal.imagesUrl.length - 1] !== ""
              ? "insert"
              : "delete";
        }
        vm.productTemp.is_enabled = vm.productTemp.is_enabled ? 1 : 0;
      },
      deep: true,
    },
  },
  mounted() {
    this.isLogin();
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
      }
    );
  },
  methods: {
    openModal(todo, id) {
      const vm = this;
      vm.modalFor = todo;
      if (todo == "new") {
        vm.productTemp = {};
      } else if (todo == "edit") {
        vm.products.forEach((el, i) => {
          if (el.id === id) {
            vm.productTemp = { ...vm.products[i] };
          }
        });
      } else {
        vm.products.forEach((el, i) => {
          if (el.id === id) {
            vm.productTemp = { ...vm.products[i] };
          }
        });
      }
      vm.insertImgBtn = "insert";
      productModal.show();
    },
    excute() {
      const vm = this;
      const objVal = Object.values(vm.productTemp);
      const isValidForm = objVal.includes("") ? false : true;
      const excuteAPI =
        vm.modalFor === "new"
          ? `${url}api/${path}/admin/product`
          : `${url}api/${path}/admin/product/${vm.productTemp.id}`;
      let method = ''
      if (vm.modalFor === "new") {
        method = 'post'
      } else if (vm.modalFor === "edit") {
        method = 'put'
      } else if (vm.modalFor === "del") {
        method = 'delete'
      }

      if (vm.modalFor == 'new' || vm.modalFor == 'edit') {

        if (!isValidForm) {
          alert("請將欄位填寫完畢");
        } else {
          const data = {
            data: vm.productTemp,
          };
          axios[method](excuteAPI, data)
            .then((res) => {
              vm.productTemp = {};
              vm.getProductAll();
              productModal.hide();
            })
            .catch((err) => console.log(err));
        }
      }else{
        axios[method](excuteAPI)
            .then((res) => {
              vm.productTemp = {};
              vm.getProductAll();
              productModal.hide();
            })
            .catch((err) => console.log(err));
      }
    },
    switchImgBtn(status) {
      const vm = this;
      vm.insertImgBtn = status;
      if (status === "del") {
        if (Object.keys(vm.productTemp).includes("imagesUrl")) {
          vm.productTemp.imagesUrl.push("");
        } else {
          vm.productTemp.imagesUrl = [""];
        }
      } else {
        vm.productTemp.imagesUrl.splice(-1, 1);
      }
    },
    productDetail(num) {
      const vm = this;
      vm.isActive = num;
    },
    getProductAll() {
      this.isLoading = true;
      const getProductsAPI = `${url}api/${path}/admin/products/all`;
      axios
        .get(getProductsAPI)
        .then((res) => {
          this.products = Object.values(res.data.products);
          this.isLoading = false;
        })
        .catch((err) => console.log(err));
    },
    isLogin() {
      const vm = this;
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)petsHome\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;

      const checkLoginAPI = `${url}api/user/check`;

      axios
        .post(checkLoginAPI)
        .then((res) => {
          vm.getProductAll();
        })
        .catch((err) => {
          window.location.href = "./login.html";
        });
    },
    logOut() {
      const logOutApi = `${url}logout`;
      axios
        .post(logOutApi)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            window.location.href = "./login.html";
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
createApp(app).mount("#app");
