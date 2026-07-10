<template>
  <div class="dashboard">
    <div class="stats">
      <el-card class="stat-card">
        <div class="stat-icon pending">
          <el-icon><component :is="Clock" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon checking">
          <el-icon><component :is="Search" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.checking }}</div>
          <div class="stat-label">核审中</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon approved">
          <el-icon><component :is="Check" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approved }}</div>
          <div class="stat-label">已批准</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon rejected">
          <el-icon><component :is="Close" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.rejected }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </el-card>
    </div>
    <div class="charts">
      <el-card class="chart-card">
        <template #header>
          <span>申请状态分布</span>
        </template>
        <div ref="statusChart" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <span>信用评分分布</span>
        </template>
        <div ref="scoreChart" class="chart"></div>
      </el-card>
    </div>
    <div class="recent">
      <el-card>
        <template #header>
          <span>最近申请</span>
          <el-button type="text" @click="$router.push('/applications')">查看全部</el-button>
        </template>
        <el-table :data="recentApplications" border>
          <el-table-column prop="applicationId" label="申请编号" />
          <el-table-column prop="cardType" label="卡片类型" />
          <el-table-column prop="applyAmount" label="申请额度">
            <template #default="{ row }">¥{{ row.applyAmount }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="$router.push(`/applications/detail/${row.applicationId}`)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Clock, Search, Check, Close } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import api from '@/api'

const stats = reactive({
  pending: 0,
  checking: 0,
  approved: 0,
  rejected: 0
})

const recentApplications = ref([])
const statusChart = ref(null)
const scoreChart = ref(null)

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

const loadStats = async () => {
  const res = await api.applications.list({ page: 0, size: 100 })
  if (res.code === 200) {
    const applications = res.data.content || []
    stats.pending = applications.filter(a => a.status === 'PENDING' || a.status === 'INFORMATION_COMPLETE').length
    stats.checking = applications.filter(a => a.status === 'CHECKING' || a.status === 'APPROVAL_PENDING').length
    stats.approved = applications.filter(a => a.status === 'APPROVED').length
    stats.rejected = applications.filter(a => a.status === 'REJECTED').length
    recentApplications.value = applications.slice(0, 10)
  }
}

const initCharts = () => {
  const statusChartEl = echarts.init(statusChart.value)
  statusChartEl.setOption({
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: stats.pending, name: '待处理' },
        { value: stats.checking, name: '核审中' },
        { value: stats.approved, name: '已批准' },
        { value: stats.rejected, name: '已拒绝' }
      ],
      label: { show: true }
    }]
  })

  const scoreChartEl = echarts.init(scoreChart.value)
  scoreChartEl.setOption({
    xAxis: {
      type: 'category',
      data: ['350-549', '550-649', '650-749', '750-900']
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [15, 25, 35, 25]
    }]
  })
}

onMounted(async () => {
  await loadStats()
  await nextTick()
  initCharts()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.pending { background-color: #fce4ec; color: #8b0000; }
.stat-icon.checking { background-color: #ffebee; color: #a52a2a; }
.stat-icon.approved { background-color: #fff8e1; color: #8b0000; }
.stat-icon.rejected { background-color: #ffebee; color: #cd5c5c; }

.stat-info { flex: 1; }
.stat-value { font-size: 32px; font-weight: bold; color: #303133; }
.stat-label { font-size: 14px; color: #909399; }

.charts {
  display: flex;
  gap: 20px;
}

.chart-card { flex: 1; }
.chart { height: 300px; }

.recent { flex: 1; }
</style>