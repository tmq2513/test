import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/scan/page',
    name: 'ScanPage',
    component: () => import('@/views/scan/ScanPage.vue'),
    meta: { title: '影像扫描' }
  },
  {
    path: '/scan/view-page',
    name: 'ScanViewPage',
    component: () => import('@/views/scan/ScanViewPage.vue'),
    meta: { title: '影像调阅' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/scan/personal-card',
        name: 'ScanPersonalCard',
        component: () => import('@/views/scan/PersonalCardScan.vue'),
        meta: { title: '个人卡申请影像扫描' }
      },
      {
        path: '/scan/personal-company-card',
        name: 'ScanPersonalCompanyCard',
        component: () => import('@/views/scan/PersonalCompanyCardScan.vue'),
        meta: { title: '个人公司卡申请影像扫描' }
      },
      {
        path: '/scan/company-structure',
        name: 'ScanCompanyStructure',
        component: () => import('@/views/scan/CompanyStructureScan.vue'),
        meta: { title: '公司架构建立扫描' }
      },
      {
        path: '/scan/application-rescan',
        name: 'ScanApplicationRescan',
        component: () => import('@/views/scan/ApplicationRescan.vue'),
        meta: { title: '申请补扫' }
      },
      {
        path: '/scan/personal-return-requeue',
        name: 'ScanPersonalReturnRequeue',
        component: () => import('@/views/scan/PersonalReturnRequeue.vue'),
        meta: { title: '个人申请退件重扫队列' }
      },
      {
        path: '/scan/personal-return-rescan',
        name: 'ScanPersonalReturnRescan',
        component: () => import('@/views/scan/PersonalReturnRescan.vue'),
        meta: { title: '个人退件补扫队列' }
      },
      {
        path: '/scan/application-view',
        name: 'ScanApplicationView',
        component: () => import('@/views/scan/ApplicationView.vue'),
        meta: { title: '申请件影像调阅' }
      },
      {
        path: '/scan/company-structure-view',
        name: 'ScanCompanyStructureView',
        component: () => import('@/views/scan/CompanyStructureView.vue'),
        meta: { title: '公司架构影像调阅' }
      },
      {
        path: '/scan/no-image-rescan',
        name: 'ScanNoImageRescan',
        component: () => import('@/views/scan/PersonalCardScan.vue'),
        meta: { title: '无影像补扫' }
      },
      {
        path: '/applications',
        name: 'Applications',
        component: () => import('@/views/Applications.vue'),
        meta: { title: '申请管理' }
      },
      {
        path: '/company/structure-review',
        name: 'CompanyStructureReview',
        component: () => import('@/views/company/CompanyStructureReview.vue'),
        meta: { title: '公司架构影像复核' }
      },
      {
        path: '/company/structure-review/detail',
        name: 'CompanyStructureReviewDetail',
        component: () => import('@/views/company/CompanyStructureReviewDetail.vue'),
        meta: { title: '公司架构影像审核' }
      },
      {
        path: '/company/structure-approval',
        name: 'CompanyStructureApproval',
        component: () => import('@/views/company/CompanyStructureApproval.vue'),
        meta: { title: '公司架构影像审批' }
      },
      {
        path: '/company/structure-review-return',
        name: 'CompanyStructureReviewReturn',
        component: () => import('@/views/company/CompanyStructureReviewReturn.vue'),
        meta: { title: '公司架构影像审核退回' }
      },
      {
        path: '/applications/create',
        name: 'CreateApplication',
        component: () => import('@/views/CreateApplication.vue'),
        meta: { title: '创建申请' }
      },
      {
        path: '/applications/detail/:id',
        name: 'ApplicationDetail',
        component: () => import('@/views/ApplicationDetail.vue'),
        meta: { title: '申请详情' }
      },
      {
        path: '/check',
        name: 'Check',
        component: () => import('@/views/check/CheckHome.vue'),
        meta: { title: '核准核查' }
      },
      {
        path: '/check/approval-transfer',
        name: 'CheckApprovalTransfer',
        component: () => import('@/views/check/ApprovalTransfer.vue'),
        meta: { title: '核准核查审批调件' }
      },
      {
        path: '/check/corporate-card-transfer',
        name: 'CheckCorporateCardTransfer',
        component: () => import('@/views/check/CorporateCardTransfer.vue'),
        meta: { title: '核准核查公务卡审批调件' }
      },
      {
        path: '/check/today-closed',
        name: 'CheckTodayClosed',
        component: () => import('@/views/check/TodayClosed.vue'),
        meta: { title: '核准核查本日结案' }
      },
      {
        path: '/check/unclosed',
        name: 'CheckUnclosed',
        component: () => import('@/views/check/Unclosed.vue'),
        meta: { title: '核准核查未结案' }
      },
      {
        path: '/check/reassign',
        name: 'CheckReassign',
        component: () => import('@/views/check/Reassign.vue'),
        meta: { title: '核准核查重新分派' }
      },
      {
        path: '/check/return-supplement',
        name: 'CheckReturnSupplement',
        component: () => import('@/views/check/ReturnSupplement.vue'),
        meta: { title: '核准核查退补' }
      },
      {
        path: '/check/audit',
        name: 'CheckAudit',
        component: () => import('@/views/check/CheckAudit.vue'),
        meta: { title: '核准核查审核' }
      },
      {
        path: '/approval',
        name: 'Approval',
        component: () => import('@/views/Approval.vue'),
        meta: { title: '审批决策' }
      },
      {
        path: '/external-data',
        name: 'ExternalData',
        component: () => import('@/views/ExternalData.vue'),
        meta: { title: '外部信息采集' }
      },
      {
        path: '/system/products',
        name: 'Products',
        component: () => import('@/views/system/products/ProductCategories.vue'),
        meta: { title: '产品大类管理' }
      },
      {
        path: '/system/products/inner-cards',
        name: 'InnerCards',
        component: () => import('@/views/system/products/InnerCards.vue'),
        meta: { title: '产品内卡信息维护' }
      },
      {
        path: '/system/products/outer-cards',
        name: 'OuterCards',
        component: () => import('@/views/system/products/OuterCards.vue'),
        meta: { title: '产品外卡信息维护' }
      },
      {
        path: '/system/products/publish',
        name: 'ProductPublish',
        component: () => import('@/views/system/products/ProductPublish.vue'),
        meta: { title: '产品发布' }
      },
      {
        path: '/system/parameters',
        name: 'Parameters',
        component: () => import('@/views/system/Parameters.vue'),
        meta: { title: '业务参数管理' }
      },
      {
        path: '/system/organizations',
        name: 'Organizations',
        component: () => import('@/views/system/Organizations.vue'),
        meta: { title: '机构管理' }
      },
      {
        path: '/system/users',
        name: 'SystemUsers',
        component: () => import('@/views/system/Users.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/system/switches',
        name: 'Switches',
        component: () => import('@/views/system/Switches.vue'),
        meta: { title: '开关管理' }
      },
      {
        path: '/system/sms-templates',
        name: 'SmsTemplates',
        component: () => import('@/views/system/SmsTemplates.vue'),
        meta: { title: '短信模板管理' }
      },
      {
        path: '/system/approval-levels',
        name: 'ApprovalLevels',
        component: () => import('@/views/system/ApprovalLevels.vue'),
        meta: { title: '审批级别管理' }
      },
      {
        path: '/system/approval-limits',
        name: 'ApprovalLimits',
        component: () => import('@/views/system/ApprovalLimits.vue'),
        meta: { title: '员工审批额度管理' }
      },
      {
        path: '/system/blacklist-management',
        name: 'BlacklistManagement',
        component: () => import('@/views/system/BlacklistManagement.vue'),
        meta: { title: '黑名单管理' }
      },
      {
        path: '/system/external-params',
        name: 'ExternalParams',
        component: () => import('@/views/system/ExternalParams.vue'),
        meta: { title: '外部参数采集管理' }
      },
      {
        path: '/entry/transfer',
        name: 'EntryTransfer',
        component: () => import('@/views/entry/EntryTransfer.vue'),
        meta: { title: '录入调件' }
      },
      {
        path: '/entry/unclosed',
        name: 'EntryUnclosed',
        component: () => import('@/views/entry/EntryUnclosed.vue'),
        meta: { title: '录入未结案' }
      },
      {
        path: '/entry/closed',
        name: 'EntryClosed',
        component: () => import('@/views/entry/EntryClosed.vue'),
        meta: { title: '录入已结案' }
      },
      {
        path: '/entry/closed/detail',
        name: 'EntryDetail',
        component: () => import('@/views/entry/EntryDetail.vue'),
        meta: { title: '个人主申请详情' }
      },
      {
        path: '/entry/reassign',
        name: 'EntryReassign',
        component: () => import('@/views/entry/EntryReassign.vue'),
        meta: { title: '录入重新分派' }
      },
      {
        path: '/entry/transfer/form',
        name: 'EntryForm',
        component: () => import('@/views/entry/EntryForm.vue'),
        meta: { title: '申请录入' }
      },
      {
        path: '/entry/modify',
        name: 'EntryModify',
        component: () => import('@/views/entry/EntryModify.vue'),
        meta: { title: '个人主申请信息修改' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router