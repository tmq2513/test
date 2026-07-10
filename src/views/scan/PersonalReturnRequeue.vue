<template>
  <div class="requeue-container">
    <el-card>
      <div class="card-header">
        <h3>个人申请退件重扫队列</h3>
      </div>
      <div class="card-body">
        <el-form :model="searchForm" inline>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请件编号">
                <el-input v-model="searchForm.applicationNo" placeholder="请输入申请件编号" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="filteredList" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="applicationNo" label="申请件编号" width="160" />
          <el-table-column prop="initiator" label="重扫发起人" width="120" />
          <el-table-column prop="requestTime" label="重扫请求时间" width="180" />
          <el-table-column prop="reason" label="重扫原因" />
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleRescan(row)">重扫</el-button>
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

const searchForm = reactive({
  applicationNo: ''
})

const requeueList = ref([
  {
    applicationNo: '1234567890123456',
    initiator: '张三',
    requestTime: '2024-01-15 10:30:00',
    reason: '身份证扫描不清晰'
  },
  {
    applicationNo: '2345678901234567',
    initiator: '李四',
    requestTime: '2024-01-16 14:20:00',
    reason: '财力证明文件缺失'
  },
  {
    applicationNo: '3456789012345678',
    initiator: '王五',
    requestTime: '2024-01-17 09:15:00',
    reason: '申请表单信息错误'
  },
  {
    applicationNo: '4567890123456789',
    initiator: '赵六',
    requestTime: '2024-01-18 16:45:00',
    reason: '居住证明文件不全'
  },
  {
    applicationNo: '5678901234567890',
    initiator: '孙七',
    requestTime: '2024-01-19 11:25:00',
    reason: '其他原因'
  },
  {
    applicationNo: '6789012345678901',
    initiator: '周八',
    requestTime: '2024-01-20 13:10:00',
    reason: '身份证照片不清晰'
  },
  {
    applicationNo: '7890123456789012',
    initiator: '吴九',
    requestTime: '2024-01-21 15:30:00',
    reason: '需要补充其他材料'
  }
])

const filteredList = computed(() => {
  let result = requeueList.value
  if (searchForm.applicationNo) {
    result = result.filter(item => item.applicationNo.includes(searchForm.applicationNo))
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
  const scanUrl = `/scan/page?type=personal-card&applicationNo=${row.applicationNo}`
  window.open(scanUrl, '_blank')
}
</script>

<style scoped>
.requeue-container {
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

.el-form-item {
  margin-bottom: 10px;
}

.el-row {
  margin-bottom: 10px;
}
</style>