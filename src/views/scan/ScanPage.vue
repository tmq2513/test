<template>
  <div class="scan-page-container">
    <el-card>
      <div class="card-header">
        <h3>影像扫描</h3>
      </div>
      <div class="card-body">
        <div class="operation-bar">
          <el-button type="primary" @click="handleScan">扫描</el-button>
          <el-button @click="showScanSettings = true">扫描参数设置</el-button>
          <el-select v-model="selectedScanner" placeholder="选择扫描仪" style="width: 200px; margin-left: 8px;">
            <el-option v-for="scanner in scanners" :key="scanner.value" :label="scanner.label" :value="scanner.value" />
          </el-select>
          <el-button @click="triggerFileUpload">导入附件</el-button>
          <el-button type="danger" @click="handleDelete" :disabled="selectedFiles.length === 0">删除</el-button>
          <el-button @click="toggleThumbnails">缩略图</el-button>
          <el-button type="success" @click="handleUpload" :disabled="scannedFiles.length === 0">上传</el-button>
          <el-button @click="handleExit">退出</el-button>
        </div>
        <div class="content-area">
          <div class="left-panel">
            <div class="info-section">
              <h4>录入信息</h4>
              <el-form label-width="100px" :inline="false">
                <el-form-item label="申请件编号">
                  <el-input v-model="formData.applicationNo" placeholder="请输入16位申请件编号" />
                </el-form-item>
                <div v-if="!isApplicationNoValid" class="validation-error">
                  申请件编号必须为16位纯数字且不能为16个0
                </div>
                <el-form-item label="表单号">
                  <el-input v-model="formData.formNo" placeholder="请输入表单号" />
                </el-form-item>
              </el-form>
            </div>
            <div class="structure-tree-section">
                  <h4>影像结构树</h4>
                  <el-tree
                    :data="structureTree"
                    :props="treeProps"
                    :expand-on-click-node="true"
                    default-expand-all
                    node-key="label"
                    :highlight-current="true"
                    @node-click="handleNodeClick"
                  />
                </div>
          </div>
          <div class="right-panel">
            <h4>{{ selectedNode ? selectedNode.label + ' - 文件列表' : '已扫描文件' }}</h4>
            <div v-if="!selectedNode" class="empty-state">
              <el-empty description="请先选择影像结构树中的影像类型" />
            </div>
            <div v-else-if="selectedNode.children.length === 0" class="empty-state">
              <el-empty description="暂无文件" />
            </div>
            <div v-else class="file-list">
              <div
                v-for="(file, index) in selectedNode.children"
                :key="file.id"
                :class="['file-item', { 'selected': selectedFiles.includes(file.id) }]"
                @click="toggleFileSelection(file.id)"
              >
                <el-image v-if="isThumbnailMode && file.thumbnail" :src="file.thumbnail" fit="cover" class="file-thumbnail" />
                <div v-else class="file-icon">
                  <el-icon><component :is="Picture" /></el-icon>
                </div>
                <div class="file-info">
                  <span class="file-name">{{ file.label }}</span>
                  <span class="file-size">{{ file.size }} KB</span>
                </div>
                <el-checkbox v-model="selectedFiles" :value="file.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <input ref="fileInput" type="file" multiple accept="image/*,.pdf,.doc,.docx" class="hidden-input" @change="handleFileSelect" />
    <el-dialog v-model="showScanSettings" title="扫描参数设置" width="500px">
      <el-form :model="scanSettings" label-width="120px">
        <el-form-item label="扫描分辨率">
          <el-select v-model="scanSettings.resolution">
            <el-option label="100 DPI" value="100" />
            <el-option label="200 DPI" value="200" />
            <el-option label="300 DPI" value="300" />
            <el-option label="600 DPI" value="600" />
          </el-select>
        </el-form-item>
        <el-form-item label="扫描格式">
          <el-select v-model="scanSettings.format">
            <el-option label="JPEG" value="jpeg" />
            <el-option label="PNG" value="png" />
            <el-option label="PDF" value="pdf" />
            <el-option label="TIFF" value="tiff" />
          </el-select>
        </el-form-item>
        <el-form-item label="扫描颜色">
          <el-select v-model="scanSettings.color">
            <el-option label="彩色" value="color" />
            <el-option label="灰度" value="gray" />
            <el-option label="黑白" value="blackwhite" />
          </el-select>
        </el-form-item>
        <el-form-item label="纸张大小">
          <el-select v-model="scanSettings.paperSize">
            <el-option label="A4" value="a4" />
            <el-option label="A5" value="a5" />
            <el-option label="Letter" value="letter" />
            <el-option label="Legal" value="legal" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showScanSettings = false">取消</el-button>
        <el-button type="primary" @click="saveScanSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const fileInput = ref(null)
const showScanSettings = ref(false)
const isThumbnailMode = ref(true)
const selectedScanner = ref('scanner1')
const selectedFiles = ref([])
const selectedNode = ref(null)

const scanners = [
  { label: '扫描仪1', value: 'scanner1' },
  { label: '扫描仪2', value: 'scanner2' },
  { label: '扫描仪3', value: 'scanner3' }
]

const formData = reactive({
  applicationNo: '0000000000000000',
  formNo: ''
})

const scanSettings = reactive({
  resolution: '200',
  format: 'jpeg',
  color: 'color',
  paperSize: 'a4'
})

const scannedFiles = ref([
  { id: 1, name: '主申请表.jpg', size: 156, thumbnail: '', type: 'image' },
  { id: 2, name: '主卡身份证明文件.jpg', size: 203, thumbnail: '', type: 'image' }
])

const treeProps = {
  children: 'children',
  label: 'label'
}

const scanType = ref('personal-card')

const personalCardStructure = [
  { label: '99-申请表单', children: [] },
  { label: '01-附属卡申请表单', children: [] },
  { label: '02-主卡身份证明文件', children: [] },
  { label: '03-财力证明文件', children: [] },
  { label: '04-居住证明文件', children: [] },
  { label: '05-分行证明文件', children: [] },
  { label: '11-其他', children: [] },
  { label: '12-附属卡身份证明文件', children: [] },
  { label: '15-综合开户申请表', children: [] },
  { label: '16-非美国人士申明', children: [] },
  { label: '17-美国人士申明', children: [] },
  { label: '19-不配合账户', children: [] },
  { label: '20-联网核查文件', children: [] }
]

const companyStructure = [
  { label: '99-申请表单', children: [] },
  { label: '11-其他', children: [] }
]

const structureTree = reactive([
  {
    label: formData.applicationNo || '0000000000000000',
    children: scanType.value === 'company-structure' ? companyStructure : personalCardStructure
  }
])

const updateStructureTree = () => {
  if (structureTree[0]) {
    structureTree[0].label = formData.applicationNo || '0000000000000000'
    structureTree[0].children = scanType.value === 'company-structure' ? companyStructure : personalCardStructure
  }
}

onMounted(() => {
  const applicationNo = route.query.applicationNo
  if (applicationNo) {
    formData.applicationNo = applicationNo
  }
  const type = route.query.type
  if (type) {
    scanType.value = type
  }
  updateStructureTree()
  const scannedFilesStr = route.query.scannedFiles
  if (scannedFilesStr) {
    try {
      const scannedFilesData = JSON.parse(decodeURIComponent(scannedFilesStr))
      if (scannedFilesData && Array.isArray(scannedFilesData)) {
        scannedFilesData.forEach(item => {
          const node = structureTree[0].children.find(n => n.label === item.type)
          if (node) {
            item.files.forEach(fileName => {
              node.children.push({
                id: Date.now() + Math.random(),
                label: fileName,
                size: Math.floor(Math.random() * 300) + 100,
                thumbnail: '',
                type: fileName.includes('.pdf') ? 'pdf' : 'image',
                nodeLabel: node.label
              })
            })
          }
        })
      }
    } catch (e) {
      console.error('解析已扫描文件数据失败', e)
    }
  }
})

const isApplicationNoValid = computed(() => {
  const no = formData.applicationNo
  return /^\d{16}$/.test(no) && no !== '0000000000000000'
})

watch(() => formData.applicationNo, () => {
  updateStructureTree()
})

const handleNodeClick = (data) => {
  if (data.children && data.children.length > 0) {
    return
  }
  if (structureTree[0].children.find(n => n.label === data.label)) {
    if (!isApplicationNoValid.value) {
      ElMessage.warning('申请件编号必须为16位纯数字且不能为16个0')
      return
    }
    selectedNode.value = data
  } else {
    selectedNode.value = structureTree[0].children.find(n => n.children && n.children.find(f => f.id === data.id)) || null
  }
}

const getSelectedFiles = () => {
  if (selectedNode.value && selectedNode.value.children) {
    return selectedNode.value.children
  }
  return scannedFiles.value
}

const handleScan = () => {
  if (!isApplicationNoValid.value) {
    ElMessage.warning('申请件编号必须为16位纯数字且不能为16个0')
    return
  }
  if (!selectedNode.value) {
    ElMessage.warning('请先选择影像结构树中的影像类型')
    return
  }
  ElMessage.success('正在调用扫描仪扫描...')
  setTimeout(() => {
    const newFile = {
      id: Date.now(),
      label: `扫描文件_${Date.now()}.jpg`,
      size: Math.floor(Math.random() * 300) + 100,
      thumbnail: '',
      type: 'image',
      nodeLabel: selectedNode.value.label
    }
    selectedNode.value.children.push(newFile)
    scannedFiles.value.push(newFile)
    ElMessage.success(`扫描完成，已添加到 ${selectedNode.value.label}`)
  }, 1500)
}

const saveScanSettings = () => {
  showScanSettings.value = false
  ElMessage.success('扫描参数设置已保存')
}

const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  if (!isApplicationNoValid.value) {
    ElMessage.warning('申请件编号必须为16位纯数字且不能为16个0')
    event.target.value = ''
    return
  }
  if (!selectedNode.value) {
    ElMessage.warning('请先选择影像结构树中的影像类型')
    event.target.value = ''
    return
  }
  const files = event.target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newFile = {
        id: Date.now() + i,
        label: file.name,
        size: Math.floor(file.size / 1024),
        thumbnail: '',
        type: file.type.startsWith('image') ? 'image' : 'document',
        nodeLabel: selectedNode.value.label
      }
      selectedNode.value.children.push(newFile)
      scannedFiles.value.push(newFile)
    }
    ElMessage.success(`成功导入 ${files.length} 个文件到 ${selectedNode.value.label}`)
  }
  event.target.value = ''
}

const toggleFileSelection = (fileId) => {
  const index = selectedFiles.value.indexOf(fileId)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(fileId)
  }
}

const handleDelete = () => {
  selectedFiles.value.forEach(fileId => {
    structureTree[0].children.forEach(node => {
      node.children = node.children.filter(f => f.id !== fileId)
    })
  })
  scannedFiles.value = scannedFiles.value.filter(file => !selectedFiles.value.includes(file.id))
  selectedFiles.value = []
  ElMessage.success('删除成功')
}

const toggleThumbnails = () => {
  isThumbnailMode.value = !isThumbnailMode.value
}

const handleUpload = () => {
  ElMessage.success('正在上传文件到后台服务...')
  setTimeout(() => {
    ElMessage.success('所有文件上传完成')
  }, 2000)
}

const handleExit = () => {
  window.close()
}

import { ElMessage } from 'element-plus'
</script>

<style scoped>
.scan-page-container {
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
  min-height: 500px;
}

.operation-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.content-area {
  display: flex;
  gap: 24px;
  height: calc(100vh - 280px);
}

.left-panel {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section, .structure-tree-section {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
}

.info-section h4, .structure-tree-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.right-panel {
  flex: 1;
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  overflow-y: auto;
}

.right-panel h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.empty-state {
  padding: 40px;
}

.file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.file-item:hover {
  border-color: #409eff;
}

.file-item.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.file-thumbnail {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-info {
  text-align: center;
  width: 100%;
}

.file-name {
  display: block;
  font-size: 12px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.hidden-input {
  display: none;
}

.validation-error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 100px;
}
</style>