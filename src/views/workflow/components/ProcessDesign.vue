<template>
    <div ref="process-design-container" id="process-design-container">
        <!-- 工作流画布 -->
        <div class="graphParent" ref="graphParent">
            <div id="graph-container" ref="container"></div>
        </div>
        <!-- 新增节点对话框 -->
        <el-dialog v-model="addNodeDialogVisible" title="请选择待添加的节点类型" width="35%">
            <el-form :model="addNodeForm" label-width="120px">
                <!-- 节点 id -->
                <el-form-item :required="true" label="新增节点 id" size="large">
                    <el-input v-model="addNodeForm.newNodeId" disabled style="width: 400px"></el-input>
                </el-form-item>
                <!-- 节点名称 -->
                <el-form-item :required="true" label="新增节点名称" size="large">
                    <el-input v-model="addNodeForm.newNodeName" placeholder="请输入新增节点的名称" style="width: 350px"></el-input>
                </el-form-item>
                <!-- 节点类型 -->
                <el-form-item :required="true" label="新增节点类型" size="default">
                    <el-radio-group v-model="addNodeForm.newNodeType">
                        <el-radio v-for="(item, index) in addNodeTypes" :key="index" :label="item.type" border
                            style="margin-bottom: 10px; margin-right: 10px">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addNodeDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addWorkflowNode">增加</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 节点信息配置抽屉 -->
        <el-drawer v-if="nodeConfigDrawerVisible" v-model="nodeConfigDrawerVisible" direction="rtl" size="35%">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId" :class="titleClass">工作流节点信息配置</h4>
            </template>
            <NodeConfig :model="clickedNode.model" :middleNodeRepository="middleNodeRepository" ref="nodeConfigComponent">
            </NodeConfig>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelUpdateConfiguration">取消</el-button>
                    <el-button type="primary" @click="confirmUpdateConfiguration">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from "vue";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { useStore } from 'vuex'
import getUUID from "../../../utils/uuid.js"

import G6 from "@antv/g6";

import { middleToG6Translator } from "../../../translator/middle-g6/translator.js"

import { ElMessageBox, ElMessage } from "element-plus";

// 自定义节点的导入
import "../../../nodes/export.js"
import NodeConfig from "./NodeConfig.vue";

// 节点操作
import { addNode, addBranch, deleteNode } from "../../../translator/middle-g6/nodeEditor.js"

/**
 * 工作流绘制模块
 */
// 从 vuex 获得 workflow 数据
const store = useStore();

// 中间结构对应的工作流结构
let workflow = null;
// 中间结构对应的节点映射
let middleNodeRepository = null;
// G6 对应的工作流渲染数据（节点集合和边集合）
let renderData = null;
// G6 画布渲染的工作流图
let renderGraph = null;

// 点击的节点的模型
let clickedNode = reactive({
    item: null,
    model: null
});

// 图的画布的父组件
let graphParent = $ref();
// 画布渲染函数（所有的图的更新等都使用该函数去控制）
const render = (isFitCenter) => {
    // 获得待渲染的数据
    renderData = middleToG6Translator(workflow);

    // 创建画布
    renderGraph = new G6.Graph({
        // 图存放的 DOM 容器
        container: "graph-container",
        // 图的画布的宽度和高度
        width: graphParent.clientWidth,
        height: graphParent.clientHeight,
        // 交互模式
        modes: {
            default: ['drag-canvas', 'zoom-canvas']
        },
        // 布局配置（层次布局）
        layout: {
            type: "dagre",
            preventOverlap: false,
            // 布局的方向 T：top，B：bottom
            rankdir: "TB",
            // 层间距（px），TB 是竖直方向相邻层间距
            ranksep: 2,
            // TB 是节点的水平间距
            nodesep: -10,
        },
        // 默认情况下全局节点的配置项
        defaultNode: {
            // 节点名称
            type: 'dom-node',
            // 节点的大小
            size: [350, 80]
        },
        // 内置边属性
        defaultEdge: {
            type: 'flow-line'
        },
        // 指定边是否连入节点的中心
        linkCenter: true,
        // 是否使图中心对齐画布中心
        fitCenter: isFitCenter,
        nodeStateStyles: {
            mouseenter: {
                stroke: "#7dafea",
                lineWidth: "2",
                shadowColor: "#388bee",
                shadowBlur: "12",
                fillOpacity: "0.8",
            }
        }
    });

    // 绑定鼠标点击监听事件
    renderGraph.on("node:click", async (event) => {
        // item：被操作的 item
        // target：被操作的具体图形
        const item = event.item;
        const target = event.target;

        // 配置被点击节点的数据模型
        clickedNode.item = item;
        clickedNode.model = item._cfg.model;

        // 当前点击的图形类型
        const currentShape = event.item.get('currentShape');

        // 删除事件的处理逻辑
        if (target.attr("isDel")) {
            // 删除的具体处理逻辑
            await deleteNode(middleNodeRepository, clickedNode.model.id);
        }
        // 添加节点事件（点击“添加”节点）的处理逻辑
        else if (currentShape === "AddNode") {
            // 新增节点的 id
            addNodeForm.newNodeId = getUUID();
            addNodeDialogVisible.value = true;
        }
        // 添加分支事件（点击“添加分支”节点）的处理逻辑
        else if (currentShape === "AddBranchNode") {
            try {
                await ElMessageBox.confirm(
                    '请确认操作类型（添加分支、配置分流节点）',
                    '操作选择',
                    {
                        confirmButtonText: '添加分支',
                        cancelButtonText: '配置节点',
                        type: 'warning',
                    }
                );
                addBranch(middleNodeRepository, clickedNode.model.id);
            } catch (error) {
                // 打开配置节点信息抽屉
                nodeConfigDrawerVisible.value = true;
            }
        }

        // 工作流的节点类型
        const nodeTypes = ["StartNode", "ApprovalNode", "SubProcess", "ConditionNode", "TimerNode", "NoticeNode"];

        // 如果点击节点是主要的工作流节点，则需要打开抽屉进行节点信息配置
        if (nodeTypes.includes(currentShape) && !target.attr("isDel")) {
            // 打开抽屉
            nodeConfigDrawerVisible.value = true;
        }

        reRender();
        renderGraph.layout();
    });

    // 绑定鼠标移入监听事件
    renderGraph.on("node:mouseenter", (event) => {
        const { item } = event;
        renderGraph.setItemState(item, "mouseenter", true);
    });

    // 绑定鼠标移出监听事件
    renderGraph.on('node:mouseleave', (event) => {
        const { item } = event;
        renderGraph.setItemState(item, "mouseenter", false);
    });

    // 读取数据源 data 到 graph 实例
    renderGraph.data(renderData);
    // 渲染图
    renderGraph.render();
}
// 画布重新渲染函数
const reRender = () => {
    // 画布销毁后，重新渲染需要获得销毁前的缩放比例和画布位置

    // 1. 缩放比例
    const zoom = renderGraph.getZoom();
    // 2. (0, 0) 点在画布的位置
    const lastPoint = renderGraph.getCanvasByPoint(0, 0);

    // 根据工作流结构的变化重构展示数据
    renderData = middleToG6Translator(workflow);
    // 销毁图
    renderGraph.destroy();

    // 渲染图
    render(false);

    // 获取重新渲染后 (0, 0) 点的位置
    const newPoint = renderGraph.getCanvasByPoint(0, 0);

    // 先缩放后移动位置
    renderGraph.zoomTo(zoom);
    renderGraph.translate(lastPoint.x - newPoint.x, lastPoint.y - newPoint.y);
}
// 根据页面的大小自动调整画布的大小
const initCanvasSize = () => {
    setTimeout(() => {
        window.onresize = function () {
            // 根据容器的大小自动调整画布的大小
            // 参数是父组件的宽高
            renderGraph.changeSize(graphParent.clientWidth, graphParent.clientHeight);
            // 平移画布时图的中心将对齐到画布中心
            renderGraph.fitCenter();
        }
    }, 0);
}

/**
 * 添加节点模块
 */
// 添加节点对话框显示状态控制变量
let addNodeDialogVisible = ref(false);

// 新增节点弹窗对应的 form
let addNodeForm = reactive({
    newNodeId: "",
    newNodeName: "",
    newNodeType: ""
});

// 用于配置节点单选框
const addNodeTypes = [
    { type: "ApprovalNode", name: "审批节点" },
    { type: "SubProcess", name: "子流程节点" },
    { type: "NoticeNode", name: "通知节点" },
    { type: "TimerNode", name: "定时器节点" },
    { type: "BranchNode", name: "分流节点" }
];

// 添加节点
function addWorkflowNode() {
    if (addNodeForm.newNodeName === "") {
        ElMessage({
            message: "新增节点名称不能为空！",
            type: "warning"
        });
    } else {
        addNode(middleNodeRepository, clickedNode.model.id, addNodeForm);
        reRender();
    }

    // 清空表单
    addNodeForm.newNodeName = "";
    addNodeForm.newNodeType = "";
    // 关闭弹窗
    addNodeDialogVisible.value = false;
}

/**
 * 节点配置模块
 */
// 控制节点配置抽屉是否显示
let nodeConfigDrawerVisible = ref(false);

// 抽屉的节点配置子组件
const nodeConfigComponent = $ref();

// 修改节点配置
const emit = defineEmits(["openLoading", "cancelLoading"]);
const confirmUpdateConfiguration = () => {

    emit("openLoading");

    nodeConfigComponent.updateNodeConfig();

    reRender();

    emit("cancelLoading");

    nodeConfigDrawerVisible.value = false;
}
// 取消修改节点配置
const cancelUpdateConfiguration = () => {
    nodeConfigDrawerVisible.value = false;
}

// 组件内容渲染时执行
onMounted(() => {
    workflow = store.getters.getWorkflow;
    middleNodeRepository = store.getters.getMiddleNodeRepository;
    render(true);
    initCanvasSize();
});

// 组件销毁时执行
onUnmounted(() => {
    store.commit("updateWorkflow", workflow);
    store.commit("updateMiddleNodeRepository", middleNodeRepository);
    window.onresize = null;
});
</script>

<style scoped>
#process-design-container {
    width: 100%;
    height: 100%;
    background-color: aliceblue;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.graphParent {
    width: 98%;
    height: 97%;
    background-color: #fff;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.04) 0 12px 32px 4px;
}</style>