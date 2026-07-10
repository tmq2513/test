<template>
  <div class="check-corporate-card-transfer">
    <el-card>
      <template #header>
        <span>核准核查公务卡审批调件</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="客户证件类型">
          <el-select v-model="searchForm.documentType" placeholder="请选择证件类型" clearable>
            <el-option label="身份证" value="身份证" />
            <el-option label="营业执照" value="营业执照" />
            <el-option label="护照" value="护照" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户证件号码">
          <el-input v-model="searchForm.documentNumber" placeholder="请输入证件号码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" />
        <el-table-column prop="formNumber" label="表单编号" />
        <el-table-column prop="applicationType" label="申请类型" />
        <el-table-column prop="documentType" label="客户证件类型" />
        <el-table-column prop="documentNumber" label="客户证件号码">
          <template #default="{ row }">{{ maskDocumentNumber(row.documentNumber) }}</template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="organization" label="所属机构" />
        <el-table-column prop="scanDate" label="扫描日期" />
        <el-table-column prop="scanOperator" label="扫描人员编号" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="handleCheck(row)">核查</el-button>
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
  documentType: '',
  documentNumber: ''
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

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    documentType: searchForm.documentType,
    documentNumber: searchForm.documentNumber
  }
  const res = await api.check.corporateCardTransfer(params)
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
  searchForm.documentType = ''
  searchForm.documentNumber = ''
  currentPage.value = 1
  loadData()
}

const handleCheck = (row) => {
  ElMessage.info(`正在核查公务卡申请件: ${row.applicationId}`)
}

onMounted(loadData)
</script>

<style scoped>
.check-corporate-card-transfer { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>