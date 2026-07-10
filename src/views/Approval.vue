<template>
  <div class="approval">
    <el-card>
      <template #header>
        <span>审批决策</span>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="form.applicationId" placeholder="请输入申请编号" />
        </el-form-item>
        <el-form-item label="审批结果">
          <el-radio-group v-model="form.approvalResult" @change="onResultChange">
            <el-radio value="APPROVE">批准</el-radio>
            <el-radio value="REJECT">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="批准额度" v-if="form.approvalResult === 'APPROVE'">
          <el-input v-model="form.approvedAmount" prefix="¥" />
        </el-form-item>
        <el-form-item label="拒绝原因" v-if="form.approvalResult === 'REJECT'">
          <el-input v-model="form.rejectReason" type="textarea" />
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleApproval" :loading="loading">提交审批</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="pending-list">
      <template #header>
        <span>待审批列表</span>
      </template>
      <el-table :data="pendingList" border>
        <el-table-column prop="applicationId" label="申请编号" />
        <el-table-column prop="cardType" label="卡片类型">
          <template #default="{ row }">{{ getCardTypeText(row.cardType) }}</template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请额度">
          <template #default="{ row }">¥{{ row.applyAmount }}</template>
        </el-table-column>
        <el-table-column prop="creditScore" label="信用评分" />
        <el-table-column prop="creditLevel" label="信用等级">
          <template #default="{ row }">{{ getCreditLevelText(row.creditLevel) }}</template>
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
  approvalResult: '',
  approvedAmount: '',
  rejectReason: '',
  remark: ''
})

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const getCreditLevelText = (level) => {
  const texts = {
    'EXCELLENT': '优秀',
    'GOOD': '良好',
    'FAIR': '一般',
    'POOR': '较差',
    'BAD': '极差'
  }
  return texts[level] || '-'
}

const onResultChange = () => {
  if (form.approvalResult === 'APPROVE') {
    form.rejectReason = ''
  } else {
    form.approvedAmount = ''
  }
}

const selectApplication = (row) => {
  form.applicationId = row.applicationId
}

const handleApproval = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  if (!form.approvalResult) {
    ElMessage.warning('请选择审批结果')
    return
  }
  if (form.approvalResult === 'REJECT' && !form.rejectReason) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  loading.value = true
  try {
    const res = await api.approval.approve(form)
    if (res.code === 200) {
      ElMessage.success('审批完成')
      form.applicationId = ''
      form.approvalResult = ''
      form.approvedAmount = ''
      form.rejectReason = ''
      form.remark = ''
      loadPendingList()
    } else {
      ElMessage.error(res.message || '审批失败')
    }
  } catch (error) {
    ElMessage.error('审批失败')
  } finally {
    loading.value = false
  }
}

const loadPendingList = async () => {
  const res = await api.applications.status('APPROVAL_PENDING', { page: 0, size: 20 })
  if (res.code === 200) {
    pendingList.value = res.data.content || []
  }
}

onMounted(loadPendingList)
</script>

<style scoped>
.approval {
  padding: 20px;
  display: flex;
  gap: 20px;
}

.pending-list { flex: 1; }
</style>