<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
    customDragCanvasObj: { // 自定义拖拽的canvas对象所需参数
        type: Object,
        default: () => {
            return {
                url: "",
                id: "",
                copyId: ""
            }
        }
    },
    isShowTooltip: { // 是否显示tooltip
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(["returnColorXY"])

const showCopy = ref(false)
const scale = ref(1)
const x = ref(0)
const y = ref(0)

onMounted(() => {
    drawCanvas()
})

// 使用图片url绘制canvas，且根据图片长宽，找出最小的缩放比例，使图片能够完整显示在canvas中
function drawCanvas() {
    let image = new Image()
    let url = props.customDragCanvasObj.url
    let dom = document.getElementById(props.customDragCanvasObj.id)
    
    image.src = url
    image.crossOrigin = "Anonymous"
    image.onload = function() {
        // 根据图片长宽，找出最小的缩放比例，使图片能够完整显示在canvas中
        let bestScale = calcBestScale(image, dom.offsetWidth, dom.offsetHeight)
        let drawImageWidth = image.width * bestScale
        let drawImageHeight = image.height * bestScale
        dom.width = dom.offsetWidth
        dom.height = dom.offsetHeight
        let ctx = dom.getContext("2d")
        ctx.clearRect(0, 0, dom.width, dom.height)
        
        // 清空隐藏的画布
        ctx.clearRect(0, 0, drawImageWidth, drawImageHeight);
        // 重置变换矩阵
        ctx.translate(x.value, y.value);
        ctx.scale(scale.value, scale.value)
        ctx.drawImage(image, 0, 0, drawImageWidth, drawImageHeight)
    }
}

// 根据图片长宽，找出最小的缩放比例，使图片能够完整显示在canvas中
function calcBestScale(img, deviceWidth, deviceHeight) {
    return Math.min(deviceWidth / img.width, deviceHeight / img.height)
}

// 鼠标滚轮缩放canvas
function scrollCanvas(e) {
    if (e.wheelDelta > 0) {
        scale.value = scale.value + 0.5
    } else {
        if (scale.value <= 0.5) {
            return
        }
        scale.value = scale.value - 0.5
    }
    
    drawCanvas()
}

// 处理canvas拖拽移动开始，以下引入copy的canvas目的是为了解决拖拽canvas时会出现多个图层一起被拖拽问题
// 记录鼠标是否按下
const isMouseDown = ref(false)

// 鼠标最后的位置
const lastMouseX = ref(0)
const lastMouseY = ref(0)

import { nextTick } from "vue"

// 鼠标按下，将copy的canvas显示出来，并记录鼠标按下位置，用于计算鼠标移动的距离
function mouseDownCanvas(e) {
    // 当鼠标移动时，清空tooltip，以及用于展示tooltip的div
    if (document.querySelector("#customTooltip")) {
        document.body.removeChild(document.querySelector("#customTooltip"))
    }
    
    if (document.querySelectorAll(".custom-tooltip").length != 0) {
        document.querySelectorAll(".custom-tooltip").forEach(item => {
            item.parentNode.removeChild(item)
        })
    }
    
    isMouseDown.value = true
    
    lastMouseX.value = e.clientX
    lastMouseY.value = e.clientY
    
    showCopy.value = true
    
    nextTick(() => {
        drawCopyCanvas()
    })
}

// 绘制copy的canvas，方式是将原来的canvas绘制到copy的canvas上
function drawCopyCanvas() {
    let dom = document.getElementById(props.customDragCanvasObj.id)
    let copyDom = document.getElementById(props.customDragCanvasObj.copyId)
    
    copyDom.width = dom.width
    copyDom.height = dom.height
    let ctx = copyDom.getContext("2d")
    ctx.drawImage(dom, 0, 0, dom.width, dom.height)
}

// 鼠标移动，计算鼠标移动的距离，清空copy的canvas，根据位置绘制原始canvas
function mouseMoveCanvas(e) {
    if (isMouseDown.value) {
        let deltaX = e.clientX - lastMouseX.value
        let deltaY = e.clientY - lastMouseY.value
        
        let copyDom = e.target
        
        x.value += deltaX
        y.value += deltaY
        
        var ctx = copyDom.getContext("2d");
        // 清空隐藏的画布
        ctx.clearRect(0, 0, copyDom.width, copyDom.height);
        
        drawCanvas()
        
        lastMouseX.value = e.clientX
        lastMouseY.value = e.clientY
    }
    
}

// 鼠标抬起，隐藏copy的canvas
function mouseUpCanvas() {
    showCopy.value = false
    
    isMouseDown.value = false
}

function mouseEnterCanvas() {
    document.querySelector(".page-main").style.overflow = "hidden"
}

function mouseLeaveCanvas() {
    document.querySelector(".page-main").style.overflow = "auto"
}

// 至此，结束处理canvas拖拽移动


// 鼠标移动到canvas上，读取鼠标位置的像素点颜色，显示在tooltip上
// 以下是将tooltip封装一下，使其可以接收参数，通过函数调用生成
import customTooltip from "./customTooltip/index.js";

// 读取鼠标位置的像素点颜色，显示在tooltip上
function readColor(e) {
    // 当鼠标移动时，清空tooltip，以及用于展示tooltip的div
    if (document.querySelector("#customTooltip")) {
        document.body.removeChild(document.querySelector("#customTooltip"))
    }
    
    if (document.querySelectorAll(".custom-tooltip").length != 0) {
        document.querySelectorAll(".custom-tooltip").forEach(item => {
            item.parentNode.removeChild(item)
        })
    }
    
    let dom = e.target
    
    // 设置 willReadFrequently 属性为 true 来提高性能。这个属性是 HTML Canvas 规范中的一个概念，它可以用于优化 Canvas 的读取操作。
    // 通过设置 willReadFrequently 属性为 true，浏览器可以根据这一提示来优化内部的渲染和缓存策略，以提高多次读取像素数据的性能。
    dom.willReadFrequently = true;
    
    let ctx = dom.getContext("2d");
    
    let pixelData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    
    if (pixelData[3] == 0) {
        return
    }
    
    let color = "rgba(" + pixelData[0] + ", " + pixelData[1] + ", " + pixelData[2] + ", " + (pixelData[3] / 255) + ")";
    
    if(props.isShowTooltip){
        // 输出颜色信息
        customTooltip({
            x: e.clientX,
            y: e.clientY,
            content: color
        })
        
    }
    
    // 返回鼠标位置的像素点颜色
    emits("returnColorXY", {
        x: e.clientX,
        y: e.clientY,
        content: color
    })
}

function changeCanvas(type) {
    switch (type) {
        case 1:
            scale.value = 1
            x.value = 0
            y.value = 0
            drawCanvas()
            break
        
        case 2:
            scale.value = scale.value + 0.5
            drawCanvas()
            break
        
        case 3:
            if (scale.value <= 0.5) {
                return
            }
            scale.value = scale.value - 0.5
            drawCanvas()
            break
        
        default:
            break
    }
}
</script>

<template>
    <div class="customDragCanvas-index">
        <canvas :id="props.customDragCanvasObj.copyId" v-if="showCopy"
                @mouseup="mouseUpCanvas"
                @mousemove="mouseMoveCanvas"
                @mouseleave="mouseUpCanvas"
                class="copyCanvas"></canvas>
        <canvas :id="props.customDragCanvasObj.id"
                @mouseenter="mouseEnterCanvas"
                @mouseleave="mouseLeaveCanvas"
                @mousedown="mouseDownCanvas"
                @mousemove="readColor"
                @mousewheel="scrollCanvas"></canvas>
        <div class="customDragCanvas-index-icon">
            <img src="./images/reduction.png" @click="changeCanvas(1)">
            <img src="./images/amplify.png" @click="changeCanvas(2)">
            <img src="./images/reduce.png" @click="changeCanvas(3)">
        </div>
    </div>
</template>

<style scoped lang="less">
.customDragCanvas-index {
    width: 100%;
    height: 100%;
    position: relative;
    
    .copyCanvas {
        position: absolute;
        top: 0;
        left: 0
    }
    
    > canvas {
        width: 100%;
        height: 100%;
    }
    
    &-icon {
        position: absolute;
        right: 0.2rem;
        bottom: 0.2rem;
        height: 1.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        > img {
            width: 0.32rem;
            cursor: pointer;
        }
    }
}
</style>
