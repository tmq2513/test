<template>
  <div class="external-data">
    <el-card>
      <template #header>
        <span>外部信息采集</span>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="form.applicationId" placeholder="请输入申请编号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCreditBureau" :loading="loading">获取征信数据</el-button>
          <el-button type="primary" @click="fetchJudicial" :loading="loading">获取司法数据</el-button>
          <el-button type="primary" @click="fetchTelecom" :loading="loading">获取电信数据</el-button>
          <el-button @click="loadAllData">查看所有数据</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="dataList.length > 0">
      <template #header>
        <span>采集结果</span>
      </template>
      <div class="data-cards">
        <el-card v-for="data in dataList" :key="data.id" class="data-card">
          <template #header>
            <span>{{ getDataSourceText(data.dataSource) }}</span>
            <span class="time">{{ data.queryTime }}</span>
          </template>
          <pre>{{ formatData(data.dataContent) }}</pre>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const loading = ref(false)
const dataList = ref([])

const form = reactive({
  applicationId: ''
})

const getDataSourceText = (source) => {
  const texts = {
    'CREDIT_BUREAU': '征信中心',
    'JUDICIAL': '司法信息',
    'TELECOM': '电信运营商',
    'BANK': '银行',
    'SOCIAL_SECURITY': '社保',
    'HOUSE_REGISTRY': '房产登记'
  }
  return texts[source] || source
}

const formatData = (content) => {
  try {
    return JSON.stringify(JSON.parse(content), null, 2)
  } catch (e) {
    return content
  }
}

const fetchCreditBureau = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  loading.value = true
  try {
    const res = await api.external.creditBureau(form.applicationId)
    if (res.code === 200) {
      ElMessage.success('获取成功')
      dataList.value.push(res.data)
    } else {
      ElMessage.error(res.message || '获取失败')
    }
  } catch (error) {
    ElMessage.error('获取失败')
  } finally {
    loading.value = false
  }
}

const fetchJudicial = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  loading.value = true
  try {
    const res = await api.external.judicial(form.applicationId)
    if (res.code === 200) {
      ElMessage.success('获取成功')
      dataList.value.push(res.data)
    } else {
      ElMessage.error(res.message || '获取失败')
    }
  } catch (error) {
    ElMessage.error('获取失败')
  } finally {
    loading.value = false
  }
}

const fetchTelecom = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  loading.value = true
  try {
    const res = await api.external.telecom(form.applicationId)
    if (res.code === 200) {
      ElMessage.success('获取成功')
      dataList.value.push(res.data)
    } else {
      ElMessage.error(res.message || '获取失败')
    }
  } catch (error) {
    ElMessage.error('获取失败')
  } finally {
    loading.value = false
  }
}

const loadAllData = async () => {
  if (!form.applicationId) {
    ElMessage.warning('请输入申请编号')
    return
  }
  const res = await api.external.all(form.applicationId)
  if (res.code === 200) {
    dataList.value = res.data || []
  }
}
</script>

<style scoped>
.external-data { padding: 20px; }
.data-cards { display: flex; flex-direction: column; gap: 20px; }
.data-card { max-width: 800px; }
.time { font-size: 12px; color: #999; }
pre { white-space: pre-wrap; word-break: break-all; }
</style>