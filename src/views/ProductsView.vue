<template>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click="openModal(true)">增加一個產品</button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ $filters.currency(item.origin_price) }}</td>
        <td class="text-right">{{ $filters.currency(item.price) }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
              編輯
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <AppPagination :pages="pagination" @emit-page="getProducts"></AppPagination>
  <ProductModal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></ProductModal>
  <DelModal :item="tempProduct" ref="delModal" @del-item="delProduct" />
</template>

<script>
import axios from 'axios'
import ProductModal from '@/components/ProductModal.vue'
import AppPagination from '@/components/AppPagination.vue'
import DelModal from '@/components/DelModal.vue'
export default {
  components: {
    ProductModal,
    DelModal,
    AppPagination,
  },
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
    }
  },
  inject: ['emitter'],
  methods: {
    async getProducts(page = 1) {
      const loader = this.$loading.show()
      const api = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products?page=${page}`
      const res = await axios.get(api)
      loader.hide()
      if (res.data.success) {
        this.products = res.data.products
        this.pagination = res.data.pagination
      }
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {}
      } else {
        this.tempProduct = { ...item }
      }
      this.isNew = isNew
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    async updateProduct(item) {
      this.tempProduct = item
      //新增
      let api = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product`
      let httpMethod = 'post'

      //編輯
      if (!this.isNew) {
        api = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }
      const productComponent = this.$refs.productModal
      const loader = this.$loading.show()
      const response = await axios[httpMethod](api, { data: this.tempProduct })
      loader.hide()
      productComponent.hideModal()
      if (response.data.success) {
        this.getProducts()
        this.emitter.emit('push-message', {
          style: 'success',
          title: '更新成功',
        })
      } else {
        this.emitter.emit('push-message', {
          style: 'danger',
          title: '更新失敗',
          content: response.data.message.join('、'),
        })
      }
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    async delProduct() {
      const url = `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${this.tempProduct.id}`
      const loader = this.$loading.show()
      const response = await axios.delete(url)
      loader.hide()
      console.log(response.data)
      const delComponent = this.$refs.delModal
      delComponent.hideModal()
      this.getProducts()
    },
  },
  created() {
    this.getProducts()
  },
}
</script>
