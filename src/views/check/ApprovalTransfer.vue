<template>
  <div class="check-approval-transfer">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>核准核查审批调件</span>
          <div class="header-buttons">
            <el-button type="primary" @click="handleRandomTransfer">随机调件</el-button>
            <el-button type="success" :disabled="selectedRows.length === 0" @click="handleTransfer">调件</el-button>
          </div>
        </div>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="客户证件号码">
          <el-input v-model="searchForm.documentNumber" placeholder="请输入证件号码" clearable />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="applicationId" label="申请件编号" width="150" />
        <el-table-column prop="productName" label="产品发布名称" width="150" />
        <el-table-column prop="applicationType" label="申请类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.applicationType)">{{ row.applicationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="documentNumber" label="客户证件号码" width="180">
          <template #default="{ row }">{{ maskDocumentNumber(row.documentNumber) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="申请件状态" width="100">
          <template #default="{ row }">
            <el-tag type="warning">待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="organization" label="所属机构" width="120" />
        <el-table-column prop="scanDate" label="创建日期" width="160" />
      </el-table>
      <div class="pagination-container">
        <span class="selected-info">已选择 {{ selectedRows.length }} 条</span>
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
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref([])

const searchForm = reactive({
  applicationId: '',
  documentNumber: '',
  customerName: ''
})

const maskDocumentNumber = (number) => {
  if (!number) return ''
  if (number.length === 18) {
    return number.substring(0, 4) + '**********' + number.substring(14)
  }
  if (number.length > 8) {
    return number.substring(0, 4) + '****' + number.substring(number.length - 4)
  }
  return number
}

const getTypeTagType = (type) => {
  const types = { '主': 'primary', '附': 'success', '主附': 'warning' }
  return types[type] || 'info'
}

const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    documentNumber: searchForm.documentNumber,
    customerName: searchForm.customerName
  }
  const res = await api.check.approvalTransfer(params)
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
  searchForm.documentNumber = ''
  searchForm.customerName = ''
  currentPage.value = 1
  loadData()
}

const handleRandomTransfer = async () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('当前列表为空，无法随机调件')
    return
  }
  const randomIndex = Math.floor(Math.random() * tableData.value.length)
  const randomRow = tableData.value[randomIndex]
  const res = await api.check.transfer({
    applicationIds: [randomRow.applicationId],
    transferType: 'random',
    remark: ''
  })
  if (res.code === 200) {
    ElMessage.success(`${randomRow.applicationId}申请件，调件成功`)
    router.push(`/check/audit?id=${randomRow.applicationId}`)
  } else {
    ElMessage.error(res.message || '调件失败')
  }
}

const handleTransfer = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择至少一个申请件')
    return
  }
  const applicationIds = selectedRows.value.map(row => row.applicationId)
  const res = await api.check.transfer({
    applicationIds,
    transferType: 'manual',
    remark: ''
  })
  if (res.code === 200) {
    ElMessage.success(`${applicationIds.join('、')}申请件，调件成功`)
    router.push(`/check/audit?id=${applicationIds[0]}`)
  } else {
    ElMessage.error(res.message || '调件失败')
  }
}

onMounted(loadData)
</script>

<style scoped>
.check-approval-transfer { padding: 20px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-buttons { display: flex; gap: 10px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.selected-info { color: #666; }
</style>