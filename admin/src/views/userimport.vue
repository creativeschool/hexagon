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
          选择导入表格后请等待结果表格保存对话框并检查。
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" outlined @click="openUrl('about:blank')">下载导入样表</v-btn>
          <v-btn color="primary" outlined @click="loadFile">{{ data.length ? `重新导入` : '导入' }}</v-btn>
          <v-btn outlined @click="openUrl(store)" :disabled="!store">打开结果文件</v-btn>
          <v-btn color="primary" @click="verify">验证数据冲突</v-btn>
          <v-btn color="error" @click="submit" :disabled="!!errors.length">提交</v-btn>
          <v-spacer/>
          <strong>已缓存{{ data.length }}条数据</strong>
        </v-card-actions>
        <v-simple-table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>冲突登录号</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, i) in errors" :key="i">
              <th>{{ e.name }}</th>
              <th>{{ e.login }}</th>
            </tr>
          </tbody>
        </v-simple-table>
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
import { parseUserImport, saveUserImport } from '@/plugins/xlsx'
import { connection } from '../db'
import { bus } from '../plugins/bus'

export default {
  name: 'userImport',
  data: () => ({
    loading: false,
    hint: '操作中',
    data: [],
    errors: [],
    store: null
  }),
  methods: {
    openUrl,
    loadFile () {
      remote.dialog.showOpenDialog(currentWindow, { filters: [{ name: '表格文件', extensions: ['xlsx'] }] }, paths => {
        if (!paths || !paths.length) return
        const data = parseUserImport(paths[0])
        remote.dialog.showSaveDialog(currentWindow, { filters: [{ name: '表格文件', extensions: ['xlsx'] }], defaultPath: paths[0] + '导出.xlsx' }, path => {
          if (!path) return
          saveUserImport(path, data)
          this.store = path
          this.data = data.filter(x => x.success).map(x => x.obj)
        })
      })
    },
    verify () {
      this.errors = []
      this.loading = true
      connection.then(async ctx => {
        for (const o in this.data) {
          if (await ctx.users.find({ login: o.login }).count()) {
            this.errors.push({ name: o.name, login: o.login })
          }
        }
        bus.$emit('toast', `验证成功！发现${this.errors.length}条错误`)
      }).finally(() => { this.loading = false })
    },
    submit () {
      this.loading = true
      connection.then(async ctx => {
        const result = await ctx.users.insertMany(this.data)
        console.log(result)
        bus.$emit('toast', `导入成功！共导入${result.insertedCount}个文档`)
      }).finally(() => {
        this.loading = false
        this.data = []
        this.errors = []
        this.store = null
      })
    }
  }
}
</script>
