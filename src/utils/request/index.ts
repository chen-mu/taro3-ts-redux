import axios from 'taro-axios'
import Taro from '@tarojs/taro'
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { checkStatus } from './baseUtils';

interface IResData {
  code: number
  data: any
  message: string
}

let inError = false;
// 创建新实例  默认配置
const instance = axios.create({
  timeout: 15000,
  baseURL: process.env.BASE_URL,
})
instance.interceptors.request.use(config => {
  config.headers.token = '0CF3DD160C1EA65AFF5A651C83560767'
  config.headers = Object.assign(
    config.method === 'get'
      ? {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      }
      : {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    config.headers,
  );
  if (config.method === 'post') {

    const contentType = config.headers['Content-Type'];
    // 根据Content-Type转换data格式
    if (contentType) {
      if (contentType.includes('multipart')) {
        // 类型 'multipart/form-data;'
        // config.data = data;
      } else if (contentType.includes('json')) {
        // 类型 'application/json;'
        // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
        config.data = JSON.stringify(config.data);
      } else {
        // 类型 'application/x-www-form-urlencoded;'
        // 服务器收到的raw body(原始数据) name=nowThen&age=18
        config.data = Qs.stringify(config.data);
      }
    }
  }
  return Promise.resolve(config)
}, error => {
  Promise.reject(error)
})
// 响应回来后做什么
instance.interceptors.response.use(response => {
  // 对响应数据做处理，以下根据实际数据结构改动！！...
  const { code } = response.data || {};
  if (code === 109 || code === 108) {
    // 请求超时，跳转登录页
    if (!inError) {
      Taro.showToast({
        title: '登录超时，即将跳转到登录页面...',
        icon: 'none',
        duration: 2000
      })
    }

    return Promise.resolve({});
  } else if (response) {
    return Promise.resolve(checkStatus(response));
  }
})

const request = async (opt) => {

  const options = {
    method: 'get',
    ifHandleError: true, // 是否统一处理接口失败(提示)
    ...opt,
  };
  // 匹配接口前缀 开发环境则通过proxy配置转发请求； 生产环境根据实际配置
  // options.baseURL = autoMatch(options.prefix);

  try {
    const res = await instance(options) as unknown as IResData;

    console.log('res==', res);


    if (res?.code === 200) {
      return res?.data;
    }

    return res;
  } catch (err) {

    if (options.ifHandleError) {
      // 自定义参数，是否允许全局提示错误信息
      Taro.showToast({
        title: err.message || err.msg || '请求处理失败！',
        icon: 'none',
        duration: 2000
      })
    }
    return err;
  }
};
export default request
