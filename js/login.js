import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const url = 'https://vue3-course-api.hexschool.io/v2/'
const path = 'petshome'

const app = {
  data() {
    return {
      username: '',
      password: '',
      // isLoading: true
    }
  },
  mounted() {
    // const token = document.cookie.replace(/(?:(?:^|.*;\s*)petsHome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // axios.defaults.headers.common['Authorization'] = token

    // const api = `${url}api/user/check`

    // axios.post(api)
    //   .then(res => {
    //     window.location.href = './products.html'
    //   })
    //   .catch(err => {
    //     this.isLoading = false
    //     console.log(err.response.data)
    //   })
  },
  methods: {
    login(username, password) {
      const regex = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)

      if (regex.test(username)) {
        const api = `${url}admin/signin`
        const body = {
          username, password
        }
        axios.post(api, body)
          .then(res => {
            const { message, token, expired } = res.data
            alert(message)
            document.cookie = `petsHome=${token}; expire=${expired}; Path=/`
            // axios.defaults.headers.common['Authorization'] = token
            window.location.href = './products.html'
          })
          .catch(err => {
            alert(err.response.data.message)
            console.dir(err)
          })
      } else {
        alert('Email 格式不正確')
      }

    }
  },
}

createApp(app).mount('#app')
