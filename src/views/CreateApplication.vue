<template>
  <div class="create-application">
    <el-card>
      <template #header>
        <span>创建信用卡申请</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker v-model="form.birthDate" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="婚姻状况">
              <el-select v-model="form.maritalStatus">
                <el-option label="未婚" :value="1" />
                <el-option label="已婚" :value="2" />
                <el-option label="离异" :value="3" />
                <el-option label="丧偶" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历">
              <el-select v-model="form.education">
                <el-option label="初中及以下" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>

        <el-divider content-position="left">就业信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称">
              <el-input v-model="form.employmentInfo.companyName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位">
              <el-input v-model="form.employmentInfo.position" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作年限">
              <el-input v-model="form.employmentInfo.workYears" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月收入">
              <el-input v-model="form.employmentInfo.monthlyIncome" prefix="¥" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年收入">
              <el-input v-model="form.employmentInfo.annualIncome" prefix="¥" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收入证明类型">
              <el-select v-model="form.employmentInfo.incomeProofType">
                <el-option label="银行流水" value="BANK_STATEMENT" />
                <el-option label="工资证明" value="SALARY_CERTIFICATE" />
                <el-option label="税单" value="TAX_CERTIFICATE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">申请信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡片类型">
              <el-select v-model="form.cardType">
                <el-option label="白金卡" value="PLATINUM" />
                <el-option label="金卡" value="GOLD" />
                <el-option label="普卡" value="NORMAL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请额度">
              <el-input v-model="form.applyAmount" prefix="¥" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">提交申请</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import api from '@/api'

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  idCard: '',
  gender: null,
  birthDate: null,
  phone: '',
  email: '',
  address: '',
  maritalStatus: null,
  education: '',
  employmentInfo: {
    companyName: '',
    position: '',
    workYears: null,
    monthlyIncome: '',
    annualIncome: '',
    incomeProofType: ''
  },
  cardType: '',
  applyAmount: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  cardType: [{ required: true, message: '请选择卡片类型', trigger: 'change' }],
  applyAmount: [{ required: true, message: '请输入申请额度', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await api.applications.create(form)
        if (res.code === 200) {
          ElMessage.success('申请创建成功')
          router.push(`/applications/detail/${res.data.applicationId}`)
        } else {
          ElMessage.error(res.message || '创建失败')
        }
      } catch (error) {
        ElMessage.error('创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.create-application { padding: 20px; }
</style>