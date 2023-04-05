import { v1 } from "uuid";

// 根据时间戳和 MAC 地址生成 UUID
export default function getUUID() {
    return v1();
}