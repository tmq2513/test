<template>
  <div class="approval-levels-container">
    <el-card>
      <div class="card-header">
        <h2>审批级别管理</h2>
      </div>

      <el-table :data="approvalLevels" style="width: 100%" :max-height="600">
        <el-table-column prop="orgName" label="机构名称" width="180" fixed="left" />
        
        <el-table-column label="初级审批">
          <el-table-column prop="levels[0].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[0].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[0].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[0].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="一级审批">
          <el-table-column prop="levels[1].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[1].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[1].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[1].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="二级审批">
          <el-table-column prop="levels[2].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[2].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[2].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[2].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="三级审批">
          <el-table-column prop="levels[3].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[3].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[3].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[3].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="四级审批">
          <el-table-column prop="levels[4].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[4].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[4].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[4].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="五级审批">
          <el-table-column prop="levels[5].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[5].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[5].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[5].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="六级审批">
          <el-table-column prop="levels[6].minAmount" label="最低额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[6].minAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="levels[6].maxAmount" label="最高额度(元)" width="120">
            <template #default="scope">
              {{ formatAmount(scope.row.levels[6].maxAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">维护</el-button>
            <el-button type="info" size="small" @click="handleViewLog(scope.row)">查看日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" :title="`维护 - ${editData.orgName}`" width="800px">
      <el-form :model="editForm" label-width="120px">
        <div v-for="(level, index) in editForm.levels" :key="index" class="level-form-item">
          <el-divider content-position="left">{{ levelNames[index] }}</el-divider>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="`最低额度(元)`">
                <el-input v-model.number="level.minAmount" placeholder="请输入最低额度" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="`最高额度(元)`">
                <el-input v-model.number="level.maxAmount" placeholder="请输入最高额度" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="logDialogVisible" :title="`维护日志 - ${logData.orgName}`" width="800px">
      <el-tabs v-model="activeLogTab">
        <el-tab-pane label="当前数据" name="current">
          <el-table :data="logData.levels" style="width: 100%" :show-header="false">
            <el-table-column prop="levelName" width="120" />
            <el-table-column prop="minAmount" width="150">
              <template #default="scope">
                <span>最低：{{ formatAmount(scope.row.minAmount) }} 元</span>
              </template>
            </el-table-column>
            <el-table-column prop="maxAmount" width="150">
              <template #default="scope">
                <span>最高：{{ formatAmount(scope.row.maxAmount) }} 元</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="history">
          <el-table :data="logData.logs" style="width: 100%">
            <el-table-column prop="operatorCode" label="操作员工号" width="150" />
            <el-table-column prop="operatorName" label="操作员姓名" width="150" />
            <el-table-column prop="operationTime" label="操作时间" width="180" />
            <el-table-column prop="operationContent" label="操作内容" min-width="300" />
          </el-table>
          <div v-if="logData.logs.length === 0" class="empty-log">
            <el-empty description="暂无操作记录" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="logDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSystemData } from '@/composables/useSystemData'

const { levelOptions, approvalLevels, initializeApprovalLevels } = useSystemData()
const levelNames = levelOptions

onMounted(() => {
  initializeApprovalLevels()
})

const editDialogVisible = ref(false)
const editData = reactive({ id: null, orgName: '' })
const editForm = reactive({
  levels: generateDefaultLevels()
})

const logDialogVisible = ref(false)
const logData = reactive({ id: null, orgName: '', levels: [], logs: [] })
const activeLogTab = ref('current')

const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '-'
  return Number(amount).toLocaleString()
}

const handleEdit = (row) => {
  editData.id = row.id
  editData.orgName = row.orgName
  editForm.levels = row.levels.map(level => ({ ...level }))
  editDialogVisible.value = true
}

const handleSubmitEdit = () => {
  for (let i = 0; i < editForm.levels.length; i++) {
    const level = editForm.levels[i]
    if (level.minAmount === undefined || level.minAmount === null) {
      ElMessage.warning(`请填写${levelNames[i]}的最低额度`)
      return
    }
    if (level.maxAmount === undefined || level.maxAmount === null) {
      ElMessage.warning(`请填写${levelNames[i]}的最高额度`)
      return
    }
    if (level.minAmount > level.maxAmount) {
      ElMessage.warning(`${levelNames[i]}的最低额度不能大于最高额度`)
      return
    }
  }

  const index = approvalLevels.value.findIndex(l => l.id === editData.id)
  if (index !== -1) {
    const oldLevels = [...approvalLevels.value[index].levels]
    const newLevels = [...editForm.levels]
    
    let changes = []
    for (let i = 0; i < oldLevels.length; i++) {
      if (oldLevels[i].minAmount !== newLevels[i].minAmount || oldLevels[i].maxAmount !== newLevels[i].maxAmount) {
        changes.push(`${levelNames[i]}：最低额度${formatAmount(oldLevels[i].minAmount)}→${formatAmount(newLevels[i].minAmount)}，最高额度${formatAmount(oldLevels[i].maxAmount)}→${formatAmount(newLevels[i].maxAmount)}`)
      }
    }
    
    approvalLevels.value[index].levels = newLevels.map(level => ({ ...level }))
    
    if (changes.length > 0) {
      const newLog = {
        id: Date.now(),
        operatorCode: 'EMP001',
        operatorName: '张三',
        operationTime: new Date().toLocaleString('zh-CN'),
        operationContent: changes.join('；')
      }
      approvalLevels.value[index].logs.unshift(newLog)
    }
    
    ElMessage.success('维护成功')
  }
  editDialogVisible.value = false
}

const handleViewLog = (row) => {
  logData.id = row.id
  logData.orgName = row.orgName
  logData.levels = row.levels.map(level => ({ ...level }))
  logData.logs = [...row.logs]
  activeLogTab.value = 'current'
  logDialogVisible.value = true
}
</script>

<style scoped>
.approval-levels-container {
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

.level-form-item {
  margin-bottom: 16px;
}

.empty-log {
  padding: 40px;
  text-align: center;
}
</style>