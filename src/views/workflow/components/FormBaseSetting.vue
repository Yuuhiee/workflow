<template>
  <div id="base-setting-container">
    <el-form id="base-setting-form" label-position="left" :model="workflow" label-width="100px">
      <el-tag effect="plain" size="large" style="margin-bottom: 25px">
        流程基础信息
      </el-tag>
      <el-form-item :required="true" label="工作流名称" size="large">
        <el-input v-model="workflow.name"/>
      </el-form-item>
      <el-form-item :required="true" label="工作流说明" size="large">
        <el-input v-model="workflow.description" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item :required="true" label="绑定表单">
        <el-select v-model="workflow.form" class="m-2" style="margin-right: 15px" placeholder="请选择要绑定的表单">
          <el-option
              v-for="item in formList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script setup>
import { reactive, ref } from 'vue'
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { useStore } from 'vuex'
import { createInitialWorkflow } from "../../../translator/middle-g6/nodeEditor.js";

// 从 vuex 获得 workflow 数据
const store = useStore();

// 节点映射
let middleNodeRepository = store.getters.getMiddleNodeRepository;

// 工作流
let workflow = null;
// 证明当前是新建工作流
if (store.getters.getWorkflow === null) {
  workflow = reactive(createInitialWorkflow(middleNodeRepository));
}
// 已有工作流
else {
  workflow = reactive(store.getters.getWorkflow);
}
// 绑定表单数据项（远程）
let formList = ref([]);
// 获得要绑定的表单
const getFormList = () => {
  formList.value.push({id: "1", label: "请假表"});
  formList.value.push({id: "2", label: "财务报销表"});
  formList.value.push({id: "3", label: "学生离威审批"});
}

onMounted(() => {
  getFormList();
});

onUnmounted(() => {
  store.commit("updateWorkflow", workflow);
});

</script>

<style  scoped>
#base-setting-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
#base-setting-container #base-setting-form {
  width: 700px;
  height: 450px;
  margin-top: 40px;
  padding: 25px;
  background-color: #ffffff;
}
</style>