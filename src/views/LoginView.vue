<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            required
            autofocus
            v-model="user.username"
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
            v-model="user.password"
          />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },

  methods: {
    async signIn() {
      const api = `${import.meta.env.VITE_APP_API}/admin/signin`
      const loader = this.$loading.show()
      const res = await axios.post(api, this.user)
      loader.hide()
      if (res.data.success) {
        const { token, expired } = res.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
        this.$router.push('/dashboard/products')
      }
    },
    async createOrder() {
      const url = `${import.meta.env.VUE_APP_API}api/${import.meta.env.VUE_APP_PATH}/order`
      const order = this.form
      const res = await axios.post(url, { data: order })
      console.log(res)
    },
  },
  async created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common.Authorization = token
    const api = `${import.meta.env.VITE_APP_API}/api/user/check`
    const loader = this.$loading.show()
    const res = await axios.post(api)
    loader.hide()
    if (res.data.success) {
      this.$router.push('/dashboard/products')
    }
  },
}
</script>

<style scoped>
.container {
  height: 500px;
}
</style>
