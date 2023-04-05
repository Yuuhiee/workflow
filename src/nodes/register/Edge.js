import G6 from "@antv/g6";

G6.registerEdge("flow-line", {
    // 绘制边
    draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        return group.addShape('path', {
            attrs: {
                stroke: "#c6c6c6",
                lineWidth: 2,
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', startPoint.x, startPoint.y + 35],
                    ['L', endPoint.x, startPoint.y + 35],
                    ['L', endPoint.x, endPoint.y]
                ],
            },
        });
    }
})