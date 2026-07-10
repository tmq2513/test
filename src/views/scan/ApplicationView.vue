<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>申请件影像调阅</h3>
      </div>
      <div class="card-body">
        <el-form :model="searchForm" inline>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请件编号">
                <el-input v-model="searchForm.applicationNo" placeholder="请输入申请件编号" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户证件类型">
                <el-select v-model="searchForm.idType" placeholder="请选择证件类型" style="width: 180px">
                  <el-option label="中国居民身份证" value="中国居民身份证" />
                  <el-option label="外国人永久居留身份证" value="外国人永久居留身份证" />
                  <el-option label="港澳居民来往内地通行证（香港）" value="港澳居民来往内地通行证（香港）" />
                  <el-option label="港澳居民来往内地通行证（澳门）" value="港澳居民来往内地通行证（澳门）" />
                  <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
                  <el-option label="护照" value="护照" />
                  <el-option label="港澳居民居住证（香港）" value="港澳居民居住证（香港）" />
                  <el-option label="港澳居民居住证（澳门）" value="港澳居民居住证（澳门）" />
                  <el-option label="台湾居民居住证" value="台湾居民居住证" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户证件号码">
                <el-input v-model="searchForm.idNumber" placeholder="请输入证件号码" style="width: 200px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="filteredList" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="applicationNo" label="申请件编号" width="160" />
          <el-table-column prop="customerName" label="客户姓名" width="120" />
          <el-table-column prop="idType" label="客户证件类型" width="200" />
          <el-table-column prop="idNumber" label="客户证件号码" width="180" />
          <el-table-column prop="branch" label="所属分行" width="120" />
          <el-table-column prop="scanDate" label="扫描日期" width="160" />
          <el-table-column prop="status" label="申请件状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
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

const searchForm = reactive({
  applicationNo: '',
  idType: '',
  idNumber: ''
})

const applicationList = ref([
  {
    applicationNo: '1234567890123456',
    customerName: '张三',
    idType: '中国居民身份证',
    idNumber: '110101199001011234',
    branch: '北京分行',
    scanDate: '2024-01-20 10:30:00',
    status: '已扫描'
  },
  {
    applicationNo: '2345678901234567',
    customerName: '李四',
    idType: '中国居民身份证',
    idNumber: '310101199002021234',
    branch: '上海分行',
    scanDate: '2024-01-21 14:20:00',
    status: '已扫描'
  },
  {
    applicationNo: '3456789012345678',
    customerName: '王五',
    idType: '护照',
    idNumber: 'G12345678',
    branch: '广州分行',
    scanDate: '2024-01-19 09:15:00',
    status: '扫描中'
  },
  {
    applicationNo: '4567890123456789',
    customerName: '赵六',
    idType: '中国居民身份证',
    idNumber: '440301199006061234',
    branch: '深圳分行',
    scanDate: '2024-01-18 16:45:00',
    status: '已扫描'
  },
  {
    applicationNo: '5678901234567890',
    customerName: '钱七',
    idType: '港澳居民来往内地通行证（香港）',
    idNumber: 'H12345678',
    branch: '成都分行',
    scanDate: '2024-01-17 11:25:00',
    status: '待扫描'
  },
  {
    applicationNo: '6789012345678901',
    customerName: '孙八',
    idType: '中国居民身份证',
    idNumber: '330101199008081234',
    branch: '杭州分行',
    scanDate: '2024-01-15 13:10:00',
    status: '已扫描'
  },
  {
    applicationNo: '7890123456789012',
    customerName: '周九',
    idType: '台湾居民来往大陆通行证',
    idNumber: 'T123456789',
    branch: '南京分行',
    scanDate: '2024-01-16 15:30:00',
    status: '扫描中'
  },
  {
    applicationNo: '8901234567890123',
    customerName: '吴十',
    idType: '外国人永久居留身份证',
    idNumber: 'W123456789',
    branch: '武汉分行',
    scanDate: '2024-01-22 09:00:00',
    status: '待扫描'
  }
])

const getStatusTagType = (status) => {
  const types = {
    '待扫描': 'info',
    '扫描中': 'warning',
    '已扫描': 'success',
    '扫描失败': 'danger'
  }
  return types[status] || 'info'
}

const fullFilteredList = computed(() => {
  let result = applicationList.value
  if (searchForm.applicationNo) {
    result = result.filter(item => item.applicationNo.includes(searchForm.applicationNo))
  }
  if (searchForm.idType) {
    result = result.filter(item => item.idType === searchForm.idType)
  }
  if (searchForm.idNumber) {
    result = result.filter(item => item.idNumber.includes(searchForm.idNumber))
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
  searchForm.applicationNo = ''
  searchForm.idType = ''
  searchForm.idNumber = ''
  currentPage.value = 1
}

const handleView = (row) => {
  const viewUrl = `/scan/view-page?applicationNo=${row.applicationNo}`
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