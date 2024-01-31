## 自定义信息弹窗
### 前提已在项目中引入element-plus
```javascript
import ElementPlus from "element-plus"
```

可通过main.js中app.provide("$customMessage", customMessage)设置了全局属性，使用方法为
```javascript
customMessage({
    type: "success",
    content: "登陆成功！",
    duration: 800
})
```
具体查看example文件夹内容
