<template>
  <div class="check-audit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>核准核查审核</span>
          <el-tag :type="getStatusTagType(applicationData.status)">{{ getStatusText(applicationData.status) }}</el-tag>
        </div>
      </template>

      <div class="console-buttons">
        <el-button @click="handleRescan">影像重扫</el-button>
        <el-button type="warning" @click="handleReturnSupplement">退补</el-button>
        <el-button type="danger" @click="handleError">差错</el-button>
      </div>

      <el-divider content-position="left">申请件信息</el-divider>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
        <el-button @click="handleModifyApplication">申请件信息修改</el-button>
        <el-button @click="handleViewImages">查看影像</el-button>
        <el-button @click="showOperationDrawer = true">操作记录</el-button>
      </div>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="申请件编号">{{ applicationData.applicationId }}</el-descriptions-item>
        <el-descriptions-item label="申请类型">
          <el-tag :type="getTypeTagType(applicationData.applicationType)">{{ applicationData.applicationType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="产品数字代码">{{ applicationData.productCode }}</el-descriptions-item>
        <el-descriptions-item label="产品发布名称">{{ applicationData.productName }}</el-descriptions-item>
        <el-descriptions-item label="所属机构编号">{{ applicationData.organizationCode }}</el-descriptions-item>
        <el-descriptions-item label="所属机构名称">{{ applicationData.organizationName }}</el-descriptions-item>
        <el-descriptions-item label="申请渠道">{{ applicationData.applicationChannel }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">客户信息</el-divider>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="客户姓名">{{ applicationData.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">
          <el-tag :type="applicationData.customerType === '新客户' ? 'success' : 'info'">{{ applicationData.customerType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户证件类型">{{ applicationData.documentType }}</el-descriptions-item>
        <el-descriptions-item label="客户证件号码">{{ maskDocumentNumber(applicationData.documentNumber) }}</el-descriptions-item>
        <el-descriptions-item label="客户号">{{ applicationData.customerId }}</el-descriptions-item>
        <el-descriptions-item label="工作单位名称">{{ applicationData.workUnit }}</el-descriptions-item>
        <el-descriptions-item label="授信额度">¥{{ formatNumber(applicationData.creditLimit) }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left" v-if="['主附', '附'].includes(applicationData.applicationType)">附属卡信息</el-divider>
      <el-table v-if="['主附', '附'].includes(applicationData.applicationType) && applicationData.secondaryCards.length > 0" :data="applicationData.secondaryCards" border size="small" stripe>
        <el-table-column prop="applicationId" label="申请件编号" width="160" />
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="documentNumber" label="证件号码" width="180">
          <template #default="{ row }">
            {{ maskDocumentNumber(row.documentNumber) }}
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品发布名称" width="150" />
      </el-table>

      <el-divider content-position="left">检测模块</el-divider>
      <el-card class="detection-card">
        <el-row :gutter="16">
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.coreCheck)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.coreCheck" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.coreCheck === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">核心检查</div>
              <div class="detection-result">{{ getDetectionText('coreCheck', detectionResults.coreCheck) }}</div>
              <el-button size="small" @click="handleSingleDetect('coreCheck')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.decisionEngine)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.decisionEngine" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.decisionEngine === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">决策引擎</div>
              <div class="detection-result">{{ getDetectionText('decisionEngine', detectionResults.decisionEngine) }}</div>
              <el-button size="small" @click="handleSingleDetect('decisionEngine')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.blacklist)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.blacklist" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.blacklist === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">黑/灰名单</div>
              <div class="detection-result">{{ getDetectionText('blacklist', detectionResults.blacklist) }}</div>
              <el-button size="small" @click="handleSingleDetect('blacklist')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.duplicate)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.duplicate" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.duplicate === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">重复申请</div>
              <div class="detection-result">{{ getDetectionText('duplicate', detectionResults.duplicate) }}</div>
              <el-button size="small" @click="handleSingleDetect('duplicate')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.antiMoneyLaundering)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.antiMoneyLaundering" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.antiMoneyLaundering === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">反洗钱</div>
              <div class="detection-result">{{ getDetectionText('antiMoneyLaundering', detectionResults.antiMoneyLaundering) }}</div>
              <el-button size="small" @click="handleSingleDetect('antiMoneyLaundering')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card :class="getDetectionClass(detectionResults.fraud)" body-style="padding: 15px;">
              <div class="detection-icon">
                <el-icon v-if="detectionResults.fraud" color="#67c23a"><CircleCheck /></el-icon>
                <el-icon v-else-if="detectionResults.fraud === false" color="#f56c6c"><Close /></el-icon>
                <el-icon v-else color="#909399"><CircleCheck /></el-icon>
              </div>
              <div class="detection-name">欺诈</div>
              <div class="detection-result">{{ getDetectionText('fraud', detectionResults.fraud) }}</div>
              <el-button size="small" @click="handleSingleDetect('fraud')" style="width: 100%; margin-top: 10px;">检测</el-button>
            </el-card>
          </el-col>
        </el-row>
        <div v-if="Object.keys(detectionMessages).length > 0" class="detection-messages">
          <div v-for="(msg, type) in detectionMessages" :key="type" class="detection-message" :class="msg.success ? 'success' : 'warning'">
            <el-icon><component :is="msg.success ? CircleCheck : Warning" /></el-icon>
            <span>{{ msg.text }}</span>
          </div>
        </div>
      </el-card>

      <el-divider content-position="left">系统审核查询</el-divider>
      <el-card class="system-audit-card">
        <el-row :gutter="16">
          <el-col :span="4">
            <el-button type="primary" @click="openDecisionResult" style="width: 100%;">决策结果</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="openCreditRequery" style="width: 100%;">征信重征</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleInitiateEvaluation" style="width: 100%;">发起评价</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="openEvaluationResult" style="width: 100%;">评价结果</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="openFraudDetection" style="width: 100%;">欺诈侦测结果</el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-divider content-position="left">核查记录</el-divider>
      <el-form :model="checkRecordForm" label-width="160px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="核准核查结果">
              <el-radio-group v-model="checkRecordForm.checkResult">
                <el-radio value="PASS">通过</el-radio>
                <el-radio value="FAIL">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号核查">
              <el-select v-model="checkRecordForm.phoneCheck" placeholder="请选择">
                <el-option label="本人接听" value="SELF_ANSWERED" />
                <el-option label="他人接听" value="OTHER_ANSWERED" />
                <el-option label="无人接听" value="NO_ANSWER" />
                <el-option label="手机号码为空" value="EMPTY_PHONE" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位电话核查">
              <el-select v-model="checkRecordForm.companyCheck" placeholder="请选择">
                <el-option label="单位确认" value="COMPANY_CONFIRMED" />
                <el-option label="单位否认" value="COMPANY_DENIED" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人电话核查">
              <el-select v-model="checkRecordForm.contactCheck" placeholder="请选择">
                <el-option label="联系人确认" value="CONTACT_CONFIRMED" />
                <el-option label="联系人否认" value="CONTACT_DENIED" />
                <el-option label="联系人无人接听" value="CONTACT_NO_ANSWER" />
                <el-option label="联系人空号" value="CONTACT_INVALID" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户族群">
              <el-select v-model="checkRecordForm.customerGroup" placeholder="请选择">
                <el-option label="0普通客户" value="0" />
                <el-option label="8100重点行业客户" value="8100" />
                <el-option label="8200重点客户" value="8200" />
                <el-option label="8300特殊客户" value="8300" />
                <el-option label="8410高风险客户-有条件办卡" value="8410" />
                <el-option label="8420高风险客户-拒绝办卡" value="8420" />
                <el-option label="8500学生客户" value="8500" />
                <el-option label="8600行内集团客户" value="8600" />
                <el-option label="8700推荐客户" value="8700" />
              </el-select>
            </el-form-item>
            <el-form-item label="逻辑性检查">
              <el-radio-group v-model="checkRecordForm.logicCheck">
                <el-radio value="GOOD">良</el-radio>
                <el-radio value="BAD">不良</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可证明收入类型1">
              <el-select v-model="checkRecordForm.incomeType1" placeholder="请选择">
                <el-option label="银行代发工资的存折/账单" value="BANK_SALARY" />
                <el-option label="个人所得税完税证明" value="TAX_PROOF" />
                <el-option label="公积金扣缴凭证" value="HOUSING_FUND" />
                <el-option label="社会保险扣缴凭证" value="SOCIAL_INSURANCE" />
                <el-option label="其他收入证明" value="OTHER_INCOME" />
              </el-select>
            </el-form-item>
            <el-form-item label="可证明收入值1">
              <el-input v-model="checkRecordForm.incomeValue1" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可证明收入类型2">
              <el-select v-model="checkRecordForm.incomeType2" placeholder="请选择">
                <el-option label="银行代发工资的存折/账单" value="BANK_SALARY" />
                <el-option label="个人所得税完税证明" value="TAX_PROOF" />
                <el-option label="公积金扣缴凭证" value="HOUSING_FUND" />
                <el-option label="社会保险扣缴凭证" value="SOCIAL_INSURANCE" />
                <el-option label="其他收入证明" value="OTHER_INCOME" />
              </el-select>
            </el-form-item>
            <el-form-item label="可证明收入值2">
              <el-input v-model="checkRecordForm.incomeValue2" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可证明资产类型1">
              <el-select v-model="checkRecordForm.assetType1" placeholder="请选择">
                <el-option label="自有房产" value="HOUSE" />
                <el-option label="自由汽车" value="CAR" />
                <el-option label="基金债券" value="FUND" />
                <el-option label="活期存款" value="DEMAND_DEPOSIT" />
                <el-option label="定期存款" value="TIME_DEPOSIT" />
                <el-option label="人寿保险" value="INSURANCE" />
              </el-select>
            </el-form-item>
            <el-form-item label="可证明资产值1">
              <el-input v-model="checkRecordForm.assetValue1" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可证明资产类型2">
              <el-select v-model="checkRecordForm.assetType2" placeholder="请选择">
                <el-option label="自有房产" value="HOUSE" />
                <el-option label="自由汽车" value="CAR" />
                <el-option label="基金债券" value="FUND" />
                <el-option label="活期存款" value="DEMAND_DEPOSIT" />
                <el-option label="定期存款" value="TIME_DEPOSIT" />
                <el-option label="人寿保险" value="INSURANCE" />
              </el-select>
            </el-form-item>
            <el-form-item label="可证明资产值2">
              <el-input v-model="checkRecordForm.assetValue2" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="核准核查备注">
          <el-input v-model="checkRecordForm.remark" type="textarea" :rows="4" placeholder="请输入核查备注" />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">操作</el-divider>
      <div class="action-buttons">
        <el-button type="success" @click="handleSubmit">提交</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="danger" @click="handleReject">拒绝</el-button>
      </div>
    </el-card>

    <el-dialog v-model="decisionResultVisible" title="决策结果" width="900px" class="custom-dialog">
      <div class="dialog-content">
        <div class="result-summary">
          <div class="summary-item">
            <span class="summary-label">申请件编号</span>
            <span class="summary-value">{{ decisionResultData.applicationId }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">产品名称</span>
            <span class="summary-value">{{ decisionResultData.productName }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">行内评分</span>
            <span class="summary-value score">{{ decisionResultData.internalScore }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">主卡人民币额度</span>
            <span class="summary-value amount">¥{{ formatNumber(decisionResultData.mainCardRMBLimit) }}</span>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="result-section">
          <div class="section-title">基本信息</div>
          <div class="section-grid">
            <div class="grid-item">
              <span class="item-label">汇率</span>
              <span class="item-value">{{ decisionResultData.exchangeRate }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">是否经过降级</span>
              <el-tag :type="decisionResultData.isDowngraded ? 'danger' : 'success'" size="small">{{ decisionResultData.isDowngraded ? '是' : '否' }}</el-tag>
            </div>
            <div class="grid-item">
              <span class="item-label">申请人随机数据</span>
              <span class="item-value">{{ decisionResultData.randomData }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">视频面签风险标识</span>
              <span class="item-value">{{ decisionResultData.videoRiskFlag }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">客群标识</span>
              <span class="item-value">{{ decisionResultData.customerGroupFlag }}</span>
            </div>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="result-section">
          <div class="section-title">授信结果</div>
          <div class="section-grid">
            <div class="grid-item">
              <span class="item-label">主卡授信结果代码</span>
              <span class="item-value">{{ decisionResultData.mainCardCreditCode }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">主卡授信结果描述</span>
              <span class="item-value">{{ decisionResultData.mainCardCreditDesc }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">主卡授信原因代码</span>
              <span class="item-value">{{ decisionResultData.mainCardReasonCode }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">主卡授信原因描述</span>
              <span class="item-value">{{ decisionResultData.mainCardReasonDesc }}</span>
            </div>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="result-section">
          <div class="section-title">额度信息</div>
          <div class="section-grid">
            <div class="grid-item">
              <span class="item-label">总授信额度上限</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.totalCreditLimit) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">主卡人人民币取现额度</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.mainCardCashLimit) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">有效卡最高额度</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.maxActiveCardLimit) }}</span>
            </div>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="result-section">
          <div class="section-title">收入负债信息</div>
          <div class="section-grid">
            <div class="grid-item">
              <span class="item-label">月收入</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.monthlyIncome) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">负债值</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.debtValue) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">他行卡额度</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.otherBankLimit) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">刚扣收入类型</span>
              <span class="item-value">{{ decisionResultData.deductedIncomeType }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">刚扣收入值</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.deductedIncome) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">刚扣剩余额度</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.deductedRemaining) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">收入负债类型</span>
              <span class="item-value">{{ decisionResultData.incomeDebtType }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">收入负债值</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.incomeDebtValue) }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">收入负债剩余额度</span>
              <span class="item-value amount">¥{{ formatNumber(decisionResultData.incomeDebtRemaining) }}</span>
            </div>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="result-section">
          <div class="section-title">评分与决策信息</div>
          <div class="section-grid">
            <div class="grid-item">
              <span class="item-label">主卡额度原因代码</span>
              <span class="item-value">{{ decisionResultData.mainCardLimitReasonCode }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">主卡额度原因描述</span>
              <span class="item-value">{{ decisionResultData.mainCardLimitReasonDesc }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">版本号</span>
              <span class="item-value">{{ decisionResultData.version }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">决策标识</span>
              <span class="item-value">{{ decisionResultData.decisionFlag }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">是否新增授信标识</span>
              <el-tag :type="decisionResultData.isNewCredit ? 'success' : 'info'" size="small">{{ decisionResultData.isNewCredit ? '是' : '否' }}</el-tag>
            </div>
            <div class="grid-item">
              <span class="item-label">评分结果</span>
              <span class="item-value">{{ decisionResultData.scoreResult }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">网络评分卡类型</span>
              <span class="item-value">{{ decisionResultData.networkScoreType }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">发卡新老客户标识</span>
              <span class="item-value">{{ decisionResultData.issueNewOldFlag }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">审批新老客户标识</span>
              <span class="item-value">{{ decisionResultData.approvalNewOldFlag }}</span>
            </div>
            <div class="grid-item">
              <span class="item-label">决策过程记录ID</span>
              <span class="item-value">{{ decisionResultData.decisionProcessId }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="decisionResultVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="creditRequeryVisible" title="征信重征" width="700px" class="custom-dialog">
      <div class="dialog-content">
        <div class="section-title">选择征信</div>
        <el-form :model="creditRequeryForm">
          <el-form-item>
            <el-checkbox-group v-model="creditRequeryForm.selectedCredits">
              <el-checkbox label="人民银行征信" />
              <el-checkbox label="百行征信" />
              <el-checkbox label="芝麻信用" />
              <el-checkbox label="腾讯征信" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <el-divider></el-divider>
        <div class="section-title">查询记录</div>
        <el-table :data="creditRequeryHistory" border size="small" stripe>
          <el-table-column prop="name" label="征信名称" width="150" />
          <el-table-column prop="operator" label="查询人" width="100" />
          <el-table-column prop="time" label="查询时间" width="180" />
          <el-table-column prop="count" label="重征次数" width="100" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="creditRequeryVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreditRequery">发起征信重征</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="evaluationResultVisible" title="评价结果" width="700px" class="custom-dialog">
      <div class="dialog-content">
        <div class="section-title">客户信息</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="客户号">{{ evaluationResultData.customerId }}</el-descriptions-item>
          <el-descriptions-item label="客户姓名">{{ evaluationResultData.customerName }}</el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <div class="section-title">额度信息</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="最大可审批产品额度（单位：元）">¥{{ formatNumber(evaluationResultData.maxApprovalLimit) }}</el-descriptions-item>
          <el-descriptions-item label="产品额度对授信额度占用（单位：元）">¥{{ formatNumber(evaluationResultData.limitOccupancy) }}</el-descriptions-item>
          <el-descriptions-item label="客户授信限额（元）">¥{{ formatNumber(evaluationResultData.customerCreditLimit) }}</el-descriptions-item>
          <el-descriptions-item label="客户已有授信产品对授信限额占用（单位：元）">¥{{ formatNumber(evaluationResultData.existingOccupancy) }}</el-descriptions-item>
          <el-descriptions-item label="调整后帽子额度（单位：元）">¥{{ formatNumber(evaluationResultData.adjustedCapLimit) }}</el-descriptions-item>
          <el-descriptions-item label="客户偿还能力（单位：元）">¥{{ formatNumber(evaluationResultData.repaymentAbility) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <div class="section-title">审批结果</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="审批结果">
            <el-tag :type="evaluationResultData.approvalResult === '通过' ? 'success' : 'danger'" size="large">{{ evaluationResultData.approvalResult }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户授信限额来源系统">{{ evaluationResultData.sourceSystem }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ evaluationResultData.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="evaluationResultVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="fraudDetectionVisible" title="欺诈侦测结果" width="700px" class="custom-dialog">
      <div class="dialog-content">
        <div class="risk-indicator">
          <span class="risk-label">风险等级：</span>
          <el-tag :type="getRiskLevelType(fraudDetectionData.riskLevel)" size="large">{{ fraudDetectionData.riskLevel }}</el-tag>
          <span class="score-label">欺诈评分：</span>
          <el-tag type="info" size="large">{{ fraudDetectionData.fraudScore }}</el-tag>
        </div>

        <el-divider></el-divider>
        <div class="section-title">基本信息</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请件编号">{{ fraudDetectionData.applicationId }}</el-descriptions-item>
          <el-descriptions-item label="侦测时间">{{ fraudDetectionData.detectionTime }}</el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <div class="section-title">异常检测结果</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备指纹异常">
            <el-tag :type="fraudDetectionData.deviceAbnormal ? 'danger' : 'success'">{{ fraudDetectionData.deviceAbnormal ? '是' : '否' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP异常">
            <el-tag :type="fraudDetectionData.ipAbnormal ? 'danger' : 'success'">{{ fraudDetectionData.ipAbnormal ? '是' : '否' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="行为轨迹异常">
            <el-tag :type="fraudDetectionData.behaviorAbnormal ? 'danger' : 'success'">{{ fraudDetectionData.behaviorAbnormal ? '是' : '否' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="关联欺诈">
            <el-tag :type="fraudDetectionData.relatedFraud ? 'danger' : 'success'">{{ fraudDetectionData.relatedFraud ? '是' : '否' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <div class="section-title">风险描述</div>
        <div class="risk-description">
          {{ fraudDetectionData.riskDescription }}
        </div>
      </div>
      <template #footer>
        <el-button @click="fraudDetectionVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rescanVisible" title="影像重扫" width="500px" class="custom-dialog">
      <div class="dialog-content">
        <el-form :model="rescanForm" label-width="100px">
          <el-form-item label="重扫类型">
            <el-select v-model="rescanForm.rescanType" placeholder="请选择重扫类型" style="width: 100%;">
              <el-option label="证件影像模糊" value="BLURRED" />
              <el-option label="证件影像缺失" value="MISSING" />
              <el-option label="证件影像错误" value="WRONG" />
              <el-option label="证件影像过期" value="EXPIRED" />
              <el-option label="其他" value="OTHER" />
            </el-select>
          </el-form-item>
          <el-form-item label="重扫备注">
            <el-input v-model="rescanForm.rescanRemark" type="textarea" :rows="4" placeholder="请输入重扫备注" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="rescanVisible = false">取消</el-button>
        <el-button type="primary" @click="handleInitiateRescan">发起</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="returnSupplementVisible" title="退补" width="700px" class="custom-dialog">
      <div class="dialog-content">
        <div class="section-title">申请信息</div>
        <el-form :model="returnSupplementForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请件编号">
                <el-input :value="applicationData.applicationId" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退补主体">
                <el-radio-group v-model="returnSupplementForm.supplementType">
                  <el-radio value="MAIN">主</el-radio>
                  <el-radio value="MAIN_SECONDARY">主附</el-radio>
                  <el-radio value="SECONDARY">附</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider></el-divider>

        <div class="section-title">补件信息</div>
        <el-form :model="returnSupplementForm" label-width="100px">
          <el-form-item label="补扫类型">
            <el-checkbox-group v-model="returnSupplementForm.scanTypes">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-checkbox label="99-主申请表单" value="99" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="01-附属卡申请表单" value="01" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="02-主卡身份证明文件" value="02" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="03-财力证明" value="03" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="04-居住地证明文件" value="04" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="05-分行证明文件" value="05" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="06-主卡人照片" value="06" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="07-附属卡一照片" value="07" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="08-附属卡二照片" value="08" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="09-附属卡三照片" value="09" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="10-EMS附件" value="10" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="11-其他" value="11" />
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="补件机构">
                <el-select v-model="returnSupplementForm.organization" placeholder="请选择补件机构" style="width: 100%;">
                  <el-option label="总行营业部" value="HEAD_OFFICE" />
                  <el-option label="北京分行" value="BEIJING" />
                  <el-option label="上海分行" value="SHANGHAI" />
                  <el-option label="广州分行" value="GUANGZHOU" />
                  <el-option label="深圳分行" value="SHENZHEN" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补件截止日期">
                <el-date-picker v-model="returnSupplementForm.deadline" type="date" placeholder="请选择补件截止日期" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="退补原因">
            <el-input v-model="returnSupplementForm.reason" type="textarea" :rows="3" placeholder="请输入退补原因" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="returnSupplementVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmReturnSupplement">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="errorRecordVisible" title="差错记录" width="500px" class="custom-dialog">
      <div class="dialog-content">
        <el-form :model="errorRecordForm" label-width="80px">
          <el-form-item label="差错备注">
            <el-input v-model="errorRecordForm.errorRemark" type="textarea" :rows="5" placeholder="请输入差错备注" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="errorRecordVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmErrorRecord">确认</el-button>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, Close, Warning } from '@element-plus/icons-vue'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const applicationData = reactive({
  applicationId: '',
  applicationType: '',
  productCode: '',
  productName: '',
  organizationCode: '',
  organizationName: '',
  applicationChannel: '',
  createdAt: '',
  status: '',
  customerName: '',
  customerType: '',
  documentType: '',
  documentNumber: '',
  customerId: '',
  workUnit: '',
  creditLimit: '',
  secondaryCards: []
})

const detectionResults = reactive({
  coreCheck: null,
  decisionEngine: null,
  blacklist: null,
  duplicate: null,
  antiMoneyLaundering: null,
  fraud: null
})

const detectionMessages = reactive({})

const checkRecordForm = reactive({
  checkResult: '',
  phoneCheck: '',
  companyCheck: '',
  contactCheck: '',
  customerGroup: '',
  logicCheck: '',
  incomeType1: '',
  incomeValue1: '',
  incomeType2: '',
  incomeValue2: '',
  assetType1: '',
  assetValue1: '',
  assetType2: '',
  assetValue2: '',
  remark: ''
})

const decisionResultVisible = ref(false)
const creditRequeryVisible = ref(false)
const evaluationResultVisible = ref(false)
const fraudDetectionVisible = ref(false)
const showOperationDrawer = ref(false)
const rescanVisible = ref(false)
const returnSupplementVisible = ref(false)
const errorRecordVisible = ref(false)

const rescanForm = reactive({
  rescanType: '',
  rescanRemark: ''
})

const returnSupplementForm = reactive({
  supplementType: '',
  scanTypes: [],
  organization: '',
  deadline: '',
  reason: ''
})

const errorRecordForm = reactive({
  errorRemark: ''
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

const decisionResultData = reactive({
  applicationId: '',
  productName: '',
  internalScore: '',
  exchangeRate: '',
  isDowngraded: false,
  randomData: '',
  videoRiskFlag: '',
  customerGroupFlag: '',
  mainCardCreditCode: '',
  mainCardCreditDesc: '',
  mainCardReasonCode: '',
  mainCardReasonDesc: '',
  mainCardRMBLimit: '',
  totalCreditLimit: '',
  mainCardCashLimit: '',
  monthlyIncome: '',
  mainCardLimitReasonCode: '',
  mainCardLimitReasonDesc: '',
  deductedIncome: '',
  deductedIncomeType: '',
  deductedRemaining: '',
  incomeDebtType: '',
  incomeDebtValue: '',
  incomeDebtRemaining: '',
  debtValue: '',
  otherBankLimit: '',
  version: '',
  decisionFlag: '',
  isNewCredit: false,
  scoreResult: '',
  networkScoreType: '',
  issueNewOldFlag: '',
  approvalNewOldFlag: '',
  maxActiveCardLimit: '',
  decisionProcessId: ''
})

const creditRequeryForm = reactive({
  selectedCredits: []
})

const creditRequeryHistory = ref([
  { name: '人民银行征信', operator: '张三', time: '2024-01-15 10:30:00', count: 2 },
  { name: '百行征信', operator: '李四', time: '2024-01-14 14:20:00', count: 1 }
])

const evaluationResultData = reactive({
  customerId: '',
  customerName: '',
  maxApprovalLimit: '',
  limitOccupancy: '',
  customerCreditLimit: '',
  existingOccupancy: '',
  approvalResult: '',
  sourceSystem: '',
  adjustedCapLimit: '',
  repaymentAbility: '',
  updateTime: ''
})

const fraudDetectionData = reactive({
  applicationId: '',
  riskLevel: '',
  fraudScore: '',
  deviceAbnormal: false,
  ipAbnormal: false,
  behaviorAbnormal: false,
  relatedFraud: false,
  riskDescription: '',
  detectionTime: ''
})

const maskDocumentNumber = (number) => {
  if (!number) return ''
  if (number.length === 18) {
    return number.substring(0, 4) + '**********' + number.substring(14)
  }
  if (number.length > 8) {
    return number.substring(0, 4) + '****' + number.substring(number.length - 4)
  }
  return number
}

const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || ''
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

const getStatusTagType = (status) => {
  const types = {
    'INFORMATION_COMPLETE': 'primary',
    'CHECKING': 'warning',
    'CHECK_PASSED': 'success',
    'CHECK_FAILED': 'danger',
    'APPROVAL_PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': '待处理',
    'INFORMATION_COMPLETE': '信息完整',
    'CHECKING': '核审中',
    'CHECK_PASSED': '审核通过',
    'CHECK_FAILED': '审核不通过',
    'APPROVAL_PENDING': '待审批',
    'APPROVED': '已批准',
    'REJECTED': '已拒绝'
  }
  return texts[status] || status
}

const getTypeTagType = (type) => {
  const types = { '主': 'primary', '附': 'success', '主附': 'warning' }
  return types[type] || 'info'
}

const getCardTypeText = (type) => {
  const texts = { 'PLATINUM': '白金卡', 'GOLD': '金卡', 'NORMAL': '普卡' }
  return texts[type] || type
}

const getMaritalStatusText = (status) => {
  const texts = { '1': '未婚', '2': '已婚', '3': '离异', '4': '丧偶' }
  return texts[status] || status
}

const getDetectionClass = (result) => {
  if (result === true) return 'detection-success'
  if (result === false) return 'detection-fail'
  return 'detection-pending'
}

const getDetectionText = (type, result) => {
  const textMap = {
    coreCheck: { true: '通过', false: '不通过', null: '未检测' },
    decisionEngine: { true: '通过', false: '不通过', null: '未检测' },
    blacklist: { true: '未命中', false: '命中', null: '未检测' },
    duplicate: { true: '无重复', false: '重复', null: '未检测' },
    antiMoneyLaundering: { true: '正常', false: '风险', null: '未检测' },
    fraud: { true: '正常', false: '疑似', null: '未检测' }
  }
  return textMap[type][result]
}

const formatNumber = (num) => {
  if (!num) return '0'
  return Number(num).toLocaleString('zh-CN')
}

const decisionResultTableData = computed(() => {
  return [
    { label: '申请件编号', value: decisionResultData.applicationId },
    { label: '产品发布名称', value: decisionResultData.productName },
    { label: '行内评分', value: decisionResultData.internalScore },
    { label: '汇率', value: decisionResultData.exchangeRate },
    { label: '是否经过降级', value: decisionResultData.isDowngraded ? '是' : '否' },
    { label: '申请人随机数据', value: decisionResultData.randomData },
    { label: '视频面签风险标识', value: decisionResultData.videoRiskFlag },
    { label: '客群标识', value: decisionResultData.customerGroupFlag },
    { label: '主卡授信结果代码', value: decisionResultData.mainCardCreditCode },
    { label: '主卡授信结果描述', value: decisionResultData.mainCardCreditDesc },
    { label: '主卡授信原因代码', value: decisionResultData.mainCardReasonCode },
    { label: '主卡授信原因描述', value: decisionResultData.mainCardReasonDesc },
    { label: '主卡人民币额度', value: '¥' + formatNumber(decisionResultData.mainCardRMBLimit) },
    { label: '总授信额度上线', value: '¥' + formatNumber(decisionResultData.totalCreditLimit) },
    { label: '主卡人人民币取现额度', value: '¥' + formatNumber(decisionResultData.mainCardCashLimit) },
    { label: '有效卡最高额度', value: '¥' + formatNumber(decisionResultData.maxActiveCardLimit) },
    { label: '月收入', value: '¥' + formatNumber(decisionResultData.monthlyIncome) },
    { label: '负债值', value: '¥' + formatNumber(decisionResultData.debtValue) },
    { label: '他行卡额度', value: '¥' + formatNumber(decisionResultData.otherBankLimit) },
    { label: '刚扣收入类型', value: decisionResultData.deductedIncomeType },
    { label: '刚扣收入值', value: '¥' + formatNumber(decisionResultData.deductedIncome) },
    { label: '刚扣剩余额度', value: '¥' + formatNumber(decisionResultData.deductedRemaining) },
    { label: '收入负债类型', value: decisionResultData.incomeDebtType },
    { label: '收入负债值', value: '¥' + formatNumber(decisionResultData.incomeDebtValue) },
    { label: '收入负债剩余额度', value: '¥' + formatNumber(decisionResultData.incomeDebtRemaining) },
    { label: '主卡额度原因代码', value: decisionResultData.mainCardLimitReasonCode },
    { label: '主卡额度原因描述', value: decisionResultData.mainCardLimitReasonDesc },
    { label: '版本号', value: decisionResultData.version },
    { label: '决策标识', value: decisionResultData.decisionFlag },
    { label: '是否新增授信标识', value: decisionResultData.isNewCredit ? '是' : '否' },
    { label: '评分结果', value: decisionResultData.scoreResult },
    { label: '网络评分卡类型', value: decisionResultData.networkScoreType },
    { label: '发卡新老客户标识', value: decisionResultData.issueNewOldFlag },
    { label: '审批新老客户标识', value: decisionResultData.approvalNewOldFlag },
    { label: '决策过程记录ID', value: decisionResultData.decisionProcessId }
  ]
})

const getRiskLevelType = (level) => {
  const types = {
    '低风险': 'success',
    '中风险': 'warning',
    '高风险': 'danger'
  }
  return types[level] || 'info'
}

const loadApplicationData = async () => {
  const applicationId = route.query.id || 'APP202401010001'
  const res = await api.applications.detail(applicationId)
  if (res.code === 200) {
    const data = res.data
    applicationData.applicationId = data.applicationId
    applicationData.applicationType = '主附'
    applicationData.productCode = 'PRD001'
    applicationData.productName = '白金卡'
    applicationData.organizationCode = 'ORG001'
    applicationData.organizationName = '北京分行'
    applicationData.applicationChannel = '线上申请'
    applicationData.createdAt = data.createdAt
    applicationData.status = data.status
    applicationData.customerName = data.applicant.name
    applicationData.customerType = '新客户'
    applicationData.documentType = '身份证'
    applicationData.documentNumber = data.applicant.idCard
    applicationData.customerId = 'CUST202401010001'
    applicationData.workUnit = '北京科技有限公司'
    applicationData.creditLimit = '100000'
    applicationData.secondaryCards = [
      {
        applicationId: 'APP202401010002',
        customerName: '张三',
        documentNumber: '110101199001011234',
        productName: '白金卡附属卡'
      },
      {
        applicationId: 'APP202401010003',
        customerName: '李四',
        documentNumber: '110101199505055678',
        productName: '白金卡附属卡'
      },
      {
        applicationId: 'APP202401010004',
        customerName: '王五',
        documentNumber: '110101199808089012',
        productName: '白金卡附属卡'
      }
    ]
  }
}

const handleSingleDetect = async (type) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const failRate = type === 'blacklist' ? 0.3 : type === 'duplicate' ? 0.25 : type === 'fraud' ? 0.2 : type === 'antiMoneyLaundering' ? 0.15 : 0.1
  detectionResults[type] = Math.random() > failRate
  
  const typeNames = {
    coreCheck: '核心检查',
    decisionEngine: '决策引擎',
    blacklist: '黑/灰名单',
    duplicate: '重复申请',
    antiMoneyLaundering: '反洗钱',
    fraud: '欺诈'
  }
  
  const isSuccess = detectionResults[type]
  detectionMessages[type] = {
    text: `${typeNames[type]}检测${isSuccess ? '通过' : '不通过'}`,
    success: isSuccess
  }
}

const openDecisionResult = () => {
  decisionResultData.applicationId = applicationData.applicationId
  decisionResultData.productName = '白金卡'
  decisionResultData.internalScore = '780'
  decisionResultData.exchangeRate = '1.0000'
  decisionResultData.isDowngraded = false
  decisionResultData.randomData = 'RANDOM20240115001'
  decisionResultData.videoRiskFlag = 'N'
  decisionResultData.customerGroupFlag = '8200'
  decisionResultData.mainCardCreditCode = 'APPROVE'
  decisionResultData.mainCardCreditDesc = '批准'
  decisionResultData.mainCardReasonCode = 'RC001'
  decisionResultData.mainCardReasonDesc = '综合评分达标'
  decisionResultData.mainCardRMBLimit = '50000'
  decisionResultData.totalCreditLimit = '100000'
  decisionResultData.mainCardCashLimit = '25000'
  decisionResultData.monthlyIncome = '20000'
  decisionResultData.mainCardLimitReasonCode = 'LC001'
  decisionResultData.mainCardLimitReasonDesc = '根据收入核定'
  decisionResultData.deductedIncome = '5000'
  decisionResultData.deductedIncomeType = '公积金'
  decisionResultData.deductedRemaining = '15000'
  decisionResultData.incomeDebtType = '房贷'
  decisionResultData.incomeDebtValue = '3000'
  decisionResultData.incomeDebtRemaining = '12000'
  decisionResultData.debtValue = '50000'
  decisionResultData.otherBankLimit = '30000'
  decisionResultData.version = 'V2.0'
  decisionResultData.decisionFlag = 'D001'
  decisionResultData.isNewCredit = true
  decisionResultData.scoreResult = '优秀'
  decisionResultData.networkScoreType = 'A类'
  decisionResultData.issueNewOldFlag = '新客户'
  decisionResultData.approvalNewOldFlag = '新客户'
  decisionResultData.maxActiveCardLimit = '80000'
  decisionResultData.decisionProcessId = 'PROC202401150001'
  decisionResultVisible.value = true
}

const openCreditRequery = () => {
  creditRequeryVisible.value = true
}

const handleCreditRequery = () => {
  if (creditRequeryForm.selectedCredits.length === 0) {
    ElMessage.warning('请选择至少一个征信名称')
    return
  }
  ElMessage.success(`已成功发起 ${creditRequeryForm.selectedCredits.join('、')} 征信重征`)
  creditRequeryVisible.value = false
}

const handleInitiateEvaluation = () => {
  ElMessage.success('评价发起成功，正在处理中...')
}

const openEvaluationResult = () => {
  evaluationResultData.customerId = 'CUST202401010001'
  evaluationResultData.customerName = applicationData.customerName
  evaluationResultData.maxApprovalLimit = '100000'
  evaluationResultData.limitOccupancy = '30000'
  evaluationResultData.customerCreditLimit = '200000'
  evaluationResultData.existingOccupancy = '50000'
  evaluationResultData.approvalResult = '通过'
  evaluationResultData.sourceSystem = '评价系统'
  evaluationResultData.adjustedCapLimit = '150000'
  evaluationResultData.repaymentAbility = '240000'
  evaluationResultData.updateTime = '2024-01-15 10:30:00'
  evaluationResultVisible.value = true
}

const openFraudDetection = () => {
  fraudDetectionData.applicationId = applicationData.applicationId
  fraudDetectionData.riskLevel = '低风险'
  fraudDetectionData.fraudScore = '95'
  fraudDetectionData.deviceAbnormal = false
  fraudDetectionData.ipAbnormal = false
  fraudDetectionData.behaviorAbnormal = false
  fraudDetectionData.relatedFraud = false
  fraudDetectionData.riskDescription = '未发现异常行为，欺诈风险较低'
  fraudDetectionData.detectionTime = '2024-01-15 10:30:00'
  fraudDetectionVisible.value = true
}

const handleSubmit = () => {
  if (!checkRecordForm.checkResult) {
    ElMessage.warning('请选择核准核查结果')
    return
  }
  ElMessage.success('提交成功')
}

const handleSave = () => {
  ElMessage.success('保存成功')
}

const handleReject = () => {
  if (!checkRecordForm.remark) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  ElMessage.success('拒绝成功')
}

const handleRescan = () => {
  rescanForm.rescanType = ''
  rescanForm.rescanRemark = ''
  rescanVisible.value = true
}

const handleInitiateRescan = () => {
  if (!rescanForm.rescanType) {
    ElMessage.warning('请选择重扫类型')
    return
  }
  ElMessage.success('重扫任务发起成功')
  rescanVisible.value = false
}

const handleReturnSupplement = () => {
  const typeMap = {
    '主': 'MAIN',
    '主附': 'MAIN_SECONDARY',
    '附': 'SECONDARY'
  }
  returnSupplementForm.supplementType = typeMap[applicationData.applicationType] || ''
  returnSupplementForm.scanTypes = []
  returnSupplementForm.organization = ''
  returnSupplementForm.deadline = ''
  returnSupplementForm.reason = ''
  returnSupplementVisible.value = true
}

const handleConfirmReturnSupplement = () => {
  if (!returnSupplementForm.supplementType) {
    ElMessage.warning('请选择退补主体')
    return
  }
  if (returnSupplementForm.scanTypes.length === 0) {
    ElMessage.warning('请至少选择一种补扫类型')
    return
  }
  if (!returnSupplementForm.organization) {
    ElMessage.warning('请选择补件机构')
    return
  }
  if (!returnSupplementForm.deadline) {
    ElMessage.warning('请选择补件截止日期')
    return
  }
  ElMessage.success('退补任务操作完成，已发送扫描权限柜员')
  returnSupplementVisible.value = false
}

const handleError = () => {
  errorRecordForm.errorRemark = ''
  errorRecordVisible.value = true
}

const handleConfirmErrorRecord = () => {
  if (!errorRecordForm.errorRemark.trim()) {
    ElMessage.warning('请输入差错备注')
    return
  }
  ElMessage.success('差错备注成功')
  errorRecordVisible.value = false
}

const handleModifyApplication = () => {
  router.push({ 
    path: '/entry/modify', 
    query: { 
      id: applicationData.applicationId,
      applicationType: applicationData.applicationType,
      applicationRequestType: applicationData.applicationRequestType,
      channelFlag: applicationData.channelFlag,
      newOldCustomerFlag: applicationData.newOldCustomerFlag,
      productCode: applicationData.productCode,
      productName: applicationData.productName
    } 
  })
}

const handleViewImages = () => {
  window.open(`/scan/view-page?applicationNo=${applicationData.applicationId}`, '_blank')
}

onMounted(loadApplicationData)
</script>

<style scoped>
.check-audit { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.detection-card { margin-bottom: 20px; }
.detection-icon { font-size: 32px; text-align: center; margin-bottom: 10px; }
.detection-name { text-align: center; font-weight: bold; margin-bottom: 5px; }
.detection-result { text-align: center; font-size: 12px; color: #666; }
.detection-success { border-color: #67c23a; }
.detection-fail { border-color: #f56c6c; }
.detection-pending { border-color: #dcdfe6; }
.detection-messages {
  margin-top: 20px;
}
.detection-message {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 14px;
}
.detection-message.success { background-color: #f0f9eb; color: #67c23a; }
.detection-message.warning { background-color: #fef0f0; color: #f56c6c; }
.system-audit-card { margin-bottom: 20px; }
.action-buttons { display: flex; gap: 20px; margin-bottom: 20px; }
.console-buttons { display: flex; gap: 20px; }
</style>

<style>
.custom-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 15px 20px;
}

.dialog-content {
  padding: 5px 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 14px;
  background-color: #409EFF;
  margin-right: 8px;
  border-radius: 2px;
}

.risk-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
  gap: 20px;
}

.risk-label, .score-label {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
}

.risk-description {
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.result-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 10px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.summary-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.summary-value.score {
  color: #ffd700;
}

.summary-value.amount {
  color: #90ee90;
}

.result-section {
  margin-bottom: 5px;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.item-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.item-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.item-value.amount {
  color: #409EFF;
  font-weight: bold;
}

.operation-records { padding: 10px; }
.record-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
.record-item:last-child { border-bottom: none; }
.record-time { font-size: 12px; color: #999; margin-bottom: 4px; }
.record-content { font-size: 14px; color: #333; }
.record-operator { font-weight: bold; color: #409EFF; }
</style>