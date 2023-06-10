<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <div>
          <el-input class="inputBuscar" placeholder="Buscar Cliente" prefix-icon="el-icon-search" />
          <div style="margin:10px">

            <el-table stripe :data="sale_list" border fit highlight-current-row style="width: 100%" height="300" fixed :cell-style="{padding: '0', height: '25px'}" :header-cell-style="{ background: '#96735E', color: 'white' }">
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

            <el-row style="margin-top:20px;">

              <el-col :span="12" style="text-align:center;margin-top:22px">
                <div class="grid-content bg-purple" style="width:50%;margin-left:25%">
                  <el-row :gutter="10" style="height:85px;">
                    <el-col :span="12" style="height: 100%;">
                      <el-popconfirm
                        confirm-button-text="SEGURO"
                        cancel-button-text="No, gracias"
                        icon="el-icon-info"
                        icon-color="red"
                        title="¿Está seguro de eliminar la orden?"
                        confirm-button-type="warning"
                      >
                        <el-button slot="reference" type="danger" style="width: 100%;height: 100%;">ELIMINAR</el-button>
                      </el-popconfirm>
                    </el-col>
                    <el-col :span="12" style="height: 100%;">
                      <el-button type="success" style="width: 100%;height: 100%;">GUARDAR</el-button>
                    </el-col>
                  </el-row>
                </div>
                <div class="grid-content bg-purple" style="width:50%;margin-left:25%;margin-top:10px">
                  <el-row :gutter="10" style="height:85px;">
                    <el-col :span="12" style="height: 100%;">
                      <el-button type="primary" style="width: 100%;height: 100%;"><small><span>VER RECIBO</span></small></el-button>
                    </el-col>
                    <el-col :span="12" style="height: 100%;">
                      <el-button type="primary" style="width: 100%;height: 100%;">ORDENAR</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-col>

              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-card class="box-card">

                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <span class="custom-font">SUBTOTAL     Q</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light" style="text-align:right">
                          <span class="custom-font">5,236.00</span>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <span class="custom-font">DESCUENTO    Q</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light" style="text-align:right">
                          <span class="custom-font">6.00</span>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                    <el-row style="margin-top:15px">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <span class="custom-font">IMPUESTO     Q</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light" style="text-align:right">
                          <span class="custom-font">689.25</span>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                    <el-row style="margin-top:15px">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <span class="custom-font" style="font-weight: bold;">TOTAL ORDEN  Q</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light" style="text-align:right">
                          <span class="custom-font" style="font-weight: bold;">6,042.75</span>
                        </div>
                      </el-col>
                    </el-row>

                    <el-button style="width: 100%; margin-top: 20px" type="warning">PAGAR</el-button>
                  </el-card>
                </div>
              </el-col>
            </el-row>

          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-light">
        <div>
          <el-input v-model="search_prod" placeholder="Buscar Productos" style="margin:10px;padding-right: 20px" prefix-icon="el-icon-search" />
        </div>
        <div style="margin:10px">
          <el-table v-loading="prd_list_loading" bstripe border fit highlight-current-row style="width: 100%" height="300" fixed :cell-style="{padding: '0', height: '25px'}" :header-cell-style="{ background: '#96735E', color: 'white' }" :data="tableData.filter(data => !search || data.marca.toLowerCase().includes(search.toLowerCase()))" @click.native="mostrar($event)" >

            <el-table-column header-fixed align="left" min-width="130" header-align="center" label="Producto" prop="nombre" />
            <el-table-column prop="marca">
              <template slot="header">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="Marca"
                  prefix-icon="el-icon-search"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="Existe" prop="existencia" />

            <el-table-column align="center" label="Precio">
              <template slot-scope="{row}">
                <span>{{ formatDecimal(row.precio_venta) }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">Agregar</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        
      </div>
      <div style="width:100%;height:100%;text-align:center">
        <el-image style="width: 250px; height: 250px" :src="url_current" :fit="fit" />
      </div>
    </el-col>
  </el-row>

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
      url_current: '',
      prd_list_loading: false,
      url_s3: window.url_s3,
      url_api: window.url_api,
      tableData: [],
      search: '',
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
@font-face {
  font-family: 'CustomFont';
  src: url('./font/fake_receipt.otf');
}

.custom-font {
  font-family: 'CustomFont', sans-serif;
}
.inputBuscar {
  width: 100%;
  margin: 10px;
  padding-right: 20px;
}
.table-container {
  height: 300px;
  overflow-y: auto;
}
.el-table__header th {
  background-color: blue;
  color: white;
}
.final-table {
  width: 50%;
  float: right;
  margin-top: 30px;
  text-align: right;
  margin-right: 20px;
}

table {
  border-collapse: collapse;
}

tr td {
  border-bottom: 1px solid black;
}

</style>
