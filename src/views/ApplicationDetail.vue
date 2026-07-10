<template>
  <div class="application-detail">
    <el-card v-if="data">
      <template #header>
        <div class="header">
          <span>申请详情 - {{ data.applicationId }}</span>
          <el-tag :type="getStatusTagType(data.status)">{{ getStatusText(data.status) }}</el-tag>
        </div>
      </template>

      <el-divider content-position="left">基本信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ data.applicant.name }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ data.applicant.idCard }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ data.applicant.genderDescription }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ data.applicant.age }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ data.applicant.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ data.applicant.email }}</el-descriptions-item>
        <el-descriptions-item label="婚姻状况">{{ data.applicant.maritalStatusDescription }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ data.applicant.education }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ data.applicant.address }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">就业信息</el-divider>
      <el-descriptions :column="2" border v-if="data.employmentInfo">
        <el-descriptions-item label="公司名称">{{ data.employmentInfo.companyName }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ data.employmentInfo.position }}</el-descriptions-item>
        <el-descriptions-item label="工作年限">{{ data.employmentInfo.workYears }}年</el-descriptions-item>
        <el-descriptions-item label="月收入">¥{{ data.employmentInfo.monthlyIncome }}</el-descriptions-item>
        <el-descriptions-item label="年收入">¥{{ data.employmentInfo.annualIncome }}</el-descriptions-item>
        <el-descriptions-item label="收入证明">{{ data.employmentInfo.incomeProofType }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">申请信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="卡片类型">{{ getCardTypeText(data.cardType) }}</el-descriptions-item>
        <el-descriptions-item label="申请额度">¥{{ data.applyAmount }}</el-descriptions-item>
        <el-descriptions-item label="信用评分">{{ data.creditScore || '-' }}</el-descriptions-item>
        <el-descriptions-item label="信用等级">{{ getCreditLevelText(data.creditLevel) }}</el-descriptions-item>
        <el-descriptions-item label="审核结果">{{ getCheckResultText(data.checkResult) }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ data.checkOperator || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ data.checkTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批结果">{{ getApprovalResultText(data.approvalResult) }}</el-descriptions-item>
        <el-descriptions-item label="批准额度">¥{{ data.approvedAmount || '-' }}</el-descriptions-item>
        <el-descriptions-item label="拒绝原因">{{ data.rejectReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批人">{{ data.approvalOperator || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ data.approvalTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ data.createdAt }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">操作</el-divider>
      <div class="actions">
        <el-button @click="$router.push('/applications')">返回列表</el-button>
        <el-button type="primary" v-if="canCheck" @click="$router.push('/check')">去审核</el-button>
        <el-button type="primary" v-if="canApprove" @click="$router.push('/approval')">去审批</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

const route = useRoute()
const data = ref(null)

const canCheck = computed(() => {
  return data.value && ['PENDING', 'INFORMATION_COMPLETE'].includes(data.value.status)
})

const canApprove = computed(() => {
  return data.value && data.value.status === 'APPROVAL_PENDING'
})

const getStatusTagType = (status) => {
  const types = {
    'PENDING': 'info',
    'INFORMATION_COMPLETE': 'primary',
    'CHECKING': 'warning',
    'CHECK_PASSED': 'success',
    'CHECK_FAILED': 'danger',
    'APPROVAL_PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': '待录入',
    'INFORMATION_COMPLETE': '信息完整',
    'CHECKING': '核审中',
    'CHECK_PASSED': '审核通过',
    'CHECK_FAILED': '审核不通过',
    'APPROVAL_PENDING': '待审批',
    'APPROVED': '已批准',
    'REJECTED': '已拒绝'
  }
  return texts[status] || status
}

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

const getCheckResultText = (result) => {
  const texts = { 'PASS': '通过', 'FAIL': '不通过' }
  return texts[result] || '-'
}

const getApprovalResultText = (result) => {
  const texts = { 'APPROVE': '批准', 'REJECT': '拒绝' }
  return texts[result] || '-'
}

onMounted(async () => {
  const res = await api.applications.detail(route.params.id)
  if (res.code === 200) {
    data.value = res.data
  }
})
</script>

<style scoped>
.application-detail { padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; }
.actions { display: flex; gap: 20px; }
</style>