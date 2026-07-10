<template>
  <div class="product-publish-container">
    <el-card>
      <div class="card-header">
        <div>
          <h2>产品发布管理</h2>
        </div>
        <div class="header-actions">
          <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
            <el-tab-pane label="产品列表" name="products"></el-tab-pane>
            <el-tab-pane label="1+1配置列表" name="onePlusOne"></el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 产品列表 -->
      <template v-if="activeTab === 'products'">
        <SearchForm :fields="searchFields" :form-model="searchForm" @search="handleSearch" @reset="handleReset" />

        <el-table :data="paginatedProducts" style="width: 100%">
          <el-table-column prop="productNumCode" label="产品数字代码" width="150" />
          <el-table-column prop="publishName" label="产品发布名称" width="180" />
          <el-table-column prop="innerCardCode" label="内卡编码" width="130" />
          <el-table-column prop="mainSubFlag" label="主附卡标识" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.mainSubFlag === '主' ? 'primary' : 'success'" size="small">
                {{ scope.row.mainSubFlag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="mileageExchange" label="航空历程兑换" width="140">
            <template #default="scope">
              <el-tag :type="scope.row.mileageExchange === '支持' ? 'success' : 'info'" size="small">
                {{ scope.row.mileageExchange }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="airlineCompany" label="航空公司" width="150" />
          <el-table-column prop="productBrand" label="产品品牌" width="120">
            <template #default="scope">
              <el-tag size="small">{{ scope.row.productBrand }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cardLevel" label="卡片等级" width="120">
            <template #default="scope">
              <el-tag size="small">{{ scope.row.cardLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productStatus" label="产品状态" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.productStatus === '启用'" type="success" size="small">启用</el-tag>
              <el-tag v-else-if="scope.row.productStatus === '禁用'" type="danger" size="small">禁用</el-tag>
              <el-tag v-else type="warning" size="small">审核中</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="formNumber" label="表单编号" width="150" />
          <el-table-column prop="internalCardType" label="内部卡类型" width="130">
            <template #default="scope">
              <el-tag v-if="scope.row.internalCardType" size="small">{{ scope.row.internalCardType }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="scope">
              <el-button v-if="scope.row.productStatus === '审核中'" type="warning" size="small" @click="handleAudit(scope.row)">审核</el-button>
              <el-button v-else type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="handleShowLogs(scope.row)">变更记录</el-button>
              <el-button type="danger" size="small" @click="handleDeleteConfirm(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredProducts.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>

      <!-- 1+1配置列表 -->
      <template v-else>
        <div style="margin-bottom: 16px;">
          <el-button type="primary" @click="handleOpenOnePlusOneDialog">
            <el-icon><component :is="Plus" /></el-icon>
            新增配置
          </el-button>
        </div>

        <SearchForm :fields="onePlusOneSearchFields" :form-model="onePlusOneSearchForm" @search="handleOnePlusOneSearch" @reset="handleOnePlusOneReset" />

        <el-table :data="paginatedOnePlusOneConfigs" style="width: 100%">
          <el-table-column prop="newProductName" label="新产品" width="180" />
          <el-table-column prop="configProduct1Name" label="配置产品1" width="180" />
          <el-table-column prop="configProduct2Name" label="配置产品2" width="180">
            <template #default="scope">
              <span v-if="scope.row.configProduct2">{{ scope.row.configProduct2Name }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="configMode" label="配置模式" width="120">
            <template #default="scope">
              <el-tag :type="getConfigModeTagType(scope.row.configMode)" size="small">
                {{ scope.row.configMode }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="配置说明" />
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditOnePlusOne(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteOnePlusOne(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="onePlusOneCurrentPage"
            v-model:page-size="onePlusOnePageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredOnePlusOneConfigs.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleOnePlusOneSizeChange"
            @current-change="handleOnePlusOneCurrentChange"
          />
        </div>
      </template>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑产品发布" width="1000px">
      <el-form :model="formData" label-width="160px">
        <el-divider content-position="left">产品图片</el-divider>
        <el-form-item label="产品图片">
          <el-upload
            v-model:file-list="formData.productImages"
            action="#"
            list-type="picture-card"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemoveImage"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :limit="5"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            <el-text size="small" type="info">支持jpg、png格式，文件大小不超过2MB，最多上传5张图片</el-text>
          </div>
        </el-form-item>

        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品数字代码" required>
              <el-input v-model="formData.productNumCode" :disabled="!!formData.id" placeholder="请输入四位纯数字" maxlength="4" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品发布名称" required>
              <el-input v-model="formData.publishName" placeholder="请输入产品发布名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品内卡编码">
              <el-input v-model="formData.innerCardCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主附卡标识" required>
              <el-select v-model="formData.mainSubFlag" placeholder="请选择主附卡标识">
                <el-option label="主" value="主" />
                <el-option label="附" value="附" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="降级产品">
              <el-input v-model="formData.downgradeProduct" placeholder="请输入降级产品" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品品牌" required>
              <el-select v-model="formData.productBrand" placeholder="请选择产品品牌">
                <el-option label="银联" value="银联" />
                <el-option label="万事达" value="万事达" />
                <el-option label="VISA" value="VISA" />
                <el-option label="JCB" value="JCB" />
                <el-option label="美运" value="美运" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡片等级" required>
              <el-select v-model="formData.cardLevel" placeholder="请选择卡片等级">
                <el-option label="金卡" value="金卡" />
                <el-option label="普卡" value="普卡" />
                <el-option label="钛金卡" value="钛金卡" />
                <el-option label="白金卡" value="白金卡" />
                <el-option label="美运卡" value="美运卡" />
                <el-option label="无限卡" value="无限卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单编号" required>
              <el-input v-model="formData.formNumber" placeholder="请输入表单编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">航空历程</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航空历程兑换" required>
              <el-select v-model="formData.mileageExchange" placeholder="请选择航空历程兑换">
                <el-option label="支持" value="支持" />
                <el-option label="不支持" value="不支持" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航司支持">
              <el-checkbox-group v-model="formData.airlines" :disabled="formData.mileageExchange !== '支持'">
                <el-checkbox label="国航" />
                <el-checkbox label="深航" />
                <el-checkbox label="南航" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第二印花名/会员编号">
          <el-input v-model="formData.secondPrintName" placeholder="请输入第二印花名/会员编号" />
        </el-form-item>

        <el-divider content-position="left">产品属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品简介">
              <el-input v-model="formData.productDesc" type="textarea" :rows="2" placeholder="请输入产品简介" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否分行特色">
              <el-select v-model="formData.isBranchFeature" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标客户">
              <el-input v-model="formData.targetCustomer" placeholder="请输入目标客户" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否推荐">
              <el-select v-model="formData.isRecommended" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数字卡标识">
              <el-select v-model="formData.isDigitalCard" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生卡">
              <el-select v-model="formData.isStudentCard" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="配发实体卡">
              <el-select v-model="formData.issuePhysicalCard" :disabled="formData.isDigitalCard !== '是'" placeholder="请选择">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内部卡类型">
              <el-select v-model="formData.internalCardType" placeholder="请选择内部卡类型">
                <el-option label="普通卡" value="普通卡" />
                <el-option label="私行卡" value="私行卡" />
                <el-option label="财富卡" value="财富卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-row>

        <el-divider content-position="left">发布渠道</el-divider>
        <el-form-item label="发布渠道">
          <el-checkbox-group v-model="formData.publishChannels">
            <el-checkbox label="网申" />
            <el-checkbox label="微信" />
            <el-checkbox label="智能柜台" />
            <el-checkbox label="分期" />
            <el-checkbox label="分行线下" />
          </el-checkbox-group>
        </el-form-item>

        <el-divider content-position="left">产品状态</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品状态" required>
              <el-select v-model="formData.productStatus" placeholder="请选择产品状态">
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
                <el-option label="审核中" value="审核中" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">产品前检查</el-divider>
        <el-form-item label="产品前检查是否完成核心产品配置">
          <el-select v-model="formData.checkConfirm" placeholder="请选择">
            <el-option label="完成" value="完成" />
            <el-option label="未完成" value="未完成" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="auditVisible" title="审核产品发布" width="1000px">
      <el-form :model="auditData" label-width="160px">
        <el-divider content-position="left">产品图片</el-divider>
        <el-form-item label="产品图片">
          <el-upload
            v-model:file-list="auditData.productImages"
            action="#"
            list-type="picture-card"
            :on-preview="handlePicturePreview"
            :disabled="true"
          >
          </el-upload>
          <div class="upload-tip">
            <el-text size="small" type="info">支持jpg、png格式，文件大小不超过2MB，最多上传5张图片</el-text>
          </div>
        </el-form-item>

        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品数字代码">
              <el-input v-model="auditData.productNumCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品发布名称">
              <el-input v-model="auditData.publishName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品内卡编码">
              <el-input v-model="auditData.innerCardCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主附卡标识">
              <el-select v-model="auditData.mainSubFlag" disabled>
                <el-option label="主" value="主" />
                <el-option label="附" value="附" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="降级产品">
              <el-input v-model="auditData.downgradeProduct" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品品牌">
              <el-select v-model="auditData.productBrand" disabled>
                <el-option label="银联" value="银联" />
                <el-option label="万事达" value="万事达" />
                <el-option label="VISA" value="VISA" />
                <el-option label="JCB" value="JCB" />
                <el-option label="美运" value="美运" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡片等级">
              <el-select v-model="auditData.cardLevel" disabled>
                <el-option label="金卡" value="金卡" />
                <el-option label="普卡" value="普卡" />
                <el-option label="钛金卡" value="钛金卡" />
                <el-option label="白金卡" value="白金卡" />
                <el-option label="美运卡" value="美运卡" />
                <el-option label="无限卡" value="无限卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单编号">
              <el-input v-model="auditData.formNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">航空历程</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航空历程兑换">
              <el-select v-model="auditData.mileageExchange" disabled>
                <el-option label="支持" value="支持" />
                <el-option label="不支持" value="不支持" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航司支持">
              <el-checkbox-group v-model="auditData.airlines" :disabled="true">
                <el-checkbox label="国航" />
                <el-checkbox label="深航" />
                <el-checkbox label="南航" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第二印花名/会员编号">
          <el-input v-model="auditData.secondPrintName" disabled />
        </el-form-item>

        <el-divider content-position="left">产品属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品简介">
              <el-input v-model="auditData.productDesc" type="textarea" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否分行特色">
              <el-select v-model="auditData.isBranchFeature" disabled>
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标客户">
              <el-input v-model="auditData.targetCustomer" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否推荐">
              <el-select v-model="auditData.isRecommended" disabled>
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数字卡标识">
              <el-select v-model="auditData.isDigitalCard" disabled>
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生卡">
              <el-select v-model="auditData.isStudentCard" disabled>
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="配发实体卡">
              <el-select v-model="auditData.issuePhysicalCard" disabled>
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内部卡类型">
              <el-select v-model="auditData.internalCardType" disabled>
                <el-option label="普通卡" value="普通卡" />
                <el-option label="私行卡" value="私行卡" />
                <el-option label="财富卡" value="财富卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-row>

        <el-divider content-position="left">发布渠道</el-divider>
        <el-form-item label="发布渠道">
          <el-checkbox-group v-model="auditData.publishChannels" :disabled="true">
            <el-checkbox label="网申" />
            <el-checkbox label="微信" />
            <el-checkbox label="智能柜台" />
            <el-checkbox label="分期" />
            <el-checkbox label="分行线下" />
          </el-checkbox-group>
        </el-form-item>

        <el-divider content-position="left">产品状态</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-select v-model="auditData.productStatus" disabled>
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
                <el-option label="审核中" value="审核中" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">产品前检查</el-divider>
        <el-form-item label="产品前检查是否完成核心产品配置">
          <el-select v-model="auditData.checkConfirm" disabled>
            <el-option label="完成" value="完成" />
            <el-option label="未完成" value="未完成" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="danger" @click="handleAuditReject">拒绝</el-button>
        <el-button type="primary" @click="handleAuditPass">通过</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteConfirmVisible" title="确认删除" width="400px">
      <div class="delete-confirm-content">
        <p>确认是否删除产品发布：<strong>{{ deleteRow.publishName }}</strong>？</p>
      </div>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确认删除</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="logVisible" :title="`${currentLogProduct} - 变更记录`" width="800px">
      <el-table :data="currentLogs" style="width: 100%">
        <el-table-column prop="operator" label="操作人" width="150" />
        <el-table-column prop="operationTime" label="操作时间" width="200">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.operationTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="120">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)" size="small">
              {{ getOperationTypeName(scope.row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" />
      </el-table>
      <template #footer>
        <el-button @click="logVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="onePlusOneVisible" :title="onePlusOneData.id ? '编辑1+1产品配置' : '新增1+1产品配置'" width="700px">
      <el-form :model="onePlusOneData" label-width="140px">
        <el-form-item label="配置模式" required>
          <el-select v-model="onePlusOneData.configMode" placeholder="请选择配置模式" @change="handleConfigModeChange">
            <el-option label="A=A+B" value="A=A+B" />
            <el-option label="A=B+C" value="A=B+C" />
            <el-option label="A=C" value="A=C" />
          </el-select>
          <div class="mode-desc">
            <el-text size="small" type="info">
              <span v-if="onePlusOneData.configMode === 'A=A+B'">新产品A配置为：A（新产品）+ B（配置产品1）组合</span>
              <span v-else-if="onePlusOneData.configMode === 'A=B+C'">新产品A配置为：B（配置产品1）+ C（配置产品2）组合</span>
              <span v-else-if="onePlusOneData.configMode === 'A=C'">新产品A配置为：C（配置产品1）</span>
            </el-text>
          </div>
        </el-form-item>

        <el-form-item label="新产品" required>
          <el-select v-model="onePlusOneData.newProduct" placeholder="请选择新产品">
            <el-option v-for="product in enabledProducts" :key="product.id" :label="`${product.publishName} (${product.productNumCode})`" :value="product.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置产品1" required>
          <el-select v-model="onePlusOneData.configProduct1" placeholder="请选择配置产品1">
            <el-option v-for="product in getAvailableProducts(onePlusOneData.newProduct)" :key="product.id" :label="`${product.publishName} (${product.productNumCode})`" :value="product.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="onePlusOneData.configMode === 'A=B+C'" label="配置产品2" required>
          <el-select v-model="onePlusOneData.configProduct2" placeholder="请选择配置产品2">
            <el-option v-for="product in getAvailableProducts(onePlusOneData.newProduct, onePlusOneData.configProduct1)" :key="product.id" :label="`${product.publishName} (${product.productNumCode})`" :value="product.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置说明">
          <el-input v-model="onePlusOneData.description" type="textarea" :rows="3" placeholder="请输入配置说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onePlusOneVisible = false">取消</el-button>
        <el-button type="primary" @click="handleOnePlusOneSubmit">保存配置</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="图片预览" width="800px">
      <img :src="previewImageUrl" style="width: 100%; height: auto;" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm.vue'

const searchFields = [
  { prop: 'productNumCode', label: '产品数字代码', type: 'input', placeholder: '请输入产品数字代码' },
  { prop: 'publishName', label: '产品发布名称', type: 'input', placeholder: '请输入产品发布名称' },
  { prop: 'innerCardCode', label: '内卡编码', type: 'input', placeholder: '请输入内卡编码' },
  { prop: 'mainSubFlag', label: '主附卡标识', type: 'select', options: [
    { label: '主', value: '主' },
    { label: '附', value: '附' }
  ]},
  { prop: 'currency', label: '币种', type: 'select', options: [
    { label: '人民币', value: 'CNY' },
    { label: '美元', value: 'USD' },
    { label: '欧元', value: 'EUR' },
    { label: '双币种', value: 'dual' }
  ]}
]

const searchForm = reactive({})
searchFields.forEach(field => {
  searchForm[field.prop] = ''
})

const products = ref([
  { id: 1, publishCode: 'PUB001', publishName: '标准信用卡普卡发布', innerCardCode: 'IC001', mainSubFlag: '主', mileageExchange: '不支持', airlines: [], airlineCompany: '-', productBrand: '银联', cardLevel: '普卡', productStatus: '启用', formNumber: 'FORM-STD-P001', internalCardType: '', currency: 'CNY', productNumCode: '0001', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '否', targetCustomer: '', isRecommended: '否', isDigitalCard: '否', isStudentCard: '否', issuePhysicalCard: '否', checkConfirm: '未完成', publishChannels: [], productImages: [], onePlusOneConfig: null },
  { id: 2, publishCode: 'PUB002', publishName: '标准信用卡金卡发布', innerCardCode: 'IC002', mainSubFlag: '主', mileageExchange: '支持', airlines: ['国航'], airlineCompany: '国航', productBrand: '银联', cardLevel: '金卡', productStatus: '启用', formNumber: 'FORM-STD-G001', internalCardType: '', currency: 'CNY', productNumCode: '0002', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '否', targetCustomer: '', isRecommended: '是', isDigitalCard: '否', isStudentCard: '否', issuePhysicalCard: '否', checkConfirm: '完成', publishChannels: ['网申', '微信'], productImages: [], onePlusOneConfig: { configMode: 'A=A+B', productB: 4, productC: null, description: '金卡配置附加普卡' } },
  { id: 3, publishCode: 'PUB003', publishName: '白金卡尊享版发布', innerCardCode: 'IC003', mainSubFlag: '主', mileageExchange: '支持', airlines: ['东航'], airlineCompany: '东航', productBrand: 'VISA', cardLevel: '白金卡', productStatus: '审核中', formNumber: 'FORM-PRE-PL001', internalCardType: '私行卡', currency: 'dual', productNumCode: '0003', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '是', targetCustomer: '', isRecommended: '是', isDigitalCard: '是', isStudentCard: '否', issuePhysicalCard: '是', checkConfirm: '未完成', publishChannels: ['网申', '智能柜台'], productImages: [], onePlusOneConfig: null },
  { id: 4, publishCode: 'PUB004', publishName: '标准信用卡附卡发布', innerCardCode: 'IC004', mainSubFlag: '附', mileageExchange: '不支持', airlines: [], airlineCompany: '-', productBrand: '银联', cardLevel: '普卡', productStatus: '禁用', formNumber: 'FORM-STD-S001', internalCardType: '', currency: 'CNY', productNumCode: '0004', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '否', targetCustomer: '', isRecommended: '否', isDigitalCard: '否', isStudentCard: '否', issuePhysicalCard: '否', checkConfirm: '完成', publishChannels: [], productImages: [], onePlusOneConfig: null },
  { id: 5, publishCode: 'PUB005', publishName: '高端钛合金卡发布', innerCardCode: 'IC005', mainSubFlag: '主', mileageExchange: '支持', airlines: ['南航'], airlineCompany: '南航', productBrand: '万事达', cardLevel: '钛金卡', productStatus: '启用', formNumber: 'FORM-VIP-TI001', internalCardType: '财富卡', currency: 'USD', productNumCode: '0005', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '否', targetCustomer: '', isRecommended: '是', isDigitalCard: '否', isStudentCard: '否', issuePhysicalCard: '否', checkConfirm: '完成', publishChannels: ['分行线下'], productImages: [], onePlusOneConfig: { configMode: 'A=B+C', productB: 2, productC: 4, description: '钛金卡由金卡和附卡组合' } },
  { id: 6, publishCode: 'PUB006', publishName: '无限卡至尊版发布', innerCardCode: 'IC006', mainSubFlag: '主', mileageExchange: '支持', airlines: ['海航'], airlineCompany: '海航', productBrand: '美运', cardLevel: '无限卡', productStatus: '审核中', formNumber: 'FORM-VIP-IN001', internalCardType: '私行卡', currency: 'EUR', productNumCode: '0006', downgradeProduct: '', secondPrintName: '', productDesc: '', isBranchFeature: '是', targetCustomer: '', isRecommended: '是', isDigitalCard: '是', isStudentCard: '否', issuePhysicalCard: '否', checkConfirm: '未完成', publishChannels: ['分期'], productImages: [], onePlusOneConfig: null }
])

const productLogs = ref({
  1: [
    { id: 1, productId: 1, operator: '张三', operationTime: '2026-06-20 10:30:00', operationType: 'create', content: '创建产品发布：标准信用卡普卡发布' },
    { id: 2, productId: 1, operator: '李四', operationTime: '2026-06-21 14:20:00', operationType: 'audit_pass', content: '审核通过：产品状态变更为启用' },
    { id: 3, productId: 1, operator: '张三', operationTime: '2026-06-25 09:15:00', operationType: 'update', content: '修改产品信息：发布渠道增加微信渠道' }
  ],
  2: [
    { id: 1, productId: 2, operator: '王五', operationTime: '2026-06-18 16:45:00', operationType: 'create', content: '创建产品发布：标准信用卡金卡发布' },
    { id: 2, productId: 2, operator: '赵六', operationTime: '2026-06-19 11:00:00', operationType: 'audit_pass', content: '审核通过：产品状态变更为启用' },
    { id: 3, productId: 2, operator: '王五', operationTime: '2026-06-22 15:30:00', operationType: 'update', content: '修改产品信息：航空历程兑换变更为支持，航司支持增加国航' }
  ],
  3: [
    { id: 1, productId: 3, operator: '钱七', operationTime: '2026-06-24 08:00:00', operationType: 'create', content: '创建产品发布：白金卡尊享版发布' },
    { id: 2, productId: 3, operator: '钱七', operationTime: '2026-06-24 08:10:00', operationType: 'update', content: '修改产品信息：数字卡标识变更为是，配发实体卡变更为是' },
    { id: 3, productId: 3, operator: '钱七', operationTime: '2026-06-24 10:00:00', operationType: 'submit', content: '提交审核：产品状态变更为审核中' }
  ],
  4: [
    { id: 1, productId: 4, operator: '孙八', operationTime: '2026-06-15 09:30:00', operationType: 'create', content: '创建产品发布：标准信用卡附卡发布' },
    { id: 2, productId: 4, operator: '周九', operationTime: '2026-06-16 14:00:00', operationType: 'audit_reject', content: '审核拒绝：产品状态变更为禁用，原因：附卡需关联主卡' },
    { id: 3, productId: 4, operator: '孙八', operationTime: '2026-06-17 10:30:00', operationType: 'update', content: '修改产品信息：关联主卡编码IC001' }
  ],
  5: [
    { id: 1, productId: 5, operator: '吴十', operationTime: '2026-06-20 11:00:00', operationType: 'create', content: '创建产品发布：高端钛合金卡发布' },
    { id: 2, productId: 5, operator: '郑十一', operationTime: '2026-06-21 09:00:00', operationType: 'audit_pass', content: '审核通过：产品状态变更为启用' }
  ],
  6: [
    { id: 1, productId: 6, operator: '王十二', operationTime: '2026-06-25 14:00:00', operationType: 'create', content: '创建产品发布：无限卡至尊版发布' },
    { id: 2, productId: 6, operator: '王十二', operationTime: '2026-06-25 15:00:00', operationType: 'submit', content: '提交审核：产品状态变更为审核中' }
  ]
})

const dialogVisible = ref(false)
const auditVisible = ref(false)
const deleteConfirmVisible = ref(false)
const previewVisible = ref(false)
const previewImageUrl = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const logVisible = ref(false)
const currentLogProduct = ref('')
const currentLogs = ref([])
const deleteRow = reactive({})
const onePlusOneVisible = ref(false)
const activeTab = ref('products')

const onePlusOneData = reactive({
  id: null,
  configMode: '',
  newProduct: null,
  configProduct1: null,
  configProduct2: null,
  description: ''
})

const onePlusOneConfigs = ref([
  { id: 1, newProduct: 2, configProduct1: 4, configProduct2: null, configMode: 'A=A+B', description: '金卡配置附加普卡', createdAt: '2026-06-22 15:30:00' },
  { id: 2, newProduct: 5, configProduct1: 2, configProduct2: 4, configMode: 'A=B+C', description: '钛金卡由金卡和附卡组合', createdAt: '2026-06-23 10:00:00' },
  { id: 3, newProduct: 1, configProduct1: 2, configProduct2: null, configMode: 'A=C', description: '普卡直接升级为金卡', createdAt: '2026-06-24 09:00:00' }
])

const onePlusOneSearchFields = [
  { prop: 'newProduct', label: '新产品', type: 'select', options: [] },
  { prop: 'configMode', label: '配置模式', type: 'select', options: [
    { label: 'A=A+B', value: 'A=A+B' },
    { label: 'A=B+C', value: 'A=B+C' },
    { label: 'A=C', value: 'A=C' }
  ]}
]

const onePlusOneSearchForm = reactive({
  newProduct: '',
  configMode: ''
})

const onePlusOneCurrentPage = ref(1)
const onePlusOnePageSize = ref(10)

const formData = reactive({
  id: null,
  publishCode: '',
  publishName: '',
  innerCardCode: '',
  mainSubFlag: '主',
  mileageExchange: '不支持',
  airlines: [],
  airlineCompany: '',
  productBrand: '银联',
  cardLevel: '普卡',
  productStatus: '启用',
  formNumber: '',
  internalCardType: '',
  productNumCode: '',
  downgradeProduct: '',
  secondPrintName: '',
  productDesc: '',
  isBranchFeature: '否',
  targetCustomer: '',
  isRecommended: '否',
  isDigitalCard: '否',
  isStudentCard: '否',
  issuePhysicalCard: '否',
  checkConfirm: '未完成',
  publishChannels: [],
  productImages: []
})

const auditData = reactive({
  id: null,
  publishCode: '',
  publishName: '',
  innerCardCode: '',
  mainSubFlag: '主',
  mileageExchange: '不支持',
  airlines: [],
  airlineCompany: '',
  productBrand: '银联',
  cardLevel: '普卡',
  productStatus: '启用',
  formNumber: '',
  internalCardType: '',
  productNumCode: '',
  downgradeProduct: '',
  secondPrintName: '',
  productDesc: '',
  isBranchFeature: '否',
  targetCustomer: '',
  isRecommended: '否',
  isDigitalCard: '否',
  isStudentCard: '否',
  issuePhysicalCard: '否',
  checkConfirm: '未完成',
  publishChannels: [],
  productImages: []
})

const filteredProducts = computed(() => {
  return products.value.filter(item => {
    if (searchForm.productNumCode && !item.productNumCode.toLowerCase().includes(searchForm.productNumCode.toLowerCase())) {
      return false
    }
    if (searchForm.publishName && !item.publishName.toLowerCase().includes(searchForm.publishName.toLowerCase())) {
      return false
    }
    if (searchForm.innerCardCode && !item.innerCardCode.toLowerCase().includes(searchForm.innerCardCode.toLowerCase())) {
      return false
    }
    if (searchForm.mainSubFlag && item.mainSubFlag !== searchForm.mainSubFlag) {
      return false
    }
    if (searchForm.currency && item.currency !== searchForm.currency) {
      return false
    }
    return true
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

const handleReset = () => {
  currentPage.value = 1
}

const handleShowLogs = (row) => {
  currentLogProduct.value = row.publishName
  currentLogs.value = productLogs.value[row.id] || []
  logVisible.value = true
}

const formatDateTime = (dateTime) => {
  return dateTime
}

const getOperationTypeTag = (type) => {
  const tags = {
    create: 'success',
    update: 'primary',
    submit: 'warning',
    audit_pass: 'success',
    audit_reject: 'danger'
  }
  return tags[type] || 'info'
}

const getOperationTypeName = (type) => {
  const names = {
    create: '创建',
    update: '修改',
    submit: '提交审核',
    audit_pass: '审核通过',
    audit_reject: '审核拒绝'
  }
  return names[type] || '未知'
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleEdit = (row) => {
  formData.id = row.id
  formData.publishCode = row.publishCode
  formData.publishName = row.publishName
  formData.innerCardCode = row.innerCardCode
  formData.mainSubFlag = row.mainSubFlag
  formData.mileageExchange = row.mileageExchange
  formData.airlines = row.airlines || []
  formData.airlineCompany = row.airlineCompany
  formData.productBrand = row.productBrand
  formData.cardLevel = row.cardLevel
  formData.productStatus = row.productStatus
  formData.formNumber = row.formNumber
  formData.internalCardType = row.internalCardType
  formData.productNumCode = row.productNumCode || ''
  formData.downgradeProduct = row.downgradeProduct || ''
  formData.secondPrintName = row.secondPrintName || ''
  formData.productDesc = row.productDesc || ''
  formData.isBranchFeature = row.isBranchFeature || '否'
  formData.targetCustomer = row.targetCustomer || ''
  formData.isRecommended = row.isRecommended || '否'
  formData.isDigitalCard = row.isDigitalCard || '否'
  formData.isStudentCard = row.isStudentCard || '否'
  formData.issuePhysicalCard = row.issuePhysicalCard || '否'
  formData.checkConfirm = row.checkConfirm || '未完成'
  formData.publishChannels = row.publishChannels || []
  formData.productImages = row.productImages || []
  dialogVisible.value = true
}

const handleDeleteConfirm = (row) => {
  Object.assign(deleteRow, row)
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  products.value = products.value.filter(c => c.id !== deleteRow.id)
  deleteConfirmVisible.value = false
  ElMessage.success('删除成功')
}

const handleAudit = (row) => {
  auditData.id = row.id
  auditData.publishCode = row.publishCode
  auditData.publishName = row.publishName
  auditData.innerCardCode = row.innerCardCode
  auditData.mainSubFlag = row.mainSubFlag
  auditData.mileageExchange = row.mileageExchange
  auditData.airlines = row.airlines || []
  auditData.airlineCompany = row.airlineCompany
  auditData.productBrand = row.productBrand
  auditData.cardLevel = row.cardLevel
  auditData.productStatus = row.productStatus
  auditData.formNumber = row.formNumber
  auditData.internalCardType = row.internalCardType
  auditData.productNumCode = row.productNumCode || ''
  auditData.downgradeProduct = row.downgradeProduct || ''
  auditData.secondPrintName = row.secondPrintName || ''
  auditData.productDesc = row.productDesc || ''
  auditData.isBranchFeature = row.isBranchFeature || '否'
  auditData.targetCustomer = row.targetCustomer || ''
  auditData.isRecommended = row.isRecommended || '否'
  auditData.isDigitalCard = row.isDigitalCard || '否'
  auditData.isStudentCard = row.isStudentCard || '否'
  auditData.issuePhysicalCard = row.issuePhysicalCard || '否'
  auditData.checkConfirm = row.checkConfirm || '未完成'
  auditData.publishChannels = row.publishChannels || []
  auditData.productImages = row.productImages || []
  auditVisible.value = true
}

const handleAuditPass = () => {
  const index = products.value.findIndex(c => c.id === auditData.id)
  if (index !== -1) {
    products.value[index].productStatus = '启用'
    ElMessage.success('审核通过')
  }
  auditVisible.value = false
}

const enabledProducts = computed(() => {
  return products.value.filter(p => p.productStatus === '启用')
})

const getAvailableProducts = (excludeProductId1, excludeProductId2) => {
  return products.value.filter(p => {
    if (p.productStatus !== '启用') return false
    if (excludeProductId1 && p.id === excludeProductId1) return false
    if (excludeProductId2 && p.id === excludeProductId2) return false
    return true
  })
}

const getProductName = (productId) => {
  const product = products.value.find(p => p.id === productId)
  return product ? `${product.publishName} (${product.productNumCode})` : '未知产品'
}

const getConfigModeTagType = (mode) => {
  const types = {
    'A=A+B': 'primary',
    'A=B+C': 'success',
    'A=C': 'warning'
  }
  return types[mode] || 'info'
}

const filteredOnePlusOneConfigs = computed(() => {
  return onePlusOneConfigs.value.map(config => ({
    ...config,
    newProductName: getProductName(config.newProduct),
    configProduct1Name: getProductName(config.configProduct1),
    configProduct2Name: config.configProduct2 ? getProductName(config.configProduct2) : '-'
  })).filter(config => {
    if (onePlusOneSearchForm.newProduct && config.newProduct !== Number(onePlusOneSearchForm.newProduct)) {
      return false
    }
    if (onePlusOneSearchForm.configMode && config.configMode !== onePlusOneSearchForm.configMode) {
      return false
    }
    return true
  })
})

const paginatedOnePlusOneConfigs = computed(() => {
  const start = (onePlusOneCurrentPage.value - 1) * onePlusOnePageSize.value
  const end = start + onePlusOnePageSize.value
  return filteredOnePlusOneConfigs.value.slice(start, end)
})

const handleTabChange = (tab) => {
  if (tab === 'onePlusOne') {
    onePlusOneSearchFields[0].options = enabledProducts.value.map(p => ({
      label: `${p.publishName} (${p.productNumCode})`,
      value: p.id
    }))
  }
}

const handleOpenOnePlusOneDialog = () => {
  onePlusOneData.id = null
  onePlusOneData.configMode = ''
  onePlusOneData.newProduct = null
  onePlusOneData.configProduct1 = null
  onePlusOneData.configProduct2 = null
  onePlusOneData.description = ''
  onePlusOneVisible.value = true
}

const handleEditOnePlusOne = (row) => {
  const config = onePlusOneConfigs.value.find(c => c.id === row.id)
  if (config) {
    onePlusOneData.id = config.id
    onePlusOneData.configMode = config.configMode
    onePlusOneData.newProduct = config.newProduct
    onePlusOneData.configProduct1 = config.configProduct1
    onePlusOneData.configProduct2 = config.configProduct2
    onePlusOneData.description = config.description
    onePlusOneVisible.value = true
  }
}

const handleDeleteOnePlusOne = (row) => {
  if (confirm(`确认删除配置：${row.newProductName}？`)) {
    onePlusOneConfigs.value = onePlusOneConfigs.value.filter(c => c.id !== row.id)
    ElMessage.success('删除成功')
  }
}

const handleConfigModeChange = () => {
  onePlusOneData.configProduct1 = null
  onePlusOneData.configProduct2 = null
}

const handleOnePlusOneSubmit = () => {
  if (!onePlusOneData.configMode) {
    ElMessage.warning('请选择配置模式')
    return
  }
  if (!onePlusOneData.newProduct) {
    ElMessage.warning('请选择新产品')
    return
  }
  if (!onePlusOneData.configProduct1) {
    ElMessage.warning('请选择配置产品1')
    return
  }
  if (onePlusOneData.configMode === 'A=B+C' && !onePlusOneData.configProduct2) {
    ElMessage.warning('请选择配置产品2')
    return
  }

  if (onePlusOneData.id) {
    const index = onePlusOneConfigs.value.findIndex(c => c.id === onePlusOneData.id)
    if (index !== -1) {
      onePlusOneConfigs.value[index] = {
        ...onePlusOneConfigs.value[index],
        configMode: onePlusOneData.configMode,
        newProduct: onePlusOneData.newProduct,
        configProduct1: onePlusOneData.configProduct1,
        configProduct2: onePlusOneData.configProduct2,
        description: onePlusOneData.description
      }
      ElMessage.success('1+1配置更新成功')
    }
  } else {
    const newConfig = {
      id: Date.now(),
      configMode: onePlusOneData.configMode,
      newProduct: onePlusOneData.newProduct,
      configProduct1: onePlusOneData.configProduct1,
      configProduct2: onePlusOneData.configProduct2,
      description: onePlusOneData.description,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    onePlusOneConfigs.value.unshift(newConfig)
    ElMessage.success('1+1配置保存成功')
  }
  onePlusOneVisible.value = false
}

const handleOnePlusOneSearch = () => {
  onePlusOneCurrentPage.value = 1
}

const handleOnePlusOneReset = () => {
  onePlusOneSearchForm.newProduct = ''
  onePlusOneSearchForm.configMode = ''
  onePlusOneCurrentPage.value = 1
}

const handleOnePlusOneSizeChange = (size) => {
  onePlusOnePageSize.value = size
  onePlusOneCurrentPage.value = 1
}

const handleOnePlusOneCurrentChange = (page) => {
  onePlusOneCurrentPage.value = page
}

const handleAuditReject = () => {
  const index = products.value.findIndex(c => c.id === auditData.id)
  if (index !== -1) {
    products.value[index].productStatus = '禁用'
    ElMessage.success('审核拒绝')
  }
  auditVisible.value = false
}

const handleSubmit = () => {
  if (!formData.publishCode || !formData.publishName || !formData.innerCardCode || !formData.formNumber) {
    ElMessage.warning('请填写必填项')
    return
  }

  const index = products.value.findIndex(c => c.id === formData.id)
  if (index !== -1) {
    products.value[index] = { ...formData }
    ElMessage.success('修改成功')
  }
  dialogVisible.value = false
}

const handlePicturePreview = (file) => {
  previewImageUrl.value = file.url
  previewVisible.value = true
}

const handleRemoveImage = (file, fileList) => {
  formData.productImages = fileList
  ElMessage.success('图片删除成功')
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传5张图片')
}
</script>

<style scoped>
.product-publish-container {
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

.delete-confirm-content {
  padding: 20px 0;
}

.delete-confirm-content p {
  font-size: 14px;
  color: #606266;
}

.upload-tip {
  margin-top: 8px;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 100px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-actions .el-tabs {
  margin-left: 20px;
}

.config-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.config-item {
  display: flex;
  align-items: center;
}

.config-label {
  font-weight: bold;
  color: #606266;
  margin-right: 10px;
  min-width: 100px;
}

.config-value {
  color: #303133;
}

.mode-desc {
  margin-top: 8px;
}
</style>