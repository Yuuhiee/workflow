import G6 from "@antv/g6";

// 结束节点
G6.registerNode("EndNode", {
    draw: (cfg, group) => {
        const keyShape = group.addShape('rect', {
            attrs: {
                x: 0,
                y: 0,
                width: 220,
                height: 50
            },
        });
        group.addShape('rect', {
            attrs: {
                x: 70,
                y: 0,
                width: 80,
                height: 25,
                shadowColor: '#bbb8b8',
                shadowBlur: 10,
                // 填充色
                fill: '#faf9f9',
                // 边框
                radius: 15
            },
        });
        group.addShape('text', {
            attrs: {
                y: 20,
                x: 110,
                text: '流程结束',
                textAlign: 'center',
                fontSize: 12,
                fill: '#888686'
            },
        });
        return keyShape;
    }
})