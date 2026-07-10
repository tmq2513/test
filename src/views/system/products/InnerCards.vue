<template>
  <div class="inner-cards-container">
    <el-card>
      <div class="card-header">
        <div>
          <h2>产品内卡信息维护</h2>
          <span class="category-tag">所属大类：{{ categoryName }}</span>
        </div>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedInnerCards" style="width: 100%">
        <el-table-column prop="innerCardCode" label="内卡编码" width="150" />
        <el-table-column prop="innerCardName" label="内卡编码名称" width="180" />
        <el-table-column prop="categoryCode" label="产品大类编码" width="150" />
        <el-table-column prop="categoryName" label="产品大类名称" width="180" />
        <el-table-column prop="mainSubFlag" label="主附卡标识" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.mainSubFlag === '主' ? 'primary' : 'success'" size="small">
              {{ scope.row.mainSubFlag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="photoCardFlag" label="照片卡标识" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.photoCardFlag === '不考虑'" type="info" size="small">不考虑</el-tag>
            <el-tag v-else-if="scope.row.photoCardFlag === '是'" type="success" size="small">是</el-tag>
            <el-tag v-else type="warning" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="employeeFlag" label="员工标识" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.employeeFlag === '不考虑'" type="info" size="small">不考虑</el-tag>
            <el-tag v-else-if="scope.row.employeeFlag === '是'" type="success" size="small">是</el-tag>
            <el-tag v-else type="warning" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vipFlag" label="VIP标识" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.vipFlag === '不考虑'" type="info" size="small">不考虑</el-tag>
            <el-tag v-else-if="scope.row.vipFlag === '是'" type="success" size="small">是</el-tag>
            <el-tag v-else type="warning" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="success" size="small" @click="handlePublish(scope.row)">产品发布</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredInnerCards.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="140px">
        <el-form-item label="内卡编码" required>
          <el-input v-model="formData.innerCardCode" :disabled="!!formData.id" placeholder="请输入内卡编码" />
        </el-form-item>
        <el-form-item label="内卡编码名称" required>
          <el-input v-model="formData.innerCardName" placeholder="请输入内卡编码名称" />
        </el-form-item>
        <el-form-item label="产品大类名称" required>
          <el-input v-model="formData.categoryName" placeholder="请输入产品大类名称" />
        </el-form-item>
        <el-form-item label="主附卡标识" required>
          <el-select v-model="formData.mainSubFlag" placeholder="请选择主附卡标识">
            <el-option label="主" value="主" />
            <el-option label="附" value="附" />
          </el-select>
        </el-form-item>
        <el-form-item label="照片卡标识" required>
          <el-select v-model="formData.photoCardFlag" placeholder="请选择照片卡标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工标识" required>
          <el-select v-model="formData.employeeFlag" placeholder="请选择员工标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="VIP标识" required>
          <el-select v-model="formData.vipFlag" placeholder="请选择VIP标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteConfirmVisible" title="确认删除" width="400px">
      <div class="delete-confirm-content">
        <p>确认是否删除内卡信息：<strong>{{ deleteRow.innerCardName }}</strong>？</p>
      </div>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确认删除</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="产品发布" width="1000px">
      <el-form :model="publishForm" label-width="160px">
        <el-divider content-position="left">产品图片</el-divider>
        <el-form-item label="产品图片">
          <el-upload
            v-model:file-list="publishForm.productImages"
            action="#"
            list-type="picture-card"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemoveImage"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :limit="5"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            <el-text size="small" type="info">支持jpg、png格式，文件大小不超过2MB，最多上传5张图片</el-text>
          </div>
        </el-form-item>

        <el-dialog v-model="previewVisible" title="图片预览" width="800px">
          <img :src="previewImageUrl" style="width: 100%; height: auto;" />
        </el-dialog>

        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品数字代码" required>
              <el-input v-model="publishForm.productNumCode" placeholder="请输入四位纯数字" maxlength="4" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品发布名称" required>
              <el-input v-model="publishForm.publishName" placeholder="请输入产品发布名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品内卡编码">
              <el-input v-model="publishForm.innerCardCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主附卡标识" required>
              <el-select v-model="publishForm.mainSubFlag" placeholder="请选择主附卡标识">
                <el-option label="主" value="主" />
                <el-option label="附" value="附" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="降级产品">
              <el-input v-model="publishForm.downgradeProduct" placeholder="请输入降级产品" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品品牌" required>
              <el-select v-model="publishForm.productBrand" placeholder="请选择产品品牌">
                <el-option label="银联" value="银联" />
                <el-option label="万事达" value="万事达" />
                <el-option label="VISA" value="VISA" />
                <el-option label="JCB" value="JCB" />
                <el-option label="美运" value="美运" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡片等级" required>
              <el-select v-model="publishForm.cardLevel" placeholder="请选择卡片等级">
                <el-option label="金卡" value="金卡" />
                <el-option label="普卡" value="普卡" />
                <el-option label="钛金卡" value="钛金卡" />
                <el-option label="白金卡" value="白金卡" />
                <el-option label="美运卡" value="美运卡" />
                <el-option label="无限卡" value="无限卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单编号" required>
              <el-input v-model="publishForm.formNumber" placeholder="请输入表单编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">航空历程</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航空历程兑换" required>
              <el-select v-model="publishForm.mileageExchange" placeholder="请选择航空历程兑换">
                <el-option label="支持" value="支持" />
                <el-option label="不支持" value="不支持" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航司支持">
              <el-checkbox-group v-model="publishForm.airlines" :disabled="publishForm.mileageExchange !== '支持'">
                <el-checkbox label="国航" />
                <el-checkbox label="深航" />
                <el-checkbox label="南航" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第二印花名/会员编号">
          <el-input v-model="publishForm.secondPrintName" placeholder="请输入第二印花名/会员编号" />
        </el-form-item>

        <el-divider content-position="left">产品属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品简介">
              <el-input v-model="publishForm.productDesc" type="textarea" :rows="2" placeholder="请输入产品简介" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否分行特色">
              <el-select v-model="publishForm.isBranchFeature" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标客户">
              <el-input v-model="publishForm.targetCustomer" placeholder="请输入目标客户" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否推荐">
              <el-select v-model="publishForm.isRecommended" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数字卡标识">
              <el-select v-model="publishForm.isDigitalCard" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生卡">
              <el-select v-model="publishForm.isStudentCard" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="配发实体卡">
              <el-select v-model="publishForm.issuePhysicalCard" :disabled="publishForm.isDigitalCard !== '是'" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内部卡类型">
              <el-select v-model="publishForm.internalCardType" placeholder="请选择内部卡类型">
                <el-option label="普通卡" value="普通卡" />
                <el-option label="私行卡" value="私行卡" />
                <el-option label="财富卡" value="财富卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-row>

        <el-divider content-position="left">发布渠道</el-divider>
        <el-form-item label="发布渠道">
          <el-checkbox-group v-model="publishForm.publishChannels">
            <el-checkbox label="网申" />
            <el-checkbox label="微信" />
            <el-checkbox label="智能柜台" />
            <el-checkbox label="分期" />
            <el-checkbox label="分行线下" />
          </el-checkbox-group>
        </el-form-item>

        <el-divider content-position="left">产品前检查</el-divider>
        <el-form-item label="产品前检查是否完成核心产品配置">
          <el-select v-model="publishForm.checkConfirm" placeholder="请选择">
            <el-option label="完成" value="完成" />
            <el-option label="未完成" value="未完成" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPublish">确定发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import router from '@/router'
import SearchForm from '@/components/SearchForm.vue'

const categoryName = ref('标准信用卡')

const searchFields = [
  { prop: 'innerCardCode', label: '内卡编码', type: 'input', placeholder: '请输入内卡编码' },
  { prop: 'innerCardName', label: '内卡名称', type: 'input', placeholder: '请输入内卡名称' },
  { prop: 'mainSubFlag', label: '主附卡标识', type: 'select', options: [
    { label: '主', value: '主' },
    { label: '附', value: '附' }
  ]}
]

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const innerCards = ref([
  { id: 1, innerCardCode: 'IC001', innerCardName: '标准信用卡普卡', categoryCode: 'STD001', categoryName: '标准信用卡', mainSubFlag: '主', photoCardFlag: '不考虑', employeeFlag: '不考虑', vipFlag: '否' },
  { id: 2, innerCardCode: 'IC002', innerCardName: '标准信用卡金卡', categoryCode: 'STD001', categoryName: '标准信用卡', mainSubFlag: '主', photoCardFlag: '是', employeeFlag: '是', vipFlag: '是' },
  { id: 3, innerCardCode: 'IC003', innerCardName: '标准信用卡白金卡', categoryCode: 'STD001', categoryName: '标准信用卡', mainSubFlag: '主', photoCardFlag: '是', employeeFlag: '是', vipFlag: '是' },
  { id: 4, innerCardCode: 'IC004', innerCardName: '标准信用卡附卡', categoryCode: 'STD001', categoryName: '标准信用卡', mainSubFlag: '附', photoCardFlag: '否', employeeFlag: '否', vipFlag: '否' },
  { id: 5, innerCardCode: 'IC005', innerCardName: '高端信用卡主卡', categoryCode: 'VIP001', categoryName: '高端信用卡', mainSubFlag: '主', photoCardFlag: '是', employeeFlag: '不考虑', vipFlag: '是' }
])

const dialogVisible = ref(false)
const deleteConfirmVisible = ref(false)
const publishVisible = ref(false)
const dialogTitle = ref('编辑内卡')
const currentPage = ref(1)
const pageSize = ref(10)
const deleteRow = reactive({})

const formData = reactive({
  id: null,
  innerCardCode: '',
  innerCardName: '',
  categoryCode: '',
  categoryName: '',
  mainSubFlag: '主',
  photoCardFlag: '不考虑',
  employeeFlag: '不考虑',
  vipFlag: '不考虑'
})

const publishForm = reactive({
  productNumCode: '',
  publishName: '',
  innerCardCode: '',
  mainSubFlag: '主',
  downgradeProduct: '',
  productBrand: '银联',
  cardLevel: '普卡',
  formNumber: '',
  mileageExchange: '不支持',
  airlines: [],
  secondPrintName: '',
  productDesc: '',
  isBranchFeature: '否',
  targetCustomer: '',
  isRecommended: '否',
  publishChannels: [],
  isDigitalCard: '否',
  isStudentCard: '否',
  issuePhysicalCard: '否',
  internalCardType: '普通卡',
  checkConfirm: '未完成',
  productImages: []
})

const previewVisible = ref(false)
const previewImageUrl = ref('')

const filteredInnerCards = computed(() => {
  return innerCards.value.filter(item => {
    if (searchForm.innerCardCode && !item.innerCardCode.toLowerCase().includes(searchForm.innerCardCode.toLowerCase())) {
      return false
    }
    if (searchForm.innerCardName && !item.innerCardName.toLowerCase().includes(searchForm.innerCardName.toLowerCase())) {
      return false
    }
    if (searchForm.mainSubFlag && item.mainSubFlag !== searchForm.mainSubFlag) {
      return false
    }
    return true
  })
})

const paginatedInnerCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredInnerCards.value.slice(start, end)
})

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('categoryName')) {
    categoryName.value = params.get('categoryName')
  }
  if (params.get('categoryCode')) {
    formData.categoryCode = params.get('categoryCode')
  }
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

const handleReset = () => {
  searchForm.innerCardCode = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑内卡'
  formData.id = row.id
  formData.innerCardCode = row.innerCardCode
  formData.innerCardName = row.innerCardName
  formData.categoryCode = row.categoryCode
  formData.categoryName = row.categoryName
  formData.mainSubFlag = row.mainSubFlag
  formData.photoCardFlag = row.photoCardFlag
  formData.employeeFlag = row.employeeFlag
  formData.vipFlag = row.vipFlag
  dialogVisible.value = true
}

const handleDeleteConfirm = (row) => {
  Object.assign(deleteRow, row)
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  innerCards.value = innerCards.value.filter(c => c.id !== deleteRow.id)
  deleteConfirmVisible.value = false
  ElMessage.success('删除成功')
}

const handleSubmit = () => {
  if (!formData.innerCardCode || !formData.innerCardName || !formData.categoryName) {
    ElMessage.warning('请填写必填项')
    return
  }

  const index = innerCards.value.findIndex(c => c.id === formData.id)
  if (index !== -1) {
    innerCards.value[index] = { ...formData }
    ElMessage.success('修改成功')
  }
  dialogVisible.value = false
}

const handlePublish = (row) => {
  publishForm.productNumCode = ''
  publishForm.publishName = ''
  publishForm.innerCardCode = row.innerCardCode
  publishForm.mainSubFlag = row.mainSubFlag
  publishForm.downgradeProduct = ''
  publishForm.productBrand = '银联'
  publishForm.cardLevel = '普卡'
  publishForm.formNumber = ''
  publishForm.mileageExchange = '不支持'
  publishForm.airlines = []
  publishForm.secondPrintName = ''
  publishForm.productDesc = ''
  publishForm.isBranchFeature = '否'
  publishForm.targetCustomer = ''
  publishForm.isRecommended = '否'
  publishForm.publishChannels = []
  publishForm.isDigitalCard = '否'
  publishForm.isStudentCard = '否'
  publishForm.issuePhysicalCard = '否'
  publishForm.internalCardType = '普通卡'
  publishForm.checkConfirm = '未完成'
  publishForm.productImages = []
  publishVisible.value = true
}

const handleSubmitPublish = () => {
  if (!publishForm.productNumCode) {
    ElMessage.warning('请输入产品数字代码')
    return
  }
  if (!/^\d{4}$/.test(publishForm.productNumCode)) {
    ElMessage.warning('产品数字代码必须是四位纯数字')
    return
  }
  if (!publishForm.publishName) {
    ElMessage.warning('请输入产品发布名称')
    return
  }
  if (!publishForm.productBrand) {
    ElMessage.warning('请选择产品品牌')
    return
  }
  if (!publishForm.cardLevel) {
    ElMessage.warning('请选择卡片等级')
    return
  }
  if (!publishForm.formNumber) {
    ElMessage.warning('请输入表单编号')
    return
  }
  if (!publishForm.mileageExchange) {
    ElMessage.warning('请选择航空历程兑换')
    return
  }
  ElMessage.success('产品发布成功')
  publishVisible.value = false
}

const handlePicturePreview = (file) => {
  previewImageUrl.value = file.url
  previewVisible.value = true
}

const handleRemoveImage = (file, fileList) => {
  publishForm.productImages = fileList
  ElMessage.success('图片删除成功')
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传5张图片')
}
</script>

<style scoped>
.inner-cards-container {
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

.category-tag {
  display: inline-block;
  margin-left: 10px;
  padding: 4px 12px;
  background-color: #fce4ec;
  color: #8b0000;
  border-radius: 4px;
  font-size: 12px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.delete-confirm-content {
  padding: 20px 0;
}

.delete-confirm-content p {
  font-size: 14px;
  color: #606266;
}

.upload-tip {
  margin-top: 8px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}
</style>