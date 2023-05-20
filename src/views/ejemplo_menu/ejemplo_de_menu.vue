<template>
  <div class="components-container">
    <aside>
      <a>Subir archivo a Bucket S3</a>
    </aside>
    <div style="margin-left:20px">
      <b-row>
        <b-col lg="6" sm="6" xs="12">
          <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
              <label>Seleccionar archivo</label>
              <input id="file" ref="file" type="file" style="margin-left:20px;width:300px" @change="handleFileUpload()">
            </div>
          </div>
        </b-col>
      </b-row>
      <div class="vx-row">
        <div style="text-align:left" class="vx-col w-full">
          <vs-button class="example-btn" @click="metodoEjemplo()">Subir archivo</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SubirArchivos',
  components: { },
  data() {
    return {
      file: '',
      file_name: ''
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
    },
    submitFile() {
      const formData = new FormData()
      formData.append('file', this.file)

      axios.post('http://23.23.76.112:3030/upload-file-v2',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'i_c': '1',
            'n_f': this.file.name,
            'd_e': '01/01/2024'
          }
        }
      ).then(function(res) {
        alert('HA FINALIZADO EL PROCESO DE CARGA')
        alert(res.data)
      })
        .catch(function(res) {
          console.log('FAILURE!!')
          console.log(res.data)
        })
    },
    metodoEjemplo() {
      alert('BOTONAZO..')
    }
  }
}
</script>

<style scoped>
.example-btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 500;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  padding: 4px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  position: relative;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  border-color: #d9d9d9;
}

.example-btn:hover {
  color: #4AB7BD;
  background-color: #fff;
  border-color: #4AB7BD;
}
.example {
  font-size: 50px;
  color: #F6416C;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 80px;
  font-weight: 500;
}

.label {
  color: #2f4f4f;
  font-size: 16px;
  display: inline-block;
  margin: 15px 30px 15px 0;
}

input {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  width: 70px;
  height: 28px;
  cursor: text;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all .3s;
  transition: all .3s;
}

.startBtn {
  margin-left: 20px;
  font-size: 20px;
  color: #30B08F;
  background-color: #fff;
}

.startBtn:hover {
  background-color: #30B08F;
  color: #fff;
  border-color: #30B08F;
}

.pause-resume-btn {
  font-size: 20px;
  color: #E65D6E;
  background-color: #fff;
}

.pause-resume-btn:hover {
  background-color: #E65D6E;
  color: #fff;
  border-color: #E65D6E;
}
</style>
