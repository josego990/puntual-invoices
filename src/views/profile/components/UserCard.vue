<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="profilePicture" :height="'120px'" :width="'120px'" :hoverable="false">
          Imagina..
          <small><span class="pan-info-roles">lo grande que puedes ser.</span></small>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ profileName }}</div>
        <div class="user-role text-center text-muted">{{ profileEmail }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Atribuciones</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            Analista programador .NET Banco Promerica Guatemala
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Tareas</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Evaluación desempeño</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>Curso 1</span>
            <el-progress :percentage="80" />
          </div>
          <div class="progress-item">
            <span>Curso 2</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>Factura mensual</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          profilePicture: '',
          profileName: '',
          profileEmail: '',
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  created() {
    this.asignaDatos()
    console.log('this.profilePicture', this.profilePicture)
  },
  methods: {
    // Aquí puedes agregar tus métodos
    asignaDatos() {
      this.profilePicture = localStorage.getItem('profilePicture')
      this.profileName = localStorage.getItem('profileName')
      this.profileEmail = localStorage.getItem('profileEmail')
    }
    // ...
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
