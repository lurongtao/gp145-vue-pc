<template>
  <Page 
    :total="100"
    class="page"
  />
</template>

<script>
import { Page } from 'view-design'

export default {
  components: {
    Page
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
