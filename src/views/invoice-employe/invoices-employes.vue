<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="year_filter" placeholder="Año" style="width: 100px;" class="filter-item" />
      <el-input v-model="month_filter" placeholder="Mes" style="width: 100px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <aside>
      <a>Facturas cargadas por los colaboradores</a>
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
  </div>
</template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive
import moment from 'moment'
import { parseTime } from '@/utils'

const accountTypeOptions = [
  { key: '1', display_name: 'Q' },
  { key: '2', display_name: '$' }
]

const accountTypeKeyValue = accountTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'UploadInvoice',
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
      downloadLoading: false,
      textMap: {
        update: 'Datos de Empleado',
        create: 'Create'
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
      filter.id_employe = 11

      const body = JSON.stringify(filter)

      axios.post('http://23.23.76.112:3030/get-invoices',
        body).then((response) => {
        // console.log(response.data)
        this.list = response.data

        for (let i = 0; i < this.list.length; i++) {
          this.list[i].sample_desc_invoice = 'https://puntual-imagenes.s3.amazonaws.com/' + this.list[i].sample_desc_invoice
          this.list[i].formula_column = '=HIPERVINCULO(G2)'
          // console.log(this.list[i].sample_desc_invoice)
        }

        console.log(this.list)

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      const filters = {}
      filters.id_employe = 11
      filters.year = this.year_filter
      filters.month = this.month_filter

      const body = JSON.stringify(filters)

      axios.post('http://23.23.76.112:3030/get-invoices-by-filters-2',
        body).then((response) => {
        console.log(response.data)
        this.list = response.data
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].sample_desc_invoice = 'https://puntual-imagenes.s3.amazonaws.com/' + this.list[i].sample_desc_invoice
          // console.log(this.list[i].sample_desc_invoice)
        }
        this.listLoading = false
      })
    },
    handleView(sample) {
      window.open(sample, '_blank')
    },
    formatFecha(fecha) {
      return moment(fecha).format('DD/MM/YYYY')
    },
    formatDecimal(monto) {
      var decimal = monto.toFixed(2)
      var parts = decimal.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID_FACTURA', 'NOMBRE_EMPLEADO', 'SERIE', 'NUMERO', 'FECHA_FACTURA', 'MONTO', 'NOMBRE_IMAGEN', 'VICULO_IMAGEN']
        const filterVal = ['id_recep_invoice', 'name_employe', 'serie_number_invoice', 'number_invoice', 'date_invoice', 'amount_invoice', 'sample_desc_invoice', 'formula_column']
        const data = this.formatJson(filterVal)

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'date_invoice') {
          const dat = v[j].split('T')[0]
          const spl = dat.split('-')
          const newval = spl[2] + '-' + spl[1] + '-' + spl[0]
          return newval
        } else {
          return v[j]
        }
      }))
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
