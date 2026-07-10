<template>
  <div class="review-detail-container">
    <el-card>
      <div class="card-header">
        <h2>公司架构影像审核</h2>
        <div class="header-buttons">
          <el-button type="primary" @click="handleImageView">影像调阅</el-button>
          <el-button @click="handleOperationRecords">操作记录</el-button>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </div>
      <div class="detail-content">
        <el-form :model="formData" label-width="160px" :inline="false">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请件编号">
                <el-input v-model="formData.applicationNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户号">
                <el-input v-model="formData.companyCustomerNo" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称">
                <el-input v-model="formData.companyName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司证件类型">
                <el-input v-model="formData.companyIdType" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司证件号码">
                <el-input v-model="formData.companyIdNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否加急">
                <el-input v-model="formData.isUrgent" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="清偿方式">
                <el-input v-model="formData.paymentMethod" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扫描柜员">
                <el-input v-model="formData.scanTeller" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="扫描日期">
                <el-input v-model="formData.scanDate" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扫描机构">
                <el-input v-model="formData.scanOrganization" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="复核柜员">
                <el-input v-model="formData.reviewTeller" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="复核机构">
                <el-input v-model="formData.reviewOrganization" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审核柜员">
                <el-input v-model="formData.auditTeller" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核机构">
                <el-input v-model="formData.auditOrganization" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="审核意见">
                <el-input v-model="formData.reviewComment" type="textarea" :rows="3" placeholder="请输入审核意见" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!isViewMode" :gutter="20" class="form-actions">
            <el-col :span="24" class="action-buttons">
              <el-button type="success" @click="handleSubmit">提交</el-button>
              <el-button type="danger" @click="handleReturn">退件</el-button>
              <el-button @click="handleBack">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-dialog v-model="returnDialogVisible" title="退件" width="400px">
      <el-form :model="returnForm" label-width="80px">
        <el-form-item label="退件原因" required>
          <el-input v-model="returnForm.returnReason" type="textarea" :rows="4" placeholder="请输入退件原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReturn">确认退件</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="operationDialogVisible" title="操作记录" width="600px">
      <el-table :data="operationRecords" style="width: 100%">
        <el-table-column prop="operatorId" label="操作员工编号" width="160" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
        <el-table-column prop="operationContent" label="操作内容" />
      </el-table>
      <template #footer>
        <el-button @click="operationDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const returnDialogVisible = ref(false)
const operationDialogVisible = ref(false)
const isViewMode = ref(false)
const fromPage = ref('review')

const formData = reactive({
  applicationNo: '',
  companyCustomerNo: '',
  companyName: '',
  companyIdType: '',
  companyIdNumber: '',
  isUrgent: '',
  paymentMethod: '',
  scanTeller: '',
  scanDate: '',
  scanOrganization: '',
  reviewTeller: '',
  reviewOrganization: '',
  auditTeller: '',
  auditOrganization: '',
  reviewComment: ''
})

const returnForm = reactive({
  returnReason: ''
})

const operationRecords = ref([
  {
    operatorId: 'EMP001',
    operationTime: '2026-07-09 09:30:00',
    operationContent: '扫描完成'
  },
  {
    operatorId: 'EMP005',
    operationTime: '2026-07-09 10:15:00',
    operationContent: '领取复核任务'
  },
  {
    operatorId: 'EMP005',
    operationTime: '2026-07-09 10:30:00',
    operationContent: '进入审核界面'
  }
])

const mockDetailData = {
  'APP202607090001': {
    applicationNo: 'APP202607090001',
    companyCustomerNo: 'CUST001',
    companyName: '北京总公司',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '110000123456789',
    isUrgent: '否',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP001',
    scanDate: '2026-07-09',
    scanOrganization: '北京分行',
    reviewTeller: 'EMP005',
    reviewOrganization: '总行集中录入中心',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607090002': {
    applicationNo: 'APP202607090002',
    companyCustomerNo: 'CUST002',
    companyName: '上海分公司',
    companyIdType: '企业营业执照',
    companyIdNumber: '310000987654321',
    isUrgent: '是',
    paymentMethod: '个人清偿',
    scanTeller: 'EMP002',
    scanDate: '2026-07-09',
    scanOrganization: '上海分行',
    reviewTeller: 'EMP006',
    reviewOrganization: '总行集中录入中心',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607080003': {
    applicationNo: 'APP202607080003',
    companyCustomerNo: 'CUST003',
    companyName: '广州子公司',
    companyIdType: '统一社会信用代码证',
    companyIdNumber: '440000112233445',
    isUrgent: '否',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP003',
    scanDate: '2026-07-08',
    scanOrganization: '广州分行',
    reviewTeller: 'EMP007',
    reviewOrganization: '总行集中录入中心',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607080004': {
    applicationNo: 'APP202607080004',
    companyCustomerNo: 'CUST004',
    companyName: '深圳科技有限公司',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '440300556677889',
    isUrgent: '否',
    paymentMethod: '个人清偿',
    scanTeller: 'EMP004',
    scanDate: '2026-07-08',
    scanOrganization: '深圳分行',
    reviewTeller: 'EMP008',
    reviewOrganization: '总行集中录入中心',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607080005': {
    applicationNo: 'APP202607080005',
    companyCustomerNo: 'CUST005',
    companyName: '天津科技有限公司',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '120000112233445',
    isUrgent: '否',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP009',
    scanDate: '2026-07-08',
    scanOrganization: '天津分行',
    reviewTeller: '',
    reviewOrganization: '',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607070006': {
    applicationNo: 'APP202607070006',
    companyCustomerNo: 'CUST006',
    companyName: '成都分公司',
    companyIdType: '企业营业执照',
    companyIdNumber: '510000998877665',
    isUrgent: '否',
    paymentMethod: '个人清偿',
    scanTeller: 'EMP010',
    scanDate: '2026-07-07',
    scanOrganization: '成都分行',
    reviewTeller: '',
    reviewOrganization: '',
    auditTeller: '',
    auditOrganization: ''
  },
  'APP202607060007': {
    applicationNo: 'APP202607060007',
    companyCustomerNo: 'CUST007',
    companyName: '武汉子公司',
    companyIdType: '统一社会信用代码证',
    companyIdNumber: '420000556677889',
    isUrgent: '否',
    paymentMethod: '公司清偿',
    scanTeller: 'EMP011',
    scanDate: '2026-07-06',
    scanOrganization: '武汉分行',
    reviewTeller: '',
    reviewOrganization: '',
    auditTeller: '',
    auditOrganization: ''
  }
}

onMounted(() => {
  const applicationNo = route.query.applicationNo
  isViewMode.value = route.query.mode === 'view'
  fromPage.value = route.query.from || 'review'
  
  if (applicationNo && mockDetailData[applicationNo]) {
    Object.assign(formData, mockDetailData[applicationNo])
  }
})

const handleBack = () => {
  if (fromPage.value === 'return') {
    router.push('/company/structure-review-return')
  } else {
    router.push('/company/structure-review')
  }
}

const handleImageView = () => {
  const url = `/scan/view-page?applicationNo=${encodeURIComponent(formData.applicationNo)}&viewOnly=true&companyView=true`
  window.open(url, '_blank')
}

const handleReturn = () => {
  returnDialogVisible.value = true
}

const confirmReturn = () => {
  if (!returnForm.returnReason.trim()) {
    ElMessage.warning('请输入退件原因')
    return
  }
  ElMessage.success('退件成功')
  returnDialogVisible.value = false
  returnForm.returnReason = ''
  router.push('/company/structure-review')
}

const handleOperationRecords = () => {
  operationDialogVisible.value = true
}

const handleSubmit = () => {
  if (!formData.reviewComment.trim()) {
    ElMessage.warning('请输入审核意见')
    return
  }
  ElMessage.success('复核提交成功')
  router.push('/company/structure-review')
}
</script>

<style scoped>
.review-detail-container {
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

.header-buttons {
  display: flex;
  gap: 10px;
}

.detail-content {
  min-height: 500px;
}

.form-actions {
  margin-top: 30px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}
</style>