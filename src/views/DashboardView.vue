<template>
  <AppNavbar></AppNavbar>
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages></ToastMessages>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import emitter from '@/methods/emitter'
import ToastMessages from '@/components/ToastMessages.vue'
import AppNavbar from '@/components/AppNavbar.vue'

export default {
  components: {
    AppNavbar,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    }
  },
  async created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common.Authorization = token
    const api = `${import.meta.env.VITE_APP_API}/api/user/check`
    const loader = this.$loading.show()
    const res = await axios.post(api)
    loader.hide()
    if (!res.data.success) {
      this.$router.push('/login')
    }
  },
}
</script>
