<template>
  <div class="entry-unclosed">
    <el-card>
      <template #header>
        <span>录入未结案</span>
      </template>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" width="160">
          <template #default="{ row }">
            <el-button type="text" @click="handleEntry(row)">{{ row.applicationId }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品数字代码" width="120" />
        <el-table-column prop="productName" label="产品发布名称" width="150" />
        <el-table-column prop="applicationType" label="申请类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getApplicationTypeTagType(row.applicationType)">{{ row.applicationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentType" label="客户证件类型" width="120" />
        <el-table-column prop="documentNumber" label="客户证件号码" width="180">
          <template #default="{ row }">{{ maskDocumentNumber(row.documentNumber) }}</template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="organization" label="所属机构" width="120" />
        <el-table-column prop="scanDate" label="扫描日期" width="160" />
        <el-table-column prop="scanOperator" label="录入员工" width="120" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

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

const getApplicationTypeTagType = (type) => {
  const types = {
    '主': 'primary',
    '附': 'info',
    '主附': 'warning'
  }
  return types[type] || 'info'
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value
  }
  const res = await api.entryUnclosed.list(params)
  if (res.code === 200) {
    tableData.value = res.data.content || []
    total.value = res.data.totalElements || 0
  }
}

const handleEntry = (row) => {
  router.push({
    path: '/entry/transfer/form',
    query: {
      applicationType: row.applicationType,
      applicationId: row.applicationId,
      productCode: row.productCode,
      productName: row.productName
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.entry-unclosed { padding: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>