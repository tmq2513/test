import { ref, computed } from 'vue'

const levelOptions = ['初级审批', '一级审批', '二级审批', '三级审批', '四级审批', '五级审批', '六级审批']

const orgOptions = [
  { name: '北京分行' }, { name: '天津分行' }, { name: '河北分行' }, { name: '山西分行' },
  { name: '内蒙古分行' }, { name: '辽宁分行' }, { name: '吉林分行' }, { name: '黑龙江分行' },
  { name: '上海分行' }, { name: '江苏分行' }, { name: '浙江分行' }, { name: '安徽分行' },
  { name: '福建分行' }, { name: '江西分行' }, { name: '山东分行' }, { name: '河南分行' },
  { name: '湖北分行' }, { name: '湖南分行' }, { name: '广东分行' }, { name: '广西分行' },
  { name: '海南分行' }, { name: '重庆分行' }, { name: '四川分行' }, { name: '贵州分行' },
  { name: '云南分行' }, { name: '西藏分行' }, { name: '陕西分行' }, { name: '甘肃分行' },
  { name: '青海分行' }, { name: '宁夏分行' }, { name: '新疆分行' }, { name: '深圳分行' },
  { name: '厦门分行' }, { name: '宁波分行' }, { name: '青岛分行' }, { name: '大连分行' }
]

const defaultLevelConfig = {
  '初级审批': { min: 0, max: 10000 },
  '一级审批': { min: 10000, max: 50000 },
  '二级审批': { min: 50000, max: 100000 },
  '三级审批': { min: 100000, max: 500000 },
  '四级审批': { min: 500000, max: 1000000 },
  '五级审批': { min: 1000000, max: 5000000 },
  '六级审批': { min: 5000000, max: 99999999 }
}

const approvalLevels = ref([])

const generateDefaultLevels = () => [
  { levelName: '初级审批', minAmount: 0, maxAmount: 10000 },
  { levelName: '一级审批', minAmount: 10000, maxAmount: 50000 },
  { levelName: '二级审批', minAmount: 50000, maxAmount: 100000 },
  { levelName: '三级审批', minAmount: 100000, maxAmount: 500000 },
  { levelName: '四级审批', minAmount: 500000, maxAmount: 1000000 },
  { levelName: '五级审批', minAmount: 1000000, maxAmount: 5000000 },
  { levelName: '六级审批', minAmount: 5000000, maxAmount: 99999999 }
]

const generateInitialLogs = (bankId) => {
  if (bankId === 1 || bankId === 9 || bankId === 19) {
    return [
      {
        id: Date.now() - 86400000 * 5,
        operatorCode: 'EMP001',
        operatorName: '张三',
        operationTime: '2026-06-24 10:30:00',
        operationContent: '修改四级审批额度：最低额度由300000调整为500000，最高额度由800000调整为1000000'
      },
      {
        id: Date.now() - 86400000 * 2,
        operatorCode: 'EMP002',
        operatorName: '李四',
        operationTime: '2026-06-27 14:15:00',
        operationContent: '修改初级审批额度：最高额度由5000调整为10000'
      }
    ]
  }
  return []
}

const initializeApprovalLevels = () => {
  if (approvalLevels.value.length === 0) {
    approvalLevels.value = orgOptions.map((bank, index) => ({
      id: index + 1,
      orgName: bank.name,
      levels: generateDefaultLevels(),
      logs: generateInitialLogs(index + 1)
    }))
  }
}

const getLevelConfig = (orgName, levelName) => {
  initializeApprovalLevels()
  const org = approvalLevels.value.find(o => o.orgName === orgName)
  if (org) {
    const level = org.levels.find(l => l.levelName === levelName)
    if (level) {
      return { min: level.minAmount, max: level.maxAmount }
    }
  }
  return defaultLevelConfig[levelName] || { min: 0, max: 0 }
}

const orgSelectOptions = computed(() => {
  return orgOptions.map(o => ({ label: o.name, value: o.name }))
})

export function useSystemData() {
  return {
    levelOptions,
    orgOptions,
    orgSelectOptions,
    approvalLevels,
    generateDefaultLevels,
    initializeApprovalLevels,
    getLevelConfig
  }
}