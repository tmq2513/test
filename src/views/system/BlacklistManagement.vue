<template>
  <div class="blacklist-management-container">
    <el-card>
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 个人黑名单 -->
        <el-tab-pane label="个人黑名单" name="personal">
          <div class="tab-content">
            <div class="card-header">
              <h3>个人黑名单管理</h3>
              <div class="header-buttons">
                <el-button type="primary" @click="handleAddPersonal">新增</el-button>
                <el-button type="success" @click="uploadDialogVisible = true">批量上传</el-button>
                <el-button @click="showUploadRecords = true">上传记录</el-button>
              </div>
            </div>

            <SearchForm
              :fields="personalSearchFields"
              :form-model="personalSearchForm"
              @search="handlePersonalSearch"
              @reset="handlePersonalReset"
            />

            <el-table :data="paginatedPersonalBlacklist" style="width: 100%">
              <el-table-column prop="customerName" label="客户姓名" width="120" />
              <el-table-column prop="idNumber" label="客户证件号" width="180" />
              <el-table-column prop="idType" label="客户证件类型" width="120" />
              <el-table-column prop="reason" label="加入黑名单原因" width="130" />
              <el-table-column prop="listTypes" label="名单类型" width="200">
                <template #default="scope">
                  <el-tag v-for="type in scope.row.listTypes" :key="type" size="small" style="margin-right: 4px;">{{ type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="名单来源" width="120" />
              <el-table-column prop="agency" label="名单认定机构" width="150" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '有效' ? 'success' : 'danger'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="validUntil" label="名单有效期" width="120" />
              <el-table-column prop="validScenario" label="有效场景" width="120" />
              <el-table-column prop="operatorCode" label="维护员工编号" width="120" />
              <el-table-column prop="modifyTime" label="修改时间" width="180" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="handleEditPersonal(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                v-model:current-page="personalCurrentPage"
                v-model:page-size="personalPageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredPersonalBlacklist.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePersonalSizeChange"
                @current-change="handlePersonalCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 公司黑名单 -->
        <el-tab-pane label="公司黑名单" name="company">
          <div class="tab-content">
            <div class="card-header">
              <h3>公司黑名单管理</h3>
              <div class="header-buttons">
                <el-button type="primary" @click="handleAddCompany">新增</el-button>
                <el-button type="success" @click="companyUploadDialogVisible = true">批量上传</el-button>
                <el-button @click="showCompanyUploadRecords = true">上传记录</el-button>
              </div>
            </div>

            <SearchForm
              :fields="companySearchFields"
              :form-model="companySearchForm"
              @search="handleCompanySearch"
              @reset="handleCompanyReset"
            />

            <el-table :data="paginatedCompanyBlacklist" style="width: 100%">
              <el-table-column prop="companyName" label="公司名称" width="200" />
              <el-table-column prop="reason" label="加入原因" width="150" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '有效' ? 'success' : 'danger'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="名单来源" width="120" />
              <el-table-column prop="agency" label="名单认定机构" width="150" />
              <el-table-column prop="validScenario" label="名单有效场景" width="120" />
              <el-table-column prop="operatorCode" label="维护员工编号" width="120" />
              <el-table-column prop="modifyDate" label="修改日期" width="120" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="handleEditCompany(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                v-model:current-page="companyCurrentPage"
                v-model:page-size="companyPageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredCompanyBlacklist.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleCompanySizeChange"
                @current-change="handleCompanyCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 个人黑名单对话框 -->
    <el-dialog v-model="personalDialogVisible" :title="personalDialogTitle" width="700px">
      <el-form :model="personalFormData" label-width="120px">
        <el-form-item label="客户姓名" required>
          <el-input v-model="personalFormData.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="客户证件号" required>
          <el-input v-model="personalFormData.idNumber" placeholder="请输入客户证件号" />
        </el-form-item>
        <el-form-item label="客户证件类型" required>
          <el-select v-model="personalFormData.idType" placeholder="请选择证件类型">
            <el-option label="身份证" value="身份证" />
            <el-option label="护照" value="护照" />
            <el-option label="军官证" value="军官证" />
            <el-option label="港澳通行证" value="港澳通行证" />
            <el-option label="台湾通行证" value="台湾通行证" />
          </el-select>
        </el-form-item>
        <el-form-item label="加入黑名单原因" required>
          <el-select v-model="personalFormData.reason" placeholder="请选择加入黑名单原因">
            <el-option label="逾期严重" value="逾期严重" />
            <el-option label="状态异常" value="状态异常" />
            <el-option label="违规用卡" value="违规用卡" />
            <el-option label="套现嫌疑" value="套现嫌疑" />
            <el-option label="还款能力降低" value="还款能力降低" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="名单类型" required>
          <el-select v-model="personalFormData.listTypes" multiple placeholder="请选择名单类型">
            <el-option label="申请审批黑" value="申请审批黑" />
            <el-option label="申请审批灰" value="申请审批灰" />
            <el-option label="长期增额黑" value="长期增额黑" />
            <el-option label="长期增额灰" value="长期增额灰" />
            <el-option label="临时增额黑" value="临时增额黑" />
            <el-option label="临时增额灰" value="临时增额灰" />
          </el-select>
        </el-form-item>
        <el-form-item label="名单来源" required>
          <el-input v-model="personalFormData.source" placeholder="请输入名单来源" />
        </el-form-item>
        <el-form-item label="名单认定机构" required>
          <el-input v-model="personalFormData.agency" placeholder="请输入名单认定机构" />
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="personalFormData.status">
            <el-option label="有效" value="有效" />
            <el-option label="无效" value="无效" />
          </el-select>
        </el-form-item>
        <el-form-item label="名单有效期" required>
          <el-date-picker
            v-model="personalFormData.validUntil"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="有效场景" required>
          <el-input v-model="personalFormData.validScenario" placeholder="请输入有效场景" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="personalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePersonalSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 公司黑名单对话框 -->
    <el-dialog v-model="companyDialogVisible" :title="companyDialogTitle" width="700px">
      <el-form :model="companyFormData" label-width="120px">
        <el-form-item label="公司名称" required>
          <el-input v-model="companyFormData.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="加入原因" required>
          <el-input v-model="companyFormData.reason" placeholder="请输入加入原因" />
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="companyFormData.status">
            <el-option label="有效" value="有效" />
            <el-option label="无效" value="无效" />
          </el-select>
        </el-form-item>
        <el-form-item label="名单来源" required>
          <el-input v-model="companyFormData.source" placeholder="请输入名单来源" />
        </el-form-item>
        <el-form-item label="名单认定机构" required>
          <el-input v-model="companyFormData.agency" placeholder="请输入名单认定机构" />
        </el-form-item>
        <el-form-item label="名单有效场景" required>
          <el-input v-model="companyFormData.validScenario" placeholder="请输入名单有效场景" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="companyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCompanySubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 公司黑名单批量上传对话框 -->
    <el-dialog v-model="companyUploadDialogVisible" title="公司黑名单批量上传" width="500px">
      <el-form :model="companyUploadForm" label-width="100px">
        <el-form-item label="操作类型" required>
          <el-select v-model="companyUploadForm.operationType" placeholder="请选择操作类型">
            <el-option label="批量新增" value="add" />
            <el-option label="批量删除" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" required>
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleCompanyFileChange"
            accept=".xlsx,.xls,.csv"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持.xlsx、.xls、.csv格式文件<br/>
                <span v-if="companyUploadForm.operationType === 'add'">新增文件格式：公司名称,加入原因,名单来源,名单认定机构,名单有效场景</span>
                <span v-else>删除文件格式：公司名称</span>
              </div>
            </template>
          </el-upload>
          <el-button type="default" @click="handleCompanyDownloadTemplate" style="margin-top: 10px;">下载模板</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="companyUploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCompanyUploadSubmit">上传并处理</el-button>
      </template>
    </el-dialog>

    <!-- 批量上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="批量上传" width="500px">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="操作类型" required>
          <el-select v-model="uploadForm.operationType" placeholder="请选择操作类型">
            <el-option label="批量新增" value="add" />
            <el-option label="批量删除" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" required>
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleFileChange"
            accept=".xlsx,.xls,.csv"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持.xlsx、.xls、.csv格式文件<br/>
                <span v-if="uploadForm.operationType === 'add'">新增文件格式：客户姓名,客户证件号,客户证件类型,加入黑名单原因,名单来源,名单认定机构,名单有效期,有效场景,名单类型(多个用逗号分隔)</span>
                <span v-else>删除文件格式：客户证件号</span>
              </div>
            </template>
          </el-upload>
          <el-button type="default" @click="handleDownloadTemplate" style="margin-top: 10px;">下载模板</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUploadSubmit">上传并处理</el-button>
      </template>
    </el-dialog>

    <!-- 上传记录对话框 -->
    <el-dialog v-model="showUploadRecords" title="上传文件处理结果记录" width="900px">
      <SearchForm
        :fields="uploadRecordSearchFields"
        :form-model="uploadRecordSearchForm"
        @search="handleUploadRecordSearch"
        @reset="handleUploadRecordReset"
      />

      <el-table :data="paginatedUploadRecords" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="200" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.operationType === 'add' ? 'success' : 'danger'">
              {{ scope.row.operationType === 'add' ? '批量新增' : '批量删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="总条数" width="80" />
        <el-table-column prop="successCount" label="成功条数" width="80">
          <template #default="scope">
            <span style="color: #67c23a">{{ scope.row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="失败条数" width="80">
          <template #default="scope">
            <span style="color: #f56c6c">{{ scope.row.failCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '成功' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="名单来源" width="120" />
        <el-table-column prop="agency" label="名单认定机构" width="150" />
        <el-table-column prop="operatorCode" label="操作员工" width="100" />
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="uploadRecordCurrentPage"
          v-model:page-size="uploadRecordPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredUploadRecords.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleUploadRecordSizeChange"
          @current-change="handleUploadRecordCurrentChange"
        />
      </div>
    </el-dialog>

    <!-- 上传详情对话框 -->
    <el-dialog v-model="showUploadDetail" :title="'上传详情 - ' + selectedUploadRecord?.fileName" width="800px">
      <el-table :data="selectedUploadRecord?.details || []" style="width: 100%">
        <el-table-column prop="rowNum" label="行号" width="60" />
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="idNumber" label="客户证件号" width="180" />
        <el-table-column prop="result" label="处理结果" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.result === '成功' ? 'success' : 'danger'">
              {{ scope.row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="失败原因" width="300" />
      </el-table>
      <template #footer>
        <el-button @click="showUploadDetail = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 公司黑名单上传记录对话框 -->
    <el-dialog v-model="showCompanyUploadRecords" title="公司黑名单上传记录" width="900px">
      <SearchForm
        :fields="companyUploadRecordSearchFields"
        :form-model="companyUploadRecordSearchForm"
        @search="handleCompanyUploadRecordSearch"
        @reset="handleCompanyUploadRecordReset"
      />

      <el-table :data="paginatedCompanyUploadRecords" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="200" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.operationType === 'add' ? 'success' : 'danger'">
              {{ scope.row.operationType === 'add' ? '批量新增' : '批量删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="总条数" width="80" />
        <el-table-column prop="successCount" label="成功条数" width="100">
          <template #default="scope">
            <span style="color: green">{{ scope.row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="失败条数" width="100">
          <template #default="scope">
            <span style="color: red">{{ scope.row.failCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '成功' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operatorCode" label="操作员工" width="120" />
        <el-table-column prop="uploadTime" label="上传时间" width="160" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewCompanyDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="companyUploadRecordCurrentPage"
          v-model:page-size="companyUploadRecordPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredCompanyUploadRecords.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleCompanyUploadRecordSizeChange"
          @current-change="handleCompanyUploadRecordCurrentChange"
        />
      </div>
    </el-dialog>

    <!-- 公司黑名单上传详情对话框 -->
    <el-dialog v-model="showCompanyUploadDetail" :title="'上传详情 - ' + selectedCompanyUploadRecord?.fileName" width="800px">
      <el-table :data="selectedCompanyUploadRecord?.details || []" style="width: 100%">
        <el-table-column prop="rowNum" label="行号" width="60" />
        <el-table-column prop="companyName" label="公司名称" width="200" />
        <el-table-column prop="result" label="处理结果" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.result === '成功' ? 'success' : 'danger'">
              {{ scope.row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="失败原因" width="400" />
      </el-table>
      <template #footer>
        <el-button @click="showCompanyUploadDetail = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm.vue'

const activeTab = ref('personal')

// 个人黑名单数据
const personalBlacklist = ref([
  {
    id: 1,
    customerName: '张三',
    idNumber: '110101199001011234',
    idType: '身份证',
    reason: '逾期严重',
    listTypes: ['申请审批黑', '长期增额黑'],
    source: '征信中心',
    agency: '北京分行',
    status: '有效',
    validUntil: '2027-06-29',
    validScenario: '全部场景',
    operatorCode: 'EMP001',
    modifyTime: '2026-06-15 10:00:00'
  },
  {
    id: 2,
    customerName: '李四',
    idNumber: '310101199002025678',
    idType: '身份证',
    reason: '违规用卡',
    listTypes: ['申请审批灰', '临时增额黑'],
    source: '审核发现',
    agency: '上海分行',
    status: '有效',
    validUntil: '2027-06-29',
    validScenario: '新办卡',
    operatorCode: 'EMP002',
    modifyTime: '2026-06-16 11:00:00'
  },
  {
    id: 3,
    customerName: '王五',
    idNumber: '440101199003039012',
    idType: '身份证',
    reason: '套现嫌疑',
    listTypes: ['申请审批黑', '长期增额灰', '临时增额灰'],
    source: '风险监测',
    agency: '广东分行',
    status: '无效',
    validUntil: '2026-12-31',
    validScenario: '全部场景',
    operatorCode: 'EMP003',
    modifyTime: '2026-06-17 14:00:00'
  }
])

const personalSearchFields = [
  { prop: 'customerName', label: '客户姓名', type: 'input', placeholder: '请输入客户姓名' },
  { prop: 'idType', label: '证件类型', type: 'select', options: [
    { label: '身份证', value: '身份证' },
    { label: '护照', value: '护照' },
    { label: '军官证', value: '军官证' }
  ]},
  { prop: 'idNumber', label: '证件号码', type: 'input', placeholder: '请输入证件号码' },
  { prop: 'reason', label: '加入黑名单原因', type: 'select', options: [
    { label: '逾期严重', value: '逾期严重' },
    { label: '状态异常', value: '状态异常' },
    { label: '违规用卡', value: '违规用卡' },
    { label: '套现嫌疑', value: '套现嫌疑' },
    { label: '还款能力降低', value: '还款能力降低' },
    { label: '其他', value: '其他' }
  ]},
  { prop: 'agency', label: '所属机构', type: 'input', placeholder: '请输入所属机构' }
]

const personalSearchForm = reactive({
  customerName: '',
  idType: '',
  idNumber: '',
  reason: '',
  agency: ''
})

const personalCurrentPage = ref(1)
const personalPageSize = ref(10)

const filteredPersonalBlacklist = computed(() => {
  return personalBlacklist.value.filter(item => {
    if (personalSearchForm.customerName && !item.customerName.includes(personalSearchForm.customerName)) return false
    if (personalSearchForm.idType && item.idType !== personalSearchForm.idType) return false
    if (personalSearchForm.idNumber && !item.idNumber.includes(personalSearchForm.idNumber)) return false
    if (personalSearchForm.reason && item.reason !== personalSearchForm.reason) return false
    if (personalSearchForm.agency && !item.agency.includes(personalSearchForm.agency)) return false
    return true
  })
})

const paginatedPersonalBlacklist = computed(() => {
  const start = (personalCurrentPage.value - 1) * personalPageSize.value
  return filteredPersonalBlacklist.value.slice(start, start + personalPageSize.value)
})

const personalDialogVisible = ref(false)
const personalDialogTitle = ref('新增')
const personalFormData = reactive({
  id: null,
  customerName: '',
  idNumber: '',
  idType: '身份证',
  reason: '',
  listTypes: [],
  source: '',
  agency: '',
  status: '有效',
  validUntil: '',
  validScenario: ''
})

// 公司黑名单数据
const companyBlacklist = ref([
  {
    id: 1,
    companyName: '北京某某科技有限公司',
    reason: '财务异常',
    status: '有效',
    source: '工商查询',
    agency: '北京分行',
    validScenario: '全部场景',
    operatorCode: 'EMP001',
    modifyDate: '2026-06-15'
  },
  {
    id: 2,
    companyName: '上海某某贸易有限公司',
    reason: '涉诉纠纷',
    status: '有效',
    source: '司法查询',
    agency: '上海分行',
    validScenario: '新办卡',
    operatorCode: 'EMP002',
    modifyDate: '2026-06-16'
  },
  {
    id: 3,
    companyName: '广东某某实业有限公司',
    reason: '经营异常',
    status: '无效',
    source: '风险监测',
    agency: '广东分行',
    validScenario: '全部场景',
    operatorCode: 'EMP003',
    modifyDate: '2026-06-17'
  }
])

const companySearchFields = [
  { prop: 'companyName', label: '公司名称', type: 'input', placeholder: '请输入公司名称' },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '有效', value: '有效' },
    { label: '无效', value: '无效' }
  ]}
]

const companySearchForm = reactive({
  companyName: '',
  status: ''
})

const companyCurrentPage = ref(1)
const companyPageSize = ref(10)

const filteredCompanyBlacklist = computed(() => {
  return companyBlacklist.value.filter(item => {
    if (companySearchForm.companyName && !item.companyName.includes(companySearchForm.companyName)) return false
    if (companySearchForm.status && item.status !== companySearchForm.status) return false
    return true
  })
})

const paginatedCompanyBlacklist = computed(() => {
  const start = (companyCurrentPage.value - 1) * companyPageSize.value
  return filteredCompanyBlacklist.value.slice(start, start + companyPageSize.value)
})

const companyDialogVisible = ref(false)
const companyDialogTitle = ref('新增')
const companyFormData = reactive({
  id: null,
  companyName: '',
  reason: '',
  status: '有效',
  source: '',
  agency: '',
  validScenario: ''
})

// 个人黑名单操作
const handleAddPersonal = () => {
  personalDialogTitle.value = '新增'
  personalFormData.id = null
  personalFormData.customerName = ''
  personalFormData.idNumber = ''
  personalFormData.idType = '身份证'
  personalFormData.reason = ''
  personalFormData.listTypes = []
  personalFormData.source = ''
  personalFormData.agency = ''
  personalFormData.status = '有效'
  personalFormData.validUntil = ''
  personalFormData.validScenario = ''
  personalDialogVisible.value = true
}

const handleEditPersonal = (row) => {
  personalDialogTitle.value = '编辑'
  personalFormData.id = row.id
  personalFormData.customerName = row.customerName
  personalFormData.idNumber = row.idNumber
  personalFormData.idType = row.idType
  personalFormData.reason = row.reason
  personalFormData.listTypes = [...row.listTypes]
  personalFormData.source = row.source
  personalFormData.agency = row.agency
  personalFormData.status = row.status
  personalFormData.validUntil = row.validUntil
  personalFormData.validScenario = row.validScenario
  personalDialogVisible.value = true
}

const handlePersonalSubmit = () => {
  if (!personalFormData.customerName) {
    ElMessage.warning('请输入客户姓名')
    return
  }
  if (!personalFormData.idNumber) {
    ElMessage.warning('请输入客户证件号')
    return
  }
  if (!personalFormData.reason) {
    ElMessage.warning('请选择加入黑名单原因')
    return
  }
  if (!personalFormData.listTypes || personalFormData.listTypes.length === 0) {
    ElMessage.warning('请选择名单类型')
    return
  }
  if (!personalFormData.source) {
    ElMessage.warning('请输入名单来源')
    return
  }
  if (!personalFormData.agency) {
    ElMessage.warning('请输入名单认定机构')
    return
  }
  if (!personalFormData.validUntil) {
    ElMessage.warning('请选择名单有效期')
    return
  }
  if (!personalFormData.validScenario) {
    ElMessage.warning('请输入有效场景')
    return
  }

  const now = new Date().toLocaleString('zh-CN')

  if (personalFormData.id) {
    const index = personalBlacklist.value.findIndex(item => item.id === personalFormData.id)
    if (index !== -1) {
      personalBlacklist.value[index] = {
        ...personalFormData,
        operatorCode: '当前用户',
        modifyTime: now
      }
    }
    ElMessage.success('修改成功')
  } else {
    personalFormData.id = Date.now()
    personalBlacklist.value.push({
      ...personalFormData,
      operatorCode: '当前用户',
      modifyTime: now
    })
    ElMessage.success('新增成功')
  }
  personalDialogVisible.value = false
}

const handlePersonalSearch = (data) => {
  Object.assign(personalSearchForm, data)
  personalCurrentPage.value = 1
}

const handlePersonalReset = () => {
  personalSearchForm.customerName = ''
  personalSearchForm.idType = ''
  personalSearchForm.idNumber = ''
  personalSearchForm.reason = ''
  personalSearchForm.agency = ''
  personalCurrentPage.value = 1
}

const handlePersonalSizeChange = (size) => {
  personalPageSize.value = size
  personalCurrentPage.value = 1
}

const handlePersonalCurrentChange = (page) => {
  personalCurrentPage.value = page
}

// 公司黑名单操作
const handleAddCompany = () => {
  companyDialogTitle.value = '新增'
  companyFormData.id = null
  companyFormData.companyName = ''
  companyFormData.reason = ''
  companyFormData.status = '有效'
  companyFormData.source = ''
  companyFormData.agency = ''
  companyFormData.validScenario = ''
  companyDialogVisible.value = true
}

const handleEditCompany = (row) => {
  companyDialogTitle.value = '编辑'
  companyFormData.id = row.id
  companyFormData.companyName = row.companyName
  companyFormData.reason = row.reason
  companyFormData.status = row.status
  companyFormData.source = row.source
  companyFormData.agency = row.agency
  companyFormData.validScenario = row.validScenario
  companyDialogVisible.value = true
}

const handleCompanySubmit = () => {
  if (!companyFormData.companyName) {
    ElMessage.warning('请输入公司名称')
    return
  }
  if (!companyFormData.reason) {
    ElMessage.warning('请输入加入原因')
    return
  }
  if (!companyFormData.source) {
    ElMessage.warning('请输入名单来源')
    return
  }
  if (!companyFormData.agency) {
    ElMessage.warning('请输入名单认定机构')
    return
  }
  if (!companyFormData.validScenario) {
    ElMessage.warning('请输入名单有效场景')
    return
  }

  const now = new Date().toISOString().split('T')[0]

  if (companyFormData.id) {
    const index = companyBlacklist.value.findIndex(item => item.id === companyFormData.id)
    if (index !== -1) {
      companyBlacklist.value[index] = {
        ...companyFormData,
        operatorCode: '当前用户',
        modifyDate: now
      }
    }
    ElMessage.success('修改成功')
  } else {
    companyFormData.id = Date.now()
    companyBlacklist.value.push({
      ...companyFormData,
      operatorCode: '当前用户',
      modifyDate: now
    })
    ElMessage.success('新增成功')
  }
  companyDialogVisible.value = false
}

const handleCompanySearch = (data) => {
  Object.assign(companySearchForm, data)
  companyCurrentPage.value = 1
}

const handleCompanyReset = () => {
  companySearchForm.companyName = ''
  companySearchForm.status = ''
  companyCurrentPage.value = 1
}

const handleCompanySizeChange = (size) => {
  companyPageSize.value = size
  companyCurrentPage.value = 1
}

const handleCompanyCurrentChange = (page) => {
  companyCurrentPage.value = page
}

// 批量上传相关
const uploadDialogVisible = ref(false)
const uploadForm = reactive({
  operationType: 'add'
})

const selectedFile = ref(null)

const handleFileChange = (file) => {
  selectedFile.value = file
}

// 上传记录数据
const uploadRecords = ref([
  {
    id: 1,
    fileName: '个人黑名单批量新增_20260615.xlsx',
    operationType: 'add',
    totalCount: 100,
    successCount: 95,
    failCount: 5,
    status: '成功',
    source: '征信中心',
    agency: '总行',
    operatorCode: 'EMP001',
    uploadTime: '2026-06-15 10:00:00',
    details: [
      { rowNum: 1, customerName: '赵六', idNumber: '510101199004041234', result: '成功', message: '' },
      { rowNum: 2, customerName: '钱七', idNumber: '500101199005055678', result: '成功', message: '' },
      { rowNum: 15, customerName: '孙八', idNumber: '', result: '失败', message: '证件号为空' },
      { rowNum: 45, customerName: '周九', idNumber: '330101199006069012', result: '失败', message: '证件类型不正确' },
      { rowNum: 78, customerName: '吴十', idNumber: '320101199007073456', result: '失败', message: '已存在相同证件号' }
    ]
  },
  {
    id: 2,
    fileName: '个人黑名单批量删除_20260620.csv',
    operationType: 'delete',
    totalCount: 50,
    successCount: 48,
    failCount: 2,
    status: '成功',
    source: '风险监测',
    agency: '总行',
    operatorCode: 'EMP002',
    uploadTime: '2026-06-20 14:30:00',
    details: [
      { rowNum: 1, customerName: '', idNumber: '110101198501011234', result: '成功', message: '' },
      { rowNum: 2, customerName: '', idNumber: '310101198502025678', result: '成功', message: '' },
      { rowNum: 25, customerName: '', idNumber: '440101198503039012', result: '失败', message: '记录不存在' },
      { rowNum: 38, customerName: '', idNumber: '420101198504043456', result: '失败', message: '记录不存在' }
    ]
  },
  {
    id: 3,
    fileName: '个人黑名单批量新增_20260625.xlsx',
    operationType: 'add',
    totalCount: 80,
    successCount: 76,
    failCount: 4,
    status: '成功',
    source: '外部数据',
    agency: '北京分行',
    operatorCode: 'EMP001',
    uploadTime: '2026-06-25 09:15:00',
    details: [
      { rowNum: 5, customerName: '郑十一', idNumber: '110101199008087890', result: '失败', message: '证件号格式不正确' },
      { rowNum: 32, customerName: '王十二', idNumber: '110101199009091122', result: '失败', message: '有效期格式错误' },
      { rowNum: 56, customerName: '冯十三', idNumber: '110101199010103344', result: '失败', message: '黑名单原因不正确' },
      { rowNum: 72, customerName: '陈十四', idNumber: '110101199011115566', result: '失败', message: '已存在相同证件号' }
    ]
  }
])

// 公司黑名单上传记录数据
const companyUploadRecords = ref([
  {
    id: 1,
    fileName: '公司黑名单批量新增_20260615.xlsx',
    operationType: 'add',
    totalCount: 50,
    successCount: 48,
    failCount: 2,
    status: '成功',
    operatorCode: 'EMP001',
    uploadTime: '2026-06-15 10:00:00',
    details: [
      { rowNum: 1, companyName: '北京科技有限公司', result: '成功', message: '' },
      { rowNum: 2, companyName: '上海贸易有限公司', result: '成功', message: '' },
      { rowNum: 15, companyName: '', result: '失败', message: '公司名称为空' },
      { rowNum: 38, companyName: '广东实业有限公司', result: '失败', message: '已存在相同公司名称' }
    ]
  },
  {
    id: 2,
    fileName: '公司黑名单批量删除_20260620.csv',
    operationType: 'delete',
    totalCount: 30,
    successCount: 27,
    failCount: 3,
    status: '成功',
    operatorCode: 'EMP002',
    uploadTime: '2026-06-20 14:30:00',
    details: [
      { rowNum: 1, companyName: '北京科技有限公司', result: '成功', message: '' },
      { rowNum: 2, companyName: '上海贸易有限公司', result: '成功', message: '' },
      { rowNum: 18, companyName: '不存在的公司', result: '失败', message: '记录不存在' },
      { rowNum: 22, companyName: '', result: '失败', message: '公司名称为空' },
      { rowNum: 25, companyName: '广东实业有限公司', result: '失败', message: '记录不存在' }
    ]
  }
])

const uploadRecordSearchFields = [
  { prop: 'fileName', label: '文件名', type: 'input', placeholder: '请输入文件名' },
  { prop: 'operationType', label: '操作类型', type: 'select', options: [
    { label: '批量新增', value: 'add' },
    { label: '批量删除', value: 'delete' }
  ]},
  { prop: 'status', label: '处理状态', type: 'select', options: [
    { label: '成功', value: '成功' },
    { label: '部分失败', value: '部分失败' }
  ]}
]

const uploadRecordSearchForm = reactive({
  fileName: '',
  operationType: '',
  status: ''
})

const uploadRecordCurrentPage = ref(1)
const uploadRecordPageSize = ref(10)

const filteredUploadRecords = computed(() => {
  return uploadRecords.value.filter(item => {
    if (uploadRecordSearchForm.fileName && !item.fileName.includes(uploadRecordSearchForm.fileName)) return false
    if (uploadRecordSearchForm.operationType && item.operationType !== uploadRecordSearchForm.operationType) return false
    if (uploadRecordSearchForm.status && item.status !== uploadRecordSearchForm.status) return false
    return true
  })
})

const paginatedUploadRecords = computed(() => {
  const start = (uploadRecordCurrentPage.value - 1) * uploadRecordPageSize.value
  return filteredUploadRecords.value.slice(start, start + uploadRecordPageSize.value)
})

const showUploadRecords = ref(false)
const showUploadDetail = ref(false)
const selectedUploadRecord = ref(null)

const handleDownloadTemplate = () => {
  const now = new Date()
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  
  if (uploadForm.operationType === 'add') {
    const headers = ['客户姓名', '客户证件号', '客户证件类型', '加入黑名单原因', '名单来源', '名单认定机构', '名单有效期', '有效场景', '名单类型(多个用逗号分隔)']
    const exampleData = [
      ['张三', '110101199001011234', '身份证', '逾期严重', '征信中心', '总行', '2027-12-31', '申请审批', '申请审批黑,长期增额黑'],
      ['李四', '310101199002025678', '身份证', '违规用卡', '风险监测', '北京分行', '2027-12-31', '增额审批', '长期增额灰']
    ]
    
    const csvContent = [headers.join(','), ...exampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `个人黑名单批量新增模板_${dateStr}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else {
    const headers = ['客户证件号']
    const exampleData = [
      ['110101199001011234'],
      ['310101199002025678']
    ]
    
    const csvContent = [headers.join(','), ...exampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `个人黑名单批量删除模板_${dateStr}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  ElMessage.success('模板下载成功')
}

const handleUploadSubmit = () => {
  if (!uploadForm.operationType) {
    ElMessage.warning('请选择操作类型')
    return
  }
  if (!selectedFile.value) {
    ElMessage.warning('请选择上传文件')
    return
  }

  const now = new Date()
  const details = []
  let successCount = 0
  let failCount = 0

  if (uploadForm.operationType === 'add') {
    const mockRows = [
      { customerName: '批量新增用户1', idNumber: '123456199001011111', idType: '身份证', reason: '逾期严重', source: '征信中心', agency: '总行', validUntil: '2027-12-31', validScenario: '申请审批', listTypes: '申请审批黑,长期增额黑' },
      { customerName: '批量新增用户2', idNumber: '123456199002022222', idType: '身份证', reason: '违规用卡', source: '风险监测', agency: '北京分行', validUntil: '2027-12-31', validScenario: '增额审批', listTypes: '长期增额灰' },
      { customerName: '批量新增用户3', idNumber: '', idType: '身份证', reason: '套现嫌疑', source: '外部数据', agency: '上海分行', validUntil: '2027-12-31', validScenario: '申请审批', listTypes: '申请审批黑' },
      { customerName: '批量新增用户4', idNumber: '123456199004044444', idType: '身份证', reason: '状态异常', source: '征信中心', agency: '总行', validUntil: '2027-12-31', validScenario: '申请审批', listTypes: '申请审批灰' },
      { customerName: '', idNumber: '123456199005055555', idType: '身份证', reason: '还款能力降低', source: '风险监测', agency: '深圳分行', validUntil: '2027-12-31', validScenario: '增额审批', listTypes: '临时增额黑' }
    ]

    mockRows.forEach((row, index) => {
      const rowDetails = {
        rowNum: index + 1,
        customerName: row.customerName,
        idNumber: row.idNumber,
        result: '成功',
        message: ''
      }

      if (!row.customerName) {
        rowDetails.result = '失败'
        rowDetails.message = '客户姓名为空'
        failCount++
      } else if (!row.idNumber) {
        rowDetails.result = '失败'
        rowDetails.message = '证件号为空'
        failCount++
      } else {
        successCount++
        personalBlacklist.value.push({
          id: Date.now() + index,
          customerName: row.customerName,
          idNumber: row.idNumber,
          idType: row.idType,
          reason: row.reason,
          listTypes: row.listTypes ? row.listTypes.split(',') : [],
          source: row.source,
          agency: row.agency,
          status: '有效',
          validUntil: row.validUntil,
          validScenario: row.validScenario,
          operatorCode: '当前用户',
          modifyTime: now.toLocaleString('zh-CN')
        })
      }
      details.push(rowDetails)
    })
  } else {
    const mockRows = [
      { idNumber: '110101199001011234' },
      { idNumber: '310101199002025678' },
      { idNumber: '999999999999999999' },
      { idNumber: '440101199003039012' }
    ]

    mockRows.forEach((row, index) => {
      const rowDetails = {
        rowNum: index + 1,
        customerName: '',
        idNumber: row.idNumber,
        result: '成功',
        message: ''
      }

      const existingIndex = personalBlacklist.value.findIndex(item => item.idNumber === row.idNumber)
      if (existingIndex === -1) {
        rowDetails.result = '失败'
        rowDetails.message = '记录不存在'
        failCount++
      } else {
        successCount++
        personalBlacklist.value.splice(existingIndex, 1)
      }
      details.push(rowDetails)
    })
  }

  const newRecord = {
    id: Date.now(),
    fileName: selectedFile.value.name,
    operationType: uploadForm.operationType,
    totalCount: successCount + failCount,
    successCount,
    failCount,
    status: failCount === 0 ? '成功' : '部分失败',
    source: '',
    agency: '',
    operatorCode: '当前用户',
    uploadTime: now.toLocaleString('zh-CN'),
    details
  }

  uploadRecords.value.unshift(newRecord)

  ElMessage.success(`处理完成！成功${successCount}条，失败${failCount}条`)
  uploadDialogVisible.value = false
  uploadForm.operationType = 'add'
  selectedFile.value = null
}

const handleUploadRecordSearch = (data) => {
  Object.assign(uploadRecordSearchForm, data)
  uploadRecordCurrentPage.value = 1
}

const handleUploadRecordReset = () => {
  uploadRecordSearchForm.fileName = ''
  uploadRecordSearchForm.operationType = ''
  uploadRecordSearchForm.status = ''
  uploadRecordCurrentPage.value = 1
}

const handleUploadRecordSizeChange = (size) => {
  uploadRecordPageSize.value = size
  uploadRecordCurrentPage.value = 1
}

const handleUploadRecordCurrentChange = (page) => {
  uploadRecordCurrentPage.value = page
}

const handleViewDetail = (row) => {
  selectedUploadRecord.value = row
  showUploadDetail.value = true
}

// 公司黑名单批量上传相关
const companyUploadDialogVisible = ref(false)
const companyUploadForm = reactive({
  operationType: 'add'
})

const companySelectedFile = ref(null)

const handleCompanyFileChange = (file) => {
  companySelectedFile.value = file
}

const companyUploadRecordSearchFields = [
  { prop: 'fileName', label: '文件名', type: 'input', placeholder: '请输入文件名' },
  { prop: 'operationType', label: '操作类型', type: 'select', options: [
    { label: '批量新增', value: 'add' },
    { label: '批量删除', value: 'delete' }
  ]},
  { prop: 'status', label: '处理状态', type: 'select', options: [
    { label: '成功', value: '成功' },
    { label: '部分失败', value: '部分失败' }
  ]}
]

const companyUploadRecordSearchForm = reactive({
  fileName: '',
  operationType: '',
  status: ''
})

const companyUploadRecordCurrentPage = ref(1)
const companyUploadRecordPageSize = ref(10)

const filteredCompanyUploadRecords = computed(() => {
  return companyUploadRecords.value.filter(item => {
    if (companyUploadRecordSearchForm.fileName && !item.fileName.includes(companyUploadRecordSearchForm.fileName)) return false
    if (companyUploadRecordSearchForm.operationType && item.operationType !== companyUploadRecordSearchForm.operationType) return false
    if (companyUploadRecordSearchForm.status && item.status !== companyUploadRecordSearchForm.status) return false
    return true
  })
})

const paginatedCompanyUploadRecords = computed(() => {
  const start = (companyUploadRecordCurrentPage.value - 1) * companyUploadRecordPageSize.value
  return filteredCompanyUploadRecords.value.slice(start, start + companyUploadRecordPageSize.value)
})

const showCompanyUploadRecords = ref(false)
const showCompanyUploadDetail = ref(false)
const selectedCompanyUploadRecord = ref(null)

const handleCompanyDownloadTemplate = () => {
  const now = new Date()
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  
  if (companyUploadForm.operationType === 'add') {
    const headers = ['公司名称', '加入原因', '名单来源', '名单认定机构', '名单有效场景']
    const exampleData = [
      ['北京科技有限公司', '财务异常', '工商查询', '北京分行', '全部场景'],
      ['上海贸易有限公司', '涉诉纠纷', '司法查询', '上海分行', '新办卡']
    ]
    
    const csvContent = [headers.join(','), ...exampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `公司黑名单批量新增模板_${dateStr}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else {
    const headers = ['公司名称']
    const exampleData = [
      ['北京科技有限公司'],
      ['上海贸易有限公司']
    ]
    
    const csvContent = [headers.join(','), ...exampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `公司黑名单批量删除模板_${dateStr}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  ElMessage.success('模板下载成功')
}

const handleCompanyUploadSubmit = () => {
  if (!companyUploadForm.operationType) {
    ElMessage.warning('请选择操作类型')
    return
  }
  if (!companySelectedFile.value) {
    ElMessage.warning('请选择上传文件')
    return
  }

  const now = new Date()
  const details = []
  let successCount = 0
  let failCount = 0

  if (companyUploadForm.operationType === 'add') {
    const mockRows = [
      { companyName: '批量新增公司1', reason: '财务异常', source: '工商查询', agency: '总行', validScenario: '全部场景' },
      { companyName: '批量新增公司2', reason: '涉诉纠纷', source: '司法查询', agency: '北京分行', validScenario: '新办卡' },
      { companyName: '', reason: '经营异常', source: '风险监测', agency: '上海分行', validScenario: '全部场景' },
      { companyName: '批量新增公司4', reason: '信用不良', source: '征信中心', agency: '总行', validScenario: '增额审批' }
    ]

    mockRows.forEach((row, index) => {
      const rowDetails = {
        rowNum: index + 1,
        companyName: row.companyName,
        result: '成功',
        message: ''
      }

      if (!row.companyName) {
        rowDetails.result = '失败'
        rowDetails.message = '公司名称为空'
        failCount++
      } else {
        successCount++
        companyBlacklist.value.push({
          id: Date.now() + index,
          companyName: row.companyName,
          reason: row.reason,
          status: '有效',
          source: row.source,
          agency: row.agency,
          validScenario: row.validScenario,
          operatorCode: '当前用户',
          modifyDate: now.toISOString().split('T')[0]
        })
      }
      details.push(rowDetails)
    })
  } else {
    const mockRows = [
      { companyName: '北京科技有限公司' },
      { companyName: '上海贸易有限公司' },
      { companyName: '不存在的公司' }
    ]

    mockRows.forEach((row, index) => {
      const rowDetails = {
        rowNum: index + 1,
        companyName: row.companyName,
        result: '成功',
        message: ''
      }

      const existingIndex = companyBlacklist.value.findIndex(item => item.companyName === row.companyName)
      if (existingIndex === -1) {
        rowDetails.result = '失败'
        rowDetails.message = '记录不存在'
        failCount++
      } else {
        successCount++
        companyBlacklist.value.splice(existingIndex, 1)
      }
      details.push(rowDetails)
    })
  }

  const newRecord = {
    id: Date.now(),
    fileName: companySelectedFile.value.name,
    operationType: companyUploadForm.operationType,
    totalCount: successCount + failCount,
    successCount,
    failCount,
    status: failCount === 0 ? '成功' : '部分失败',
    operatorCode: '当前用户',
    uploadTime: now.toLocaleString('zh-CN'),
    details
  }

  companyUploadRecords.value.unshift(newRecord)

  ElMessage.success(`处理完成！成功${successCount}条，失败${failCount}条`)
  companyUploadDialogVisible.value = false
  companyUploadForm.operationType = 'add'
  companySelectedFile.value = null
}

const handleCompanyUploadRecordSearch = (data) => {
  Object.assign(companyUploadRecordSearchForm, data)
  companyUploadRecordCurrentPage.value = 1
}

const handleCompanyUploadRecordReset = () => {
  companyUploadRecordSearchForm.fileName = ''
  companyUploadRecordSearchForm.operationType = ''
  companyUploadRecordSearchForm.status = ''
  companyUploadRecordCurrentPage.value = 1
}

const handleCompanyUploadRecordSizeChange = (size) => {
  companyUploadRecordPageSize.value = size
  companyUploadRecordCurrentPage.value = 1
}

const handleCompanyUploadRecordCurrentChange = (page) => {
  companyUploadRecordCurrentPage.value = page
}

const handleViewCompanyDetail = (row) => {
  selectedCompanyUploadRecord.value = row
  showCompanyUploadDetail.value = true
}
</script>

<style scoped>
.blacklist-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.tab-content {
  padding: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>