<template>
  <div>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openCouponModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未起用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openCouponModal(false, item)">
                編輯
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <couponModal :coupon="tempCoupon" ref="couponModal" @update-coupon="updateCoupon" />
    <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon" />
  </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'
import axios from 'axios'
export default {
  components: { CouponModal, DelModal },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isNew: false,
    }
  },
  methods: {
    openCouponModal(isNew, item) {
      this.isNew = isNew
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
          is_enabled: 0,
        }
      } else {
        this.tempCoupon = { ...item }
      }
      this.$refs.couponModal.showModal()
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    async getCoupons() {
      const loader = this.$loading.show()
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupons`
      const response = await axios.get(url, this.tempProduct)
      this.coupons = response.data.coupons
      loader.hide()
      console.log(response)
    },
    async updateCoupon(tempCoupon) {
      if (this.isNew) {
        const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupon`
        const loader = this.$loading.show()
        const response = await axios.post(url, { data: tempCoupon })
        loader.hide()
        console.log(response, tempCoupon)
        this.$httpMessageState(response, '新增優惠券')
        this.getCoupons()
        this.$refs.couponModal.hideModal()
      } else {
        const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
        const loader = this.$loading.show()
        const response = await axios.put(url, { data: this.tempCoupon })
        loader.hide()
        console.log(response)
        this.$httpMessageState(response, '更新優惠券')
        this.getCoupons()
        this.$refs.couponModal.hideModal()
      }
    },
    async delCoupon() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
      const loader = this.$loading.show()
      const response = await axios.delete(url)
      loader.hide()
      console.log(response, this.tempCoupon)
      this.$httpMessageState(response, '刪除優惠券')
      const delComponent = this.$refs.delModal
      delComponent.hideModal()
      this.getCoupons()
    },
  },
  created() {
    this.getCoupons()
  },
}
</script>
