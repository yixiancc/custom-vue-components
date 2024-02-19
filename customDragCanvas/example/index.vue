<script setup>
import customDragCanvas from "../index.vue" // 组件地址

const customDragCanvasObj = {
    url: "", // 图片地址
    id: "lalala",
    copyId: "lalalaCopy"
}

function returnColorXY(obj) {
    console.log(obj)
}
</script>

<template>
    <div>
        <custom-drag-canvas :customDragCanvasObj="customDragCanvasObj"
                            isShowTooltip
                            @returnColorXY="returnColorXY"
        ></custom-drag-canvas>
    </div>
</template>

<style scoped lang="less">

</style>
