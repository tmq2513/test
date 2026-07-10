<template>
  <div class="rescan-container">
    <el-card>
      <div class="card-header">
        <h3>个人退件补扫队列</h3>
      </div>
      <div class="card-body">
        <el-form :model="searchForm" inline>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请件编号">
                <el-input v-model="searchForm.applicationNo" placeholder="请输入申请件编号" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退补状态">
                <el-select v-model="searchForm.status" placeholder="请选择退补状态" style="width: 150px">
                  <el-option label="待领取" value="待领取" />
                  <el-option label="补件中" value="补件中" />
                  <el-option label="补件完成" value="补件完成" />
                  <el-option label="补件超时" value="补件超时" />
                  <el-option label="取消补件" value="取消补件" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="filteredList" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="applicationNo" label="申请件编号" width="160" />
          <el-table-column prop="returnSubject" label="退件主体" width="100">
            <template #default="{ row }">
              <el-tag :type="getSubjectTagType(row.returnSubject)">{{ row.returnSubject }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="supplementAgency" label="补件机构" width="120" />
          <el-table-column prop="deadlineTime" label="补件截止时间" width="180" />
          <el-table-column prop="status" label="退补状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="handler" label="处理人" width="100" />
          <el-table-column prop="returnTime" label="退件时间" width="180" />
          <el-table-column prop="returnOperatorNo" label="退件人编号" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <template v-if="row.status === '待领取'">
                <el-button type="primary" size="small" @click="handleReceive(row)">领取</el-button>
              </template>
              <template v-else-if="row.status === '补件中'">
                <el-button type="warning" size="small" @click="handleCancel(row)">取消</el-button>
                <el-button type="success" size="small" @click="openSupplementDialog(row)">补件</el-button>
              </template>
              <template v-else-if="row.status === '补件完成' || row.status === '补件超时' || row.status === '取消补件'">
                <el-button type="info" size="small" @click="handleView(row)">调阅</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="fullFilteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; text-align: right"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="supplementDialogVisible"
      title="补件信息"
      width="1000px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-scrollbar max-height="600px">
        <el-form :model="supplementForm" label-width="120px">
          <el-divider content-position="left">申请件信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请件编号">
                <el-input v-model="supplementForm.applicationInfo.applicationNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请产品">
                <el-input v-model="supplementForm.applicationInfo.product" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请类型">
                <el-input v-model="supplementForm.applicationInfo.applicationType" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="所属机构编号">
                <el-input v-model="supplementForm.applicationInfo.agencyNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属机构">
                <el-input v-model="supplementForm.applicationInfo.agency" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请渠道">
                <el-input v-model="supplementForm.applicationInfo.channel" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">客户信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户姓名">
                <el-input v-model="supplementForm.customerInfo.name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户类型">
                <el-input v-model="supplementForm.customerInfo.type" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户证件类型">
                <el-input v-model="supplementForm.customerInfo.idType" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户证件号码">
                <el-input v-model="supplementForm.customerInfo.idNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="核心客户号">
                <el-input v-model="supplementForm.customerInfo.coreCustomerNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作单位名称">
                <el-input v-model="supplementForm.customerInfo.workUnit" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left" v-if="supplementForm.applicationInfo.applicationType === '附' || supplementForm.applicationInfo.applicationType === '主附'">附属卡信息</el-divider>
          <template v-if="supplementForm.applicationInfo.applicationType === '附' || supplementForm.applicationInfo.applicationType === '主附'">
            <el-table :data="supplementForm.supplementaryCards" border size="small" max-height="200">
              <el-table-column prop="applicationNo" label="申请件编号" width="160" />
              <el-table-column prop="name" label="客户姓名" width="120" />
              <el-table-column prop="idNo" label="客户证件号码" width="180" />
              <el-table-column prop="product" label="申请产品" />
            </el-table>
          </template>

          <el-divider content-position="left">补件详情信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="补件主体">
                <el-input v-model="supplementForm.supplementDetail.returnSubject" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="补扫影像类型">
                <el-input v-model="supplementForm.supplementDetail.scanImageType" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="补件机构">
                <el-input v-model="supplementForm.supplementDetail.supplementAgency" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="补件领取机构">
                <el-input v-model="supplementForm.supplementDetail.receiveAgency" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退件发起人">
                <el-input v-model="supplementForm.supplementDetail.returnInitiator" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退件时间">
                <el-input v-model="supplementForm.supplementDetail.returnTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="退件原因">
                <el-input v-model="supplementForm.supplementDetail.returnReason" type="textarea" :rows="2" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="补件截止日期">
                <el-date-picker
                  v-model="supplementForm.supplementDetail.deadlineDate"
                  type="datetime"
                  placeholder="选择截止日期"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="supplementForm.supplementDetail.remark" type="textarea" :rows="3" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="supplementDialogVisible = false">关闭</el-button>
        <el-button type="warning" @click="handleCancelSupplement">取消补件</el-button>
        <el-button type="success" @click="handleSaveSupplement">保存</el-button>
        <el-button type="primary" @click="handleGoScan">补扫</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const currentPage = ref(1)
const pageSize = ref(10)
const supplementDialogVisible = ref(false)
const currentRow = ref(null)

const searchForm = reactive({
  applicationNo: '',
  status: ''
})

const supplementForm = reactive({
  applicationInfo: {
    applicationNo: '',
    product: '',
    applicationType: '',
    agencyNo: '',
    agency: '',
    channel: ''
  },
  customerInfo: {
    name: '',
    type: '',
    idType: '',
    idNo: '',
    coreCustomerNo: '',
    workUnit: ''
  },
  supplementaryCards: [],
  supplementDetail: {
    returnSubject: '',
    scanImageType: '',
    supplementAgency: '',
    receiveAgency: '',
    returnInitiator: '',
    returnTime: '',
    returnReason: '',
    deadlineDate: '',
    remark: ''
  }
})

const rescanList = ref([
  {
    applicationNo: '1234567890123456',
    returnSubject: '主',
    supplementAgency: '北京分行',
    deadlineTime: '2024-01-25 17:00:00',
    status: '待领取',
    handler: '',
    returnTime: '2024-01-20 10:30:00',
    returnOperatorNo: 'OP001',
    applicationInfo: {
      applicationNo: '1234567890123456',
      product: '贷记个人卡',
      applicationType: '主',
      agencyNo: '001',
      agency: '北京分行',
      channel: '网申'
    },
    customerInfo: {
      name: '张三',
      type: '新客户',
      idType: '中国居民身份证',
      idNo: '110101199001011234',
      coreCustomerNo: 'CUST001',
      workUnit: '某某科技有限公司'
    },
    supplementaryCards: [],
    supplementDetail: {
      returnSubject: '主',
      scanImageType: '身份证明文件',
      supplementAgency: '北京分行',
      receiveAgency: '北京分行',
      returnInitiator: '李四',
      returnTime: '2024-01-20 10:30:00',
      returnReason: '身份证明文件不清晰，需要重新扫描',
      deadlineDate: '2024-01-25 17:00:00',
      remark: ''
    }
  },
  {
    applicationNo: '2345678901234567',
    returnSubject: '附',
    supplementAgency: '上海分行',
    deadlineTime: '2024-01-26 17:00:00',
    status: '待领取',
    handler: '',
    returnTime: '2024-01-21 14:20:00',
    returnOperatorNo: 'OP002',
    applicationInfo: {
      applicationNo: '2345678901234567',
      product: '贷记白金卡',
      applicationType: '附',
      agencyNo: '002',
      agency: '上海分行',
      channel: '分行录入'
    },
    customerInfo: {
      name: '王五',
      type: '老客户',
      idType: '中国居民身份证',
      idNo: '310101199002021234',
      coreCustomerNo: 'CUST002',
      workUnit: '某某金融公司'
    },
    supplementaryCards: [],
    supplementDetail: {
      returnSubject: '附',
      scanImageType: '申请表单',
      supplementAgency: '上海分行',
      receiveAgency: '上海分行',
      returnInitiator: '赵六',
      returnTime: '2024-01-21 14:20:00',
      returnReason: '申请表单填写不完整',
      deadlineDate: '2024-01-26 17:00:00',
      remark: ''
    }
  },
  {
    applicationNo: '3456789012345678',
    returnSubject: '主附',
    supplementAgency: '广州分行',
    deadlineTime: '2024-01-24 17:00:00',
    status: '补件中',
    handler: '张三',
    returnTime: '2024-01-19 09:15:00',
    returnOperatorNo: 'OP003',
    applicationInfo: {
      applicationNo: '3456789012345678',
      product: '准贷记个人卡',
      applicationType: '主附',
      agencyNo: '003',
      agency: '广州分行',
      channel: '智能柜台'
    },
    customerInfo: {
      name: '李明',
      type: '新客户',
      idType: '中国居民身份证',
      idNo: '440101199003031234',
      coreCustomerNo: 'CUST003',
      workUnit: '某某制造企业'
    },
    supplementaryCards: [
      {
        applicationNo: '345678901234567801',
        name: '李华',
        idNo: '440101199504041234',
        product: '准贷记个人卡'
      },
      {
        applicationNo: '345678901234567802',
        name: '李娟',
        idNo: '440101199805051234',
        product: '准贷记个人卡'
      }
    ],
    supplementDetail: {
      returnSubject: '主附',
      scanImageType: '身份证明文件',
      supplementAgency: '广州分行',
      receiveAgency: '广州分行',
      returnInitiator: '孙七',
      returnTime: '2024-01-19 09:15:00',
      returnReason: '主附卡身份证明文件缺失',
      deadlineDate: '2024-01-24 17:00:00',
      remark: ''
    }
  },
  {
    applicationNo: '4567890123456789',
    returnSubject: '主',
    supplementAgency: '深圳分行',
    deadlineTime: '2024-01-23 17:00:00',
    status: '补件中',
    handler: '李四',
    returnTime: '2024-01-18 16:45:00',
    returnOperatorNo: 'OP001',
    applicationInfo: {
      applicationNo: '4567890123456789',
      product: '贷记白金卡',
      applicationType: '主',
      agencyNo: '004',
      agency: '深圳分行',
      channel: '分期办理'
    },
    customerInfo: {
      name: '陈红',
      type: '老客户',
      idType: '中国居民身份证',
      idNo: '440301199006061234',
      coreCustomerNo: 'CUST004',
      workUnit: '某某贸易公司'
    },
    supplementaryCards: [],
    supplementDetail: {
      returnSubject: '主',
      scanImageType: '财力证明文件',
      supplementAgency: '深圳分行',
      receiveAgency: '深圳分行',
      returnInitiator: '周八',
      returnTime: '2024-01-18 16:45:00',
      returnReason: '财力证明文件过期',
      deadlineDate: '2024-01-23 17:00:00',
      remark: ''
    }
  },
  {
    applicationNo: '5678901234567890',
    returnSubject: '附',
    supplementAgency: '成都分行',
    deadlineTime: '2024-01-22 17:00:00',
    status: '补件完成',
    handler: '王五',
    returnTime: '2024-01-17 11:25:00',
    returnOperatorNo: 'OP002',
    applicationInfo: {
      applicationNo: '5678901234567890',
      product: '贷记个人卡',
      applicationType: '附',
      agencyNo: '005',
      agency: '成都分行',
      channel: '集中办卡'
    },
    customerInfo: {
      name: '黄伟',
      type: '新客户',
      idType: '中国居民身份证',
      idNo: '510101199007071234',
      coreCustomerNo: 'CUST005',
      workUnit: '某某软件公司'
    },
    supplementaryCards: [],
    supplementDetail: {
      returnSubject: '附',
      scanImageType: '申请表单',
      supplementAgency: '成都分行',
      receiveAgency: '成都分行',
      returnInitiator: '吴九',
      returnTime: '2024-01-17 11:25:00',
      returnReason: '申请表单信息不完整',
      deadlineDate: '2024-01-22 17:00:00',
      remark: '补件已完成'
    }
  },
  {
    applicationNo: '6789012345678901',
    returnSubject: '主',
    supplementAgency: '杭州分行',
    deadlineTime: '2024-01-20 17:00:00',
    status: '补件超时',
    handler: '赵六',
    returnTime: '2024-01-15 13:10:00',
    returnOperatorNo: 'OP003',
    applicationInfo: {
      applicationNo: '6789012345678901',
      product: '准贷记白金卡',
      applicationType: '主',
      agencyNo: '006',
      agency: '杭州分行',
      channel: '网申'
    },
    customerInfo: {
      name: '周杰',
      type: '老客户',
      idType: '中国居民身份证',
      idNo: '330101199008081234',
      coreCustomerNo: 'CUST006',
      workUnit: '某某投资公司'
    },
    supplementaryCards: [],
    supplementDetail: {
      returnSubject: '主',
      scanImageType: '身份证明文件',
      supplementAgency: '杭州分行',
      receiveAgency: '杭州分行',
      returnInitiator: '郑十',
      returnTime: '2024-01-15 13:10:00',
      returnReason: '身份证明文件模糊',
      deadlineDate: '2024-01-20 17:00:00',
      remark: '补件超时'
    }
  },
  {
    applicationNo: '7890123456789012',
    returnSubject: '主附',
    supplementAgency: '南京分行',
    deadlineTime: '2024-01-21 17:00:00',
    status: '取消补件',
    handler: '孙七',
    returnTime: '2024-01-16 15:30:00',
    returnOperatorNo: 'OP001',
    applicationInfo: {
      applicationNo: '7890123456789012',
      product: '贷记个人卡',
      applicationType: '主附',
      agencyNo: '007',
      agency: '南京分行',
      channel: '分行录入'
    },
    customerInfo: {
      name: '吴刚',
      type: '新客户',
      idType: '中国居民身份证',
      idNo: '320101199009091234',
      coreCustomerNo: 'CUST007',
      workUnit: '某某物流公司'
    },
    supplementaryCards: [
      {
        applicationNo: '789012345678901201',
        name: '吴强',
        idNo: '320101199510101234',
        product: '贷记个人卡'
      },
      {
        applicationNo: '789012345678901202',
        name: '吴芳',
        idNo: '320101199611111234',
        product: '贷记个人卡'
      },
      {
        applicationNo: '789012345678901203',
        name: '吴敏',
        idNo: '320101199712121234',
        product: '贷记个人卡'
      },
      {
        applicationNo: '789012345678901204',
        name: '吴丽',
        idNo: '320101199813131234',
        product: '贷记个人卡'
      }
    ],
    supplementDetail: {
      returnSubject: '主附',
      scanImageType: '申请表单',
      supplementAgency: '南京分行',
      receiveAgency: '南京分行',
      returnInitiator: '钱十一',
      returnTime: '2024-01-16 15:30:00',
      returnReason: '主附卡申请表单不完整',
      deadlineDate: '2024-01-21 17:00:00',
      remark: '客户取消申请'
    }
  }
])

const getSubjectTagType = (subject) => {
  const types = {
    '主': 'primary',
    '附': 'success',
    '主附': 'warning'
  }
  return types[subject] || 'info'
}

const getStatusTagType = (status) => {
  const types = {
    '待领取': 'info',
    '补件中': 'warning',
    '补件完成': 'success',
    '补件超时': 'danger',
    '取消补件': 'default'
  }
  return types[status] || 'info'
}

const fullFilteredList = computed(() => {
  let result = rescanList.value
  if (searchForm.applicationNo) {
    result = result.filter(item => item.applicationNo.includes(searchForm.applicationNo))
  }
  if (searchForm.status) {
    result = result.filter(item => item.status === searchForm.status)
  }
  return result
})

const filteredList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullFilteredList.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.applicationNo = ''
  searchForm.status = ''
  currentPage.value = 1
}

const handleReceive = (row) => {
  const random = Math.random()
  if (random > 0.2) {
    row.status = '补件中'
    row.handler = '当前用户'
    ElMessage.success('领取成功')
  } else {
    ElMessage.error('领取失败，请稍后重试')
  }
}

const handleCancel = (row) => {
  row.status = '取消补件'
  ElMessage.success('取消补件成功')
}

const openSupplementDialog = (row) => {
  currentRow.value = row
  Object.assign(supplementForm.applicationInfo, row.applicationInfo)
  Object.assign(supplementForm.customerInfo, row.customerInfo)
  supplementForm.supplementaryCards = [...row.supplementaryCards]
  Object.assign(supplementForm.supplementDetail, row.supplementDetail)
  supplementDialogVisible.value = true
}

const handleDialogClose = () => {
  currentRow.value = null
  supplementForm.applicationInfo = {
    applicationNo: '',
    product: '',
    applicationType: '',
    agencyNo: '',
    agency: '',
    channel: ''
  }
  supplementForm.customerInfo = {
    name: '',
    type: '',
    idType: '',
    idNo: '',
    coreCustomerNo: '',
    workUnit: ''
  }
  supplementForm.supplementaryCards = []
  supplementForm.supplementDetail = {
    returnSubject: '',
    scanImageType: '',
    supplementAgency: '',
    receiveAgency: '',
    returnInitiator: '',
    returnTime: '',
    returnReason: '',
    deadlineDate: '',
    remark: ''
  }
}

const handleSaveSupplement = () => {
  if (!currentRow.value) return
  currentRow.value.supplementDetail.deadlineDate = supplementForm.supplementDetail.deadlineDate
  currentRow.value.supplementDetail.remark = supplementForm.supplementDetail.remark
  currentRow.value.deadlineTime = supplementForm.supplementDetail.deadlineDate
  ElMessage.success('保存成功')
}

const handleCancelSupplement = () => {
  if (!currentRow.value) return
  currentRow.value.status = '取消补件'
  supplementDialogVisible.value = false
  ElMessage.success('取消补件成功')
}

const handleGoScan = () => {
  if (!currentRow.value) return
  const scanUrl = `/scan/page?type=personal-card&applicationNo=${currentRow.value.applicationNo}&showExisting=true`
  window.open(scanUrl, '_blank')
  supplementDialogVisible.value = false
}

const handleView = (row) => {
  const viewUrl = `/scan/view-page?applicationNo=${row.applicationNo}`
  window.open(viewUrl, '_blank')
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
.rescan-container {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.card-body {
  min-height: 400px;
}
</style>