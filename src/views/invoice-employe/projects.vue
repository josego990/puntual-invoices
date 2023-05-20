<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id_project }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Proyecto">
        <template slot-scope="{row}">
          <span>{{ row.name_project }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" header-align="center" label="Descripción">
        <template slot-scope="{row}">
          <span>{{ row.desc_project }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'InlineEditTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getPositionList()
  },
  methods: {
    getPositionList() {
      axios.get('http://localhost:3030/get-projects',
        '').then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
