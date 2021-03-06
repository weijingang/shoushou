// pages/account/bindingemail.js
var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/validate';

var inputContent = {};//输入内容
Page({

    /**
     * 页面的初始数据
     */
    data: {
        paracont: "获取验证码",//验证码文字
        vcdisabled: true,//验证码按钮状态
        verifycode: ""//返回的验证码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            status: options.status //认证状态
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 获取用户输入
     */
    bindChange: function (e) {
        inputContent[e.currentTarget.id] = e.detail.value;
        util.verifyCodeBtn(e, this);
    },
    /**
     * 获取验证码
     */
    getVerifyCode: function (e) {
        var that = this;
        util.getVerifyCode(inputContent['email'], this, function (data) {
            that.setData({
                verifycode: data.data,
                verifyemail: inputContent['email']
            })
        })

    }
    ,
    /**
     * 用户提交
     */
    bindingemailSubmit: function (e) {
        var that = this;
        //验证表单
        that.WxValidate = new WxValidate({
                email: {  //验证规则 input name值
                    required: true,
                    email: true
                },
                verifycode: {
                    required: true,
                },

            },
            {
                email: { //提示信息
                    required: "请填写电子邮箱",
                },
                verifycode: { //提示信息
                    required: "请填写验证码"
                },

            })


        util.wxValidate(e, that, function () {
            if (that.data.verifycode != inputContent.verifycode) {
                util.toolTip(that, "验证码输入不正确")
                return;
            }
            if (that.data.verifyemail != inputContent.email) {
                util.toolTip(that, "验证码与邮箱号码不匹配")
                return;
            }

            util.https(app.globalData.api + "/api/user/authenticate_email/" + wx.getStorageSync('userid'), "GET", {
                    email: inputContent.email	//新用户号码
                },
                function (data) {
                    if (data.code == 1001) {
                        util.toolTip(that, "绑定邮箱成功", 1, 'back');
                    } else {
                        util.toolTip(that, data.message);
                    }
                }
            )
        })


    }
})