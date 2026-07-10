<template>
  <div class="scan-container">
    <div class="header-bar">
      <div class="header-left">
        <h2>{{ isCompanyView ? '公司架构影像调阅（只读）' : (isViewOnlyMode ? '影像调阅（只读）' : '影像调阅') }}</h2>
      </div>
      <div class="header-right">
        <el-button type="danger" @click="handleExit">退出</el-button>
      </div>
    </div>
    <div class="main-content">
      <div class="left-panel">
        <div class="panel-header">影像结构树</div>
        <div class="tree-container">
          <el-tree
            :data="filteredTree"
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
        <div class="form-section">
          <el-form :model="formData" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请件编号">
                  <el-input v-model="formData.applicationNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表单号">
                  <el-input v-model="formData.formNo" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="thumbnail-section">
          <div class="section-header">
            <span>缩略图预览</span>
            <span v-if="selectedNode" class="selected-info">当前选中：{{ selectedNode.label }}</span>
            <span v-if="isViewOnlyMode" class="view-only-badge">只读模式</span>
          </div>
          <div class="thumbnail-grid">
            <div v-if="selectedFiles.length === 0" class="empty-state">
              <el-icon><component :is="Picture" /></el-icon>
              <p>请选择影像类型查看文件</p>
            </div>
            <div v-for="file in selectedFiles" :key="file.id" class="thumbnail-item">
              <div class="thumbnail-image" @click="handleFilePreview(file)">
                <el-icon v-if="file.type === 'pdf'" class="file-icon"><component :is="Document" /></el-icon>
                <el-icon v-else class="file-icon"><component :is="Picture" /></el-icon>
                <div class="file-name">{{ file.label }}</div>
              </div>
              <div class="file-info">{{ file.size }}KB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Document } from '@element-plus/icons-vue'

const route = useRoute()

const isViewOnlyMode = ref(false)
const isCompanyView = ref(false)

const formData = reactive({
  applicationNo: '',
  formNo: ''
})

const treeProps = {
  children: 'children',
  label: 'label'
}

const structureTree = reactive([
  {
    label: formData.applicationNo || '0000000000000000',
    children: [
      { 
        label: '99-申请表单', 
        children: [
          { id: 1, label: '申请表_张三.pdf', size: 256, type: 'pdf', nodeLabel: '99-申请表单' },
          { id: 2, label: '申请表_张三_副本.pdf', size: 189, type: 'pdf', nodeLabel: '99-申请表单' }
        ] 
      },
      { 
        label: '02-主卡身份证明文件', 
        children: [
          { id: 3, label: '身份证正面.jpg', size: 156, type: 'image', nodeLabel: '02-主卡身份证明文件' },
          { id: 4, label: '身份证反面.jpg', size: 142, type: 'image', nodeLabel: '02-主卡身份证明文件' }
        ] 
      },
      { 
        label: '03-财力证明文件', 
        children: [
          { id: 5, label: '收入证明.pdf', size: 312, type: 'pdf', nodeLabel: '03-财力证明文件' },
          { id: 6, label: '银行流水.jpg', size: 425, type: 'image', nodeLabel: '03-财力证明文件' }
        ] 
      },
      { 
        label: '04-居住证明文件', 
        children: [
          { id: 7, label: '租房合同.pdf', size: 198, type: 'pdf', nodeLabel: '04-居住证明文件' }
        ] 
      },
      { label: '01-附属卡申请表单', children: [] },
      { label: '05-分行证明文件', children: [] },
      { label: '11-其他', children: [] },
      { label: '12-附属卡身份证明文件', children: [] },
      { label: '15-综合开户申请表', children: [] },
      { label: '16-非美国人士申明', children: [] },
      { label: '17-美国人士申明', children: [] },
      { label: '19-不配合账户', children: [] },
      { label: '20-联网核查文件', children: [] }
    ]
  }
])

const selectedNode = ref(null)

const selectedFiles = computed(() => {
  if (selectedNode.value && selectedNode.value.children) {
    return selectedNode.value.children
  }
  return []
})

const handleNodeClick = (data) => {
  if (data.children && data.children.length > 0) {
    selectedNode.value = data
  } else {
    selectedNode.value = structureTree[0].children.find(n => n.children && n.children.find(f => f.id === data.id)) || null
  }
}

const handleFilePreview = (file) => {
  ElMessage.info(`预览文件：${file.label}`)
}

const handleExit = () => {
  window.close()
}

onMounted(() => {
  const applicationNo = route.query.applicationNo
  const viewOnly = route.query.viewOnly === 'true'
  const companyView = route.query.companyView === 'true'
  
  if (applicationNo) {
    formData.applicationNo = applicationNo
    if (structureTree[0]) {
      structureTree[0].label = applicationNo
    }
  }
  
  // 设置页面模式
  isViewOnlyMode.value = viewOnly
  isCompanyView.value = companyView
  
  formData.formNo = 'FORM' + Math.random().toString(36).substring(2, 10).toUpperCase()
})

// 公司视图模式下只显示特定节点
const filteredTree = computed(() => {
  if (!isCompanyView.value) {
    return structureTree
  }
  const allowedLabels = ['99-申请表单', '11-其他']
  return structureTree.map(root => ({
    ...root,
    children: root.children.filter(child => allowedLabels.includes(child.label))
  }))
})
</script>

<style scoped>
.scan-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #8b0000;
  color: white;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
}

.header-right .el-button {
  margin-left: 10px;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  background-color: #fafafa;
}

.left-panel {
  width: 280px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
  color: #303133;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.right-panel {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.form-section {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.thumbnail-section {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 500;
  color: #303133;
}

.selected-info {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}

.view-only-badge {
  font-size: 12px;
  color: #8b0000;
  background-color: #fff5f5;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #8b0000;
  font-weight: 500;
}

.thumbnail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.thumbnail-item {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.thumbnail-image {
  width: 120px;
  height: 100px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
}

.thumbnail-image:hover {
  border-color: #8b0000;
  background-color: #fff5f5;
}

.file-icon {
  font-size: 32px;
  color: #909399;
  margin-bottom: 8px;
}

.file-name {
  font-size: 12px;
  color: #606266;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  padding: 0 8px;
}

.file-info {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.empty-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #fff5f5;
  color: #8b0000;
}

:deep(.el-tree-node__content:hover) {
  background-color: #fff5f5;
}
</style>