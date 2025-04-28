<template>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, key) in orders" :key="key">
        <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${item.id}`"
                v-model="item.is_paid"
                @change="updatePaid(item)"
              />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
                檢視
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
  <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
  <AppPagination :pages="pagination" @emit-pages="getOrders"></AppPagination>
</template>

<script>
import DelModal from '@/components/DelModal.vue'
import OrderModal from '@/components/OrderModal.vue'
import AppPagination from '@/components/AppPagination.vue'
import axios from 'axios'

export default {
  data() {
    return {
      orders: {},
      isNew: false,
      pagination: {},
      tempOrder: {},
      currentPage: 1,
    }
  },
  components: {
    AppPagination,
    DelModal,
    OrderModal,
  },
  methods: {
    async getOrders(currentPage = 1) {
      this.currentPage = currentPage
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/orders?page=${currentPage}`
      const loader = this.$loading.show()
      const response = await axios.get(url, this.tempProduct)
      this.orders = response.data.orders
      this.pagination = response.data.pagination
      loader.hide()
    },
    openModal(isNew, item) {
      this.tempOrder = { ...item }
      this.isNew = false
      const orderComponent = this.$refs.orderModal
      orderComponent.showModal()
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    async updatePaid(item) {
      const loader = this.$loading.show()
      const api = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/order/${item.id}`
      const paid = {
        is_paid: item.is_paid,
      }
      const response = await axios.put(api, { data: paid })
      loader.hide()
      this.getOrders(this.currentPage)
      this.$httpMessageState(response, '更新付款狀態')
    },
    async delOrder() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/order/${this.tempOrder.id}`
      const loader = this.$loading.show()
      const response = await axios.delete(url)
      console.log(response)
      loader.hide()
      const delComponent = this.$refs.delModal
      delComponent.hideModal()
      this.getOrders(this.currentPage)
    },
  },
  created() {
    this.getOrders()
  },
}
</script>
