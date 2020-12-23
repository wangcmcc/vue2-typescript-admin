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
export const getGoodsByTypeNum = (data?: object) => {
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

/**
 *  获取参数列表 /categories/{id}/attributes
 */
export const getCateAttributeById = (id: number, sel: string) => {
  return createService({
    url: `/categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  });
};

/**
 *  添加属性 categories/:id/attributes
 */
export const addattributes = (id: number, data: object) => {
  return createService({
    url: `categories/${id}/attributes`,
    method: 'post',
    data
  });
};

/**
 *  编辑、修改属性 categories/:id/attributes/:attrId
 */
export const editattributes = (data: any) => {
  return createService({
    url: `categories/${data.cat_id}/attributes/${data.attr_id}`,
    method: 'put',
    data: {
      attr_name: data.attr_name,
      attr_sel: data.attr_sel,
      attr_vals: data.attr_vals
    }
  });
};

/**
 *  删除属性 categories/:id/attributes/:attrId
 */
export const deleteattributes = (data: any) => {
  return createService({
    url: `categories/${data.cat_id}/attributes/${data.attr_id}`,
    method: 'delete'
  });
};

/**
 * 获取商品列表参数  /goods
 */
export const getGoodsInfo = (query: any) => {
  return createService({
    url: '/goods',
    method: 'get',
    params: query
  });
};

/**
 * 根据商品id删除该条商品信息
 */
export const deleteGoodsById = (id: number | string) => {
  return createService({
    url: `/goods/${id}`,
    method: 'delete'
  });
};

/**
 *  添加商品 /goods
 */
export const addGoods = (data: object) => {
  return createService({
    url: '/goods',
    method: 'post',
    data
  });
};
