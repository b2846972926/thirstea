<template>
  <div class="my-5 row justify-content-center">
    <form class="col-md-6" @submit.prevent="payOrder">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.id">
            <td>{{ item.product.title }}</td>
            <td>{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="text-end">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-end">總計</td>
            <td class="text-end">{{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!order.is_paid">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-end" v-if="order.is_paid === false">
        <button class="btn btn-danger">確認付款去</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      order: {
        user: {},
      },
      orderId: '',
    }
  },
  methods: {
    async getOrder() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/order/${this.orderId}`

      const res = await axios.get(url)
      if (res.data.success) {
        this.order = res.data.order
        console.log(this.order)
      }
    },
    async payOrder() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/pay/${this.orderId}`

      const res = await axios.post(url)
      console.log(res)
      if (res.data.success) {
        this.getOrder()
      }
    },
  },
  created() {
    this.orderId = this.$route.params.orderId
    console.log(this.orderId)
    this.getOrder()
  },
}
</script>
