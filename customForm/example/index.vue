<script setup>
import customForm from "@/components/customForm/index.vue" // 组件地址

const dialogVisible = ref(false)
const customFormTitle = ref("")
const customSubmitType = ref(1) // form表单的提交按钮的类型，一般情况下1代表新增的提交按钮，2代表修改的提交按钮
const customFormModel = ref({
    projectId: "",
    number: "",
})
const customFormRules = ref({
    projectId: [
        { required: true, message: "请选择项目名称", trigger: "blur" }
    ],
    number: [
        { required: true, message: "请输入编号", trigger: "blur" }
    ]
})
const customFormItemArr = ref([
    {
        label: "项目名称",
        prop: "projectId",
        type: "select",
        placeholder: "请选择项目名称",
        disabled: false,
        optionsArr: [],
        optionsKey: "id",
        optionsLabel: "name",
        optionsValue: "id"
    },
    {
        label: "编号",
        prop: "number",
        type: "input",
        placeholder: "请输入编号",
        disabled: false
    }
])

function add() {
    customFormTitle.value = "添加"
    customSubmitType.value = 1
    delete customFormModel.value.id
    customFormModel.value.projectId = ""
    customFormModel.value.number = ""
    dialogVisible.value = true
}

function edit(obj){
    customFormTitle.value = "编辑"
    customSubmitType.value = 2
    customFormModel.value.id = obj.id
    customFormModel.value.projectId = obj.projectId
    customFormModel.value.number = obj.number
    dialogVisible.value = true
}

function closeDialog() {
    dialogVisible.value = false
}

function submitForm(obj, type) {
    let url = ""
    if (type == 1) {
        url = ""
    } else if (type == 2) {
        url = ""
    }
    post(url, obj).then(res => {
        dialogVisible.value = false
    })
}
</script>

<template>
    <div>
        <button @click="add">添加</button>
        <button @click="edit">添加</button>
        
        <custom-form :dialogVisible="dialogVisible" :customFormTitle="customFormTitle" :customSubmitType="customSubmitType"
                     :customFormModel="customFormModel"
                     :customFormRules="customFormRules" :customFormItemArr="customFormItemArr"
                     @closeDialog="closeDialog" @submitForm="submitForm"></custom-form>
    </div>
</template>

<style scoped lang="less">

</style>
