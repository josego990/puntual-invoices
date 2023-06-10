<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name_filter" placeholder="Mes" style="width: 100px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="none">
        Upload Pirate
      </el-button>
    </div>
    <aside>
      <a>Todos los Productos</a>
    </aside>

    <el-table v-loading="listLoading" :data="product_list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id_producto }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nombre">
        <template slot-scope="{row}">
          <small><span>{{ row.nombre }}</span></small>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Laboratorio">
        <template slot-scope="{row}">
          <span>{{ row.proveedor }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Presentación">
        <template slot-scope="{row}">
          <span>{{ row.presentacion }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Estante">
        <template slot-scope="{row}">
          <span>{{ row.estanteria }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Existencia">
        <template slot-scope="{row}">
          <span>{{ row.existencia }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Precio">
        <template slot-scope="{row}">
          <span>{{ formatDecimal(row.precio_venta) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Ver">
        <template slot-scope="{row}">
          <el-popover
            placement="left"
            width="400"
            trigger="hover"
          >
            <el-image style="width: 400px; height: 400px" :src="url_s3 + row.cod_producto + '.JPG'" :fit="fit" />
            <el-button slot="reference">Imagen</el-button>
          </el-popover>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog v-loading="createLoading" title="Subir Productos" :visible.sync="dialogCreateInvoiceVisible">
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

const accountTypeOptions = [
  { key: '1', display_name: 'Q' },
  { key: '2', display_name: '$' }
]

const accountTypeKeyValue = accountTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'Products',

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
      upl_prods:
      [
        {
          "PRPPRODId": 1003880,
          "LABNOMBRE": "PFIZER",
          "PRPUMDId": "CAJA",
          "PRPPrecio": 891.160000000,
          "PrecioConIva": 998.099200,
          "PRODNombre": "VIAGRA 100 MG * 4 TAB   - CAJA",
          "IVA": 1.12000,
          "Orden": 3,
          "PRODReqPrescripcion": 1,
          "MODALIDAD": "NA",
          "txt_Button": "*VIAGRA 100 MG x 4 TAB * a Q998.10/CAJA",
          "txt_Detalle": "{\"Codigo\":1003880,\"Nombre\":\"VIAGRA 100 MG * 4 TAB  \",\"Precio\":998.10,\"Cantidad\":",
          "Descuento": "NA",
          "PRPPrecioUnitarioConIvaSinPromocion": 998.099200000,
          "PRMId": 0
        },
        {
          "PRPPRODId": 1003882,
          "LABNOMBRE": "PFIZER",
          "PRPUMDId": "CAJA",
          "PRPPrecio": 702.500000000,
          "PrecioConIva": 786.800000,
          "PRODNombre": "VIAGRA 50 MG * 4 TAB  - CAJA",
          "IVA": 1.12000,
          "Orden": 3,
          "PRODReqPrescripcion": 1,
          "MODALIDAD": "NA",
          "txt_Button": "*VIAGRA 50 MG x 4 TAB* a Q786.80/CAJA",
          "txt_Detalle": "{\"Codigo\":1003882,\"Nombre\":\"VIAGRA 50 MG * 4 TAB \",\"Precio\":786.80,\"Cantidad\":",
          "Descuento": "NA",
          "PRPPrecioUnitarioConIvaSinPromocion": 786.800000000,
          "PRMId": 0
        },
        {
          "PRPPRODId": 1003881,
          "LABNOMBRE": "PFIZER",
          "PRPUMDId": "UNIDAD",
          "PRPPrecio": 169.640000000,
          "PrecioConIva": 189.996800,
          "PRODNombre": "VIAGRA 50 MG * 1 TAB  - UNIDAD",
          "IVA": 1.12000,
          "Orden": 3,
          "PRODReqPrescripcion": 1,
          "MODALIDAD": "NA",
          "txt_Button": "*VIAGRA 50 MG x 1 TAB* a Q190.00/UNIDAD",
          "txt_Detalle": "{\"Codigo\":1003881,\"Nombre\":\"VIAGRA 50 MG * 1 TAB \",\"Precio\":190.00,\"Cantidad\":",
          "Descuento": "NA",
          "PRPPrecioUnitarioConIvaSinPromocion": 189.996800000,
          "PRMId": 0
        }
      ],
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
      product_list: null,
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
    this.getProductsList()
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
    getProductsList() {
      axios.post(this.url_api + 'get-products',
        '').then((response) => {
        console.log(response.data)
        this.product_list = response.data
        this.listLoading = false
      })
    },
    upl_pirate() {
      axios.post(this.url_api + 'upload-files-to-s3-pirate',
        '').then((response) => {
        this.$message({
          message: response.data,
          type: 'success'
        })
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
    uploadProductsBatch() {
      const productosString = JSON.stringify(this.upl_prods)

      axios.post(this.url_api + 'upload-products-batch',
        productosString
      ).then((res) => {
        if (res.data === 'SUCCESS') {
          this.$message({
            message: res.data,
            type: 'success'
          })
        }
      }).catch((error) => {
        console.log('FAILURE!!', error)
      })
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
