<template>
  <div class="check-today-closed">
    <el-card>
      <template #header>
        <span>核准核查本日结案</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="结案状态">
          <el-select v-model="searchForm.status" placeholder="请选择结案状态" clearable>
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
            <el-option label="已退补" value="RETURNED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" />
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="cardType" label="卡片类型">
          <template #default="{ row }">{{ getCardTypeText(row.cardType) }}</template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请额度">
          <template #default="{ row }">¥{{ row.applyAmount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="结案状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="closedAt" label="结案时间" />
        <el-table-column prop="operator" label="操作人" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="$router.push(`/applications/detail/${row.applicationId}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  applicationId: '',
  status: ''
})

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const getStatusText = (status) => {
  const texts = { 'APPROVED': '已通过', 'REJECTED': '已拒绝', 'RETURNED': '已退补' }
  return texts[status] || status
}

const getStatusType = (status) => {
  const types = { 'APPROVED': 'success', 'REJECTED': 'danger', 'RETURNED': 'warning' }
  return types[status] || 'info'
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    status: searchForm.status
  }
  const res = await api.check.todayClosed(params)
  if (res.code === 200) {
    tableData.value = res.data.content || []
    total.value = res.data.totalElements || 0
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.applicationId = ''
  searchForm.status = ''
  currentPage.value = 1
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.check-today-closed { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>