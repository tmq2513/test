<template>
  <div class="outer-cards-container">
    <el-card>
      <div class="card-header">
        <div>
          <h2>产品外卡信息维护</h2>
          <span class="category-tag">所属大类：{{ categoryName }}</span>
        </div>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedOuterCards" style="width: 100%">
        <el-table-column prop="outerCardCode" label="外卡编码" width="150" />
        <el-table-column prop="outerCardName" label="外卡名称" width="180" />
        <el-table-column prop="categoryCode" label="产品大类编码" width="150" />
        <el-table-column prop="categoryName" label="产品大类名称" width="180" />
        <el-table-column prop="photoCardFlag" label="照片卡标识" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.photoCardFlag === '不考虑'" type="info" size="small">不考虑</el-tag>
            <el-tag v-else-if="scope.row.photoCardFlag === '是'" type="success" size="small">是</el-tag>
            <el-tag v-else type="warning" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="employeeFlag" label="员工标识" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.employeeFlag === '不考虑'" type="info" size="small">不考虑</el-tag>
            <el-tag v-else-if="scope.row.employeeFlag === '是'" type="success" size="small">是</el-tag>
            <el-tag v-else type="warning" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cardFaceFlag" label="卡面标识" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.cardFaceFlag === '是' ? 'success' : 'warning'" size="small">
              {{ scope.row.cardFaceFlag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pnCode" label="PN码" width="150" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredOuterCards.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑外卡" width="700px">
      <el-form :model="formData" label-width="140px">
        <el-form-item label="外卡编码" required>
          <el-input v-model="formData.outerCardCode" :disabled="!!formData.id" placeholder="请输入外卡编码" />
        </el-form-item>
        <el-form-item label="外卡名称" required>
          <el-input v-model="formData.outerCardName" placeholder="请输入外卡名称" />
        </el-form-item>
        <el-form-item label="产品大类编码">
          <el-input v-model="formData.categoryCode" disabled />
        </el-form-item>
        <el-form-item label="产品大类名称">
          <el-input v-model="formData.categoryName" disabled />
        </el-form-item>
        <el-form-item label="照片卡标识" required>
          <el-select v-model="formData.photoCardFlag" placeholder="请选择照片卡标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工标识" required>
          <el-select v-model="formData.employeeFlag" placeholder="请选择员工标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡面标识" required>
          <el-select v-model="formData.cardFaceFlag" placeholder="请选择卡面标识">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="PN码" required>
          <el-input v-model="formData.pnCode" placeholder="请输入PN码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteConfirmVisible" title="确认删除" width="400px">
      <div class="delete-confirm-content">
        <p>确认是否删除外卡信息：<strong>{{ deleteRow.outerCardName }}</strong>？</p>
      </div>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确认删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm.vue'

const categoryName = ref('标准信用卡')

const searchFields = [
  { prop: 'outerCardCode', label: '外卡编码', type: 'input', placeholder: '请输入外卡编码' },
  { prop: 'outerCardName', label: '外卡名称', type: 'input', placeholder: '请输入外卡名称' },
  { prop: 'cardFaceFlag', label: '卡面标识', type: 'select', options: [
    { label: '是', value: '是' },
    { label: '否', value: '否' }
  ]}
]

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const outerCards = ref([
  { id: 1, outerCardCode: 'OC001', outerCardName: '标准版-红色', categoryCode: 'STD001', categoryName: '标准信用卡', photoCardFlag: '否', employeeFlag: '否', cardFaceFlag: '是', pnCode: 'PN-STD-R001' },
  { id: 2, outerCardCode: 'OC002', outerCardName: '标准版-金色', categoryCode: 'STD001', categoryName: '标准信用卡', photoCardFlag: '否', employeeFlag: '否', cardFaceFlag: '是', pnCode: 'PN-STD-G001' },
  { id: 3, outerCardCode: 'OC003', outerCardName: '标准版-黑色', categoryCode: 'STD001', categoryName: '标准信用卡', photoCardFlag: '否', employeeFlag: '否', cardFaceFlag: '是', pnCode: 'PN-STD-B001' },
  { id: 4, outerCardCode: 'OC004', outerCardName: '高端版-金属银', categoryCode: 'VIP001', categoryName: '高端信用卡', photoCardFlag: '是', employeeFlag: '不考虑', cardFaceFlag: '是', pnCode: 'PN-VIP-MS001' },
  { id: 5, outerCardCode: 'OC005', outerCardName: '高端版-钛合金', categoryCode: 'VIP001', categoryName: '高端信用卡', photoCardFlag: '是', employeeFlag: '不考虑', cardFaceFlag: '是', pnCode: 'PN-VIP-TI001' }
])

const dialogVisible = ref(false)
const deleteConfirmVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteRow = reactive({})

const formData = reactive({
  id: null,
  outerCardCode: '',
  outerCardName: '',
  categoryCode: '',
  categoryName: '',
  photoCardFlag: '不考虑',
  employeeFlag: '不考虑',
  cardFaceFlag: '是',
  pnCode: ''
})

const filteredOuterCards = computed(() => {
  return outerCards.value.filter(item => {
    if (searchForm.outerCardCode && !item.outerCardCode.toLowerCase().includes(searchForm.outerCardCode.toLowerCase())) {
      return false
    }
    if (searchForm.outerCardName && !item.outerCardName.toLowerCase().includes(searchForm.outerCardName.toLowerCase())) {
      return false
    }
    if (searchForm.cardFaceFlag && item.cardFaceFlag !== searchForm.cardFaceFlag) {
      return false
    }
    return true
  })
})

const paginatedOuterCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOuterCards.value.slice(start, end)
})

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('categoryName')) {
    categoryName.value = params.get('categoryName')
  }
  if (params.get('categoryCode')) {
    formData.categoryCode = params.get('categoryCode')
  }
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

const handleReset = () => {
  searchForm.outerCardCode = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleEdit = (row) => {
  formData.id = row.id
  formData.outerCardCode = row.outerCardCode
  formData.outerCardName = row.outerCardName
  formData.categoryCode = row.categoryCode
  formData.categoryName = row.categoryName
  formData.photoCardFlag = row.photoCardFlag
  formData.employeeFlag = row.employeeFlag
  formData.cardFaceFlag = row.cardFaceFlag
  formData.pnCode = row.pnCode
  dialogVisible.value = true
}

const handleDeleteConfirm = (row) => {
  Object.assign(deleteRow, row)
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  outerCards.value = outerCards.value.filter(c => c.id !== deleteRow.id)
  deleteConfirmVisible.value = false
  ElMessage.success('删除成功')
}

const handleSubmit = () => {
  if (!formData.outerCardCode || !formData.outerCardName || !formData.pnCode) {
    ElMessage.warning('请填写必填项')
    return
  }

  const index = outerCards.value.findIndex(c => c.id === formData.id)
  if (index !== -1) {
    outerCards.value[index] = { ...formData }
    ElMessage.success('修改成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.outer-cards-container {
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

.category-tag {
  display: inline-block;
  margin-left: 10px;
  padding: 4px 12px;
  background-color: #fce4ec;
  color: #8b0000;
  border-radius: 4px;
  font-size: 12px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.delete-confirm-content {
  padding: 20px 0;
}

.delete-confirm-content p {
  font-size: 14px;
  color: #606266;
}
</style>