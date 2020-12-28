import { createService } from '@/api/server';
/***
 * 订单信息查询
 */
export const getOrderInfo = (query: object) => {
  return createService({
    url: '/orders',
    method: 'get',
    params: query
  });
};

/***
 * 物流进度查询
 *  需要手动修改接口 getLogisticsInfo.js中 去掉autoComNumber 把下面的type改成'yuantong' id: 804909574412544580
 */
export const getProgress = () => {
  return createService({
    url: '/kuaidi/804909574412544580',
    method: 'get'
  });
};
