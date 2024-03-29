<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="year_filter" placeholder="Año" style="width: 100px;" class="filter-item" />
      <el-input v-model="month_filter" placeholder="Mes" style="width: 100px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleCreate">
        Registrar Documento
      </el-button>
    </div>
    <aside>
      <a>Mis Registros</a>
    </aside>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id_recep_invoice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nombre">
        <template slot-scope="{row}">
          <small><span>{{ row.name_employe }}</span></small>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Serie">
        <template slot-scope="{row}">
          <span>{{ row.serie_number_invoice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Número Factura">
        <template slot-scope="{row}">
          <span>{{ row.number_invoice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Fecha Factura">
        <template slot-scope="{row}">
          <span>{{ formatFecha(row.date_invoice) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Fecha Subida">
        <template slot-scope="{row}">
          <span>{{ formatFecha(row.date_register) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" label="Monto">
        <template slot-scope="{row}">
          <span>{{ row.currency+' '+formatDecimal(row.amount_invoice) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,}">
          <el-button type="primary" size="mini" @click="handleView(row.sample_desc_invoice)">
            Ver
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-loading="createLoading" title="Subir Factura" :visible.sync="dialogCreateInvoiceVisible">
      <el-form ref="dataEmpForm" :rules="ins_rules" :model="temp_ins" label-position="left" label-width="70px">
        <table style="width:100%">
          <tr>
            <td>
              <el-form-item label="Serie" prop="serie_number">
                <el-input v-model="temp_ins.serie_number" />
              </el-form-item>
            </td>
            <td />
            <td>
              <el-form-item label-width="80px" style="margin-left:10px" label="Número" prop="number_invoice">
                <el-input v-model="temp_ins.number_invoice" @keydown.native="soloNumeros" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:35%">
              <el-form-item label="Fecha" prop="date_invoice">
                <el-date-picker v-model="temp_ins.date_invoice" type="datetime" placeholder="Fecha de facturación" @change.native="quitaceros" />
              </el-form-item>
            </td>
            <td style="width:25%">
              <el-form-item label-width="80px" label="Moneda" prop="id_currency" style="margin-left:10px">
                <el-select v-model="temp_ins.id_currency" placeholder="Q">
                  <el-option v-for="item in accountTypeOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="Monto" prop="amount_invoice" style="margin-left:10px">
                <el-input v-model="temp_ins.amount_invoice" @keydown.native="soloNumerosYpunto" />
              </el-form-item>
            </td>
          </tr>
        </table>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <label>Seleccionar factura PDF</label>
          <input id="file" ref="file" type="file" prop="sample_desc_invoice" style="margin-left:20px;width:300px" @change="handleFileUpload()">
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateInvoiceVisible = false">
          Cerrar
        </el-button>
        <el-button type="primary" @click="validateInvoicePdf()">
          Crear
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive

const accountTypeOptions = [
  { key: '1', display_name: 'Q' },
  { key: '2', display_name: '$' }
]

const accountTypeKeyValue = accountTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'UploadDocument',
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
    typeAccountFilter(type) {
      return accountTypeKeyValue[type]
    }
  },
  data() {
    return {
      url_s3: window.url_s3,
      url_api: window.url_api,
      pdfContent: null,
      file: null,
      invoiceSelected: false,
      dialogFormVisible: false,
      dialogEditEmployeVisible: false,
      dialogCreateInvoiceVisible: false,
      statusOptions: ['published', 'draft', 'deleted'],
      accountTypeOptions: ['Q', '$'],
      dialogStatus: 'Datos de Empleado',
      name_filter: '',
      year_filter: null,
      month_filter: null,
      textMap: {
        update: 'Datos de Empleado',
        create: 'Create'
      },
      ins_rules: {
        serie_number: [{ required: true, message: 'Serie es requerido', trigger: 'blur' }],
        number_invoice: [{ required: true, message: 'Número es requerido', trigger: 'blur' }],
        amount_invoice: [{ required: true, message: 'Número es requerido', trigger: 'blur' }],
        id_currency: [{ required: true, message: 'Moneda es requerido', trigger: 'change' }],
        date_invoice: [{ type: 'date', required: true, message: 'Fecha es requerida', trigger: 'change' }],
        sample_desc_invoice: [{ type: 'file', required: true, message: 'Moneda es requerido', trigger: 'change' }]
      },
      temp_ins: {
        id_employe: 1,
        serie_number: '',
        number_invoice: null,
        date_invoice: '',
        id_currency: null,
        amount_invoice: null,
        sample_desc_invoice: null,
        is_loaded: 0
      },
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
    this.getInvoicesListById()
  },
  methods: {
    getInvoicesListById() {
      this.listLoading = true
      const filter = {}
      filter.id_employe = 1

      const body = JSON.stringify(filter)

      axios.post(this.url_api + 'get-invoices-by-id',
        body).then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      const filters = {}
      filters.id_employe = 1
      filters.year = this.year_filter
      filters.month = this.month_filter

      const body = JSON.stringify(filters)

      axios.post(this.url_api + 'get-invoices-by-filters',
        body).then((response) => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
      })
    },
    getProjectsList() {
      axios.get(this.url_api + 'get-projects',
        '').then((response) => {
        console.log(response.data)
        this.banks_list = response.data
        this.listLoading = false
      })
    },
    handleView(sample) {
      window.open(this.url_s3 + sample, '_blank')
    },
    resetTempIns() {
      this.temp_ins = {
        id_employe: 1,
        serie_number: '',
        number_invoice: null,
        date_invoice: '',
        id_currency: null,
        amount_invoice: null,
        sample_desc_invoice: null,
        is_loaded: 0
      }
    },
    handleCreate() {
      this.resetTempIns()
      this.dialogCreateInvoiceVisible = true
    },
    insertInvoice() {
      const personaString = JSON.stringify(this.temp_ins)
      console.log('CANELITAS')
      console.log(personaString)

      axios.post(this.url_api + 'create-invoice',
        personaString).then((response) => {
        console.log(response.data[0])
        if (response.data[0].RESULT === 'success') {
          this.$message({
            message: 'Los cambios fueron guardados.',
            type: 'success'
          })
          this.getInvoicesListById()
          this.createLoading = false
          this.dialogCreateInvoiceVisible = false
        } else {
          this.$message({
            message: response.data[0],
            type: 'error'
          })
          this.createLoading = false
        }
      })
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
      const fileName = this.file.name
      const fileExtension = fileName.split('.').pop()
      if (fileExtension === 'pdf') {
        this.invoiceSelected = true
        //  this.readPDFContent()
      } else {
        this.$message({
          message: 'La factura debe ser formato PDF.',
          type: 'error'
        })
        this.invoiceSelected = false
      }
      console.log(this.file.name)
      this.temp_ins.sample_desc_invoice = this.file.name
    },
    readPDFContent() {
      if (!this.file) {
        return
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        const text = event.target.result
        this.pdfContent = text
        console.log(this.pdfContent)
      }

      reader.onerror = (event) => {
        console.error('Error al leer el archivo PDF:', event.target.error)
      }

      reader.readAsText(this.file)
    },
    validateInvoicePdf() {
      if (this.invoiceSelected) {
        const invoiceString = JSON.stringify(this.temp_ins)
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('invoiceString', invoiceString)
        this.$refs['dataEmpForm'].validate((valid) => {
          if (valid) {
            this.createLoading = true
            axios.post(this.url_api + 'validate-invoice-pdf',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'i_c': '1',
                  'n_f': this.file.name,
                  'd_e': '01/01/2024'
                },
                timeout: 5000 // Timeout de 5 segundos (5000 milisegundos)
              }
            ).then((res) => {
              if (res.data === 'SUCCESS') {
                console.log('Factura válida!')
                this.submitFile()
              } else {
                this.$message({
                  message: res.data,
                  type: 'error'
                })
                this.createLoading = false
              }
            }).catch((error) => {
              console.log('FAILURE!!', error)
              this.$message({
                message: error + ' Es posible que el archivo esté corrupto.',
                type: 'error'
              })
              this.createLoading = false
            })
          }
        })
      } else {
        this.$message({
          message: 'No ha seleccionado un archivo válido.',
          type: 'error'
        })
      }
    },
    submitFile() {
      if (this.invoiceSelected) {
        const formData = new FormData()
        formData.append('file', this.file)

        this.$refs['dataEmpForm'].validate((valid) => {
          if (valid) {
            this.createLoading = true
            axios.post(this.url_api + 'upload-file-v2',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'i_c': '1',
                  'n_f': this.file.name,
                  'd_e': '01/01/2024'
                }
              }
            ).then((res) => {
              if (res.data === 'SUCCESS') {
                console.log('Archivo cargado!')
                this.insertInvoice()
              }
            }).catch((error) => {
              console.log('FAILURE!!', error)
            })
          }
        })
      } else {
        this.$message({
          message: 'No ha seleccionado un archivo válido.',
          type: 'error'
        })
      }
    },
    formatFecha(fecha) {
      // return moment(fecha).format('DD/MM/YYYY')
      const dat = fecha.split('T')[0]
      const spl = dat.split('-')
      return spl[2] + '-' + spl[1] + '-' + spl[0]
    },
    formatDecimal(monto) {
      var decimal = monto.toFixed(2)
      var parts = decimal.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    soloNumeros(event) {
      // Obtiene el código de la tecla presionada
      const codigoTecla = event.keyCode || event.which
      // console.log('codTecle: ' + codigoTecla)
      // Permite solo números (códigos de teclas del 0 al 9)
      if ((codigoTecla >= 48 && codigoTecla <= 57) || (codigoTecla >= 96 && codigoTecla <= 105) || (codigoTecla === 8) || (codigoTecla === 9)) {
        return true
      } else {
        event.preventDefault()
      }
    },
    soloNumerosYpunto(event) {
      // Obtiene el código de la tecla presionada
      const codigoTecla = event.keyCode || event.which
      // console.log('codTecle: ' + codigoTecla)
      // Permite solo números (códigos de teclas del 0 al 9)
      if ((codigoTecla >= 48 && codigoTecla <= 57) || (codigoTecla >= 96 && codigoTecla <= 105) || (codigoTecla === 8) || (codigoTecla === 9) || (codigoTecla === 110) || (codigoTecla === 190)) {
        return true
      } else {
        event.preventDefault()
      }
    },
    quitaceros(event) {
      let value = this.temp_ins.date_invoice

      value = value.replace(' 00:00:00', '')

      this.temp_ins.date_invoice = value
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
