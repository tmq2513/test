<template>
  <div class="return-container">
    <el-card>
      <div class="card-header">
        <h2>公司架构影像审核退回</h2>
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
        <el-table-column prop="companyIdNumber" label="公司证件号码" width="160" />
        <el-table-column prop="scanTeller" label="扫描柜员" width="120" />
        <el-table-column prop="scanBranch" label="扫描机构" width="140" />
        <el-table-column prop="scanTime" label="扫描时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleScan(scope.row)">影像扫描</el-button>
            <el-button type="success" size="small" @click="handleView(scope.row)">查看</el-button>
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

const router = useRouter()

const searchForm = reactive({
  applicationNo: '',
  companyName: '',
  companyIdNumber: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(30)

const tableData = ref([
  {
    id: 1,
    applicationNo: 'APP202607080005',
    companyName: '天津科技有限公司',
    companyIdNumber: '120000112233445',
    scanTeller: 'EMP009',
    scanBranch: '天津分行',
    scanTime: '2026-07-08 09:30:00'
  },
  {
    id: 2,
    applicationNo: 'APP202607070006',
    companyName: '成都分公司',
    companyIdNumber: '510000998877665',
    scanTeller: 'EMP010',
    scanBranch: '成都分行',
    scanTime: '2026-07-07 14:20:00'
  },
  {
    id: 3,
    applicationNo: 'APP202607060007',
    companyName: '武汉子公司',
    companyIdNumber: '420000556677889',
    scanTeller: 'EMP011',
    scanBranch: '武汉分行',
    scanTime: '2026-07-06 11:45:00'
  }
])

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.applicationNo = ''
  searchForm.companyName = ''
  searchForm.companyIdNumber = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleScan = (row) => {
  const scanUrl = `/scan/page?type=company-structure&applicationNo=${encodeURIComponent(row.applicationNo)}&companyName=${encodeURIComponent(row.companyName)}&companyIdNumber=${encodeURIComponent(row.companyIdNumber)}&scanTeller=${encodeURIComponent(row.scanTeller)}&scanBranch=${encodeURIComponent(row.scanBranch)}&scanTime=${encodeURIComponent(row.scanTime)}`
  window.open(scanUrl, '_blank')
}

const handleView = (row) => {
  router.push({
    path: '/company/structure-review/detail',
    query: { applicationNo: row.applicationNo, mode: 'view', from: 'return' }
  })
}
</script>

<style scoped>
.return-container {
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