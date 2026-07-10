import { mockUsers, mockApplications, mockApplicants, mockEmploymentInfo, mockCreditInfo, mockExternalData, mockApprovalRecords, mockEntryTransferItems, mockPersonalCardProducts, mockCompanyCardProducts } from '@/mock/data'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  auth: {
    login: async (data) => {
      await delay()
      const user = mockUsers.find(u => u.username === data.username && u.password === data.password)
      if (user) {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-' + user.username,
            username: user.username,
            realName: user.realName,
            roles: ['admin'],
            permissions: []
          }
        }
      }
      return { code: 401, message: '用户名或密码错误', data: null }
    }
  },
  users: {
    list: async (params) => {
      await delay()
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = mockUsers.slice(start, Math.min(end, mockUsers.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: mockUsers.length,
          totalPages: Math.ceil(mockUsers.length / size),
          number: page,
          size
        }
      }
    },
    create: async (data) => {
      await delay()
      const newUser = {
        id: mockUsers.length + 1,
        ...data,
        password: data.password || 'password',
        status: data.status || 1,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockUsers.push(newUser)
      return { code: 200, message: '用户创建成功', data: newUser }
    },
    get: async (id) => {
      await delay()
      const user = mockUsers.find(u => u.id === parseInt(id))
      if (user) {
        return { code: 200, message: 'success', data: user }
      }
      return { code: 404, message: '用户不存在', data: null }
    },
    update: async (id, data) => {
      await delay()
      const index = mockUsers.findIndex(u => u.id === parseInt(id))
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data }
        return { code: 200, message: '用户更新成功', data: mockUsers[index] }
      }
      return { code: 404, message: '用户不存在', data: null }
    },
    delete: async (id) => {
      await delay()
      const index = mockUsers.findIndex(u => u.id === parseInt(id))
      if (index !== -1) {
        mockUsers.splice(index, 1)
        return { code: 200, message: '用户删除成功', data: null }
      }
      return { code: 404, message: '用户不存在', data: null }
    }
  },
  applications: {
    list: async (params) => {
      await delay()
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = mockApplications.slice(start, Math.min(end, mockApplications.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: mockApplications.length,
          totalPages: Math.ceil(mockApplications.length / size),
          number: page,
          size
        }
      }
    },
    create: async (data) => {
      await delay()
      const newApplicationId = 'APP' + Date.now()
      const newApplicant = {
        id: mockApplicants.length + 1,
        applicationId: newApplicationId,
        name: data.name,
        idCard: data.idCard,
        gender: data.gender,
        birthDate: data.birthDate,
        phone: data.phone,
        email: data.email,
        address: data.address,
        maritalStatus: data.maritalStatus,
        education: data.education,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockApplicants.push(newApplicant)

      if (data.employmentInfo) {
        mockEmploymentInfo.push({
          applicantId: newApplicant.id,
          ...data.employmentInfo
        })
      }

      const newApplication = {
        id: mockApplications.length + 1,
        applicationId: newApplicationId,
        applicantId: newApplicant.id,
        cardType: data.cardType,
        applyAmount: parseFloat(data.applyAmount),
        status: 'PENDING',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockApplications.unshift(newApplication)

      return {
        code: 200,
        message: '申请创建成功',
        data: mockApi.applications.buildDetail(newApplicationId)
      }
    },
    detail: async (id) => {
      await delay()
      return { code: 200, message: 'success', data: mockApi.applications.buildDetail(id) }
    },
    status: async (status, params) => {
      await delay()
      const filtered = mockApplications.filter(a => a.status === status)
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    buildDetail: (applicationId) => {
      const application = mockApplications.find(a => a.applicationId === applicationId)
      const applicant = mockApplicants.find(a => a.applicationId === applicationId)
      const employmentInfo = mockEmploymentInfo.find(e => e.applicantId === applicant?.id)

      const formatIdCard = (idCard) => {
        if (!idCard || idCard.length < 18) return idCard
        return idCard.substring(0, 4) + '**********' + idCard.substring(14)
      }

      const formatPhone = (phone) => {
        if (!phone || phone.length < 11) return phone
        return phone.substring(0, 3) + '****' + phone.substring(7)
      }

      const calculateAge = (birthDate) => {
        if (!birthDate) return 0
        const birth = new Date(birthDate)
        const now = new Date()
        let age = now.getFullYear() - birth.getFullYear()
        if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
          age--
        }
        return age
      }

      return {
        ...application,
        statusDescription: mockApi.utils.getStatusText(application.status),
        applicant: applicant ? {
          ...applicant,
          idCard: formatIdCard(applicant.idCard),
          phone: formatPhone(applicant.phone),
          genderDescription: applicant.gender === 1 ? '男' : '女',
          age: calculateAge(applicant.birthDate),
          maritalStatusDescription: mockApi.utils.getMaritalStatusText(applicant.maritalStatus)
        } : null,
        employmentInfo: employmentInfo || null
      }
    }
  },
  check: {
    check: async (data) => {
      await delay()
      const application = mockApplications.find(a => a.applicationId === data.applicationId)
      if (application) {
        if (data.checkResult === 'PASS') {
          application.checkResult = 'PASS'
          application.status = 'CHECK_PASSED'
          application.checkOperator = 'checker'
          application.checkTime = new Date().toISOString().replace('T', ' ').substring(0, 19)

          const creditScore = Math.floor(Math.random() * 200) + 550
          application.creditScore = creditScore
          application.creditLevel = mockApi.utils.getCreditLevel(creditScore)
          application.status = 'APPROVAL_PENDING'
        } else {
          application.checkResult = 'FAIL'
          application.status = 'CHECK_FAILED'
          application.checkOperator = 'checker'
          application.checkTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
        return { code: 200, message: '审核完成', data: null }
      }
      return { code: 404, message: '申请不存在', data: null }
    },
    approvalTransfer: async (params) => {
      await delay()
      let filtered = [...mockEntryTransferItems]
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.documentNumber) {
        filtered = filtered.filter(item => item.documentNumber.includes(params.documentNumber))
      }
      if (params.customerName) {
        filtered = filtered.filter(item => item.customerName.includes(params.customerName))
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    transfer: async (data) => {
      await delay()
      const { applicationIds, transferType, remark } = data
      applicationIds.forEach(id => {
        const item = mockEntryTransferItems.find(item => item.applicationId === id)
        if (item) {
          item.status = 'TRANSFERRED'
          item.transferTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
          item.transferType = transferType
          item.transferRemark = remark || ''
        }
      })
      return {
        code: 200,
        message: `成功调件 ${applicationIds.length} 条申请件`,
        data: null
      }
    },
    corporateCardTransfer: async (params) => {
      await delay()
      let filtered = [...mockEntryTransferItems]
      filtered = filtered.filter(item => item.formNumber === 'DWG1B')
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.documentType && params.documentNumber) {
        filtered = filtered.filter(item => 
          item.documentType === params.documentType && 
          item.documentNumber.includes(params.documentNumber)
        )
      } else if (params.documentNumber) {
        filtered = filtered.filter(item => item.documentNumber.includes(params.documentNumber))
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    todayClosed: async (params) => {
      await delay()
      let filtered = mockApplications.map(app => ({
        ...app,
        closedAt: app.approvalTime || app.checkTime,
        operator: app.approvalOperator || app.checkOperator
      }))
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.status) {
        filtered = filtered.filter(item => item.status === params.status)
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    unclosed: async (params) => {
      await delay()
      let filtered = mockApplications.map(app => ({
        ...app,
        currentStatus: mockApi.utils.getStatusText(app.status),
        assignee: 'checker'
      }))
      filtered = filtered.filter(item => 
        item.status !== 'APPROVED' && 
        item.status !== 'REJECTED' && 
        item.status !== 'CANCELLED'
      )
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.customerName) {
        filtered = filtered.filter(item => item.customerName?.includes(params.customerName))
      }
      if (params.applicationType) {
        filtered = filtered.filter(item => item.applicationType === params.applicationType)
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    reassignList: async (params) => {
      await delay()
      let filtered = mockApplications.map(app => ({
        ...app,
        currentAssignee: 'checker',
        currentStatus: mockApi.utils.getStatusText(app.status),
        organization: '北京分行'
      }))
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.currentAssignee) {
        filtered = filtered.filter(item => item.currentAssignee.includes(params.currentAssignee))
      }
      if (params.organization) {
        filtered = filtered.filter(item => item.organization.includes(params.organization))
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    reassign: async (data) => {
      await delay()
      const application = mockApplications.find(a => a.applicationId === data.applicationId)
      if (application) {
        application.currentAssignee = data.newAssignee
        application.reassignReason = data.reason
        application.reassignTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        return { code: 200, message: '重新分派成功', data: null }
      }
      return { code: 404, message: '申请不存在', data: null }
    },
    returnSupplement: async (params) => {
      await delay()
      let filtered = mockApplications.map(app => ({
        ...app,
        returnReason: '资料不全',
        returnTime: app.checkTime,
        operator: app.checkOperator
      }))
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.customerName) {
        filtered = filtered.filter(item => item.customerName?.includes(params.customerName))
      }
      if (params.status) {
        filtered = filtered.filter(item => item.status === params.status)
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    supplement: async (data) => {
      await delay()
      const application = mockApplications.find(a => a.applicationId === data.applicationId)
      if (application) {
        application.status = 'SUPPLEMENTED'
        application.supplementTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        application.supplementRemark = data.remark
        return { code: 200, message: '补齐成功', data: null }
      }
      return { code: 404, message: '申请不存在', data: null }
    }
  },
  approval: {
    approve: async (data) => {
      await delay()
      const application = mockApplications.find(a => a.applicationId === data.applicationId)
      if (application) {
        if (data.approvalResult === 'APPROVE') {
          application.approvalResult = 'APPROVE'
          application.approvedAmount = data.approvedAmount ? parseFloat(data.approvedAmount) : mockApi.utils.calculateApprovedAmount(application)
          application.status = 'APPROVED'
          application.approvalOperator = 'approver'
          application.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        } else {
          application.approvalResult = 'REJECT'
          application.rejectReason = data.rejectReason
          application.status = 'REJECTED'
          application.approvalOperator = 'approver'
          application.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
        return { code: 200, message: '审批完成', data: null }
      }
      return { code: 404, message: '申请不存在', data: null }
    }
  },
  credit: {
    calculate: async (id) => {
      await delay()
      const score = Math.floor(Math.random() * 200) + 550
      const application = mockApplications.find(a => a.applicationId === id)
      if (application) {
        application.creditScore = score
        application.creditLevel = mockApi.utils.getCreditLevel(score)
      }
      return { code: 200, message: 'success', data: score }
    },
    get: async (id) => {
      await delay()
      const creditInfo = mockCreditInfo.find(c => c.applicantId === parseInt(id))
      if (creditInfo) {
        return { code: 200, message: 'success', data: creditInfo }
      }
      return { code: 404, message: '征信信息不存在', data: null }
    }
  },
  external: {
    creditBureau: async (id) => {
      await delay()
      const data = {
        id: mockExternalData.length + 1,
        applicationId: id,
        dataSource: 'CREDIT_BUREAU',
        dataType: 'CREDIT_REPORT',
        dataContent: JSON.stringify({
          creditScore: Math.floor(Math.random() * 200) + 550,
          overdueCount: Math.floor(Math.random() * 5),
          maxOverdueDays: Math.floor(Math.random() * 30),
          totalDebt: Math.floor(Math.random() * 500000),
          creditLimit: Math.floor(Math.random() * 300000),
          queryCount6m: Math.floor(Math.random() * 10),
          hasBadRecord: Math.random() > 0.8
        }),
        queryTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockExternalData.push(data)
      return { code: 200, message: 'success', data }
    },
    judicial: async (id) => {
      await delay()
      const data = {
        id: mockExternalData.length + 1,
        applicationId: id,
        dataSource: 'JUDICIAL',
        dataType: 'JUDICIAL_RECORD',
        dataContent: JSON.stringify({
          hasLawsuit: Math.random() > 0.9,
          hasExecution: Math.random() > 0.95,
          hasRestriction: Math.random() > 0.98,
          caseCount: Math.floor(Math.random() * 3)
        }),
        queryTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockExternalData.push(data)
      return { code: 200, message: 'success', data }
    },
    telecom: async (id) => {
      await delay()
      const data = {
        id: mockExternalData.length + 1,
        applicationId: id,
        dataSource: 'TELECOM',
        dataType: 'TELECOM_INFO',
        dataContent: JSON.stringify({
          phoneNumber: '138****' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          registerYears: Math.floor(Math.random() * 10) + 1,
          hasArrears: Math.random() > 0.9,
          monthlyConsumption: Math.floor(Math.random() * 500) + 50
        }),
        queryTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockExternalData.push(data)
      return { code: 200, message: 'success', data }
    },
    all: async (id) => {
      await delay()
      const data = mockExternalData.filter(d => d.applicationId === id)
      return { code: 200, message: 'success', data }
    }
  },
  entryTransfer: {
    list: async (params) => {
      await delay()
      let filtered = [...mockEntryTransferItems]
      if (params.applicationId) {
        filtered = filtered.filter(item => item.applicationId.includes(params.applicationId))
      }
      if (params.documentType && params.documentNumber) {
        filtered = filtered.filter(item => 
          item.documentType === params.documentType && 
          item.documentNumber.includes(params.documentNumber)
        )
      } else if (params.documentNumber) {
        filtered = filtered.filter(item => item.documentNumber.includes(params.documentNumber))
      }
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    },
    detail: async (params) => {
      await delay()
      const { applicationId } = params
      return {
        code: 200,
        message: 'success',
        data: {
          applicationType: '1',
          applicationId: applicationId || 'APP202607020001',
          applicationRequestType: '1',
          channelFlag: '0',
          newOldCustomerFlag: '0',
          downgradeFlag: '2',
          productCode: '0001',
          productName: '白金卡',
          applyOverdraftLimit: 'Y',
          billCardAddressSelect: '2',
          airlineMileAutoExchange: '1',
          memberNo: 'M123456789',
          foreignTransactionCurrency: '0',
          repaymentMethod: '1',
          autoRepaymentAmountSelect: '1',
          autoRepaymentAccountOption: '1',
          bankProvinceCity: '北京市',
          autoRepaymentForeignAccount: '',
          autoRepaymentRmbAccount: '6222021101001234567',
          contactName: '李四',
          contactTitle: '1',
          contactRelationship: '14',
          contactMobile: '13987654321',
          managerProvince: '110000',
          managerCity: '110100',
          managerAddress: '北京市西城区金融街8号',
          managerIdNumber: '110102198505056789',
          managerEmployeeNo: 'EMP006',
          customerName: '张三',
          customerNamePinyin: 'ZHANG SAN',
          customerBirthPlace: '北京市',
          customerBirthDate: '1990-01-01',
          customerGender: '1',
          customerNationality: 'CN',
          customerIdType: '01',
          customerIdNumber: '110101199001011234',
          customerIdExpireDate: '2036-01-01',
          permanentIdFlag: '0',
          secondIdType: '',
          secondIdNumber: '',
          secondIdStartDate: '',
          secondIdEndDate: '',
          customerMaritalStatus: '1',
          customerEducation: '21',
          customerMobile: '13812345678',
          customerIdIssueCount: '1',
          customerIdIssueDate: '2016-01-01',
          customerOverseasCountry1: '',
          customerOverseasCountry2: '',
          customerOverseasCountry3: '',
          customerExpectedCurrency: 'CNY',
          customerExpectedAmount: '50000',
          customerTaxResidentFlag: '1',
          customerBirthPlaceCountry: 'CN',
          customerBirthPlaceProvince: '110000',
          customerBirthPlaceCity: '110100',
          customerBirthPlaceDistrict: '',
          customerBirthPlaceAddress: '北京市朝阳区',
          customerCurrentResidenceCountry: 'CN',
          customerCurrentResidenceProvince: '110000',
          customerCurrentResidenceCity: '110100',
          customerCurrentResidenceDistrict: '',
          customerCurrentResidenceAddress: '北京市朝阳区建国路88号',
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
          customerCompanyProvince: '110000',
          customerCompanyCity: '110100',
          customerCompanyDistrict: '',
          customerCompanyAddress: '北京市海淀区中关村大街1号',
          customerResidenceProvince: '110000',
          customerResidenceCity: '110100',
          customerResidenceDistrict: '',
          customerResidenceDetailAddress: '北京市朝阳区建国路88号',
          customerCompanyPhone: '010-12345678',
          customerCompanyExtension: '',
          customerCompanyCountryCode: '',
          customerCompanyAreaCode: '010',
          customerCompanyPostcode: '100080',
          customerLivingStatus: '1',
          customerCompanyName: '北京科技有限公司',
          customerCompanyIndustry: '02',
          customerCompanyOccupation: '02',
          customerCompanyEconomicType: '02',
          customerCompanyPosition: '02',
          customerWorkYears: '5',
          customerAnnualIncome: '20',
          customerSignDate: '2026-07-02',
          marketingCode: 'MK001',
          ucifOrgNo: 'ORG001',
          marketingPersonCode: 'MP001',
          partnerOrgCode: '',
          externalIdCode: '',
          freeAnnualFeeType: '1',
          referrerMobile: '13700000000'
        }
      }
    }
  },
  entryUnclosed: {
    list: async (params) => {
      await delay()
      let filtered = [...mockEntryTransferItems]
      filtered = filtered.filter(item => 
        item.status !== 'APPROVED_CARD_SUCCESS' && 
        item.status !== 'APPROVED_CARD_FAILED' && 
        item.status !== 'APPROVED_QUOTA_FAILED'
      )
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    }
  },
  entryClosed: {
    list: async (params) => {
      await delay()
      let filtered = [...mockEntryTransferItems]
      filtered = filtered.filter(item => 
        item.status === 'APPROVED_CARD_SUCCESS' || 
        item.status === 'APPROVED_CARD_FAILED' || 
        item.status === 'APPROVED_QUOTA_FAILED'
      )
      const page = params.page || 0
      const size = params.size || 10
      const start = page * size
      const end = start + size
      const content = filtered.slice(start, Math.min(end, filtered.length))
      return {
        code: 200,
        message: 'success',
        data: {
          content,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size
        }
      }
    }
  },
  products: {
    personal: async (params) => {
      await delay()
      let filtered = [...mockPersonalCardProducts]
      if (params.cardFlag) {
        filtered = filtered.filter(p => p.cardFlag === params.cardFlag)
      }
      if (params.productCode) {
        filtered = filtered.filter(p => p.productCode.includes(params.productCode))
      }
      if (params.productName) {
        const name = params.productName.toLowerCase()
        filtered = filtered.filter(p => p.productName.toLowerCase().includes(name))
      }
      return {
        code: 200,
        message: 'success',
        data: filtered
      }
    },
    company: async (params) => {
      await delay()
      let filtered = [...mockCompanyCardProducts]
      if (params.cardFlag) {
        filtered = filtered.filter(p => p.cardFlag === params.cardFlag)
      }
      if (params.productCode) {
        filtered = filtered.filter(p => p.productCode.includes(params.productCode))
      }
      if (params.productName) {
        const name = params.productName.toLowerCase()
        filtered = filtered.filter(p => p.productName.toLowerCase().includes(name))
      }
      return {
        code: 200,
        message: 'success',
        data: filtered
      }
    }
  },
  utils: {
    getStatusText: (status) => {
      const texts = {
        'PENDING': '待录入',
        'INFORMATION_COMPLETE': '信息完整',
        'CHECKING': '核审中',
        'CHECK_PASSED': '审核通过',
        'CHECK_FAILED': '审核不通过',
        'APPROVAL_PENDING': '待审批',
        'APPROVED': '已批准',
        'REJECTED': '已拒绝',
        'CANCELLED': '已取消'
      }
      return texts[status] || status
    },
    getMaritalStatusText: (status) => {
      if (!status) return null
      return ['未婚', '已婚', '离异', '丧偶'][status - 1] || '未知'
    },
    getCreditLevel: (score) => {
      if (score >= 750) return 'EXCELLENT'
      if (score >= 650) return 'GOOD'
      if (score >= 550) return 'FAIR'
      if (score >= 350) return 'POOR'
      return 'BAD'
    },
    calculateApprovedAmount: (application) => {
      const score = application.creditScore || 600
      let baseAmount
      if (score >= 750) baseAmount = 100000
      else if (score >= 650) baseAmount = 50000
      else if (score >= 550) baseAmount = 20000
      else baseAmount = 5000
      return Math.min(baseAmount, application.applyAmount || baseAmount)
    }
  }
}

export default mockApi