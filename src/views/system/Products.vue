<template>
  <div class="products-container">
    <el-card>
      <div class="card-header">
        <h2>产品管理</h2>
        <el-button type="primary" @click="handleAdd">新增产品</el-button>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedProducts" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productCode" label="产品编码" />
        <el-table-column prop="creditLimit" label="授信额度" />
        <el-table-column prop="annualFee" label="年费" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredProducts.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog :visible="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="formData.productName" />
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="formData.productCode" />
        </el-form-item>
        <el-form-item label="授信额度">
          <el-input v-model="formData.creditLimit" />
        </el-form-item>
        <el-form-item label="年费">
          <el-input v-model="formData.annualFee" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm.vue'

const products = ref([
  { id: 1, productName: '标准信用卡', productCode: 'STD001', creditLimit: '10000-50000', annualFee: '0', status: 'active', createTime: '2024-01-15' },
  { id: 2, productName: '金卡', productCode: 'GOLD001', creditLimit: '50000-100000', annualFee: '300', status: 'active', createTime: '2024-01-15' },
  { id: 3, productName: '白金卡', productCode: 'PLAT001', creditLimit: '100000-500000', annualFee: '800', status: 'active', createTime: '2024-01-15' },
  { id: 4, productName: '钻石卡', productCode: 'DIAM001', creditLimit: '500000以上', annualFee: '2000', status: 'inactive', createTime: '2024-01-15' },
  { id: 5, productName: '联名卡', productCode: 'COBR001', creditLimit: '5000-30000', annualFee: '100', status: 'active', createTime: '2024-01-15' }
])

const searchFields = [
  { prop: 'productName', label: '产品名称', type: 'input', placeholder: '请输入产品名称' },
  { prop: 'productCode', label: '产品编码', type: 'input', placeholder: '请输入产品编码' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'active' },
    { label: '停用', value: 'inactive' }
  ]}
]

const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive({
  productName: '',
  productCode: '',
  status: ''
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (searchForm.productName && !p.productName.includes(searchForm.productName)) return false
    if (searchForm.productCode && !p.productCode.includes(searchForm.productCode)) return false
    if (searchForm.status && p.status !== searchForm.status) return false
    return true
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增产品')
const formData = reactive({
  id: null,
  productName: '',
  productCode: '',
  creditLimit: '',
  annualFee: '',
  status: 'active'
})

const handleAdd = () => {
  dialogTitle.value = '新增产品'
  formData.id = null
  formData.productName = ''
  formData.productCode = ''
  formData.creditLimit = ''
  formData.annualFee = ''
  formData.status = 'active'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑产品'
  formData.id = row.id
  formData.productName = row.productName
  formData.productCode = row.productCode
  formData.creditLimit = row.creditLimit
  formData.annualFee = row.annualFee
  formData.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row) => {
  products.value = products.value.filter(p => p.id !== row.id)
  ElMessage.success('删除成功')
}

const handleSubmit = () => {
  if (formData.id) {
    const index = products.value.findIndex(p => p.id === formData.id)
    if (index !== -1) {
      products.value[index] = { ...formData }
    }
    ElMessage.success('修改成功')
  } else {
    formData.id = Date.now()
    products.value.push({ ...formData })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

const handleSearch = (data) => {
  Object.assign(searchForm, data)
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.productName = ''
  searchForm.productCode = ''
  searchForm.status = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.products-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>