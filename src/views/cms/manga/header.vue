<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.searchword" clearable size="small" placeholder="Input keywords" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <el-select v-model="query.ended" clearable size="small" placeholder="Ended" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.manga_ended" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="query.published" clearable size="small" placeholder="Published" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.manga_published" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="query.adult" clearable size="small" placeholder="Adult" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.manga_adult" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
export default {
  components: { rrOperation },
  mixins: [header()],
  props: {
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
