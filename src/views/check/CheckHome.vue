<template>
  <div class="check-home">
    <el-card>
      <template #header>
        <span>核准核查</span>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="form.applicationId" placeholder="请输入申请编号" />
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group v-model="form.checkResult">
            <el-radio value="PASS">通过</el-radio>
            <el-radio value="FAIL">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCheck" :loading="loading">提交审核</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="pending-list">
      <template #header>
        <span>待审核列表</span>
      </template>
      <el-table :data="pendingList" border>
        <el-table-column prop="applicationId" label="申请编号" />
        <el-table-column prop="cardType" label="卡片类型">
          <template #default="{ row }">{{ getCardTypeText(row.cardType) }}</template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请额度">
          <template #default="{ row }">¥{{ row.applyAmount }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="selectApplication(row)">选择</el-button>
            <el-button type="text" @click="$router.push(`/applications/detail/${row.applicationId}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const loading = ref(false)
const pendingList = ref([])

const form = reactive({
  applicationId: '',
  checkResult: '',
  remark: ''
})

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const selectApplication = (row) => {
  form.applicationId = row.applicationId
}

const handleCheck = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  if (!form.checkResult) {
    ElMessage.warning('请选择审核结果')
    return
  }

  loading.value = true
  try {
    const res = await api.check.check(form)
    if (res.code === 200) {
      ElMessage.success('审核完成')
      form.applicationId = ''
      form.checkResult = ''
      form.remark = ''
      loadPendingList()
    } else {
      ElMessage.error(res.message || '审核失败')
    }
  } catch (error) {
    ElMessage.error('审核失败')
  } finally {
    loading.value = false
  }
}

const loadPendingList = async () => {
  const res = await api.applications.status('PENDING', { page: 0, size: 20 })
  if (res.code === 200) {
    pendingList.value = res.data.content || []
  }
}

onMounted(loadPendingList)
</script>

<style scoped>
.check-home {
  padding: 20px;
  display: flex;
  gap: 20px;
}

.pending-list { flex: 1; }
</style>