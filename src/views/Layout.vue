<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">信用卡审批系统</div>
      <el-menu :default-active="activeMenu" mode="vertical" background-color="#8b0000" text-color="#ffffff" active-text-color="#ffffff" @select="handleMenuSelect">
        <el-menu-item index="/dashboard">
          <el-icon><component :is="HomeFilled" /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="/scan">
          <template #title>
            <el-icon><component :is="Picture" /></el-icon>
            <span>影像扫描</span>
          </template>
          <el-menu-item index="/scan/personal-card">个人卡申请影像扫描</el-menu-item>
          <el-menu-item index="/scan/personal-company-card">个人公司卡申请影像扫描</el-menu-item>
          <el-menu-item index="/scan/company-structure">公司架构建立扫描</el-menu-item>
          <el-menu-item index="/scan/application-rescan">申请补扫</el-menu-item>
          <el-menu-item index="/scan/personal-return-requeue">个人申请退件重扫队列</el-menu-item>
          <el-menu-item index="/scan/personal-return-rescan">个人退件补扫队列</el-menu-item>
          <el-menu-item index="/scan/application-view">申请件影像调阅</el-menu-item>
          <el-menu-item index="/scan/company-structure-view">公司架构影像调阅</el-menu-item>
          <el-menu-item index="/scan/no-image-rescan">无影像补扫</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/company">
          <template #title>
            <el-icon><component :is="OfficeBuilding" /></el-icon>
            <span>集中录入</span>
          </template>
          <el-menu-item index="/company/structure-review">公司架构影像复核</el-menu-item>
          <el-menu-item index="/company/structure-approval">公司架构影像审批</el-menu-item>
          <el-menu-item index="/company/structure-review-return">公司架构影像审核退回</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/entry">
          <template #title>
            <el-icon><component :is="Document" /></el-icon>
            <span>申请录入</span>
          </template>
          <el-menu-item index="/entry/transfer">录入调件</el-menu-item>
          <el-menu-item index="/entry/unclosed">录入未结案</el-menu-item>
          <el-menu-item index="/entry/closed">录入已结案</el-menu-item>
          <el-menu-item index="/entry/reassign">录入重新分派</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/check">
          <template #title>
            <el-icon><component :is="CircleCheck" /></el-icon>
            <span>核准核查</span>
          </template>
          <el-menu-item index="/check/approval-transfer">核准核查审批调件</el-menu-item>
          <el-menu-item index="/check/corporate-card-transfer">核准核查公务卡审批调件</el-menu-item>
          <el-menu-item index="/check/today-closed">核准核查本日结案</el-menu-item>
          <el-menu-item index="/check/unclosed">核准核查未结案</el-menu-item>
          <el-menu-item index="/check/reassign">核准核查重新分派</el-menu-item>
          <el-menu-item index="/check/return-supplement">核准核查退补</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/system/products">
          <template #title>
            <el-icon><component :is="CreditCard" /></el-icon>
            <span>产品管理</span>
          </template>
          <el-menu-item index="/system/products">产品大类管理</el-menu-item>
          <el-menu-item index="/system/products/inner-cards">产品内卡信息维护</el-menu-item>
          <el-menu-item index="/system/products/outer-cards">产品外卡信息维护</el-menu-item>
          <el-menu-item index="/system/products/publish">产品发布</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><component :is="Setting" /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/parameters">业务参数管理</el-menu-item>
          <el-menu-item index="/system/organizations">机构管理</el-menu-item>
          <el-menu-item index="/system/users">用户管理</el-menu-item>
          <el-menu-item index="/system/switches">开关管理</el-menu-item>
          <el-menu-item index="/system/sms-templates">短信模板管理</el-menu-item>
          <el-menu-item index="/system/approval-levels">审批级别管理</el-menu-item>
          <el-menu-item index="/system/approval-limits">员工审批额度管理</el-menu-item>
          <el-menu-item index="/system/blacklist-management">黑名单管理</el-menu-item>
          <el-menu-item index="/system/external-params">外部参数采集管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-right">
          <span>{{ userStore.realName }}</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { HomeFilled, Setting, CreditCard, Picture, Document, CircleCheck, OfficeBuilding } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import router from '@/router'

const userStore = useUserStore()

const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

const handleMenuSelect = (key, keyPath) => {
  console.log('Menu selected:', key)
  console.log('Key path:', keyPath)
  console.log('Has route:', router.hasRoute(key))
  try {
    router.push(key)
    console.log('Route pushed successfully')
  } catch (error) {
    console.error('Route push error:', error)
  }
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #8b0000;
  width: 240px !important;
}

.logo {
  padding: 20px;
  font-size: 18px;
  color: white;
  text-align: center;
  background-color: #a52a2a;
  white-space: normal;
  word-break: break-word;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
}

:deep(.el-sub-menu__title) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
  padding: 14px 20px !important;
  height: auto !important;
  font-size: 15px;
  font-weight: 600;
  background-color: rgba(139, 0, 0, 0.85) !important;
  border-left: 3px solid #ffd700;
}

:deep(.el-sub-menu__title:hover) {
  background-color: rgba(165, 42, 42, 0.9) !important;
}

:deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
  margin-right: 10px;
}

:deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  font-size: 14px;
}

:deep(.el-menu-item) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  padding: 10px 20px 10px 45px !important;
  height: auto !important;
  font-size: 13px;
  font-weight: 400;
  background-color: rgba(139, 0, 0, 0.4) !important;
  border-left: 3px solid transparent;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(165, 42, 42, 0.7) !important;
  border-left-color: #ffd700;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 215, 0, 0.2) !important;
  border-left-color: #ffd700;
  color: #ffd700 !important;
}

:deep(.el-menu-item:not(.is-active)) {
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.el-menu-item.is-active:not(.el-sub-menu__title)) {
  font-weight: 500;
}
</style>