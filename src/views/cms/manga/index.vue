<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="NAME" />
      <el-table-column prop="country" label="COUNTRY" />
      <el-table-column prop="clicks" label="CLICKS" />
      <el-table-column prop="updateAt" label="UPDATE TIME" />
      <el-table-column prop="ended" label="ENDED" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.ended"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnded(scope.row, scope.row.ended)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="published" label="PUBLISHED" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.published"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePublished(scope.row, scope.row.published)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="adult" label="ADULT" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.adult"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePublished(scope.row, scope.row.adult)"
          />
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','manga:edit','manga:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :dict="dict" />
  </div>
</template>

<script>
import crudManga from './api'
import eHeader from './header'
import eForm from './form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Manga',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: 'CMS内容',
      url: 'api/cms/manga',
      sort: ['id,desc'],
      crudMethod: { ...crudManga }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['manga_recommended', 'manga_ended', 'manga_published', 'manga_adult'],
  data() {
    return {
      permission: {
        add: ['admin', 'manga:add'],
        edit: ['admin', 'manga:edit'],
        del: ['admin', 'manga:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnded(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.manga_ended[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudManga.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.manga_ended[val] + '成功', 'success')
        }).catch(err => {
          data.ended = !data.ended
          console.log(err.data.message)
        })
      }).catch(() => {
        data.ended = !data.ended
      })
    },
    changePublished(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.manga_published[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudManga.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.manga_published[val] + '成功', 'success')
        }).catch(err => {
          data.published = !data.published
          console.log(err.data.message)
        })
      }).catch(() => {
        data.published = !data.published
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
