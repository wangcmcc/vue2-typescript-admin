import { createService } from '@/api/server';
/***
 * 数据信息统计
 */
export const getReportInfo = () => {
  return createService({
    url: '/reports/type/1',
    method: 'get'
  });
};
