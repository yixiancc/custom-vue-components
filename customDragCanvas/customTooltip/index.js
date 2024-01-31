// 实现使用函数调用组件的逻辑
//   引入 创建虚拟节点 和渲染方法
import { createVNode, render } from "vue"
// 引入信息提示组件
import customTooltip from "./index.vue"

export default ({ x, y, content }) => {
    // 当鼠标移动时，清空tooltip，以及用于展示tooltip的div
    if (document.querySelector("#customTooltip")) {
        document.body.removeChild(document.querySelector("#customTooltip"))
    }

    if (document.querySelectorAll(".custom-tooltip").length != 0) {
        document.querySelectorAll(".custom-tooltip").forEach(item => {
            item.parentNode.removeChild(item)
        })
    }

    // 准备dom容器
    const div = document.createElement("div")

    div.id = "customTooltip"
    // 添加到body上
    document.body.appendChild(div)

    // 实现：根据MessageMain.vue渲染消息提示
    // 1. 导入组件
    // 2. 根据组件创建虚拟节点   第一个参数为要创建的虚拟节点  第二个参数为props的参数
    const vnode = createVNode(customTooltip, { x, y, content })
    // 3. 准备一个DOM容器
    // 4. 把虚拟节点渲染DOM容器中
    render(vnode, div)
}
