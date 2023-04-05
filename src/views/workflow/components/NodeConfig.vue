<!-- 审批节点和发起节点的节点配置信息设置 -->
<template>
  <div id="approval-node-container">
    <!-- 节点基础信息配置（全体节点共有） id、name -->
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基础配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
      >
        <el-form-item label="节点ID" :required="true" size="default">
          <el-input v-model="nodeConfig.id" disabled />
        </el-form-item>
        <el-form-item
          label="节点名称"
          :required="true"
          size="default"
          style="margin-bottom: 0"
        >
          <el-input
            v-model="nodeConfig.name"
            placeholder="请输入当前节点的新名称"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 人员信息配置 assignee -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="
        ['StartNode', 'ApprovalNode', 'NoticeNode'].includes(nodeModel.type)
      "
    >
      <template #header>
        <div class="card-header">
          <span>人员配置</span>
        </div>
      </template>
      <el-form label-position="left" label-width="110px">
        <el-form-item label="选择审批人员" :required="true">
          <el-checkbox-group
            v-model="assigneeCheckBoxValue"
            @change="handleAssigneeCheckBoxChange"
          >
            <el-checkbox style="margin: 0 10px 0 0" label="指定用户组" border />
            <el-checkbox style="margin: 0 10px 0 0" label="指定用户" border />
            <el-checkbox style="margin: 0 10px 0 0" label="发起人" border />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="选择指定用户组"
          v-show="assigneeCheckBoxValue.includes('指定用户组')"
        >
          <el-select
            v-model="assigneeGroupSelectValue"
            @change="handleAssigneeGroupSelectValueChange"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择用户组"
            size="default"
            style="width: 240px"
          >
            <el-option
              v-for="item in assigneeGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择指定用户"
          v-show="assigneeCheckBoxValue.includes('指定用户')"
        >
          <el-button type="primary" text bg @click="openAssigneeSelectDialog"
            >添加人员</el-button
          >
        </el-form-item>
        <el-form-item
          label="已选择特定人员"
          v-show="assigneeCheckBoxValue.includes('指定用户')"
          style="margin-bottom: 0"
        >
          <div
            style="
              border: 1px solid #f1ecec;
              width: 90%;
              min-height: 70px;
              padding: 7px;
            "
          >
            <el-tag
              type="info"
              size="default"
              v-for="(item, index) in selectedSpecificAssigneeList"
              :key="index"
              style="margin-bottom: 7px; margin-right: 7px"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 节点人员配置对话框 -->
    <el-dialog v-model="assigneeDialogVisible" title="添加指定用户" width="30%">
      <div class="specific-container">
        <div class="specific-container-tree">
          <el-input
            v-model="specificAssigneeText"
            placeholder="搜索人员，支持按照名称搜索"
            clearable
            :prefix-icon="Search"
            style="margin-bottom: 15px"
          />
          <el-tree
            ref="assigneeSelectRef"
            :data="specificAssigneeTreeData"
            :filter-node-method="filterByKeyword"
            show-checkbox
            default-expand-all
            @check="handleSelectedSpecificAssigneeListChange"
            node-key="id"
          />
        </div>
        <div class="specific-container-list">
          <div class="specific-container-list-header">
            <el-tag size="large" type="info">已选人员</el-tag>
            <span
              @click="deleteAllUsers"
              style="cursor: pointer; color: #f33a3a"
              >清空</span
            >
          </div>
          <div class="specific-container-list-body">
            <div
              v-for="(item, index) in selectedSpecificAssigneeList"
              :key="index"
              style="
                width: 100%;
                margin: 3px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span>{{ item.label }}</span>
              <el-button
                type="danger"
                :icon="Delete"
                link
                @click="deleteSpecificUser(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelChangeTreeData">取消</el-button>
          <el-button type="primary" @click="confirmChangeTreeData"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 表单权限配置 permission -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['StartNode', 'ApprovalNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>表单权限配置</span>
        </div>
      </template>
      <el-table
        :data="formPermissionList"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
      >
        <el-table-column prop="field" label="字段" />
        <el-table-column prop="permission" label="操作权限">
          <template #default="scope">
            <el-form>
              <!-- 权限配置项 -->
              <el-checkbox-group v-model="scope.row.permission">
                <el-checkbox
                  v-for="child in scope.row.menu"
                  :key="child.id"
                  :label="child.label"
                  text-color="#FF0000"
                />
              </el-checkbox-group>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 审批节点类型 subType -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['ApprovalNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>审批节点类型配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        style="max-width: 460px"
      >
        <el-form-item
          label="节点类型"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-radio-group v-model="nodeConfig.subType" class="ml-4">
            <el-radio label="会签" border style="margin-right: 10px"
              >会签</el-radio
            >
            <el-radio label="单签" border size="small">单签</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 会签配置（审批节点独有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="nodeConfig.subType === '会签'"
    >
      <template #header>
        <div class="card-header">
          <span>会签配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
        :rules="rules"
      >
        <!-- sequence -->
        <el-form-item label="会签方式" :required="true">
          <el-select
            v-model="nodeConfig.sequence"
            class="m-2"
            placeholder="选择会签方式（串行、并行）"
          >
            <el-option
              v-for="(item, index) in sequenceOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- percentage -->
        <el-form-item label="通过比例" prop="percentage">
          <el-input
            v-model="nodeConfig.percentage"
            placeholder="会签通过比例（0-100）"
            clearable
            style="width: 250px"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <!-- canAdd -->
        <el-form-item
          label="是否加签"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-radio-group v-model="nodeConfig.canAdd" class="ml-4">
            <el-radio :label="true" border style="margin-right: 10px"
              >是</el-radio
            >
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Alternative Next（审批节点、子流程节点共有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['SubProcess', 'ApprovalNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>操作按钮</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
      >
        <!-- alternative next -->
        <el-form-item
          label="操作按钮"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-radio-group v-model="nodeConfig.alternativeNext" class="ml-4">
            <el-radio label="重复" border style="margin-right: 10px"
              >回退上一节点</el-radio
            >
            <el-radio label="结束" border>结束</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分流节点配置 -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['AddBranchNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>分流节点配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
      >
        <el-form-item
          label="分流逻辑"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-radio-group v-model="nodeConfig.logic" class="ml-4">
            <el-radio label="inclusive">并行</el-radio>
            <el-radio label="exclusive">互斥</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 条件配置（条件节点独有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['ConditionNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>分支条件配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
      >
        <el-form-item
          label="条件表达式"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-input
            v-model.number="nodeConfig.condition"
            placeholder="请输入条件表达式"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 通知配置（通知节点独有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['NoticeNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>通知配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
      >
        <el-form-item label="通知内容" :required="true">
          <el-input
            v-model="nodeConfig.notice.content"
            placeholder="通知内容"
            :rows="4"
            type="textarea"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="通知方式"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-checkbox-group v-model="nodeConfig.notice.channel">
            <el-checkbox label="email" border style="margin-right: 10px"
              >电子邮件</el-checkbox
            >
            <el-checkbox label="message" border>短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 子流程参数配置（子流程节点独有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['SubProcess'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>子流程节点配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="100px"
        :model="nodeConfig"
        style="min-width: 450px"
      >
        <!-- 子流程选择 -->
        <el-form-item label="子流程选择" :required="true">
          <el-select
            v-model="nodeConfig.subProcessId"
            placeholder="选择节点绑定的子流程"
            class="m-2"
          ></el-select>
        </el-form-item>
        <el-alert
          title="以下为父、子流程的变量传递关系配置"
          type="info"
          show-icon
          :closable="false"
          style="margin: 5px 0"
        />
        <el-form-item label="父传子流程" :required="true">
          <el-table
            :data="nodeConfig.inParameters"
            style="width: 100%"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column prop="source" label="来源">
              <template #default="scope">
                <el-select
                  v-model="scope.row.source"
                  class="m-2"
                  placeholder="选择变量"
                ></el-select>
              </template>
            </el-table-column>
            <el-table-column prop="target" label="目标">
              <template #default="scope">
                <el-select
                  v-model="scope.row.target"
                  class="m-2"
                  placeholder="选择变量"
                ></el-select>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-button
                  type="primary"
                  @click="
                    nodeConfig.inParameters.push({ source: '', target: '' })
                  "
                  >添加字段</el-button
                >
              </template>
              <template #default="scope">
                <el-button
                  type="danger"
                  :icon="Delete"
                  link
                  @click="deleteInParameters(scope)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label="子传父流程"
          :required="true"
          style="margin-bottom: 0"
        >
          <el-table
            :data="nodeConfig.outParameters"
            style="width: 100%"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column prop="source" label="来源">
              <template #default="scope">
                <el-select
                  v-model="scope.row.source"
                  class="m-2"
                  placeholder="选择变量"
                ></el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="target"
              label="目标"
              style="margin-bottom: 10px"
            >
              <template #default="scope">
                <el-select
                  v-model="scope.row.target"
                  class="m-2"
                  placeholder="选择变量"
                ></el-select>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-button
                  type="primary"
                  @click="
                    nodeConfig.outParameters.push({ source: '', target: '' })
                  "
                  >添加字段</el-button
                >
              </template>
              <template #default="scope">
                <el-button
                  type="danger"
                  :icon="Delete"
                  link
                  @click="deleteOutParameters(scope)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 定时器节点配置（定时器节点独有） -->
    <el-card
      class="box-card"
      shadow="never"
      v-if="['TimerNode'].includes(nodeModel.type)"
    >
      <template #header>
        <div class="card-header">
          <span>定时器配置</span>
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="110px"
        :model="nodeConfig"
        style="max-width: 460px"
        :rules="rules"
      >
        <el-form-item
          label="时间期限"
          style="margin-bottom: 0"
          :required="true"
          prop="time"
        >
          <el-input
            placeholder="时间间隔"
            v-model="nodeConfig.time.num"
            style="width: 200px"
            clearable
          >
            <template #append>
              <el-select
                v-model="nodeConfig.time.unit"
                placeholder="单位"
                style="width: 80px"
              >
                <el-option label="天" value="day" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, watch, defineExpose } from "vue";
import { onMounted, onUnmounted } from "@vue/runtime-core";

import { Delete, Search } from "@element-plus/icons-vue";

/**
 * 基本配置部分
 * @type {Readonly<ExtractPropTypes<{middleNodeRepository: MapConstructor, model: ObjectConstructor}>>}
 */
let recievedData = defineProps({
  // 父组件传递过来的点击的节点的 g6 对象
  model: Object,
  // 父组件传递过来的中间类型节点集合映射
  middleNodeRepository: Map,
});
// 当前操作的节点的 g6 对象
let nodeModel = recievedData.model;
// 节点集合映射
let middleNodeRepository = recievedData.middleNodeRepository;

// 保存当前编辑节点的配置项
let nodeConfig = reactive(
  JSON.parse(JSON.stringify(middleNodeRepository.get(nodeModel.id)))
);

/**
 * 表单校验规则
 */
const validPercentage = (rule, value, callback) => {
  const reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/;
  if (value === "") {
    callback(new Error("通过比例不能为空"));
  }
  if (reg.test(value)) {
    value = value * 1;
    if (value < 0 || value > 100) {
      callback(new Error("会签的通过比例应该为 0 到 100 的数字"));
    } else {
      callback();
    }
  } else {
    callback(new Error("当前输入非数字"));
  }
};
const validTime = (rule, value, callback) => {
  const reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/;
  if (value.num === "") {
    callback();
  }
  if (reg.test(value.num)) {
    if (value.num < 0) {
      callback(new Error("时间间隔不能为负数"));
    } else {
      callback();
    }
  } else {
    callback(new Error("当前输入非数字"));
  }
};
const rules = reactive({
  percentage: [
    { validator: validPercentage, trigger: "blur" },
    { required: true, message: "通过比例不能为空", trigger: "blur" },
  ],
  time: [{ validator: validTime, trigger: "blur" }],
});

/**
 * 人员配置
 */
// 人员配置多选框的绑定值
let assigneeCheckBoxValue = ref([]);
// “指定用户组”多项选择框的“展示”数据
let assigneeGroupOptions = [
  {
    value: "小组1",
    label: "小组1",
  },
  {
    value: "小组2",
    label: "小组2",
  },
  {
    value: "小组3",
    label: "小组3",
  },
  {
    value: "小组4",
    label: "小组4",
  },
  {
    value: "小组5",
    label: "小组5",
  },
];
// “指定用户组”多项选择框的绑定值
let assigneeGroupSelectValue = ref([]);
// “指定用户”对话框是否显示的绑定值
let assigneeDialogVisible = ref(false);
// “指定用户”对话框的树形控件的 Dom
const assigneeSelectRef = ref();
// ”指定用户“对话框的树形控件的“展示”数据
let specificAssigneeTreeData = [
  {
    id: "gf905j42w3tjq",
    label: "行政部门",
    children: [
      {
        id: "fwerafgad",
        label: "办公室",
        children: [
          {
            id: "fdasgas34rfdq",
            label: "小李",
          },
          {
            id: "r34120ikyhukl576",
            label: "小张",
          },
        ],
      },
    ],
  },
  {
    id: "g45093it4jt345",
    label: "财务部门",
    children: [
      {
        id: "tg0456iyt45631q2ed3",
        label: "小红",
      },
      {
        id: "o0yh563k0huj75l",
        label: "小明",
      },
    ],
  },
  {
    id: "tj34r59r30fe",
    label: "人力部门",
    children: [
      {
        id: "tf5023ityg4563g",
        label: "小刘",
      },
      {
        id: "fgk5302itg245gbtr234",
        label: "小刚",
      },
    ],
  },
];
// 已选择的“指定用户”列表
let selectedSpecificAssigneeList = ref([]);
// “指定用户”对话框的树形控件的条件搜索框的绑定值
let specificAssigneeText = ref("");

// “指定用户”对话框的树形控件的过滤搜索逻辑
const filterByKeyword = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};
watch(specificAssigneeText, (val) => {
  assigneeSelectRef.value.filter(val);
});

// “指定人员”对话框的树形控件的选择项改变时的响应事件
const handleSelectedSpecificAssigneeListChange = () => {
  // 首先清空已选择的指定人员的列表
  selectedSpecificAssigneeList.value = [];
  // 获取当前已选中的树形结构的元素，并更新展示框
  let checkedTreeItemList = assigneeSelectRef.value.getCheckedNodes(true, true);
  for (let i = 0; i < checkedTreeItemList.length; i++) {
    selectedSpecificAssigneeList.value.push({
      id: checkedTreeItemList[i].id,
      label: checkedTreeItemList[i].label,
    });
  }
};
// 删除指定 id 的用户
const deleteSpecificUser = (id) => {
  // 展示用数据过滤掉 id 指定用户
  selectedSpecificAssigneeList.value =
    selectedSpecificAssigneeList.value.filter((item) => item.id !== id);
  // 树形选择框过滤掉 id 指定用户
  let checkedTreeItem = assigneeSelectRef.value
    .getCheckedNodes(true, true)
    .filter((item) => item.id !== id);
  assigneeSelectRef.value.setCheckedNodes(checkedTreeItem);
};
// 清空全部已选中的指定用户
const deleteAllUsers = () => {
  selectedSpecificAssigneeList.value = [];
  assigneeSelectRef.value.setCheckedNodes([]);
};

// 人员配置多选框的选择项改变时的响应事件
const handleAssigneeCheckBoxChange = () => {
  // 不选择特定用户组，清空 assigneeGroupSelectValue（“指定用户组”多项选择框的绑定值）
  if (!assigneeCheckBoxValue.value.includes("指定用户组")) {
    assigneeGroupSelectValue.value = [];
  }
  // 不选择特定用户，清空 selectedSpecificAssigneeList（已选择的“指定用户”列表）
  if (!assigneeCheckBoxValue.value.includes("指定用户")) {
    selectedSpecificAssigneeList.value = [];
  }
};

// 打开“指定人员”对话框时构造的树形选择框的已选择人员列表
let selectedTreeItemList = [];
/**
 * 递归找到树形选择的叶子节点，并判断其 id 与 当前需要寻找的 id 的关系，构造树形展示数据
 * @param {Object} curNode 当前正在判断的节点
 * @param {String} key 正在配对的 id
 * @param {Array} selectedTreeItemList 初始化时构造的树形选择框的展示数据
 */
const initTreeData = (curNode, key, selectedTreeItemList) => {
  if (curNode.children !== null && curNode.children !== undefined) {
    for (let i = 0; i < curNode.children.length; i++) {
      initTreeData(curNode.children[i], key, selectedTreeItemList);
    }
  }
  // 递归结束的条件——出现叶子节点
  else {
    if (curNode.id === key) {
      selectedTreeItemList.push(curNode);
    }
  }
};
// 初始化 assignee
const initAssignee = () => {
  // assigneeCheckBoxValue.value = [];
  // 发起节点、审批节点、通知节点需要处理 assignee
  if (["StartNode", "ApprovalNode", "NoticeNode"].includes(nodeModel.type)) {
    let assignee = nodeConfig.assignee;
    for (let i = 0; i < assignee.length; i++) {
      // 指定用户组
      if (assignee[i].type === "group") {
        let group = assignee[i];
        // 如果有选择项，就赋值
        if (group.group.length > 0) {
          // 多选框赋值
          assigneeCheckBoxValue.value.push("指定用户组");
          // 多项选择框的绑定值就是 id 数组，因此可以直接赋值
          assigneeGroupSelectValue.value = group.group;
        }
        // 否则就是空数组
        else {
          assigneeGroupSelectValue.value = [];
        }
      }
      // 指定用户
      if (assignee[i].type === "user") {
        let user = assignee[i];
        if (user.user.length > 0) {
          // 指定用户 user[] 中，可能会有发起人，因此，指定用户被勾选的逻辑是 user[] 中除了发起人还有其他指定用户
          if (user.user.length > 1 || !user.user.includes("发起人")) {
            assigneeCheckBoxValue.value.push("指定用户");
          }
          // 发起人被勾选的逻辑是 user[] 中有发起人
          if (user.user.includes("发起人")) {
            assigneeCheckBoxValue.value.push("发起人");
          }
          // 根据 assignee 已选中的数据构造展示界面（树形控件和矩形框）
          for (let j = 0; j < user.user.length; j++) {
            for (let k = 0; k < specificAssigneeTreeData.length; k++) {
              initTreeData(
                specificAssigneeTreeData[k],
                user.user[j],
                selectedTreeItemList
              );
            }
          }
          // 构造 selectedSpecificAssigneeList
          for (let i = 0; i < selectedTreeItemList.length; i++) {
            selectedSpecificAssigneeList.value.push({
              id: selectedTreeItemList[i].id,
              label: selectedTreeItemList[i].label,
            });
          }
        } else {
          selectedTreeItemList = [];
          selectedSpecificAssigneeList.value = [];
        }
      }
    }
  }
};
// 临时存储旧的树形选择数据
let oldCheckedTreeNodes = [];
// 打开选择指定人员对话框
function openAssigneeSelectDialog() {
  assigneeDialogVisible.value = true;
  // 更新树形展示框
  setTimeout(() => {
    // 遍历 selectedSpecificAssigneeList 设置节点
    selectedTreeItemList = [];
    for (let i = 0; i < selectedSpecificAssigneeList.value.length; i++) {
      for (let j = 0; j < specificAssigneeTreeData.length; j++) {
        initTreeData(
          specificAssigneeTreeData[j],
          selectedSpecificAssigneeList.value[i].id,
          selectedTreeItemList
        );
      }
    }
    oldCheckedTreeNodes = selectedTreeItemList;

    assigneeSelectRef.value.setCheckedNodes(selectedTreeItemList);
  }, 100);
}
// 修改“指定人员”对话框的树形控件的数据
const confirmChangeTreeData = () => {
  // 如果树形控件没有值，应该将多选框进行修改
  if (selectedSpecificAssigneeList.value.length === 0) {
    assigneeCheckBoxValue.value = assigneeCheckBoxValue.value.filter(
      (item) => item !== "指定用户"
    );
  }
  assigneeDialogVisible.value = false;
};
// 取消修改“指定人员”对话框的树形控件的数据
const cancelChangeTreeData = () => {
  // 取消修改时，唯一可以参照的是 oldCheckedTreeNodes，利用这个重新生成 selectedSpecificAssigneeList
  assigneeSelectRef.value.setCheckedNodes(oldCheckedTreeNodes);
  selectedSpecificAssigneeList.value = [];
  for (let i = 0; i < oldCheckedTreeNodes.length; i++) {
    selectedSpecificAssigneeList.value.push({
      id: oldCheckedTreeNodes[i].id,
      label: oldCheckedTreeNodes[i].label,
    });
  }
  // 如果树形控件没有值，应该将多选框进行修改
  if (selectedSpecificAssigneeList.value.length === 0) {
    assigneeCheckBoxValue.value = assigneeCheckBoxValue.value.filter(
      (item) => item !== "指定用户"
    );
  }
  assigneeDialogVisible.value = false;
};
// “指定用户组”选择项发生变化时的响应事件
const handleAssigneeGroupSelectValueChange = () => {
  // 如果多项选择框没有值，应该将多选框进行修改
  if (assigneeGroupSelectValue.value.length === 0) {
    assigneeCheckBoxValue.value = assigneeCheckBoxValue.value.filter(
      (item) => item !== "指定用户组"
    );
  }
};

// 根据表单的绑定属性值配置 nodeConfig.assignee
const handleAssignee = () => {
  if (["StartNode", "ApprovalNode", "NoticeNode"].includes(nodeModel.type)) {
    nodeConfig.assignee = [];
    let user = {
      type: "user",
      user: [],
    };
    if (assigneeCheckBoxValue.value.includes("发起人")) {
      user.user.push("发起人");
    }
    for (let i = 0; i < selectedSpecificAssigneeList.value.length; i++) {
      user.user.push(selectedSpecificAssigneeList.value[i].id);
    }
    nodeConfig.assignee.push(user);
    let group = {
      type: "group",
      group: [],
    };
    for (let i = 0; i < assigneeGroupSelectValue.value.length; i++) {
      group.group.push(assigneeGroupSelectValue.value[i]);
    }
    nodeConfig.assignee.push(group);
  }
};

/**
 * 表单配置
 */
let formPermissionList = reactive([
  {
    field: "姓名",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "性别",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "部门",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "岗位",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "请假事由",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "请假时间",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "部门意见",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "人力意见",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
  {
    field: "总经理意见",
    permission: [],
    menu: [
      {
        label: "可见",
        id: 1,
      },
      {
        label: "可写",
        id: 0,
      },
    ],
  },
]);
// 根据表单权限的配置项 formPermissionList 配置 nodeConfig.permission
const handlePermission = () => {
  if (nodeModel.type === "StartNode" || nodeModel.type === "ApprovalNode") {
    nodeConfig.permission = [];
    for (let i = 0; i < formPermissionList.length; i++) {
      // 表单项 item
      let curPermission = formPermissionList[i];
      // 构建的 permission 的 item
      let permissionItem = {
        fieldName: curPermission.field,
        visible: false,
        writable: false,
      };
      // 遍历每一个表单项的 item
      for (let j = 0; j < curPermission.permission.length; j++) {
        if (curPermission.permission[j] === "可见") {
          permissionItem.visible = true;
        }
        if (curPermission.permission[j] === "可写") {
          permissionItem.writable = true;
        }
      }
      if (curPermission.permission.length > 0) {
        nodeConfig.permission.push(permissionItem);
      }
    }
  }
};
// 初始化 permission
const initPermission = () => {
  if (["StartNode", "ApprovalNode"].includes(nodeModel.type)) {
    for (let i = 0; i < nodeConfig.permission.length; i++) {
      let curFormItem = nodeConfig.permission[i];
      // 寻找 formPermissionList 的相同项
      for (let j = 0; j < formPermissionList.length; j++) {
        if (curFormItem.fieldName === formPermissionList[j].field) {
          if (curFormItem.visible) {
            formPermissionList[j].permission.push("可见");
          }
          if (curFormItem.writable) {
            formPermissionList[j].permission.push("可写");
          }
        }
      }
    }
  }
};

/**
 * 会签配置
 */
// 执行方式的类型
let sequenceOptions = [
  {
    value: "串行",
    label: "串行",
  },
  {
    value: "并行",
    label: "并行",
  },
];

/**
 * 子流程配置
 */
// 删除子流程 in/out 数组
const deleteInParameters = (scope) => {
  nodeConfig.inParameters.splice(scope.$index, 1);
};
const deleteOutParameters = (scope) => {
  nodeConfig.outParameters.splice(scope.$index, 1);
};

// 根据节点配置 nodeConfig 配置表单展示（具体来说，配置 permission 和 assignee）
const initNodeConfig = () => {
  // 如果当前配置的是通知节点，要把通知节点的 assignee 从 notice 中拿出来
  if (nodeModel.type === "NoticeNode") {
    nodeConfig.assignee = nodeConfig.notice.assignee;
  }
  initPermission();
  initAssignee();
};

// 更新节点配置
const updateNodeConfig = () => {
  handlePermission();
  handleAssignee();
  // 需要修改的节点
  let clickedNode = middleNodeRepository.get(nodeModel.id);
  // 名称和 id 是所有节点共有的
  clickedNode.name = nodeConfig.name;
  switch (clickedNode.type) {
    case "发起节点": {
      clickedNode.assignee = nodeConfig.assignee;
      clickedNode.permission = nodeConfig.permission;
      break;
    }
    case "审批节点": {
      clickedNode.assignee = nodeConfig.assignee;
      clickedNode.permission = nodeConfig.permission;
      clickedNode.sequence = nodeConfig.sequence;
      clickedNode.percentage = nodeConfig.percentage;
      clickedNode.canAdd = nodeConfig.canAdd;
      clickedNode.alternativeNext = nodeConfig.alternativeNext;
      break;
    }
    case "条件节点": {
      clickedNode.condition = nodeConfig.condition;
      break;
    }
    case "子流程节点": {
      clickedNode.subProcessId = nodeConfig.subProcessId;
      clickedNode.inParameters = nodeConfig.inParameters;
      clickedNode.outParameters = nodeConfig.outParameters;
      break;
    }
    case "定时器节点": {
      clickedNode.time.unit = nodeConfig.time.unit;
      clickedNode.time.num = nodeConfig.time.num;
      break;
    }
    case "通知节点": {
      clickedNode.notice.content = nodeConfig.notice.content;
      clickedNode.notice.channel = nodeConfig.notice.channel;
      clickedNode.notice.assignee = nodeConfig.assignee;
      break;
    }
    case "分流节点": {
      clickedNode.logic = nodeConfig.logic;
      break;
    }
  }
};

defineExpose({
  updateNodeConfig,
});

onMounted(() => {
  initNodeConfig();
});

onUnmounted(() => {});
</script>

<style lang="less" scoped>
#approval-node-container {
  width: 98%;
  height: 100%;
  padding: 0 15px;
  overflow-y: scroll;
}
#approval-node-container::-webkit-scrollbar {
  display: none;
}
.box-card {
  width: 100%;
  margin-bottom: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// 用户配置表单的样式修改
.specific-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #f1ecec;
}
:deep(.el-dialog__body) {
  padding: 7px 20px 4px 20px;
}
.specific-container-tree {
  width: 50%;
  padding: 5px 15px;
  border-right: 1px solid #f1ecec;
}
.specific-container-list {
  width: 50%;
}
.specific-container-list-header {
  box-sizing: border-box;
  width: 100%;
  padding: 5px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1ecec;
}
.specific-container-list-body {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 15px;
}
</style>
