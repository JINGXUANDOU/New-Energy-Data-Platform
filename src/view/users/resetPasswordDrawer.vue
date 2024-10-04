<template>

    <div >
        <el-drawer title="密码重置" :visible.sync="resetPasswordVisible"  :before-close = "closePage" class="adduser-box">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item label="用户账号: ">
                    <el-input v-model="rowAccount" style="width: 350px;" :readonly="true"></el-input>    
                </el-form-item>      
                <el-form-item label="新密码: " prop="newPassword">
                    <el-input v-model="form.newPassword" autocomplete="off" placeholder="请输入" style="width: 350px; margin-bottom: 20px;"></el-input>
                </el-form-item> 
                <el-form-item label="确认密码: " prop="verifyPassword">
                    <el-input v-model="form.verifyPassword" autocomplete="off" placeholder="请输入" style="width: 350px;"></el-input>
                </el-form-item>                          
            </el-form>
            <div style="position: fixed;bottom: 40px;right: 75px;">
                <el-button type="text" @click="closePage">取消</el-button>
                <el-button type="primary" @click="getFormValue">确定</el-button>
            </div>
        </el-drawer>
    </div>

</template>
    
    
    
<script>
    export default {
        name: 'resetPassword',
        components: {},

        props:['resetPasswordVisible', 'rowAccount'],
        data() {
            return {
                form: {
                    newPassword: '',
                    verifyPassword: '',
                },
                rules: {
                    newPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    verifyPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }
            }

        },
        methods: {
            resetForm() {
                this.form.newPassword = '';
                this.form.verifyPassword = '';
            },

            closePage (form) {
                this.resetForm();
                this.$emit('childEvent');
            },

            getFormValue () {
                // 判断必要信息是否齐全
                var warnMes = "";
                if (this.form.newPassword == '' || this.form.verifyPassword == '') {
                    warnMes += "密码不能为空！";
                } else if (this.form.newPassword != this.form.verifyPassword){
                    warnMes += "确认密码不匹配！"
                }

                if (warnMes != "") {
                    this.$notify({
                        title: '错误',
                        message: warnMes,
                        type: 'warning'
                    });                    
                } else {                   
                    this.$emit('childEvent', this.form);
                    this.resetForm(); 
                }
            },
            
        }
    }
</script>
    
    
    
<style scoped lang="less">
.adduser-box{

    /deep/ .el-form-item__label{
        color:#000;    
    }

    /deep/ .el-form-item{
        color:#000;    
    }

    /deep/ .el-input__inner{
        color:#000;
    }

    /deep/ .el-button{
        color:#000;
        border-color: rgb(21, 47, 72);
    }    
}
</style>