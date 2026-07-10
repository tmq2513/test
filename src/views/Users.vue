<template>
  <div class="users">
    <div class="toolbar">
      <el-button type="primary" @click="showDialog = true">
        <el-icon><component :is="Plus" /></el-icon>
        创建用户
      </el-button>
      <el-input v-model="searchText" placeholder="搜索用户名" class="search" @keyup.enter="loadData" />
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="text" @click="editUser(row)">编辑</el-button>
          <el-button type="text" @click="deleteUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="loadData"
      @current-change="loadData"
    />

    <el-dialog v-model="showDialog" :title="isEdit ? '编辑用户' : '创建用户'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" :placeholder="isEdit ? '不修改请留空' : '请输入密码'" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const tableData = ref([])
const page = ref(0)
const size = ref(10)
const total = ref(0)
const searchText = ref('')
const showDialog = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  status: 1
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: !isEdit.value, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
}

const loadData = async () => {
  const res = await api.users.list({ page, size })
  if (res.code === 200) {
    tableData.value = res.data.content || []
    total.value = res.data.totalElements || 0
  }
}

const editUser = (row) => {
  isEdit.value = true
  form.id = row.id
  form.username = row.username
  form.password = ''
  form.realName = row.realName
  form.email = row.email
  form.phone = row.phone
  form.status = row.status
  showDialog.value = true
}

const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' })
    const res = await api.users.delete(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error) {
    ElMessage.info('已取消删除')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (isEdit.value) {
          const res = await api.users.update(form.id, form)
          if (res.code === 200) {
            ElMessage.success('更新成功')
          } else {
            ElMessage.error(res.message || '更新失败')
          }
        } else {
          const res = await api.users.create(form)
          if (res.code === 200) {
            ElMessage.success('创建成功')
          } else {
            ElMessage.error(res.message || '创建失败')
          }
        }
        showDialog.value = false
        loadData()
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.users { padding: 20px; background: white; border-radius: 8px; }
.toolbar { display: flex; gap: 20px; margin-bottom: 20px; }
.search { width: 200px; }
</style>