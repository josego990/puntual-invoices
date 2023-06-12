<template>
  <div class="container">
    <div class="panel panel-blue">
      <el-table stripe :data="sale_list" border fit highlight-current-row style="width: 99%" height="50%" fixed :cell-style="{padding: '0', height: '25px'}" :header-cell-style="{ background: '#96735E', color: 'white' }">
        <el-table-column header-fixed align="left" min-width="120" header-align="center" label="Producto">
          <template slot-scope="{row}">
            <span>{{ row.product }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Cantidad">
          <template slot-scope="{row}">
            <el-input-number v-model="row.quantity" :max="99" :min="1" style="width: 100%" size="mini" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="Precio GTQ">
          <template slot-scope="{row}">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Subtotal GTQ">
          <template slot-scope="{row}">
            <span>{{ row.subtotal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="X" align="center" width="50" class-name="small-padding fixed-width">
          <template>
            <el-button type="danger" icon="el-icon-delete" circle />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="panel panel-red"></div>
    <div class="panel panel-yellow"></div>
    <div class="panel panel-green"></div>
  </div>
</template>
<script>

import axios from 'axios'

export default {
  name: 'DashSalesLive',
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
      url_current: '',
      prd_list_loading: false,
      url_s3: window.url_s3,
      url_api: window.url_api,
      tableData: [],
      search: '',
      searchTipo: '',
      search_prod: '',
      switch_pay: true,
      list: null,
      Loading: true,
      dialogCreatePositionVisible: false,
      createLoading: false,
      name_filter: '',
      ins_rules: {
        name_position: [{ required: true, message: 'Puesto es requerido', trigger: 'blur' }],
        desc_position: [{ required: true, message: 'Descripción es requerido', trigger: 'blur' }]
      },
      sale_list: [
        { product: 'Marihuana para el dolor',
          quantity: 2,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 6,
          price: ' 200.00',
          subtotal: ' 400.00'
        },
        { product: 'Marihuana para el dolor',
          quantity: 8,
          price: ' 200.00',
          subtotal: ' 400.00'
        }
      ]
    }
  },
  created() {
    this.getProductsList()
  },
  methods: {
    mostrar(event) {
      const rowData = this.obtenerFila(event.target)
      // Lógica para mostrar los valores de todas las columnas de la fila
      console.log('Valores de la fila:', rowData.cod_producto)
      this.url_current = this.url_s3 + rowData.cod_producto + '.JPG'
    },
    obtenerFila(target) {
      const rowElement = target.closest('.el-table__row')
      const rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement)
      return this.tableData[rowIndex]
    },
    getProductsList() {
      this.prd_list_loading = true
      axios.post(this.url_api + 'get-products',
        '').then((response) => {
        console.log(response.data)
        this.tableData = response.data
        this.prd_list_loading = false
      })
    },
    filterTag(value, row) {
      return row.ofer === value
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    change_pay() {
      console.log(this.switch_pay)
    },
    handleConfirm() {
      console.log('CONFIRMADO')
    },
    handleCancel() {
      console.log('CANCELADO')
    },
    handleChange(value) {
      console.log(this.sale_list)
    },
    formatDecimal(monto) {
      var decimal = monto.toFixed(2)
      var parts = decimal.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
}

/* Estilos de los paneles */
.panel {
  flex-basis: 50%;
  box-sizing: border-box;
  border: 1px solid #000;
}

.panel-red {
  background-color: red;
}

.panel-blue {
  background-color: blue;
}

.panel-green {
  background-color: green;
}

.panel-yellow {
  background-color: yellow;
}
</style>
