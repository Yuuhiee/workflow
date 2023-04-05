import G6 from "@antv/g6"

// “添加”节点
G6.registerNode("AddNode", {
    draw: (cfg, group) => {
        // 最外层的矩形框
        const keyShape = group.addShape('rect', {
            name: "addnode-home-rect",
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 80
            },
        });
        // 圆形框
        group.addShape('rect', {
            name: "addnode-main-rect",
            attrs: {
                x: 95,
                y: 25,
                width: 30,
                height: 30,
                radius: 15,
                fill: "#5da3ec",
                cursor: "pointer"
            },
        });
        // 加号
        group.addShape('text', {
            name: "addnode-text",
            attrs: {
                x: 103,
                y: 49,
                text: "+",
                fontSize: 22,
                fill: '#fff',
                cursor: "pointer"
            },
        });
        return keyShape;
    }
});