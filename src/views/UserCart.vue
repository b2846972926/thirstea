<template>
  <div class="container mb-4">
    <div class="row mt-4">
      <!-- 🛒 左側：購物車列表 -->
      <div class="col-md-6 mb-4">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="cart.carts">
                <tr v-for="item in cart.carts" :key="item.id">
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      :disabled="status.loadingItem === item.id"
                      @click="removeCartItem(item.id)"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                  <td>
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        class="form-control"
                        min="1"
                        v-model.number="item.qty"
                        @change="updateCart(item)"
                        :disabled="item.id === status.loadingItem"
                      />
                      <div class="input-group-text">/ {{ item.product.unit }}</div>
                    </div>
                  </td>
                  <td class="text-end">
                    <small v-if="cart.final_total !== cart.total" class="text-success"
                      >折扣價：</small
                    >
                    {{ $filters.currency(item.final_total) }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ $filters.currency(cart.total) }}</td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
              </tr>
            </tfoot>
          </table>

          <!-- 優惠碼輸入 -->
          <div class="input-group mb-3 input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="coupon_code"
              placeholder="請輸入優惠碼"
            />
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>

      <!-- ✅ 右側：表單 -->
      <div class="col-md-6">
        <AppForm class="col-12" v-slot="{ errors }" @submit="createOrder">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <AppField
              id="email"
              name="email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></AppField>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <AppField
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名"
              rules="required"
              v-model="form.user.name"
            ></AppField>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <AppField
              id="tel"
              name="電話"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              rules="required"
              v-model="form.user.tel"
            ></AppField>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <AppField
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></AppField>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea
              id="message"
              class="form-control"
              cols="30"
              rows="5"
              v-model="form.message"
            ></textarea>
          </div>

          <div class="text-end">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </AppForm>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import emitter from '@/methods/emitter'
export default {
  data() {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      coupon_code: '',
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
    getProduct(id) {
      this.$router.push(`/product/${id}`)
    },
    async getCart() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`
      const loader = this.$loading.show()
      const response = await axios.get(url)
      console.log(response)
      this.cart = response.data.data
      loader.hide()
    },
    async updateCart(item) {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${item.id}`
      const loader = this.$loading.show()
      this.status.loadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      }
      const res = await axios.put(url, { data: cart })
      loader.hide()
      console.log(res)
      this.status.loadingItem = ''
      this.getCart()
      emitter.emit('update-cart')
    },
    async removeCartItem(id) {
      this.status.loadingItem = id
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${id}`
      const loader = this.$loading.show()
      const response = await axios.delete(url)
      this.$httpMessageState(response, '移除購物車品項')
      this.status.loadingItem = ''
      this.getCart()
      loader.hide()
      emitter.emit('update-cart')
    },
    async addCouponCode() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/coupon`
      const coupon = {
        code: this.coupon_code,
      }
      const loader = this.$loading.show()
      const response = await axios.post(url, { data: coupon })
      this.$httpMessageState(response, '加入優惠券')
      this.getCart()
      loader.hide()
    },
    async createOrder() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/order`
      const order = this.form
      const res = await axios.post(url, { data: order })
      console.log(res)
      if (res.data.success) {
        const orderId = res.data.orderId
        this.$router.push(`/user/checkout/${orderId}`)
      }
    },
  },
  created() {
    this.getProducts()
    this.getCart()
  },
}
</script>
