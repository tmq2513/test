<template>
  <div class="approval-limits-container">
    <el-card>
      <div class="card-header">
        <h2>员工审批额度管理</h2>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedLimits" style="width: 100%">
        <el-table-column prop="employeeCode" label="员工编号" width="120" />
        <el-table-column prop="orgName" label="所属机构" width="150" />
        <el-table-column prop="approvalLevel" label="员工审批级别" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.approvalLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxAmount" label="最高审批额度(元)" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.maxAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低审批额度(元)" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.minAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="validFlag" label="有效标识" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.validFlag === '有效' ? 'success' : 'danger'">
              {{ scope.row.validFlag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="lastOperator" label="最后操作员工" width="140" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredLimits.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="员工编号" required>
          <el-input v-model="formData.employeeCode" :disabled="isEdit" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="所属机构" required>
          <el-select v-model="formData.orgName" :disabled="isEdit" @change="onOrgChange" placeholder="请选择所属机构" filterable>
            <el-option v-for="bank in orgOptions" :key="bank.name" :label="bank.name" :value="bank.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工审批级别" required>
          <el-select v-model="formData.approvalLevel" @change="onLevelChange" placeholder="请选择审批级别">
            <el-option v-for="level in levelOptions" :key="level" :label="level" :value="level" />
          </el-select>
        </el-form-item>
        <el-form-item label="最高审批额度(元)" required>
          <el-input v-model.number="formData.maxAmount" placeholder="请输入最高审批额度" />
        </el-form-item>
        <el-form-item label="最低审批额度(元)" required>
          <el-input v-model.number="formData.minAmount" placeholder="请输入最低审批额度" />
        </el-form-item>
        <el-form-item label="有效标识">
          <el-select v-model="formData.validFlag">
            <el-option label="有效" value="有效" />
            <el-option label="无效" value="无效" />
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
import SearchForm from '@/components/SearchForm.vue'
import { useSystemData } from '@/composables/useSystemData'

const { levelOptions, orgOptions, orgSelectOptions, getLevelConfig } = useSystemData()

const limits = ref([
  { id: 1, employeeCode: 'EMP001', orgName: '北京分行', approvalLevel: '二级审批', minAmount: 50000, maxAmount: 100000, validFlag: '有效', createTime: '2026-06-01 10:00:00', lastOperator: '李四' },
  { id: 2, employeeCode: 'EMP002', orgName: '上海分行', approvalLevel: '三级审批', minAmount: 100000, maxAmount: 500000, validFlag: '有效', createTime: '2026-06-02 11:00:00', lastOperator: '王五' },
  { id: 3, employeeCode: 'EMP003', orgName: '广东分行', approvalLevel: '一级审批', minAmount: 10000, maxAmount: 50000, validFlag: '有效', createTime: '2026-06-03 14:00:00', lastOperator: '赵六' },
  { id: 4, employeeCode: 'EMP004', orgName: '江苏分行', approvalLevel: '四级审批', minAmount: 500000, maxAmount: 1000000, validFlag: '有效', createTime: '2026-06-04 09:00:00', lastOperator: '孙七' },
  { id: 5, employeeCode: 'EMP005', orgName: '浙江分行', approvalLevel: '五级审批', minAmount: 1000000, maxAmount: 5000000, validFlag: '有效', createTime: '2026-06-05 10:30:00', lastOperator: '周八' },
  { id: 6, employeeCode: 'EMP006', orgName: '北京分行', approvalLevel: '初级审批', minAmount: 0, maxAmount: 10000, validFlag: '有效', createTime: '2026-06-06 15:00:00', lastOperator: '张三' },
  { id: 7, employeeCode: 'EMP007', orgName: '上海分行', approvalLevel: '六级审批', minAmount: 5000000, maxAmount: 99999999, validFlag: '有效', createTime: '2026-06-07 08:00:00', lastOperator: '李四' },
  { id: 8, employeeCode: 'EMP008', orgName: '四川分行', approvalLevel: '二级审批', minAmount: 50000, maxAmount: 100000, validFlag: '无效', createTime: '2026-06-08 13:00:00', lastOperator: '王五' },
  { id: 9, employeeCode: 'EMP009', orgName: '山东分行', approvalLevel: '三级审批', minAmount: 100000, maxAmount: 500000, validFlag: '有效', createTime: '2026-06-09 16:00:00', lastOperator: '赵六' },
  { id: 10, employeeCode: 'EMP010', orgName: '河南分行', approvalLevel: '一级审批', minAmount: 10000, maxAmount: 50000, validFlag: '有效', createTime: '2026-06-10 10:00:00', lastOperator: '孙七' },
  { id: 11, employeeCode: 'EMP011', orgName: '湖北分行', approvalLevel: '四级审批', minAmount: 500000, maxAmount: 1000000, validFlag: '有效', createTime: '2026-06-11 11:00:00', lastOperator: '周八' },
  { id: 12, employeeCode: 'EMP012', orgName: '湖南分行', approvalLevel: '五级审批', minAmount: 1000000, maxAmount: 5000000, validFlag: '无效', createTime: '2026-06-12 14:00:00', lastOperator: '张三' },
  { id: 13, employeeCode: 'EMP013', orgName: '广东分行', approvalLevel: '二级审批', minAmount: 50000, maxAmount: 100000, validFlag: '有效', createTime: '2026-06-13 09:00:00', lastOperator: '李四' },
  { id: 14, employeeCode: 'EMP014', orgName: '福建分行', approvalLevel: '三级审批', minAmount: 100000, maxAmount: 500000, validFlag: '有效', createTime: '2026-06-14 10:30:00', lastOperator: '王五' },
  { id: 15, employeeCode: 'EMP015', orgName: '安徽分行', approvalLevel: '初级审批', minAmount: 0, maxAmount: 10000, validFlag: '有效', createTime: '2026-06-15 15:00:00', lastOperator: '赵六' }
])

const searchFields = [
  { prop: 'employeeCode', label: '员工编号', type: 'input', placeholder: '请输入员工编号' },
  { prop: 'orgName', label: '所属机构', type: 'select', options: orgSelectOptions.value },
  { prop: 'validFlag', label: '有效标识', type: 'select', options: [
    { label: '有效', value: '有效' },
    { label: '无效', value: '无效' }
  ]}
]

const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive({
  employeeCode: '',
  orgName: '',
  validFlag: ''
})

const filteredLimits = computed(() => {
  return limits.value.filter(l => {
    if (searchForm.employeeCode && !l.employeeCode.includes(searchForm.employeeCode)) return false
    if (searchForm.orgName && l.orgName !== searchForm.orgName) return false
    if (searchForm.validFlag && l.validFlag !== searchForm.validFlag) return false
    return true
  })
})

const paginatedLimits = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLimits.value.slice(start, start + pageSize.value)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const isEdit = ref(false)
const formData = reactive({
  id: null,
  employeeCode: '',
  orgName: '',
  approvalLevel: '',
  minAmount: null,
  maxAmount: null,
  validFlag: '有效'
})

const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '-'
  return Number(amount).toLocaleString()
}

const syncAmounts = () => {
  if (formData.orgName && formData.approvalLevel) {
    const config = getLevelConfig(formData.orgName, formData.approvalLevel)
    if (config) {
      formData.minAmount = config.min
      formData.maxAmount = config.max
    }
  }
}

const onOrgChange = () => {
  formData.approvalLevel = ''
  formData.minAmount = null
  formData.maxAmount = null
}

const onLevelChange = () => {
  syncAmounts()
}

const handleAdd = () => {
  console.log('handleAdd called')
  dialogTitle.value = '新增'
  isEdit.value = false
  formData.id = null
  formData.employeeCode = ''
  formData.orgName = ''
  formData.approvalLevel = ''
  formData.minAmount = null
  formData.maxAmount = null
  formData.validFlag = '有效'
  dialogVisible.value = true
  console.log('dialogVisible set to:', dialogVisible.value)
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  isEdit.value = true
  formData.id = row.id
  formData.employeeCode = row.employeeCode
  formData.orgName = row.orgName
  formData.approvalLevel = row.approvalLevel
  formData.minAmount = row.minAmount
  formData.maxAmount = row.maxAmount
  formData.validFlag = row.validFlag
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!formData.employeeCode) {
    ElMessage.warning('请输入员工编号')
    return
  }
  if (!formData.orgName) {
    ElMessage.warning('请选择所属机构')
    return
  }
  if (!formData.approvalLevel) {
    ElMessage.warning('请选择审批级别')
    return
  }
  if (formData.minAmount === null || formData.minAmount === undefined) {
    ElMessage.warning('请输入最低审批额度')
    return
  }
  if (formData.maxAmount === null || formData.maxAmount === undefined) {
    ElMessage.warning('请输入最高审批额度')
    return
  }
  if (formData.minAmount > formData.maxAmount) {
    ElMessage.warning('最低审批额度不能大于最高审批额度')
    return
  }

  const now = new Date().toLocaleString('zh-CN')

  if (formData.id) {
    const index = limits.value.findIndex(l => l.id === formData.id)
    if (index !== -1) {
      limits.value[index] = { ...formData, lastOperator: '当前用户', createTime: limits.value[index].createTime }
    }
    ElMessage.success('修改成功')
  } else {
    formData.id = Date.now()
    limits.value.push({ ...formData, createTime: now, lastOperator: '当前用户' })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

const handleSearch = (data) => {
  Object.assign(searchForm, data)
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.employeeCode = ''
  searchForm.orgName = ''
  searchForm.validFlag = ''
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
.approval-limits-container {
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>