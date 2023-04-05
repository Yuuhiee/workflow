import G6 from "@antv/g6";

// 发起节点
G6.registerNode("StartNode", {
    draw: (cfg, group) => {
        console.log(cfg);
        const oldName = cfg.name;
        // 最外层矩形框
        const keyShape = group.addShape("rect", {
            name: "startnode-rect",
            // 图形的属性
            attrs: {
                // 矩形左上角的 x 和 y 坐标
                x: 0,
                y: 0,
                // 矩形的宽度和高度
                width: 220,
                height: 80,
                // 边框
                stroke: "#7c7a7a",
                // 定义圆角
                radius: 7
            }
        })
        // 标题矩形框
        group.addShape('rect', {
            name: "startnode-title-rect",
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 28,
                fill: '#f57b00',
                radius: [7, 7, 0, 0],
                // 鼠标在节点上的样式
                cursor: "pointer"
            }
        });
        // 标题文字
        group.addShape('text', {
            name: "startnode-title-text",
            attrs: {
                y: 22,
                x: 35,
                text: cfg.name.length > 11 ? cfg.name.substring(0, 11) + "······" : cfg.name,
                fontSize: 12,
                fill: '#fff',
                // 鼠标在节点上的样式
                cursor: "pointer"
            },
        });
        // 标题矩形框的 icon
        group.addShape("image", {
            name: "startnode-title-icon",
            attrs: {
                y: 8,
                x: 18,
                width: 14,
                height: 14,
                img: "../../../src/assets/icons/faqi.png",
                cursor: "pointer"
            }
        });
        // 文本框
        group.addShape("rect", {
            name: "startnode-body-rect",
            attrs: {
                // 矩形左上角的 x 和 y 坐标
                x: 0,
                y: 28,
                // 矩形的宽度和高度
                width: 220,
                height: 52,
                // 填充色
                fill: "#fff",
                // 定义圆角
                radius: [0, 0, 7, 7],
                // 鼠标在节点上的样式
                cursor: 'pointer'
            },
        });
        // 文本框内文字
        group.addShape('text', {
            name: "startnode-body-text",
            attrs: {
                y: 60,
                x: 18,
                // 文本内容
                text: "点击配置发起节点",
                // 文字颜色
                fill: '#000',
                // 鼠标在节点上的样式
                cursor: "pointer"
            },
        });
        // 文本框箭头
        group.addShape("image", {
            name: "startnode-body-icon",
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
    },

}, "single-node")