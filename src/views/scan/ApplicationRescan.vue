<template>
  <div class="rescan-container">
    <el-card>
      <div class="card-header">
        <h3>申请补扫</h3>
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
              <el-form-item label="客户姓名">
                <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" style="width: 180px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="id-group">
                <el-form-item label="证件类型+证件号码">
                  <el-select v-model="searchForm.idType" placeholder="证件类型" style="width: 140px; margin-right: 8px">
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
                  <el-input v-model="searchForm.idNumber" placeholder="证件号码" style="width: 140px" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="showMore" :gutter="20">
            <el-col :span="8">
              <el-form-item label="扫描柜员">
                <el-input v-model="searchForm.operator" placeholder="请输入扫描柜员" style="width: 150px" />
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
          <el-table-column prop="customerName" label="客户姓名" width="120" />
          <el-table-column prop="idType" label="客户证件类型" width="180" />
          <el-table-column prop="idNumber" label="客户证件号码" width="200" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleRescan(row)">补扫</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="filteredList.length"
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
  applicationNo: '',
  customerName: '',
  idType: '',
  idNumber: '',
  operator: ''
})

const rescanList = ref([
  {
    applicationNo: '1234567890123456',
    customerName: '张三',
    idType: '中国居民身份证',
    idNumber: '110101199001011234',
    remark: '需要补充身份证明文件',
    operator: 'OP001',
    scannedFiles: [
      { type: '99-申请表单', files: ['申请表_张三.pdf'] },
      { type: '02-主卡身份证明文件', files: ['身份证正面.jpg'] }
    ]
  },
  {
    applicationNo: '2345678901234567',
    customerName: '李四',
    idType: '中国居民身份证',
    idNumber: '310101198505055678',
    remark: '财力证明文件缺失',
    operator: 'OP002',
    scannedFiles: [
      { type: '99-申请表单', files: ['申请表_李四.pdf'] }
    ]
  },
  {
    applicationNo: '3456789012345678',
    customerName: '王五',
    idType: '护照',
    idNumber: 'G12345678',
    remark: '需要补充护照复印件',
    operator: 'OP001',
    scannedFiles: [
      { type: '99-申请表单', files: ['申请表_王五.pdf'] },
      { type: '03-财力证明文件', files: ['收入证明.pdf', '银行流水.pdf'] }
    ]
  },
  {
    applicationNo: '4567890123456789',
    customerName: '赵六',
    idType: '中国居民身份证',
    idNumber: '440301199203037890',
    remark: '居住证明需要更新',
    operator: 'OP003',
    scannedFiles: [
      { type: '99-申请表单', files: ['申请表_赵六.pdf'] },
      { type: '02-主卡身份证明文件', files: ['身份证正反面.jpg'] },
      { type: '04-居住证明文件', files: ['租房合同.pdf'] }
    ]
  },
  {
    applicationNo: '5678901234567890',
    customerName: '孙七',
    idType: '中国居民身份证',
    idNumber: '330101198812123456',
    remark: '综合开户申请表缺失',
    operator: 'OP002',
    scannedFiles: [
      { type: '02-主卡身份证明文件', files: ['身份证.jpg'] }
    ]
  }
])

const filteredList = computed(() => {
  let result = rescanList.value
  if (searchForm.applicationNo) {
    result = result.filter(item => item.applicationNo.includes(searchForm.applicationNo))
  }
  if (searchForm.customerName) {
    result = result.filter(item => item.customerName.includes(searchForm.customerName))
  }
  if (searchForm.idType) {
    result = result.filter(item => item.idType === searchForm.idType)
  }
  if (searchForm.idNumber) {
    result = result.filter(item => item.idNumber.includes(searchForm.idNumber))
  }
  if (searchForm.operator) {
    result = result.filter(item => item.operator.includes(searchForm.operator))
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.applicationNo = ''
  searchForm.customerName = ''
  searchForm.idType = ''
  searchForm.idNumber = ''
  searchForm.operator = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleRescan = (row) => {
  const scannedFiles = encodeURIComponent(JSON.stringify(row.scannedFiles))
  const scanUrl = `/scan/page?type=application-rescan&applicationNo=${row.applicationNo}&customerName=${encodeURIComponent(row.customerName)}&idType=${encodeURIComponent(row.idType)}&idNumber=${encodeURIComponent(row.idNumber)}&scannedFiles=${scannedFiles}`
  window.open(scanUrl, '_blank')
}
</script>

<style scoped>
.rescan-container {
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

.id-group {
  display: flex;
  align-items: center;
}

.id-group .el-select {
  margin-right: 8px;
}

.id-group .el-input {
  flex: 1;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-row {
  margin-bottom: 10px;
}
</style>