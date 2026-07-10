<template>
  <div class="users-container">
    <el-card>
      <div class="card-header">
        <h2>用户管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="showSyncDialog = true">指定员工同步</el-button>
        </div>
      </div>

      <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

      <el-table :data="paginatedUsers" style="width: 100%">
        <el-table-column prop="employeeCode" label="员工编号" width="150" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="organization" label="所属机构" width="180">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.organization }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="provinceBank" label="所属省行" width="180">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.provinceBank }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="status" label="用户状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleShowPermission(scope.row)">权限查询</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredUsers.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <el-dialog v-model="showSyncDialog" title="指定员工同步" width="400px">
      <el-form :model="syncForm" label-width="100px">
        <el-form-item label="员工编号" required>
          <el-input v-model="syncForm.employeeCode" placeholder="请输入员工编号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSyncDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSyncSingle">同步</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionVisible" :title="`${currentPermissionUser} - 权限信息`" width="600px">
      <div v-if="currentPermission">
        <div class="permission-section">
          <h4>岗位信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="岗位编号">{{ currentPermission.position.code }}</el-descriptions-item>
            <el-descriptions-item label="岗位名称">{{ currentPermission.position.name }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="permission-section">
          <h4>角色信息</h4>
          <el-table :data="currentPermission.roles" style="width: 100%">
            <el-table-column prop="code" label="角色编号" width="200" />
            <el-table-column prop="name" label="角色名称" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="permissionVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm.vue'

const organizations = ['海淀支行', '朝阳支行', '西城支行', '东城支行', '丰台支行', '石景山支行']
const provinceBanks = ['北京分行', '上海分行', '广州分行', '深圳分行', '杭州分行']

const searchFields = [
  { prop: 'employeeCode', label: '员工编号', type: 'input', placeholder: '请输入员工编号' },
  { prop: 'organization', label: '所属机构', type: 'select', options: organizations.map(org => ({ label: org, value: org })) },
  { prop: 'status', label: '用户状态', type: 'select', options: [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '离职', value: 'leave' }
  ]}
]

const users = ref([
  { id: 1, employeeCode: 'EMP001', realName: '张三', organization: '海淀支行', provinceBank: '北京分行', email: 'zhangsan@bank.com', phone: '13800138001', status: 'normal', updateTime: '2026-06-25 10:30:00' },
  { id: 2, employeeCode: 'EMP002', realName: '李四', organization: '朝阳支行', provinceBank: '北京分行', email: 'lisi@bank.com', phone: '13800138002', status: 'normal', updateTime: '2026-06-25 09:15:00' },
  { id: 3, employeeCode: 'EMP003', realName: '王五', organization: '西城支行', provinceBank: '北京分行', email: 'wangwu@bank.com', phone: '13800138003', status: 'disabled', updateTime: '2026-06-24 16:45:00' },
  { id: 4, employeeCode: 'EMP004', realName: '赵六', organization: '东城支行', provinceBank: '北京分行', email: 'zhaoliu@bank.com', phone: '13800138004', status: 'leave', updateTime: '2026-06-20 14:00:00' },
  { id: 5, employeeCode: 'EMP005', realName: '孙七', organization: '海淀支行', provinceBank: '北京分行', email: 'sunqi@bank.com', phone: '13800138005', status: 'normal', updateTime: '2026-06-25 11:20:00' },
  { id: 6, employeeCode: 'EMP006', realName: '周八', organization: '丰台支行', provinceBank: '北京分行', email: 'zhouba@bank.com', phone: '13800138006', status: 'normal', updateTime: '2026-06-25 08:30:00' },
  { id: 7, employeeCode: 'EMP007', realName: '吴九', organization: '石景山支行', provinceBank: '北京分行', email: 'wujiu@bank.com', phone: '13800138007', status: 'normal', updateTime: '2026-06-24 15:00:00' },
  { id: 8, employeeCode: 'EMP008', realName: '郑十', organization: '海淀支行', provinceBank: '北京分行', email: 'zhengshi@bank.com', phone: '13800138008', status: 'disabled', updateTime: '2026-06-23 10:00:00' },
  { id: 9, employeeCode: 'EMP009', realName: '钱十一', organization: '朝阳支行', provinceBank: '北京分行', email: 'qianshiyi@bank.com', phone: '13800138009', status: 'normal', updateTime: '2026-06-25 13:45:00' },
  { id: 10, employeeCode: 'EMP010', realName: '陈十二', organization: '西城支行', provinceBank: '北京分行', email: 'chenshier@bank.com', phone: '13800138010', status: 'leave', updateTime: '2026-06-18 09:00:00' },
  { id: 11, employeeCode: 'EMP011', realName: '刘十三', organization: '东城支行', provinceBank: '上海分行', email: 'liushisan@bank.com', phone: '13800138011', status: 'normal', updateTime: '2026-06-25 16:30:00' },
  { id: 12, employeeCode: 'EMP012', realName: '杨十四', organization: '海淀支行', provinceBank: '广州分行', email: 'yangshisi@bank.com', phone: '13800138012', status: 'normal', updateTime: '2026-06-25 14:20:00' }
])

const userPermissions = ref({
  1: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  2: {
    position: { code: 'POS002', name: '审核专员' },
    roles: [
      { code: 'ROL003', name: '审核员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  3: {
    position: { code: 'POS003', name: '审批主管' },
    roles: [
      { code: 'ROL004', name: '审批员' },
      { code: 'ROL003', name: '审核员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  4: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  5: {
    position: { code: 'POS004', name: '系统管理员' },
    roles: [
      { code: 'ROL005', name: '管理员' },
      { code: 'ROL004', name: '审批员' },
      { code: 'ROL003', name: '审核员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  6: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  7: {
    position: { code: 'POS002', name: '审核专员' },
    roles: [
      { code: 'ROL003', name: '审核员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  8: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  9: {
    position: { code: 'POS003', name: '审批主管' },
    roles: [
      { code: 'ROL004', name: '审批员' },
      { code: 'ROL003', name: '审核员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  10: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  11: {
    position: { code: 'POS005', name: '分行管理员' },
    roles: [
      { code: 'ROL005', name: '管理员' },
      { code: 'ROL002', name: '查询员' }
    ]
  },
  12: {
    position: { code: 'POS001', name: '客户经理' },
    roles: [
      { code: 'ROL001', name: '录入员' },
      { code: 'ROL002', name: '查询员' }
    ]
  }
})

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const syncForm = reactive({
  employeeCode: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const showSyncDialog = ref(false)
const permissionVisible = ref(false)
const currentPermissionUser = ref('')
const currentPermission = ref(null)

const filteredUsers = computed(() => {
  let result = users.value
  if (searchForm.employeeCode) {
    result = result.filter(u => u.employeeCode.includes(searchForm.employeeCode))
  }
  if (searchForm.organization) {
    result = result.filter(u => u.organization === searchForm.organization)
  }
  if (searchForm.status) {
    result = result.filter(u => u.status === searchForm.status)
  }
  return result
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchForm.employeeCode = ''
  searchForm.organization = ''
  searchForm.status = ''
  currentPage.value = 1
}

const handleSyncSingle = () => {
  if (!syncForm.employeeCode) {
    ElMessage.warning('请输入员工编号')
    return
  }
  const exists = users.value.find(u => u.employeeCode === syncForm.employeeCode)
  if (exists) {
    ElMessage.success(`员工 ${exists.realName} 同步成功`)
  } else {
    const newUser = {
      id: Date.now(),
      employeeCode: syncForm.employeeCode,
      realName: `新员工${syncForm.employeeCode.slice(-3)}`,
      organization: '海淀支行',
      provinceBank: '北京分行',
      email: `${syncForm.employeeCode.toLowerCase()}@bank.com`,
      phone: '13800138000',
      status: 'normal',
      updateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
    }
    users.value.push(newUser)
    userPermissions.value[newUser.id] = {
      position: { code: 'POS001', name: '客户经理' },
      roles: [
        { code: 'ROL001', name: '录入员' },
        { code: 'ROL002', name: '查询员' }
      ]
    }
    ElMessage.success(`员工 ${newUser.realName} 同步成功，已添加到系统`)
  }
  showSyncDialog.value = false
  syncForm.employeeCode = ''
}

const handleShowPermission = (row) => {
  currentPermissionUser.value = row.realName
  currentPermission.value = userPermissions.value[row.id] || {
    position: { code: '-', name: '-' },
    roles: []
  }
  permissionVisible.value = true
}

const getStatusTagType = (status) => {
  const types = {
    normal: 'success',
    disabled: 'danger',
    leave: 'warning'
  }
  return types[status] || 'info'
}

const getStatusName = (status) => {
  const names = {
    normal: '正常',
    disabled: '禁用',
    leave: '离职'
  }
  return names[status] || '未知'
}
</script>

<style scoped>
.users-container {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.permission-section {
  margin-bottom: 20px;
}

.permission-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #303133;
}
</style>