<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>公司架构影像调阅</h3>
      </div>
      <div class="card-body">
        <el-form :model="searchForm" inline>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="公司证件号">
                <el-input v-model="searchForm.companyIdNumber" placeholder="请输入公司证件号" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司名称">
                <el-input v-model="searchForm.companyName" placeholder="请输入公司名称" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请件编号">
                <el-input v-model="searchForm.applicationNo" placeholder="请输入申请件编号" style="width: 200px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showMore" :gutter="20">
            <el-col :span="8">
              <el-form-item label="公司客户号">
                <el-input v-model="searchForm.companyCustomerNo" placeholder="请输入公司客户号" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="text" @click="showMore = !showMore">
                {{ showMore ? '收起' : '更多' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="filteredList" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="applicationNo" label="申请件编号" width="160" />
          <el-table-column prop="companyName" label="公司名称" width="200" />
          <el-table-column prop="companyIdType" label="公司证件类型" width="160" />
          <el-table-column prop="companyIdNumber" label="公司证件号码" width="180" />
          <el-table-column prop="companyStatus" label="公司状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.companyStatus)">{{ row.companyStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scanAgency" label="扫描机构" width="140" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleView(row)">调阅</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="fullFilteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; text-align: right"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const showMore = ref(false)

const searchForm = reactive({
  companyIdNumber: '',
  companyName: '',
  applicationNo: '',
  companyCustomerNo: ''
})

const companyList = ref([
  {
    applicationNo: '1234567890123456',
    companyName: '北京科技有限公司',
    companyIdType: '营业执照',
    companyIdNumber: '91110108MA01XXXXXX',
    companyCustomerNo: 'CUST001',
    companyStatus: '正常',
    scanAgency: '北京分行'
  },
  {
    applicationNo: '2345678901234567',
    companyName: '上海金融集团',
    companyIdType: '营业执照',
    companyIdNumber: '91310000MA02XXXXXX',
    companyCustomerNo: 'CUST002',
    companyStatus: '正常',
    scanAgency: '上海分行'
  },
  {
    applicationNo: '3456789012345678',
    companyName: '广州贸易公司',
    companyIdType: '营业执照',
    companyIdNumber: '91440100MA03XXXXXX',
    companyCustomerNo: 'CUST003',
    companyStatus: '待审核',
    scanAgency: '广州分行'
  },
  {
    applicationNo: '4567890123456789',
    companyName: '深圳投资控股',
    companyIdType: '营业执照',
    companyIdNumber: '91440300MA04XXXXXX',
    companyCustomerNo: 'CUST004',
    companyStatus: '审核中',
    scanAgency: '深圳分行'
  },
  {
    applicationNo: '5678901234567890',
    companyName: '成都软件股份有限公司',
    companyIdType: '营业执照',
    companyIdNumber: '91510100MA05XXXXXX',
    companyCustomerNo: 'CUST005',
    companyStatus: '待建立',
    scanAgency: '成都分行'
  },
  {
    applicationNo: '6789012345678901',
    companyName: '杭州制造企业',
    companyIdType: '营业执照',
    companyIdNumber: '91330100MA06XXXXXX',
    companyCustomerNo: 'CUST006',
    companyStatus: '停用',
    scanAgency: '杭州分行'
  },
  {
    applicationNo: '7890123456789012',
    companyName: '南京物流集团',
    companyIdType: '营业执照',
    companyIdNumber: '91320100MA07XXXXXX',
    companyCustomerNo: 'CUST007',
    companyStatus: '正常',
    scanAgency: '南京分行'
  },
  {
    applicationNo: '8901234567890123',
    companyName: '武汉电子商务有限公司',
    companyIdType: '营业执照',
    companyIdNumber: '91420100MA08XXXXXX',
    companyCustomerNo: 'CUST008',
    companyStatus: '正常',
    scanAgency: '武汉分行'
  }
])

const getStatusTagType = (status) => {
  const types = {
    '停用': 'danger',
    '正常': 'success',
    '待建立': 'info',
    '待审核': 'warning',
    '审核中': 'warning'
  }
  return types[status] || 'info'
}

const fullFilteredList = computed(() => {
  let result = companyList.value
  if (searchForm.companyIdNumber) {
    result = result.filter(item => item.companyIdNumber.includes(searchForm.companyIdNumber))
  }
  if (searchForm.companyName) {
    result = result.filter(item => item.companyName.includes(searchForm.companyName))
  }
  if (searchForm.applicationNo) {
    result = result.filter(item => item.applicationNo.includes(searchForm.applicationNo))
  }
  if (searchForm.companyCustomerNo) {
    result = result.filter(item => item.companyCustomerNo.includes(searchForm.companyCustomerNo))
  }
  return result
})

const filteredList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullFilteredList.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.companyIdNumber = ''
  searchForm.companyName = ''
  searchForm.applicationNo = ''
  searchForm.companyCustomerNo = ''
  currentPage.value = 1
}

const handleView = (row) => {
  const viewUrl = `/scan/view-page?applicationNo=${row.applicationNo}&viewOnly=true&companyView=true`
  window.open(viewUrl, '_blank')
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
.scan-container {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.card-body {
  min-height: 400px;
}
</style>