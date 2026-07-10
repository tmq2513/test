<template>
  <div class="organizations-container">
    <el-card>
      <div class="card-header">
        <h2>机构管理</h2>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedOrgs" style="width: 100%">
        <el-table-column prop="orgCode" label="机构编号" width="150" />
        <el-table-column prop="orgName" label="机构名称" width="180" />
        <el-table-column prop="orgLevel" label="机构级别" width="120">
          <template #default="scope">
            <el-tag size="small">{{ getOrgLevelName(scope.row.orgLevel) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parentName" label="上级机构" width="150">
          <template #default="scope">
            <span>{{ scope.row.parentName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="provinceBankName" label="所属省行机构" width="180">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.provinceBankName || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="orgPath" label="机构路径" min-width="250">
          <template #default="scope">
            <el-tooltip :content="scope.row.orgPath" placement="top">
              <span class="org-path-text">{{ scope.row.orgPath }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="机构状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleSync(scope.row)">同步</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredOrgs.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm.vue'

const organizations = ref([
  { id: 1, orgCode: 'BANK-HQ', orgName: '总行', orgLevel: 1, parentId: null, parentName: '', provinceBankId: null, provinceBankName: '', phone: '010-12345678', status: 'normal', orgPath: '总行' },
  { id: 2, orgCode: 'BANK-BJ', orgName: '北京分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-87654321', status: 'normal', orgPath: '总行-北京分行' },
  { id: 3, orgCode: 'BANK-SH', orgName: '上海分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 3, provinceBankName: '上海分行', phone: '021-12345678', status: 'normal', orgPath: '总行-上海分行' },
  { id: 4, orgCode: 'BANK-GZ', orgName: '广州分行', orgLevel: 2, parentId: 1, parentName: '总行', provinceBankId: 4, provinceBankName: '广州分行', phone: '020-12345678', status: 'normal', orgPath: '总行-广州分行' },
  { id: 5, orgCode: 'BANK-BJ-HD', orgName: '海淀支行', orgLevel: 3, parentId: 2, parentName: '北京分行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-23456789', status: 'normal', orgPath: '总行-北京分行-海淀支行' },
  { id: 6, orgCode: 'BANK-BJ-CY', orgName: '朝阳支行', orgLevel: 3, parentId: 2, parentName: '北京分行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-34567890', status: 'normal', orgPath: '总行-北京分行-朝阳支行' },
  { id: 7, orgCode: 'BANK-BJ-XC', orgName: '西城支行', orgLevel: 3, parentId: 2, parentName: '北京分行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-45678901', status: 'disabled', orgPath: '总行-北京分行-西城支行' },
  { id: 8, orgCode: 'BANK-BJ-DC', orgName: '东城支行', orgLevel: 3, parentId: 2, parentName: '北京分行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-56789012', status: 'normal', orgPath: '总行-北京分行-东城支行' },
  { id: 9, orgCode: 'BANK-SH-PD', orgName: '浦东支行', orgLevel: 3, parentId: 3, parentName: '上海分行', provinceBankId: 3, provinceBankName: '上海分行', phone: '021-23456789', status: 'normal', orgPath: '总行-上海分行-浦东支行' },
  { id: 10, orgCode: 'BANK-SH-JP', orgName: '静安支行', orgLevel: 3, parentId: 3, parentName: '上海分行', provinceBankId: 3, provinceBankName: '上海分行', phone: '021-34567890', status: 'normal', orgPath: '总行-上海分行-静安支行' },
  { id: 11, orgCode: 'BANK-GZ-TY', orgName: '天河支行', orgLevel: 3, parentId: 4, parentName: '广州分行', provinceBankId: 4, provinceBankName: '广州分行', phone: '020-23456789', status: 'normal', orgPath: '总行-广州分行-天河支行' },
  { id: 12, orgCode: 'BANK-GZ-HD', orgName: '花都支行', orgLevel: 3, parentId: 4, parentName: '广州分行', provinceBankId: 4, provinceBankName: '广州分行', phone: '020-34567890', status: 'disabled', orgPath: '总行-广州分行-花都支行' },
  { id: 13, orgCode: 'BANK-BJ-HD-WD', orgName: '海淀支行万德路网点', orgLevel: 4, parentId: 5, parentName: '海淀支行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-67890123', status: 'normal', orgPath: '总行-北京分行-海淀支行-海淀支行万德路网点' },
  { id: 14, orgCode: 'BANK-BJ-HD-ZG', orgName: '海淀支行中关村网点', orgLevel: 4, parentId: 5, parentName: '海淀支行', provinceBankId: 2, provinceBankName: '北京分行', phone: '010-78901234', status: 'normal', orgPath: '总行-北京分行-海淀支行-海淀支行中关村网点' },
  { id: 15, orgCode: 'BANK-SH-PD-LJZ', orgName: '浦东支行陆家嘴网点', orgLevel: 4, parentId: 9, parentName: '浦东支行', provinceBankId: 3, provinceBankName: '上海分行', phone: '021-45678901', status: 'normal', orgPath: '总行-上海分行-浦东支行-浦东支行陆家嘴网点' }
])

const currentPage = ref(1)
const pageSize = ref(10)

const parentOrgs = computed(() => {
  return organizations.value.filter(o => o.orgLevel < 4)
})

const provinceBanks = computed(() => {
  return organizations.value.filter(o => o.orgLevel === 2)
})

const searchFields = ref([
  { prop: 'orgCode', label: '机构编号', type: 'input', placeholder: '请输入机构编号' },
  { prop: 'parentId', label: '上级机构', type: 'select', options: [] },
  { prop: 'provinceBankId', label: '省行机构', type: 'select', options: [] },
  { prop: 'status', label: '机构状态', type: 'select', options: [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' }
  ]}
])

watch(parentOrgs, (val) => {
  searchFields.value[1].options = val.map(org => ({ label: org.orgName, value: org.id.toString() }))
}, { immediate: true })

watch(provinceBanks, (val) => {
  searchFields.value[2].options = val.map(org => ({ label: org.orgName, value: org.id.toString() }))
}, { immediate: true })

const searchForm = reactive({})
searchFields.value.forEach(field => {
  searchForm[field.prop] = ''
})

const filteredOrgs = computed(() => {
  let result = organizations.value
  if (searchForm.orgCode) {
    result = result.filter(o => o.orgCode.includes(searchForm.orgCode))
  }
  if (searchForm.parentId) {
    result = result.filter(o => o.parentId === parseInt(searchForm.parentId))
  }
  if (searchForm.provinceBankId) {
    result = result.filter(o => o.provinceBankId === parseInt(searchForm.provinceBankId))
  }
  if (searchForm.status) {
    result = result.filter(o => o.status === searchForm.status)
  }
  return result
})

const paginatedOrgs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrgs.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchForm.orgCode = ''
  searchForm.parentId = ''
  searchForm.provinceBankId = ''
  searchForm.status = ''
  currentPage.value = 1
}

const handleSync = (row) => {
  row.updateTime = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
  ElMessage.success(`机构 ${row.orgName} 同步成功`)
}

const getOrgLevelName = (level) => {
  const names = {
    1: '总行',
    2: '省行/分行',
    3: '支行',
    4: '网点'
  }
  return names[level] || `级别${level}`
}

const getStatusTagType = (status) => {
  const types = {
    normal: 'success',
    disabled: 'danger'
  }
  return types[status] || 'info'
}

const getStatusName = (status) => {
  const names = {
    normal: '正常',
    disabled: '禁用'
  }
  return names[status] || '未知'
}
</script>

<style scoped>
.organizations-container {
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
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.org-path-text {
  display: inline-block;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>