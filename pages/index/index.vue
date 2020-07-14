<template>
	<view class="container">
		<button @click="handleSelect" type="primary">当前定位--{{ selectAddress || curruntAddress }}</button>
	</view>
</template>

<script>
var QQMapWX = require('../../static/qqmap-wx-jssdk.min.js');
import { mapState, mapActions } from 'vuex';
export default {
	computed: {
		...mapState({
			selectAddress: state => state.selectAddress,
			curruntAddress: state => state.curruntAddress
		})
	},
	data() {
		return {
			location: ''
		};
	},
	onLoad(data) {
		this.startLocaltion();
	},
	methods: {
		...mapActions(['startLocaltion']),
		handleSelect() {
			let _this = this
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.userLocation']) {
						uni.navigateTo({
							url: '/pages/select/index'
						});
					}else{
						_this.startLocaltion();
					}
				}
			});
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '定位小程序demo',
			path: '/pages/index/index',
			imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
		};
	}
};
</script>

<style>
.container {
	padding: 20px;
	font-size: 14px;
	line-height: 24px;
}
</style>
