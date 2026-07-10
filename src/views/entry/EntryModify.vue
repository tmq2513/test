<template>
  <div class="entry-form">
    <el-card class="form-card">
      <template #header>
        <span>个人主申请信息修改</span>
        <el-button @click="goBack" text style="color: #fff; border-color: #fff;">返回</el-button>
      </template>
      <el-collapse v-model="activeCollapse" :accordion="false">
        <el-collapse-item title="申请信息" name="application">
          <el-form ref="formRefs.application" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(applicationFields)" :key="'app-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input' && field.editable" v-model="formData[field.key]" :maxlength="field.length" :disabled="!field.editable" :style="getFieldStyle(field.length, field.key)" />
                  <el-input v-else-if="field.type === 'input' && !field.editable" :value="formData[field.key]" disabled :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select' && field.editable" v-model="formData[field.key]" :disabled="!field.editable" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-input v-else-if="field.type === 'select' && !field.editable" :value="getOptionLabel(field.key)" disabled :style="getFieldStyle(field.length, field.key)" />
                  <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" type="date" value-format="YYYY-MM-DD" :disabled="!field.editable" :style="getFieldStyle(field.length, field.key, field.type)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="产品信息" name="product">
          <el-form ref="formRefs.product" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(productFields)" :key="'prod-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input' && field.editable" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-input v-else-if="field.type === 'input' && !field.editable" :value="formData[field.key]" disabled :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" type="date" value-format="YYYY-MM-DD" :style="getFieldStyle(field.length, field.key, field.type)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="账单还款" name="bill">
          <el-form ref="formRefs.bill" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(billFields)" :key="'bill-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="联系人信息" name="contact">
          <el-form ref="formRefs.contact" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(contactFields)" :key="'contact-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户经理信息" name="manager">
          <el-form ref="formRefs.manager" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(managerFields)" :key="'manager-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" type="date" value-format="YYYY-MM-DD" :style="getFieldStyle(field.length, field.key, field.type)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户基本信息" name="customer">
          <el-form ref="formRefs.customer" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(customerFields)" :key="'customer-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" type="date" value-format="YYYY-MM-DD" :style="getFieldStyle(field.length, field.key, field.type)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="税务信息" name="tax">
          <el-form ref="formRefs.tax" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(taxFields)" :key="'tax-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key" v-show="!field.conditionalShow || shouldShowTaxField()">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户地址信息" name="address">
          <el-form ref="formRefs.address" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(addressFields)" :key="'address-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="客户工作信息" name="work">
          <el-form ref="formRefs.work" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(workFields)" :key="'work-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" type="date" value-format="YYYY-MM-DD" :style="getFieldStyle(field.length, field.key, field.type)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="营销信息" name="marketing">
          <el-form ref="formRefs.marketing" :model="formData" :rules="formRules" label-width="180px" class="form-section">
            <el-row :gutter="20" v-for="(row, rowIndex) in groupFieldsIntoRows(marketingFields)" :key="'marketing-row-' + rowIndex">
              <el-col v-for="field in row" :key="field.key" :span="field.span || 12">
                <el-form-item :label="field.label" :prop="field.key">
                  <el-input v-if="field.type === 'input'" v-model="formData[field.key]" :maxlength="field.length" :style="getFieldStyle(field.length, field.key)" />
                  <el-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :style="getFieldStyle(field.length, field.key)" placeholder="请选择">
                    <el-option v-for="opt in getOptions(field.key)" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <div class="form-actions">
      <el-button @click="validateData">数据校验</el-button>
      <el-button @click="viewImages">影像查看</el-button>
      <el-button @click="openProductDialog">修改产品</el-button>
      <el-button @click="saveForm">数据保存</el-button>
      <el-button @click="openOperationRecords">操作记录</el-button>
    </div>

    <el-dialog :title="productDialogTitle" v-model="showProductDialog" width="700px" append-to-body>
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
        <el-button @click="closeProductDialog">关闭</el-button>
      </template>
    </el-dialog>

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
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElDialog, ElDrawer } from 'element-plus'
import api from '@/api'

const formRefs = {
  application: ref(null),
  product: ref(null),
  bill: ref(null),
  contact: ref(null),
  manager: ref(null),
  customer: ref(null),
  tax: ref(null),
  address: ref(null),
  work: ref(null),
  marketing: ref(null)
}

const validateCustomerName = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('客户姓名不能为空'))
    return
  }
  
  const trimmedValue = value.trim()
  
  if (/^[\u3000]+$/.test(trimmedValue)) {
    callback(new Error('客户姓名不能全为全角空格'))
    return
  }
  
  const idType = formData.customerIdType
  const restrictedIdTypes = ['01', '02', '03', '04', '96', '97', '98']
  
  if (restrictedIdTypes.includes(idType)) {
    if (/[\d\sA-Za-z]/.test(trimmedValue)) {
      callback(new Error('证件类型为身份证、军人证、武警证、户口簿、港澳居民居住证、台湾居民居住证的客户，姓名中不能含有数字、空格或字母'))
      return
    }
  }
  
  if (idType === '01') {
    if (/boc/i.test(trimmedValue)) {
      callback(new Error('当证件类型是身份证时，客户姓名不能含有"BOC"或"boc"'))
      return
    }
  }
  
  const halfWidthIllegalChars = /[?!@#$%^&*()\/'，'、]/
  const fullWidthIllegalChars = /[“”！？￥＊（）｜×]/
  
  if (halfWidthIllegalChars.test(trimmedValue) || fullWidthIllegalChars.test(trimmedValue)) {
    callback(new Error('客户姓名不能包含非法字符：半角的? ! @ # $ % ^ & * ( ) / \' ， \' 、或全角的“ ” ！ ？ ￥ ＊ （ ） ｜ ×'))
    return
  }
  
  if (/^[.。]|(?:[.。])$/.test(trimmedValue)) {
    callback(new Error('客户姓名不能以"."或"。"开头或结尾'))
    return
  }
  
  if (/^\d+$/.test(trimmedValue)) {
    callback(new Error('客户姓名不能全部为数字'))
    return
  }
  
  if (/^(.)\1+$/.test(trimmedValue)) {
    callback(new Error('客户姓名不能为重复的同一字母'))
    return
  }
  
  if (/A股|B股|H股/.test(trimmedValue)) {
    callback(new Error('客户姓名中不能包含A股、B股、H股'))
    return
  }
  
  callback()
}

const validateCustomerGender = (rule, value, callback) => {
  const idType = formData.customerIdType
  const idNumber = formData.customerIdNumber
  
  if (idType === '01' && idNumber && idNumber.length === 18) {
    const secondLastDigit = parseInt(idNumber.charAt(idNumber.length - 2))
    const expectedGender = secondLastDigit % 2 === 1 ? '1' : '0'
    
    if (value !== expectedGender) {
      callback(new Error(`身份证号码倒数第二位为${secondLastDigit}，${secondLastDigit % 2 === 1 ? '必须是男性' : '必须是女性'}`))
      return
    }
  }
  
  callback()
}

const validateCustomerNationality = (rule, value, callback) => {
  const idType = formData.customerIdType
  
  if (!idType || !value) {
    callback()
    return
  }
  
  const nationalityMap = {
    '03': ['CN', 'HK', 'TW', 'MO'],
    '09': ['CN', 'HK', 'TW', 'MO'],
    '01': ['CN'],
    '47': ['HK'],
    '96': ['HK'],
    '48': ['MO'],
    '97': ['MO'],
    '49': ['TW'],
    '98': ['TW']
  }
  
  if (nationalityMap[idType]) {
    const restricted = nationalityMap[idType]
    
    if (idType === '03' || idType === '09') {
      if (restricted.includes(value)) {
        callback(new Error('护照或外国人居留许可证持有者，国籍不可为中国（包含香港、台湾、澳门）'))
        return
      }
    } else {
      if (!restricted.includes(value)) {
        const idTypeLabel = fieldOptions.customerIdType.find(o => o.value === idType)?.label || ''
        const expectedLabel = {
          '01': '中国',
          '47': '中国香港',
          '96': '中国香港',
          '48': '中国澳门',
          '97': '中国澳门',
          '49': '中国台湾',
          '98': '中国台湾'
        }[idType]
        
        callback(new Error(`${idTypeLabel}持有者，国籍必须为${expectedLabel}`))
        return
      }
    }
  }
  
  callback()
}

const validateSecondIdType = (rule, value, callback) => {
  const idType = formData.customerIdType
  
  if (['96', '97', '98'].includes(idType)) {
    if (!value) {
      callback(new Error('客户证件类型为港澳居民居住证或台湾居民居住证时，第二客户证件类型为必填项'))
      return
    }
    
    const validTypes = ['47', '48', '49']
    if (!validTypes.includes(value)) {
      callback(new Error('第二客户证件类型只能选择：港澳居民来往内地通行证（香港）、港澳居民来往内地通行证（澳门）或台湾居民来往大陆通行证'))
      return
    }
  }
  
  callback()
}

const validateCustomerTaxResidentFlag = (rule, value, callback) => {
  if (value !== '1') {
    const requiredFields = [
      'customerCurrentResidenceCountry',
      'customerBirthPlaceCountry',
      'customerTaxResidentCountry1'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldInfo = taxFields.find(f => f.key === field)
        const fieldLabel = fieldInfo?.label || field
        callback(new Error(`当非"仅为中国税收居民"时，${fieldLabel}不能为空`))
        return
      }
    }
  }
  
  callback()
}

const validateTaxIdType = (rule, value, callback, tinField) => {
  if (value && !formData[tinField]) {
    callback(new Error('当纳税人识别号类型不为空时，纳税人识别号不能为空'))
    return
  }
  
  if (!value && formData[tinField]) {
    callback(new Error('当纳税人识别号类型为空时，纳税人识别号也必须为空'))
    return
  }
  
  callback()
}

const validateTaxIdReason = (rule, value, callback, reasonField, explainField) => {
  const tinValue = formData[reasonField.replace('Reason', 'TIN')]
  
  if (!tinValue) {
    if (!formData[reasonField] && !formData[explainField]) {
      callback(new Error('当纳税人识别号为空时，"居民国（地区）不发放纳税人识别号"和"因原因未能取得纳税人识别号"不能同时为空'))
      return
    }
    
    if (!formData[reasonField] && formData[explainField]) {
      callback(new Error('当"居民国（地区）不发放纳税人识别号"为空时，原因说明不能为空'))
      return
    }
  } else {
    if (formData[reasonField]) {
      callback(new Error('当纳税人识别号不为空时，"居民国（地区）不发放纳税人识别号"必须为空'))
      return
    }
    
    if (formData[explainField]) {
      callback(new Error('当纳税人识别号不为空时，"因原因未能取得纳税人识别号"必须为空'))
      return
    }
  }
  
  callback()
}

const validateCompanyName = (rule, value, callback) => {
  const occupation = formData.customerCompanyOccupation
  const nonRequiredOccupations = ['04', '05', '06', '07']
  
  if (!nonRequiredOccupations.includes(occupation) && (!value || value.trim() === '')) {
    callback(new Error('当职业信息不是其他、学生、无业人员、家庭主妇时，客户工作单位名称不能为空'))
    return
  }
  
  if (value && value.trim()) {
    const trimmedValue = value.trim()
    
    if (trimmedValue.length < 2) {
      callback(new Error('客户工作单位名称长度不能小于2个字符'))
      return
    }
    
    if (/^\d+$/.test(trimmedValue) || /^(.)\1+$/.test(trimmedValue)) {
      callback(new Error('客户工作单位名称不能全部为数字或重复的相同字母'))
      return
    }
    
    if (/\n/.test(trimmedValue)) {
      callback(new Error('客户工作单位名称不能包含换行符'))
      return
    }
  }
  
  callback()
}

const validateWorkYears = (rule, value, callback) => {
  if (value) {
    if (!/^\d+$/.test(value)) {
      callback(new Error('客户现职已工作年限必须为整数，不支持小数'))
      return
    }
  }
  
  callback()
}

const validateAutoRepaymentAmount = (rule, value, callback) => {
  if (formData.repaymentMethod === '1' && !value) {
    callback(new Error('当还款方式为自动还款时，自动还款还款金额选择为必填项'))
    return
  }
  
  callback()
}

const validateAutoRepaymentAccount = (rule, value, callback) => {
  if (formData.repaymentMethod === '1' && !value) {
    callback(new Error('当还款方式为自动还款时，自动还款还款帐户选项为必填项'))
    return
  }
  
  callback()
}

const formRules = {
  customerName: [{ validator: validateCustomerName, trigger: 'blur' }],
  customerGender: [{ validator: validateCustomerGender, trigger: 'change' }],
  customerNationality: [{ validator: validateCustomerNationality, trigger: 'change' }],
  secondIdType: [{ validator: validateSecondIdType, trigger: 'change' }],
  customerTaxResidentFlag: [{ validator: validateCustomerTaxResidentFlag, trigger: 'change' }],
  customerTaxIdType1: [{ validator: (r, v, c) => validateTaxIdType(r, v, c, 'customerTaxIdTIN1'), trigger: 'change' }],
  customerTaxIdType2: [{ validator: (r, v, c) => validateTaxIdType(r, v, c, 'customerTaxIdTIN2'), trigger: 'change' }],
  customerTaxIdType3: [{ validator: (r, v, c) => validateTaxIdType(r, v, c, 'customerTaxIdTIN3'), trigger: 'change' }],
  customerTaxIdReason1: [{ validator: (r, v, c) => validateTaxIdReason(r, v, c, 'customerTaxIdReason1', 'customerTaxReasonExplain1'), trigger: 'change' }],
  customerTaxIdReason2: [{ validator: (r, v, c) => validateTaxIdReason(r, v, c, 'customerTaxIdReason2', 'customerTaxReasonExplain2'), trigger: 'change' }],
  customerTaxIdReason3: [{ validator: (r, v, c) => validateTaxIdReason(r, v, c, 'customerTaxIdReason3', 'customerTaxReasonExplain3'), trigger: 'change' }],
  customerCompanyName: [{ validator: validateCompanyName, trigger: 'blur' }],
  customerWorkYears: [{ validator: validateWorkYears, trigger: 'blur' }],
  autoRepaymentAmountSelect: [{ validator: validateAutoRepaymentAmount, trigger: 'change' }],
  autoRepaymentAccountOption: [{ validator: validateAutoRepaymentAccount, trigger: 'change' }]
}

const router = useRouter()
const route = useRoute()
const activeCollapse = ref(['application', 'product', 'bill', 'contact', 'manager', 'customer', 'tax', 'address', 'work', 'marketing'])

const formData = reactive({
  applicationType: '',
  applicationId: '',
  applicationRequestType: '',
  channelFlag: '',
  newOldCustomerFlag: '',
  downgradeFlag: '',
  productCode: '',
  productName: '',
  applyOverdraftLimit: 'Y',
  billCardAddressSelect: '',
  airlineMileAutoExchange: '',
  memberNo: '',
  foreignTransactionCurrency: '0',
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
  customerTaxResidentFlag: '1',
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

const cityData = {
  '110000': [{ label: '东城区', value: '110101' }, { label: '西城区', value: '110102' }, { label: '朝阳区', value: '110105' }, { label: '海淀区', value: '110108' }, { label: '丰台区', value: '110106' }, { label: '石景山区', value: '110107' }, { label: '通州区', value: '110112' }, { label: '顺义区', value: '110113' }, { label: '昌平区', value: '110114' }, { label: '大兴区', value: '110115' }, { label: '房山区', value: '110111' }, { label: '门头沟区', value: '110109' }, { label: '怀柔区', value: '110116' }, { label: '平谷区', value: '110117' }, { label: '密云区', value: '110118' }, { label: '延庆区', value: '110119' }],
  '120000': [{ label: '和平区', value: '120101' }, { label: '河东区', value: '120102' }, { label: '河西区', value: '120103' }, { label: '南开区', value: '120104' }, { label: '河北区', value: '120105' }, { label: '红桥区', value: '120106' }, { label: '东丽区', value: '120110' }, { label: '西青区', value: '120111' }, { label: '津南区', value: '120112' }, { label: '北辰区', value: '120113' }, { label: '武清区', value: '120114' }, { label: '宝坻区', value: '120115' }, { label: '滨海新区', value: '120116' }, { label: '宁河区', value: '120117' }, { label: '静海区', value: '120118' }, { label: '蓟州区', value: '120119' }],
  '310000': [{ label: '黄浦区', value: '310101' }, { label: '徐汇区', value: '310104' }, { label: '长宁区', value: '310105' }, { label: '静安区', value: '310106' }, { label: '普陀区', value: '310107' }, { label: '虹口区', value: '310109' }, { label: '杨浦区', value: '310110' }, { label: '闵行区', value: '310112' }, { label: '宝山区', value: '310113' }, { label: '嘉定区', value: '310114' }, { label: '浦东新区', value: '310115' }, { label: '金山区', value: '310116' }, { label: '松江区', value: '310117' }, { label: '青浦区', value: '310118' }, { label: '奉贤区', value: '310120' }, { label: '崇明区', value: '310151' }],
  '500000': [{ label: '万州区', value: '500101' }, { label: '涪陵区', value: '500102' }, { label: '渝中区', value: '500103' }, { label: '大渡口区', value: '500104' }, { label: '江北区', value: '500105' }, { label: '沙坪坝区', value: '500106' }, { label: '九龙坡区', value: '500107' }, { label: '南岸区', value: '500108' }, { label: '北碚区', value: '500109' }, { label: '万盛经开区', value: '500110' }, { label: '双桥区', value: '500111' }, { label: '渝北区', value: '500112' }, { label: '巴南区', value: '500113' }, { label: '黔江区', value: '500114' }, { label: '长寿区', value: '500115' }, { label: '江津区', value: '500116' }, { label: '合川区', value: '500117' }, { label: '永川区', value: '500118' }, { label: '南川区', value: '500119' }, { label: '綦江区', value: '500120' }, { label: '大足区', value: '500121' }, { label: '璧山区', value: '500122' }, { label: '铜梁区', value: '500151' }, { label: '潼南区', value: '500152' }, { label: '荣昌区', value: '500153' }, { label: '开州区', value: '500154' }, { label: '梁平区', value: '500155' }, { label: '武隆区', value: '500156' }],
  '130000': [{ label: '石家庄市', value: '130100' }, { label: '唐山市', value: '130200' }, { label: '秦皇岛市', value: '130300' }, { label: '邯郸市', value: '130400' }, { label: '邢台市', value: '130500' }, { label: '保定市', value: '130600' }, { label: '张家口市', value: '130700' }, { label: '承德市', value: '130800' }, { label: '沧州市', value: '130900' }, { label: '廊坊市', value: '131000' }, { label: '衡水市', value: '131100' }],
  '140000': [{ label: '太原市', value: '140100' }, { label: '大同市', value: '140200' }, { label: '阳泉市', value: '140300' }, { label: '长治市', value: '140400' }, { label: '晋城市', value: '140500' }, { label: '朔州市', value: '140600' }, { label: '晋中市', value: '140700' }, { label: '运城市', value: '140800' }, { label: '忻州市', value: '140900' }, { label: '临汾市', value: '141000' }, { label: '吕梁市', value: '141100' }],
  '150000': [{ label: '呼和浩特市', value: '150100' }, { label: '包头市', value: '150200' }, { label: '乌海市', value: '150300' }, { label: '赤峰市', value: '150400' }, { label: '通辽市', value: '150500' }, { label: '鄂尔多斯市', value: '150600' }, { label: '呼伦贝尔市', value: '150700' }, { label: '巴彦淖尔市', value: '150800' }, { label: '乌兰察布市', value: '150900' }, { label: '兴安盟', value: '152200' }, { label: '锡林郭勒盟', value: '152500' }, { label: '阿拉善盟', value: '152900' }],
  '210000': [{ label: '沈阳市', value: '210100' }, { label: '大连市', value: '210200' }, { label: '鞍山市', value: '210300' }, { label: '抚顺市', value: '210400' }, { label: '本溪市', value: '210500' }, { label: '丹东市', value: '210600' }, { label: '锦州市', value: '210700' }, { label: '营口市', value: '210800' }, { label: '阜新市', value: '210900' }, { label: '辽阳市', value: '211000' }, { label: '盘锦市', value: '211100' }, { label: '铁岭市', value: '211200' }, { label: '朝阳市', value: '211300' }, { label: '葫芦岛市', value: '211400' }],
  '220000': [{ label: '长春市', value: '220100' }, { label: '吉林市', value: '220200' }, { label: '四平市', value: '220300' }, { label: '辽源市', value: '220400' }, { label: '通化市', value: '220500' }, { label: '白山市', value: '220600' }, { label: '松原市', value: '220700' }, { label: '白城市', value: '220800' }, { label: '延边朝鲜族自治州', value: '222400' }],
  '230000': [{ label: '哈尔滨市', value: '230100' }, { label: '齐齐哈尔市', value: '230200' }, { label: '鸡西市', value: '230300' }, { label: '鹤岗市', value: '230400' }, { label: '双鸭山市', value: '230500' }, { label: '大庆市', value: '230600' }, { label: '伊春市', value: '230700' }, { label: '佳木斯市', value: '230800' }, { label: '七台河市', value: '230900' }, { label: '牡丹江市', value: '231000' }, { label: '黑河市', value: '231100' }, { label: '绥化市', value: '231200' }, { label: '大兴安岭地区', value: '232700' }],
  '320000': [{ label: '南京市', value: '320100' }, { label: '无锡市', value: '320200' }, { label: '徐州市', value: '320300' }, { label: '常州市', value: '320400' }, { label: '苏州市', value: '320500' }, { label: '南通市', value: '320600' }, { label: '连云港市', value: '320700' }, { label: '淮安市', value: '320800' }, { label: '盐城市', value: '320900' }, { label: '扬州市', value: '321000' }, { label: '镇江市', value: '321100' }, { label: '泰州市', value: '321200' }, { label: '宿迁市', value: '321300' }],
  '330000': [{ label: '杭州市', value: '330100' }, { label: '宁波市', value: '330200' }, { label: '温州市', value: '330300' }, { label: '嘉兴市', value: '330400' }, { label: '湖州市', value: '330500' }, { label: '绍兴市', value: '330600' }, { label: '金华市', value: '330700' }, { label: '衢州市', value: '330800' }, { label: '舟山市', value: '330900' }, { label: '台州市', value: '331000' }, { label: '丽水市', value: '331100' }],
  '340000': [{ label: '合肥市', value: '340100' }, { label: '芜湖市', value: '340200' }, { label: '蚌埠市', value: '340300' }, { label: '淮南市', value: '340400' }, { label: '马鞍山市', value: '340500' }, { label: '淮北市', value: '340600' }, { label: '铜陵市', value: '340700' }, { label: '安庆市', value: '340800' }, { label: '黄山市', value: '341000' }, { label: '滁州市', value: '341100' }, { label: '阜阳市', value: '341200' }, { label: '宿州市', value: '341300' }, { label: '六安市', value: '341500' }, { label: '亳州市', value: '341600' }, { label: '池州市', value: '341700' }, { label: '宣城市', value: '341800' }],
  '350000': [{ label: '福州市', value: '350100' }, { label: '厦门市', value: '350200' }, { label: '莆田市', value: '350300' }, { label: '三明市', value: '350400' }, { label: '泉州市', value: '350500' }, { label: '漳州市', value: '350600' }, { label: '南平市', value: '350700' }, { label: '龙岩市', value: '350800' }, { label: '宁德市', value: '350900' }],
  '360000': [{ label: '南昌市', value: '360100' }, { label: '景德镇市', value: '360200' }, { label: '萍乡市', value: '360300' }, { label: '九江市', value: '360400' }, { label: '新余市', value: '360500' }, { label: '鹰潭市', value: '360600' }, { label: '赣州市', value: '360700' }, { label: '吉安市', value: '360800' }, { label: '宜春市', value: '360900' }, { label: '抚州市', value: '361000' }, { label: '上饶市', value: '361100' }],
  '370000': [{ label: '济南市', value: '370100' }, { label: '青岛市', value: '370200' }, { label: '淄博市', value: '370300' }, { label: '枣庄市', value: '370400' }, { label: '东营市', value: '370500' }, { label: '烟台市', value: '370600' }, { label: '潍坊市', value: '370700' }, { label: '济宁市', value: '370800' }, { label: '泰安市', value: '370900' }, { label: '威海市', value: '371000' }, { label: '日照市', value: '371100' }, { label: '莱芜市', value: '371200' }, { label: '临沂市', value: '371300' }, { label: '德州市', value: '371400' }, { label: '聊城市', value: '371500' }, { label: '滨州市', value: '371600' }, { label: '菏泽市', value: '371700' }],
  '410000': [{ label: '郑州市', value: '410100' }, { label: '开封市', value: '410200' }, { label: '洛阳市', value: '410300' }, { label: '平顶山市', value: '410400' }, { label: '安阳市', value: '410500' }, { label: '鹤壁市', value: '410600' }, { label: '新乡市', value: '410700' }, { label: '焦作市', value: '410800' }, { label: '濮阳市', value: '410900' }, { label: '许昌市', value: '411000' }, { label: '漯河市', value: '411100' }, { label: '三门峡市', value: '411200' }, { label: '南阳市', value: '411300' }, { label: '商丘市', value: '411400' }, { label: '信阳市', value: '411500' }, { label: '周口市', value: '411600' }, { label: '驻马店市', value: '411700' }],
  '420000': [{ label: '武汉市', value: '420100' }, { label: '黄石市', value: '420200' }, { label: '十堰市', value: '420300' }, { label: '宜昌市', value: '420500' }, { label: '襄阳市', value: '420600' }, { label: '鄂州市', value: '420700' }, { label: '荆门市', value: '420800' }, { label: '孝感市', value: '420900' }, { label: '荆州市', value: '421000' }, { label: '黄冈市', value: '421100' }, { label: '咸宁市', value: '421200' }, { label: '随州市', value: '421300' }, { label: '恩施土家族苗族自治州', value: '422800' }, { label: '仙桃市', value: '429004' }, { label: '潜江市', value: '429005' }, { label: '天门市', value: '429006' }],
  '430000': [{ label: '长沙市', value: '430100' }, { label: '株洲市', value: '430200' }, { label: '湘潭市', value: '430300' }, { label: '衡阳市', value: '430400' }, { label: '邵阳市', value: '430500' }, { label: '岳阳市', value: '430600' }, { label: '常德市', value: '430700' }, { label: '张家界市', value: '430800' }, { label: '益阳市', value: '430900' }, { label: '郴州市', value: '431000' }, { label: '永州市', value: '431100' }, { label: '怀化市', value: '431200' }, { label: '娄底市', value: '431300' }, { label: '湘西土家族苗族自治州', value: '433100' }],
  '440000': [{ label: '广州市', value: '440100' }, { label: '韶关市', value: '440200' }, { label: '深圳市', value: '440300' }, { label: '珠海市', value: '440400' }, { label: '汕头市', value: '440500' }, { label: '佛山市', value: '440600' }, { label: '江门市', value: '440700' }, { label: '湛江市', value: '440800' }, { label: '茂名市', value: '440900' }, { label: '肇庆市', value: '441200' }, { label: '惠州市', value: '441300' }, { label: '梅州市', value: '441400' }, { label: '汕尾市', value: '441500' }, { label: '河源市', value: '441600' }, { label: '阳江市', value: '441700' }, { label: '清远市', value: '441800' }, { label: '东莞市', value: '441900' }, { label: '中山市', value: '442000' }, { label: '潮州市', value: '445100' }, { label: '揭阳市', value: '445200' }, { label: '云浮市', value: '445300' }],
  '450000': [{ label: '南宁市', value: '450100' }, { label: '柳州市', value: '450200' }, { label: '桂林市', value: '450300' }, { label: '梧州市', value: '450400' }, { label: '北海市', value: '450500' }, { label: '防城港市', value: '450600' }, { label: '钦州市', value: '450700' }, { label: '贵港市', value: '450800' }, { label: '玉林市', value: '450900' }, { label: '百色市', value: '451000' }, { label: '贺州市', value: '451100' }, { label: '河池市', value: '451200' }, { label: '来宾市', value: '451300' }, { label: '崇左市', value: '451400' }],
  '460000': [{ label: '海口市', value: '460100' }, { label: '三亚市', value: '460200' }, { label: '三沙市', value: '460300' }, { label: '儋州市', value: '460400' }],
  '510000': [{ label: '成都市', value: '510100' }, { label: '自贡市', value: '510300' }, { label: '攀枝花市', value: '510400' }, { label: '泸州市', value: '510500' }, { label: '德阳市', value: '510600' }, { label: '绵阳市', value: '510700' }, { label: '广元市', value: '510800' }, { label: '遂宁市', value: '510900' }, { label: '内江市', value: '511000' }, { label: '乐山市', value: '511100' }, { label: '南充市', value: '511300' }, { label: '眉山市', value: '511400' }, { label: '宜宾市', value: '511500' }, { label: '广安市', value: '511600' }, { label: '达州市', value: '511700' }, { label: '雅安市', value: '511800' }, { label: '巴中市', value: '511900' }, { label: '资阳市', value: '512000' }, { label: '阿坝藏族羌族自治州', value: '513200' }, { label: '甘孜藏族自治州', value: '513300' }, { label: '凉山彝族自治州', value: '513400' }],
  '520000': [{ label: '贵阳市', value: '520100' }, { label: '六盘水市', value: '520200' }, { label: '遵义市', value: '520300' }, { label: '安顺市', value: '520400' }, { label: '毕节市', value: '520500' }, { label: '铜仁市', value: '520600' }, { label: '黔西南布依族苗族自治州', value: '522300' }, { label: '黔东南苗族侗族自治州', value: '522600' }, { label: '黔南布依族苗族自治州', value: '522700' }],
  '530000': [{ label: '昆明市', value: '530100' }, { label: '曲靖市', value: '530300' }, { label: '玉溪市', value: '530400' }, { label: '保山市', value: '530500' }, { label: '昭通市', value: '530600' }, { label: '丽江市', value: '530700' }, { label: '普洱市', value: '530800' }, { label: '临沧市', value: '530900' }, { label: '楚雄彝族自治州', value: '532300' }, { label: '红河哈尼族彝族自治州', value: '532500' }, { label: '文山壮族苗族自治州', value: '532600' }, { label: '西双版纳傣族自治州', value: '532800' }, { label: '大理白族自治州', value: '532900' }, { label: '德宏傣族景颇族自治州', value: '533100' }, { label: '怒江傈僳族自治州', value: '533300' }, { label: '迪庆藏族自治州', value: '533400' }],
  '540000': [{ label: '拉萨市', value: '540100' }, { label: '日喀则市', value: '540200' }, { label: '昌都市', value: '540300' }, { label: '林芝市', value: '540400' }, { label: '山南市', value: '540500' }, { label: '那曲市', value: '540600' }, { label: '阿里地区', value: '542500' }],
  '610000': [{ label: '西安市', value: '610100' }, { label: '铜川市', value: '610200' }, { label: '宝鸡市', value: '610300' }, { label: '咸阳市', value: '610400' }, { label: '渭南市', value: '610500' }, { label: '延安市', value: '610600' }, { label: '汉中市', value: '610700' }, { label: '榆林市', value: '610800' }, { label: '安康市', value: '610900' }, { label: '商洛市', value: '611000' }],
  '620000': [{ label: '兰州市', value: '620100' }, { label: '嘉峪关市', value: '620200' }, { label: '金昌市', value: '620300' }, { label: '白银市', value: '620400' }, { label: '天水市', value: '620500' }, { label: '酒泉市', value: '620900' }, { label: '张掖市', value: '620700' }, { label: '武威市', value: '620600' }, { label: '定西市', value: '621100' }, { label: '陇南市', value: '621200' }, { label: '平凉市', value: '620800' }, { label: '庆阳市', value: '621000' }, { label: '临夏回族自治州', value: '622900' }, { label: '甘南藏族自治州', value: '623000' }],
  '630000': [{ label: '西宁市', value: '630100' }, { label: '海东市', value: '630200' }, { label: '海北藏族自治州', value: '632200' }, { label: '黄南藏族自治州', value: '632300' }, { label: '海南藏族自治州', value: '632500' }, { label: '果洛藏族自治州', value: '632600' }, { label: '玉树藏族自治州', value: '632700' }, { label: '海西蒙古族藏族自治州', value: '632800' }],
  '640000': [{ label: '银川市', value: '640100' }, { label: '石嘴山市', value: '640200' }, { label: '吴忠市', value: '640300' }, { label: '固原市', value: '640400' }, { label: '中卫市', value: '640500' }],
  '650000': [{ label: '乌鲁木齐市', value: '650100' }, { label: '克拉玛依市', value: '650200' }, { label: '吐鲁番市', value: '650400' }, { label: '哈密市', value: '650500' }, { label: '昌吉回族自治州', value: '652300' }, { label: '博尔塔拉蒙古自治州', value: '652700' }, { label: '巴音郭楞蒙古自治州', value: '652800' }, { label: '阿克苏地区', value: '652900' }, { label: '克孜勒苏柯尔克孜自治州', value: '653000' }, { label: '喀什地区', value: '653100' }, { label: '和田地区', value: '653200' }, { label: '伊犁哈萨克自治州', value: '654000' }, { label: '塔城地区', value: '654200' }, { label: '阿勒泰地区', value: '654300' }]
}

const managerCityOptions = ref([])
const birthPlaceProvinceOptions = ref([])
const birthPlaceCityOptions = ref([])
const birthPlaceDistrictOptions = ref([])
const residenceProvinceOptions = ref([])
const residenceCityOptions = ref([])
const residenceDistrictOptions = ref([])
const companyProvinceOptions = ref([])
const companyCityOptions = ref([])
const companyDistrictOptions = ref([])
const livingProvinceOptions = ref([])
const livingCityOptions = ref([])
const livingDistrictOptions = ref([])

const showProductDialog = ref(false)
const showOperationDrawer = ref(false)

const productDialogTitle = ref('产品选择')
const productList = ref([])
const productSearchForm = reactive({
  productCode: '',
  productName: ''
})

const operationRecords = ref([
  { time: '2026-07-02 10:30:00', operator: 'EMP001', content: '创建申请单' },
  { time: '2026-07-02 11:15:00', operator: 'EMP002', content: '录入客户基本信息' },
  { time: '2026-07-02 14:20:00', operator: 'EMP002', content: '录入申请信息' },
  { time: '2026-07-02 15:45:00', operator: 'EMP003', content: '数据校验通过' },
  { time: '2026-07-03 09:30:00', operator: 'EMP004', content: '修改客户信息' }
])

const viewImages = () => {
  const applicationNo = formData.applicationId || '202607020000000001'
  const viewUrl = `/scan/view-page?applicationNo=${applicationNo}`
  window.open(viewUrl, '_blank')
}

const openProductDialog = async () => {
  const cardFlag = formData.applicationType === '1' ? '主' : '附'
  productDialogTitle.value = cardFlag === '主' ? '个人卡主卡产品选择' : '个人卡附卡产品选择'
  productSearchForm.productCode = ''
  productSearchForm.productName = ''
  await loadProductList()
  showProductDialog.value = true
}

const closeProductDialog = () => {
  showProductDialog.value = false
}

const loadProductList = async () => {
  const cardFlag = formData.applicationType === '1' ? '主' : '附'
  const params = {
    cardFlag: cardFlag,
    productCode: productSearchForm.productCode,
    productName: productSearchForm.productName
  }
  const res = await api.products.personal(params)
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
  formData.productCode = product.productCode
  formData.productName = product.productName
  ElMessage.success('产品修改成功')
  showProductDialog.value = false
}

const openOperationRecords = () => {
  showOperationDrawer.value = true
}

const provinceData = {
  'CN': [{ label: '北京市', value: '110000' }, { label: '天津市', value: '120000' }, { label: '河北省', value: '130000' }, { label: '山西省', value: '140000' }, { label: '内蒙古自治区', value: '150000' }, { label: '辽宁省', value: '210000' }, { label: '吉林省', value: '220000' }, { label: '黑龙江省', value: '230000' }, { label: '上海市', value: '310000' }, { label: '江苏省', value: '320000' }, { label: '浙江省', value: '330000' }, { label: '安徽省', value: '340000' }, { label: '福建省', value: '350000' }, { label: '江西省', value: '360000' }, { label: '山东省', value: '370000' }, { label: '河南省', value: '410000' }, { label: '湖北省', value: '420000' }, { label: '湖南省', value: '430000' }, { label: '广东省', value: '440000' }, { label: '广西壮族自治区', value: '450000' }, { label: '海南省', value: '460000' }, { label: '重庆市', value: '500000' }, { label: '四川省', value: '510000' }, { label: '贵州省', value: '520000' }, { label: '云南省', value: '530000' }, { label: '西藏自治区', value: '540000' }, { label: '陕西省', value: '610000' }, { label: '甘肃省', value: '620000' }, { label: '青海省', value: '630000' }, { label: '宁夏回族自治区', value: '640000' }, { label: '新疆维吾尔自治区', value: '650000' }],
  'US': [{ label: '加利福尼亚州', value: 'CA' }, { label: '纽约州', value: 'NY' }, { label: '德克萨斯州', value: 'TX' }, { label: '佛罗里达州', value: 'FL' }, { label: '伊利诺伊州', value: 'IL' }],
  'JP': [{ label: '东京都', value: '13' }, { label: '大阪府', value: '27' }, { label: '京都府', value: '26' }, { label: '神奈川县', value: '14' }, { label: '爱知县', value: '23' }],
  'KR': [{ label: '首尔特别市', value: '11' }, { label: '京畿道', value: '41' }, { label: '釜山广域市', value: '26' }, { label: '大邱广域市', value: '27' }, { label: '仁川广域市', value: '28' }],
  'GB': [{ label: '英格兰', value: 'ENG' }, { label: '苏格兰', value: 'SCO' }, { label: '威尔士', value: 'WAL' }, { label: '北爱尔兰', value: 'NIR' }],
  'AU': [{ label: '新南威尔士州', value: 'NSW' }, { label: '维多利亚州', value: 'VIC' }, { label: '昆士兰州', value: 'QLD' }, { label: '西澳大利亚州', value: 'WA' }, { label: '南澳大利亚州', value: 'SA' }]
}

const districtData = {
  '110101': [{ label: '东华门街道', value: '110101001' }, { label: '景山街道', value: '110101002' }, { label: '交道口街道', value: '110101003' }, { label: '安定门街道', value: '110101004' }, { label: '北新桥街道', value: '110101005' }],
  '110102': [{ label: '西长安街街道', value: '110102001' }, { label: '大栅栏街道', value: '110102002' }, { label: '椿树街道', value: '110102003' }, { label: '陶然亭街道', value: '110102004' }, { label: '广安门内街道', value: '110102005' }],
  '310101': [{ label: '南京东路街道', value: '310101001' }, { label: '外滩街道', value: '310101002' }, { label: '瑞金二路街道', value: '310101003' }, { label: '淮海中路街道', value: '310101004' }, { label: '豫园街道', value: '310101005' }],
  '440103': [{ label: '洪桥街道', value: '440103001' }, { label: '广卫街道', value: '440103002' }, { label: '华林街道', value: '440103003' }, { label: '多宝街道', value: '440103004' }, { label: '昌华街道', value: '440103005' }],
  '440303': [{ label: '东门街道', value: '440303001' }, { label: '南湖街道', value: '440303002' }, { label: '桂园街道', value: '440303003' }, { label: '笋岗街道', value: '440303004' }, { label: '清水河街道', value: '440303005' }]
}

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
  customerNationality: [{ label: '中国', value: 'CN' }, { label: '美国', value: 'US' }, { label: '日本', value: 'JP' }, { label: '韩国', value: 'KR' }, { label: '英国', value: 'GB' }, { label: '法国', value: 'FR' }, { label: '德国', value: 'DE' }, { label: '意大利', value: 'IT' }, { label: '加拿大', value: 'CA' }, { label: '澳大利亚', value: 'AU' }, { label: '新加坡', value: 'SG' }, { label: '马来西亚', value: 'MY' }, { label: '泰国', value: 'TH' }, { label: '印度', value: 'IN' }, { label: '俄罗斯', value: 'RU' }, { label: '西班牙', value: 'ES' }, { label: '葡萄牙', value: 'PT' }, { label: '荷兰', value: 'NL' }, { label: '瑞士', value: 'CH' }, { label: '瑞典', value: 'SE' }, { label: '挪威', value: 'NO' }, { label: '丹麦', value: 'DK' }, { label: '芬兰', value: 'FI' }, { label: '波兰', value: 'PL' }, { label: '奥地利', value: 'AT' }, { label: '比利时', value: 'BE' }, { label: '希腊', value: 'GR' }, { label: '爱尔兰', value: 'IE' }, { label: '卢森堡', value: 'LU' }, { label: '捷克', value: 'CZ' }, { label: '匈牙利', value: 'HU' }, { label: '斯洛伐克', value: 'SK' }, { label: '斯洛文尼亚', value: 'SI' }, { label: '克罗地亚', value: 'HR' }, { label: '保加利亚', value: 'BG' }, { label: '罗马尼亚', value: 'RO' }, { label: '乌克兰', value: 'UA' }, { label: '白俄罗斯', value: 'BY' }, { label: '土耳其', value: 'TR' }, { label: '埃及', value: 'EG' }, { label: '南非', value: 'ZA' }, { label: '尼日利亚', value: 'NG' }, { label: '肯尼亚', value: 'KE' }, { label: '巴西', value: 'BR' }, { label: '阿根廷', value: 'AR' }, { label: '墨西哥', value: 'MX' }, { label: '智利', value: 'CL' }, { label: '哥伦比亚', value: 'CO' }, { label: '秘鲁', value: 'PE' }, { label: '委内瑞拉', value: 'VE' }, { label: '印度尼西亚', value: 'ID' }, { label: '菲律宾', value: 'PH' }, { label: '越南', value: 'VN' }, { label: '柬埔寨', value: 'KH' }, { label: '老挝', value: 'LA' }, { label: '缅甸', value: 'MM' }, { label: '孟加拉国', value: 'BD' }, { label: '巴基斯坦', value: 'PK' }, { label: '尼泊尔', value: 'NP' }, { label: '斯里兰卡', value: 'LK' }, { label: '伊朗', value: 'IR' }, { label: '沙特阿拉伯', value: 'SA' }, { label: '阿联酋', value: 'AE' }, { label: '以色列', value: 'IL' }],
  customerIdType: [{ label: '中国居民身份证', value: '01' }, { label: '外国人永久居留身份证', value: '09' }, { label: '港澳居民来往内地通行证（香港）', value: '47' }, { label: '港澳居民来往内地通行证（澳门）', value: '48' }, { label: '台湾居民来往大陆通行证', value: '49' }, { label: '港澳居民居住证（香港）', value: '96' }, { label: '港澳居民居住证（澳门）', value: '97' }, { label: '台湾居民居住证', value: '98' }, { label: '外国护照', value: '03' }],
  permanentIdFlag: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
  secondIdType: [{ label: '港澳居民来往内地通行证（香港）', value: '47' }, { label: '港澳居民来往内地通行证（澳门）', value: '48' }, { label: '台湾居民来往大陆通行证', value: '49' }],
  customerMaritalStatus: [{ label: '未婚', value: '0' }, { label: '已婚', value: '1' }, { label: '初婚', value: '11' }, { label: '再婚', value: '12' }, { label: '复婚', value: '13' }, { label: '丧偶', value: '2' }, { label: '离婚', value: '3' }, { label: '其他', value: '7' }],
  customerEducation: [{ label: '博士研究生毕业', value: '11' }, { label: '博士研究生结业', value: '12' }, { label: '博士研究生肄业', value: '13' }, { label: '硕士研究生毕业', value: '14' }, { label: '硕士研究生结业', value: '15' }, { label: '硕士研究生肄业', value: '16' }, { label: '研究生班毕业', value: '17' }, { label: '研究生班结业', value: '18' }, { label: '研究生班肄业', value: '19' }, { label: '大学本科毕业', value: '21' }, { label: '大学本科结业', value: '22' }, { label: '大学本科肄业', value: '23' }, { label: '大学普通班毕业', value: '28' }, { label: '大学专科毕业', value: '31' }, { label: '大学专科结业', value: '32' }, { label: '大学专科肄业', value: '33' }, { label: '中等专科毕业', value: '41' }, { label: '中等专科结业', value: '42' }, { label: '中等专科肄业', value: '43' }, { label: '职业高中毕业', value: '44' }, { label: '职业高中结业', value: '45' }, { label: '职业高中肄业', value: '46' }, { label: '技工学校毕业', value: '47' }, { label: '技工学校结业', value: '48' }, { label: '技工学校肄业', value: '49' }, { label: '普通高中毕业', value: '61' }, { label: '普通高中结业', value: '62' }, { label: '普通高中肄业', value: '63' }, { label: '初中毕业', value: '71' }, { label: '初中肄业', value: '73' }],
  customerLivingStatus: [{ label: '自置', value: '1' }, { label: '按揭', value: '2' }, { label: '亲属楼宇', value: '3' }, { label: '集体宿舍', value: '4' }, { label: '租房', value: '5' }, { label: '共有住宅', value: '6' }, { label: '其他', value: '7' }, { label: '未知', value: '9' }],
  customerCompanyIndustry: [{ label: '金融', value: '01' }, { label: '科技', value: '02' }, { label: '制造', value: '03' }, { label: '服务', value: '04' }],
  customerCompanyOccupation: [{ label: '管理人员', value: '01' }, { label: '专业技术', value: '02' }, { label: '普通职员', value: '03' }, { label: '其他', value: '04' }, { label: '学生', value: '05' }, { label: '无业人员', value: '06' }, { label: '家庭主妇', value: '07' }],
  customerCompanyEconomicType: [{ label: '国企', value: '01' }, { label: '民营', value: '02' }, { label: '外资', value: '03' }],
  customerCompanyPosition: [{ label: '高层', value: '01' }, { label: '中层', value: '02' }, { label: '基层', value: '03' }],
  freeAnnualFeeType: [{ label: '免年费', value: '1' }, { label: '不免', value: '0' }],
  customerTaxResidentFlag: [{ label: '仅为中国居民', value: '1' }, { label: '仅为非居民', value: '2' }, { label: '即为中国税收居民又是（国家地区）税收居民', value: '3' }],
  customerTaxIdType1: [{ label: 'TIN(Tax Identification Number 纳税识别号码)', value: '1' }, { label: 'SSN（Social Security Number 社会保险号码)', value: '3' }, { label: 'ITIN(Individual Taxpayer Identification Number 个人报税识别号码）', value: '4' }, { label: 'ATIN（Adoption Taxpayer Identification Number 领养报税识别号码)', value: '6' }, { label: 'PTIN(Preparer Tax Identification Number 申请报税号码）', value: '7' }, { label: 'NINO(National Insurance Number 国家社会保险号码)', value: '8' }, { label: 'Others（其它）', value: '9' }],
  customerTaxIdType2: [{ label: 'TIN(Tax Identification Number 纳税识别号码)', value: '1' }, { label: 'SSN（Social Security Number 社会保险号码)', value: '3' }, { label: 'ITIN(Individual Taxpayer Identification Number 个人报税识别号码）', value: '4' }, { label: 'ATIN（Adoption Taxpayer Identification Number 领养报税识别号码)', value: '6' }, { label: 'PTIN(Preparer Tax Identification Number 申请报税号码）', value: '7' }, { label: 'NINO(National Insurance Number 国家社会保险号码)', value: '8' }, { label: 'Others（其它）', value: '9' }],
  customerTaxIdType3: [{ label: 'TIN(Tax Identification Number 纳税识别号码)', value: '1' }, { label: 'SSN（Social Security Number 社会保险号码)', value: '3' }, { label: 'ITIN(Individual Taxpayer Identification Number 个人报税识别号码）', value: '4' }, { label: 'ATIN（Adoption Taxpayer Identification Number 领养报税识别号码)', value: '6' }, { label: 'PTIN(Preparer Tax Identification Number 申请报税号码）', value: '7' }, { label: 'NINO(National Insurance Number 国家社会保险号码)', value: '8' }, { label: 'Others（其它）', value: '9' }],
  customerTaxIdReason1: [{ label: 'A:居民国（地区）不发放纳税人识别号或原因', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  customerTaxIdReason2: [{ label: 'A:居民国（地区）不发放纳税人识别号或原因', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  customerTaxIdReason3: [{ label: 'A:居民国（地区）不发放纳税人识别号或原因', value: 'A' }, { label: 'B:账户持有人未能取得纳税人识别号', value: 'B' }],
  managerProvince: [{ label: '北京市', value: '110000' }, { label: '天津市', value: '120000' }, { label: '河北省', value: '130000' }, { label: '山西省', value: '140000' }, { label: '内蒙古自治区', value: '150000' }, { label: '辽宁省', value: '210000' }, { label: '吉林省', value: '220000' }, { label: '黑龙江省', value: '230000' }, { label: '上海市', value: '310000' }, { label: '江苏省', value: '320000' }, { label: '浙江省', value: '330000' }, { label: '安徽省', value: '340000' }, { label: '福建省', value: '350000' }, { label: '江西省', value: '360000' }, { label: '山东省', value: '370000' }, { label: '河南省', value: '410000' }, { label: '湖北省', value: '420000' }, { label: '湖南省', value: '430000' }, { label: '广东省', value: '440000' }, { label: '广西壮族自治区', value: '450000' }, { label: '海南省', value: '460000' }, { label: '重庆市', value: '500000' }, { label: '四川省', value: '510000' }, { label: '贵州省', value: '520000' }, { label: '云南省', value: '530000' }, { label: '西藏自治区', value: '540000' }, { label: '陕西省', value: '610000' }, { label: '甘肃省', value: '620000' }, { label: '青海省', value: '630000' }, { label: '宁夏回族自治区', value: '640000' }, { label: '新疆维吾尔自治区', value: '650000' }]
}

const applicationFields = [
  { key: 'applicationType', label: '申请类型', length: 1, type: 'select', editable: false, span: 12 },
  { key: 'applicationId', label: '申请单号', length: 18, type: 'input', editable: false, span: 12 },
  { key: 'applicationRequestType', label: '申请单申请类型', length: 1, type: 'select', editable: false, span: 12 },
  { key: 'channelFlag', label: '渠道标识', length: 1, type: 'select', editable: false, span: 12 },
  { key: 'newOldCustomerFlag', label: '新老客户标识', length: 1, type: 'select', editable: false, span: 12 },
  { key: 'downgradeFlag', label: '降级标识', length: 1, type: 'select', editable: true, span: 12 }
]

const productFields = [
  { key: 'productCode', label: '产品数字代码', length: 4, type: 'input', editable: false, span: 12 },
  { key: 'productName', label: '产品发布名称', length: 50, type: 'input', editable: false, span: 12 },
  { key: 'applyOverdraftLimit', label: '是否申请透支额度', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'billCardAddressSelect', label: '帐单卡片寄送地址选择', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'airlineMileAutoExchange', label: '是否开通航空公司里程自动兑换', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'memberNo', label: '会员号', length: 20, type: 'input', editable: true, span: 12 }
]

const billFields = [
  { key: 'foreignTransactionCurrency', label: '您在国外的交易是否统一以人民币记账和还款', length: 1, type: 'select', editable: true, span: 24 },
  { key: 'repaymentMethod', label: '还款方式', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'autoRepaymentAmountSelect', label: '自动还款还款金额选择', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'autoRepaymentAccountOption', label: '自动还款还款帐户选项', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'bankProvinceCity', label: '开户行所在省市', length: 58, type: 'input', editable: true, span: 12 },
  { key: 'autoRepaymentForeignAccount', label: '自动还款外币账号', length: 20, type: 'input', editable: true, span: 12 },
  { key: 'autoRepaymentRmbAccount', label: '自动还款人民币账号', length: 20, type: 'input', editable: true, span: 12 }
]

const contactFields = [
  { key: 'contactName', label: '联系人姓名', length: 28, type: 'input', editable: true, span: 12 },
  { key: 'contactTitle', label: '联系人称谓', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'contactRelationship', label: '联系人与申请人关系', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'contactMobile', label: '联系人手机号', length: 11, type: 'input', editable: true, span: 12 }
]

const managerFields = [
  { key: 'managerProvince', label: '客户经理单位省/直辖市', length: 30, type: 'select', editable: true, span: 12 },
  { key: 'managerCity', label: '客户经理单位市/区/县', length: 20, type: 'select', editable: true, span: 12 },
  { key: 'managerAddress', label: '客户经理详细地址', length: 120, type: 'input', editable: true, span: 24 },
  { key: 'managerIdNumber', label: '客户经理身份证号码', length: 20, type: 'input', editable: true, span: 12 },
  { key: 'managerEmployeeNo', label: '客户经理员工号', length: 7, type: 'input', editable: true, span: 12 }
]

const customerFields = [
  { key: 'customerName', label: '客户姓名', length: 80, type: 'input', editable: true, span: 12 },
  { key: 'customerNamePinyin', label: '客户姓名拼音', length: 120, type: 'input', editable: false, span: 12 },
  { key: 'customerBirthPlace', label: '客户出生地', length: 120, type: 'input', editable: true, span: 24 },
  { key: 'customerBirthDate', label: '客户出生日期', length: 10, type: 'date', editable: true, span: 12 },
  { key: 'customerGender', label: '客户性别', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'customerNationality', label: '客户国籍', length: 3, type: 'select', editable: true, span: 12 },
  { key: 'customerIdType', label: '客户证件类型', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'customerIdNumber', label: '客户证件号码', length: 32, type: 'input', editable: true, span: 12 },
  { key: 'customerIdExpireDate', label: '客户证件到期日期', length: 10, type: 'date', editable: true, span: 12 },
  { key: 'permanentIdFlag', label: '长期证件标志', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'secondIdType', label: '第二客户证件类型', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'secondIdNumber', label: '第二客户证件号码', length: 32, type: 'input', editable: true, span: 12 },
  { key: 'secondIdStartDate', label: '第二客户证件有效开始日期', length: 8, type: 'date', editable: true, span: 12 },
  { key: 'secondIdEndDate', label: '第二客户证件有效结束日期', length: 8, type: 'date', editable: true, span: 12 },
  { key: 'customerMaritalStatus', label: '客户婚姻状况', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'customerEducation', label: '客户学历', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'customerMobile', label: '客户手机号码', length: 11, type: 'input', editable: true, span: 12 },
  { key: 'customerIdIssueCount', label: '客户证件签发次数', length: 2, type: 'input', editable: true, span: 12 },
  { key: 'customerIdIssueDate', label: '客户证件签发日期', length: 10, type: 'date', editable: true, span: 12 },
  { key: 'customerOverseasCountry1', label: '客户主要海外交易涉及国家或地区1', length: 3, type: 'input', editable: true, span: 12 },
  { key: 'customerOverseasCountry2', label: '客户主要海外交易涉及国家或地区2', length: 3, type: 'input', editable: true, span: 12 },
  { key: 'customerOverseasCountry3', label: '客户主要海外交易涉及国家或地区3', length: 3, type: 'input', editable: true, span: 12 },
  { key: 'customerExpectedCurrency', label: '客户预期月交易规模币种', length: 3, type: 'input', editable: true, span: 12 },
  { key: 'customerExpectedAmount', label: '客户预期月交易规模', length: 14, type: 'input', editable: true, span: 12 },
  { key: 'customerTaxResidentFlag', label: '客户居民涉税标识', length: 1, type: 'select', editable: true, span: 12 }
]

const addressFields = [
  { key: 'customerCompanyProvince', label: '客户单位地址（省份/直辖市）', length: 6, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyCity', label: '客户单位地址（市）', length: 6, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyDistrict', label: '客户单位地址（区县）', length: 50, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyAddress', label: '客户单位地址（详细地址）', length: 160, type: 'input', editable: true, span: 24 },
  { key: 'customerResidenceProvince', label: '客户居住地址（省份/直辖市）', length: 6, type: 'select', editable: true, span: 12 },
  { key: 'customerResidenceCity', label: '客户居住地址（市）', length: 6, type: 'select', editable: true, span: 12 },
  { key: 'customerResidenceDistrict', label: '客户居住地址（区县）', length: 50, type: 'select', editable: true, span: 12 },
  { key: 'customerResidenceDetailAddress', label: '客户居住地址（详细地址）', length: 160, type: 'input', editable: true, span: 24 },
  { key: 'customerCompanyPhone', label: '客户公司电话(电话号码)', length: 8, type: 'input', editable: true, span: 12 },
  { key: 'customerCompanyExtension', label: '客户公司电话(分机号)', length: 5, type: 'input', editable: true, span: 12 },
  { key: 'customerCompanyCountryCode', label: '客户公司电话(国家号）', length: 5, type: 'input', editable: true, span: 12 },
  { key: 'customerCompanyAreaCode', label: '客户公司电话(区号）', length: 5, type: 'input', editable: true, span: 12 },
  { key: 'customerCompanyPostcode', label: '客户公司邮编', length: 10, type: 'input', editable: true, span: 12 },
  { key: 'customerLivingStatus', label: '客户现居住状况', length: 1, type: 'select', editable: true, span: 12 }
]

const taxFields = [
  { key: 'customerBirthPlaceCountry', label: '客户出生地地址（国家）', length: 3, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerBirthPlaceProvince', label: '客户出生地地址（省）', length: 6, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerBirthPlaceCity', label: '客户出生地地址（市）', length: 6, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerBirthPlaceDistrict', label: '客户出生地地址(区)', length: 50, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerBirthPlaceAddress', label: '客户出生地地址详细地址', length: 160, type: 'input', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerCurrentResidenceCountry', label: '客户现居地地址(国家)', length: 3, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerCurrentResidenceProvince', label: '客户现居地地址(省)', length: 6, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerCurrentResidenceCity', label: '客户现居地地址(市)', length: 6, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerCurrentResidenceDistrict', label: '客户现居地地址(区)', length: 50, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerCurrentResidenceAddress', label: '客户现居地详细地址', length: 160, type: 'input', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxIdType1', label: '客户纳税人识别号类型1', length: 1, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdType2', label: '客户纳税人识别号类型2', length: 1, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdType3', label: '客户纳税人识别号类型3', length: 1, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdTIN1', label: '客户纳税人识别号TIN1', length: 32, type: 'input', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdTIN2', label: '客户纳税人识别号TIN2', length: 32, type: 'input', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdTIN3', label: '客户纳税人识别号TIN3', length: 32, type: 'input', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxIdReason1', label: '客户未填写纳税人识别号原因1', length: 100, type: 'select', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxIdReason2', label: '客户未填写纳税人识别号原因2', length: 100, type: 'select', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxIdReason3', label: '客户未填写纳税人识别号原因3', length: 100, type: 'select', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxReasonExplain1', label: '客户选择B原因解释说明1', length: 300, type: 'input', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxReasonExplain2', label: '客户选择B原因解释说明2', length: 300, type: 'input', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxReasonExplain3', label: '客户选择B原因解释说明3', length: 300, type: 'input', editable: true, conditionalShow: true, span: 24 },
  { key: 'customerTaxResidentCountry1', label: '客户税收居民国/地区1', length: 3, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxResidentCountry2', label: '客户税收居民国/地区2', length: 3, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxResidentCountry3', label: '客户税收居民国/地区3', length: 3, type: 'select', editable: true, conditionalShow: true, span: 12 },
  { key: 'customerTaxFailedRequestNo', label: '客户涉税维护失败原请求序号', length: 50, type: 'input', editable: true, conditionalShow: true, span: 24 }
]

const workFields = [
  { key: 'customerCompanyName', label: '客户工作单位名称', length: 100, type: 'input', editable: true, span: 24 },
  { key: 'customerCompanyIndustry', label: '客户工作单位行业分类', length: 5, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyOccupation', label: '客户工作单位职业', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyEconomicType', label: '客户工作单位经济类型', length: 2, type: 'select', editable: true, span: 12 },
  { key: 'customerCompanyPosition', label: '客户工作单位职务', length: 3, type: 'select', editable: true, span: 12 },
  { key: 'customerWorkYears', label: '客户现职已工作年限', length: 2, type: 'input', editable: true, span: 12 },
  { key: 'customerAnnualIncome', label: '客户年收入总额(万元)', length: 4, type: 'input', editable: true, span: 12 },
  { key: 'customerSignDate', label: '客户签字日期', length: 10, type: 'date', editable: true, span: 12 }
]

const marketingFields = [
  { key: 'marketingCode', label: 'CC(营销活动代号)', length: 18, type: 'input', editable: true, span: 12 },
  { key: 'ucifOrgNo', label: '所属机构', length: 5, type: 'input', editable: true, span: 12 },
  { key: 'marketingPersonCode', label: 'IN(营销人员代码)', length: 20, type: 'input', editable: true, span: 12 },
  { key: 'partnerOrgCode', label: 'PN(联名机构代码)', length: 18, type: 'input', editable: true, span: 12 },
  { key: 'externalIdCode', label: 'EX(外部识别码)', length: 18, type: 'input', editable: true, span: 12 },
  { key: 'freeAnnualFeeType', label: '免年费类型', length: 1, type: 'select', editable: true, span: 12 },
  { key: 'referrerMobile', label: '推荐人手机号', length: 11, type: 'input', editable: true, span: 12 }
]

const getOptions = (key) => {
  if (key === 'managerCity') {
    return managerCityOptions.value
  } else if (key === 'customerBirthPlaceProvince') {
    return birthPlaceProvinceOptions.value
  } else if (key === 'customerBirthPlaceCity') {
    return birthPlaceCityOptions.value
  } else if (key === 'customerBirthPlaceDistrict') {
    return birthPlaceDistrictOptions.value
  } else if (key === 'customerCurrentResidenceProvince') {
    return residenceProvinceOptions.value
  } else if (key === 'customerCurrentResidenceCity') {
    return residenceCityOptions.value
  } else if (key === 'customerCurrentResidenceDistrict') {
    return residenceDistrictOptions.value
  } else if (key === 'customerCompanyProvince') {
    return companyProvinceOptions.value.length > 0 ? companyProvinceOptions.value : provinceData['CN'] || []
  } else if (key === 'customerCompanyCity') {
    return companyCityOptions.value
  } else if (key === 'customerCompanyDistrict') {
    return companyDistrictOptions.value
  } else if (key === 'customerResidenceProvince') {
    return livingProvinceOptions.value.length > 0 ? livingProvinceOptions.value : provinceData['CN'] || []
  } else if (key === 'customerResidenceCity') {
    return livingCityOptions.value
  } else if (key === 'customerResidenceDistrict') {
    return livingDistrictOptions.value
  }
  return fieldOptions[key] || []
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

const getCJKCharCount = (str) => {
  let count = 0
  for (let char of str) {
    if (/[\u4e00-\u9fff]/.test(char)) {
      count += 2
    } else {
      count += 1
    }
  }
  return count
}

const getFieldStyle = (length, fieldKey, fieldType = undefined) => {
  if (fieldType === 'date') {
    return { width: '180px', minWidth: '180px' }
  }
  
  let displayLength = length || 0
  
  if (fieldKey && fieldOptions[fieldKey]) {
    const maxLabelWidth = Math.max(...fieldOptions[fieldKey].map(opt => getCJKCharCount(opt.label)))
    displayLength = Math.max(displayLength, maxLabelWidth)
  }
  
  if (fieldKey && (fieldKey.includes('TaxIdType') || fieldKey.includes('TaxIdReason'))) {
    return { width: '100%', minWidth: '200px' }
  }
  
  if (displayLength <= 5) {
    return { width: '120px', minWidth: '120px' }
  } else if (displayLength <= 40) {
    return { width: `${Math.max(displayLength + 2, 15)}ch`, minWidth: '120px' }
  } else {
    return { width: '100%', minWidth: '120px' }
  }
}

const getOptionLabel = (key) => {
  const options = getOptions(key)
  const opt = options.find(o => o.value === formData[key])
  return opt ? opt.label : formData[key]
}

const shouldShowTaxField = () => {
  return formData.customerTaxResidentFlag !== '1'
}

const convertToPinyin = async (chinese) => {
  const { pinyin } = await import('pinyin-pro')
  return pinyin(chinese, { toneType: 'none', type: 'string', surname: 'head' }).replace(/\s/g, '').toUpperCase()
}

watch(() => formData.customerName, async (val) => {
  if (val) {
    const cleanedValue = val.replace(/\r\n|\r|\n/g, '').replace(/\s+/g, '')
    if (cleanedValue !== val) {
      formData.customerName = cleanedValue
      return
    }
    formData.customerNamePinyin = await convertToPinyin(val)
  } else {
    formData.customerNamePinyin = ''
  }
})

watch(() => formData.managerProvince, (val) => {
  if (val && cityData[val]) {
    managerCityOptions.value = cityData[val]
  } else {
    managerCityOptions.value = []
  }
  formData.managerCity = ''
})

watch(() => formData.customerBirthPlaceCountry, (val) => {
  birthPlaceProvinceOptions.value = provinceData[val] || []
  birthPlaceCityOptions.value = []
  birthPlaceDistrictOptions.value = []
  formData.customerBirthPlaceProvince = ''
  formData.customerBirthPlaceCity = ''
  formData.customerBirthPlaceDistrict = ''
})

watch(() => formData.customerBirthPlaceProvince, (val) => {
  if (val && cityData[val]) {
    birthPlaceCityOptions.value = cityData[val]
  } else {
    birthPlaceCityOptions.value = []
  }
  birthPlaceDistrictOptions.value = []
  formData.customerBirthPlaceCity = ''
  formData.customerBirthPlaceDistrict = ''
})

watch(() => formData.customerBirthPlaceCity, (val) => {
  if (val && districtData[val]) {
    birthPlaceDistrictOptions.value = districtData[val]
  } else {
    birthPlaceDistrictOptions.value = []
  }
  formData.customerBirthPlaceDistrict = ''
})

watch(() => formData.customerCurrentResidenceCountry, (val) => {
  residenceProvinceOptions.value = provinceData[val] || []
  residenceCityOptions.value = []
  residenceDistrictOptions.value = []
  formData.customerCurrentResidenceProvince = ''
  formData.customerCurrentResidenceCity = ''
  formData.customerCurrentResidenceDistrict = ''
})

watch(() => formData.customerCurrentResidenceProvince, (val) => {
  if (val && cityData[val]) {
    residenceCityOptions.value = cityData[val]
  } else {
    residenceCityOptions.value = []
  }
  residenceDistrictOptions.value = []
  formData.customerCurrentResidenceCity = ''
  formData.customerCurrentResidenceDistrict = ''
})

watch(() => formData.customerCurrentResidenceCity, (val) => {
  if (val && districtData[val]) {
    residenceDistrictOptions.value = districtData[val]
  } else {
    residenceDistrictOptions.value = []
  }
  formData.customerCurrentResidenceDistrict = ''
})

watch(() => formData.customerCompanyProvince, (val) => {
  if (val && cityData[val]) {
    companyCityOptions.value = cityData[val]
  } else {
    companyCityOptions.value = []
  }
  companyDistrictOptions.value = []
  formData.customerCompanyCity = ''
  formData.customerCompanyDistrict = ''
})

watch(() => formData.customerCompanyCity, (val) => {
  if (val && districtData[val]) {
    companyDistrictOptions.value = districtData[val]
  } else {
    companyDistrictOptions.value = []
  }
  formData.customerCompanyDistrict = ''
})

watch(() => formData.customerResidenceProvince, (val) => {
  if (val && cityData[val]) {
    livingCityOptions.value = cityData[val]
  } else {
    livingCityOptions.value = []
  }
  livingDistrictOptions.value = []
  formData.customerResidenceCity = ''
  formData.customerResidenceDistrict = ''
})

watch(() => formData.customerResidenceCity, (val) => {
  if (val && districtData[val]) {
    livingDistrictOptions.value = districtData[val]
  } else {
    livingDistrictOptions.value = []
  }
  formData.customerResidenceDistrict = ''
})

const goBack = () => {
  router.back()
}

const validateAllForms = async () => {
  const keys = Object.keys(formRefs)
  let allValid = true
  
  for (const key of keys) {
    const formRef = formRefs[key].value
    if (formRef) {
      await formRef.validate().catch(() => {
        allValid = false
      })
    }
  }
  
  let businessValid = true
  const errors = []
  
  if (formData.customerTaxResidentFlag !== '1') {
    if (!formData.customerCurrentResidenceCountry) {
      errors.push('当非"仅为中国税收居民"时，现居地址（国家）不能为空')
      businessValid = false
    }
    if (!formData.customerBirthPlaceCountry) {
      errors.push('当非"仅为中国税收居民"时，出生地址（国家）不能为空')
      businessValid = false
    }
    if (!formData.customerTaxResidentCountry1) {
      errors.push('当非"仅为中国税收居民"时，税收居民国不能为空')
      businessValid = false
    }
  }
  
  if (formData.repaymentMethod === '1') {
    if (!formData.autoRepaymentAmountSelect) {
      errors.push('当还款方式为自动还款时，自动还款还款金额选择为必填项')
      businessValid = false
    }
    if (!formData.autoRepaymentAccountOption) {
      errors.push('当还款方式为自动还款时，自动还款还款帐户选项为必填项')
      businessValid = false
    }
  }
  
  if (['96', '97', '98'].includes(formData.customerIdType)) {
    if (!formData.secondIdType) {
      errors.push('客户证件类型为港澳居民居住证或台湾居民居住证时，第二客户证件类型为必填项')
      businessValid = false
    }
  }
  
  return {
    valid: allValid && businessValid,
    errors: errors
  }
}

const validateData = async () => {
  const result = await validateAllForms()
  if (!result.valid) {
    ElMessage.error('数据校验不通过，请检查红色提示信息')
    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        ElMessage.warning(error)
      })
    }
  } else {
    ElMessage.success('数据校验通过')
  }
}

const saveForm = async () => {
  const result = await validateAllForms()
  if (!result.valid) {
    ElMessage.error('数据校验不通过，无法保存，请检查红色提示信息')
    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        ElMessage.warning(error)
      })
    }
    return
  }
  ElMessage.success('数据保存成功')
}

onMounted(() => {
  const params = route.query
  if (params) {
    formData.applicationId = params.id || '202607020000000001'
    formData.applicationType = params.applicationType || '1'
    formData.applicationRequestType = params.applicationRequestType || '1'
    formData.channelFlag = params.channelFlag || '0'
    formData.newOldCustomerFlag = params.newOldCustomerFlag || '1'
    formData.productCode = params.productCode || '0001'
    formData.productName = params.productName || '中国银行信用卡'
  }
})
</script>

<style scoped>
.entry-form { padding: 20px; background-color: #fff; min-height: 100vh; }
.form-card { margin-bottom: 20px; border: none; box-shadow: 0 2px 12px rgba(192, 57, 43, 0.08); }
.form-card :deep(.el-card__header) {
  background: linear-gradient(90deg, #c0392b 0%, #e74c3c 100%);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 20px;
  border-radius: 4px 4px 0 0;
}
.form-card :deep(.el-card__body) { padding: 0; }
.form-section { padding: 16px 0; }
.form-section .el-form-item { margin-bottom: 16px; }
:deep(.el-form-item__label) {
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.5;
  padding-bottom: 4px;
}
:deep(.el-form-item__content) {
  flex: 1;
  min-width: 0;
}
:deep(.el-form-item) {
  align-items: flex-start;
}
.form-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-top: 2px solid #c0392b;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(192, 57, 43, 0.1);
}
:deep(.el-collapse-item__header) {
  font-weight: 600;
  font-size: 15px;
  color: #c0392b;
  background: linear-gradient(90deg, #fef5f4 0%, #ffffff 100%);
  border-left: 4px solid #c0392b;
  padding-left: 16px;
}
:deep(.el-collapse-item__header:hover) {
  background: linear-gradient(90deg, #fce4e2 0%, #ffffff 100%);
}
:deep(.el-collapse-item__content) {
  padding: 12px 0;
}
:deep(.el-button--primary) {
  background-color: #c0392b;
  border-color: #c0392b;
}
:deep(.el-button--primary:hover) {
  background-color: #a93226;
  border-color: #a93226;
}
:deep(.el-select .el-input__inner:focus) {
  border-color: #c0392b;
}
:deep(.el-input__inner:focus) {
  border-color: #c0392b;
}
.operation-records { padding: 10px; }
.record-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
.record-item:last-child { border-bottom: none; }
.record-time { font-size: 12px; color: #999; margin-bottom: 4px; }
.record-content { font-size: 14px; color: #333; }
.record-operator { font-weight: bold; color: #409EFF; }
</style>