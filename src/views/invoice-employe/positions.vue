<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name_filter" placeholder="Puesto" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Agregar
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id_position }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Posición">
        <template slot-scope="{row}">
          <span>{{ row.name_position }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Descripción">
        <template slot-scope="{row}">
          <span>{{ row.desc_position }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-loading="createLoading" title="Nuevo Puesto" :visible.sync="dialogCreatePositionVisible">
      <el-form ref="dataEmpForm" :rules="ins_rules" :model="temp_ins" label-position="left" label-width="70px">
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item label="Puesto" label-width="110px" prop="name_position">
                <el-input v-model="temp_ins.name_position" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:100%">
              <el-form-item label="Descripción" label-width="110px" prop="desc_position">
                <el-input v-model="temp_ins.desc_position" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Descripción del puesto" />
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreatePositionVisible = false">
          Cerrar
        </el-button>
        <el-button type="primary" @click="createPosition()">
          Crear
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPositionsList } from '@/api/article'
import axios from 'axios'
import store from '@/store'

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
      url_api: window.url_api,
      list: null,
      listLoading: true,
      dialogCreatePositionVisible: false,
      createLoading: false,
      name_filter: '',
      ins_rules: {
        name_position: [{ required: true, message: 'Puesto es requerido', trigger: 'blur' }],
        desc_position: [{ required: true, message: 'Descripción es requerido', trigger: 'blur' }]
      },
      temp_ins: {
        name_position: '',
        desc_position: ''
      },
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getPositionList()
    this.pruebas()
  },
  methods: {
    pruebas() {
      const roles = store.getters.roles[0]
      console.log('roles', roles)
      if (roles === 'editor') {
        this.$store.dispatch('user/changeRoles', 'admin').then(() => {
          this.$emit('change')
        })
      }
      console.log('roles', roles)
    },
    getPositionList() {
      axios.get(this.url_api + 'get-positions',
        '').then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    async getList() {
      this.listLoading = true
      const { data } = await fetchPositionsList(this.listQuery)
      const items = data.items
      console.log(data.items)
      this.list = items.map(v => {
        // this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        // v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
      console.log(this.list)
    },
    resetTempIns() {
      this.temp_ins = {
        name_position: '',
        desc_position: ''
      }
    },
    handleCreate() {
      this.resetTempIns()
      this.dialogCreatePositionVisible = true
    },
    handleFilter() {
      this.listLoading = true
      const filter = {}
      filter.filter = this.name_filter
      const body = JSON.stringify(filter)
      axios.post(this.url_api + 'get-positions-filter',
        body).then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    createPosition() {
      const personaString = JSON.stringify(this.temp_ins)
      this.$refs['dataEmpForm'].validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.listLoading = true
          axios.post(this.url_api + 'create-position',
            personaString).then((response) => {
            console.log(response.data[0])
            if (response.data[0].RESULT === 'success') {
              this.$message({
                message: 'Los cambios fueron guardados.',
                type: 'success'
              })
              this.getPositionList()
              this.createLoading = false
              this.dialogCreatePositionVisible = false
            }
          })
        }
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
