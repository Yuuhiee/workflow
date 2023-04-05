/**
 * Object 转为 JSON 格式字符串
 */
export function getJSON(object) {
    return JSON.stringify(object);
}

/**
 * JSON 字符串转 JSON 文件
 */

// File() 构造器创建新的 File 对象实例
// let file = new File(bits, name, [options]);
//
// 参数
// bits
// ArrayBuffer，ArrayBufferView，Blob，或者 DOMString 对象的 Array — 或者任何这些对象的组合，这是 UTF-8 编码的文件内容。
// name
// 文件名称，或者文件路径
// options 可选
// 选项对象，包含文件的可选属性。可用的选项如下：
// type: DOMString，表示将要放到文件中的内容的 MIME 类型。默认值为 “”
// lastModified: 数值，表示文件最后修改时间的 Unix 时间戳（毫秒）。默认值为 Date.now()
export function getJsonFile(workflow) {
    let content = JSON.stringify(workflow);
    // 数据转换成 blob 对象
    let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    // blob 转化为 file
    let file = new File([blob], "workflow", { lastModified: Date.now() });

    console.log(file);
}