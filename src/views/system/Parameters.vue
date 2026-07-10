<template>
  <div class="parameters-container">
    <el-card>
      <div class="card-header">
        <h2>业务参数管理</h2>
      </div>

      <el-tabs v-model="activeTab" class="param-tabs">
        <!-- 常用参数管理 -->
        <el-tab-pane label="常用参数管理" name="common">
          <div class="tab-header">
            <el-button type="primary" @click="handleAddCommon">新增参数</el-button>
          </div>

          <SearchForm 
            :fields="commonSearchFields" 
            :form-model="commonSearchForm" 
            @search="handleSearchCommon" 
            @reset="handleResetCommon" 
          />

          <el-table :data="paginatedCommonParams" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="paramCode" label="参数编码" />
            <el-table-column prop="paramName" label="参数名称" />
            <el-table-column prop="paramValue" label="参数值" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEditCommon(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDeleteCommon(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="commonCurrentPage"
              v-model:page-size="commonPageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="filteredCommonParams.length"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-tab-pane>

        <!-- 表单参数管理 -->
        <el-tab-pane label="表单参数管理" name="form">
          <div class="tab-header">
            <el-button type="primary" @click="handleAddForm">新增选项组</el-button>
          </div>

          <SearchForm 
            :fields="formSearchFields" 
            :form-model="formSearchForm" 
            @search="handleSearchForm" 
            @reset="handleResetForm" 
          />

          <el-table :data="paginatedFormParams" style="width: 100%">
            <el-table-column prop="groupCode" label="选项组编码" />
            <el-table-column prop="groupName" label="选项组名称" />
            <el-table-column prop="options" label="选项值列表">
              <template #default="scope">
                <el-tag v-for="(option, index) in scope.row.options" :key="index" style="margin-right: 5px;" type="info">
                  {{ option }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEditForm(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDeleteForm(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="formCurrentPage"
              v-model:page-size="formPageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="filteredFormParams.length"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-tab-pane>

        <!-- 汇率参数管理 -->
        <el-tab-pane label="汇率参数管理" name="exchange">
          <div class="tab-header">
            <el-button type="primary" @click="handleAddExchange">新增汇率</el-button>
          </div>

          <SearchForm 
            :fields="exchangeSearchFields" 
            :form-model="exchangeSearchForm" 
            @search="handleSearchExchange" 
            @reset="handleResetExchange" 
          />

          <el-table :data="paginatedExchangeParams" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="currencyCode" label="货币代码" />
            <el-table-column prop="currencyName" label="货币名称" />
            <el-table-column prop="exchangeRate" label="汇率" />
            <el-table-column prop="baseCurrency" label="基准货币" />
            <el-table-column prop="effectiveDate" label="生效日期" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEditExchange(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDeleteExchange(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="exchangeCurrentPage"
              v-model:page-size="exchangePageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="filteredExchangeParams.length"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 常用参数弹窗 -->
    <el-dialog v-model="commonDialogVisible" :title="commonDialogTitle" width="500px">
      <el-form :model="commonFormData" label-width="100px">
        <el-form-item label="参数编码">
          <el-input v-model="commonFormData.paramCode" />
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input v-model="commonFormData.paramName" />
        </el-form-item>
        <el-form-item label="参数值">
          <el-input v-model="commonFormData.paramValue" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="commonFormData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="commonFormData.status">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="commonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitCommon">确定</el-button>
      </template>
    </el-dialog>

    <!-- 表单参数弹窗 -->
    <el-dialog v-model="formDialogVisible" :title="formDialogTitle" width="600px">
      <el-form :model="formFormData" label-width="100px">
        <el-form-item label="选项组编码" required>
          <el-input v-model="formFormData.groupCode" placeholder="如：ID_TYPE" />
        </el-form-item>
        <el-form-item label="选项组名称" required>
          <el-input v-model="formFormData.groupName" placeholder="如：证件类型" />
        </el-form-item>
        <el-form-item label="选项值列表" required>
          <div class="options-editor">
            <div v-for="(option, index) in formFormData.options" :key="index" class="option-item">
              <el-input v-model="formFormData.options[index]" placeholder="请输入选项值" />
              <el-button type="danger" link @click="removeOption(index)" :disabled="formFormData.options.length <= 1">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" link @click="addOption">
              <el-icon><Plus /></el-icon> 添加选项
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formFormData.status">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 汇率参数弹窗 -->
    <el-dialog v-model="exchangeDialogVisible" :title="exchangeDialogTitle" width="500px">
      <el-form :model="exchangeFormData" label-width="100px">
        <el-form-item label="货币代码">
          <el-input v-model="exchangeFormData.currencyCode" placeholder="例如：USD" />
        </el-form-item>
        <el-form-item label="货币名称">
          <el-input v-model="exchangeFormData.currencyName" placeholder="例如：美元" />
        </el-form-item>
        <el-form-item label="汇率">
          <el-input-number v-model="exchangeFormData.exchangeRate" :precision="4" :step="0.0001" />
        </el-form-item>
        <el-form-item label="基准货币">
          <el-select v-model="exchangeFormData.baseCurrency">
            <el-option label="人民币 (CNY)" value="CNY" />
            <el-option label="美元 (USD)" value="USD" />
            <el-option label="欧元 (EUR)" value="EUR" />
            <el-option label="英镑 (GBP)" value="GBP" />
            <el-option label="日元 (JPY)" value="JPY" />
            <el-option label="港币 (HKD)" value="HKD" />
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker v-model="exchangeFormData.effectiveDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="exchangeFormData.status">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exchangeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitExchange">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm.vue'

const activeTab = ref('common')

// ==================== 常用参数管理 ====================
const commonParams = ref([
  { id: 1, paramCode: 'MIN_AGE', paramName: '最小申请年龄', paramValue: '18', description: '信用卡申请最小年龄限制', status: 'active' },
  { id: 2, paramCode: 'MAX_AGE', paramName: '最大申请年龄', paramValue: '65', description: '信用卡申请最大年龄限制', status: 'active' },
  { id: 3, paramCode: 'MIN_INCOME', paramName: '最低收入要求', paramValue: '3000', description: '月收入最低要求（元）', status: 'active' },
  { id: 4, paramCode: 'MAX_CREDIT_LIMIT', paramName: '最高授信额度', paramValue: '500000', description: '单卡最高授信额度', status: 'active' },
  { id: 5, paramCode: 'APPROVAL_DAYS', paramName: '审批时效', paramValue: '3', description: '审批最长时效（工作日）', status: 'active' },
  { id: 6, paramCode: 'OVERDUE_RATE', paramName: '逾期利率', paramValue: '0.0005', description: '每日逾期利率', status: 'active' }
])

const commonSearchFields = [
  { prop: 'paramName', label: '参数名称', type: 'input', placeholder: '请输入参数名称' },
  { prop: 'paramCode', label: '参数编码', type: 'input', placeholder: '请输入参数编码' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'active' },
    { label: '停用', value: 'inactive' }
  ]}
]

const commonCurrentPage = ref(1)
const commonPageSize = ref(10)
const commonSearchForm = reactive({})
commonSearchFields.forEach(field => {
  commonSearchForm[field.prop] = ''
})

const filteredCommonParams = computed(() => {
  return commonParams.value.filter(p => {
    if (commonSearchForm.paramName && !p.paramName.includes(commonSearchForm.paramName)) return false
    if (commonSearchForm.paramCode && !p.paramCode.includes(commonSearchForm.paramCode)) return false
    if (commonSearchForm.status && p.status !== commonSearchForm.status) return false
    return true
  })
})

const paginatedCommonParams = computed(() => {
  const start = (commonCurrentPage.value - 1) * commonPageSize.value
  return filteredCommonParams.value.slice(start, start + commonPageSize.value)
})

const commonDialogVisible = ref(false)
const commonDialogTitle = ref('新增参数')
const commonFormData = reactive({
  id: null,
  paramCode: '',
  paramName: '',
  paramValue: '',
  description: '',
  status: 'active'
})

const handleAddCommon = () => {
  commonDialogTitle.value = '新增参数'
  commonFormData.id = null
  commonFormData.paramCode = ''
  commonFormData.paramName = ''
  commonFormData.paramValue = ''
  commonFormData.description = ''
  commonFormData.status = 'active'
  commonDialogVisible.value = true
}

const handleEditCommon = (row) => {
  commonDialogTitle.value = '编辑参数'
  commonFormData.id = row.id
  commonFormData.paramCode = row.paramCode
  commonFormData.paramName = row.paramName
  commonFormData.paramValue = row.paramValue
  commonFormData.description = row.description
  commonFormData.status = row.status
  commonDialogVisible.value = true
}

const handleDeleteCommon = (row) => {
  commonParams.value = commonParams.value.filter(p => p.id !== row.id)
  ElMessage.success('删除成功')
}

const handleSubmitCommon = () => {
  if (commonFormData.id) {
    const index = commonParams.value.findIndex(p => p.id === commonFormData.id)
    if (index !== -1) {
      commonParams.value[index] = { ...commonFormData }
    }
    ElMessage.success('修改成功')
  } else {
    commonFormData.id = Date.now()
    commonParams.value.push({ ...commonFormData })
    ElMessage.success('新增成功')
  }
  commonDialogVisible.value = false
}

const handleSearchCommon = () => {
  commonCurrentPage.value = 1
}

const handleResetCommon = () => {
  commonCurrentPage.value = 1
}

// ==================== 表单参数管理 ====================
const formParams = ref([
  { id: 1, groupCode: 'ID_TYPE', groupName: '证件类型', options: ['身份证', '护照', '外国人永久居住证'], status: 'active' },
  { id: 2, groupCode: 'GENDER', groupName: '性别', options: ['男', '女'], status: 'active' },
  { id: 3, groupCode: 'MARITAL_STATUS', groupName: '婚姻状况', options: ['未婚', '已婚', '离异', '丧偶'], status: 'active' },
  { id: 4, groupCode: 'EDUCATION', groupName: '学历', options: ['高中及以下', '中专', '大专', '本科', '硕士', '博士'], status: 'active' },
  { id: 5, groupCode: 'CARD_TYPE', groupName: '卡片类型', options: ['金卡', '白金卡', '钻石卡', '无限卡'], status: 'active' },
  { id: 6, groupCode: 'INCOME_RANGE', groupName: '收入范围', options: ['3000以下', '3000-5000', '5000-10000', '10000-20000', '20000以上'], status: 'active' }
])

const formSearchFields = [
  { prop: 'groupCode', label: '选项组编码', type: 'input', placeholder: '请输入选项组编码' },
  { prop: 'groupName', label: '选项组名称', type: 'input', placeholder: '请输入选项组名称' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'active' },
    { label: '停用', value: 'inactive' }
  ]}
]

const formCurrentPage = ref(1)
const formPageSize = ref(10)
const formSearchForm = reactive({})
formSearchFields.forEach(field => {
  formSearchForm[field.prop] = ''
})

const filteredFormParams = computed(() => {
  return formParams.value.filter(p => {
    if (formSearchForm.groupCode && !p.groupCode.toLowerCase().includes(formSearchForm.groupCode.toLowerCase())) return false
    if (formSearchForm.groupName && !p.groupName.includes(formSearchForm.groupName)) return false
    if (formSearchForm.status && p.status !== formSearchForm.status) return false
    return true
  })
})

const paginatedFormParams = computed(() => {
  const start = (formCurrentPage.value - 1) * formPageSize.value
  return filteredFormParams.value.slice(start, start + formPageSize.value)
})

const formDialogVisible = ref(false)
const formDialogTitle = ref('新增选项组')
const formFormData = reactive({
  id: null,
  groupCode: '',
  groupName: '',
  options: [],
  status: 'active'
})

const handleAddForm = () => {
  formDialogTitle.value = '新增选项组'
  formFormData.id = null
  formFormData.groupCode = ''
  formFormData.groupName = ''
  formFormData.options = []
  formFormData.status = 'active'
  formDialogVisible.value = true
}

const handleEditForm = (row) => {
  formDialogTitle.value = '编辑选项组'
  formFormData.id = row.id
  formFormData.groupCode = row.groupCode
  formFormData.groupName = row.groupName
  formFormData.options = [...row.options]
  formFormData.status = row.status
  formDialogVisible.value = true
}

const handleDeleteForm = (row) => {
  formParams.value = formParams.value.filter(p => p.id !== row.id)
  ElMessage.success('删除成功')
}

const handleSubmitForm = () => {
  if (!formFormData.groupCode || !formFormData.groupName) {
    ElMessage.warning('请填写完整的选项组信息')
    return
  }
  if (formFormData.options.length === 0) {
    ElMessage.warning('请至少添加一个选项值')
    return
  }
  if (formFormData.id) {
    const index = formParams.value.findIndex(p => p.id === formFormData.id)
    if (index !== -1) {
      formParams.value[index] = { ...formFormData }
    }
    ElMessage.success('修改成功')
  } else {
    formFormData.id = Date.now()
    formParams.value.push({ ...formFormData })
    ElMessage.success('新增成功')
  }
  formDialogVisible.value = false
}

const handleSearchForm = () => {
  formCurrentPage.value = 1
}

const handleResetForm = () => {
  formCurrentPage.value = 1
}

const addOption = () => {
  formFormData.options.push('')
}

const removeOption = (index) => {
  if (formFormData.options.length > 1) {
    formFormData.options.splice(index, 1)
  }
}

// ==================== 汇率参数管理 ====================
const exchangeParams = ref([
  { id: 1, currencyCode: 'USD', currencyName: '美元', exchangeRate: 7.2500, baseCurrency: 'CNY', effectiveDate: '2024-01-01', status: 'active' },
  { id: 2, currencyCode: 'EUR', currencyName: '欧元', exchangeRate: 7.8500, baseCurrency: 'CNY', effectiveDate: '2024-01-01', status: 'active' },
  { id: 3, currencyCode: 'GBP', currencyName: '英镑', exchangeRate: 9.1500, baseCurrency: 'CNY', effectiveDate: '2024-01-01', status: 'active' },
  { id: 4, currencyCode: 'JPY', currencyName: '日元', exchangeRate: 0.0485, baseCurrency: 'CNY', effectiveDate: '2024-01-01', status: 'active' },
  { id: 5, currencyCode: 'HKD', currencyName: '港币', exchangeRate: 0.9200, baseCurrency: 'CNY', effectiveDate: '2024-01-01', status: 'active' }
])

const exchangeSearchFields = [
  { prop: 'currencyName', label: '货币名称', type: 'input', placeholder: '请输入货币名称' },
  { prop: 'currencyCode', label: '货币代码', type: 'input', placeholder: '请输入货币代码' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'active' },
    { label: '停用', value: 'inactive' }
  ]}
]

const exchangeCurrentPage = ref(1)
const exchangePageSize = ref(10)
const exchangeSearchForm = reactive({})
exchangeSearchFields.forEach(field => {
  exchangeSearchForm[field.prop] = ''
})

const filteredExchangeParams = computed(() => {
  return exchangeParams.value.filter(p => {
    if (exchangeSearchForm.currencyName && !p.currencyName.includes(exchangeSearchForm.currencyName)) return false
    if (exchangeSearchForm.currencyCode && !p.currencyCode.includes(exchangeSearchForm.currencyCode)) return false
    if (exchangeSearchForm.status && p.status !== exchangeSearchForm.status) return false
    return true
  })
})

const paginatedExchangeParams = computed(() => {
  const start = (exchangeCurrentPage.value - 1) * exchangePageSize.value
  return filteredExchangeParams.value.slice(start, start + exchangePageSize.value)
})

const exchangeDialogVisible = ref(false)
const exchangeDialogTitle = ref('新增汇率')
const exchangeFormData = reactive({
  id: null,
  currencyCode: '',
  currencyName: '',
  exchangeRate: 1.0000,
  baseCurrency: 'CNY',
  effectiveDate: '',
  status: 'active'
})

const handleAddExchange = () => {
  exchangeDialogTitle.value = '新增汇率'
  exchangeFormData.id = null
  exchangeFormData.currencyCode = ''
  exchangeFormData.currencyName = ''
  exchangeFormData.exchangeRate = 1.0000
  exchangeFormData.baseCurrency = 'CNY'
  exchangeFormData.effectiveDate = ''
  exchangeFormData.status = 'active'
  exchangeDialogVisible.value = true
}

const handleEditExchange = (row) => {
  exchangeDialogTitle.value = '编辑汇率'
  exchangeFormData.id = row.id
  exchangeFormData.currencyCode = row.currencyCode
  exchangeFormData.currencyName = row.currencyName
  exchangeFormData.exchangeRate = row.exchangeRate
  exchangeFormData.baseCurrency = row.baseCurrency
  exchangeFormData.effectiveDate = row.effectiveDate
  exchangeFormData.status = row.status
  exchangeDialogVisible.value = true
}

const handleDeleteExchange = (row) => {
  exchangeParams.value = exchangeParams.value.filter(p => p.id !== row.id)
  ElMessage.success('删除成功')
}

const handleSubmitExchange = () => {
  if (exchangeFormData.id) {
    const index = exchangeParams.value.findIndex(p => p.id === exchangeFormData.id)
    if (index !== -1) {
      exchangeParams.value[index] = { ...exchangeFormData }
    }
    ElMessage.success('修改成功')
  } else {
    exchangeFormData.id = Date.now()
    exchangeParams.value.push({ ...exchangeFormData })
    ElMessage.success('新增成功')
  }
  exchangeDialogVisible.value = false
}

const handleSearchExchange = () => {
  exchangeCurrentPage.value = 1
}

const handleResetExchange = () => {
  exchangeCurrentPage.value = 1
}
</script>

<style scoped>
.parameters-container {
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

.param-tabs {
  margin-top: 0;
}

.tab-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.options-editor {
  width: 100%;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.option-item .el-input {
  flex: 1;
}
</style>
