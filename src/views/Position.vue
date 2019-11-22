<template>
  <div>
    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
        <Button type="error" size="small" @click="remove(index)">Delete</Button>
      </template>
      <div slot="footer">
        <Pagination @onPageInfo="handlePageInfo"></Pagination>
      </div>
    </Table>
  </div>
</template>
<script>
import { Table, Button } from 'view-design'
import Pagination from './Pagination'
import { get } from '../utils/http'
export default {
  data() {
    return {
      columns: [
        {
          title: "公司logo",
          key: "companyLogo",
          className: 'img',
          render: (h, { row, column, index }) => {
            // console.log(row)
            return h('img', {
              attrs: {
                src: 'http://localhost:3000/uploads/' + row.companyLogo,
              }
            }, null)
          }
        },
        {
          title: "公司名称",
          key: "companyName"
        },
        {
          title: "职位名称",
          key: "positionName"
        },
        {
          title: "地点",
          key: "city"
        },
        {
          title: '薪资',
          key: 'salary'
        },
        {
          title: '发布时间',
          key: 'createTime'
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data: []
    };
  },

  created() {
    this.pageNo = 1,
    this.pageSize = 10
  },

  async mounted() {
    console.log(this.pageNo, this.pageSize)
    let result = await get('/api/position?start=0&count=32')
    this.data = result.list
  },

  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    handlePageInfo({ pageNo, pageSize }) {
      this.pageNo = pageNo
      this.pageSize = pageSize
    }
  },
  components: {
    Table,
    Button,
    Pagination
  }
};
</script>

<style lang="less">
.ivu-table-footer {
  height: 60px !important;
  padding-right: 20px;
}
.img {
  img {
    width: 60px;
    height: 60px;
  }
}
</style>