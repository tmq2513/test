<template>
  <div class="check-return-supplement">
    <el-card>
      <template #header>
        <span>核准核查退补</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item label="退补状态">
          <el-select v-model="searchForm.status" placeholder="请选择退补状态" clearable>
            <el-option label="待退补" value="PENDING_RETURN" />
            <el-option label="已退补" value="RETURNED" />
            <el-option label="已补齐" value="SUPPLEMENTED" />
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
        <el-table-column prop="returnReason" label="退补原因" />
        <el-table-column prop="status" label="退补状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="returnTime" label="退补时间" />
        <el-table-column prop="operator" label="操作人" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="$router.push(`/applications/detail/${row.applicationId}`)">详情</el-button>
            <el-button type="text" v-if="row.status === 'RETURNED'" @click="handleSupplement(row)">补齐</el-button>
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

    <el-dialog v-model="supplementDialogVisible" title="补齐材料" width="500px">
      <el-form :model="supplementForm" label-width="100px">
        <el-form-item label="申请件编号">
          <el-input v-model="supplementForm.applicationId" disabled />
        </el-form-item>
        <el-form-item label="补齐备注">
          <el-input v-model="supplementForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="supplementDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSupplement">确定</el-button>
      </template>
    </el-dialog>
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
  status: ''
})

const supplementDialogVisible = ref(false)

const supplementForm = reactive({
  applicationId: '',
  remark: ''
})

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const getStatusText = (status) => {
  const texts = { 'PENDING_RETURN': '待退补', 'RETURNED': '已退补', 'SUPPLEMENTED': '已补齐' }
  return texts[status] || status
}

const getStatusType = (status) => {
  const types = { 'PENDING_RETURN': 'warning', 'RETURNED': 'danger', 'SUPPLEMENTED': 'success' }
  return types[status] || 'info'
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    customerName: searchForm.customerName,
    status: searchForm.status
  }
  const res = await api.check.returnSupplement(params)
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
  searchForm.status = ''
  currentPage.value = 1
  loadData()
}

const handleSupplement = (row) => {
  supplementForm.applicationId = row.applicationId
  supplementForm.remark = ''
  supplementDialogVisible.value = true
}

const confirmSupplement = async () => {
  const res = await api.check.supplement({
    applicationId: supplementForm.applicationId,
    remark: supplementForm.remark
  })
  if (res.code === 200) {
    ElMessage.success('补齐成功')
    supplementDialogVisible.value = false
    loadData()
  } else {
    ElMessage.error(res.message || '补齐失败')
  }
}

onMounted(loadData)
</script>

<style scoped>
.check-return-supplement { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>