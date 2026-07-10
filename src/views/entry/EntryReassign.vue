<template>
  <div class="entry-reassign">
    <el-card>
      <template #header>
        <span>录入重新分派</span>
      </template>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" width="160">
          <template #default="{ row }">
            <el-button type="text" @click="handleDetail(row)">{{ row.applicationId }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品数字代码" width="120" />
        <el-table-column prop="productName" label="产品发布名称" width="160" />
        <el-table-column prop="applicationType" label="申请类型" width="100" />
        <el-table-column prop="documentType" label="客户证件类型" width="120" />
        <el-table-column prop="documentNumber" label="客户证件号码" width="180">
          <template #default="{ row }">
            {{ maskDocumentNumber(row.documentNumber) }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="organization" label="所属机构" width="120" />
        <el-table-column prop="scanOperator" label="录入员工编号" width="120" />
        <el-table-column prop="entryOrganization" label="录入机构" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="handleReassign(row)">重新分配</el-button>
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
    <el-dialog v-model="reassignDialogVisible" title="重新分配" width="500px">
      <el-form :model="reassignForm" label-width="120px">
        <el-form-item label="重新分配原因">
          <el-select v-model="reassignForm.reason" placeholder="请选择重新分配原因">
            <el-option label="录入错误" value="ENTRY_ERROR" />
            <el-option label="信息不完整" value="INCOMPLETE_INFO" />
            <el-option label="申请件重复" value="DUPLICATE" />
            <el-option label="客户信息变更" value="CUSTOMER_CHANGE" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="重新分配备注">
          <el-input v-model="reassignForm.remark" type="textarea" :rows="3" placeholder="请输入重新分配备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reassignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReassign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'

const router = useRouter()
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const reassignDialogVisible = ref(false)
const selectedApplication = ref(null)

const reassignForm = reactive({
  reason: '',
  remark: ''
})

const maskDocumentNumber = (number) => {
  if (!number) return ''
  if (number.length <= 8) return number
  return number.slice(0, 4) + '********' + number.slice(-4)
}

const loadData = async () => {
  const params = { page: currentPage.value - 1, size: pageSize.value }
  const res = await api.entryTransfer.list(params)
  if (res.code === 200) {
    tableData.value = res.data.content || []
    total.value = res.data.totalElements || 0
  }
}

const handleDetail = (row) => {
  router.push(`/entry/closed/detail?applicationId=${row.applicationId}&from=reassign`)
}

const handleReassign = (row) => {
  selectedApplication.value = row
  reassignForm.reason = ''
  reassignForm.remark = ''
  reassignDialogVisible.value = true
}

const confirmReassign = () => {
  if (!reassignForm.reason) {
    ElMessage.warning('请选择重新分配原因')
    return
  }
  ElMessage.success(`申请 ${selectedApplication.value.applicationId} 已重新分配`)
  reassignDialogVisible.value = false
}

onMounted(loadData)
</script>

<style scoped>
.entry-reassign { padding: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>