<template>
  <div class="col-md-7">
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              style="height: 100px; background-size: cover; background-position: center"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </td>
          <td>
            <a href="#" class="text-dark">{{ item.title }}</a>
          </td>
          <td>
            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
            <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
            <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary" @click="getProduct(item.id)">
                查看更多
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                :disabled="this.status.loadingItem === item.id"
                @click="addCart(item.id)"
              >
                <div
                  v-if="this.status.loadingItem === item.id"
                  class="spinner-grow text-danger spinner-grow-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import emitter from '@/methods/emitter'
export default {
  data() {
    return {
      products: [],
      status: {
        loadingItem: '',
      },
    }
  },
  methods: {
    async getProducts() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/products/all`
      const loader = this.$loading.show()
      const response = await axios.get(url)
      this.products = response.data.products
      console.log('products:', response)
      loader.hide()
    },
    async addCart(id) {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`
      this.status.loadingItem = id
      const cart = {
        product_id: id,
        qty: 1,
      }
      const res = await axios.post(url, { data: cart })
      this.status.loadingItem = ''
      console.log(res)
      this.getCart()
      emitter.emit('update-cart')
    },
    async getCart() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`
      const loader = this.$loading.show()
      const response = await axios.get(url)
      console.log(response)
      this.cart = response.data.data
      loader.hide()
    },
    getProduct(id) {
      this.$router.push(`/user/product/${id}`)
    },
  },
  created() {
    this.getProducts()
  },
}
</script>
