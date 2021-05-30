<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="130px"
    >
      <el-form-item
        label="name"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 300px;"
        />
      </el-form-item>
      <el-form-item
        label="nickname"
        prop="nickname"
      >
        <el-input
          v-model="form.nickname"
          style="width: 300px;"
        />
      </el-form-item>
      <el-form-item
        label="Recommended"
        prop="recommended"
      >
        <el-radio
          v-for="item in dict.dict.manga_recommended"
          :key="item.id"
          v-model="form.recommended"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="Ended"
        prop="ended"
      >
        <el-radio
          v-for="item in dict.dict.manga_ended"
          :key="item.id"
          v-model="form.ended"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="Published"
        prop="published"
      >
        <el-radio
          v-for="item in dict.dict.manga_published"
          :key="item.id"
          v-model="form.published"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="Adult"
        prop="adult"
      >
        <el-radio
          v-for="item in dict.dict.manga_adult"
          :key="item.id"
          v-model="form.adult"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'

const defaultForm = {
  name: '',
  nickname: '',
  recommended: 0,
  ended: 0,
  published: 0,
  adult: 0
}
export default {
  mixins: [form(defaultForm)],
  props: {
    dict: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
