<template>
  <div class="applications">
    <el-card>
      <div class="card-header">
        <h2>申请列表</h2>
        <el-button type="primary" @click="$router.push('/applications/create')">
          <el-icon><component :is="Plus" /></el-icon>
          创建申请
        </el-button>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请编号" />
        <el-table-column prop="cardType" label="卡片类型" />
        <el-table-column prop="applyAmount" label="申请额度">
          <template #default="{ row }">¥{{ row.applyAmount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditScore" label="信用评分" />
        <el-table-column prop="creditLevel" label="信用等级">
          <template #default="{ row }">{{ getCreditLevelText(row.creditLevel) }}</template>
        </el-table-column>
        <el-table-column prop="approvedAmount" label="批准额度">
          <template #default="{ row }">¥{{ row.approvedAmount || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
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
import { Plus } from '@element-plus/icons-vue'
import api from '@/api'
import SearchForm from '@/components/SearchForm.vue'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchFields = [
  { prop: 'applicationId', label: '申请编号', type: 'input', placeholder: '请输入申请编号' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '待录入', value: 'PENDING' },
    { label: '信息完整', value: 'INFORMATION_COMPLETE' },
    { label: '核审中', value: 'CHECKING' },
    { label: '审核通过', value: 'CHECK_PASSED' },
    { label: '待审批', value: 'APPROVAL_PENDING' },
    { label: '已批准', value: 'APPROVED' },
    { label: '已拒绝', value: 'REJECTED' }
  ]}
]

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const getStatusTagType = (status) => {
  const types = {
    'PENDING': 'info',
    'INFORMATION_COMPLETE': 'primary',
    'CHECKING': 'warning',
    'CHECK_PASSED': 'success',
    'CHECK_FAILED': 'danger',
    'APPROVAL_PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': '待录入',
    'INFORMATION_COMPLETE': '信息完整',
    'CHECKING': '核审中',
    'CHECK_PASSED': '审核通过',
    'CHECK_FAILED': '审核不通过',
    'APPROVAL_PENDING': '待审批',
    'APPROVED': '已批准',
    'REJECTED': '已拒绝'
  }
  return texts[status] || status
}

const getCreditLevelText = (level) => {
  const texts = {
    'EXCELLENT': '优秀',
    'GOOD': '良好',
    'FAIR': '一般',
    'POOR': '较差',
    'BAD': '极差'
  }
  return texts[level] || '-'
}

const loadData = async () => {
  const params = { page: currentPage.value - 1, size: pageSize.value }
  if (searchForm.status) {
    const res = await api.applications.status(searchForm.status, params)
    if (res.code === 200) {
      tableData.value = res.data.content || []
      total.value = res.data.totalElements || 0
    }
  } else {
    const res = await api.applications.list(params)
    if (res.code === 200) {
      tableData.value = res.data.content || []
      total.value = res.data.totalElements || 0
    }
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  currentPage.value = 1
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.applications {
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