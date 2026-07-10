<template>
  <div class="review-container">
    <el-card>
      <div class="card-header">
        <h2>公司架构影像复核</h2>
      </div>
      <div class="search-form">
        <el-form :model="searchForm" :inline="true" label-width="100px">
          <el-form-item label="申请件编号">
            <el-input v-model="searchForm.applicationNo" placeholder="请输入申请件编号" clearable />
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input v-model="searchForm.companyName" placeholder="请输入公司名称" clearable />
          </el-form-item>
          <el-form-item label="公司证件号码">
            <el-input v-model="searchForm.companyIdNumber" placeholder="请输入公司证件号码" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%" :max-height="600">
        <el-table-column prop="applicationNo" label="申请件编号" width="160" />
        <el-table-column prop="companyName" label="公司名称" min-width="180" />
        <el-table-column prop="companyIdType" label="公司证件类型" width="140" />
        <el-table-column prop="companyIdNumber" label="公司证件号码" width="160" />
        <el-table-column prop="paymentMethod" label="清偿方式" width="100" />
        <el-table-column prop="scanTeller" label="扫描柜员" width="100" />
        <el-table-column prop="scanOrganization" label="扫描机构" width="120" />
        <el-table-column prop="scanDate" label="扫描日期" width="140" />
        <el-table-column prop="status" label="审核状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" v-if="scope.row.status === 'PENDING'" @click="handleClaim(scope.row)">领取</el-button>
            <el-button type="success" size="small" v-if="scope.row.status === 'PROCESSING'" @click="handleReview(scope.row)">复核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const searchForm = reactive({
  applicationNo: '',
  companyName: '',
  companyIdNumber: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

const tableData = ref([
  {
    id: 1,
    applicationNo: 'APP202607090001',
    companyName: '北京总公司',
    companyCustomerNo: 'CUST001',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '110000123456789',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP001',
    scanOrganization: '北京分行',
    scanDate: '2026-07-09',
    status: 'PENDING'
  },
  {
    id: 2,
    applicationNo: 'APP202607090002',
    companyName: '上海分公司',
    companyCustomerNo: 'CUST002',
    companyIdType: '企业营业执照',
    companyIdNumber: '310000987654321',
    paymentMethod: '个人清偿',
    scanTeller: 'EMP002',
    scanOrganization: '上海分行',
    scanDate: '2026-07-09',
    status: 'PENDING'
  },
  {
    id: 3,
    applicationNo: 'APP202607080003',
    companyName: '广州子公司',
    companyCustomerNo: 'CUST003',
    companyIdType: '统一社会信用代码证',
    companyIdNumber: '440000112233445',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP003',
    scanOrganization: '广州分行',
    scanDate: '2026-07-08',
    status: 'PROCESSING'
  },
  {
    id: 4,
    applicationNo: 'APP202607080004',
    companyName: '深圳科技有限公司',
    companyCustomerNo: 'CUST004',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '440300556677889',
    paymentMethod: '个人清偿',
    scanTeller: 'EMP004',
    scanOrganization: '深圳分行',
    scanDate: '2026-07-08',
    status: 'PROCESSING'
  }
])

const getStatusTagType = (status) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'PROCESSING': return 'info'
    default: return 'info'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING': return '待复核'
    case 'PROCESSING': return '复核中'
    default: return status
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.applicationNo = ''
  searchForm.companyName = ''
  searchForm.status = ''
  searchForm.scanDate = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleClaim = (row) => {
  row.status = 'PROCESSING'
  ElMessage.success(`${row.companyName} 领取成功`)
  router.push({
    path: '/company/structure-review/detail',
    query: { id: row.id, applicationNo: row.applicationNo }
  })
}

const handleReview = (row) => {
  router.push({
    path: '/company/structure-review/detail',
    query: { id: row.id, applicationNo: row.applicationNo }
  })
}
</script>

<style scoped>
.review-container {
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

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>