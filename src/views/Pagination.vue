<template>
  <Page 
    :total="32"
    :page-size="pageSize"
    :page-size-opts="[5, 10, 20]"
    :show-sizer="true"
    @on-change="handleChange"
    placement="top"
    @on-page-size-change="handlePageSizeChange"
    class="page"
  />
</template>

<script>
export default {
  name: 'pagination',

  data() {
    return {
      pageNo: 1,
      pageSize: 10
    }
  },

  created() {
    this.$watch(
      () => {
        this.$emit('onPageInfo', {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
      }
    )
  },

  methods: {
    handleChange(pageNo) {
      this.pageNo = pageNo
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
    }
  }
}
</script>

<style lang="less">
.page {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
