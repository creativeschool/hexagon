<template>
  <v-system-bar app window dark style="-webkit-app-region: drag" :color="errored ? 'error' : ''">
    <v-avatar size="32">
      <img src="@/../public/icon.png"/>
    </v-avatar>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text color="primary" v-on="on" style="-webkit-app-region: no-drag">文件</v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="devTools">
          <v-list-item-title>开发者工具</v-list-item-title>
        </v-list-item>
        <v-list-item @click="close">
          <v-list-item-title>退出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on" style="-webkit-app-region: no-drag">帮助</v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="openUrl('https://github.com/creativeschool/hexagon/tree/master/admin')">
          <v-list-item-title>开源项目</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openUrl('https://github.com/creativeschool/hexagon/blob/master/LICENSE')">
          <v-list-item-title>开源许可</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    {{title}}{{ title ? ' - ' : '' }}教学资源开放平台管理{{ errored ? '(出现错误)' : '' }}
    <v-spacer></v-spacer>
    <v-icon icon @click="minimize" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
    <v-icon icon @click="maximize" style="-webkit-app-region: no-drag">mdi-plus</v-icon>
    <v-icon icon @click="close" style="-webkit-app-region: no-drag">mdi-close</v-icon>
  </v-system-bar>
</template>

<script>
import { minimize, maximize, close, devTools, openUrl } from '@/plugins/electron'
import { bus } from '@/plugins/bus'

export default {
  name: 'systemBar',
  data: () => ({
    title: '',
    errored: false
  }),
  methods: {
    minimize () {
      minimize()
    },
    maximize () {
      maximize()
    },
    close () {
      close()
    },
    devTools () {
      bus.$emit('toast', '仅供开发人员使用')
      devTools()
    },
    openUrl
  },
  mounted () {
    bus.$on('title', title => {
      this.title = document.title = title
    })
    bus.$on('error', () => { this.errored = true })
  }
}
</script>
