<template>
  <div>
    <Table border :columns="columns" :data="data">
      <div slot="header">
        <Button @click="addPosition" type="success" style="margin-left: 5px">添加职位</Button>
      </div>
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
    <Modal
      v-model="showModal"
      title="添加职位"
      :width="800"
      @on-ok="handleOkClick"
    >
      <Form :model="formData" ref="formValidate" :label-width="80">
        <FormItem label="公司LOGO">
          <Upload 
            name="companyLogo"
            :before-upload="handleUpload" 
            action="/api/position/upload"
            :on-success="handleSucc"
          >
            <Button icon="ios-cloud-upload-outline">点击上传图片</Button>
          </Upload>
          <div v-if="file !== null">
            <img :src="insideSrc" alt="" style="width: 60px; height: 60px;" />
            <!-- <Button
              type="text"
              @click="upload"
              :loading="loadingStatus"
            >{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button> -->
          </div>
        </FormItem>
        <FormItem label="公司名称">
          <Input v-model="formData.companyName" placeholder="请输入公司名" />
        </FormItem>
        <FormItem label="职位名称">
          <Input v-model="formData.positionName" placeholder="请输入职位名" />
        </FormItem>
        <FormItem label="招聘城市">
          <Input v-model="formData.city" placeholder="请输入招聘城市" />
        </FormItem>
        <FormItem label="薪资">
          <Input v-model="formData.salary" placeholder="请输入薪资" />
        </FormItem>
        <FormItem label="发布时间">
          <Row>
            <Col span="6">
              <FormItem prop="date">
                <DatePicker :value="date" @on-change="handleDateChange" type="date" placeholder="Select date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker :value="time" @on-change="handleTimeChange" type="time" placeholder="Select time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Pagination from './Pagination'
import { get, post } from '../utils/http'
import _ from 'lodash'
import moment from 'moment'

export default {
  data() {
    return {
      formData: {
        companyName: '',
        positionName: '',
        city: '',
        salary: '',
        datetime: '',
        companyLogo: ''
      },
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
      data: [],
      resource: [],
      pageNo: 1,
      pageSize: 10,
      showModal: false,
      file: null,
      loadingStatus: false,
      insideSrc: '',
      date: new Date(),
      time: new Date()
    };
  },

  async mounted() {
    let result = await get('/api/position?start=0&count=32')
    this.resource = result.list
    this.data = _.chunk(this.resource, this.pageSize)[this.pageNo - 1]
  },

  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$emit('onRouteChange', to)
    })
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
    },
    addPosition() {
      this.showModal = true
    },
    handleUpload(file) {
      this.file = file;

      // 转换为base64
      const reader = new FileReader()
      // 将读取到的文件编码成Data URL
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.insideSrc = event.srcElement.result
      }
    },
    upload() {
      this.loadingStatus = true;
      setTimeout(() => {
        this.file = null;
        this.loadingStatus = false;
        this.$Message.success("Success");
      }, 1500);
    },
    async handleSucc(response, file, fileList) {
      let ret = response.ret
      if ( ret ) {
        let filename = response.data.filename
        this.formData.companyLogo = filename
        this.file = null
      } else {
        this.$Message.error("图片上传失败.");
      }
    },

    handleDateChange(date) {
      this.formData.datetime = date + this.time
    },

    handleTimeChange(time) {
      this.formData.datetime = this.date + time
    },

    async handleOkClick() {
      if (this.formData.datetime === '') {
        this.formData.datetime = moment().format('YYYY-MM-DD, HH:mm:ss');
      }
      if (this.formData.companyLogo) {
        let result = await post('/api/position', this.formData)
        this.$router.replace('/position?_t=' + new Date().getTime())
      } else {
        this.$Message.error('error.')
      }
    }
  },

  watch: {
    pageNo() {
      this.data = _.chunk(this.resource, this.pageSize)[this.pageNo - 1]
    },
    pageSize() {
      this.data = _.chunk(this.resource, this.pageSize)[0]
    }
  },

  components: {
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