<template>
  <el-row style="background:#f0e9f4;" class="full-height">

    <el-col :span="12" class="full-height">

      <div id="div_table_sale" class="grid-content bg-purple-light" style="height:50%">
        <el-table
          ref="saleTable"
          stripe
          :data="sale_list"
          border
          fit
          highlight-current-row
          style="width: 98%;margin-top:5px;margin-left:5px;margin-right:20px"
          height="100%"
          fixed
          :cell-style="{padding: '0', height: '25px'}"
          :header-cell-style="{ background: '#96735E', color: 'white' }"
        >
          <el-table-column header-fixed align="left" min-width="120px" header-align="center" label="Producto">
            <template slot-scope="{row}">
              <small><span style="font-weight:bold">{{ row.product }}</span></small>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cantidad" prop="quantity" width="120px">
            <template slot-scope="{row}">
              <el-input-number v-model="row.quantity" :max="99" :min="1" style="width: 100%" size="mini" @change="handleChangeQuantity(row)" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="Precio">
            <template slot-scope="{row}">
              <span>{{ formatDecimal(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Subtotal">
            <template slot-scope="{row}">
              <span>{{ formatDecimal(row.subtotal) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="X" align="center" width="70px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div id="div_detail">
        <el-row style="margin-top:10px;margin-right:10px;">

          <el-col :span="12" class="full-height" style="text-align:center;">
            <div class="grid-content bg-purple" style="margin-left:10px">
              <el-row :gutter="10" style="width:100%;height:30vh;">
                <el-col :span="24" style="height: 100%;">

                  <v-dialog
                    v-model="dialog.value"
                    transition="dialog-bottom-transition"
                    max-width="400"
                  >
                    <template v-slot:activator="{ on, attrs }">

                      <v-card
                        color="primary"
                        v-bind="attrs"
                        style="width: 100%; height: 100%;"
                        v-on="on"
                        @click="cardClick"
                      >
                        <v-card-text style="padding-left:20px;padding-bottom:0px;margin-top:0px">
                          <small><div style="text-align:left;color:bisque">Nombre Cliente</div></small>
                        </v-card-text>
                        <v-card-text style="padding-left:20px;padding-bottom:0px;padding-top:0px;text-align:left;">
                          <span style="color:bisque;font-size:medium" v-text="nombre" />
                        </v-card-text>

                        <v-card-text style="padding-left:20px;padding-bottom:0px;padding-top:0px">
                          <small><div style="text-align:left;color:bisque">Nit</div></small>
                        </v-card-text>
                        <v-card-text style="padding-left:20px;padding-bottom:0px;padding-top:0px">
                          <div style="text-align:left;color:bisque;font-size:medium" v-text="nit" />
                        </v-card-text>

                        <v-card-text style="padding-left:20px;padding-bottom:0px;padding-top:0px">
                          <small><div style="text-align:left;color:bisque">Dirección</div></small>
                        </v-card-text>
                        <v-card-text style="padding-left:20px;padding-bottom:0px;padding-top:0px">
                          <div style="text-align:left;color:bisque;font-size:medium" v-text="direccion" />
                        </v-card-text>

                      </v-card>
                    </template>
                    <template>
                      <v-card>
                        <v-toolbar
                          color="primary"
                          dark
                        >Datos de cliente</v-toolbar>
                        <div style="width:100%;height:100%">
                          <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                            style="padding:20px"
                          >
                            <v-text-field
                              v-model="nit"
                              :counter="10"
                              label="Nit"
                              @keydown.native="soloNumeros"
                              @blur="valNit"
                            />

                            <v-text-field
                              v-model="nombre"
                              label="Nombre"
                              :rules="nombreRules"
                              required
                            />

                            <v-text-field
                              v-model="direccion"
                              label="Dirección"
                            />

                            <v-btn
                              :disabled="!valid"
                              color="success"
                              class="mr-4"
                              @click="validateForm"
                            >
                              Listo
                            </v-btn>

                          </v-form>
                        </div>
                        <v-card-actions class="justify-end">
                          <v-btn
                            text
                            @click="cancelForm"
                          >Cancelar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </el-col>
              </el-row>
            </div>

            <div class="grid-content bg-purple" style="margin-left:10px;margin-top:10px">
              <el-row :gutter="10" style="width:100%;height:85px;">
                <el-col :span="12" style="height: 100%;">
                  <el-popconfirm
                    confirm-button-text="SEGURO"
                    cancel-button-text="No, gracias"
                    icon="el-icon-info"
                    icon-color="red"
                    title="¿Está seguro de eliminar la orden?"
                    confirm-button-type="warning"
                    @onConfirm="confirmDelete"
                  >
                    <el-button slot="reference" type="danger" style="width: 100%; height: 100%;">
                      <i class="el-icon-delete" style="font-size: 30px;" />
                    </el-button>
                  </el-popconfirm>
                </el-col>
                <el-col :span="12" style="height: 100%;">
                  <v-dialog
                    v-model="dialog_pedido.value"
                    transition="dialog-bottom-transition"
                    scrollable
                    max-width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <el-button v-bind="attrs" type="success" style="width: 100%; height: 100%;" v-on="on" @click="generaPedido">
                        <i class="el-icon-document-add" style="font-size: 30px;" />
                      </el-button>
                    </template>
                    <template>
                      <v-card>
                        <v-toolbar color="success" dark style="height:30px">
                          <span style="margin-top:-30px">Pedido</span>
                        </v-toolbar>
                        <v-toolbar color="success" dark>
                          <table style="margin-top:10px;width:100%;border-collapse: collapse;">
                            <tr>
                              <td style="width:30%;border-bottom: 0px solid #fff;padding-left:10px;">Cliente</td>
                              <td style="width:70%;border-bottom: 0px solid #000;padding-left:10px;">
                                <span v-text="nombre" />
                              </td>
                            </tr>
                            <tr>
                              <td style="width:30%;border-bottom: 0px solid #fff;padding-left:10px;">NIT</td>
                              <td style="width:70%;border-bottom: 0px solid #000;padding-left:10px;">
                                <span v-text="nit" />
                              </td>
                            </tr>
                          </table>
                        </v-toolbar>
                        <v-card-text style="padding: 0;">
                          <el-table :data="sale_list" style="width: 100%;">

                            <el-table-column align="left" label="Producto">
                              <template slot-scope="{row}">
                                <small><span class="custom-font" style="font-weight: bold;">{{ row.product }}</span></small>
                              </template>
                            </el-table-column>

                            <el-table-column align="center" label="Cantidad">
                              <template slot-scope="{row}">
                                <span class="custom-font">{{ row.quantity }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column align="center" label="Subtotal">
                              <template slot-scope="{row}">
                                <span class="custom-font">{{ formatDecimal(row.subtotal) }}</span>
                              </template>
                            </el-table-column>
                          </el-table>

                        </v-card-text>
                        <v-divider />
                        <v-card-actions class="justify-end">
                          <v-btn
                            :disabled="!valid"
                            color="success"
                            class="mr-4"
                            @click="confirmPedido"
                          >
                            Generar pedido
                          </v-btn>

                          <v-btn
                            text
                            @click="cancelDialogPedido"
                          >Cancelar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <el-col :span="12" class="full-height">

            <el-card class="box-card full-height">
              <div class="card-content">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <span class="custom-font">SUBTOTAL</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light" style="text-align:right">
                      <span class="custom-font" style="font-weight: bold;">{{ formatDecimal(total_sale) }}</span>
                    </div>
                  </el-col>
                </el-row>
                <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <span class="custom-font">DESCUENTO </span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light" style="text-align:right">
                      <span class="custom-font">0.00</span>
                    </div>
                  </el-col>
                </el-row>
                <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <span class="custom-font">IMPUESTO</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light" style="text-align:right">
                      <span class="custom-font">0.00</span>
                    </div>
                  </el-col>
                </el-row>
                <div style="height:1px;background:gray;margin-top:5px;margin-bottom:5px" />
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <span class="custom-font" style="font-weight: bold;">TOTAL</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light" style="text-align:right">
                      <span class="custom-font" style="font-weight: bold;">{{ formatDecimal(total_sale) }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-button style="width: 100%; height: 60px; margin-top: 12px" type="warning">PAGAR</el-button>

            </el-card>

          </el-col>
        </el-row>
      </div>

    </el-col>

    <el-col :span="12" class="full-height">
      <div id="div_table_prod" class="grid-content bg-purple-light" style="height:50%;margin-right:5px">

        <el-table
          id="table_prod"
          v-loading="prd_list_loading"
          bstripe
          border
          fit
          highlight-current-row
          style="width: 100%;margin-top:5px;"
          height="100%"
          fixed
          :cell-style="{padding: '0', height: '20px'}"
          :header-cell-style="{ background: '#96735E', color: 'white' }"
          :data="tableData.filter(data => (!search || data.marca.toLowerCase().includes(search.toLowerCase())) && (!searchTipo || data.nombre.toLowerCase().includes(searchTipo.toLowerCase())))"
          @click.native="mostrar($event)"
        >
          <el-table-column prop="nombre" header-fixed align="left" min-width="100px">
            <template slot="header">
              <el-input
                v-model="searchTipo"
                size="mini"
                placeholder="Producto"
                prefix-icon="el-icon-search"
              />
            </template>
            <template slot-scope="{row}">
              <small><span style="font-weight:bold">{{ row.nombre }}</span></small>
            </template>
          </el-table-column>
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
          <el-table-column align="center" label="Pres" prop="presentacion" />
          <el-table-column align="center" label="Existe" prop="existencia" />

          <el-table-column align="center" label="Precio">
            <template slot-scope="{row}">
              <span>{{ formatDecimal(row.precio_venta) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="+" align="center" width="70px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-plus" @click="handleAddProduct(scope.$index, scope.row)" />
            </template>
          </el-table-column>
        </el-table>

      </div>

      <div id="div_card" style=";margin-top:10px">
        <el-card class="box-card" style="margin-top:5px;margin-left:2px;margin-right:5px;height:100vh">
          <div v-for="fit in fits" :key="fit">
            <el-image style="width: 99%; height: 290px" :src="url_current" :fit="fit" />
          </div>
        </el-card>
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
      nitValido: false,
      dialog: {
        value: false
      },
      dialog_pedido: {
        value: false
      },
      valid: true,
      nit: 'CF',
      nitRules: [
        v => !!v || 'Nit',
        v => (v && v.length <= 10) || 'Nit must be less than 10 characters'
      ],
      nombre: 'N/A',
      nombreRules: [
        v => !!v || 'Nombre es requerido.'
      ],
      direccion: 'Ciudad',
      checkbox: false,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      labelPosition: 'Left',
      fits: ['contain'],
      url_current: '',
      prd_list_loading: false,
      url_s3: localStorage.getItem('url_s3'),
      url_api: localStorage.getItem('url_api'),
      tableData: [],
      tableDataFilter: [], // Datos filtrados
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
      sale_list: [],
      total_sale: 0.0
    }
  },
  watch: {
    search: function(newSearch) {
      this.filterTableData()
    },
    searchTipo: function(newSearchTipo) {
      this.filterTableData()
    }
  },
  created() {
    this.getProductsList()
  },
  methods: {
    generaPedido() {

    },
    confirmDelete() {
      console.log('popoverConfirm')
      const len = this.sale_list.length
      this.sale_list.splice(0, len)
      this.calculate_total()
      this.nombre = 'N/A'
      this.nit = 'CF'
      this.direccion = 'Ciudad'
    },
    cancelForm() {
      this.nombre = 'N/A'
      this.nit = 'CF'
      this.direccion = 'Ciudad'
      this.dialog.value = false
    },
    cancelDialogPedido() {
      this.dialog_pedido.value = false
    },
    validateForm() {
      if (this.$refs.form.validate()) {
        if (this.nit.length > 0) {
          console.log('NIT ingresado..')
          this.valNit()
          if (this.nitValido) {
            if (this.direccion === '') {
              this.direccion = 'Ciudad'
            }
            this.dialog.value = false
          } else {
            this.$message({
              message: 'NIT inválido',
              type: 'error'
            })
          }
        } else {
          console.log('ALERTAR NO CLIENTE..')
          this.nit = 'CF'
          this.dialog.value = false
        }
        this.direccion = 'Ciudad'
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    cardClick() {
      this.nombre = ''
      this.nit = ''
      this.direccion = ''
    },
    mostrar(event) {
      const rowElement = event.target.closest('.el-table__row')
      const rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement)
      const rowData = this.tableDataFilter[rowIndex]
      // Lógica para mostrar los valores de todas las columnas de la fila
      console.log('Valores de la fila:', rowData.cod_producto)
      this.url_current = this.url_s3 + rowData.cod_producto + '.JPG'
    },
    filterTableData() {
      this.tableDataFilter = this.tableData.filter(data =>
        (!this.search || data.marca.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.searchTipo || data.nombre.toLowerCase().includes(this.searchTipo.toLowerCase()))
      )
      console.log('this.tableDataFilter', this.tableDataFilter)
    },
    getProductsList() {
      this.prd_list_loading = true
      axios.post(this.url_api + 'get-products',
        '').then((response) => {
        // console.log(response.data)
        this.tableData = response.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].precio_venta = parseFloat(this.tableData[i].precio_venta.toFixed(2))
        }
        console.log(this.tableData)
        this.tableDataFilter = this.tableData
        this.prd_list_loading = false
      })
    },
    filterTag(value, row) {
      return row.ofer === value
    },
    handleAddProduct(index, row) {
      console.log(index, row)
      const indice = this.sale_list.findIndex(item => item.cod_producto === row.cod_producto)
      console.log('this.sale_list', this.sale_list)
      if (indice !== -1) {
        const sale_row = this.sale_list[indice]
        this.$refs.saleTable.setCurrentRow(sale_row)
        this.$message({
          message: 'Producto ya seleccionado',
          type: 'warning'
        })
      } else {
        this.sale_list.push(
          {
            product: row.nombre,
            quantity: 1,
            price: row.precio_venta,
            subtotal: row.precio_venta,
            cod_producto: row.cod_producto
          })
        this.calculate_total()
      }
    },
    handleDelete(index, row) {
      this.sale_list.splice(index, 1)
      this.calculate_total()
      this.$message({
        message: 'Removido del pedido',
        type: 'success'
      })
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
    handleChangeQuantity(row) {
      row.subtotal = (row.price.toFixed(2) * row.quantity.toFixed(2))
      this.calculate_total()
    },
    calculate_total() {
      const total = this.sale_list.reduce((total, obj) => parseFloat(total) + obj.subtotal, 0)
      // console.log('total: ', this.formatDecimal(total))
      this.total_sale = total
    },
    formatDecimal(monto) {
      var decimal = monto.toFixed(2)
      var parts = decimal.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    soloNumeros(event) {
      const codigoTecla = event.keyCode || event.which
      console.log('codTecle: ' + codigoTecla)
      // Permite solo números (códigos de teclas del 0 al 9, -, k)
      if ((codigoTecla >= 48 && codigoTecla <= 57) || (codigoTecla >= 96 && codigoTecla <= 105) || (codigoTecla === 8) || (codigoTecla === 9) || (codigoTecla === 189) || (codigoTecla === 75) || (codigoTecla === 109)) {
        return true
      } else {
        event.preventDefault()
      }
    },
    valNit() {
      let nd; let add = 0
      // eslint-disable-next-line no-cond-assign
      if (nd = /^(\d+)\-?([\dk])$/i.exec(this.nit)) {
        nd[2] = (nd[2].toLowerCase() === 'k') ? 10 : parseInt(nd[2])
        for (let i = 0; i < nd[1].length; i++) {
          add += (((i - nd[1].length) * -1) + 1) * parseInt(nd[1][i])
        }
        this.nitValido = ((11 - (add % 11)) % 11) === nd[2]
        console.log('Nit: ', this.nitValido)
      } else {
        this.nitValido = false
        console.log('Nit: ', this.nitValido)
      }
    }
  }
}
</script>

<style scoped>
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.full-height {
  height: 100vh;
}

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
