import G6 from "@antv/g6"

// 通知节点
G6.registerNode("NoticeNode", {
    draw: (cfg, group) => {
        // 最外层矩形框
        const keyShape = group.addShape("rect", {
            name: "noticenode-rect",
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
        group.addShape('rect', {
            name: "noticenode-title-rect",
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 28,
                // 填充色
                fill: '#f52828',
                radius: [7, 7, 0, 0],
                cursor: "pointer"
            }
        });
        // 标题文字
        group.addShape('text', {
            name: "noticenode-title-text",
            attrs: {
                y: 22,
                x: 35,
                text: cfg.name.length > 11 ? cfg.name.substring(0, 11) + "······" : cfg.name,
                fontSize: 12,
                fill: '#fff',
                cursor: "pointer"
            },
        });
        // 标题矩形框的 icon
        group.addShape("image", {
            name: "noticenode-title-icon",
            attrs: {
                y: 7,
                x: 18,
                width: 15,
                height: 15,
                img: "../../../src/assets/icons/tongzhi.png",
                cursor: "pointer"
            }
        });
        // 文本框
        group.addShape('rect', {
            name: "noticenode-body-rect",
            attrs: {
                x: 0,
                y: 28,
                width: 220,
                height: 52,
                fill: '#fff',
                radius: [0, 0, 7, 7],
                cursor: 'pointer'
            },
        });
        // 文本框内文字
        group.addShape('text', {
            name: "noticenode-body-text",
            attrs: {
                y: 60,
                x: 18,
                text: '点击设置通知节点',
                fill: '#000',
                cursor: "pointer"
            },
        });
        // 删除按钮（文本）
        group.addShape('text', {
            name: 'noticenode-delete',
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
            name: "noticenode-body-icon",
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
}, "single-node");