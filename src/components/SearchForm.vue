<template>
  <el-form :model="searchForm" class="search-form">
    <template v-for="(row, rowIndex) in visibleRows" :key="rowIndex">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(field, fieldIndex) in row" :key="fieldIndex">
          <el-form-item :label="field.label">
            <el-input
              v-if="field.type === 'input'"
              v-model="searchForm[field.prop]"
              :placeholder="field.placeholder"
              clearable
            />
            <el-select
              v-else-if="field.type === 'select'"
              v-model="searchForm[field.prop]"
              :placeholder="field.placeholder || '全部'"
              clearable
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="searchForm[field.prop]"
              :type="field.dateType || 'date'"
              :placeholder="field.placeholder"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <transition name="expand">
      <div v-if="showMoreSearch && hiddenRows.length > 0">
        <el-row :gutter="20" style="margin-top: 10px;" v-for="(row, rowIndex) in hiddenRows" :key="'hidden-' + rowIndex">
          <el-col :span="8" v-for="(field, fieldIndex) in row" :key="fieldIndex">
            <el-form-item :label="field.label">
              <el-input
                v-if="field.type === 'input'"
                v-model="searchForm[field.prop]"
                :placeholder="field.placeholder"
                clearable
              />
              <el-select
                v-else-if="field.type === 'select'"
                v-model="searchForm[field.prop]"
                :placeholder="field.placeholder || '全部'"
                clearable
              >
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-date-picker
                v-else-if="field.type === 'date'"
                v-model="searchForm[field.prop]"
                :type="field.dateType || 'date'"
                :placeholder="field.placeholder"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </transition>
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="8">
        <el-form-item>
          <el-button type="primary" @click="handleSearch" style="width: 100%">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item>
          <el-button @click="handleReset" style="width: 100%">重置</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item v-if="hasMoreFields">
          <el-button @click="toggleSearch" style="width: 100%">
            {{ showMoreSearch ? '收起' : '展开' }}查询条件
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
 fields: {
 type: Array,
 required: true
 },
 formModel: {
 type: Object,
 default: null
 }
});
const emit = defineEmits(['search', 'reset']);
const showMoreSearch = ref(false);
const searchForm = props.formModel || reactive({});
props.fields.forEach(field => {
 if (!searchForm.hasOwnProperty(field.prop)) {
 searchForm[field.prop] = '';
 }
});
const MAX_FIELDS_PER_ROW = 3;
const MAX_VISIBLE_ROWS = 1;
const totalVisibleFields = computed(() => MAX_FIELDS_PER_ROW * MAX_VISIBLE_ROWS);
const visibleFields = computed(() => props.fields.slice(0, totalVisibleFields.value));
const hiddenFields = computed(() => props.fields.slice(totalVisibleFields.value));
const hasMoreFields = computed(() => hiddenFields.value.length > 0);
const visibleRows = computed(() => {
 const rows = [];
 for (let i = 0; i < visibleFields.value.length; i += MAX_FIELDS_PER_ROW) {
 rows.push(visibleFields.value.slice(i, i + MAX_FIELDS_PER_ROW));
 }
 return rows;
});
const hiddenRows = computed(() => {
 const rows = [];
 for (let i = 0; i < hiddenFields.value.length; i += MAX_FIELDS_PER_ROW) {
 rows.push(hiddenFields.value.slice(i, i + MAX_FIELDS_PER_ROW));
 }
 return rows;
});
const handleSearch = () => {
 emit('search', { ...searchForm });
};
const handleReset = () => {
 props.fields.forEach(field => {
 searchForm[field.prop] = '';
 });
 emit('reset');
};
const toggleSearch = () => {
 showMoreSearch.value = !showMoreSearch.value;
};
const getFormData = () => {
 return { ...searchForm };
};
defineExpose({ getFormData, searchForm });
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.search-form {
  margin-bottom: 20px;
}
</style>