<script setup>
import customDragCanvas from "@/components/customDragCanvas/index.vue" // 组件地址

const customDragCanvasObj = {
    url: "http://code.scentralit.com:8085/img/79/4/1/1_Trajectory_.png",
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
