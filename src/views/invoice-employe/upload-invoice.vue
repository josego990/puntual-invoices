<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name_filter" placeholder="Nombre / Apellido" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Agregar
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Exportar
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id_employe }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nombres y Apellidos">
        <template slot-scope="{row}">
          <span>{{ row.name_employe }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Posición">
        <template slot-scope="{row}">
          <span>{{ row.name_position }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Teléfono">
        <template slot-scope="{row}">
          <span>{{ row.phone1_employe }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="NIT">
        <template slot-scope="{row}">
          <span>{{ row.tax_number_employe }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Banco">
        <template slot-scope="{row}">
          <span>{{ row.name_bank }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleView(row)">
            Ver
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="warning" @click="handleUpdate(row,$index)">
            Editar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" label-position="left" label-width="70px">
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item style="width:150px" label="ID" prop="id">
                <el-input v-model="temp.id_employe" disabled="disabled" />
              </el-form-item>
            </td>
            <td>
              <el-form-item style="margin-left:10px" label="Nombre" prop="name_employe">
                <el-input v-model="temp.name_employe" disabled="disabled" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="País" prop="country">
                <el-input v-model="temp.name_country" disabled="disabled" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="75px" label="Posición" prop="position">
                <el-input v-model="temp.name_position" disabled="disabled" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="NIT" prop="">
                <el-input v-model="temp.tax_number_employe" disabled="disabled" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="75px" label="Teléfono" prop="">
                <el-input v-model="temp.phone1_employe" disabled="disabled" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="Banco" prop="bank">
                <el-input v-model="temp.name_bank" disabled="disabled" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <table>
                <tr>
                  <td>
                    <el-form-item style="margin-left:10px" label="Cuenta" prop="">
                      <el-input v-model="temp.bank_account_number" disabled="disabled" />
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item style="margin-left:10px" label="Tipo" prop="tipo">
                      <el-input v-model="temp.bank_account_type" disabled="disabled" />
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="Correo c" prop="">
                <el-input v-model="temp.email_company_employe" disabled="disabled" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="75px" label="Correo p" prop="">
                <el-input v-model="temp.email_personal_employe" disabled="disabled" />
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cerrar
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading="dialogLoading" title="Editar Empleado" :visible.sync="dialogEditEmployeVisible">
      <el-form ref="dataEmpForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item style="width:150px" label="ID" prop="id">
                <el-input v-model="temp.id_employe" disabled="disabled" />
              </el-form-item>
            </td>
            <td>
              <el-form-item style="margin-left:10px" label="Nombre" prop="name_employe">
                <el-input v-model="temp.name_employe" disabled="disabled" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="País" prop="country">
                <el-input v-model="temp.name_country" disabled="disabled" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label="Puesto">
                <el-select v-model="temp.name_position" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in positions_list" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="NIT" prop="tax_number_employe">
                <el-input v-model="temp.tax_number_employe" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="80px" label="Teléfono" prop="phone1_employe">
                <el-input v-model="temp.phone1_employe" maxlength="8" @keydown.native="soloNumeros" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="Banco">
                <el-select v-model="temp.name_bank" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in banks_list" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
            <td style="width:60%">
              <table>
                <tr>
                  <td>
                    <el-form-item style="margin-left:10px" label="Cuenta" prop="bank_account_number">
                      <el-input v-model="temp.bank_account_number" />
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item style="margin-left:10px" label="Tipo">
                      <el-select v-model="temp.bank_account_type" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in accountTypeOptions" :key="item" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="Mail c" prop="email_company_employe">
                <el-input v-model="temp.email_company_employe" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="75px" label="Mail p" prop="email_personal_employe">
                <el-input v-model="temp.email_personal_employe" />
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditEmployeVisible = false">
          Cerrar
        </el-button>
        <el-button type="primary" @click="updateEmploye()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading="createLoading" title="Nuevo Empleado" :visible.sync="dialogCreateEmployeVisible">
      <el-form ref="dataEmpForm" :rules="ins_rules" :model="temp_ins" label-position="left" label-width="70px">
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item label-width="85px" label="Nombres" prop="f_name_employe">
                <el-input v-model="temp_ins.f_name_employe" />
              </el-form-item>
            </td>
            <td>
              <el-form-item label-width="85px" style="margin-left:10px" label="Apellidos" prop="l_name_employe">
                <el-input v-model="temp_ins.l_name_employe" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:40%">
              <el-form-item label="País" prop="country">
                <el-input />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item label-width="85px" style="margin-left:10px" label="DPI" prop="doc_number_employe">
                <el-input v-model="temp_ins.doc_number_employe" placeholder="DPI" maxlength="13" @keydown.native="soloNumeros" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="Puesto" prop="name_position">
                <el-select v-model="temp_ins.name_position" placeholder="Por favor seleccione">
                  <el-option v-for="item in positions_list" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label-width="90px" style="margin-left:10px" label="Dirección" prop="address_employe">
                <el-input v-model="temp_ins.address_employe" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:40%">
              <el-form-item label="NIT" prop="tax_number_employe">
                <el-input v-model="temp_ins.tax_number_employe" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="85px" label="Teléfono" prop="phone1_employe">
                <el-input v-model="temp_ins.phone1_employe" maxlength="8" @keydown.native="soloNumeros" />
              </el-form-item>
            </td>
          </tr>
        </table>
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item style="width:100%" label="Banco" prop="name_bank">
                <el-select v-model="temp_ins.name_bank" placeholder="Seleccione" style="width:100%">
                  <el-option v-for="item in banks_list" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
          </tr>
        </table>
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item label="Cuenta" prop="bank_account_number">
                <el-input v-model="temp_ins.bank_account_number" @keydown.native="soloNumeros" />
              </el-form-item>
            </td>
            <td>
              <el-form-item style="margin-left:10px" label-width="85px" label="Tipo" prop="bank_account_type">
                <el-select v-model="temp_ins.bank_account_type" placeholder="Seleccione" style="width:100%">
                  <el-option v-for="item in accountTypeOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:40%">
              <el-form-item label="Mail c" prop="email_company_employe">
                <el-input v-model="temp_ins.email_company_employe" />
              </el-form-item>
            </td>
            <td style="width:60%">
              <el-form-item style="margin-left:10px" label-width="85px" label="Mail per" prop="email_personal_employe">
                <el-input v-model="temp_ins.email_personal_employe" />
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateEmployeVisible = false">
          Cerrar
        </el-button>
        <el-button type="primary" @click="createEmploye()">
          Crear
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
const accountTypeOptions = [
  { key: 'MO', display_name: 'Monetaria' },
  { key: 'AH', display_name: 'Ahorro' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const accountTypeKeyValue = accountTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'InlineEditTable',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    typeAccountFilter(type) {
      return accountTypeKeyValue[type]
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogEditEmployeVisible: false,
      dialogCreateEmployeVisible: false,
      statusOptions: ['published', 'draft', 'deleted'],
      accountTypeOptions: ['Monetaria', 'Ahorro'],
      dialogStatus: 'Datos de Empleado',
      name_filter: '',
      textMap: {
        update: 'Datos de Empleado',
        create: 'Create'
      },
      rules: {
        phone1_employe: [{ required: true, message: 'Teléfono es requerido', trigger: 'blur' },
          { pattern: /^\d{8}$/, message: 'Teléfono debe tener 8 dígitos', trigger: 'blur' }],
        tax_number_employe: [{ required: true, message: 'NIT es requerido', trigger: 'blur' }],
        bank_account_number: [{ required: true, message: 'Cuenta es requerida', trigger: 'blur' }],
        email_company_employe: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido', trigger: 'blur' }],
        email_personal_employe: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido', trigger: 'blur' }]
      },
      ins_rules: {
        phone1_employe: [{ required: true, message: 'Teléfono es requerido', trigger: 'blur' },
          { pattern: /^\d{8}$/, message: 'Teléfono debe tener 8 dígitos', trigger: 'blur' }],
        tax_number_employe: [{ required: true, message: 'NIT es requerido', trigger: 'blur' }],
        bank_account_number: [{ required: true, message: 'Cuenta es requerida', trigger: 'blur' }],
        email_company_employe: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido', trigger: 'blur' }],
        email_personal_employe: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido', trigger: 'blur' }],
        f_name_employe: [{ required: true, message: 'Nombre es requerido', trigger: 'blur' }],
        l_name_employe: [{ required: true, message: 'Apellido es requerido', trigger: 'blur' }],
        doc_number_employe: [{ required: true, message: 'DPI es requerido', trigger: 'blur' },
          { pattern: /^\d{13}$/, message: 'DPI debe tener 13 dígitos', trigger: 'blur' }],
        bank_account_type: [{ required: true, message: 'Tipo es requerido', trigger: 'change' }],
        name_bank: [{ required: true, message: 'Banco es requerido', trigger: 'change' }],
        name_position: [{ required: true, message: 'Puesto es requerido', trigger: 'change' }]
      },
      temp: {
        id_employe: undefined,
        name_employe: '',
        name_country: '',
        name_position: '',
        tax_number_employe: '',
        phone1_employe: null,
        name_bank: '',
        bank_account_number: '',
        bank_account_type: '',
        email_company_employe: '',
        email_personal_employe: ''
      },
      temp_ins: {
        f_name_employe: '',
        l_name_employe: '',
        name_position: '',
        doc_number_employe: '',
        tax_number_employe: '',
        address_employe: '',
        phone1_employe: null,
        name_bank: '',
        bank_account_number: '',
        bank_account_type: '',
        email_company_employe: '',
        email_personal_employe: ''
      },
      calendarTypeOptions,
      list: null,
      positions_list: null,
      banks_list: null,
      listLoading: true,
      dialogLoading: false,
      createLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getEmployesList()
    this.getPositionList()
    this.getBanksList()
  },
  methods: {
    getEmployesList() {
      axios.get('http://23.23.76.112:3030/get-employes',
        '').then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      const filter = {}
      filter.filter = this.name_filter
      const body = JSON.stringify(filter)
      axios.post('http://23.23.76.112:3030/get-employes-filter',
        body).then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    getPositionList() {
      axios.get('http://23.23.76.112:3030/get-positions-list',
        '').then((response) => {
        console.log(response.data)
        this.positions_list = response.data
        this.listLoading = false
      })
    },
    getBanksList() {
      axios.get('http://23.23.76.112:3030/get-banks-list',
        '').then((response) => {
        console.log(response.data)
        this.banks_list = response.data
        this.listLoading = false
      })
    },
    handleView(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogEditEmployeVisible = true
      this.$nextTick(() => {
        this.$refs['dataEmpForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id_employe: undefined,
        name_employe: '',
        name_country: '',
        name_position: '',
        tax_number_employe: '',
        phone1_employe: null,
        name_bank: '',
        bank_account_number: '',
        bank_account_type: '',
        email_company_employe: '',
        email_personal_employe: ''
      }
    },
    resetTempIns() {
      this.temp_ins = {
        f_name_employe: '',
        l_name_employe: '',
        name_position: '',
        doc_number_employe: '',
        tax_number_employe: '',
        address_employe: '',
        phone1_employe: null,
        name_bank: '',
        bank_account_number: '',
        bank_account_type: '',
        email_company_employe: '',
        email_personal_employe: ''
      }
    },
    handleCreate() {
      this.resetTempIns()
      this.dialogCreateEmployeVisible = true
    },
    updateEmploye() {
      this.dialogLoading = true
      this.listLoading = true
      const personaString = JSON.stringify(this.temp)

      this.$refs['dataEmpForm'].validate((valid) => {
        if (valid) {
          axios.post('http://23.23.76.112:3030/update-employe',
            personaString).then((response) => {
            console.log(response.data[0])
            if (response.data[0].RESULT === 'success') {
              this.$message({
                message: 'Los cambios fueron guardados.',
                type: 'success'
              })
              this.getEmployesList()
              this.dialogLoading = false
              this.dialogEditEmployeVisible = false
            }
          })
        }
      })
    },
    createEmploye() {
      this.createLoading = true
      const personaString = JSON.stringify(this.temp_ins)
      this.listLoading = true
      this.$refs['dataEmpForm'].validate((valid) => {
        if (valid) {
          axios.post('http://23.23.76.112:3030/create-employe',
            personaString).then((response) => {
            console.log(response.data[0])
            if (response.data[0].RESULT === 'success') {
              this.$message({
                message: 'Los cambios fueron guardados.',
                type: 'success'
              })
              this.getEmployesList()
              this.createLoading = false
              this.dialogCreateEmployeVisible = false
            }
          })
        }
      })
    },
    soloNumeros(event) {
      // Obtiene el código de la tecla presionada
      const codigoTecla = event.keyCode || event.which
      console.log('codTecle: ' + codigoTecla)
      // Permite solo números (códigos de teclas del 0 al 9)
      if ((codigoTecla >= 48 && codigoTecla <= 57) || (codigoTecla >= 96 && codigoTecla <= 105) || (codigoTecla === 8) || (codigoTecla === 9)) {
        return true
      } else {
        event.preventDefault()
      }
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
