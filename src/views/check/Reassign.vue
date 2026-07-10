<template>
  <div class="check-reassign">
    <el-card>
      <template #header>
        <span>核准核查重新分派</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="当前处理人">
          <el-input v-model="searchForm.currentAssignee" placeholder="请输入当前处理人" clearable />
        </el-form-item>
        <el-form-item label="所属机构">
          <el-input v-model="searchForm.organization" placeholder="请输入所属机构" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" />
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="currentAssignee" label="当前处理人" />
        <el-table-column prop="organization" label="所属机构" />
        <el-table-column prop="currentStatus" label="当前状态" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="handleReassign(row)">重新分派</el-button>
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

    <el-dialog v-model="reassignDialogVisible" title="重新分派" width="500px">
      <el-form :model="reassignForm" label-width="100px">
        <el-form-item label="申请件编号">
          <el-input v-model="reassignForm.applicationId" disabled />
        </el-form-item>
        <el-form-item label="新处理人" required>
          <el-select v-model="reassignForm.newAssignee" placeholder="请选择新处理人">
            <el-option v-for="user in availableUsers" :key="user.id" :label="user.realName" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分派原因">
          <el-input v-model="reassignForm.reason" type="textarea" />
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
import { ElMessage } from 'element-plus'
import api from '@/api'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  applicationId: '',
  currentAssignee: '',
  organization: ''
})

const reassignDialogVisible = ref(false)
const availableUsers = ref([])

const reassignForm = reactive({
  applicationId: '',
  newAssignee: '',
  reason: ''
})

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    currentAssignee: searchForm.currentAssignee,
    organization: searchForm.organization
  }
  const res = await api.check.reassignList(params)
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
  searchForm.currentAssignee = ''
  searchForm.organization = ''
  currentPage.value = 1
  loadData()
}

const handleReassign = async (row) => {
  reassignForm.applicationId = row.applicationId
  reassignForm.newAssignee = ''
  reassignForm.reason = ''
  const res = await api.users.list({ page: 0, size: 100 })
  if (res.code === 200) {
    availableUsers.value = res.data.content || []
  }
  reassignDialogVisible.value = true
}

const confirmReassign = async () => {
  if (!reassignForm.newAssignee) {
    ElMessage.warning('请选择新处理人')
    return
  }
  const res = await api.check.reassign({
    applicationId: reassignForm.applicationId,
    newAssignee: reassignForm.newAssignee,
    reason: reassignForm.reason
  })
  if (res.code === 200) {
    ElMessage.success('重新分派成功')
    reassignDialogVisible.value = false
    loadData()
  } else {
    ElMessage.error(res.message || '分派失败')
  }
}

onMounted(loadData)
</script>

<style scoped>
.check-reassign { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>