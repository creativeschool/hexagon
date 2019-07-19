<template>
  <v-app>
    <system-bar></system-bar>
    <v-app-bar app dark>
      <v-toolbar-title>教学资源开放平台管理</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text to="/">系统状态</v-btn>
        <v-btn text to="/user">用户管理</v-btn>
        <v-btn text to="/course">课程管理</v-btn>
        <v-btn text to="/file">文件管理</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>

    <v-snackbar v-model="snackbar" bottom right :timeout="5000">
      {{ toast }}
      <v-btn dark text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { bus } from '@/plugins/bus'
import systemBar from '@/components/systembar'
import { remote } from './plugins/electron'

export default {
  name: 'App',
  components: {
    systemBar
  },
  data: () => ({
    loading: true,
    loggedIn: false,
    loadLog: [],
    toast: '',
    snackbar: false
  }),
  methods: {
    showToast (text) {
      this.snackbar = true
      this.toast = text
    }
  },
  mounted () {
    bus.$on('toast', msg => this.showToast(msg))
    bus.$on('error', e => remote.dialog.showErrorBox('出现错误', e.message))
  },
  errorCaptured (err, vm, info) {
    bus.$emit('error', err)
  }
}
</script>
