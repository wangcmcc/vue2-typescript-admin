// 接口分类管理
import { createService } from '@/api/server';

/**
 *  商品分类数据列表
 *  @params {
 *    type  | [1,2,3]  | 值：1，2，3 分别表示显示一层二层三层分类列表<br />【可选参数】如果不传递，则默认获取所有级别的分类
 *    pagenum  | 当前页码值  | 【可选参数】如果不传递，则默认获取所有分类
 *    pagesize | 每页显示多少条数据 | 【可选参数】如果不传递，则默认获取所有分类
 *  }
 */
export const getGoodsByTypeNum = (data: object) => {
  return createService({
    url: '/categories',
    method: 'get',
    params: data
  });
};

/**
 *  添加商品分类 /categories
 */
export const addCateInfo = (data: object) => {
  return createService({
    url: '/categories',
    method: 'post',
    data
  });
};

/**
 *  修改商品分类 /categories
 */
/* eslint-disable @typescript-eslint/camelcase */
export const editCateInfo = (data: any) => {
  return createService({
    url: `categories/${data.cat_id}`,
    method: 'put',
    data: {
      cat_name: data.cat_name
    }
  });
};

/**
 *  修改商品分类 /categories
 */
/* eslint-disable @typescript-eslint/camelcase */
export const deleteCateById = (id: number) => {
  return createService({
    url: `categories/${id}`,
    method: 'delete'
  });
};
