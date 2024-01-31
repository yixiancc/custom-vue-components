<script setup>
// 前提是已经在main.js中引入了element-plus、customMessage，且已经挂载到vue原型上，具体代码为：
// import customMessage from "@/components/customMessage/index.js";
// app.provide("$customMessage", customMessage)
const customMessage = inject("$customMessage")

test()

function test() {
    customMessage({
        type: "success",
        content: "登陆成功！",
        duration: 800
    })
}
</script>

<template>

</template>

<style scoped lang="less">

</style>
