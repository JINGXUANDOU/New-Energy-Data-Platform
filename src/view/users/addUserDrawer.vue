<template>

    <div id = "addUserDrawer">
        <el-drawer  :title="drawerTitle" :visible.sync="addUserVisible"  :before-close = "closePage" class="adduser-box">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item label="用户账号: " prop="account">
                    <el-input v-if="modifyVisible" v-model="form.account" style="width: 350px;" :readonly="true"></el-input>
                    <el-input v-else v-model="form.account" autocomplete="off" placeholder="请输入" style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="姓名: " prop="name">
                    <el-input v-model="form.name" autocomplete="off" placeholder="请输入" style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="头像: ">
                    <el-avatar icon="el-icon-user-solid"></el-avatar></el-form-item>
                    <el-form-item label="隶属: " prop="affiliation">
                        <el-select v-model="form.affiliation" placeholder="请选择" style="width: 350px;">
                            <el-option label="试验组" value = "试验组"></el-option>
                        </el-select></el-form-item>
                <el-form-item label="角色: ">
                    <el-radio-group v-model="form.role">
                        <el-radio label="平台配置员" style=" margin-top: 7px;">平台配置员</el-radio>
                        <el-radio label="系统审计员" style=" margin-top: 7px;">系统审计员</el-radio>
                        <el-radio label="实验室人员" style=" margin-top: 7px;">实验室人员</el-radio>
                        <el-radio label="归档管理员" style=" margin-top: 15px;">归档管理员</el-radio>
                        <el-radio label="归档人员" style=" margin-top: 15px;">归档人员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号: ">
                    <el-input v-model="form.phoneNum" autocomplete="off" placeholder="请输入" style="width: 350px;"></el-input></el-form-item>
                <el-form-item label="邮箱: ">
                    <el-input v-model="form.email" autocomplete="off" placeholder="请输入" style="width: 350px;"></el-input></el-form-item>
            </el-form>


            <div style="position: fixed;bottom: 40px;right: 75px;">
                <el-button type="warning" @click="closePage">取消</el-button>
                <el-button type="primary" @click="getFormValue">确定</el-button>
            </div>

        </el-drawer>
    </div>    

</template>
    
    
    
<script>
    export default {
        name: 'addUserDrawer',
        components: {},

        props:['addUserVisible', 'modifyVisible'],
        data() {
            return {
                init(rowData){
                this.form.account = rowData.account;
                this.form.name = rowData.name;
                this.form.affiliation = rowData.affiliation;
                this.form.role = rowData.role;
                this.form.phoneNum = rowData.phoneNum;
                this.form.email = rowData.email;
            },

                form: {
                    account: '',
                    name: '',
                    affiliation: '试验组',
                    role: '平台配置员',
                    phoneNum:'',
                    email:'',
                },
                rules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    affiliation: [
                        { type: 'string', required: true, message: '请选择隶属', trigger: 'change' }
                    ],
                }
            }

        },
        computed: {
            drawerTitle() {
                return this.modifyVisible ? "编辑用户信息" : "新增用户";
            },
        },
        methods: {
            resetForm() {
                // Reset form fields
                this.form.account = '';
                this.form.name = '';
                this.form.affiliation = '试验组';
                this.form.role = '平台配置员';
                this.form.phoneNum = '';
                this.form.email = '';
            },


            closePage (form) {
                this.resetForm();
                this.$emit('childEvent');
            },

            getFormValue () {
                // 判断必要信息是否齐全
                var warnMes = "";
                if (this.form.account == '') {
                    warnMes += "用户账号 ";
                }
                if (this.form.name == '') {
                    warnMes += "姓名 ";
                }
                if (this.form.affiliation == '') {
                    warnMes += "隶属";
                }

                if (warnMes != "") {
                    this.$notify({
                        title: '缺少以下信息： ',
                        message: warnMes,
                        type: 'warning'
                    });                    
                } else {         
                    if (this.modifyVisible) {         
                        this.$emit('childEvent', this.form, 2);
                    } else {
                        this.$emit('childEvent', this.form, 1);
                    }
                    // this.resetForm(); 
                }
            },

        }
    }
</script>
    
    
    
<style scoped lang="less">
.adduser-box{
    /deep/el-form-item__label-wrap {
        margin-left: 0px;
    }
    /deep/ .el-form-item__label{
        color:#000;
    }
    /deep/ .el-input__inner{
        color:#000;
    }
    /deep/ .el-button{
        color:#000;
        border-color: rgb(0, 0, 0);
    }

    /deep/.el-radio {
        color: #000000;
    }
    /deep/.el-radio__inner {
        border: 1px solid #000000;
    }
    /deep/.el-radio__input.is-checked+.el-radio__label {
        color: #0091ff;
    }
    /deep/.el-radio__input.is-checked .el-radio__inner {
        border-color: #0091ff;
        background: #0091ff;
    }
}
</style>