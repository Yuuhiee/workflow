<template>
  <!-- 绘制工作流页面的容器 -->
  <el-container id="page-container" v-loading="isLoading">
    <!-- 导航栏 -->
    <el-header id="page-header">
      <!-- 返回首页按钮 -->
      <div id="page-workflow">
        <el-tag type="info" effect="plain">创建工作流</el-tag>
      </div>
      <!-- 选择菜单 -->
      <el-menu id="page-header-menu" :default-active="defaultActiveMenuItem" active-text-color="#409eff" mode="horizontal" @select="handleSelectMenu">
        <el-menu-item index="baseSettingComponent">① 流程基础信息</el-menu-item>
        <el-menu-item index="processDesignComponent">② 工作流程设计</el-menu-item>
      </el-menu>
      <!-- 提交工作流按钮 -->
      <div id="page-commit">
        <el-button type="primary" @click="publishWorkFlow">发布工作流</el-button>
      </div>
    </el-header>
    <!-- 主体部分 -->
    <div id="page-body">
      <FormBaseSetting ref="baseSetting" v-if="activeMenuIndex === 'baseSettingComponent'" />
      <!-- keep-alive，确保已经绘制的工作流没有因为组件切换而丢失 -->
      <KeepAlive>
        <ProcessDesign ref="processDesign" v-if="activeMenuIndex === 'processDesignComponent'"
                       @openLoading="openLoading" @cancelLoading="cancelLoading" />
      </KeepAlive>
    </div>
  </el-container>
</template>

<script setup>
import { ref } from '@vue/runtime-core'
import { useStore } from 'vuex'

// 组件导入
import FormBaseSetting from "./components/FormBaseSetting.vue"
import ProcessDesign from "./components/ProcessDesign.vue"

import { middleToXinpaiTranslator } from "../../translator/middle-xinpai/translator";

// 从 vuex 获得 workflow 数据
const store = useStore();

/**
 * 导航栏部分的数据与逻辑
 */
// 菜单的默认展示页的 index
const defaultActiveMenuItem = "baseSettingComponent";

// 菜单切换时依赖的 index
let activeMenuIndex = ref("baseSettingComponent");

// 菜单项选择发生变化时的组件切换处理逻辑
const handleSelectMenu = (index) => {
  activeMenuIndex.value = index;
}

// 发布工作流
const publishWorkFlow = () => {
  // 获得待发布工作流
  const workflow = store.getters.getWorkflow;
  // 转化成 xinpai 格式
  const xinpaiWorkflow = middleToXinpaiTranslator(workflow);
  // 获得 JSON 字符串
  const result = JSON.stringify(xinpaiWorkflow);
  console.log("对象结构：", xinpaiWorkflow);
  console.log("--------------------------------------");
  console.log("json结构：", result);
}

/**
 * 界面的缓冲逻辑
 */
// 控制是否展示缓冲条
let isLoading = ref(false);
// 缓冲
const openLoading = () => {
  isLoading.value = true;
}
// 取消缓冲
const cancelLoading = () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 0.28 * 1000);
}

</script>

<style scoped>
#page-container {
  width: 100vw;
  height: 100vh;
  background-color: aliceblue;
  position: relative;
}
#page-container #page-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
}
#page-container #page-header #page-header-menu {
  width: 500px;
  display: flex;
  justify-content: center;
  border-bottom: 0;
}
#page-container #page-body {
  width: 100%;
  background-color: aliceblue;
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
}
</style>