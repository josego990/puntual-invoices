<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="year_filter" placeholder="Año" style="width: 100px;" class="filter-item" />
      <el-input v-model="month_filter" placeholder="Mes" style="width: 100px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="uploadProductsBatch">
        Subir Productos batch
      </el-button>
    </div>
    <aside>
      <a>Todos los Productos</a>
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
      upl_prods:
      [{
        'PRPPRODId': 1016773,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 28.570000000,
        'PrecioConIva': 31.998400,
        'PRODNombre': 'GALOGRIP DIA X 12 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GALOGRIP DIA X 12 GELCAPS* a Q32.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1016773,\'Nombre\':\'GALOGRIP DIA X 12 GELCAPS\',\'Precio\':32.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 31.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016774,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 28.570000000,
        'PrecioConIva': 31.998400,
        'PRODNombre': 'GALOGRIP NOCHE X 12 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GALOGRIP NOCHE X 12 GELCAPS* a Q32.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1016774,\'Nombre\':\'GALOGRIP NOCHE X 12 GELCAPS\',\'Precio\':32.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 31.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009031,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 28.000000000,
        'PrecioConIva': 28.000000,
        'PRODNombre': 'ACETAMINOFEN GALOMEDIKAL JARABE 120 ML  - UNIDAD',
        'IVA': 1.00000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN GALOMEDIKAL JARABE 120 ML* a Q28.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009031,\'Nombre\':\'ACETAMINOFEN GALOMEDIKAL JARABE 120 ML \',\'Precio\':28.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 28.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016611,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 20.090000000,
        'PrecioConIva': 22.500800,
        'PRODNombre': 'GALOGRIP X 12 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GALOGRIP X 12 TABLETAS* a Q22.50/CAJA',
        'txt_Detalle': '{\'Codigo\':1016611,\'Nombre\':\'GALOGRIP X 12 TABLETAS\',\'Precio\':22.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 22.500800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016771,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.570000000,
        'PrecioConIva': 3.998400,
        'PRODNombre': 'GALOGRIP NOCHE X BLISTER 2 GELCAPS - BLISTER',
        'IVA': 1.12000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GALOGRIP NOCHE X BLISTER 2 GELCAPS* a Q4.00/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016771,\'Nombre\':\'GALOGRIP NOCHE X BLISTER 2 GELCAPS\',\'Precio\':4.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016772,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.570000000,
        'PrecioConIva': 3.998400,
        'PRODNombre': 'GALOGRIP DIA X 2 GELCAPS - BLISTER',
        'IVA': 1.12000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GALOGRIP DIA X 2 GELCAPS* a Q4.00/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016772,\'Nombre\':\'GALOGRIP DIA X 2 GELCAPS\',\'Precio\':4.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009175,
        'LABNOMBRE': 'GALOMEDIKAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.600000000,
        'PrecioConIva': 0.600000,
        'PRODNombre': 'ACETAMINOFEN GALOMEDIKAL 500MG UNIDAD - UNIDAD',
        'IVA': 1.00000,
        'Orden': 0,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN GALOMEDIKAL 500MG UNIDAD* a Q0.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009175,\'Nombre\':\'ACETAMINOFEN GALOMEDIKAL 500MG UNIDAD\',\'Precio\':0.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015639,
        'LABNOMBRE': 'BELSA',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 120.000000000,
        'PrecioConIva': 120.000000,
        'PRODNombre': 'METOCARBAMOL + ACETAMINOFEN BELSA X30TAB - CAJA',
        'IVA': 1.00000,
        'Orden': 1,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*METOCARBAMOL + ACETAMINOFEN BELSA X30TAB* a Q120.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1015639,\'Nombre\':\'METOCARBAMOL + ACETAMINOFEN BELSA X30TAB\',\'Precio\':120.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 120.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015035,
        'LABNOMBRE': 'BELSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 42.000000000,
        'PrecioConIva': 42.000000,
        'PRODNombre': 'ACETAMINOFEN BELSA 100MG/ML GOTAS 30ML - UNIDAD',
        'IVA': 1.00000,
        'Orden': 1,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN BELSA 100MG/ML GOTAS 30ML* a Q42.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015035,\'Nombre\':\'ACETAMINOFEN BELSA 100MG/ML GOTAS 30ML\',\'Precio\':42.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 42.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014872,
        'LABNOMBRE': 'BELSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 28.000000000,
        'PrecioConIva': 28.000000,
        'PRODNombre': 'ACETAMINOFEN JARABE BELSA X 120 ML - UNIDAD',
        'IVA': 1.00000,
        'Orden': 1,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN JARABE BELSA X 120 ML* a Q28.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1014872,\'Nombre\':\'ACETAMINOFEN JARABE BELSA X 120 ML\',\'Precio\':28.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 28.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015638,
        'LABNOMBRE': 'BELSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.500000000,
        'PrecioConIva': 4.500000,
        'PRODNombre': 'METOCARBAMOL + ACETAMINOFEN BELSA X TAB - UNIDAD',
        'IVA': 1.00000,
        'Orden': 1,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*METOCARBAMOL + ACETAMINOFEN BELSA X TAB* a Q4.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015638,\'Nombre\':\'METOCARBAMOL + ACETAMINOFEN BELSA X TAB\',\'Precio\':4.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.500000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015008,
        'LABNOMBRE': 'BELSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.600000000,
        'PrecioConIva': 0.600000,
        'PRODNombre': 'ACETAMINOFEN BELSA 500MG X TABLETA - UNIDAD',
        'IVA': 1.00000,
        'Orden': 1,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN BELSA 500MG X TABLETA* a Q0.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015008,\'Nombre\':\'ACETAMINOFEN BELSA 500MG X TABLETA\',\'Precio\':0.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010692,
        'LABNOMBRE': 'FARMAVANZA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 6.250000000,
        'PrecioConIva': 7.000000,
        'PRODNombre': 'MIZAR * UNIDAD TAB - UNIDAD',
        'IVA': 1.12000,
        'Orden': 2,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*MIZAR x UNIDAD TAB* a Q7.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010692,\'Nombre\':\'MIZAR * UNIDAD TAB\',\'Precio\':7.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 7.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014877,
        'LABNOMBRE': 'UNIPHARM',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 286.380000000,
        'PrecioConIva': 320.745600,
        'PRODNombre': 'KIT DEFENSORES DE LA SALUD RESPIRATORIA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*KIT DEFENSORES DE LA SALUD RESPIRATORIA* a Q320.75/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1014877,\'Nombre\':\'KIT DEFENSORES DE LA SALUD RESPIRATORIA\',\'Precio\':320.75,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 320.745600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009335,
        'LABNOMBRE': 'CHEMINTER',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 235.800000000,
        'PrecioConIva': 264.096000,
        'PRODNombre': '*OXYKON PLUS * 20 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 4,
        'MODALIDAD': 'NA',
        'txt_Button': '*xOXYKON PLUS x 20 TABLETAS* a Q264.10/CAJA',
        'txt_Detalle': '{\'Codigo\':1009335,\'Nombre\':\'*OXYKON PLUS * 20 TABLETAS\',\'Precio\':264.10,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 264.096000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001255,
        'LABNOMBRE': 'CHEMINTER',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 222.320000000,
        'PrecioConIva': 248.998400,
        'PRODNombre': 'KODONE * 20 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 4,
        'MODALIDAD': 'NA',
        'txt_Button': '*KODONE x 20 TAB* a Q249.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1001255,\'Nombre\':\'KODONE * 20 TAB \',\'Precio\':249.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 248.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002790,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 203.880000000,
        'PrecioConIva': 228.345600,
        'PRODNombre': 'CETAMIN CC * 30 COMPRIMIDOS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*CETAMIN CC x 30 COMPRIMIDOS* a Q228.35/CAJA',
        'txt_Detalle': '{\'Codigo\':1002790,\'Nombre\':\'CETAMIN CC * 30 COMPRIMIDOS \',\'Precio\':228.35,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 228.345600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015581,
        'LABNOMBRE': 'CORE PHARMA',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 138.210000000,
        'PrecioConIva': 154.795200,
        'PRODNombre': 'FEBRILONE DUAL X 20 COMPRIMIDOS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*FEBRILONE DUAL X 20 COMPRIMIDOS* a Q154.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1015581,\'Nombre\':\'FEBRILONE DUAL X 20 COMPRIMIDOS\',\'Precio\':154.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 154.795200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004653,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 132.100000000,
        'PrecioConIva': 147.952000,
        'PRODNombre': 'CORILIN GOTAS PEDIATRICO 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CORILIN GOTAS PEDIATRICO 30 ML* a Q147.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004653,\'Nombre\':\'CORILIN GOTAS PEDIATRICO 30 ML\',\'Precio\':147.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 147.952000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015042,
        'LABNOMBRE': 'WINZZER',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 111.610000000,
        'PrecioConIva': 125.003200,
        'PRODNombre': 'WINGRIP JARABE FRASCO X 120 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINGRIP JARABE FRASCO X 120 ML* a Q125.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015042,\'Nombre\':\'WINGRIP JARABE FRASCO X 120 ML\',\'Precio\':125.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 125.003200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014017,
        'LABNOMBRE': 'WINZZER',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 111.560000000,
        'PrecioConIva': 124.947200,
        'PRODNombre': 'WINGRIP SOLUCION ORAL GOTAS X 30ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': '1+1',
        'txt_Button': '*WINGRIP SOLUCION ORAL GOTAS X 30ML* a Q124.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1014017,\'Nombre\':\'WINGRIP SOLUCION ORAL GOTAS X 30ML\',\'Precio\':124.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 124.947200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015781,
        'LABNOMBRE': 'HESSEL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 108.390000000,
        'PrecioConIva': 121.396800,
        'PRODNombre': 'KIDIFLU GOTAS PEDIATRICAS X 30ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*KIDIFLU GOTAS PEDIATRICAS X 30ML* a Q121.40/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015781,\'Nombre\':\'KIDIFLU GOTAS PEDIATRICAS X 30ML\',\'Precio\':121.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 121.396800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002793,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 107.590000000,
        'PrecioConIva': 120.500800,
        'PRODNombre': 'CORIFEN GOTAS 30 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CORIFEN GOTAS 30 ML* a Q120.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002793,\'Nombre\':\'CORIFEN GOTAS 30 ML \',\'Precio\':120.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 120.500800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007033,
        'LABNOMBRE': 'DOGMA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 106.790000000,
        'PrecioConIva': 119.604800,
        'PRODNombre': 'CONGESTEX-2 SOLUCION ORAL 30 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*CONGESTEX-2 SOLUCION ORAL 30 ML* a Q119.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007033,\'Nombre\':\'CONGESTEX-2 SOLUCION ORAL 30 ML \',\'Precio\':119.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 119.604800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016290,
        'LABNOMBRE': 'MK',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 105.600000000,
        'PrecioConIva': 105.600000,
        'PRODNombre': 'TRAMADOL ACETAMINO MK 37.5/325MG X 10TAB - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TRAMADOL ACETAMINO MK 37.5/325MG X 10TAB* a Q105.60/CAJA',
        'txt_Detalle': '{\'Codigo\':1016290,\'Nombre\':\'TRAMADOL ACETAMINO MK 37.5/325MG X 10TAB\',\'Precio\':105.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 105.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002498,
        'LABNOMBRE': 'JOHNSON JOHNSON',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 102.370000000,
        'PrecioConIva': 114.654400,
        'PRODNombre': 'TYLENOL SUSPENSION CEREZA 120 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLENOL SUSPENSION CEREZA 120 ML* a Q114.65/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002498,\'Nombre\':\'TYLENOL SUSPENSION CEREZA 120 ML\',\'Precio\':114.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 114.654400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016239,
        'LABNOMBRE': 'PHARMOZ',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 95.000000000,
        'PrecioConIva': 106.400000,
        'PRODNombre': 'IVYTOS IC 100MG/5ML JARABE X 120ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*IVYTOS IC 100MG/5ML JARABE X 120ML* a Q106.40/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016239,\'Nombre\':\'IVYTOS IC 100MG/5ML JARABE X 120ML\',\'Precio\':106.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 106.400000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015717,
        'LABNOMBRE': 'HENIE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 94.870000000,
        'PrecioConIva': 106.254400,
        'PRODNombre': 'IRILINA GOTAS PEDIATRICAS X 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*IRILINA GOTAS PEDIATRICAS X 30 ML* a Q106.25/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015717,\'Nombre\':\'IRILINA GOTAS PEDIATRICAS X 30 ML\',\'Precio\':106.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 106.254400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011262,
        'LABNOMBRE': 'CHEMINTER',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 90.000000000,
        'PrecioConIva': 100.800000,
        'PRODNombre': 'DOLOFEBRYL PLUS * 30 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLOFEBRYL PLUS x 30 TABLETAS* a Q100.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1011262,\'Nombre\':\'DOLOFEBRYL PLUS * 30 TABLETAS \',\'Precio\':100.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 100.800000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010878,
        'LABNOMBRE': 'GENERIX LABORATORIOS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 89.240000000,
        'PrecioConIva': 99.948800,
        'PRODNombre': 'RINOFLUX F JARABE 120ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RINOFLUX F JARABE 120ML* a Q99.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010878,\'Nombre\':\'RINOFLUX F JARABE 120ML \',\'Precio\':99.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 99.948800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002494,
        'LABNOMBRE': 'JOHNSON JOHNSON',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 79.200000000,
        'PrecioConIva': 88.704000,
        'PRODNombre': 'TYLENOL EXTRA FUERTE * FRASCO 50 CAPLETS - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLENOL EXTRA FUERTE x FRASCO 50 CAPLETS* a Q88.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002494,\'Nombre\':\'TYLENOL EXTRA FUERTE * FRASCO 50 CAPLETS\',\'Precio\':88.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 88.704000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015718,
        'LABNOMBRE': 'HENIE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 76.740000000,
        'PrecioConIva': 85.948800,
        'PRODNombre': 'IRILINA SOLUCION X 120ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*IRILINA SOLUCION X 120ML* a Q85.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015718,\'Nombre\':\'IRILINA SOLUCION X 120ML\',\'Precio\':85.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 85.948800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002495,
        'LABNOMBRE': 'JOHNSON JOHNSON',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 71.120000000,
        'PrecioConIva': 79.654400,
        'PRODNombre': 'TYLENOL GOTAS CEREZA * 15 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLENOL GOTAS CEREZA x 15 ML* a Q79.65/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002495,\'Nombre\':\'TYLENOL GOTAS CEREZA * 15 ML\',\'Precio\':79.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 79.654400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013057,
        'LABNOMBRE': 'DOGMA',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 69.020000000,
        'PrecioConIva': 77.302400,
        'PRODNombre': 'CONGESTEX ANTIGRIPAL * 12 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CONGESTEX ANTIGRIPAL x 12 TABLETAS* a Q77.30/CAJA',
        'txt_Detalle': '{\'Codigo\':1013057,\'Nombre\':\'CONGESTEX ANTIGRIPAL * 12 TABLETAS \',\'Precio\':77.30,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 77.302400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012373,
        'LABNOMBRE': 'PHARLAND',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 66.960000000,
        'PrecioConIva': 74.995200,
        'PRODNombre': 'WONTRAN 75MG/650MG X 10 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WONTRAN 75MG/650MG X 10 TAB* a Q75.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1012373,\'Nombre\':\'WONTRAN 75MG/650MG X 10 TAB \',\'Precio\':75.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 74.995200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002827,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 60.000000000,
        'PrecioConIva': 67.200000,
        'PRODNombre': 'RINOFED PLUS * 12 COMPRIMIDOS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RINOFED PLUS x 12 COMPRIMIDOS* a Q67.20/CAJA',
        'txt_Detalle': '{\'Codigo\':1002827,\'Nombre\':\'RINOFED PLUS * 12 COMPRIMIDOS \',\'Precio\':67.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 67.200000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001713,
        'LABNOMBRE': 'FARNET',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 59.110000000,
        'PrecioConIva': 66.203200,
        'PRODNombre': 'CILFRIN D JARABE 120ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CILFRIN D JARABE 120ML* a Q66.20/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001713,\'Nombre\':\'CILFRIN D JARABE 120ML \',\'Precio\':66.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 66.203200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016240,
        'LABNOMBRE': 'LANCASCO',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 58.040000000,
        'PrecioConIva': 65.004800,
        'PRODNombre': 'GRIPEOLAN 500MG X 20 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPEOLAN 500MG X 20 TABLETAS* a Q65.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1016240,\'Nombre\':\'GRIPEOLAN 500MG X 20 TABLETAS\',\'Precio\':65.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 65.004800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002253,
        'LABNOMBRE': 'INFASA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 57.190000000,
        'PrecioConIva': 64.052800,
        'PRODNombre': 'IRS JARABE 120 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*IRS JARABE 120 ML* a Q64.05/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002253,\'Nombre\':\'IRS JARABE 120 ML \',\'Precio\':64.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 64.052800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009737,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 57.010000000,
        'PrecioConIva': 63.851200,
        'PRODNombre': 'GRIPETIN MULTISINTOMAS JARABE FRASCO * 120ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN MULTISINTOMAS JARABE FRASCO x 120ML* a Q63.85/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009737,\'Nombre\':\'GRIPETIN MULTISINTOMAS JARABE FRASCO * 120ML\',\'Precio\':63.85,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 63.851200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004250,
        'LABNOMBRE': 'QUALIPHARM',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 56.880000000,
        'PrecioConIva': 63.705600,
        'PRODNombre': 'COFEDRIN FRASCO 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*COFEDRIN FRASCO 30 ML* a Q63.71/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004250,\'Nombre\':\'COFEDRIN FRASCO 30 ML\',\'Precio\':63.71,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 63.705600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015074,
        'LABNOMBRE': 'FARNET',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 56.610000000,
        'PrecioConIva': 63.403200,
        'PRODNombre': 'CILFRIN D GOTAS 100/0.5 MG X 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CILFRIN D GOTAS 100/0.5 MG X 30 ML* a Q63.40/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015074,\'Nombre\':\'CILFRIN D GOTAS 100/0.5 MG X 30 ML\',\'Precio\':63.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 63.403200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010168,
        'LABNOMBRE': 'PHARBEST',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 56.470000000,
        'PrecioConIva': 63.246400,
        'PRODNombre': 'BRONQUILAT JARABE 120ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*BRONQUILAT JARABE 120ML* a Q63.25/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010168,\'Nombre\':\'BRONQUILAT JARABE 120ML \',\'Precio\':63.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 63.246400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002252,
        'LABNOMBRE': 'INFASA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 55.800000000,
        'PrecioConIva': 62.496000,
        'PRODNombre': 'IRS GOTAS FRASCO 20 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*IRS GOTAS FRASCO 20 ML* a Q62.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002252,\'Nombre\':\'IRS GOTAS FRASCO 20 ML \',\'Precio\':62.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 62.496000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1003958,
        'LABNOMBRE': 'PHARMALAT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 55.400000000,
        'PrecioConIva': 62.048000,
        'PRODNombre': 'LEMOVIT PLUS JARABE 120 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*LEMOVIT PLUS JARABE 120 ML* a Q62.05/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1003958,\'Nombre\':\'LEMOVIT PLUS JARABE 120 ML\',\'Precio\':62.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 62.048000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001810,
        'LABNOMBRE': 'GAMMA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 55.130000000,
        'PrecioConIva': 61.745600,
        'PRODNombre': 'CORITOS JARABE FRASCO 120 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CORITOS JARABE FRASCO 120 ML* a Q61.75/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001810,\'Nombre\':\'CORITOS JARABE FRASCO 120 ML \',\'Precio\':61.75,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 61.745600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006728,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 54.820000000,
        'PrecioConIva': 61.398400,
        'PRODNombre': 'KOLD GRIP GOTAS ORALES 30ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP GOTAS ORALES 30ML* a Q61.40/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1006728,\'Nombre\':\'KOLD GRIP GOTAS ORALES 30ML \',\'Precio\':61.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 61.398400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015211,
        'LABNOMBRE': 'WINZZER',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 54.690000000,
        'PrecioConIva': 61.252800,
        'PRODNombre': 'WINGRIP X 20 TABLETAS RECUBIERTAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINGRIP X 20 TABLETAS RECUBIERTAS* a Q61.25/CAJA',
        'txt_Detalle': '{\'Codigo\':1015211,\'Nombre\':\'WINGRIP X 20 TABLETAS RECUBIERTAS\',\'Precio\':61.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 61.252800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009539,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 54.460000000,
        'PrecioConIva': 60.995200,
        'PRODNombre': 'GRIPETIN INFANTIL GRIPE Y TOS * 120 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN INFANTIL GRIPE Y TOS x 120 ML* a Q61.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009539,\'Nombre\':\'GRIPETIN INFANTIL GRIPE Y TOS * 120 ML\',\'Precio\':61.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 60.995200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1008677,
        'LABNOMBRE': 'PHARMADEL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 54.060000000,
        'PrecioConIva': 60.547200,
        'PRODNombre': 'NAPOFEN 275M/300MG * 10 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*NAPOFEN 275M/300MG x 10 TABLETAS* a Q60.55/CAJA',
        'txt_Detalle': '{\'Codigo\':1008677,\'Nombre\':\'NAPOFEN 275M/300MG * 10 TABLETAS \',\'Precio\':60.55,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 60.547200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001121,
        'LABNOMBRE': 'FR MEDIKAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 51.790000000,
        'PrecioConIva': 58.004800,
        'PRODNombre': 'CLORFENAMIN JARABE 120 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CLORFENAMIN JARABE 120 ML* a Q58.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001121,\'Nombre\':\'CLORFENAMIN JARABE 120 ML \',\'Precio\':58.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 58.004800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002775,
        'LABNOMBRE': 'VANQUIMICA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 47.720000000,
        'PrecioConIva': 53.446400,
        'PRODNombre': 'REGULADOR GESTEIRA-PMS 120ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*REGULADOR GESTEIRA-PMS 120ML* a Q53.45/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002775,\'Nombre\':\'REGULADOR GESTEIRA-PMS 120ML \',\'Precio\':53.45,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 53.446400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001569,
        'LABNOMBRE': 'FARKOT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 46.960000000,
        'PrecioConIva': 52.595200,
        'PRODNombre': 'DE-KAFEBRIL * 6 SUPOSITORIOS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DE-KAFEBRIL x 6 SUPOSITORIOS* a Q52.60/CAJA',
        'txt_Detalle': '{\'Codigo\':1001569,\'Nombre\':\'DE-KAFEBRIL * 6 SUPOSITORIOS\',\'Precio\':52.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 52.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016177,
        'LABNOMBRE': 'KRAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 46.960000000,
        'PrecioConIva': 52.595200,
        'PRODNombre': 'RESFRIOLITO INFANTIL X 120ML SAB CEREZA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RESFRIOLITO INFANTIL X 120ML SAB CEREZA* a Q52.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016177,\'Nombre\':\'RESFRIOLITO INFANTIL X 120ML SAB CEREZA\',\'Precio\':52.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 52.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016178,
        'LABNOMBRE': 'KRAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 46.960000000,
        'PrecioConIva': 52.595200,
        'PRODNombre': 'RESFRIOLITO PEDIATRICO X 60ML SAB CEREZA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*RESFRIOLITO PEDIATRICO X 60ML SAB CEREZA* a Q52.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016178,\'Nombre\':\'RESFRIOLITO PEDIATRICO X 60ML SAB CEREZA\',\'Precio\':52.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 52.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016180,
        'LABNOMBRE': 'KRAL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 46.960000000,
        'PrecioConIva': 52.595200,
        'PRODNombre': 'RESFRIOL NF X 20 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RESFRIOL NF X 20 TABLETAS* a Q52.60/CAJA',
        'txt_Detalle': '{\'Codigo\':1016180,\'Nombre\':\'RESFRIOL NF X 20 TABLETAS\',\'Precio\':52.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 52.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004445,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 46.160000000,
        'PrecioConIva': 51.699200,
        'PRODNombre': 'ANTIGRIP GOTAS 30 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIP GOTAS 30 ML* a Q51.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004445,\'Nombre\':\'ANTIGRIP GOTAS 30 ML \',\'Precio\':51.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 51.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014580,
        'LABNOMBRE': 'LANCASCO',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 44.600000000,
        'PrecioConIva': 49.952000,
        'PRODNombre': 'GRIPEOLAN SOLUCION ORAL GOTAS X 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPEOLAN SOLUCION ORAL GOTAS X 30 ML* a Q49.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1014580,\'Nombre\':\'GRIPEOLAN SOLUCION ORAL GOTAS X 30 ML\',\'Precio\':49.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 49.952000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006157,
        'LABNOMBRE': 'MK',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 44.500000000,
        'PrecioConIva': 44.500000,
        'PRODNombre': 'ACETAMINOFEN MK BEBE GOTAS 30ML  - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN MK BEBE GOTAS 30ML* a Q44.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1006157,\'Nombre\':\'ACETAMINOFEN MK BEBE GOTAS 30ML \',\'Precio\':44.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 44.500000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014205,
        'LABNOMBRE': 'MEDIPRODUCTS',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 43.440000000,
        'PrecioConIva': 48.652800,
        'PRODNombre': 'MIO TYLOFEN M 350/400MG X 20 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*MIO TYLOFEN M 350/400MG X 20 TABLETAS* a Q48.65/CAJA',
        'txt_Detalle': '{\'Codigo\':1014205,\'Nombre\':\'MIO TYLOFEN M 350/400MG X 20 TABLETAS\',\'Precio\':48.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 48.652800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011815,
        'LABNOMBRE': 'LANCASCO',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 43.080000000,
        'PrecioConIva': 48.249600,
        'PRODNombre': 'GRIPEOLAN SOLUCION ORAL * 120 ML   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPEOLAN SOLUCION ORAL x 120 ML * a Q48.25/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1011815,\'Nombre\':\'GRIPEOLAN SOLUCION ORAL * 120 ML  \',\'Precio\':48.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 48.249600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1005140,
        'LABNOMBRE': 'LION PHARMA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 42.720000000,
        'PrecioConIva': 47.846400,
        'PRODNombre': 'ACETAWELL JARABE 120 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAWELL JARABE 120 ML* a Q47.85/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1005140,\'Nombre\':\'ACETAWELL JARABE 120 ML \',\'Precio\':47.85,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 47.846400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016111,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 42.680000000,
        'PrecioConIva': 47.801600,
        'PRODNombre': 'PANADOL NIÑOS JARABE 2 + AÑOS X 90ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL NIÑOS JARABE 2 + AÑOS X 90ML* a Q47.80/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016111,\'Nombre\':\'PANADOL NIÑOS JARABE 2 + AÑOS X 90ML\',\'Precio\':47.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 47.801600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011184,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 42.630000000,
        'PrecioConIva': 47.745600,
        'PRODNombre': 'ACERCA * 10 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACERCA x 10 TABLETAS* a Q47.75/CAJA',
        'txt_Detalle': '{\'Codigo\':1011184,\'Nombre\':\'ACERCA * 10 TABLETAS \',\'Precio\':47.75,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 47.745600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004564,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 41.700000000,
        'PrecioConIva': 46.704000,
        'PRODNombre': 'WINASORB JARABE 60 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB JARABE 60 ML* a Q46.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004564,\'Nombre\':\'WINASORB JARABE 60 ML \',\'Precio\':46.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 46.704000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004562,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 40.490000000,
        'PrecioConIva': 45.348800,
        'PRODNombre': 'WINASORB GOTAS 15 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB GOTAS 15 ML* a Q45.35/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004562,\'Nombre\':\'WINASORB GOTAS 15 ML \',\'Precio\':45.35,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 45.348800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006727,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 38.350000000,
        'PrecioConIva': 42.952000,
        'PRODNombre': 'KOLD GRIP JARABE 120ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP JARABE 120ML* a Q42.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1006727,\'Nombre\':\'KOLD GRIP JARABE 120ML \',\'Precio\':42.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 42.952000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1005281,
        'LABNOMBRE': 'LION PHARMA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 36.520000000,
        'PrecioConIva': 40.902400,
        'PRODNombre': 'ACETAWELL GOTAS 30 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAWELL GOTAS 30 ML* a Q40.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1005281,\'Nombre\':\'ACETAWELL GOTAS 30 ML \',\'Precio\':40.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 40.902400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011405,
        'LABNOMBRE': 'SUED',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 36.340000000,
        'PrecioConIva': 40.700800,
        'PRODNombre': 'SINEDOL UVA GOTAS DE 15 ML    - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*SINEDOL UVA GOTAS DE 15 ML  * a Q40.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1011405,\'Nombre\':\'SINEDOL UVA GOTAS DE 15 ML   \',\'Precio\':40.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 40.700800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001927,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 35.760000000,
        'PrecioConIva': 40.051200,
        'PRODNombre': 'PANADOL JBE INFANTIL 2-6 AÑOS 60 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL JBE INFANTIL 2-6 AÑOS 60 ML* a Q40.05/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001927,\'Nombre\':\'PANADOL JBE INFANTIL 2-6 AÑOS 60 ML\',\'Precio\':40.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 40.051200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004446,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 35.540000000,
        'PrecioConIva': 39.804800,
        'PRODNombre': 'ANTIGRIP JARABE 120 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIP JARABE 120 ML* a Q39.80/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004446,\'Nombre\':\'ANTIGRIP JARABE 120 ML \',\'Precio\':39.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 39.804800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013569,
        'LABNOMBRE': 'FARNET',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 35.490000000,
        'PrecioConIva': 39.748800,
        'PRODNombre': 'CILFRIN D X 12 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CILFRIN D X 12 TABLETAS* a Q39.75/CAJA',
        'txt_Detalle': '{\'Codigo\':1013569,\'Nombre\':\'CILFRIN D X 12 TABLETAS\',\'Precio\':39.75,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 39.748800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011404,
        'LABNOMBRE': 'SUED',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 35.220000000,
        'PrecioConIva': 39.446400,
        'PRODNombre': 'SINEDOL UVA JARABE DE 60 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*SINEDOL UVA JARABE DE 60 ML* a Q39.45/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1011404,\'Nombre\':\'SINEDOL UVA JARABE DE 60 ML\',\'Precio\':39.45,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 39.446400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006630,
        'LABNOMBRE': 'PHARMALAT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 33.660000000,
        'PrecioConIva': 37.699200,
        'PRODNombre': 'LEMOVIT PLUS X 10 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*LEMOVIT PLUS X 10 TABLETAS* a Q37.70/CAJA',
        'txt_Detalle': '{\'Codigo\':1006630,\'Nombre\':\'LEMOVIT PLUS X 10 TABLETAS\',\'Precio\':37.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 37.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1008651,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 32.680000000,
        'PrecioConIva': 36.601600,
        'PRODNombre': 'PANADOL GOTAS 15 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL GOTAS 15 ML* a Q36.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1008651,\'Nombre\':\'PANADOL GOTAS 15 ML \',\'Precio\':36.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 36.601600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002489,
        'LABNOMBRE': 'JOHNSON JOHNSON',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 31.830000000,
        'PrecioConIva': 35.649600,
        'PRODNombre': 'TYLENOL 500 MG * 20 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLENOL 500 MG x 20 TAB* a Q35.65/CAJA',
        'txt_Detalle': '{\'Codigo\':1002489,\'Nombre\':\'TYLENOL 500 MG * 20 TAB \',\'Precio\':35.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 35.649600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016456,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.220000000,
        'PrecioConIva': 33.846400,
        'PRODNombre': 'TABCIN EF DIA POWERGEL X 12 - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF DIA POWERGEL X 12* a Q33.85/CAJA',
        'txt_Detalle': '{\'Codigo\':1016456,\'Nombre\':\'TABCIN EF DIA POWERGEL X 12\',\'Precio\':33.85,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.846400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014493,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.180000000,
        'PrecioConIva': 33.801600,
        'PRODNombre': 'TABCIN FLEMA Y CONGESTION X 12 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN FLEMA Y CONGESTION X 12 GELCAPS* a Q33.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1014493,\'Nombre\':\'TABCIN FLEMA Y CONGESTION X 12 GELCAPS\',\'Precio\':33.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.801600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016457,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.180000000,
        'PrecioConIva': 33.801600,
        'PRODNombre': 'TABCIN EF GRIPE Y TOS POWERGEL X 12 - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF GRIPE Y TOS POWERGEL X 12* a Q33.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1016457,\'Nombre\':\'TABCIN EF GRIPE Y TOS POWERGEL X 12\',\'Precio\':33.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.801600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016458,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.180000000,
        'PrecioConIva': 33.801600,
        'PRODNombre': 'TABCIN EF NOCHE POWERGEL X 12 - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF NOCHE POWERGEL X 12* a Q33.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1016458,\'Nombre\':\'TABCIN EF NOCHE POWERGEL X 12\',\'Precio\':33.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.801600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011592,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.000000000,
        'PrecioConIva': 33.600000,
        'PRODNombre': 'SUDAGRIP ALERGIAS * 10 TABLETAS   - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP ALERGIAS x 10 TABLETAS * a Q33.60/CAJA',
        'txt_Detalle': '{\'Codigo\':1011592,\'Nombre\':\'SUDAGRIP ALERGIAS * 10 TABLETAS  \',\'Precio\':33.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011593,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 30.000000000,
        'PrecioConIva': 33.600000,
        'PRODNombre': 'SUDAGRIP NIÑOS JARABE * 120 ML   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP NIÑOS JARABE x 120 ML * a Q33.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1011593,\'Nombre\':\'SUDAGRIP NIÑOS JARABE * 120 ML  \',\'Precio\':33.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 33.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011836,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 30.000000000,
        'PrecioConIva': 30.000000,
        'PRODNombre': 'ACETAMINOFEN / METOCARBAMOL * 30 TABLETAS **CAPLIN** - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN / METOCARBAMOL x 30 TABLETAS xxCAPLINxx* a Q30.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1011836,\'Nombre\':\'ACETAMINOFEN / METOCARBAMOL * 30 TABLETAS **CAPLIN**\',\'Precio\':30.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 30.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016607,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 28.660000000,
        'PrecioConIva': 32.099200,
        'PRODNombre': 'GRIPETIN DIA X 12 CAPS GELATINA BLANDA - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN DIA X 12 CAPS GELATINA BLANDA* a Q32.10/CAJA',
        'txt_Detalle': '{\'Codigo\':1016607,\'Nombre\':\'GRIPETIN DIA X 12 CAPS GELATINA BLANDA\',\'Precio\':32.10,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 32.099200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016609,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 28.660000000,
        'PrecioConIva': 32.099200,
        'PRODNombre': 'GRIPETIN NOCHE X 12 CAPS GELATINA BLANDA - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN NOCHE X 12 CAPS GELATINA BLANDA* a Q32.10/CAJA',
        'txt_Detalle': '{\'Codigo\':1016609,\'Nombre\':\'GRIPETIN NOCHE X 12 CAPS GELATINA BLANDA\',\'Precio\':32.10,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 32.099200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016971,
        'LABNOMBRE': 'PIERSAN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 28.210000000,
        'PrecioConIva': 31.595200,
        'PRODNombre': 'ARCOPULMIN SOL ORAL GOTAS X 30 ML - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ARCOPULMIN SOL ORAL GOTAS X 30 ML* a Q31.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016971,\'Nombre\':\'ARCOPULMIN SOL ORAL GOTAS X 30 ML\',\'Precio\':31.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 31.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1005255,
        'LABNOMBRE': 'CHEMINTER',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 27.090000000,
        'PrecioConIva': 30.340800,
        'PRODNombre': 'MIOREL COMPUESTO * BLISTER 10 TAB  - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*MIOREL COMPUESTO x BLISTER 10 TAB* a Q30.34/BLISTER',
        'txt_Detalle': '{\'Codigo\':1005255,\'Nombre\':\'MIOREL COMPUESTO * BLISTER 10 TAB \',\'Precio\':30.34,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 30.340800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016151,
        'LABNOMBRE': 'GENOMMA LAB',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 26.830000000,
        'PrecioConIva': 30.049600,
        'PRODNombre': 'NEXT XTRA FORTE DIA X 10 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEXT XTRA FORTE DIA X 10 GELCAPS* a Q30.05/CAJA',
        'txt_Detalle': '{\'Codigo\':1016151,\'Nombre\':\'NEXT XTRA FORTE DIA X 10 GELCAPS\',\'Precio\':30.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 30.049600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016153,
        'LABNOMBRE': 'GENOMMA LAB',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 26.830000000,
        'PrecioConIva': 30.049600,
        'PRODNombre': 'NEXT XTRA FORTE NOCHE X 10 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEXT XTRA FORTE NOCHE X 10 GELCAPS* a Q30.05/CAJA',
        'txt_Detalle': '{\'Codigo\':1016153,\'Nombre\':\'NEXT XTRA FORTE NOCHE X 10 GELCAPS\',\'Precio\':30.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 30.049600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015157,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 26.790000000,
        'PrecioConIva': 30.004800,
        'PRODNombre': 'ACETEFF 500MG X 20 GEL CAP - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETEFF 500MG X 20 GEL CAP* a Q30.00/CAJA',
        'txt_Detalle': '{\'Codigo\':1015157,\'Nombre\':\'ACETEFF 500MG X 20 GEL CAP\',\'Precio\':30.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 30.004800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007543,
        'LABNOMBRE': 'ROBERPHARM',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 26.700000000,
        'PrecioConIva': 29.904000,
        'PRODNombre': 'GRIPECAPS * 10 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPECAPS x 10 TABLETAS* a Q29.90/CAJA',
        'txt_Detalle': '{\'Codigo\':1007543,\'Nombre\':\'GRIPECAPS * 10 TABLETAS \',\'Precio\':29.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 29.904000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007916,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 26.700000000,
        'PrecioConIva': 29.904000,
        'PRODNombre': 'VIROGRIP GRIPE Y TOS ADULTOS Y NIÑOS JARABE 120 ML   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP GRIPE Y TOS ADULTOS Y NIÑOS JARABE 120 ML * a Q29.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007916,\'Nombre\':\'VIROGRIP GRIPE Y TOS ADULTOS Y NIÑOS JARABE 120 ML  \',\'Precio\':29.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 29.904000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1003410,
        'LABNOMBRE': 'MK',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 26.500000000,
        'PrecioConIva': 26.500000,
        'PRODNombre': 'ACETAMINOFEN MK JBE 60 ML  - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN MK JBE 60 ML* a Q26.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1003410,\'Nombre\':\'ACETAMINOFEN MK JBE 60 ML \',\'Precio\':26.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 26.500000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016409,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 26.250000000,
        'PrecioConIva': 26.250000,
        'PRODNombre': 'ACETAMINOFEN+CLORFENIRAMINA GOTAS X 30ML - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN+CLORFENIRAMINA GOTAS X 30ML* a Q26.25/CAJA',
        'txt_Detalle': '{\'Codigo\':1016409,\'Nombre\':\'ACETAMINOFEN+CLORFENIRAMINA GOTAS X 30ML\',\'Precio\':26.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 26.250000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004447,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 25.800000000,
        'PrecioConIva': 28.896000,
        'PRODNombre': 'ANTIGRIP JARABE 60 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIP JARABE 60 ML* a Q28.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004447,\'Nombre\':\'ANTIGRIP JARABE 60 ML \',\'Precio\':28.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 28.896000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011591,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 25.710000000,
        'PrecioConIva': 28.795200,
        'PRODNombre': 'SUDAGRIP TOS JARABE * 120 ML   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP TOS JARABE x 120 ML * a Q28.80/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1011591,\'Nombre\':\'SUDAGRIP TOS JARABE * 120 ML  \',\'Precio\':28.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 28.795200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001928,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 24.460000000,
        'PrecioConIva': 27.395200,
        'PRODNombre': 'PANADOL MUJER * 16 CAPLETS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL MUJER x 16 CAPLETS* a Q27.40/CAJA',
        'txt_Detalle': '{\'Codigo\':1001928,\'Nombre\':\'PANADOL MUJER * 16 CAPLETS \',\'Precio\':27.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 27.395200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010189,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 24.200000000,
        'PrecioConIva': 27.104000,
        'PRODNombre': 'PANADOL ULTRA * 16 CAPLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL ULTRA x 16 CAPLETAS* a Q27.10/CAJA',
        'txt_Detalle': '{\'Codigo\':1010189,\'Nombre\':\'PANADOL ULTRA * 16 CAPLETAS \',\'Precio\':27.10,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 27.104000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1003152,
        'LABNOMBRE': 'MEDIPRODUCTS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 23.660000000,
        'PrecioConIva': 26.499200,
        'PRODNombre': 'TYLOFEN GOTAS 20 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLOFEN GOTAS 20 ML* a Q26.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1003152,\'Nombre\':\'TYLOFEN GOTAS 20 ML \',\'Precio\':26.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 26.499200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1008610,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 21.650000000,
        'PrecioConIva': 24.248000,
        'PRODNombre': 'ANTIGRIP * 12 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIP x 12 TABLETAS* a Q24.25/CAJA',
        'txt_Detalle': '{\'Codigo\':1008610,\'Nombre\':\'ANTIGRIP * 12 TABLETAS \',\'Precio\':24.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 24.248000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012346,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 21.562500000,
        'PrecioConIva': 24.150000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS DIA * 12  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS DIA x 12* a Q24.15/CAJA',
        'txt_Detalle': '{\'Codigo\':1012346,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS DIA * 12 \',\'Precio\':24.15,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 32.200000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1012347,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 21.562500000,
        'PrecioConIva': 24.150000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS * 12  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS x 12* a Q24.15/CAJA',
        'txt_Detalle': '{\'Codigo\':1012347,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS * 12 \',\'Precio\':24.15,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 32.200000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1012349,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 21.562500000,
        'PrecioConIva': 24.150000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS NOCHE * 12   - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS NOCHE x 12 * a Q24.15/CAJA',
        'txt_Detalle': '{\'Codigo\':1012349,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS NOCHE * 12  \',\'Precio\':24.15,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 32.200000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1001925,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 20.800000000,
        'PrecioConIva': 23.296000,
        'PRODNombre': 'PANADOL INFANTIL * 20 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL INFANTIL x 20 TAB* a Q23.30/CAJA',
        'txt_Detalle': '{\'Codigo\':1001925,\'Nombre\':\'PANADOL INFANTIL * 20 TAB \',\'Precio\':23.30,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 23.296000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013828,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 20.450000000,
        'PrecioConIva': 22.904000,
        'PRODNombre': 'KOLD GRIP DIA X 12 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP DIA X 12 GELCAPS* a Q22.90/CAJA',
        'txt_Detalle': '{\'Codigo\':1013828,\'Nombre\':\'KOLD GRIP DIA X 12 GELCAPS\',\'Precio\':22.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 22.904000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013831,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 20.450000000,
        'PrecioConIva': 22.904000,
        'PRODNombre': 'KOLD GRIP NOCHE X 12 GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP NOCHE X 12 GELCAPS* a Q22.90/CAJA',
        'txt_Detalle': '{\'Codigo\':1013831,\'Nombre\':\'KOLD GRIP NOCHE X 12 GELCAPS\',\'Precio\':22.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 22.904000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004628,
        'LABNOMBRE': 'LABORATORIO VIDES',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 20.360000000,
        'PrecioConIva': 22.803200,
        'PRODNombre': 'BEBETINA JARABE 60 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*BEBETINA JARABE 60 ML* a Q22.80/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1004628,\'Nombre\':\'BEBETINA JARABE 60 ML \',\'Precio\':22.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 22.803200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007611,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 19.690000000,
        'PrecioConIva': 22.052800,
        'PRODNombre': 'VIROGRIP DOBLE TERAPIA CAJA 1 AM AMP MAS 2GELCAPS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP DOBLE TERAPIA CAJA 1 AM AMP MAS 2GELCAPS* a Q22.05/CAJA',
        'txt_Detalle': '{\'Codigo\':1007611,\'Nombre\':\'VIROGRIP DOBLE TERAPIA CAJA 1 AM AMP MAS 2GELCAPS\',\'Precio\':22.05,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 22.052800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007753,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 19.600000000,
        'PrecioConIva': 21.952000,
        'PRODNombre': 'ANTIGRIPITO JARABE 60 ML  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIPITO JARABE 60 ML* a Q21.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007753,\'Nombre\':\'ANTIGRIPITO JARABE 60 ML \',\'Precio\':21.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 21.952000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014404,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 19.550000000,
        'PrecioConIva': 21.896000,
        'PRODNombre': 'NEUMONIL FORTE X 12 TAB + 2 TAB GRATIS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEUMONIL FORTE X 12 TAB + 2 TAB GRATIS* a Q21.90/CAJA',
        'txt_Detalle': '{\'Codigo\':1014404,\'Nombre\':\'NEUMONIL FORTE X 12 TAB + 2 TAB GRATIS\',\'Precio\':21.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 21.896000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000911,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 19.060000000,
        'PrecioConIva': 21.347200,
        'PRODNombre': 'TABCIN NIÑOS * 12 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN NIÑOS x 12 TAB* a Q21.35/CAJA',
        'txt_Detalle': '{\'Codigo\':1000911,\'Nombre\':\'TABCIN NIÑOS * 12 TAB \',\'Precio\':21.35,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 21.347200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002822,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 18.300000000,
        'PrecioConIva': 20.496000,
        'PRODNombre': 'NEUMONIL FORTE * 12 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEUMONIL FORTE x 12 TAB* a Q20.50/CAJA',
        'txt_Detalle': '{\'Codigo\':1002822,\'Nombre\':\'NEUMONIL FORTE * 12 TAB \',\'Precio\':20.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 20.496000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015168,
        'LABNOMBRE': 'MALTES',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 17.810000000,
        'PrecioConIva': 19.947200,
        'PRODNombre': 'GRIPITOS NOCHE X 10 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPITOS NOCHE X 10 TABLETAS* a Q19.95/CAJA',
        'txt_Detalle': '{\'Codigo\':1015168,\'Nombre\':\'GRIPITOS NOCHE X 10 TABLETAS\',\'Precio\':19.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 19.947200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015169,
        'LABNOMBRE': 'MALTES',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 17.810000000,
        'PrecioConIva': 19.947200,
        'PRODNombre': 'GRIPITOS DIA X 10 TABLETAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPITOS DIA X 10 TABLETAS* a Q19.95/CAJA',
        'txt_Detalle': '{\'Codigo\':1015169,\'Nombre\':\'GRIPITOS DIA X 10 TABLETAS\',\'Precio\':19.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 19.947200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1003151,
        'LABNOMBRE': 'MEDIPRODUCTS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 17.770000000,
        'PrecioConIva': 19.902400,
        'PRODNombre': 'TYLOFEN 120 ML ACETAMINOFEN  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TYLOFEN 120 ML ACETAMINOFEN* a Q19.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1003151,\'Nombre\':\'TYLOFEN 120 ML ACETAMINOFEN \',\'Precio\':19.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 19.902400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011826,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 17.590000000,
        'PrecioConIva': 19.700800,
        'PRODNombre': 'IBUCET 325MG/200MG * 10 TABLETAS **CAPLIN** - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*IBUCET 325MG/200MG x 10 TABLETAS xxCAPLINxx* a Q19.70/CAJA',
        'txt_Detalle': '{\'Codigo\':1011826,\'Nombre\':\'IBUCET 325MG/200MG * 10 TABLETAS **CAPLIN**\',\'Precio\':19.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 19.700800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012721,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 16.520000000,
        'PrecioConIva': 18.502400,
        'PRODNombre': 'TABCIN NIÑOS * 12 TABLETAS MASTICABLES - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN NIÑOS x 12 TABLETAS MASTICABLES* a Q18.50/CAJA',
        'txt_Detalle': '{\'Codigo\':1012721,\'Nombre\':\'TABCIN NIÑOS * 12 TABLETAS MASTICABLES\',\'Precio\':18.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 18.502400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1011594,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 15.940000000,
        'PrecioConIva': 17.852800,
        'PRODNombre': 'SUDAGRIP ANTIGRIPAL * 6 SOBRES   - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP ANTIGRIPAL x 6 SOBRES * a Q17.85/CAJA',
        'txt_Detalle': '{\'Codigo\':1011594,\'Nombre\':\'SUDAGRIP ANTIGRIPAL * 6 SOBRES  \',\'Precio\':17.85,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 17.852800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009594,
        'LABNOMBRE': 'PROCTER \u0026AMP; GAMBLE',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 15.630000000,
        'PrecioConIva': 17.505600,
        'PRODNombre': 'VITAPYRENA * 5 SOBRES 5 GR. - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*VITAPYRENA x 5 SOBRES 5 GR.* a Q17.51/CAJA',
        'txt_Detalle': '{\'Codigo\':1009594,\'Nombre\':\'VITAPYRENA * 5 SOBRES 5 GR.\',\'Precio\':17.51,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 17.505600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010190,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 15.630000000,
        'PrecioConIva': 17.505600,
        'PRODNombre': 'PANADOL EXTRA FUERTE * 16 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL EXTRA FUERTE x 16 TABLETAS* a Q17.51/CAJA',
        'txt_Detalle': '{\'Codigo\':1010190,\'Nombre\':\'PANADOL EXTRA FUERTE * 16 TABLETAS \',\'Precio\':17.51,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 17.505600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010417,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 15.040000000,
        'PrecioConIva': 16.844800,
        'PRODNombre': 'SUDAGRIP ANTIGRIPAL * 12 CAPSULAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP ANTIGRIPAL x 12 CAPSULAS* a Q16.84/CAJA',
        'txt_Detalle': '{\'Codigo\':1010417,\'Nombre\':\'SUDAGRIP ANTIGRIPAL * 12 CAPSULAS \',\'Precio\':16.84,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 16.844800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1008381,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 14.380000000,
        'PrecioConIva': 16.105600,
        'PRODNombre': 'KOLD GRIP * 12 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP x 12 TABLETAS* a Q16.11/CAJA',
        'txt_Detalle': '{\'Codigo\':1008381,\'Nombre\':\'KOLD GRIP * 12 TABLETAS \',\'Precio\':16.11,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 16.105600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1003409,
        'LABNOMBRE': 'MK',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 14.350000000,
        'PrecioConIva': 14.350000,
        'PRODNombre': 'ACETAMINOFEN MK * 20 TAB  - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN MK x 20 TAB* a Q14.35/CAJA',
        'txt_Detalle': '{\'Codigo\':1003409,\'Nombre\':\'ACETAMINOFEN MK * 20 TAB \',\'Precio\':14.35,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 14.350000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004561,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 14.150000000,
        'PrecioConIva': 15.848000,
        'PRODNombre': 'WINASORB 500 MG * 12 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB 500 MG x 12 TAB* a Q15.85/CAJA',
        'txt_Detalle': '{\'Codigo\':1004561,\'Nombre\':\'WINASORB 500 MG * 12 TAB \',\'Precio\':15.85,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 15.848000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012526,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 13.950000000,
        'PrecioConIva': 13.950000,
        'PRODNombre': 'ACETAMINOFEN 300MG * 10 SUPOSITORIOS **CAPLIN** - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN 300MG x 10 SUPOSITORIOS xxCAPLINxx* a Q13.95/CAJA',
        'txt_Detalle': '{\'Codigo\':1012526,\'Nombre\':\'ACETAMINOFEN 300MG * 10 SUPOSITORIOS **CAPLIN**\',\'Precio\':13.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 13.950000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1004563,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 13.880000000,
        'PrecioConIva': 15.545600,
        'PRODNombre': 'WINASORB INFANTIL 100 MG * 12 TAB MASTICABLES  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB INFANTIL 100 MG x 12 TAB MASTICABLES* a Q15.55/CAJA',
        'txt_Detalle': '{\'Codigo\':1004563,\'Nombre\':\'WINASORB INFANTIL 100 MG * 12 TAB MASTICABLES \',\'Precio\':15.55,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 15.545600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016524,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 13.400000000,
        'PrecioConIva': 13.400000,
        'PRODNombre': 'ACETAMINOFEN BAYER 500MG X 20 TABLETAS - CAJA',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN BAYER 500MG X 20 TABLETAS* a Q13.40/CAJA',
        'txt_Detalle': '{\'Codigo\':1016524,\'Nombre\':\'ACETAMINOFEN BAYER 500MG X 20 TABLETAS\',\'Precio\':13.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 13.400000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002145,
        'LABNOMBRE': 'HELTER - BRIJAN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 12.190000000,
        'PrecioConIva': 13.652800,
        'PRODNombre': 'ACEPTAL 500 MG * 16 TAB  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACEPTAL 500 MG x 16 TAB* a Q13.65/CAJA',
        'txt_Detalle': '{\'Codigo\':1002145,\'Nombre\':\'ACEPTAL 500 MG * 16 TAB \',\'Precio\':13.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 13.652800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000124,
        'LABNOMBRE': 'INFASA',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 11.430000000,
        'PrecioConIva': 12.801600,
        'PRODNombre': 'IRS * SOBRE 4 TAB  - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*IRS x SOBRE 4 TAB* a Q12.80/BLISTER',
        'txt_Detalle': '{\'Codigo\':1000124,\'Nombre\':\'IRS * SOBRE 4 TAB \',\'Precio\':12.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 12.801600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009035,
        'LABNOMBRE': 'PHARMALAT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 10.980000000,
        'PrecioConIva': 12.297600,
        'PRODNombre': 'LEMOVIT PLUS CAJITA DE 4 TAB - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*LEMOVIT PLUS CAJITA DE 4 TAB* a Q12.30/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009035,\'Nombre\':\'LEMOVIT PLUS CAJITA DE 4 TAB\',\'Precio\':12.30,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 12.297600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007266,
        'LABNOMBRE': 'LABORATORIO VIDES',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 10.890000000,
        'PrecioConIva': 12.196800,
        'PRODNombre': 'BEBETINA * 20 TABLETAS  - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*BEBETINA x 20 TABLETAS* a Q12.20/CAJA',
        'txt_Detalle': '{\'Codigo\':1007266,\'Nombre\':\'BEBETINA * 20 TABLETAS \',\'Precio\':12.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 12.196800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015477,
        'LABNOMBRE': 'PIERSAN',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 10.800000000,
        'PrecioConIva': 12.096000,
        'PRODNombre': 'ARCOPULMIN X 10 CAPLETS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ARCOPULMIN X 10 CAPLETS* a Q12.10/CAJA',
        'txt_Detalle': '{\'Codigo\':1015477,\'Nombre\':\'ARCOPULMIN X 10 CAPLETS\',\'Precio\':12.10,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 12.096000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015944,
        'LABNOMBRE': 'QUALIPHARM',
        'PRPUMDId': 'CAJA',
        'PRPPrecio': 10.540000000,
        'PrecioConIva': 11.804800,
        'PRODNombre': 'SINTOMAGRIP X 10 CAPLETS RECUBIERTAS - CAJA',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*SINTOMAGRIP X 10 CAPLETS RECUBIERTAS* a Q11.80/CAJA',
        'txt_Detalle': '{\'Codigo\':1015944,\'Nombre\':\'SINTOMAGRIP X 10 CAPLETS RECUBIERTAS\',\'Precio\':11.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 11.804800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009287,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 10.300000000,
        'PrecioConIva': 10.300000,
        'PRODNombre': 'ACETAMINOFEN 125MG SUSPENSION * 120 ML **CAPLIN POINT** - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN 125MG SUSPENSION x 120 ML xxCAPLIN POINTxx* a Q10.30/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009287,\'Nombre\':\'ACETAMINOFEN 125MG SUSPENSION * 120 ML **CAPLIN POINT**\',\'Precio\':10.30,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 10.300000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009810,
        'LABNOMBRE': 'GENERIX LABORATORIOS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 8.920000000,
        'PrecioConIva': 9.990400,
        'PRODNombre': 'RINOFLUX F ANTIGRIPAL SOBRE * 4 TABLETAS  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RINOFLUX F ANTIGRIPAL SOBRE x 4 TABLETAS* a Q9.99/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009810,\'Nombre\':\'RINOFLUX F ANTIGRIPAL SOBRE * 4 TABLETAS \',\'Precio\':9.99,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 9.990400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016656,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 7.680000000,
        'PrecioConIva': 8.601600,
        'PRODNombre': 'GRIPETIN DIA X 4 CAPSULAS GEL - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN DIA X 4 CAPSULAS GEL* a Q8.60/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016656,\'Nombre\':\'GRIPETIN DIA X 4 CAPSULAS GEL\',\'Precio\':8.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 8.601600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016658,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 7.680000000,
        'PrecioConIva': 8.601600,
        'PRODNombre': 'GRIPETIN NOCHE X 4 CAPSULAS GEL - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN NOCHE X 4 CAPSULAS GEL* a Q8.60/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016658,\'Nombre\':\'GRIPETIN NOCHE X 4 CAPSULAS GEL\',\'Precio\':8.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 8.601600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006729,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 5.580000000,
        'PrecioConIva': 6.249600,
        'PRODNombre': 'KOLD GRIP * SOBRE 4 TABLETAS  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP x SOBRE 4 TABLETAS* a Q6.25/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1006729,\'Nombre\':\'KOLD GRIP * SOBRE 4 TABLETAS \',\'Precio\':6.25,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 6.249600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000152,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 5.530000000,
        'PrecioConIva': 6.193600,
        'PRODNombre': 'CETAMIN CC * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*CETAMIN CC x UNIDAD* a Q6.19/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000152,\'Nombre\':\'CETAMIN CC * UNIDAD \',\'Precio\':6.19,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 6.193600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000286,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.910000000,
        'PrecioConIva': 5.499200,
        'PRODNombre': 'ANTIGRIP * SOBRE 4 TAB  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIP x SOBRE 4 TAB* a Q5.50/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000286,\'Nombre\':\'ANTIGRIP * SOBRE 4 TAB \',\'Precio\':5.50,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 5.499200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010416,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.530000000,
        'PrecioConIva': 5.073600,
        'PRODNombre': 'SUDAGRIP ANTIGRIPAL * SOBRE 4 CAPSULAS   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP ANTIGRIPAL x SOBRE 4 CAPSULAS * a Q5.07/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010416,\'Nombre\':\'SUDAGRIP ANTIGRIPAL * SOBRE 4 CAPSULAS  \',\'Precio\':5.07,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 5.073600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001755,
        'LABNOMBRE': 'ROBERPHARM',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.350000000,
        'PrecioConIva': 4.872000,
        'PRODNombre': 'DOLORIDOL * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLORIDOL x UNIDAD* a Q4.87/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001755,\'Nombre\':\'DOLORIDOL * UNIDAD \',\'Precio\':4.87,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.872000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014492,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 4.150000000,
        'PrecioConIva': 4.648000,
        'PRODNombre': 'TABCIN FLEMA Y CONGESTION X SOBRE - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 1,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN FLEMA Y CONGESTION X SOBRE* a Q4.65/BLISTER',
        'txt_Detalle': '{\'Codigo\':1014492,\'Nombre\':\'TABCIN FLEMA Y CONGESTION X SOBRE\',\'Precio\':4.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.648000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016453,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.150000000,
        'PrecioConIva': 4.648000,
        'PRODNombre': 'TABCIN EF DIA POWERGEL BLISTER X 2 CAP - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF DIA POWERGEL BLISTER X 2 CAP* a Q4.65/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016453,\'Nombre\':\'TABCIN EF DIA POWERGEL BLISTER X 2 CAP\',\'Precio\':4.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.648000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016454,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.150000000,
        'PrecioConIva': 4.648000,
        'PRODNombre': 'TABCIN EF GRIPE Y TOS POWERGEL BLISTER X 2 CAP - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF GRIPE Y TOS POWERGEL BLISTER X 2 CAP* a Q4.65/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016454,\'Nombre\':\'TABCIN EF GRIPE Y TOS POWERGEL BLISTER X 2 CAP\',\'Precio\':4.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.648000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016455,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.150000000,
        'PrecioConIva': 4.648000,
        'PRODNombre': 'TABCIN EF NOCHE POWERGEL BLISTER X 2 CAP - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EF NOCHE POWERGEL BLISTER X 2 CAP* a Q4.65/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016455,\'Nombre\':\'TABCIN EF NOCHE POWERGEL BLISTER X 2 CAP\',\'Precio\':4.65,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.648000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000086,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 4.110000000,
        'PrecioConIva': 4.603200,
        'PRODNombre': 'GRIPETIN MULTISINTOMAS * UNIDAD - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN MULTISINTOMAS x UNIDAD* a Q4.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000086,\'Nombre\':\'GRIPETIN MULTISINTOMAS * UNIDAD\',\'Precio\':4.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.603200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009926,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.750000000,
        'PrecioConIva': 4.200000,
        'PRODNombre': 'GRIPETIN GRIPE Y TOS * SOBRE DE 2 TAB - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN GRIPE Y TOS x SOBRE DE 2 TAB* a Q4.20/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009926,\'Nombre\':\'GRIPETIN GRIPE Y TOS * SOBRE DE 2 TAB\',\'Precio\':4.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.200000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015645,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.570000000,
        'PrecioConIva': 3.998400,
        'PRODNombre': 'ACETEFF FORTE 1000MG SOBRE X TAB EFERVES - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETEFF FORTE 1000MG SOBRE X TAB EFERVES* a Q4.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015645,\'Nombre\':\'ACETEFF FORTE 1000MG SOBRE X TAB EFERVES\',\'Precio\':4.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.998400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1006026,
        'LABNOMBRE': 'TERAMED',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.530000000,
        'PrecioConIva': 3.953600,
        'PRODNombre': 'NORCETIN FORTE * BLISTER 2 TABLETAS  - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NORCETIN FORTE x BLISTER 2 TABLETAS* a Q3.95/BLISTER',
        'txt_Detalle': '{\'Codigo\':1006026,\'Nombre\':\'NORCETIN FORTE * BLISTER 2 TABLETAS \',\'Precio\':3.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.953600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007414,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.530000000,
        'PrecioConIva': 3.953600,
        'PRODNombre': 'VIROGRIP NF PM GEL X 1 SOBRE  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP NF PM GEL X 1 SOBRE* a Q3.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007414,\'Nombre\':\'VIROGRIP NF PM GEL X 1 SOBRE \',\'Precio\':3.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.953600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007415,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.530000000,
        'PrecioConIva': 3.953600,
        'PRODNombre': 'VIROGRIP NF AM GEL * 1 SOBRE  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP NF AM GEL x 1 SOBRE* a Q3.95/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007415,\'Nombre\':\'VIROGRIP NF AM GEL * 1 SOBRE \',\'Precio\':3.95,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.953600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007602,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.480000000,
        'PrecioConIva': 3.897600,
        'PRODNombre': 'VIROGRIP NF LIMON POLVO AM * SOBRE  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP NF LIMON POLVO AM x SOBRE* a Q3.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007602,\'Nombre\':\'VIROGRIP NF LIMON POLVO AM * SOBRE \',\'Precio\':3.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.897600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1007621,
        'LABNOMBRE': 'VIJOSA',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.480000000,
        'PrecioConIva': 3.897600,
        'PRODNombre': 'VIROGRIP NF LIMON POLVO PM * SOBRE  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROGRIP NF LIMON POLVO PM x SOBRE* a Q3.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1007621,\'Nombre\':\'VIROGRIP NF LIMON POLVO PM * SOBRE \',\'Precio\':3.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.897600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000287,
        'LABNOMBRE': 'ROLAND LOUIS',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.450000000,
        'PrecioConIva': 3.864000,
        'PRODNombre': 'ANTIGRIPITO * BLISTER 4 TAB  - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIPITO x BLISTER 4 TAB* a Q3.86/BLISTER',
        'txt_Detalle': '{\'Codigo\':1000287,\'Nombre\':\'ANTIGRIPITO * BLISTER 4 TAB \',\'Precio\':3.86,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.864000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016589,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.210000000,
        'PrecioConIva': 3.595200,
        'PRODNombre': 'PANADOL GRIPE MULTI SINTOMAS BLI X2 TAB - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL GRIPE MULTI SINTOMAS BLI X2 TAB* a Q3.60/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016589,\'Nombre\':\'PANADOL GRIPE MULTI SINTOMAS BLI X2 TAB\',\'Precio\':3.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.595200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000160,
        'LABNOMBRE': 'EUROFARMA LAPRIN',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 3.080000000,
        'PrecioConIva': 3.449600,
        'PRODNombre': 'NEUMONIL FORTE * SOBRE 2 TAB  - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEUMONIL FORTE x SOBRE 2 TAB* a Q3.45/BLISTER',
        'txt_Detalle': '{\'Codigo\':1000160,\'Nombre\':\'NEUMONIL FORTE * SOBRE 2 TAB \',\'Precio\':3.45,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.449600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009286,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 3.000000000,
        'PrecioConIva': 3.000000,
        'PRODNombre': 'ANTIGRIPAL CAPLETAS * TIRAS 4 CAPLETAS **CAPLIN POINT** - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ANTIGRIPAL CAPLETAS x TIRAS 4 CAPLETAS xxCAPLIN POINTxx* a Q3.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009286,\'Nombre\':\'ANTIGRIPAL CAPLETAS * TIRAS 4 CAPLETAS **CAPLIN POINT**\',\'Precio\':3.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012345,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.925000000,
        'PrecioConIva': 3.276000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS DIA * SOBRE - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS DIA x SOBRE* a Q3.28/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012345,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS DIA * SOBRE\',\'Precio\':3.28,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.368000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1012348,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.925000000,
        'PrecioConIva': 3.276000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS * SOBRE - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS x SOBRE* a Q3.28/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012348,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS GRIPE Y TOS * SOBRE\',\'Precio\':3.28,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.368000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1012452,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.925000000,
        'PrecioConIva': 3.276000,
        'PRODNombre': 'TABCIN EXTRAFUERTE LIQUIGELS NOCHE * SOBRE - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN EXTRAFUERTE LIQUIGELS NOCHE x SOBRE* a Q3.28/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012452,\'Nombre\':\'TABCIN EXTRAFUERTE LIQUIGELS NOCHE * SOBRE\',\'Precio\':3.28,\'Cantidad\':',
        'Descuento': '25',
        'PRPPrecioUnitarioConIvaSinPromocion': 4.368000000,
        'PRMId': 5000027075
    }, {
        'PRPPRODId': 1010420,
        'LABNOMBRE': 'GRUPO PAILL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.800000000,
        'PrecioConIva': 3.136000,
        'PRODNombre': 'SUDAGRIP ANTIGRIPAL * 1 SOBRE GRANULADO  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*SUDAGRIP ANTIGRIPAL x 1 SOBRE GRANULADO* a Q3.14/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010420,\'Nombre\':\'SUDAGRIP ANTIGRIPAL * 1 SOBRE GRANULADO \',\'Precio\':3.14,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.136000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015899,
        'LABNOMBRE': 'WINZZER',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.730000000,
        'PrecioConIva': 3.057600,
        'PRODNombre': 'WINGRIP NOCHE X SOBRE - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINGRIP NOCHE X SOBRE* a Q3.06/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1015899,\'Nombre\':\'WINGRIP NOCHE X SOBRE\',\'Precio\':3.06,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.057600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012368,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.680000000,
        'PrecioConIva': 3.001600,
        'PRODNombre': 'FLUFIN AM ANTIGRIPAL * SOBRE DE 2 CAP **CAPLIN** - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*FLUFIN AM ANTIGRIPAL x SOBRE DE 2 CAP xxCAPLINxx* a Q3.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012368,\'Nombre\':\'FLUFIN AM ANTIGRIPAL * SOBRE DE 2 CAP **CAPLIN**\',\'Precio\':3.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.001600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012369,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.680000000,
        'PrecioConIva': 3.001600,
        'PRODNombre': 'FLUFIN PM ANTIGRIPAL * SOBRE DE 2 CAP **CAPLIN** - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*FLUFIN PM ANTIGRIPAL x SOBRE DE 2 CAP xxCAPLINxx* a Q3.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012369,\'Nombre\':\'FLUFIN PM ANTIGRIPAL * SOBRE DE 2 CAP **CAPLIN**\',\'Precio\':3.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.001600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016775,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.680000000,
        'PrecioConIva': 3.001600,
        'PRODNombre': 'PANADOL SINUSITIS X 2 TABLETAS - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL SINUSITIS X 2 TABLETAS* a Q3.00/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016775,\'Nombre\':\'PANADOL SINUSITIS X 2 TABLETAS\',\'Precio\':3.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 3.001600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013137,
        'LABNOMBRE': 'UNIPHARM',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.430000000,
        'PrecioConIva': 2.721600,
        'PRODNombre': 'UNIPULMIN GRIPE Y TOS * SOBRE 2 CAPLETAS - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*UNIPULMIN GRIPE Y TOS x SOBRE 2 CAPLETAS* a Q2.72/BLISTER',
        'txt_Detalle': '{\'Codigo\':1013137,\'Nombre\':\'UNIPULMIN GRIPE Y TOS * SOBRE 2 CAPLETAS\',\'Precio\':2.72,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.721600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013135,
        'LABNOMBRE': 'UNIPHARM',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.410000000,
        'PrecioConIva': 2.699200,
        'PRODNombre': 'UNIPULMIN ANTIGRIPAL * SOBRE 2 CAPLETAS - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*UNIPULMIN ANTIGRIPAL x SOBRE 2 CAPLETAS* a Q2.70/BLISTER',
        'txt_Detalle': '{\'Codigo\':1013135,\'Nombre\':\'UNIPULMIN ANTIGRIPAL * SOBRE 2 CAPLETAS\',\'Precio\':2.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013693,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.410000000,
        'PrecioConIva': 2.699200,
        'PRODNombre': 'PANADOL ULTRA SOBRE X 2 CAPLETAS - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL ULTRA SOBRE X 2 CAPLETAS* a Q2.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1013693,\'Nombre\':\'PANADOL ULTRA SOBRE X 2 CAPLETAS\',\'Precio\':2.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013829,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.410000000,
        'PrecioConIva': 2.699200,
        'PRODNombre': 'KOLD GRIP DIA BLISTER X 2 GELCAPS - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP DIA BLISTER X 2 GELCAPS* a Q2.70/BLISTER',
        'txt_Detalle': '{\'Codigo\':1013829,\'Nombre\':\'KOLD GRIP DIA BLISTER X 2 GELCAPS\',\'Precio\':2.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1013830,
        'LABNOMBRE': 'LEVEN',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.410000000,
        'PrecioConIva': 2.699200,
        'PRODNombre': 'KOLD GRIP NOCHE BLISTER X 2 GELCAPS - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*KOLD GRIP NOCHE BLISTER X 2 GELCAPS* a Q2.70/BLISTER',
        'txt_Detalle': '{\'Codigo\':1013830,\'Nombre\':\'KOLD GRIP NOCHE BLISTER X 2 GELCAPS\',\'Precio\':2.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.699200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1014034,
        'LABNOMBRE': 'UNIPHARM',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.280000000,
        'PrecioConIva': 2.553600,
        'PRODNombre': 'ZETAFEN PLUS TABLETA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ZETAFEN PLUS TABLETA* a Q2.55/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1014034,\'Nombre\':\'ZETAFEN PLUS TABLETA\',\'Precio\':2.55,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.553600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016176,
        'LABNOMBRE': 'KRAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 2.140000000,
        'PrecioConIva': 2.396800,
        'PRODNombre': 'RESFRIOL NF X TABLETA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*RESFRIOL NF X TABLETA* a Q2.40/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016176,\'Nombre\':\'RESFRIOL NF X TABLETA\',\'Precio\':2.40,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.396800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1015255,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 2.000000000,
        'PrecioConIva': 2.000000,
        'PRODNombre': 'ACETAMINOFEN CAPLIN 80MG BLISTER X 10TAB - BLISTER',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN CAPLIN 80MG BLISTER X 10TAB* a Q2.00/BLISTER',
        'txt_Detalle': '{\'Codigo\':1015255,\'Nombre\':\'ACETAMINOFEN CAPLIN 80MG BLISTER X 10TAB\',\'Precio\':2.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.000000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016608,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.960000000,
        'PrecioConIva': 2.195200,
        'PRODNombre': 'GRIPETIN DIA X CAPSULA GEL BLANDA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN DIA X CAPSULA GEL BLANDA* a Q2.20/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016608,\'Nombre\':\'GRIPETIN DIA X CAPSULA GEL BLANDA\',\'Precio\':2.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.195200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016610,
        'LABNOMBRE': 'DONOVAN WERKE',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.960000000,
        'PrecioConIva': 2.195200,
        'PRODNombre': 'GRIPETIN NOCHE X CAPSULA GEL BLANDA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPETIN NOCHE X CAPSULA GEL BLANDA* a Q2.20/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016610,\'Nombre\':\'GRIPETIN NOCHE X CAPSULA GEL BLANDA\',\'Precio\':2.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.195200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016398,
        'LABNOMBRE': 'QUIMIFAR',
        'PRPUMDId': 'BLISTER',
        'PRPPrecio': 1.880000000,
        'PrecioConIva': 2.105600,
        'PRODNombre': 'VIROPULMIN ANTIGRIPAL X SOBRE - BLISTER',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*VIROPULMIN ANTIGRIPAL X SOBRE* a Q2.11/BLISTER',
        'txt_Detalle': '{\'Codigo\':1016398,\'Nombre\':\'VIROPULMIN ANTIGRIPAL X SOBRE\',\'Precio\':2.11,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.105600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1001758,
        'LABNOMBRE': 'FR MEDIKAL',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.840000000,
        'PrecioConIva': 2.060800,
        'PRODNombre': 'CLORFENAMIN 500MG * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*CLORFENAMIN 500MG x UNIDAD* a Q2.06/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1001758,\'Nombre\':\'CLORFENAMIN 500MG * UNIDAD \',\'Precio\':2.06,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.060800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016150,
        'LABNOMBRE': 'GENOMMA LAB',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.820000000,
        'PrecioConIva': 2.038400,
        'PRODNombre': 'NEXT XTRA FORTE DIA X GELCAPS - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEXT XTRA FORTE DIA X GELCAPS* a Q2.04/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016150,\'Nombre\':\'NEXT XTRA FORTE DIA X GELCAPS\',\'Precio\':2.04,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.038400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016152,
        'LABNOMBRE': 'GENOMMA LAB',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.820000000,
        'PrecioConIva': 2.038400,
        'PRODNombre': 'NEXT XTRA FORTE NOCHE X GELCAPS - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*NEXT XTRA FORTE NOCHE X GELCAPS* a Q2.04/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016152,\'Nombre\':\'NEXT XTRA FORTE NOCHE X GELCAPS\',\'Precio\':2.04,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.038400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000257,
        'LABNOMBRE': 'PIERSAN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.790000000,
        'PrecioConIva': 2.004800,
        'PRODNombre': 'LIMOPIRINA * UNIDAD - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*LIMOPIRINA x UNIDAD* a Q2.00/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000257,\'Nombre\':\'LIMOPIRINA * UNIDAD\',\'Precio\':2.00,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 2.004800000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000054,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.520000000,
        'PrecioConIva': 1.702400,
        'PRODNombre': 'TABCIN NIÑOS * UNIDAD - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN NIÑOS x UNIDAD* a Q1.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000054,\'Nombre\':\'TABCIN NIÑOS * UNIDAD\',\'Precio\':1.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 1.702400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000292,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.520000000,
        'PrecioConIva': 1.702400,
        'PRODNombre': 'WINASORB ADULTO * SOBRE 2 TAB  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB ADULTO x SOBRE 2 TAB* a Q1.70/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000292,\'Nombre\':\'WINASORB ADULTO * SOBRE 2 TAB \',\'Precio\':1.70,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 1.702400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000108,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.430000000,
        'PrecioConIva': 1.601600,
        'PRODNombre': 'PANADOL EXTRA FUERTE * SOBRE 2 TAB   - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL EXTRA FUERTE x SOBRE 2 TAB * a Q1.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000108,\'Nombre\':\'PANADOL EXTRA FUERTE * SOBRE 2 TAB  \',\'Precio\':1.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 1.601600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012722,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 1.210000000,
        'PrecioConIva': 1.355200,
        'PRODNombre': 'TABCIN NIÑOS X TABLETA MASTICABLE - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 3,
        'MODALIDAD': 'NA',
        'txt_Button': '*TABCIN NIÑOS X TABLETA MASTICABLE* a Q1.36/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012722,\'Nombre\':\'TABCIN NIÑOS X TABLETA MASTICABLE\',\'Precio\':1.36,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 1.355200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1002621,
        'LABNOMBRE': 'LABORATORIOS LOPEZ',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.960000000,
        'PrecioConIva': 1.075200,
        'PRODNombre': 'DOLOFIN VITAMINADO * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLOFIN VITAMINADO x UNIDAD* a Q1.08/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1002621,\'Nombre\':\'DOLOFIN VITAMINADO * UNIDAD \',\'Precio\':1.08,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 1.075200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000091,
        'LABNOMBRE': 'FARKOT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.830000000,
        'PrecioConIva': 0.929600,
        'PRODNombre': 'GRIPONCITO 80 MG * UNIDAD - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*GRIPONCITO 80 MG x UNIDAD* a Q0.93/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000091,\'Nombre\':\'GRIPONCITO 80 MG * UNIDAD\',\'Precio\':0.93,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.929600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1012992,
        'LABNOMBRE': 'HELOS',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.820000000,
        'PrecioConIva': 0.918400,
        'PRODNombre': 'DOLIN FUERTE 500MG * 1 TABLETA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLIN FUERTE 500MG x 1 TABLETA* a Q0.92/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1012992,\'Nombre\':\'DOLIN FUERTE 500MG * 1 TABLETA\',\'Precio\':0.92,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.918400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000067,
        'LABNOMBRE': 'CHEMINTER',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.810000000,
        'PrecioConIva': 0.907200,
        'PRODNombre': 'DOLOFEBRYL COMPUESTO * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLOFEBRYL COMPUESTO x UNIDAD* a Q0.91/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000067,\'Nombre\':\'DOLOFEBRYL COMPUESTO * UNIDAD \',\'Precio\':0.91,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.907200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016661,
        'LABNOMBRE': 'LABORATORIOS LOPEZ',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.800000000,
        'PrecioConIva': 0.896000,
        'PRODNombre': 'DOLOFIN RAPIDA ACCION (120) X CAPSULA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DOLOFIN RAPIDA ACCION (120) X CAPSULA* a Q0.90/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016661,\'Nombre\':\'DOLOFIN RAPIDA ACCION (120) X CAPSULA\',\'Precio\':0.90,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.896000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000293,
        'LABNOMBRE': 'SANOFI AVENTIS - COHEN',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.750000000,
        'PrecioConIva': 0.840000,
        'PRODNombre': 'WINASORB INFANTIL * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*WINASORB INFANTIL x UNIDAD* a Q0.84/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000293,\'Nombre\':\'WINASORB INFANTIL * UNIDAD \',\'Precio\':0.84,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.840000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1010230,
        'LABNOMBRE': 'LABORATORIOS LOPEZ',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.710000000,
        'PrecioConIva': 0.795200,
        'PRODNombre': 'DENGUINA TABLETA - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*DENGUINA TABLETA* a Q0.80/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1010230,\'Nombre\':\'DENGUINA TABLETA\',\'Precio\':0.80,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.795200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000109,
        'LABNOMBRE': 'GLAXO POPULAR OTC',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.660000000,
        'PrecioConIva': 0.739200,
        'PRODNombre': 'PANADOL INFANTIL * UNIDAD - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*PANADOL INFANTIL x UNIDAD* a Q0.74/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000109,\'Nombre\':\'PANADOL INFANTIL * UNIDAD\',\'Precio\':0.74,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.739200000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000191,
        'LABNOMBRE': 'MK',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.600000000,
        'PrecioConIva': 0.600000,
        'PRODNombre': 'ACETAMINOFEN MK 500MG TABLETA - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN MK 500MG TABLETA* a Q0.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000191,\'Nombre\':\'ACETAMINOFEN MK 500MG TABLETA\',\'Precio\':0.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1016522,
        'LABNOMBRE': 'BAYER POPULAR',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.600000000,
        'PrecioConIva': 0.600000,
        'PRODNombre': 'ACETAMINOFEN BAYER 500MG X TABLETA - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN BAYER 500MG X TABLETA* a Q0.60/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1016522,\'Nombre\':\'ACETAMINOFEN BAYER 500MG X TABLETA\',\'Precio\':0.60,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.600000000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000298,
        'LABNOMBRE': 'LABORATORIO VIDES',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.530000000,
        'PrecioConIva': 0.593600,
        'PRODNombre': 'BEBETINA * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*BEBETINA x UNIDAD* a Q0.59/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000298,\'Nombre\':\'BEBETINA * UNIDAD \',\'Precio\':0.59,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.593600000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1000143,
        'LABNOMBRE': 'LANCASCO',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.520000000,
        'PrecioConIva': 0.582400,
        'PRODNombre': 'ACCION PLUS * UNIDAD  - UNIDAD',
        'IVA': 1.12000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACCION PLUS x UNIDAD* a Q0.58/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1000143,\'Nombre\':\'ACCION PLUS * UNIDAD \',\'Precio\':0.58,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.582400000,
        'PRMId': 0
    }, {
        'PRPPRODId': 1009251,
        'LABNOMBRE': 'CAPLIN POINT',
        'PRPUMDId': 'UNIDAD',
        'PRPPrecio': 0.200000000,
        'PrecioConIva': 0.200000,
        'PRODNombre': 'ACETAMINOFEN 500 MG * TABLETA UNIDAD **CAPLIN POINT** - UNIDAD',
        'IVA': 1.00000,
        'Orden': 3,
        'PRODReqPrescripcion': 2,
        'MODALIDAD': 'NA',
        'txt_Button': '*ACETAMINOFEN 500 MG x TABLETA UNIDAD xxCAPLIN POINTxx* a Q0.20/UNIDAD',
        'txt_Detalle': '{\'Codigo\':1009251,\'Nombre\':\'ACETAMINOFEN 500 MG * TABLETA UNIDAD **CAPLIN POINT**\',\'Precio\':0.20,\'Cantidad\':',
        'Descuento': 'NA',
        'PRPPrecioUnitarioConIvaSinPromocion': 0.200000000,
        'PRMId': 0
    }
]

      ,
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
