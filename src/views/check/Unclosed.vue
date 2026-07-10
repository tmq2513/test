<template>
  <div class="check-unclosed">
    <el-card>
      <template #header>
        <span>核准核查未结案</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item label="申请类型">
          <el-select v-model="searchForm.applicationType" placeholder="请选择申请类型" clearable>
            <el-option label="主" value="主" />
            <el-option label="附" value="附" />
            <el-option label="主附" value="主附" />
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
        <el-table-column prop="applicationType" label="申请类型" />
        <el-table-column prop="cardType" label="卡片类型">
          <template #default="{ row }">{{ getCardTypeText(row.cardType) }}</template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请额度">
          <template #default="{ row }">¥{{ row.applyAmount }}</template>
        </el-table-column>
        <el-table-column prop="currentStatus" label="当前状态" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="assignee" label="当前处理人" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="$router.push(`/applications/detail/${row.applicationId}`)">详情</el-button>
            <el-button type="text" @click="handleProcess(row)">处理</el-button>
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
import { ElMessage } from 'element-plus'
import api from '@/api'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  applicationId: '',
  customerName: '',
  applicationType: ''
})

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    customerName: searchForm.customerName,
    applicationType: searchForm.applicationType
  }
  const res = await api.check.unclosed(params)
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
  searchForm.customerName = ''
  searchForm.applicationType = ''
  currentPage.value = 1
  loadData()
}

const handleProcess = (row) => {
  ElMessage.info(`正在处理申请件: ${row.applicationId}`)
}

onMounted(loadData)
</script>

<style scoped>
.check-unclosed { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>