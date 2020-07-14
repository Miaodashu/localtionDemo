<template>
	<view class="select-box">
		<view class="head-box">
			<view class="head-search">
				<text class="city-name" @click="handleMoreCity">{{ selectCity || curruntCity }}</text>
				<view class="sign"></view>
				<input class="input" @focus="isShow = 3" :value="searchVal" @input="onKeyInput" placeholder="搜索当前城市地址" />
			</view>
			<text
				v-if="isShow == 3"
				class="cancle-text"
				@click="
					isShow = 1;
					searchVal = '';
				"
			>
				取消
			</text>
		</view>
		<view v-if="isShow == 1">
			<view class="tip">定位地址</view>
			<view class="localtion-name">
				<text>{{ curruntAddress }}</text>
				<text style="margin-right: 30rpx;color: red;" @click="handleLocaltion">{{ isEnd ? '重新定位' : '定位中...' }}</text>
			</view>
			<view class="tip hot">附近地址</view>
			<view class="poiList" v-for="item in poiList" :key="item.id" @click="handleItemSet(item.title)">
				<text>{{ item.title }}</text>
			</view>
		</view>
		<view v-if="isShow == 2" class="select-city"><select-city @selectCity="handleSelectCity"></select-city></view>
		<view v-if="isShow == 3" class="search-result">
			<template v-if="resultData && resultData.length == 0">
				<view class="null-text">暂时没有搜到结果!</view>
			</template>
			<template v-if="resultData && resultData.length > 0">
				<view class="result-item" v-for="item in resultData" :key="item.id" @click="handleItemSet(item.title)">
					<view class="title">{{ item.title }}</view>
					<view class="address">{{ item.address }}</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import selectCity from '@/components/selectCity/selectCity.vue';
export default {
	computed: {
		...mapState({
			curruntCity: state => state.curruntCity,
			curruntAddress: state => state.curruntAddress,
			poiList: state => state.poiList,
			isEnd: state => state.isEnd,
			selectCity: state => state.selectCity,
			resultData: state => state.resultData
		})
	},
	components: {
		selectCity
	},
	data() {
		return {
			isShow: 1,
			searchVal: ''
		};
	},
	methods: {
		...mapActions(['startLocaltion', 'getSearchArea']),
		...mapMutations(['setSelectAddress', 'setSelectCity']),
		onKeyInput(e) {
			console.log(e.detail.value);
			this.getSearchArea(e.detail.value);
		},
		// 重新定位
		handleLocaltion() {
			this.startLocaltion();
		},
		// 切换定位地点
		handleItemSet(data) {
			this.setSelectAddress(data);
			uni.navigateTo({
				url: '/pages/index/index'
			});
		},
		// 显示更多城市
		handleMoreCity() {
			if (this.isShow === 1) {
				this.isShow = 2;
			} else {
				this.isShow = 1;
			}
		},
		// 切换定位城市
		handleSelectCity(name) {
			if (name) {
				this.setSelectCity(name);
				this.isShow = 1;
			}
		}
	}
};
</script>

<style lang="scss">
.select-box {
	width: 100%;
	min-height: 100vh;
	padding: 0 30rpx;
	box-sizing: border-box;
	.head-box {
		display: flex;
		align-items: center;
		.cancle-text {
			margin-left: 30rpx;
			color: red;
			font-size: 30rpx;
		}
	}
	.head-search {
		height: 60rpx;
		margin: 20rpx 0;
		display: flex;
		align-items: center;
		background: #f2f5f7;
		border-radius: 30rpx;
		flex: 1;
		.input {
			flex: 1;
			line-height: 60rpx;
			color: #6a6a6a;
		}
		.sign {
			height: 40rpx;
			width: 2rpx;
			background: #646566;
			margin: 0 20rpx 0 0;
		}
		.city-name {
			font-size: 30rpx;
			font-weight: bold;
			line-height: 60rpx;
			color: #333;
			padding: 0 20rpx;
		}
	}
	.null-text{
		color: #333;
		text-align: center;
		margin-top: 100rpx;
	}
	.localtion-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 30rpx;
		color: #333;
	}
	.tip{
		font-size: 30rpx;
		color: #797979;
		margin: 40rpx 0;
		&.hot{
			margin-bottom: 0;
		}
	}
}

.select-city {
	width: 100%;
	height: calc(100vh - 100rpx);
}
.search-result {
	width: 100%;
	height: calc(100vh - 100rpx);
	overflow-y: scroll;
	background: #ffffff;
	padding: 30rpx;
	box-sizing: border-box;
	.result-item {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx solid #cccccc;
		justify-content: center;
		.title {
			font-size: 26rpx;
			line-height: 26rpx;
			color: #333333;
			margin-bottom: 20rpx;
		}
		.address {
			font-size: 22rpx;
			line-height: 22rpx;
			color: #cccccc;
		}
	}
}
.poiList{
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 26rpx;
	color: #333333;
	border-bottom: 1rpx solid #cccccc;
}
</style>
