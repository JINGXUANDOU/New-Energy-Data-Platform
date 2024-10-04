<template>
    <div class="page-background">
        <div class="all-content">
            <div class="loginBox">
                <h2>欢迎登录</h2>
                <form action="">
                    <div class="item">
                        <input ref="userName" type="text" required>
                        <label for="">用户名</label>
                    </div>
                    <div class="item">
                        <input ref="password" type="password" required>
                        <label for="">密码</label>
                    </div>

                <div class="flexContainer">
                    <div class="verifyBox">
                        <input ref="verifycode" type="text" required>
                        <label for="">验证码</label>
                    </div>
                    <div class="identifybox" @click="refreshCode">
                        <sidentify :identifyCode="identifyCode"></sidentify>    <!-- :identifyCode="identifyCode", v-bind动态绑定 -->
                    </div>
                </div>

                    <button class="btn" @click.prevent="loginBtn">登录
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </form>

                <!--<div class="alighBottom">-->
                <!--    <el-link type="primary">注册</el-link>-->
                <!--    <el-link type="primary">找回密码</el-link>-->
                <!--</div>-->
            </div>
        </div>
    </div>

</template>

<script>
import sidentify from './sidentify.vue' 

export default {
    components: { sidentify },
    data() {
        return {
            identifyCodes: "1234567890", //所有数字，用于生成验证码
            identifyCode: "11111",  // 验证码组件传值 
        };
    },
    created() {
        this.refreshCode();
        },
    mounted() {
        this.identifyCode = '';
        this.makeCode(4);
    },
    methods: {
        loginBtn() {
            if (this.$refs.verifycode.value !== this.identifyCode) {
                this.$message.warning('验证码不匹配！')
                return;
            }
            if (this.$refs.userName.value !== 'admin') {
                this.$message.warning('用户名或密码不匹配！')
                return;
            }
            if (this.$refs.password.value !== 'admin') {
                this.$message.warning('用户名或密码不匹配！')
                return;
            }
            sessionStorage.setItem('userId','admin')
            this.$router.push({
                name: 'homePage',
            })
            this.$bus.$emit('init')            
        },

        //验证码生成计算部分
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
            this.identifyCode = "";
            this.makeCode(4);
        },
        makeCode(len) {
            for (let i = 0; i < len; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
            }
        },       
    }
}
</script>

<style scoped lang="less">
.page-background {
    margin-top: 0px;
    //display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    background: url("~@/assets/login_bg.png") center 100% no-repeat;
    background-size: 100% 100%;

    .all-content {
        height: 100vh;
        //background: linear-gradient(#141e30, #243b55);
        display: flex;
        justify-content: flex;
        //position: relative;
        //left: 300px;
        margin-left: 600px;
        align-items: center;
        font-size: 16px;
        color: #03e9f4;

        .loginBox {
            width: 400px;
            height: 480px;
            background-color: #0c1622;
            margin: 100px auto;
            border-radius: 10px;
            box-shadow: 0 15px 25px 0 rgba(0, 0, 0, .6);
            padding: 40px;
            box-sizing: border-box;
        }

        h2 {
            text-align: center;
            color: aliceblue;
            margin-bottom: 30px;
            font-family: 'Courier New', Courier, monospace;
        }

        input,
        button {
            background: transparent;
            border: 0;
            outline: none;
        }

        .item {
            height: 45px;
            border-bottom: 1px solid #fff;
            margin-bottom: 40px;
            position: relative;
        }
        
        .item input {
            width: 100%;
            height: 100%;
            color: #fff;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .item input:focus + label,
        .item input:valid + label {
            top: 0px;
            font-size: 2px;
        }

        .item label {
            position: absolute;
            left: 0;
            top: 12px;
            transition: all 0.5s linear;
        }

        .verifyBox {
            width: 70%;
            height: 45px;
            border-bottom: 1px solid #fff;
            margin-bottom: 40px;
            position: relative;
        }

        .verifyBox input {
            width: 100%;
            height: 100%;
            color: #fff;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .verifyBox input:focus + label,
        .verifyBox input:valid + label {
            top: 0px;
            font-size: 2px;
        }

        .verifyBox label {
            position: absolute;
            left: 0;
            top: 12px;
            transition: all 0.5s linear;
        }

        .identifyBox{
            display: flex;
            justify-content: flex-end;
        }
        
        .flexContainer {
            display:flex;
            flex-direction:row ;
            justify-content:space-between;
            align-items: center;
        }

        .alighBottom {
            display:flex;
            flex-direction:row ;
            justify-content:space-between;
            position: relative;
            top: 30px;
        }

        .btn {
            padding: 10px 20px;
            margin-top: 30px;
            color: #03e9f4;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 2px;
            left: 35%;
        }

        .btn:hover {
            border-radius: 5px;
            color: #fff;
            background: #03e9f4;
            box-shadow: 0 0 5px 0 #03e9f4,
            0 0 25px 0 #03e9f4,
            0 0 50px 0 #03e9f4,
            0 0 100px 0 #03e9f4;
            transition: all 1s linear;
        }

        .btn > span {
            position: absolute;
        }

        .btn > span:nth-child(1) {
            width: 100%;
            height: 2px;
            background: -webkit-linear-gradient(left, transparent, #03e9f4);
            left: -100%;
            top: 0px;
            animation: line1 1s linear infinite;
        }

        @keyframes line1 {

            50%,
            100% {
                left: 100%;
            }
        }

        .btn > span:nth-child(2) {
            width: 2px;
            height: 100%;
            background: -webkit-linear-gradient(top, transparent, #03e9f4);
            right: 0px;
            top: -100%;
            animation: line2 1s 0.25s linear infinite;
        }

        @keyframes line2 {

            50%,
            100% {
                top: 100%;
            }
        }

        .btn > span:nth-child(3) {
            width: 100%;
            height: 2px;
            background: -webkit-linear-gradient(left, #03e9f4, transparent);
            left: 100%;
            bottom: 0px;
            animation: line3 1s 0.75s linear infinite;
        }

        @keyframes line3 {

            50%,
            100% {
                left: -100%;
            }
        }

        .btn > span:nth-child(4) {
            width: 2px;
            height: 100%;
            background: -webkit-linear-gradient(top, transparent, #03e9f4);
            left: 0px;
            top: 100%;
            animation: line4 1s 1s linear infinite;
        }

        @keyframes line4 {

            50%,
            100% {
                top: -100%;
            }
        }
    }
}
</style>
