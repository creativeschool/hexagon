<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          说明：
          请先下载样表，根据样表中的说明生成表格，然后点击导入按钮进行导入。<br/>
          导入过程中，无法导入的行将在下面显示。<br/>
          导入过程中，出现的错误将在下面显示。<br/>
          重新导入后将覆盖原数据。<br/>
          确认无误后请点击提交按钮，操作将立即提交至数据库。<br/>
          若有需要，请事先备份数据库。<br/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" outlined @click="openUrl('about:blank')">下载导入样表</v-btn>
          <v-btn color="primary" @click="loadFile">导入</v-btn>
          <v-btn color="error">提交</v-btn>
        </v-card-actions>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate/>
          {{ hint }}
        </v-overlay>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { openUrl, remote, currentWindow } from '@/plugins/electron'

export default {
  name: 'userImport',
  data: () => ({
    loading: false,
    hint: '操作中',
    ok: [],
    fail: []
  }),
  methods: {
    openUrl,
    loadFile () {
      remote.dialog.showOpenDialog(currentWindow, { filters: [{ name: '表格文件', extensions: ['xlsx'] }] }, paths => {
        if (!paths.length) return
        const path = paths[0]
        console.log(path)
      })
    }
  }
}
</script>
