<template>
  <div class="entry-transfer">
    <el-card>
      <template #header>
        <span>录入调件</span>
      </template>
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="申请件编号">
          <el-input v-model="searchForm.applicationId" placeholder="请输入申请件编号" clearable />
        </el-form-item>
        <el-form-item label="客户证件类型">
          <el-select v-model="searchForm.documentType" placeholder="请选择证件类型" clearable>
            <el-option label="身份证" value="身份证" />
            <el-option label="营业执照" value="营业执照" />
            <el-option label="护照" value="护照" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户证件号码">
          <el-input v-model="searchForm.documentNumber" placeholder="请输入证件号码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="applicationId" label="申请件编号" />
        <el-table-column prop="formNumber" label="表单编号" />
        <el-table-column prop="applicationType" label="申请类型" />
        <el-table-column prop="documentType" label="客户证件类型" />
        <el-table-column prop="documentNumber" label="客户证件号码">
          <template #default="{ row }">{{ maskDocumentNumber(row.documentNumber) }}</template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="organization" label="所属机构" />
        <el-table-column prop="scanDate" label="扫描日期" />
        <el-table-column prop="scanOperator" label="扫描人员编号" />
        <el-table-column prop="channel" label="渠道" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="handleEntry(row)">录入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <el-dialog v-model="entryDialogVisible" title="录入" width="600px" :close-on-click-modal="false">
      <el-form :model="entryForm" label-width="120px">
        <el-form-item label="申请件编号">
          <el-input v-model="entryForm.applicationId" disabled />
        </el-form-item>
        <el-form-item v-if="entryForm.applicationType === '主'" label="主卡产品">
          <div class="product-selection">
            <el-input v-model="entryForm.mainProductName" disabled placeholder="请选择产品" />
            <el-button type="primary" @click="openProductDialog('主')">选择产品</el-button>
          </div>
          <div v-if="entryForm.mainProduct" class="product-info">
            <span>产品类型: {{ entryForm.mainProduct.productType }}</span>
            <span>产品卡面: {{ entryForm.mainProduct.cardFace }}</span>
          </div>
        </el-form-item>
        <el-form-item v-if="entryForm.applicationType === '附'" label="附卡产品">
          <div class="product-selection">
            <el-input v-model="entryForm.supplementaryProductName" disabled placeholder="请选择产品" />
            <el-button type="primary" @click="openProductDialog('附')">选择产品</el-button>
          </div>
          <div v-if="entryForm.supplementaryProduct" class="product-info">
            <span>产品类型: {{ entryForm.supplementaryProduct.productType }}</span>
            <span>产品卡面: {{ entryForm.supplementaryProduct.cardFace }}</span>
          </div>
        </el-form-item>
        <el-form-item v-if="entryForm.applicationType === '主附'" label="主卡产品">
          <div class="product-selection">
            <el-input v-model="entryForm.mainProductName" disabled placeholder="请选择主卡产品" />
            <el-button type="primary" @click="openProductDialog('主')">选择主卡</el-button>
          </div>
          <div v-if="entryForm.mainProduct" class="product-info">
            <span>产品类型: {{ entryForm.mainProduct.productType }}</span>
            <span>产品卡面: {{ entryForm.mainProduct.cardFace }}</span>
          </div>
        </el-form-item>
        <el-form-item v-if="entryForm.applicationType === '主附'" label="附卡产品">
          <div class="product-selection">
            <el-input v-model="entryForm.supplementaryProductName" disabled placeholder="请选择附卡产品" />
            <el-button type="primary" @click="openProductDialog('附')">选择附卡</el-button>
          </div>
          <div v-if="entryForm.supplementaryProduct" class="product-info">
            <span>产品类型: {{ entryForm.supplementaryProduct.productType }}</span>
            <span>产品卡面: {{ entryForm.supplementaryProduct.cardFace }}</span>
          </div>
        </el-form-item>
        <el-form-item label="申请类型">
          <el-select v-model="entryForm.applicationType" @change="handleApplicationTypeChange">
            <el-option label="主" value="主" />
            <el-option label="附" value="附" />
            <el-option label="主附" value="主附" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="entryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEntry">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="productDialogVisible" :title="productDialogTitle" width="700px" append-to-body>
      <el-form :model="productSearchForm" inline class="product-search-form">
        <el-form-item label="产品数字代码">
          <el-input v-model="productSearchForm.productCode" placeholder="请输入产品代码" clearable @input="loadProductList" />
        </el-form-item>
        <el-form-item label="产品发布名称">
          <el-input v-model="productSearchForm.productName" placeholder="请输入产品名称" clearable @input="loadProductList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadProductList">查询</el-button>
          <el-button @click="resetProductSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="productList" border>
        <el-table-column prop="productCode" label="产品数字代码" />
        <el-table-column prop="productName" label="产品发布名称" />
        <el-table-column prop="innerCardCode" label="产品内卡编码" />
        <el-table-column prop="cardFlag" label="主附卡标识" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="selectProduct(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="productDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'

const router = useRouter()

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  applicationId: '',
  documentType: '',
  documentNumber: ''
})

const entryDialogVisible = ref(false)
const productDialogVisible = ref(false)
const productDialogTitle = ref('产品选择')
const productList = ref([])
const currentFormNumber = ref('')
const currentSelectMode = ref('主')

const productSearchForm = reactive({
  productCode: '',
  productName: ''
})

const entryForm = reactive({
  applicationId: '',
  applicationType: '',
  mainProductName: '',
  mainProduct: null,
  supplementaryProductName: '',
  supplementaryProduct: null
})

const maskDocumentNumber = (number) => {
  if (!number) return ''
  if (number.length === 18) {
    return number.substring(0, 4) + '**********' + number.substring(14)
  }
  if (number.length > 8) {
    return number.substring(0, 4) + '****' + number.substring(number.length - 4)
  }
  return number
}

const loadData = async () => {
  const params = { 
    page: currentPage.value - 1, 
    size: pageSize.value,
    applicationId: searchForm.applicationId,
    documentType: searchForm.documentType,
    documentNumber: searchForm.documentNumber
  }
  const res = await api.entryTransfer.list(params)
  if (res.code === 200) {
    tableData.value = res.data.content || []
    total.value = res.data.totalElements || 0
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.applicationId = ''
  searchForm.documentType = ''
  searchForm.documentNumber = ''
  currentPage.value = 1
  loadData()
}

const handleEntry = (row) => {
  if (row.channel === '集中录入') {
    router.push({
      path: '/entry/transfer/form',
      query: {
        applicationId: row.applicationId,
        applicationType: row.applicationType,
        channel: row.channel
      }
    })
    return
  }
  currentFormNumber.value = row.formNumber
  entryForm.applicationId = row.applicationId
  entryForm.applicationType = row.applicationType
  entryForm.mainProductName = ''
  entryForm.mainProduct = null
  entryForm.supplementaryProductName = ''
  entryForm.supplementaryProduct = null
  entryDialogVisible.value = true
}

const handleApplicationTypeChange = () => {
  entryForm.mainProductName = ''
  entryForm.mainProduct = null
  entryForm.supplementaryProductName = ''
  entryForm.supplementaryProduct = null
}

const openProductDialog = async (mode) => {
  currentSelectMode.value = mode
  if (currentFormNumber.value === 'DWG1B') {
    productDialogTitle.value = mode === '主' ? '公司卡主卡产品选择' : '公司卡附卡产品选择'
  } else {
    productDialogTitle.value = mode === '主' ? '个人卡主卡产品选择' : '个人卡附卡产品选择'
  }
  productSearchForm.productCode = ''
  productSearchForm.productName = ''
  await loadProductList()
  productDialogVisible.value = true
}

const loadProductList = async () => {
  const params = {
    cardFlag: currentSelectMode.value,
    productCode: productSearchForm.productCode,
    productName: productSearchForm.productName
  }
  let res
  if (currentFormNumber.value === 'DWG1B') {
    res = await api.products.company(params)
  } else {
    res = await api.products.personal(params)
  }
  if (res.code === 200) {
    productList.value = res.data || []
  }
}

const resetProductSearch = () => {
  productSearchForm.productCode = ''
  productSearchForm.productName = ''
  loadProductList()
}

const selectProduct = (product) => {
  if (currentSelectMode.value === '主') {
    entryForm.mainProductName = `${product.productCode} - ${product.productName}`
    entryForm.mainProduct = product
  } else {
    entryForm.supplementaryProductName = `${product.productCode} - ${product.productName}`
    entryForm.supplementaryProduct = product
  }
  productDialogVisible.value = false
}

const confirmEntry = () => {
  if (entryForm.applicationType === '主' && !entryForm.mainProduct) {
    ElMessage.warning('请选择主卡产品')
    return
  }
  if (entryForm.applicationType === '附' && !entryForm.supplementaryProduct) {
    ElMessage.warning('请选择附卡产品')
    return
  }
  if (entryForm.applicationType === '主附') {
    if (!entryForm.mainProduct) {
      ElMessage.warning('请选择主卡产品')
      return
    }
    if (!entryForm.supplementaryProduct) {
      ElMessage.warning('请选择附卡产品')
      return
    }
    const mainCode = parseInt(entryForm.mainProduct.productCode)
    const supplementaryCode = parseInt(entryForm.supplementaryProduct.productCode)
    if (mainCode + 1 !== supplementaryCode) {
      ElMessage.warning('主卡产品和附卡产品必须为同一产品系列')
      return
    }
  }
  entryDialogVisible.value = false
  const product = entryForm.mainProduct || entryForm.supplementaryProduct
  router.push({
    path: '/entry/transfer/form',
    query: {
      applicationType: entryForm.applicationType,
      applicationId: entryForm.applicationId,
      productCode: product.productCode,
      productName: product.productName
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.entry-transfer { padding: 20px; }
.search-form { margin-bottom: 20px; }
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.product-selection {
  display: flex;
  align-items: center;
  gap: 10px;
}
.product-selection .el-input { flex: 1; max-width: 200px; }
.product-info {
  display: flex;
  gap: 20px;
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
}
.product-search-form { margin-bottom: 16px; }
</style>