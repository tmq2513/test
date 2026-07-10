<template>
  <div class="switches-container">
    <el-card>
      <div class="card-header">
        <h2>开关管理</h2>
        <el-button type="primary" @click="handleAdd">新增配置</el-button>
      </div>

      <div class="search-form-wrapper">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="分行">
            <el-select v-model="searchForm.branch" placeholder="请选择分行" style="width: 180px">
              <el-option v-for="bank in provinceBanks" :key="bank.id" :label="bank.orgName" :value="bank.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <el-select v-model="searchForm.channel" placeholder="请选择渠道" style="width: 180px">
              <el-option v-for="channel in channelOptions" :key="channel.value" :label="channel.label" :value="channel.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="检测源">
            <el-select v-model="searchForm.detectionSource" placeholder="请选择检测源" style="width: 200px">
              <el-option v-for="source in detectionSourceOptions" :key="source.value" :label="source.label" :value="source.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="paginatedSwitches" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="branchName" label="分行" min-width="150" />
        <el-table-column prop="channelName" label="渠道" min-width="150" />
        <el-table-column prop="detectionSourceName" label="检测源" min-width="200" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredSwitches.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="分行" required>
          <el-select v-model="formData.branches" multiple placeholder="请选择分行" style="width: 100%">
            <el-option v-for="bank in provinceBanks" :key="bank.id" :label="bank.orgName" :value="bank.id" />
          </el-select>
          <div class="form-tip">支持多选，选择多个分行将与渠道、检测源进行组合配置</div>
        </el-form-item>

        <el-form-item label="渠道" required>
          <el-select v-model="formData.channels" multiple placeholder="请选择渠道" style="width: 100%">
            <el-option v-for="channel in channelOptions" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
          <div class="form-tip">支持多选，选择多个渠道将与分行、检测源进行组合配置</div>
        </el-form-item>

        <el-form-item label="检测源" required>
          <el-checkbox-group v-model="formData.detectionSources" class="detection-source-group">
            <el-checkbox v-for="source in detectionSourceOptions" :key="source.value" :label="source.value">
              {{ source.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-divider content-position="left">配置预览</el-divider>
        <div class="config-preview">
          <div class="preview-item">
            <span class="preview-label">分行：</span>
            <span class="preview-value">{{ getBranchNames(formData.branches).join('、') || '未选择' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">渠道：</span>
            <span class="preview-value">{{ getChannelNames(formData.channels).join('、') || '未选择' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">检测源：</span>
            <span class="preview-value">{{ getDetectionSourceNames(formData.detectionSources).join('、') || '未选择' }}</span>
          </div>
          <div class="preview-item" v-if="totalCombinations > 0">
            <span class="preview-label">将生成：</span>
            <span class="preview-value">{{ totalCombinations }} 条配置记录</span>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const organizations = ref([
  { id: 1, orgCode: 'BANK-HQ', orgName: '总行', orgLevel: 1, parentId: null, parentName: '', provinceBankId: null, provinceBankName: '', phone: '010-12345678', status: 'normal', orgPath: '总行' },
  { id: 2, orgCode: 'BANK-BJ', orgName: '北京分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-87654321', status: 'normal', orgPath: '总行-北京分行' },
  { id: 3, orgCode: 'BANK-SH', orgName: '上海分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 3, provinceBankName: '上海分行', phone: '021-12345678', status: 'normal', orgPath: '总行-上海分行' },
  { id: 4, orgCode: 'BANK-GZ', orgName: '广州分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 4, provinceBankName: '广州分行', phone: '020-12345678', status: 'normal', orgPath: '总行-广州分行' },
  { id: 5, orgCode: 'BANK-CD', orgName: '成都分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 5, provinceBankName: '成都分行', phone: '028-12345678', status: 'normal', orgPath: '总行-成都分行' },
  { id: 6, orgCode: 'BANK-HZ', orgName: '杭州分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 6, provinceBankName: '杭州分行', phone: '0571-12345678', status: 'normal', orgPath: '总行-杭州分行' }
])

const provinceBanks = computed(() => {
  return organizations.value.filter(o => o.orgLevel === 2)
})

const channelOptions = [
  { label: '网申', value: 'online' },
  { label: '分行录入', value: 'branch_entry' },
  { label: '智能柜台', value: 'smart_counter' },
  { label: '分期办理', value: 'installment' },
  { label: '集中办卡', value: 'centralized' }
]

const detectionSourceOptions = [
  { label: '学信网学籍', value: 'xuesin_xueji' },
  { label: '学信网学历', value: 'xuesin_xueli' },
  { label: '百融特殊名单', value: 'bairong_special' },
  { label: '信联常驻位置', value: 'xinlian_location' },
  { label: '法海负面', value: 'fahai_negative' },
  { label: '中诚信通信运营商', value: 'zhongchengxin_telecom' },
  { label: '中诚信三维度评分', value: 'zhongchengxin_score' },
  { label: '安融负面', value: 'anrong_negative' },
  { label: '社保', value: 'social_insurance' },
  { label: '地税', value: 'local_tax' },
  { label: '公积金', value: 'housing_fund' },
  { label: '失信', value: 'dishonest' },
  { label: '限高', value: 'high_limit' },
  { label: '京东征信', value: 'jd_credit' },
  { label: '金保信C评分', value: 'jinbaoxin_c' },
  { label: '银保信E评分', value: 'yinbaoxin_e' },
  { label: '朴道公安', value: 'pudao_police' }
]

const switches = ref([
  { id: 1, branch: 2, channel: 'online', detectionSource: 'xuesin_xueji', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 2, branch: 2, channel: 'online', detectionSource: 'xuesin_xueli', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 3, branch: 2, channel: 'online', detectionSource: 'bairong_special', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 4, branch: 3, channel: 'online', detectionSource: 'xuesin_xueji', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 5, branch: 3, channel: 'online', detectionSource: 'xuesin_xueli', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 6, branch: 3, channel: 'online', detectionSource: 'bairong_special', groupId: 'g1', createdAt: '2026-06-20 10:30:00' },
  { id: 7, branch: 4, channel: 'smart_counter', detectionSource: 'xinlian_location', groupId: 'g2', createdAt: '2026-06-21 14:20:00' },
  { id: 8, branch: 4, channel: 'smart_counter', detectionSource: 'fahai_negative', groupId: 'g2', createdAt: '2026-06-21 14:20:00' },
  { id: 9, branch: 4, channel: 'installment', detectionSource: 'xinlian_location', groupId: 'g2', createdAt: '2026-06-21 14:20:00' },
  { id: 10, branch: 4, channel: 'installment', detectionSource: 'fahai_negative', groupId: 'g2', createdAt: '2026-06-21 14:20:00' },
  { id: 11, branch: 2, channel: 'online', detectionSource: 'dishonest', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 12, branch: 2, channel: 'online', detectionSource: 'high_limit', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 13, branch: 5, channel: 'online', detectionSource: 'dishonest', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 14, branch: 5, channel: 'online', detectionSource: 'high_limit', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 15, branch: 6, channel: 'online', detectionSource: 'dishonest', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 16, branch: 6, channel: 'online', detectionSource: 'high_limit', groupId: 'g3', createdAt: '2026-06-22 09:15:00' },
  { id: 17, branch: 3, channel: 'branch_entry', detectionSource: 'anrong_negative', groupId: 'g4', createdAt: '2026-06-23 16:45:00' },
  { id: 18, branch: 3, channel: 'branch_entry', detectionSource: 'local_tax', groupId: 'g4', createdAt: '2026-06-23 16:45:00' },
  { id: 19, branch: 4, channel: 'branch_entry', detectionSource: 'anrong_negative', groupId: 'g4', createdAt: '2026-06-23 16:45:00' },
  { id: 20, branch: 4, channel: 'branch_entry', detectionSource: 'local_tax', groupId: 'g4', createdAt: '2026-06-23 16:45:00' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive({
  branch: '',
  channel: '',
  detectionSource: ''
})

const getBranchName = (branchId) => {
  const bank = organizations.value.find(o => o.id === branchId)
  return bank ? bank.orgName : '未知分行'
}

const getChannelName = (channelValue) => {
  const channel = channelOptions.find(c => c.value === channelValue)
  return channel ? channel.label : '未知渠道'
}

const getDetectionSourceName = (sourceValue) => {
  const source = detectionSourceOptions.find(s => s.value === sourceValue)
  return source ? source.label : '未知检测源'
}

const getBranchNames = (branchIds) => {
  return branchIds.map(id => getBranchName(id))
}

const getChannelNames = (channelValues) => {
  return channelValues.map(value => getChannelName(value))
}

const getDetectionSourceNames = (sourceValues) => {
  return sourceValues.map(value => getDetectionSourceName(value))
}

const filteredSwitches = computed(() => {
  return switches.value.map(switchItem => ({
    ...switchItem,
    branchName: getBranchName(switchItem.branch),
    channelName: getChannelName(switchItem.channel),
    detectionSourceName: getDetectionSourceName(switchItem.detectionSource)
  })).filter(switchItem => {
    if (searchForm.branch && switchItem.branch !== searchForm.branch) return false
    if (searchForm.channel && switchItem.channel !== searchForm.channel) return false
    if (searchForm.detectionSource && switchItem.detectionSource !== searchForm.detectionSource) return false
    return true
  })
})

const paginatedSwitches = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredSwitches.value.slice(start, start + pageSize.value)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增配置')
const formData = reactive({
  id: null,
  branches: [],
  channels: [],
  detectionSources: []
})

const totalCombinations = computed(() => {
  return formData.branches.length * formData.channels.length * formData.detectionSources.length
})

const handleAdd = () => {
  dialogTitle.value = '新增配置'
  formData.id = null
  formData.branches = []
  formData.channels = []
  formData.detectionSources = []
  dialogVisible.value = true
}

const handleDelete = (row) => {
  if (confirm('确认删除该配置？')) {
    switches.value = switches.value.filter(s => s.id !== row.id)
    ElMessage.success('删除成功')
  }
}

const handleSubmit = () => {
  if (formData.branches.length === 0) {
    ElMessage.warning('请选择分行')
    return
  }
  if (formData.channels.length === 0) {
    ElMessage.warning('请选择渠道')
    return
  }
  if (formData.detectionSources.length === 0) {
    ElMessage.warning('请选择检测源')
    return
  }

  const groupId = 'g' + Date.now()
  const newConfigs = []
  formData.branches.forEach(branch => {
    formData.channels.forEach(channel => {
      formData.detectionSources.forEach(detectionSource => {
        newConfigs.push({
          id: Date.now() + Math.random(),
          branch,
          channel,
          detectionSource,
          groupId,
          createdAt: new Date().toLocaleString('zh-CN')
        })
      })
    })
  })
  switches.value.unshift(...newConfigs)
  ElMessage.success(`成功新增 ${newConfigs.length} 条配置`)
  dialogVisible.value = false
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.branch = ''
  searchForm.channel = ''
  searchForm.detectionSource = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.switches-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.search-form-wrapper {
  margin-bottom: 20px;
}

.search-form {
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.detection-source-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.config-preview {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-item {
  display: flex;
  margin-bottom: 8px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-label {
  font-weight: bold;
  color: #606266;
  min-width: 60px;
}

.preview-value {
  color: #303133;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>