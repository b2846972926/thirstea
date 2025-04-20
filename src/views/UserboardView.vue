<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <div class="container d-flex">
        <router-link class="navbar-brand" to="/"
          ><img src="../assets/thirsteaLogo.jpg" alt="logo" class="img-fluid" style="height: 56px"
        /></router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav ms-auto">
            <router-link to="/aboutus" class="nav-link me-3">關於我們</router-link>
            <router-link to="/products" class="nav-link me-3">產品列表</router-link>
            <router-link to="/dashboard/products" class="nav-link me-3">後台管理</router-link>
            <router-link to="/cart" class="nav-link me-3 d-flex align-items-center">
              <div class="position-relative" style="width: 24px; height: 24px">
                <i class="bi bi-cart4 fs-4" style="line-height: 1"></i>
                <span
                  v-if="cart.carts.length > 0"
                  class="badge bg-danger rounded-pill position-absolute"
                  style="top: -6px; right: -6px; font-size: 0.6rem"
                >
                  {{ cart.carts.length }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <router-view />
  <ToastMessages></ToastMessages>
  <footer class="footer bg-dark text-white text-center py-3">
    <p class="mb-0">© 2025 由 楊桃 製作 | 僅做個人練習用 | 聯絡信箱：b2846972926@email.com</p>
  </footer>
</template>

<script>
import emitter from '@/methods/emitter'
import ToastMessages from '@/components/ToastMessages.vue'
import axios from 'axios'
export default {
  components: {
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    }
  },
  data() {
    return {
      cart: {
        carts: [],
      },
    }
  },
  methods: {
    async getCart() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`
      const loader = this.$loading.show()
      const response = await axios.get(url)
      console.log(response)
      this.cart = response.data.data
      loader.hide()
    },
  },
  created() {
    this.getCart()
    emitter.on('update-cart', () => {
      this.getCart()
    })
  },
}
</script>
