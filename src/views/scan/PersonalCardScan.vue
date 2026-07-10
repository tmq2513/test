<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>个人卡申请影像扫描</h3>
      </div>
      <div class="card-body">
        <el-form ref="formRef" :model="formData" label-width="140px" :inline="false">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="产品大类" required>
                <el-select v-model="formData.productCategory" placeholder="请选择产品大类">
                  <el-option label="贷记个人卡" value="贷记个人卡" />
                  <el-option label="贷记白金卡" value="贷记白金卡" />
                  <el-option label="准贷记个人卡" value="准贷记个人卡" />
                  <el-option label="准贷记白金卡" value="准贷记白金卡" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请件类型" required>
                <el-select v-model="formData.applicationType" placeholder="请选择申请件类型" @change="handleApplicationTypeChange">
                  <el-option label="主卡申请" value="主卡申请" />
                  <el-option label="附卡申请" value="附卡申请" />
                  <el-option label="主+附申请" value="主+附申请" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="渠道" required>
                <el-select v-model="formData.channel" placeholder="请选择渠道" @change="handleChannelChange">
                  <el-option label="分行录入" value="分行录入" />
                  <el-option label="集中录入" value="集中录入" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="客户姓名" required>
                <el-input v-model="formData.customerName" placeholder="请输入客户姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户证件类型" required>
                <el-select v-model="formData.idType" placeholder="请选择证件类型" :disabled="formData.channel === '集中录入'">
                  <el-option label="中国居民身份证" value="中国居民身份证" />
                  <el-option label="外国人永久居留身份证" value="外国人永久居留身份证" />
                  <el-option label="港澳居民来往内地通行证（香港）" value="港澳居民来往内地通行证（香港）" />
                  <el-option label="港澳居民来往内地通行证（澳门）" value="港澳居民来往内地通行证（澳门）" />
                  <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
                  <el-option label="护照" value="护照" />
                  <el-option label="港澳居民居住证（香港）" value="港澳居民居住证（香港）" />
                  <el-option label="港澳居民居住证（澳门）" value="港澳居民居住证（澳门）" />
                  <el-option label="台湾居民居住证" value="台湾居民居住证" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="客户证件号码" required>
                <el-input v-model="formData.idNumber" placeholder="请输入证件号码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进件类型" required>
                <el-select v-model="formData.entryType" placeholder="请选择进件类型">
                  <el-option label="专项分期" value="专项分期" />
                  <el-option label="一般进件" value="一般进件" />
                  <el-option label="特殊族群" value="特殊族群" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="申请资料">
                <div v-if="displayMaterials.length > 0" class="materials-display">
                  <el-tag v-for="material in displayMaterials" :key="material" type="info" size="small">
                    {{ material }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="优先级" required>
                <el-select v-model="formData.priority" placeholder="请选择优先级">
                  <el-option label="普通" value="普通" />
                  <el-option label="加急" value="加急" />
                  <el-option label="VIP" value="VIP" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扫描备注">
                <el-input v-model="formData.remark" placeholder="请输入扫描备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.channel === '集中录入'" :gutter="20">
            <el-col :span="24">
              <el-alert title="注意事项" type="warning" :closable="false">
                <ul>
                  <li>该模块支持柜员扫描影像后由集约中心进行录入，支持纯主、主附、纯附、和个人公务卡、单位公务卡。目前仅支持总行发送的统一制式申请表。</li>
                  <li>目前仅支持身份证类型客户，非身份证客户请自行录入。</li>
                  <li>个人主卡申请表请将信息填写页按页码顺序扫描至99-主申请表，个人附属卡申请表按页码顺序扫描至01-附属卡申请表。申请表中协议请扫描至11-其他。</li>
                  <li>仅能支持图片格式（分辨率200dpi），不支持PDF格式。</li>
                </ul>
              </el-alert>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-actions">
            <el-col :span="24" class="action-buttons">
              <el-button type="primary" @click="handleScan">扫描</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const formRef = ref(null)

const formData = reactive({
  productCategory: '',
  applicationType: '',
  channel: '',
  customerName: '',
  idType: '',
  idNumber: '',
  entryType: '',
  applicationMaterials: [],
  priority: '',
  remark: ''
})

const materialOptions = {
  '主卡申请': [
    { label: '主申请表', value: '主申请表' },
    { label: '主卡身份证明文件', value: '主卡身份证明文件' }
  ],
  '附卡申请': [
    { label: '附属卡申请表', value: '附属卡申请表' },
    { label: '附属卡身份证明文件', value: '附属卡身份证明文件' }
  ],
  '主+附申请': [
    { label: '主申请表', value: '主申请表' },
    { label: '附属卡身份证明文件', value: '附属卡身份证明文件' },
    { label: '主卡身份证明文件', value: '主卡身份证明文件' }
  ]
}

const availableMaterials = computed(() => {
  return materialOptions[formData.applicationType] || []
})

const displayMaterials = computed(() => {
  return (materialOptions[formData.applicationType] || []).map(m => m.label)
})

const handleApplicationTypeChange = () => {
  formData.applicationMaterials = []
}

const handleChannelChange = () => {
  if (formData.channel === '集中录入') {
    formData.idType = '中国居民身份证'
  } else {
    formData.idType = ''
  }
}

const handleScan = () => {
  const scanUrl = `/scan/page?productCategory=${encodeURIComponent(formData.productCategory)}&applicationType=${encodeURIComponent(formData.applicationType)}&channel=${encodeURIComponent(formData.channel)}&customerName=${encodeURIComponent(formData.customerName)}&idType=${encodeURIComponent(formData.idType)}&idNumber=${encodeURIComponent(formData.idNumber)}&entryType=${encodeURIComponent(formData.entryType)}&priority=${encodeURIComponent(formData.priority)}&remark=${encodeURIComponent(formData.remark)}`
  window.open(scanUrl, '_blank')
}

const handleReset = () => {
  formData.productCategory = ''
  formData.applicationType = ''
  formData.channel = ''
  formData.customerName = ''
  formData.idType = ''
  formData.idNumber = ''
  formData.entryType = ''
  formData.applicationMaterials = []
  formData.priority = ''
  formData.remark = ''
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

.no-materials {
  color: #999;
  font-size: 13px;
}
</style>