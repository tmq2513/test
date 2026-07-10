<template>
  <div class="sms-templates-container">
    <el-card>
      <div class="card-header">
        <h2>短信模板管理</h2>
        <el-button type="primary" @click="handleAdd">新增模板</el-button>
      </div>

      <div class="search-form-wrapper">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="模板编号">
            <el-input v-model="searchForm.templateCode" placeholder="请输入模板编号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="短信类型">
            <el-select v-model="searchForm.smsType" placeholder="请选择短信类型" style="width: 150px">
              <el-option v-for="type in smsTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px">
              <el-option label="启用" value="active" />
              <el-option label="停用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="paginatedTemplates" style="width: 100%">
        <el-table-column prop="templateCode" label="模板编号" width="160" />
        <el-table-column prop="templateName" label="模板名称" width="160" />
        <el-table-column prop="channelNames" label="支持渠道" min-width="200">
          <template #default="scope">
            <el-tag v-for="name in scope.row.channelNames" :key="name" size="small" type="primary" style="margin-right: 4px;">
              {{ name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerTypeName" label="客户类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.customerType === 'new' ? 'success' : 'info'" size="small">
              {{ scope.row.customerTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="smsTypeName" label="短信类型" width="120">
          <template #default="scope">
            <el-tag :type="getSmsTypeTagType(scope.row.smsType)" size="small">
              {{ scope.row.smsTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mediumName" label="介质" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.medium === 'physical' ? 'warning' : 'primary'" size="small">
              {{ scope.row.mediumName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="delaySend" label="延迟发送" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.delaySend ? 'success' : 'danger'" size="small">
              {{ scope.row.delaySend ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="模板状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredTemplates.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="模板编号" required>
          <el-input v-model="formData.templateCode" :disabled="!!formData.id" />
        </el-form-item>
        <el-form-item label="模板名称" required>
          <el-input v-model="formData.templateName" />
        </el-form-item>
        <el-form-item label="支持渠道" required>
          <el-select v-model="formData.supportChannels" multiple placeholder="请选择支持渠道" style="width: 100%">
            <el-option v-for="channel in channelOptions" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" required>
          <el-select v-model="formData.customerType" style="width: 100%">
            <el-option v-for="type in customerTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="短信类型" required>
          <el-select v-model="formData.smsType" style="width: 100%">
            <el-option v-for="type in smsTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="介质" required>
          <el-select v-model="formData.medium" style="width: 100%">
            <el-option v-for="m in mediumOptions" :key="m.value" :label="m.label" :value="m.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="延迟发送">
          <el-switch v-model="formData.delaySend" />
        </el-form-item>
        <el-form-item label="模板内容" required>
          <el-input v-model="formData.templateContent" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="模板状态" required>
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
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

const channelOptions = [
  { label: '网申', value: 'online' },
  { label: '分行录入', value: 'branch_entry' },
  { label: '智能柜台', value: 'smart_counter' },
  { label: '分期办理', value: 'installment' },
  { label: '集中办卡', value: 'centralized' }
]

const customerTypeOptions = [
  { label: '新客户', value: 'new' },
  { label: '老客户', value: 'existing' }
]

const smsTypeOptions = [
  { label: '批准', value: 'approved' },
  { label: '拒绝', value: 'rejected' },
  { label: '通知', value: 'notification' }
]

const mediumOptions = [
  { label: '实体', value: 'physical' },
  { label: '数字', value: 'digital' }
]

const templates = ref([
  { id: 1, templateCode: 'SMS_APPLY_APPROVED', templateName: '申请通过通知', supportChannels: ['online', 'branch_entry'], customerType: 'new', smsType: 'approved', medium: 'physical', delaySend: false, templateContent: '尊敬的{name}先生/女士，您的信用卡申请已通过，授信额度：{creditLimit}元，卡片将在3个工作日内寄出。', status: 'active', createTime: '2026-06-20 10:30:00' },
  { id: 2, templateCode: 'SMS_APPLY_REJECTED', templateName: '申请拒绝通知', supportChannels: ['online', 'smart_counter'], customerType: 'new', smsType: 'rejected', medium: 'digital', delaySend: false, templateContent: '尊敬的{name}先生/女士，很遗憾您的信用卡申请未通过，如有疑问请联系客服。', status: 'active', createTime: '2026-06-20 11:00:00' },
  { id: 3, templateCode: 'SMS_APPLY_SUBMIT', templateName: '申请提交通知', supportChannels: ['online', 'branch_entry', 'smart_counter'], customerType: 'new', smsType: 'notification', medium: 'digital', delaySend: true, templateContent: '尊敬的{name}先生/女士，您的信用卡申请已提交，申请编号：{applyNo}，我们将尽快处理。', status: 'active', createTime: '2026-06-21 09:00:00' },
  { id: 4, templateCode: 'SMS_CARD_SENT', templateName: '卡片寄出通知', supportChannels: ['online', 'branch_entry', 'installment', 'centralized'], customerType: 'new', smsType: 'notification', medium: 'physical', delaySend: false, templateContent: '尊敬的{name}先生/女士，您的信用卡已寄出，快递单号：{expressNo}，预计3-5个工作日送达。', status: 'active', createTime: '2026-06-21 14:00:00' },
  { id: 5, templateCode: 'SMS_CREDIT_ADJUST_APPROVED', templateName: '额度调整通过', supportChannels: ['online'], customerType: 'existing', smsType: 'approved', medium: 'digital', delaySend: false, templateContent: '尊敬的{name}先生/女士，您的信用卡额度调整申请已通过，新额度：{newLimit}元。', status: 'active', createTime: '2026-06-22 10:00:00' },
  { id: 6, templateCode: 'SMS_CREDIT_ADJUST_REJECTED', templateName: '额度调整拒绝', supportChannels: ['online'], customerType: 'existing', smsType: 'rejected', medium: 'digital', delaySend: false, templateContent: '尊敬的{name}先生/女士，很遗憾您的额度调整申请未通过。', status: 'inactive', createTime: '2026-06-22 11:00:00' },
  { id: 7, templateCode: 'SMS_PAYMENT_REMIND', templateName: '还款提醒通知', supportChannels: ['online', 'branch_entry'], customerType: 'existing', smsType: 'notification', medium: 'digital', delaySend: true, templateContent: '尊敬的{name}先生/女士，您本月信用卡账单将于{dueDate}到期，请及时还款，金额：{amount}元。', status: 'active', createTime: '2026-06-23 15:00:00' },
  { id: 8, templateCode: 'SMS_RENEWAL_NOTICE', templateName: '卡片续期通知', supportChannels: ['online', 'centralized'], customerType: 'existing', smsType: 'notification', medium: 'physical', delaySend: false, templateContent: '尊敬的{name}先生/女士，您的信用卡即将到期，新卡将在{sendDate}寄出，请留意查收。', status: 'active', createTime: '2026-06-24 09:00:00' },
  { id: 9, templateCode: 'SMS_FRAUD_ALERT', templateName: '风险交易提醒', supportChannels: ['online', 'branch_entry', 'smart_counter'], customerType: 'existing', smsType: 'notification', medium: 'digital', delaySend: false, templateContent: '尊敬的{name}先生/女士，您的信用卡于{time}在{location}发生一笔交易，金额：{amount}元，如有异常请及时联系客服。', status: 'active', createTime: '2026-06-24 16:00:00' },
  { id: 10, templateCode: 'SMS_ACTIVATION_REMIND', templateName: '卡片激活提醒', supportChannels: ['online', 'branch_entry'], customerType: 'new', smsType: 'notification', medium: 'physical', delaySend: true, templateContent: '尊敬的{name}先生/女士，您的信用卡已收到，请在30天内完成激活，激活方式：{activationMethod}。', status: 'inactive', createTime: '2026-06-25 10:00:00' },
  { id: 11, templateCode: 'SMS_REWARD_NOTICE', templateName: '积分奖励通知', supportChannels: ['online'], customerType: 'existing', smsType: 'notification', medium: 'digital', delaySend: false, templateContent: '尊敬的{name}先生/女士，恭喜您获得{points}积分，可在积分商城兑换礼品。', status: 'active', createTime: '2026-06-25 14:00:00' },
  { id: 12, templateCode: 'SMS_ANNUAL_FEE_REMIND', templateName: '年费提醒通知', supportChannels: ['online', 'branch_entry'], customerType: 'existing', smsType: 'notification', medium: 'digital', delaySend: true, templateContent: '尊敬的{name}先生/女士，您的信用卡年费{amount}元将于{date}扣除，请确保账户余额充足。', status: 'active', createTime: '2026-06-26 09:00:00' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive({
  templateCode: '',
  smsType: '',
  status: ''
})

const getChannelNames = (channelValues) => {
  return channelValues.map(value => {
    const channel = channelOptions.find(c => c.value === value)
    return channel ? channel.label : '未知渠道'
  })
}

const getCustomerTypeName = (value) => {
  const type = customerTypeOptions.find(t => t.value === value)
  return type ? type.label : '未知'
}

const getSmsTypeName = (value) => {
  const type = smsTypeOptions.find(t => t.value === value)
  return type ? type.label : '未知'
}

const getMediumName = (value) => {
  const m = mediumOptions.find(o => o.value === value)
  return m ? m.label : '未知'
}

const getStatusName = (value) => {
  return value === 'active' ? '启用' : '停用'
}

const getSmsTypeTagType = (value) => {
  const types = {
    approved: 'success',
    rejected: 'danger',
    notification: 'info'
  }
  return types[value] || 'info'
}

const filteredTemplates = computed(() => {
  return templates.value.map(t => ({
    ...t,
    channelNames: getChannelNames(t.supportChannels),
    customerTypeName: getCustomerTypeName(t.customerType),
    smsTypeName: getSmsTypeName(t.smsType),
    mediumName: getMediumName(t.medium),
    statusName: getStatusName(t.status)
  })).filter(t => {
    if (searchForm.templateCode && !t.templateCode.includes(searchForm.templateCode)) return false
    if (searchForm.smsType && t.smsType !== searchForm.smsType) return false
    if (searchForm.status && t.status !== searchForm.status) return false
    return true
  })
})

const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTemplates.value.slice(start, start + pageSize.value)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增模板')
const formData = reactive({
  id: null,
  templateCode: '',
  templateName: '',
  supportChannels: [],
  customerType: 'new',
  smsType: 'notification',
  medium: 'digital',
  delaySend: false,
  templateContent: '',
  status: 'active'
})

const handleAdd = () => {
  dialogTitle.value = '新增模板'
  formData.id = null
  formData.templateCode = ''
  formData.templateName = ''
  formData.supportChannels = []
  formData.customerType = 'new'
  formData.smsType = 'notification'
  formData.medium = 'digital'
  formData.delaySend = false
  formData.templateContent = ''
  formData.status = 'active'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑模板'
  formData.id = row.id
  formData.templateCode = row.templateCode
  formData.templateName = row.templateName
  formData.supportChannels = [...row.supportChannels]
  formData.customerType = row.customerType
  formData.smsType = row.smsType
  formData.medium = row.medium
  formData.delaySend = row.delaySend
  formData.templateContent = row.templateContent
  formData.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row) => {
  if (confirm('确认删除该模板？')) {
    templates.value = templates.value.filter(t => t.id !== row.id)
    ElMessage.success('删除成功')
  }
}

const handleSubmit = () => {
  if (!formData.templateCode) {
    ElMessage.warning('请输入模板编号')
    return
  }
  if (!formData.templateName) {
    ElMessage.warning('请输入模板名称')
    return
  }
  if (!formData.templateContent) {
    ElMessage.warning('请输入模板内容')
    return
  }

  if (formData.id) {
    const index = templates.value.findIndex(t => t.id === formData.id)
    if (index !== -1) {
      templates.value[index] = { ...formData }
    }
    ElMessage.success('修改成功')
  } else {
    const exists = templates.value.some(t => t.templateCode === formData.templateCode)
    if (exists) {
      ElMessage.warning('模板编号已存在')
      return
    }
    formData.id = Date.now()
    templates.value.push({ ...formData })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.templateCode = ''
  searchForm.smsType = ''
  searchForm.status = ''
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
.sms-templates-container {
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>