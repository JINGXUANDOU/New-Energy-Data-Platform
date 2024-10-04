<template>
    <!--用户管理dialog-->
    <div style="width: 100%;height: 100%;" class="main-page">
        <el-dialog title="用户管理" :visible.sync="dialogTableVisible" :fullscreen="dialogFull" @close = "resetVisible" :before-close="handleDialogClose">
            <!--信息查询输入框-->
            <el-form :model="form">
                <!--第一行的四个输入框-->
                <el-row :gutter="20">
                    <el-col :span="6"><el-form-item label="用户账号：" :label-width="formLabelWidth">
                        <el-input v-model="form.account" autocomplete="off" placeholder="请输入"></el-input></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="姓名：" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="部门：" :label-width="formLabelWidth">
                        <el-select v-model="form.affiliation" placeholder="请选择" clearable="">
                            <el-option label="试验组" value = "试验组"></el-option>
                        </el-select></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="角色：" :label-width="formLabelWidth">
                        <el-select v-model="form.role" placeholder="请选择" clearable="">
                            <el-option label="平台配置员" value = "平台配置员"></el-option>
                            <el-option label="系统审计员" value="系统审计员"></el-option>
                            <el-option label="实验室人员" value="实验室人员"></el-option>
                            <el-option label="归档管理员" value="归档管理员"></el-option>
                            <el-option label="归档人员" value="归档人员"></el-option>
                        </el-select></el-form-item></el-col></el-row>
                <!--第二行的一个输入框和两个按钮-->
                <el-row :gutter="20">
                    <el-col :span="6"><el-form-item label="状态：" :label-width="formLabelWidth">
                        <el-select v-model="form.status" placeholder="请选择" clearable="">
                            <el-option label="可用" value = "可用"></el-option>
                            <el-option label="禁用" value = "禁用"></el-option></el-select></el-form-item></el-col>
                    <el-col :span="6"><el-button type="primary" icon="el-icon-search" @click="searchUser">查询</el-button>
                        <el-button type="primary" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button></el-col>
                </el-row>
            </el-form>
        
            <div style="position:relative">
                <!--表格右上角的两个按钮-->
                <div style="position: absolute;top: 0px;right: 2px; z-index: 3;">
                    <el-button type="primary" icon="el-icon-plus" @click="openAddD" :disabled="curPage==2">新增</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="multiDelete" :disabled="curPage==2">批量删除</el-button>
                </div>
            
                <!-- 展示表格，分为现存和已删除-->
                <el-tabs @tab-click="handleClick">
                    <!-- 现存-->
                    <el-tab-pane label="现存账号" style="width:100%;height: 100%;" @selection-change="handleSelectionChange">
                        <el-table :data="displayTable1.slice((currentPageP - 1) * pageSizeP, currentPageP * pageSizeP)" :pagination="true" stripe>
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="序号"><template slot-scope="scope">{{ scope.$index + 1 }}</template></el-table-column>
                            <el-table-column property="account" label="用户账号"></el-table-column>
                            <el-table-column property="name" label="姓名"></el-table-column>
                            <el-table-column property="role" label="角色"></el-table-column>
                            <el-table-column property="affiliation" label="隶属"></el-table-column>
                            <el-table-column property="status" label="状态">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.status" active-text="可用" inactive-text="禁用"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column property="last_login_time" label="最后登录时间"></el-table-column>
                            <el-table-column property="create_time" label="创建时间"></el-table-column>
                            <el-table-column property="operations" label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="openModD(scope.row, scope.$index)">编辑</el-button>
                                    <el-button type="text" size="small" @click="openResD(scope.row.account, scope.$index)">密码重置</el-button>
                                    <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, displayTable1)">删除</el-button>
                                </template>                            
                            </el-table-column>
                        </el-table>
                        <!--分页按钮-->
                        <el-pagination layout="total, sizes, prev, pager, next,jumper" :total="displayTable1.length" @current-change="handleCurrentChangeP" @size-change="handleSizeChangeP"
                                :current-page="currentPageP" :page-size="pageSizeP" :page-sizes="[5, 10, 20, 50]" style="text-align: center"></el-pagination>
                    </el-tab-pane>
                    <!--已删除-->
                    <el-tab-pane label="已删除账号" style="width:100%;height: 100%;">
                        <el-table :data="displayTable2.slice((currentPageD - 1) * pageSizeD, currentPageD * pageSizeD)" :pagination="true" stripe>
                            <el-table-column label="序号"><template slot-scope="scope">{{ scope.$index + 1 }}</template></el-table-column>
                            <el-table-column property="account" label="用户账号"></el-table-column>
                            <el-table-column property="name" label="姓名"></el-table-column>
                            <el-table-column property="role" label="角色"></el-table-column>
                            <el-table-column property="affiliation" label="隶属"></el-table-column>
                            <el-table-column property="last_login_time" label="最后登录时间"></el-table-column>
                            <el-table-column property="create_time" label="创建时间"></el-table-column>
                            <el-table-column property="deleted_time" label="删除时间"></el-table-column>
                        </el-table>
                        <!--分页按钮-->
                        <el-pagination layout="total, sizes, prev, pager, next,jumper" :total="displayTable2.length" @current-change="handleCurrentChangeD" @size-change="handleSizeChangeD"
                                :current-page="currentPageD" :page-size="pageSizeD" :page-sizes="[5, 10, 20, 50]" style="text-align: center"></el-pagination>
                    </el-tab-pane>
                </el-tabs>                 
            </div>    
        </el-dialog>

        <!--子组件-->
        <addUserDrawer ref = "editerForm" :addUserVisible="addV" @childEvent="closeAddD" :modifyVisible="modV"/>
        <resetPasswordDrawer :resetPasswordVisible="resV" :rowAccount = "rAccount" @childEvent="closeResD"/>
        
    </div>

</template>
    
    
    
<script>
import { Pagination } from 'element-ui';
import addUserDrawer from './addUserDrawer.vue';
import resetPasswordDrawer from './resetPasswordDrawer.vue';


    export default {
        name: 'userDialog',
        components: {addUserDrawer, resetPasswordDrawer},

        props:['dialogTableVisible'],
        data() {
            return {
                myTimer: null,
                timeout: null, // 定时器防抖
    
                presentAccounts: [{
                    account: 'test1',
                    name: '赵',
                    role: '归档人员',
                    affiliation: '试验组',
                    status: true,
                    last_login_time: '2021-12-01 10:53:03',
                    create_time: '2022-05-15 08:11:42',
                    password: '',
                    phoneNum: '',
                    email: '',
                }, {
                    account: 'test2',
                    name: '钱',
                    role: '实验室人员',
                    affiliation: '试验组',
                    status: false,
                    last_login_time: '2021-10-01 21:38:55',
                    create_time: '2021 -11-15 00:25:32',
                    password: '',
                    phoneNum: '',
                    email: '',
                }, ],
                
                deletedAccounts: [{
                    account: 'deleted1',
                    name: '孙',
                    role: '试验员',
                    affiliation: '试验组',
                    last_login_time: '2021-12-01 10:53:03',
                    create_time: '2022-05-15 08:11:42',
                    deleted_time: '1919-08-10 11:45:14',
                    password:'',
                    phoneNum: '',
                    email: '',
                }, ],
                
                displayTable1:[],   // 现存账号页面展示列表
                displayTable2:[],   // 已删除账号页面展示列表


                dialogFull:true,    // 全屏显示管理页面
                addV: false,    // 显示新增用户界面
                resV: false,    // 显示密码重置页面
                modV: false,    // 显示编辑页面（实际打开的是新增页面）
                rAccount: '',   // 密码重置时传递账号信息
                rIndex: '',     // 密码重置时传递行index （不做父子通信）
                rInfo: '',  // 编辑时传递账号信息
                
                currentPageP: 1, //当前页 刷新后默认显示第一页
                pageSizeP: 10, //每一页显示的数据量 此处每页显示10条数据
                currentPageD: 1, //当前页 刷新后默认显示第一页
                pageSizeD: 10, //每一页显示的数据量 此处每页显示6条数据
   
                multipleSelection:[],

                searchMode: false,  //点击“查询”按钮之后为true，切换页面或者点击“重置”按钮之后为false
                curPage: 1,     //代表当前所在页面，1是“现存账号”页，2是“已删除账号”页

                form: {
                    account: '',
                    name: '',
                    affiliation: '',
                    role: '',
                    status:''
                },
                formLabelWidth: '120px'            
            }
        },
        inject: [],
        mounted() {
            this.displayTable1 = JSON.parse(JSON.stringify(this.presentAccounts));
            this.displayTable2 = JSON.parse(JSON.stringify(this.deletedAccounts));
        },
        methods: {
            // 切换现存账号和已删除账号页面，如果搜索了则恢复表格数据
            handleClick(tab, event) {
                if (tab.label == "现存账号") {
                    this.curPage = 1;
                    if (this.searchMode) {
                        this.searchMode = false;
                        this.displayTable2 = [];
                        this.displayTable2 = JSON.parse(JSON.stringify(this.deletedAccounts));
                    }
                } else {    // 已删除账号
                    this.curPage = 2;
                    if (this.searchMode) {
                        this.searchMode = false;
                        this.displayTable1 = [];
                        this.displayTable1 = JSON.parse(JSON.stringify(this.presentAccounts));
                    }
                }
                this.resetForm();
            },

            // 获取当前的时间
            getPresentTime() {
                let dt = new Date()
                var y = dt.getFullYear()
                var mt = (dt.getMonth() + 1).toString().padStart(2,'0');
                var day = dt.getDate().toString().padStart(2,'0');
                var h = dt.getHours().toString().padStart(2,'0');
                var m = dt.getMinutes().toString().padStart(2,'0');
                var s = dt.getSeconds().toString().padStart(2,'0');
                var presentTime = y + "-" + mt + "-" + day + " " + h + ":" + m + ":" + s;
                return presentTime;
            },

            // 将删除行加入到被删除列表中
            addToDeleted (index, dataArr) {
                var time = this.getPresentTime();
                this.displayTable2.push(dataArr[index]);
                this.displayTable2[this.displayTable2.length - 1].deleted_time = time;
                this.deletedAccounts.push(dataArr[index]);
                this.deletedAccounts[this.deletedAccounts.length - 1].deleted_time = time;
            },

            // 删除选中行，用于该行的删除按钮，和批量删除时调用
            deleteRow(index, dataArr) {
                this.addToDeleted (index, dataArr);
                let tableIndex = this.presentAccounts.findIndex(item=>item.account == dataArr[index].account);
                this.presentAccounts.splice(tableIndex, 1);
                dataArr.splice(index, 1);
            },

            // 记录被选中行的信息
            handleSelectionChange(selection) {
                this.multipleSelection = selection;
            },

            // 批量删除功能
            multiDelete() {
                var checkedArr = this.multipleSelection;   // multipleSelection存储了勾选到的数据
                for (var i = 0; i < checkedArr.length; i++) {
                    let userIndex = this.displayTable1.findIndex(item=>item.account == checkedArr[i].account)
                    this.deleteRow(userIndex, this.displayTable1);
                };
            },

            // 关闭dialog的时候向父组件发送信息，设置不可见
            resetVisible (form) {
                this.$emit('childEvent')
            },

            // 将搜索框里的东西清空，用于重置及关闭前
            resetForm() {
                // Reset form fields
                this.form.account = '';
                this.form.name = '';
                this.form.affiliation = '';
                this.form.role = '';
                this.form.status = '';
            },

            // 重置按钮对应的功能
            resetSearch() {
                this.searchMode = false;
                this.resetForm(); 
                if (this.curPage == 1) {
                    this.displayTable1 =[];
                    for (let i = 0; i < this.presentAccounts.length; i++) {
                            this.displayTable1.push(this.presentAccounts[i]);
                        }
                } else {
                    this.displayTable2 = [];
                    for (let i = 0; i < this.deletedAccounts.length; i++) {
                            this.displayTable2.push(this.deletedAccounts[i]);
                        }
                }
            },

            // 查询按钮对应的搜索功能
            searchUser() {
                this.searchMode = true;

                let foundUsers = [];
                let accountData = [];
                if (this.curPage == 1) {
                    accountData = this.displayTable1;
                } else {
                    accountData = this.displayTable2;
                }
                for (let i=0; i < accountData.length; i++) {
                    if (this.form.account != '') {
                        if (accountData[i].account != this.form.account) {
                            continue;
                        }
                    }
                    if (this.form.name != '') {
                        if (accountData[i].name != this.form.name) {
                            continue;
                        }
                    }
                    if (this.form.affiliation != '') {
                        if (accountData[i].affiliation != this.form.affiliation) {
                            continue;
                        }
                    }
                    if (this.form.role != '') {
                        if (accountData[i].role != this.form.role) {
                            continue;
                        }
                    }
                    if (this.curPage == 1) {
                        if (this.form.status != '') {
                            let newStatus = false;
                            if (this.form.status == '可用') {
                                newStatus = true;
                            }
                            if (accountData[i].status != newStatus) {
                                continue;
                            }
                        }
                    }
                    foundUsers.push(accountData[i]);
                }

                if (this.curPage == 1) {
                    this.displayTable1 = foundUsers;    
                } else {
                    this.displayTable2 = foundUsers;                       
                }          
            },

            // 判断账号不能重复
            checkDuplicateAccount(data) {
                for (let i = 0; i < this.presentAccounts.length; i++) {
                    if (data.account == this.presentAccounts[i].account) {
                        this.$notify.error({
                            title: '账号不允许重复',
                            message: '账号 '+ data.account + ' 已存在', }); 
                        return false;                             
                    }
                } 
                return true;               
            },

            // 关闭dialog前的操作
            handleDialogClose(done) {
                this.resetForm();
                done(); // Close the dialog
            },

            // 打开子组件：addUserDrawer
            openAddD () {
                this.addV = true;
            },

            // 关闭子组件：addUserDrawer。接收输入的新增用户信息
            closeAddD (data, justfier) {
                if (data) {
                    if (justfier == 2) {
                        this.modV = false;
                        this.addV = false;
                        Object.assign(this.displayTable1[this.rIndex],data)
                        let userIndex = this.presentAccounts.findIndex(item=>item.account == this.displayTable1[this.rIndex].account);
                        this.presentAccounts[userIndex] = this.displayTable1[this.rIndex];  
                        this.$refs.editerForm.resetForm();  // 父组件 调用子组件 的方法                     
                    } else {
                        if (this.checkDuplicateAccount(data)) {
                            this.addV = false;
                            // 如果有新建用户信息，接收并放入列表
                            var time = this.getPresentTime();
                            var newAccount = {account: data.account, name: data.name, role: data.role,
                                affiliation: data.affiliation, status: true, last_login_time: '----------',
                                create_time: time, password: '', phoneNum: data.phoneNum, email: data.email,};
                            this.displayTable1.push(newAccount);
                            this.presentAccounts.push(newAccount);
                            this.$refs.editerForm.resetForm();  // 父组件 调用子组件 的方法
                        }
                    }
                } else {
                    this.addV = false;
                    this.modV = false;
                }
            },

            // 打开子组件：resetPasswordDrawer
            openResD (account, index) {
                this.rAccount = account;
                this.rIndex = index;
                this.resV = true;       
            },

            // 关闭子组件：resetPasswordDrawer。同时接收传回的信息
            closeResD (data) {
                this.resV = false;    
                if (data) {
                    this.displayTable1[this.rIndex].password = data.newPassword;
                    let userIndex = this.presentAccounts.findIndex(item=>item.account == this.displayTable1[this.rIndex].account);
                    this.presentAccounts[userIndex].password = data.newPassword;
                }      
            },

            // 打开子组件：modifyDrawer (已并入addUserDrawer)
            openModD (rowInfo, index) {
                this.addV = true;
                this.rInfo = rowInfo;
                this.rIndex = index;
                this.modV = true;
                this.$refs.editerForm.init(rowInfo)  // 父组件 调用子组件 的方法
            },

            // 现存账号列表页面跳转
            handleCurrentChangeP(currentPageP) {
                this.currentPageP = currentPageP; //每次点击分页按钮，当前页发生变化
            },

            // 已删除账号列表页面跳转
            handleCurrentChangeD(currentPageD) {
                this.currentPageD = currentPageD; //每次点击分页按钮，当前页发生变化
            },

            handleSizeChangeP(pageSizeP) {
                this.pageSizeP = pageSizeP;
            },

            handleSizeChangeD(pageSizeD) {
                this.pageSizeD = pageSizeD;
            },            
        }
    }
</script>
    
    
    
<style scoped lang="less">
    .main-page {
        background: radial-gradient(#003c5f, #000106);
        overflow: hidden;
    }
</style>