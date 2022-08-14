// import request1 from '../../utils/request/demo';
import request from '../../utils/request';



const requestControllerDemo = async () => {
  console.log(222);
  
  const res = await request({
    url: '/search/banner',
    method: 'post',
    data: {},
  });
  return res;
}


export { requestControllerDemo }