<script setup>
import { ElTooltip } from "element-plus"

const props = defineProps({
    x: {
        type: Number,
        default: 0,
        required: true
    },
    y: {
        type: Number,
        default: 0,
        required: true
    },
    content: {
        type: String,
        default: "",
        required: true
    }
})

</script>

<template>
    <div>
        <el-tooltip
            popper-class="custom-tooltip"
            visible
            effect="dark"
            :content="props.content"
            :hide-after="0"
            :show-arrow="false"
            :offset="20"
            placement="top"
        >
            <div style="width: 1px;height: 1px;position:fixed;z-index: -1"
                 :style="{'top':props.y + 'px','left':props.x + 'px'}"></div>
        </el-tooltip>
    </div>
</template>

<style scoped lang="less">

</style>
