import { REACT_TEXT } from "./constant";
/**
 * 为了后续处理方便，把元素做了一下封装，主要就是给字符串和数字进行了处理，变成一个对象的形式
 * @param {*} element 
 * @returns 
 */
export function wrapToVdom(element) {
   return (typeof element === 'string' || typeof element === 'number') ?
      { type: REACT_TEXT, props: element } :
      element;
}

export function shallowEqual(obj1, obj2) {
   if (obj1 === obj2) {
      return true;
   }
   if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
   }
   //到此obj1和obj2不是同一个对象，都是对象，而且都不为null,开始比较属性
   let keys1 = Object.keys(obj1);//返回属性的数组，用of来循环
   let keys2 = Object.keys(obj2);
   if (keys1.length !== keys2.length) {
      return false;
   }
   for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
         return false;
      }
   }
   return true;
}