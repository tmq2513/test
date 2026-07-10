<template>
  <div class="entry-form">
    <el-card class="form-card">
      <template #header>
        <span>个人主申请详情</span>
        <div class="header-actions">
          <el-button @click="viewImages">影像查看</el-button>
          <el-button @click="openOperationRecords">操作记录</el-button>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </div>
      </template>
      <el-collapse v-model="activeCollapse" :accordion="false">
        <el-collapse-item title="申请信息" name="application">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(applicationFields)" :key="'app-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="产品信息" name="product">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(productFields)" :key="'prod-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="账单还款" name="bill">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(billFields)" :key="'bill-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="联系人信息" name="contact">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(contactFields)" :key="'contact-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户经理信息" name="manager">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(managerFields)" :key="'manager-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户基本信息" name="customer">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(customerFields)" :key="'customer-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="地址信息" name="address">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(addressFields)" :key="'address-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="税务信息" name="tax">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(taxFields)" :key="'tax-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="工作信息" name="work">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(workFields)" :key="'work-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="营销信息" name="marketing">
          <el-form :model="formData" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(marketingFields)" :key="'marketing-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label">
                  <el-input v-if="field.type === 'input'" :value="formData[field.key]" disabled />
                  <el-input v-else-if="field.type === 'select'" :value="getOptionLabel(field.key)" disabled />
                  <el-input v-else-if="field.type === 'date'" :value="formData[field.key]" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-drawer title="操作记录" v-model="showOperationDrawer" direction="rtl" size="500px">
      <div class="operation-records">
        <div v-for="(record, index) in operationRecords" :key="index" class="record-item">
          <div class="record-time">{{ record.time }}</div>
          <div class="record-content">
            <span class="record-operator">{{ record.operator }}：</span>
            <span>{{ record.content }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'

const router = useRouter()
const route = useRoute()

const activeCollapse = ref(['application', 'product', 'bill', 'contact', 'manager', 'customer', 'address', 'tax', 'work', 'marketing'])
const showOperationDrawer = ref(false)

const formData = reactive({
  applicationType: '',
  applicationId: '',
  applicationRequestType: '',
  channelFlag: '',
  newOldCustomerFlag: '',
  downgradeFlag: '',
  productCode: '',
  productName: '',
  applyOverdraftLimit: '',
  billCardAddressSelect: '',
  airlineMileAutoExchange: '',
  memberNo: '',
  foreignTransactionCurrency: '',
  repaymentMethod: '',
  autoRepaymentAmountSelect: '',
  autoRepaymentAccountOption: '',
  bankProvinceCity: '',
  autoRepaymentForeignAccount: '',
  autoRepaymentRmbAccount: '',
  contactName: '',
  contactTitle: '',
  contactRelationship: '',
  contactMobile: '',
  managerProvince: '',
  managerCity: '',
  managerAddress: '',
  managerIdNumber: '',
  managerEmployeeNo: '',
  customerName: '',
  customerNamePinyin: '',
  customerBirthPlace: '',
  customerBirthDate: '',
  customerGender: '',
  customerNationality: '',
  customerIdType: '',
  customerIdNumber: '',
  customerIdExpireDate: '',
  permanentIdFlag: '',
  secondIdType: '',
  secondIdNumber: '',
  secondIdStartDate: '',
  secondIdEndDate: '',
  customerMaritalStatus: '',
  customerEducation: '',
  customerMobile: '',
  customerIdIssueCount: '',
  customerIdIssueDate: '',
  customerOverseasCountry1: '',
  customerOverseasCountry2: '',
  customerOverseasCountry3: '',
  customerExpectedCurrency: '',
  customerExpectedAmount: '',
  customerTaxResidentFlag: '',
  customerBirthPlaceCountry: '',
  customerBirthPlaceProvince: '',
  customerBirthPlaceCity: '',
  customerBirthPlaceDistrict: '',
  customerBirthPlaceAddress: '',
  customerCurrentResidenceCountry: '',
  customerCurrentResidenceProvince: '',
  customerCurrentResidenceCity: '',
  customerCurrentResidenceDistrict: '',
  customerCurrentResidenceAddress: '',
  customerTaxIdType1: '',
  customerTaxIdType2: '',
  customerTaxIdType3: '',
  customerTaxIdTIN1: '',
  customerTaxIdTIN2: '',
  customerTaxIdTIN3: '',
  customerTaxIdReason1: '',
  customerTaxIdReason2: '',
  customerTaxIdReason3: '',
  customerTaxReasonExplain1: '',
  customerTaxReasonExplain2: '',
  customerTaxReasonExplain3: '',
  customerTaxResidentCountry1: '',
  customerTaxResidentCountry2: '',
  customerTaxResidentCountry3: '',
  customerTaxFailedRequestNo: '',
  customerCompanyProvince: '',
  customerCompanyCity: '',
  customerCompanyDistrict: '',
  customerCompanyAddress: '',
  customerResidenceProvince: '',
  customerResidenceCity: '',
  customerResidenceDistrict: '',
  customerResidenceDetailAddress: '',
  customerCompanyPhone: '',
  customerCompanyExtension: '',
  customerCompanyCountryCode: '',
  customerCompanyAreaCode: '',
  customerCompanyPostcode: '',
  customerLivingStatus: '',
  customerCompanyName: '',
  customerCompanyIndustry: '',
  customerCompanyOccupation: '',
  customerCompanyEconomicType: '',
  customerCompanyPosition: '',
  customerWorkYears: '',
  customerAnnualIncome: '',
  customerSignDate: '',
  marketingCode: '',
  ucifOrgNo: '',
  marketingPersonCode: '',
  partnerOrgCode: '',
  externalIdCode: '',
  freeAnnualFeeType: '',
  referrerMobile: ''
})

const operationRecords = ref([
  { time: '2026-07-02 10:30:00', operator: 'EMP001', content: '扫描上传申请件影像' },
  { time: '2026-07-02 11:15:00', operator: 'EMP002', content: '录入客户基本信息' },
  { time: '2026-07-02 14:20:00', operator: 'EMP002', content: '录入申请信息' },
  { time: '2026-07-02 15:45:00', operator: 'EMP003', content: '数据校验通过' },
  { time: '2026-07-02 16:00:00', operator: 'EMP004', content: '核准核查通过' },
  { time: '2026-07-03 09:30:00', operator: 'EMP005', content: '人工审批通过' },
  { time: '2026-07-03 10:00:00', operator: '系统', content: '审批成功，开卡成功' }
])

const fieldOptions = {
  applicationType: [{ label: '主卡', value: '1' }, { label: '附卡', value: '2' }],
  applicationRequestType: [{ label: '纯主', value: '1' }, { label: '主附', value: '2' }, { label: '纯附', value: '3' }],
  channelFlag: [{ label: '分行录入', value: '0' }, { label: '网页版网申', value: '2' }, { label: '手机版网申', value: '4' }, { label: '引导办卡', value: 'B' }, { label: '外呼电销录入', value: 'D' }, { label: '拒绝件捞回', value: 'E' }, { label: '智能柜台', value: 'G' }, { label: '老客户卡片升级', value: 'N' }, { label: 'RLMS', value: 'R' }, { label: '批量办卡分行', value: 'T' }, { label: '商务公司录入', value: 'Y' }, { label: '外拓PAD', value: 'P' }, { label: '智能柜台移动端', value: 'H' }, { label: '小程序引导办卡', value: 'V' }],
  newOldCustomerFlag: [{ label: '新客户', value: '0' }, { label: '老客户', value: '1' }],
  downgradeFlag: [{ label: '同意降级', value: '1' }, { label: '不同意降级', value: '2' }],
  applyOverdraftLimit: [{ label: '申请', value: 'Y' }, { label: '不申请', value: 'N' }],
  billCardAddressSelect: [{ label: '寄往单位地址', value: '1' }, { label: '寄往家庭地址', value: '2' }],
  airlineMileAutoExchange: [{ label: '国航', value: '1' }, { label: '南航', value: '2' }, { label: '深航', value: '3' }],
  foreignTransactionCurrency: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
  repaymentMethod: [{ label: '主动还款', value: '0' }, { label: '自动还款', value: '1' }],
  autoRepaymentAmountSelect: [{ label: '全额缴付', value: '1' }, { label: '最低还款额', value: '2' }],
  autoRepaymentAccountOption: [{ label: '人民币与外币结欠分别以相应币种账户还款', value: '1' }, { label: '所有结欠均以人民币还款', value: '2' }],
  contactTitle: [{ label: '先生', value: '1' }, { label: '女士', value: '2' }],
  contactRelationship: [{ label: '父母', value: '11' }, { label: '配偶', value: '12' }, { label: '亲戚', value: '13' }, { label: '其他', value: '14' }],
  customerGender: [{ label: '女性', value: '0' }, { label: '男性', value: '1' }],
  customerNationality: [{ label: '中国', value: 'CN' }],
  customerIdType: [{ label: '中国居民身份证', value: '01' }],
  permanentIdFlag: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
  secondIdType: [{ label: '港澳居民来往内地通行证（香港）', value: '47' }],
  customerMaritalStatus: [{ label: '未婚', value: '0' }, { label: '已婚', value: '1' }],
  customerEducation: [{ label: '大学本科毕业', value: '21' }],
  customerLivingStatus: [{ label: '自置', value: '1' }],
  customerCompanyIndustry: [{ label: '科技', value: '02' }],
  customerCompanyOccupation: [{ label: '专业技术', value: '02' }],
  customerCompanyEconomicType: [{ label: '民营', value: '02' }],
  customerCompanyPosition: [{ label: '中层', value: '02' }],
  freeAnnualFeeType: [{ label: '免年费', value: '1' }, { label: '不免', value: '0' }],
  customerTaxResidentFlag: [{ label: '仅为中国居民', value: '1' }],
  customerTaxIdType1: [{ label: 'TIN', value: '1' }],
  customerTaxIdType2: [{ label: 'TIN', value: '1' }],
  customerTaxIdType3: [{ label: 'TIN', value: '1' }],
  customerTaxIdReason1: [{ label: 'A:居民国不发放纳税人识别号', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  customerTaxIdReason2: [{ label: 'A:居民国不发放纳税人识别号', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  customerTaxIdReason3: [{ label: 'A:居民国不发放纳税人识别号', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  managerProvince: [{ label: '北京市', value: '110000' }, { label: '天津市', value: '120000' }, { label: '河北省', value: '130000' }, { label: '山西省', value: '140000' }, { label: '内蒙古自治区', value: '150000' }, { label: '辽宁省', value: '210000' }, { label: '吉林省', value: '220000' }, { label: '黑龙江省', value: '230000' }, { label: '上海市', value: '310000' }, { label: '江苏省', value: '320000' }, { label: '浙江省', value: '330000' }, { label: '安徽省', value: '340000' }, { label: '福建省', value: '350000' }, { label: '江西省', value: '360000' }, { label: '山东省', value: '370000' }, { label: '河南省', value: '410000' }, { label: '湖北省', value: '420000' }, { label: '湖南省', value: '430000' }, { label: '广东省', value: '440000' }, { label: '广西壮族自治区', value: '450000' }, { label: '海南省', value: '460000' }, { label: '重庆市', value: '500000' }, { label: '四川省', value: '510000' }, { label: '贵州省', value: '520000' }, { label: '云南省', value: '530000' }, { label: '西藏自治区', value: '540000' }, { label: '陕西省', value: '610000' }, { label: '甘肃省', value: '620000' }, { label: '青海省', value: '630000' }, { label: '宁夏回族自治区', value: '640000' }, { label: '新疆维吾尔自治区', value: '650000' }]
}

const applicationFields = [
  { key: 'applicationType', label: '申请类型', length: 1, type: 'select', span: 12 },
  { key: 'applicationId', label: '申请单号', length: 18, type: 'input', span: 12 },
  { key: 'applicationRequestType', label: '申请单申请类型', length: 1, type: 'select', span: 12 },
  { key: 'channelFlag', label: '渠道标识', length: 1, type: 'select', span: 12 },
  { key: 'newOldCustomerFlag', label: '新老客户标识', length: 1, type: 'select', span: 12 },
  { key: 'downgradeFlag', label: '降级标识', length: 1, type: 'select', span: 12 }
]

const productFields = [
  { key: 'productCode', label: '产品数字代码', length: 4, type: 'input', span: 12 },
  { key: 'productName', label: '产品发布名称', length: 50, type: 'input', span: 12 },
  { key: 'applyOverdraftLimit', label: '是否申请透支额度', length: 1, type: 'select', span: 12 },
  { key: 'billCardAddressSelect', label: '帐单卡片寄送地址选择', length: 1, type: 'select', span: 12 },
  { key: 'airlineMileAutoExchange', label: '是否开通航空公司里程自动兑换', length: 1, type: 'select', span: 12 },
  { key: 'memberNo', label: '会员号', length: 20, type: 'input', span: 12 }
]

const billFields = [
  { key: 'foreignTransactionCurrency', label: '您在国外的交易是否统一以人民币记账和还款', length: 1, type: 'select', span: 24 },
  { key: 'repaymentMethod', label: '还款方式', length: 1, type: 'select', span: 12 },
  { key: 'autoRepaymentAmountSelect', label: '自动还款还款金额选择', length: 1, type: 'select', span: 12 },
  { key: 'autoRepaymentAccountOption', label: '自动还款还款帐户选项', length: 1, type: 'select', span: 12 },
  { key: 'bankProvinceCity', label: '开户行所在省市', length: 58, type: 'input', span: 12 },
  { key: 'autoRepaymentForeignAccount', label: '自动还款外币账号', length: 20, type: 'input', span: 12 },
  { key: 'autoRepaymentRmbAccount', label: '自动还款人民币账号', length: 20, type: 'input', span: 12 }
]

const contactFields = [
  { key: 'contactName', label: '联系人姓名', length: 28, type: 'input', span: 12 },
  { key: 'contactTitle', label: '联系人称谓', length: 1, type: 'select', span: 12 },
  { key: 'contactRelationship', label: '联系人与申请人关系', length: 2, type: 'select', span: 12 },
  { key: 'contactMobile', label: '联系人手机号', length: 11, type: 'input', span: 12 }
]

const managerFields = [
  { key: 'managerProvince', label: '客户经理单位省/直辖市', length: 30, type: 'select', span: 12 },
  { key: 'managerCity', label: '客户经理单位市/区/县', length: 20, type: 'select', span: 12 },
  { key: 'managerAddress', label: '客户经理详细地址', length: 120, type: 'input', span: 24 },
  { key: 'managerIdNumber', label: '客户经理身份证号码', length: 20, type: 'input', span: 12 },
  { key: 'managerEmployeeNo', label: '客户经理员工号', length: 7, type: 'input', span: 12 }
]

const customerFields = [
  { key: 'customerName', label: '客户姓名', length: 80, type: 'input', span: 12 },
  { key: 'customerNamePinyin', label: '客户姓名拼音', length: 120, type: 'input', span: 12 },
  { key: 'customerBirthPlace', label: '客户出生地', length: 120, type: 'input', span: 24 },
  { key: 'customerBirthDate', label: '客户出生日期', length: 10, type: 'date', span: 12 },
  { key: 'customerGender', label: '客户性别', length: 1, type: 'select', span: 12 },
  { key: 'customerNationality', label: '客户国籍', length: 3, type: 'select', span: 12 },
  { key: 'customerIdType', label: '客户证件类型', length: 2, type: 'select', span: 12 },
  { key: 'customerIdNumber', label: '客户证件号码', length: 32, type: 'input', span: 12 },
  { key: 'customerIdExpireDate', label: '客户证件到期日期', length: 10, type: 'date', span: 12 },
  { key: 'permanentIdFlag', label: '长期证件标志', length: 1, type: 'select', span: 12 },
  { key: 'secondIdType', label: '第二客户证件类型', length: 2, type: 'select', span: 12 },
  { key: 'secondIdNumber', label: '第二客户证件号码', length: 32, type: 'input', span: 12 },
  { key: 'secondIdStartDate', label: '第二客户证件有效开始日期', length: 8, type: 'date', span: 12 },
  { key: 'secondIdEndDate', label: '第二客户证件有效结束日期', length: 8, type: 'date', span: 12 },
  { key: 'customerMaritalStatus', label: '客户婚姻状况', length: 2, type: 'select', span: 12 },
  { key: 'customerEducation', label: '客户学历', length: 2, type: 'select', span: 12 },
  { key: 'customerMobile', label: '客户手机号码', length: 11, type: 'input', span: 12 },
  { key: 'customerIdIssueCount', label: '客户证件签发次数', length: 2, type: 'input', span: 12 },
  { key: 'customerIdIssueDate', label: '客户证件签发日期', length: 10, type: 'date', span: 12 },
  { key: 'customerOverseasCountry1', label: '客户主要海外交易涉及国家或地区1', length: 3, type: 'input', span: 12 },
  { key: 'customerOverseasCountry2', label: '客户主要海外交易涉及国家或地区2', length: 3, type: 'input', span: 12 },
  { key: 'customerOverseasCountry3', label: '客户主要海外交易涉及国家或地区3', length: 3, type: 'input', span: 12 },
  { key: 'customerExpectedCurrency', label: '客户预期月交易规模币种', length: 3, type: 'input', span: 12 },
  { key: 'customerExpectedAmount', label: '客户预期月交易规模', length: 14, type: 'input', span: 12 },
  { key: 'customerTaxResidentFlag', label: '客户居民涉税标识', length: 1, type: 'select', span: 12 }
]

const addressFields = [
  { key: 'customerCompanyProvince', label: '客户单位地址（省份/直辖市）', length: 6, type: 'select', span: 12 },
  { key: 'customerCompanyCity', label: '客户单位地址（市）', length: 6, type: 'select', span: 12 },
  { key: 'customerCompanyDistrict', label: '客户单位地址（区县）', length: 50, type: 'select', span: 12 },
  { key: 'customerCompanyAddress', label: '客户单位地址（详细地址）', length: 160, type: 'input', span: 24 },
  { key: 'customerResidenceProvince', label: '客户居住地址（省份/直辖市）', length: 6, type: 'select', span: 12 },
  { key: 'customerResidenceCity', label: '客户居住地址（市）', length: 6, type: 'select', span: 12 },
  { key: 'customerResidenceDistrict', label: '客户居住地址（区县）', length: 50, type: 'select', span: 12 },
  { key: 'customerResidenceDetailAddress', label: '客户居住地址（详细地址）', length: 160, type: 'input', span: 24 },
  { key: 'customerCompanyPhone', label: '客户公司电话(电话号码)', length: 8, type: 'input', span: 12 },
  { key: 'customerCompanyExtension', label: '客户公司电话(分机号)', length: 5, type: 'input', span: 12 },
  { key: 'customerCompanyCountryCode', label: '客户公司电话(国家号）', length: 5, type: 'input', span: 12 },
  { key: 'customerCompanyAreaCode', label: '客户公司电话(区号）', length: 5, type: 'input', span: 12 },
  { key: 'customerCompanyPostcode', label: '客户公司邮编', length: 10, type: 'input', span: 12 },
  { key: 'customerLivingStatus', label: '客户现居住状况', length: 1, type: 'select', span: 12 }
]

const taxFields = [
  { key: 'customerBirthPlaceCountry', label: '客户出生地地址（国家）', length: 3, type: 'select', span: 12 },
  { key: 'customerBirthPlaceProvince', label: '客户出生地地址（省）', length: 6, type: 'select', span: 12 },
  { key: 'customerBirthPlaceCity', label: '客户出生地地址（市）', length: 6, type: 'select', span: 12 },
  { key: 'customerBirthPlaceDistrict', label: '客户出生地地址(区)', length: 50, type: 'select', span: 12 },
  { key: 'customerBirthPlaceAddress', label: '客户出生地地址详细地址', length: 160, type: 'input', span: 24 },
  { key: 'customerCurrentResidenceCountry', label: '客户现居地地址(国家)', length: 3, type: 'select', span: 12 },
  { key: 'customerCurrentResidenceProvince', label: '客户现居地地址(省)', length: 6, type: 'select', span: 12 },
  { key: 'customerCurrentResidenceCity', label: '客户现居地地址(市)', length: 6, type: 'select', span: 12 },
  { key: 'customerCurrentResidenceDistrict', label: '客户现居地地址(区)', length: 50, type: 'select', span: 12 },
  { key: 'customerCurrentResidenceAddress', label: '客户现居地详细地址', length: 160, type: 'input', span: 24 },
  { key: 'customerTaxIdType1', label: '客户纳税人识别号类型1', length: 1, type: 'select', span: 12 },
  { key: 'customerTaxIdType2', label: '客户纳税人识别号类型2', length: 1, type: 'select', span: 12 },
  { key: 'customerTaxIdType3', label: '客户纳税人识别号类型3', length: 1, type: 'select', span: 12 },
  { key: 'customerTaxIdTIN1', label: '客户纳税人识别号TIN1', length: 32, type: 'input', span: 12 },
  { key: 'customerTaxIdTIN2', label: '客户纳税人识别号TIN2', length: 32, type: 'input', span: 12 },
  { key: 'customerTaxIdTIN3', label: '客户纳税人识别号TIN3', length: 32, type: 'input', span: 12 },
  { key: 'customerTaxIdReason1', label: '客户未填写纳税人识别号原因1', length: 100, type: 'select', span: 24 },
  { key: 'customerTaxIdReason2', label: '客户未填写纳税人识别号原因2', length: 100, type: 'select', span: 24 },
  { key: 'customerTaxIdReason3', label: '客户未填写纳税人识别号原因3', length: 100, type: 'select', span: 24 },
  { key: 'customerTaxReasonExplain1', label: '客户选择B原因解释说明1', length: 300, type: 'input', span: 24 },
  { key: 'customerTaxReasonExplain2', label: '客户选择B原因解释说明2', length: 300, type: 'input', span: 24 },
  { key: 'customerTaxReasonExplain3', label: '客户选择B原因解释说明3', length: 300, type: 'input', span: 24 },
  { key: 'customerTaxResidentCountry1', label: '客户税收居民国/地区1', length: 3, type: 'select', span: 12 },
  { key: 'customerTaxResidentCountry2', label: '客户税收居民国/地区2', length: 3, type: 'select', span: 12 },
  { key: 'customerTaxResidentCountry3', label: '客户税收居民国/地区3', length: 3, type: 'select', span: 12 },
  { key: 'customerTaxFailedRequestNo', label: '客户涉税维护失败原请求序号', length: 50, type: 'input', span: 24 }
]

const workFields = [
  { key: 'customerCompanyName', label: '客户工作单位名称', length: 100, type: 'input', span: 24 },
  { key: 'customerCompanyIndustry', label: '客户工作单位行业分类', length: 5, type: 'select', span: 12 },
  { key: 'customerCompanyOccupation', label: '客户工作单位职业', length: 2, type: 'select', span: 12 },
  { key: 'customerCompanyEconomicType', label: '客户工作单位经济类型', length: 2, type: 'select', span: 12 },
  { key: 'customerCompanyPosition', label: '客户工作单位职务', length: 3, type: 'select', span: 12 },
  { key: 'customerWorkYears', label: '客户现职已工作年限', length: 2, type: 'input', span: 12 },
  { key: 'customerAnnualIncome', label: '客户年收入总额(万元)', length: 4, type: 'input', span: 12 },
  { key: 'customerSignDate', label: '客户签字日期', length: 10, type: 'date', span: 12 }
]

const marketingFields = [
  { key: 'marketingCode', label: 'CC(营销活动代号)', length: 18, type: 'input', span: 12 },
  { key: 'ucifOrgNo', label: '所属机构', length: 5, type: 'input', span: 12 },
  { key: 'marketingPersonCode', label: 'IN(营销人员代码)', length: 20, type: 'input', span: 12 },
  { key: 'partnerOrgCode', label: 'PN(联名机构代码)', length: 18, type: 'input', span: 12 },
  { key: 'externalIdCode', label: 'EX(外部识别码)', length: 18, type: 'input', span: 12 },
  { key: 'freeAnnualFeeType', label: '免年费类型', length: 1, type: 'select', span: 12 },
  { key: 'referrerMobile', label: '推荐人手机号', length: 11, type: 'input', span: 12 }
]

const getOptionLabel = (key) => {
  const options = fieldOptions[key] || []
  const value = formData[key]
  const option = options.find(opt => opt.value === value)
  return option ? option.label : (value || '')
}

const groupFieldsIntoRows = (fields) => {
  const rows = []
  let currentRow = []
  let currentSpan = 0
  for (const field of fields) {
    const span = field.span || 12
    if (currentSpan + span <= 24) {
      currentRow.push(field)
      currentSpan += span
    } else {
      rows.push(currentRow)
      currentRow = [field]
      currentSpan = span
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow)
  }
  return rows
}

const viewImages = () => {
  const applicationNo = formData.applicationId || route.query.applicationId || '202607020000000001'
  const viewUrl = `/scan/view-page?applicationNo=${applicationNo}`
  window.open(viewUrl, '_blank')
}

const openOperationRecords = () => {
  showOperationDrawer.value = true
}

const loadData = async () => {
  const applicationId = route.query.applicationId
  const res = await api.entryTransfer.detail({ applicationId })
  if (res.code === 200) {
    Object.assign(formData, res.data)
  } else {
    Object.assign(formData, {
      applicationType: '1',
      applicationId: applicationId || 'APP202607020001',
      applicationRequestType: '1',
      channelFlag: '0',
      newOldCustomerFlag: '0',
      downgradeFlag: '2',
      productCode: '0001',
      productName: '白金卡',
      applyOverdraftLimit: 'Y',
      billCardAddressSelect: '2',
      airlineMileAutoExchange: '1',
      memberNo: 'M123456789',
      foreignTransactionCurrency: '0',
      repaymentMethod: '1',
      autoRepaymentAmountSelect: '1',
      autoRepaymentAccountOption: '1',
      bankProvinceCity: '北京市',
      autoRepaymentForeignAccount: '',
      autoRepaymentRmbAccount: '6222021101001234567',
      contactName: '李四',
      contactTitle: '1',
      contactRelationship: '14',
      contactMobile: '13987654321',
      managerProvince: '110000',
      managerCity: '110100',
      managerAddress: '北京市西城区金融街8号',
      managerIdNumber: '110102198505056789',
      managerEmployeeNo: 'EMP006',
      customerName: '张三',
      customerNamePinyin: 'ZHANG SAN',
      customerBirthPlace: '北京市',
      customerBirthDate: '1990-01-01',
      customerGender: '1',
      customerNationality: 'CN',
      customerIdType: '01',
      customerIdNumber: '110101199001011234',
      customerIdExpireDate: '2036-01-01',
      permanentIdFlag: '0',
      secondIdType: '',
      secondIdNumber: '',
      secondIdStartDate: '',
      secondIdEndDate: '',
      customerMaritalStatus: '1',
      customerEducation: '21',
      customerMobile: '13812345678',
      customerIdIssueCount: '1',
      customerIdIssueDate: '2016-01-01',
      customerOverseasCountry1: '',
      customerOverseasCountry2: '',
      customerOverseasCountry3: '',
      customerExpectedCurrency: 'CNY',
      customerExpectedAmount: '50000',
      customerTaxResidentFlag: '1',
      customerBirthPlaceCountry: 'CN',
      customerBirthPlaceProvince: '110000',
      customerBirthPlaceCity: '110100',
      customerBirthPlaceDistrict: '',
      customerBirthPlaceAddress: '北京市朝阳区',
      customerCurrentResidenceCountry: 'CN',
      customerCurrentResidenceProvince: '110000',
      customerCurrentResidenceCity: '110100',
      customerCurrentResidenceDistrict: '',
      customerCurrentResidenceAddress: '北京市朝阳区建国路88号',
      customerTaxIdType1: '',
      customerTaxIdType2: '',
      customerTaxIdType3: '',
      customerTaxIdTIN1: '',
      customerTaxIdTIN2: '',
      customerTaxIdTIN3: '',
      customerTaxIdReason1: '',
      customerTaxIdReason2: '',
      customerTaxIdReason3: '',
      customerTaxReasonExplain1: '',
      customerTaxReasonExplain2: '',
      customerTaxReasonExplain3: '',
      customerTaxResidentCountry1: '',
      customerTaxResidentCountry2: '',
      customerTaxResidentCountry3: '',
      customerTaxFailedRequestNo: '',
      customerCompanyProvince: '110000',
      customerCompanyCity: '110100',
      customerCompanyDistrict: '',
      customerCompanyAddress: '北京市海淀区中关村大街1号',
      customerResidenceProvince: '110000',
      customerResidenceCity: '110100',
      customerResidenceDistrict: '',
      customerResidenceDetailAddress: '北京市朝阳区建国路88号',
      customerCompanyPhone: '010-12345678',
      customerCompanyExtension: '',
      customerCompanyCountryCode: '',
      customerCompanyAreaCode: '010',
      customerCompanyPostcode: '100080',
      customerLivingStatus: '1',
      customerCompanyName: '北京科技有限公司',
      customerCompanyIndustry: '02',
      customerCompanyOccupation: '02',
      customerCompanyEconomicType: '02',
      customerCompanyPosition: '02',
      customerWorkYears: '5',
      customerAnnualIncome: '20',
      customerSignDate: '2026-07-02',
      marketingCode: 'MK001',
      ucifOrgNo: 'ORG001',
      marketingPersonCode: 'MP001',
      partnerOrgCode: '',
      externalIdCode: '',
      freeAnnualFeeType: '1',
      referrerMobile: '13700000000'
    })
  }
}

const goBack = () => {
  const from = route.query.from
  if (from === 'reassign') {
    router.push('/entry/reassign')
  } else {
    router.push('/entry/closed')
  }
}

onMounted(loadData)
</script>

<style scoped>
.entry-form { padding: 20px; }
.form-card { margin-bottom: 20px; }
.form-section { margin-top: 20px; }
.header-actions { display: flex; gap: 10px; }
.operation-records { padding: 10px; }
.record-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
.record-item:last-child { border-bottom: none; }
.record-time { font-size: 12px; color: #999; margin-bottom: 4px; }
.record-content { font-size: 14px; color: #333; }
.record-operator { font-weight: bold; color: #409EFF; }
:deep(.el-card__header) { display: flex; justify-content: space-between; align-items: center; }
</style>