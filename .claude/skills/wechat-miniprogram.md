---
skill: wechat-miniprogram
description: 微信小程序开发助手（原生/uniapp 双支持）
tags: [wechat, miniprogram, weixin, uniapp]
---

# 微信小程序开发助手

提供微信小程序常用功能的代码模板和最佳实践。

## 使用方式

```
/wechat-miniprogram FeatureName
```

## 功能清单

1. 微信登录授权
2. 获取用户信息
3. 微信支付
4. 分享功能
5. 订阅消息
6. 位置服务
7. 图片上传
8. 扫码功能

## 示例：微信登录

**utils/wxAuth.js**
```javascript
/**
 * 微信小程序登录授权
 */
export const wxLogin = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (loginRes) => {
        console.log('登录成功，code:', loginRes.code)
        
        // 发送 code 到后端换取 token
        uni.request({
          url: '/api/auth/wx-login',
          method: 'POST',
          data: {
            code: loginRes.code
          },
          success: (res) => {
            if (res.data.code === 0) {
              const { token, userInfo } = res.data.data
              
              // 保存 token
              uni.setStorageSync('token', token)
              uni.setStorageSync('userInfo', userInfo)
              
              resolve({ token, userInfo })
            } else {
              reject(new Error(res.data.message))
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      },
      fail: (err) => {
        console.error('登录失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 获取用户信息（需要用户授权）
 */
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功:', res.userInfo)
        resolve(res.userInfo)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 检查授权状态
 */
export const checkAuthStatus = (scope) => {
  return new Promise((resolve) => {
    uni.getSetting({
      success: (res) => {
        resolve(res.authSetting[scope] === true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 请求授权
 */
export const requestAuth = (scope) => {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success: () => {
        resolve(true)
      },
      fail: () => {
        // 授权失败，引导用户打开设置
        uni.showModal({
          title: '授权提示',
          content: '需要您的授权才能使用该功能',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting()
            }
          }
        })
        reject(false)
      }
    })
  })
}
```

## 示例：微信支付

**utils/wxPay.js**
```javascript
/**
 * 微信支付
 */
export const wxPay = async (orderId) => {
  try {
    // 1. 调用后端接口获取支付参数
    const res = await uni.request({
      url: '/api/payment/create',
      method: 'POST',
      data: { orderId }
    })
    
    if (res.data.code !== 0) {
      throw new Error(res.data.message)
    }
    
    const payParams = res.data.data
    
    // 2. 调起微信支付
    return new Promise((resolve, reject) => {
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: (res) => {
          console.log('支付成功:', res)
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
          resolve(res)
        },
        fail: (err) => {
          console.error('支付失败:', err)
          if (err.errMsg.includes('cancel')) {
            uni.showToast({
              title: '已取消支付',
              icon: 'none'
            })
          } else {
            uni.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
          reject(err)
        }
      })
    })
  } catch (error) {
    console.error('创建支付订单失败:', error)
    throw error
  }
}
```

## 示例：分享功能

**pages/detail/index.vue**
```vue
<script setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

// 分享给好友
onShareAppMessage(() => {
  return {
    title: '可爱的宠物等你来领养',
    path: '/pages/detail/index?id=123',
    imageUrl: '/static/share-cover.jpg'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: '可爱的宠物等你来领养',
    query: 'id=123',
    imageUrl: '/static/share-cover.jpg'
  }
})
</script>

<template>
  <view class="detail-page">
    <button open-type="share" class="share-btn">
      分享给好友
    </button>
  </view>
</template>
```

## 示例：订阅消息

**utils/wxSubscribe.js**
```javascript
/**
 * 请求订阅消息
 */
export const requestSubscribeMessage = (templateIds) => {
  return new Promise((resolve, reject) => {
    uni.requestSubscribeMessage({
      tmplIds: templateIds,
      success: (res) => {
        console.log('订阅消息授权结果:', res)
        
        // 检查每个模板的授权状态
        const acceptedTemplates = []
        templateIds.forEach(id => {
          if (res[id] === 'accept') {
            acceptedTemplates.push(id)
          }
        })
        
        resolve(acceptedTemplates)
      },
      fail: (err) => {
        console.error('订阅消息失败:', err)
        reject(err)
      }
    })
  })
}

// 使用示例
const handleSubscribe = async () => {
  try {
    const templates = [
      'templateId1', // 订单状态通知
      'templateId2'  // 物流更新通知
    ]
    
    const accepted = await requestSubscribeMessage(templates)
    console.log('用户同意的模板:', accepted)
  } catch (error) {
    console.error('订阅失败:', error)
  }
}
```

## 示例：图片上传

**utils/wxUpload.js**
```javascript
/**
 * 选择并上传图片
 */
export const chooseAndUploadImage = (options = {}) => {
  const {
    count = 1,
    sizeType = ['compressed'],
    sourceType = ['album', 'camera']
  } = options
  
  return new Promise((resolve, reject) => {
    // 1. 选择图片
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      success: (chooseRes) => {
        const tempFilePaths = chooseRes.tempFilePaths
        
        // 2. 上传图片
        const uploadPromises = tempFilePaths.map(filePath => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: '/api/upload/image',
              filePath,
              name: 'file',
              header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
              },
              success: (uploadRes) => {
                const data = JSON.parse(uploadRes.data)
                if (data.code === 0) {
                  resolve(data.data.url)
                } else {
                  reject(new Error(data.message))
                }
              },
              fail: reject
            })
          })
        })
        
        Promise.all(uploadPromises)
          .then(urls => {
            console.log('上传成功:', urls)
            resolve(urls)
          })
          .catch(reject)
      },
      fail: reject
    })
  })
}

// 使用示例
const handleUpload = async () => {
  try {
    uni.showLoading({ title: '上传中...' })
    
    const urls = await chooseAndUploadImage({
      count: 3,
      sizeType: ['compressed']
    })
    
    uni.hideLoading()
    uni.showToast({
      title: '上传成功',
      icon: 'success'
    })
    
    console.log('图片地址:', urls)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  }
}
```

## 示例：扫码功能

**utils/wxScan.js**
```javascript
/**
 * 扫码
 */
export const scanCode = () => {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success: (res) => {
        console.log('扫码结果:', res.result)
        resolve(res.result)
      },
      fail: (err) => {
        console.error('扫码失败:', err)
        reject(err)
      }
    })
  })
}

// 使用示例
const handleScan = async () => {
  try {
    const result = await scanCode()
    
    // 处理扫码结果
    if (result.startsWith('http')) {
      // 是一个链接
      uni.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(result)}`
      })
    } else {
      // 其他类型的码
      console.log('扫码内容:', result)
    }
  } catch (error) {
    uni.showToast({
      title: '扫码失败',
      icon: 'none'
    })
  }
}
```
