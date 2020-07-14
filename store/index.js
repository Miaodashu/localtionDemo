import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)
var QQMapWX = require('@/static/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
	key: 'ZLDBZ-FFHK6-7BUSZ-EUH5U-WU72Z-WAFIR'
});
const store = new Vuex.Store({
	state: {
		curruntCity: '成都', // 当前定位的城市 默认成都
		curruntAddress: '', // 当前定位的地理信息
		localtionObj: {}, // 当前定位的位置全部参数
		poiList: [], // 当前定位的附近位置
		selectCity: '',
		selectAddress: '',
		isEnd: true,
		resultData: null
	},
	mutations: {
		setCurruntCity(state, data) {
			state.curruntCity = data
		},
		setCurruntAddress(state, data) {
			state.curruntAddress = data
		},
		setSelectAddress(state, data) {
			state.selectAddress = data
		},
		setSelectCity(state, data) {
			state.selectCity = data
		},
		setLocaltionObj(state, data) {
			state.localtionObj = data.address_component // 地址参数信息
			state.poiList = data.pois // 附近地点信息集合
			this.commit('setCurruntCity', data.address_component.city)
			this.commit('setCurruntAddress', data.address_reference.landmark_l2.title)
		},
		setStatus(state, data) {
			state.isEnd = data
		},
		setResultData(state, data) {
			state.resultData = data
		}
	},
	actions: {
		// 获取经纬度
		startLocaltion({
			commit,
			dispatch
		}) {
			commit('setStatus', false)
			uni.authorize({
				scope: 'scope.userLocation',
				success: (res) => {
					uni.getLocation({
						success: async res => {
							dispatch('getLocation', {
								latitude: res.latitude,
								longitude: res.longitude
							})
						},fail() {
							commit('setStatus', true)
							uni.showToast({
								icon: 'none',
								title: '获取失败，请重试'
							});
						}
					});
				},
				fail: (res) => {
					commit('setStatus', true)
					uni.showModal({
						title: '温馨提示',
						content: '为了更好的为您服务，请授权地址权限',
						success(res) {
							if (res.confirm) {
								uni.openSetting({
									success(res) {
										if (res.authSetting['scope.userLocation']) {
											uni.getLocation({
												success: async res => {
													commit('setStatus', false)
													dispatch('getLocation', {
														latitude: res.latitude,
														longitude: res.longitude
													})
												}
											});
										}
									}
								});
							} else {
								commit('setStatus', true)
								uni.showToast({
									icon: 'none',
									title: '未授权'
								});
							}
						}
					});
				},
			})

		},
		// 解析经纬度获取地址信息
		getLocation({
			commit
		}, data) {
			qqmapsdk.reverseGeocoder({
				location: data, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
				get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
				coord_type: 1,
				success: function(res) {
					//成功后的回调
					console.log(res);
					commit('setStatus', true)
					commit('setLocaltionObj', res.result)

				},
				fail: function(error) {
					commit('setStatus', false)
					uni.showToast({
						icon: 'none',
						title: error
					});
				}
			});
		},
		// 获取该城市下的地域
		getSearchArea({
			commit,
			state
		}, data) {
			qqmapsdk.getSuggestion({
				keyword: data,
				region_fix: 1,
				region: state.selectCity || state.curruntCity,
				success(res) {
					commit('setResultData', res.data)
				}
			})
		}
	}
})

export default store;
