<template>
  <div class="scan-container">
    <el-card>
      <div class="card-header">
        <h3>{{ pageTitle }}</h3>
      </div>
      <div class="card-body">
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  pageTitle: {
    type: String,
    default: '影像扫描'
  }
})
</script>

<style scoped>
.scan-container {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-body {
  min-height: 400px;
}
</style>