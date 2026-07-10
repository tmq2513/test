<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>个人公司卡申请影像扫描</h3>
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
          <el-divider content-position="left">关联公司架构</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="总公司名称">
                <el-input v-model="formData.parentCompanyName" placeholder="请选择总公司" readonly>
                  <template #append>
                    <el-button @click="showCompanyDialog = true">公司关联</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分公司名称">
                <el-input v-model="formData.subsidiaryCompanyName" placeholder="请选择分公司" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门名称">
                <el-input v-model="formData.departmentName" placeholder="请选择部门" readonly />
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

    <el-dialog v-model="showCompanyDialog" title="选择公司架构" width="600px" :close-on-click-modal="false">
      <el-tree
        ref="companyTreeRef"
        :data="companyStructure"
        :props="companyTreeProps"
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        show-checkbox
        :check-strictly="true"
        @check-change="handleCompanyCheckChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.label }}</span>
            <span v-if="data.code" class="node-code">（{{ data.code }}）</span>
          </span>
        </template>
      </el-tree>
      <template #footer>
        <el-button @click="showCompanyDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCompany">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const companyTreeRef = ref(null)
const showCompanyDialog = ref(false)
const selectedCompany = ref(null)

const formData = reactive({
  productCategory: '',
  applicationType: '',
  channel: '',
  customerName: '',
  idType: '',
  idNumber: '',
  entryType: '',
  applicationMaterials: [],
  parentCompanyName: '',
  subsidiaryCompanyName: '',
  departmentName: '',
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

const companyStructure = [
  {
    id: 1,
    label: '北京总公司',
    code: 'CUST001',
    type: 'parent',
    children: [
      {
        id: 11,
        label: '北京分公司',
        code: 'DEPT001',
        type: 'subsidiary',
        children: [
          { id: 111, label: '技术部', code: 'DEPT001-01', type: 'department' },
          { id: 112, label: '市场部', code: 'DEPT001-02', type: 'department' },
          { id: 113, label: '财务部', code: 'DEPT001-03', type: 'department' }
        ]
      },
      {
        id: 12,
        label: '上海分公司',
        code: 'DEPT002',
        type: 'subsidiary',
        children: [
          { id: 121, label: '销售部', code: 'DEPT002-01', type: 'department' },
          { id: 122, label: '人事部', code: 'DEPT002-02', type: 'department' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '上海总公司',
    code: 'CUST002',
    type: 'parent',
    children: [
      {
        id: 21,
        label: '广州分公司',
        code: 'DEPT003',
        type: 'subsidiary',
        children: [
          { id: 211, label: '运营部', code: 'DEPT003-01', type: 'department' },
          { id: 212, label: '客服部', code: 'DEPT003-02', type: 'department' }
        ]
      }
    ]
  }
]

const companyTreeProps = {
  children: 'children',
  label: 'label'
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

const handleCompanyCheckChange = (data, checked) => {
  if (checked) {
    companyTreeRef.value.setCheckedKeys([data.id])
    selectedCompany.value = data
  } else {
    selectedCompany.value = null
  }
}

const handleConfirmCompany = () => {
  const checkedNodes = companyTreeRef.value.getCheckedNodes()
  if (!checkedNodes || checkedNodes.length === 0) {
    ElMessage.warning('请选择公司架构')
    return
  }

  const node = checkedNodes[0]
  if (node.type === 'parent') {
    formData.parentCompanyName = node.label
    formData.subsidiaryCompanyName = ''
    formData.departmentName = ''
  } else if (node.type === 'subsidiary') {
    formData.parentCompanyName = companyStructure.find(c => c.children.some(s => s.id === node.id))?.label || ''
    formData.subsidiaryCompanyName = node.label
    formData.departmentName = ''
  } else if (node.type === 'department') {
    const parentCompany = companyStructure.find(c => c.children.some(s => s.children?.some(d => d.id === node.id)))
    const subsidiaryCompany = parentCompany?.children.find(s => s.children?.some(d => d.id === node.id))
    formData.parentCompanyName = parentCompany?.label || ''
    formData.subsidiaryCompanyName = subsidiaryCompany?.label || ''
    formData.departmentName = node.label
  }

  showCompanyDialog.value = false
  ElMessage.success('公司架构关联成功')
}

const handleScan = () => {
  const scanUrl = `/scan/page?productCategory=${encodeURIComponent(formData.productCategory)}&applicationType=${encodeURIComponent(formData.applicationType)}&channel=${encodeURIComponent(formData.channel)}&customerName=${encodeURIComponent(formData.customerName)}&idType=${encodeURIComponent(formData.idType)}&idNumber=${encodeURIComponent(formData.idNumber)}&entryType=${encodeURIComponent(formData.entryType)}&priority=${encodeURIComponent(formData.priority)}&remark=${encodeURIComponent(formData.remark)}&parentCompanyName=${encodeURIComponent(formData.parentCompanyName)}&subsidiaryCompanyName=${encodeURIComponent(formData.subsidiaryCompanyName)}&departmentName=${encodeURIComponent(formData.departmentName)}`
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
  formData.parentCompanyName = ''
  formData.subsidiaryCompanyName = ''
  formData.departmentName = ''
  formData.priority = ''
  formData.remark = ''
  selectedCompany.value = null
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

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-code {
  color: #999;
  font-size: 12px;
}

:deep(.el-dialog__body) {
  max-height: 400px;
  overflow-y: auto;
}
</style>