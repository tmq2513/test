<template>
  <div class="product-categories-container">
    <el-card>
      <div class="card-header">
        <h2>产品大类管理</h2>
        <el-button type="primary" @click="handleAdd">新增大类</el-button>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60" :index="(index) => (currentPage - 1) * pageSize + index + 1" />
        <el-table-column prop="categoryCode" label="产品大类编码" width="140" />
        <el-table-column prop="categoryName" label="产品大类名称" width="160" />
        <el-table-column prop="categoryIdentifier" label="产品大类识别码" width="140" />
        <el-table-column prop="currencyType" label="单双币标识" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.currencyType === 'single' ? 'info' : 'primary'">
              {{ scope.row.currencyType === 'single' ? '单币' : '双币' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="本币币种" width="140">
          <template #default="scope">
            {{ scope.row.localCurrency.code }}-{{ scope.row.localCurrency.name }}
          </template>
        </el-table-column>
        <el-table-column label="外币币种" width="140">
          <template #default="scope">
            {{ scope.row.foreignCurrency ? scope.row.foreignCurrency.code + '-' + scope.row.foreignCurrency.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="productLevel" label="产品等级" width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.productLevel)">{{ scope.row.productLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cardFaceCount" label="卡面数量" width="100" />
        <el-table-column prop="productType" label="产品类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.productType === 'credit' ? 'success' : 'warning'">
              {{ scope.row.productType === 'credit' ? '贷记' : '准贷记' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyType" label="产品申请种类" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.applyType === 'personal' ? 'info' : 'primary'">
              {{ scope.row.applyType === 'personal' ? '个人' : '公司' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cardType" label="申请类型" width="120">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.cardType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxSubCardCount" label="附卡最大数量" width="120" />
        <el-table-column prop="status" label="启用标识" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
              {{ scope.row.status === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="text" @click="handleCardManage(scope.row)">卡片管理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="140px">
        <el-form-item label="产品大类编码" required>
          <el-input v-model="formData.categoryCode" :disabled="!!formData.id" />
        </el-form-item>
        <el-form-item label="产品大类名称" required>
          <el-input v-model="formData.categoryName" />
        </el-form-item>
        <el-form-item label="产品大类识别码">
          <el-input v-model="formData.categoryIdentifier" />
        </el-form-item>
        <el-form-item label="单双币标识" required>
          <el-select v-model="formData.currencyType">
            <el-option label="单币" value="single" />
            <el-option label="双币" value="double" />
          </el-select>
        </el-form-item>
        <el-form-item label="本币币种" required>
          <el-select v-model="formData.localCurrencyCode">
            <el-option v-for="c in currencies" :key="c.code" :label="c.code + '-' + c.name" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="外币币种">
          <el-select v-model="formData.foreignCurrencyCode" :disabled="formData.currencyType === 'single'">
            <el-option label="无" value="" />
            <el-option v-for="c in currencies" :key="c.code" :label="c.code + '-' + c.name" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品等级" required>
          <el-select v-model="formData.productLevel">
            <el-option label="普卡" value="普卡" />
            <el-option label="金卡" value="金卡" />
            <el-option label="白金卡" value="白金卡" />
            <el-option label="钻石卡" value="钻石卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡面数量">
          <el-input-number v-model="formData.cardFaceCount" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="产品类型" required>
          <el-select v-model="formData.productType">
            <el-option label="贷记" value="credit" />
            <el-option label="准贷记" value="quasi-credit" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品申请种类" required>
          <el-select v-model="formData.applyType">
            <el-option label="个人" value="personal" />
            <el-option label="公司" value="company" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请类型" required>
          <el-select v-model="formData.cardType">
            <el-option label="主卡" value="主卡" />
            <el-option label="附属卡" value="附属卡" />
            <el-option label="主卡+附属卡" value="主卡+附属卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="附卡最大数量">
          <el-input-number v-model="formData.maxSubCardCount" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="启用标识" required>
          <el-select v-model="formData.status">
            <el-option label="启用" value="enabled" />
            <el-option label="停用" value="disabled" />
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
        <p>确认是否删除产品大类：<strong>{{ deleteRow.categoryName }}</strong>？</p>
      </div>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确认删除</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="cardManageVisible" :title="`卡片管理`" width="500px">
      <div class="card-manage-content">
        <div class="card-manage-header">
          <el-tag type="primary" size="large">{{ cardManageRow.categoryName }}</el-tag>
          <el-tag size="medium">编码：{{ cardManageRow.categoryCode }}</el-tag>
        </div>

        <div class="card-manage-title">请选择操作：</div>

        <div class="card-manage-options">
          <div class="card-option-card" @click="goToInnerCards">
            <div class="card-option-icon">
              <el-icon size="40"><CreditCard /></el-icon>
            </div>
            <div class="card-option-info">
              <div class="card-option-title">内卡信息管理</div>
              <div class="card-option-desc">管理产品的内部属性，包括主附卡标识、照片卡标识等业务参数</div>
            </div>
            <el-icon class="card-option-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="card-option-card" @click="goToOuterCards">
            <div class="card-option-icon outer-icon">
              <el-icon size="40"><Picture /></el-icon>
            </div>
            <div class="card-option-info">
              <div class="card-option-title">外卡信息管理</div>
              <div class="card-option-desc">管理卡片的物理特性，包括卡面设计、材质、颜色、功能支持等</div>
            </div>
            <el-icon class="card-option-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="card-option-card add-option" @click="handleAddInnerCard">
            <div class="card-option-icon add-icon">
              <el-icon size="40"><Plus /></el-icon>
            </div>
            <div class="card-option-info">
              <div class="card-option-title">新增内卡信息</div>
              <div class="card-option-desc">快速新增一条内卡信息，关联当前产品大类</div>
            </div>
            <el-icon class="card-option-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="card-option-card add-option" @click="handleAddOuterCard">
            <div class="card-option-icon add-icon outer-add">
              <el-icon size="40"><Plus /></el-icon>
            </div>
            <div class="card-option-info">
              <div class="card-option-title">新增外卡信息</div>
              <div class="card-option-desc">快速新增一条外卡信息，关联当前产品大类</div>
            </div>
            <el-icon class="card-option-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="cardManageVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="addInnerCardVisible" title="新增内卡信息" width="700px">
      <el-form :model="addInnerCardForm" label-width="140px">
        <el-form-item label="内卡编码" required>
          <el-input v-model="addInnerCardForm.innerCardCode" placeholder="请输入内卡编码" />
        </el-form-item>
        <el-form-item label="内卡编码名称" required>
          <el-input v-model="addInnerCardForm.innerCardName" placeholder="请输入内卡编码名称" />
        </el-form-item>
        <el-form-item label="产品大类编码">
          <el-input v-model="addInnerCardForm.categoryCode" disabled />
        </el-form-item>
        <el-form-item label="产品大类名称">
          <el-input v-model="addInnerCardForm.categoryName" disabled />
        </el-form-item>
        <el-form-item label="主附卡标识" required>
          <el-select v-model="addInnerCardForm.mainSubFlag" placeholder="请选择主附卡标识">
            <el-option label="主" value="主" />
            <el-option label="附" value="附" />
          </el-select>
        </el-form-item>
        <el-form-item label="照片卡标识" required>
          <el-select v-model="addInnerCardForm.photoCardFlag" placeholder="请选择照片卡标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工标识" required>
          <el-select v-model="addInnerCardForm.employeeFlag" placeholder="请选择员工标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="VIP标识" required>
          <el-select v-model="addInnerCardForm.vipFlag" placeholder="请选择VIP标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>

        <el-divider v-if="addInnerCardForm.mainSubFlag === '主'" content-position="left">附卡信息（可选）</el-divider>

        <el-form-item v-if="addInnerCardForm.mainSubFlag === '主'" label="同时添加附卡">
          <el-switch v-model="addInnerCardForm.addSubCard" />
        </el-form-item>

        <template v-if="addInnerCardForm.mainSubFlag === '主' && addInnerCardForm.addSubCard">
          <el-form-item label="附卡编码" required>
            <el-input v-model="addInnerCardForm.subCardCode" placeholder="请输入附卡编码" />
          </el-form-item>
          <el-form-item label="附卡编码名称" required>
            <el-input v-model="addInnerCardForm.subCardName" placeholder="请输入附卡编码名称" />
          </el-form-item>
          <el-form-item label="附卡照片卡标识" required>
            <el-select v-model="addInnerCardForm.subPhotoCardFlag" placeholder="请选择照片卡标识">
              <el-option label="不考虑" value="不考虑" />
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="附卡员工标识" required>
            <el-select v-model="addInnerCardForm.subEmployeeFlag" placeholder="请选择员工标识">
              <el-option label="不考虑" value="不考虑" />
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="附卡VIP标识" required>
            <el-select v-model="addInnerCardForm.subVipFlag" placeholder="请选择VIP标识">
              <el-option label="不考虑" value="不考虑" />
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="addInnerCardVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitInnerCard">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="addOuterCardVisible" title="新增外卡信息" width="700px">
      <el-form :model="addOuterCardForm" label-width="140px">
        <el-form-item label="外卡编码" required>
          <el-input v-model="addOuterCardForm.outerCardCode" placeholder="请输入外卡编码" />
        </el-form-item>
        <el-form-item label="外卡名称" required>
          <el-input v-model="addOuterCardForm.outerCardName" placeholder="请输入外卡名称" />
        </el-form-item>
        <el-form-item label="产品大类编码">
          <el-input v-model="addOuterCardForm.categoryCode" disabled />
        </el-form-item>
        <el-form-item label="产品大类名称">
          <el-input v-model="addOuterCardForm.categoryName" disabled />
        </el-form-item>
        <el-form-item label="照片卡标识" required>
          <el-select v-model="addOuterCardForm.photoCardFlag" placeholder="请选择照片卡标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工标识" required>
          <el-select v-model="addOuterCardForm.employeeFlag" placeholder="请选择员工标识">
            <el-option label="不考虑" value="不考虑" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡面标识" required>
          <el-select v-model="addOuterCardForm.cardFaceFlag" placeholder="请选择卡面标识">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="PN码" required>
          <el-input v-model="addOuterCardForm.pnCode" placeholder="请输入PN码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOuterCardVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitOuterCard">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CreditCard, Picture, ArrowRight, Plus } from '@element-plus/icons-vue'
import router from '@/router'
import SearchForm from '@/components/SearchForm.vue'

const currencies = ref([
  { code: 'CNY', name: '人民币' },
  { code: 'USD', name: '美元' },
  { code: 'EUR', name: '欧元' },
  { code: 'JPY', name: '日元' },
  { code: 'GBP', name: '英镑' },
  { code: 'HKD', name: '港币' }
])

const categories = ref([
  { id: 1, categoryCode: 'STD', categoryName: '标准信用卡', categoryIdentifier: 'STD001', currencyType: 'single', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: null, productLevel: '普卡', cardFaceCount: 2, productType: 'credit', applyType: 'personal', cardType: '主卡+附属卡', maxSubCardCount: 3, status: 'enabled' },
  { id: 2, categoryCode: 'STD-G', categoryName: '标准金卡', categoryIdentifier: 'STD002', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'USD', name: '美元' }, productLevel: '金卡', cardFaceCount: 3, productType: 'credit', applyType: 'personal', cardType: '主卡+附属卡', maxSubCardCount: 3, status: 'enabled' },
  { id: 3, categoryCode: 'PRE', categoryName: '白金信用卡', categoryIdentifier: 'PRE001', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'USD', name: '美元' }, productLevel: '白金卡', cardFaceCount: 4, productType: 'credit', applyType: 'personal', cardType: '主卡+附属卡', maxSubCardCount: 5, status: 'enabled' },
  { id: 4, categoryCode: 'PRE-D', categoryName: '钻石信用卡', categoryIdentifier: 'PRE002', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'EUR', name: '欧元' }, productLevel: '钻石卡', cardFaceCount: 2, productType: 'credit', applyType: 'personal', cardType: '主卡', maxSubCardCount: 0, status: 'enabled' },
  { id: 5, categoryCode: 'COB', categoryName: '联名信用卡', categoryIdentifier: 'COB001', currencyType: 'single', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: null, productLevel: '金卡', cardFaceCount: 5, productType: 'credit', applyType: 'personal', cardType: '主卡+附属卡', maxSubCardCount: 3, status: 'enabled' },
  { id: 6, categoryCode: 'BUS', categoryName: '商务信用卡', categoryIdentifier: 'BUS001', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'USD', name: '美元' }, productLevel: '金卡', cardFaceCount: 2, productType: 'credit', applyType: 'company', cardType: '主卡', maxSubCardCount: 0, status: 'disabled' },
  { id: 7, categoryCode: 'STU', categoryName: '学生信用卡', categoryIdentifier: 'STU001', currencyType: 'single', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: null, productLevel: '普卡', cardFaceCount: 1, productType: 'quasi-credit', applyType: 'personal', cardType: '主卡', maxSubCardCount: 0, status: 'enabled' },
  { id: 8, categoryCode: 'VIP', categoryName: '贵宾信用卡', categoryIdentifier: 'VIP001', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'GBP', name: '英镑' }, productLevel: '钻石卡', cardFaceCount: 1, productType: 'credit', applyType: 'personal', cardType: '主卡', maxSubCardCount: 0, status: 'enabled' },
  { id: 9, categoryCode: 'CORP', categoryName: '企业信用卡', categoryIdentifier: 'CORP001', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'USD', name: '美元' }, productLevel: '白金卡', cardFaceCount: 2, productType: 'credit', applyType: 'company', cardType: '主卡', maxSubCardCount: 2, status: 'enabled' },
  { id: 10, categoryCode: 'JUNIOR', categoryName: '青年信用卡', categoryIdentifier: 'JUN001', currencyType: 'single', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: null, productLevel: '普卡', cardFaceCount: 3, productType: 'quasi-credit', applyType: 'personal', cardType: '主卡', maxSubCardCount: 0, status: 'disabled' },
  { id: 11, categoryCode: 'GOLD', categoryName: '黄金信用卡', categoryIdentifier: 'GLD001', currencyType: 'double', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: { code: 'EUR', name: '欧元' }, productLevel: '金卡', cardFaceCount: 2, productType: 'credit', applyType: 'personal', cardType: '主卡+附属卡', maxSubCardCount: 2, status: 'enabled' },
  { id: 12, categoryCode: 'SILVER', categoryName: '白银信用卡', categoryIdentifier: 'SLV001', currencyType: 'single', localCurrency: { code: 'CNY', name: '人民币' }, foreignCurrency: null, productLevel: '普卡', cardFaceCount: 1, productType: 'credit', applyType: 'personal', cardType: '主卡', maxSubCardCount: 1, status: 'enabled' }
])

const searchFields = [
  { prop: 'categoryName', label: '产品大类名称', type: 'input', placeholder: '请输入产品大类名称' },
  { prop: 'status', label: '产品状态', type: 'select', options: [
    { label: '启用', value: 'enabled' },
    { label: '停用', value: 'disabled' }
  ]}
]

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const filteredData = computed(() => {
  return categories.value.filter(item => {
    const matchName = !searchForm.categoryName || item.categoryName.toLowerCase().includes(searchForm.categoryName.toLowerCase())
    const matchStatus = !searchForm.status || item.status === searchForm.status
    return matchName && matchStatus
  })
})

const total = computed(() => filteredData.value.length)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增大类')
const formData = reactive({
  id: null,
  categoryCode: '',
  categoryName: '',
  categoryIdentifier: '',
  currencyType: 'single',
  localCurrencyCode: 'CNY',
  foreignCurrencyCode: '',
  productLevel: '普卡',
  cardFaceCount: 1,
  productType: 'credit',
  applyType: 'personal',
  cardType: '主卡',
  maxSubCardCount: 0,
  status: 'enabled'
})

const deleteConfirmVisible = ref(false)
const deleteRow = reactive({
  id: null,
  categoryName: ''
})

const cardManageVisible = ref(false)
const cardManageRow = reactive({
  id: null,
  categoryCode: '',
  categoryName: ''
})

const addInnerCardVisible = ref(false)
const addInnerCardForm = reactive({
  innerCardCode: '',
  innerCardName: '',
  categoryCode: '',
  categoryName: '',
  mainSubFlag: '主',
  photoCardFlag: '不考虑',
  employeeFlag: '不考虑',
  vipFlag: '不考虑',
  addSubCard: false,
  subCardCode: '',
  subCardName: '',
  subPhotoCardFlag: '不考虑',
  subEmployeeFlag: '不考虑',
  subVipFlag: '不考虑'
})

const addOuterCardVisible = ref(false)
const addOuterCardForm = reactive({
  outerCardCode: '',
  outerCardName: '',
  categoryCode: '',
  categoryName: '',
  photoCardFlag: '不考虑',
  employeeFlag: '不考虑',
  cardFaceFlag: '是',
  pnCode: ''
})

watch(() => formData.currencyType, (val) => {
  if (val === 'single') {
    formData.foreignCurrencyCode = ''
  }
})

const getLevelType = (level) => {
  const types = { '普卡': 'info', '金卡': 'warning', '白金卡': 'primary', '钻石卡': 'success' }
  return types[level] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.categoryName = ''
  searchForm.status = ''
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleAdd = () => {
  dialogTitle.value = '新增大类'
  formData.id = null
  formData.categoryCode = ''
  formData.categoryName = ''
  formData.categoryIdentifier = ''
  formData.currencyType = 'single'
  formData.localCurrencyCode = 'CNY'
  formData.foreignCurrencyCode = ''
  formData.productLevel = '普卡'
  formData.cardFaceCount = 1
  formData.productType = 'credit'
  formData.applyType = 'personal'
  formData.cardType = '主卡'
  formData.maxSubCardCount = 0
  formData.status = 'enabled'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑大类'
  formData.id = row.id
  formData.categoryCode = row.categoryCode
  formData.categoryName = row.categoryName
  formData.categoryIdentifier = row.categoryIdentifier
  formData.currencyType = row.currencyType
  formData.localCurrencyCode = row.localCurrency.code
  formData.foreignCurrencyCode = row.foreignCurrency ? row.foreignCurrency.code : ''
  formData.productLevel = row.productLevel
  formData.cardFaceCount = row.cardFaceCount
  formData.productType = row.productType
  formData.applyType = row.applyType
  formData.cardType = row.cardType
  formData.maxSubCardCount = row.maxSubCardCount
  formData.status = row.status
  dialogVisible.value = true
}

const handleDeleteConfirm = (row) => {
  deleteRow.id = row.id
  deleteRow.categoryName = row.categoryName
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  categories.value = categories.value.filter(c => c.id !== deleteRow.id)
  if (paginatedData.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
  deleteConfirmVisible.value = false
  ElMessage.success('删除成功')
}

const handleCardManage = (row) => {
  cardManageRow.id = row.id
  cardManageRow.categoryCode = row.categoryCode
  cardManageRow.categoryName = row.categoryName
  cardManageVisible.value = true
}

const goToInnerCards = () => {
  cardManageVisible.value = false
  router.push(`/system/products/inner-cards?categoryCode=${cardManageRow.categoryCode}&categoryName=${cardManageRow.categoryName}`)
}

const goToOuterCards = () => {
  cardManageVisible.value = false
  router.push(`/system/products/outer-cards?categoryCode=${cardManageRow.categoryCode}&categoryName=${cardManageRow.categoryName}`)
}

const handleAddInnerCard = () => {
  cardManageVisible.value = false
  addInnerCardForm.innerCardCode = ''
  addInnerCardForm.innerCardName = ''
  addInnerCardForm.categoryCode = cardManageRow.categoryCode
  addInnerCardForm.categoryName = cardManageRow.categoryName
  addInnerCardForm.mainSubFlag = '主'
  addInnerCardForm.photoCardFlag = '不考虑'
  addInnerCardForm.employeeFlag = '不考虑'
  addInnerCardForm.vipFlag = '不考虑'
  addInnerCardForm.addSubCard = false
  addInnerCardForm.subCardCode = ''
  addInnerCardForm.subCardName = ''
  addInnerCardForm.subPhotoCardFlag = '不考虑'
  addInnerCardForm.subEmployeeFlag = '不考虑'
  addInnerCardForm.subVipFlag = '不考虑'
  addInnerCardVisible.value = true
}

const handleAddOuterCard = () => {
  cardManageVisible.value = false
  addOuterCardForm.outerCardCode = ''
  addOuterCardForm.outerCardName = ''
  addOuterCardForm.categoryCode = cardManageRow.categoryCode
  addOuterCardForm.categoryName = cardManageRow.categoryName
  addOuterCardForm.photoCardFlag = '不考虑'
  addOuterCardForm.employeeFlag = '不考虑'
  addOuterCardForm.cardFaceFlag = '是'
  addOuterCardForm.pnCode = ''
  addOuterCardVisible.value = true
}

const handleSubmitInnerCard = () => {
  if (!addInnerCardForm.innerCardCode || !addInnerCardForm.innerCardName) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (addInnerCardForm.addSubCard) {
    if (!addInnerCardForm.subCardCode || !addInnerCardForm.subCardName) {
      ElMessage.warning('请填写附卡必填项')
      return
    }
  }

  addInnerCardVisible.value = false
  if (addInnerCardForm.addSubCard) {
    ElMessage.success('新增主卡和附卡信息成功')
  } else {
    ElMessage.success('新增内卡信息成功')
  }
}

const handleSubmitOuterCard = () => {
  if (!addOuterCardForm.outerCardCode || !addOuterCardForm.outerCardName || !addOuterCardForm.pnCode) {
    ElMessage.warning('请填写必填项')
    return
  }
  addOuterCardVisible.value = false
  ElMessage.success('新增外卡信息成功')
}

const getCurrencyByName = (code) => {
  return currencies.value.find(c => c.code === code) || { code, name: code }
}

const handleSubmit = () => {
  if (!formData.categoryCode || !formData.categoryName) {
    ElMessage.warning('请填写必填项')
    return
  }
  const localCurrency = getCurrencyByName(formData.localCurrencyCode)
  const foreignCurrency = formData.foreignCurrencyCode ? getCurrencyByName(formData.foreignCurrencyCode) : null
  
  if (formData.id) {
    const index = categories.value.findIndex(c => c.id === formData.id)
    if (index !== -1) {
      categories.value[index] = {
        ...formData,
        localCurrency,
        foreignCurrency
      }
    }
    ElMessage.success('修改成功')
  } else {
    categories.value.push({
      ...formData,
      id: Date.now(),
      localCurrency,
      foreignCurrency
    })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.product-categories-container {
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

.search-form {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 8px;
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

.card-manage-content {
  padding: 20px 0;
}

.card-manage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.card-manage-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
  font-weight: 500;
}

.card-manage-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-option-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-option-card:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #e6f7ff 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.card-option-card:active {
  transform: translateX(2px);
}

.card-option-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 20px;
  flex-shrink: 0;
}

.card-option-icon.outer-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.card-option-info {
  flex: 1;
  min-width: 0;
}

.card-option-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.card-option-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-option-arrow {
  color: #c0c4cc;
  font-size: 20px;
  margin-left: 12px;
  transition: all 0.3s ease;
}

.card-option-card:hover .card-option-arrow {
  color: #409eff;
  transform: translateX(4px);
}

.card-option-card.add-option {
  background: linear-gradient(135deg, #f0fff4 0%, #e6fffb 100%);
  border-style: dashed;
  border-width: 2px;
  border-color: #a8d8ea;
}

.card-option-card.add-option:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #e6f7ff 100%);
}

.card-option-icon.add-icon {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.card-option-icon.add-icon.outer-add {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}
</style>
