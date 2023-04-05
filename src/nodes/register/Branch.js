import G6 from "@antv/g6";

// 条件节点
G6.registerNode("ConditionNode", {
    draw: (cfg, group) => {
        // 最外侧矩形框
        const keyShape = group.addShape("rect", {
            name: "conditionnode-rect",
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 80,
                stroke: "#7c7a7a",
                radius: 7
            }
        });
        // 标题矩形框
        group.addShape("rect", {
            name: "conditionnode-title-rect",
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 28,
                fill: '#545353',
                radius: [7, 7, 0, 0],
                cursor: 'pointer'
            }
        });
        // 标题文字
        group.addShape("text", {
            name: "conditionnode-title-text",
            attrs: {
                y: 22,
                x: 18,
                text: cfg.name.length > 13 ? cfg.name.substring(0, 13) + "······" : cfg.name,
                fontSize: 12,
                fill: '#fff',
                cursor: "pointer"
            },
        });
        // 文本框
        group.addShape('rect', {
            name: "conditionnode-body-rect",
            attrs: {
                x: 0,
                y: 28,
                width: 220,
                height: 52,
                fill: '#fff',
                radius: [0, 0, 7, 7],
                cursor: "pointer"
            }
        });
        // 文本框内文字
        group.addShape('text', {
            name: "conditionnode-body-text",
            attrs: {
                y: 60,
                x: 18,
                text: '点击设置该分支的条件',
                fill: '#000',
                cursor: "pointer"
            },
        });
        // 删除按钮（文字）
        group.addShape('text', {
            name: "conditionnode-delete",
            attrs: {
                y: 28,
                x: 195,
                fontWeight: 600,
                fontSize: 25,
                text: '×',
                fill: '#fff',
                isDel: 1,
                cursor: 'pointer'
            },
        });
        // 文本框箭头
        group.addShape("image", {
            name: "conditionnode-body-icon",
            attrs: {
                y: 49,
                x: 199,
                width: 10,
                height: 10,
                img: "../../../src/assets/icons/gengduo.png",
                cursor: "pointer"
            }
        });
        return keyShape;
    }
}, "single-node");

// “添加”分支节点
G6.registerNode("AddBranchNode", {
    draw: (cfg, group) => {
        cfg.size = [220, 60]
        const keyShape = group.addShape("rect", {
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 30,
            }
        });
        group.addShape('rect', {
            attrs: {
                x: 60,
                y: 10,
                width: 100,
                height: 30,
                // 填充色
                fill: '#fff',
                // 边框
                stroke: '#dedbdb',
                radius: 15,
                cursor: 'pointer'
            },
        })
        group.addShape('text', {
            attrs: {
                y: 34,
                x: 82,
                text: '添加分支',
                fontSize: 14,
                fill: '#807e7e',
                cursor: 'pointer'
            },
        });
        return keyShape;
    }
});