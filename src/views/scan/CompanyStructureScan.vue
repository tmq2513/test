<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>公司架构建立扫描</h3>
      </div>
      <div class="card-body">
        <el-form ref="formRef" :model="formData" label-width="140px" :inline="false">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司客户号" required>
                <el-input v-model="formData.companyCustomerNo" placeholder="请输入公司客户号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" required>
                <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="渠道" required>
                <el-select v-model="formData.channel" placeholder="请选择渠道">
                  <el-option label="分行录入" value="分行录入" />
                  <el-option label="集中录入" value="集中录入" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司证件类型" required>
                <el-select v-model="formData.companyIdType" placeholder="请选择公司证件类型">
                  <el-option label="税务登记号码" value="税务登记号码" />
                  <el-option label="社会保险号码" value="社会保险号码" />
                  <el-option label="公司/机构注册证明书" value="公司/机构注册证明书" />
                  <el-option label="企业法人营业执照" value="企业法人营业执照" />
                  <el-option label="企业营业执照" value="企业营业执照" />
                  <el-option label="公司组织机构代码" value="公司组织机构代码" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司证件号码" required>
                <el-input v-model="formData.companyIdNumber" placeholder="请输入公司证件号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否加急" required>
                <el-select v-model="formData.isUrgent" placeholder="请选择是否加急">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="清偿方式" required>
                <el-select v-model="formData.paymentMethod" placeholder="请选择清偿方式">
                  <el-option label="个人清偿" value="个人清偿" />
                  <el-option label="公司清偿" value="公司清偿" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="必扫申请资料">
                <div class="materials-display">
                  <el-tag type="info" size="small">统一社会信用代码证</el-tag>
                  <el-tag type="info" size="small">组织机构代码证</el-tag>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.channel === '集中录入'" :gutter="20">
            <el-col :span="24">
              <el-alert title="注意事项" type="warning" :closable="false">
                集中录入渠道仅处理账户层级结构为三层架构单位申请，账户结构为四、五层架构申请请通过远程录入渠道处理。
              </el-alert>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-actions">
            <el-col :span="24" class="action-buttons">
              <el-button type="primary" @click="handleUCIFVerify">UCIF校验</el-button>
              <el-button type="success" :disabled="!ucifVerified" @click="handleScan">扫描</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
          <div v-if="ucifVerified" class="verify-success">
            <el-icon><component :is="Check" /></el-icon>
            <span>UCIF校验通过</span>
          </div>
          <div v-if="ucifError" class="verify-error">
            <el-icon><component :is="Close" /></el-icon>
            <span>UCIF校验失败：{{ ucifError }}</span>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'

const formRef = ref(null)
const ucifVerified = ref(false)
const ucifError = ref('')

const formData = reactive({
  companyCustomerNo: '',
  companyName: '',
  channel: '',
  companyIdType: '',
  companyIdNumber: '',
  isUrgent: '',
  paymentMethod: '',
  remark: ''
})

const mockCompanyData = [
  {
    companyCustomerNo: 'CUST001',
    companyName: '北京总公司',
    companyIdType: '企业法人营业执照',
    companyIdNumber: '110000123456789'
  },
  {
    companyCustomerNo: 'CUST002',
    companyName: '上海总公司',
    companyIdType: '企业营业执照',
    companyIdNumber: '310000987654321'
  }
]

const handleUCIFVerify = () => {
  ucifVerified.value = false
  ucifError.value = ''

  if (!formData.companyCustomerNo) {
    ucifError.value = '请输入公司客户号'
    return
  }
  if (!formData.companyName) {
    ucifError.value = '请输入公司名称'
    return
  }
  if (!formData.companyIdType) {
    ucifError.value = '请选择公司证件类型'
    return
  }
  if (!formData.companyIdNumber) {
    ucifError.value = '请输入公司证件号码'
    return
  }

  const matched = mockCompanyData.find(c => 
    c.companyCustomerNo === formData.companyCustomerNo &&
    c.companyName === formData.companyName &&
    c.companyIdType === formData.companyIdType &&
    c.companyIdNumber === formData.companyIdNumber
  )

  if (matched) {
    ucifVerified.value = true
    ucifError.value = ''
    ElMessage.success('UCIF校验通过')
  } else {
    ucifError.value = '公司客户号、公司名称、公司证件类型、公司证件号码与核心不一致'
    ElMessage.error('UCIF校验失败')
  }
}

const handleScan = () => {
  if (!ucifVerified.value) {
    ElMessage.warning('请先通过UCIF校验')
    return
  }
  const scanUrl = `/scan/page?type=company-structure&companyCustomerNo=${encodeURIComponent(formData.companyCustomerNo)}&companyName=${encodeURIComponent(formData.companyName)}&channel=${encodeURIComponent(formData.channel)}&companyIdType=${encodeURIComponent(formData.companyIdType)}&companyIdNumber=${encodeURIComponent(formData.companyIdNumber)}&isUrgent=${encodeURIComponent(formData.isUrgent)}&paymentMethod=${encodeURIComponent(formData.paymentMethod)}&remark=${encodeURIComponent(formData.remark)}`
  window.open(scanUrl, '_blank')
}

const handleReset = () => {
  formData.companyCustomerNo = ''
  formData.companyName = ''
  formData.channel = ''
  formData.companyIdType = ''
  formData.companyIdNumber = ''
  formData.isUrgent = ''
  formData.paymentMethod = ''
  formData.remark = ''
  ucifVerified.value = false
  ucifError.value = ''
}
</script>

<style scoped>
.scan-container {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-body {
  min-height: 400px;
}

.form-actions {
  margin-top: 30px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}

.materials-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.verify-success {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: #f0fdf4;
  border-radius: 4px;
  color: #16a34a;
  font-size: 14px;
}

.verify-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 4px;
  color: #dc2626;
  font-size: 14px;
}
</style>