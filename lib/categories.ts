import type { Category } from "./types";
import {
  getChildCategories,
  getProductsByCategory,
  getTopLevelCategories,
} from "./data";

export interface CategoryGroup {
  topLevel: Category;
  totalCount: number;
  children: { category: Category; count: number }[];
}

export function getCategoryGroups(): CategoryGroup[] {
  return getTopLevelCategories().map((topLevel) => {
    const children = getChildCategories(topLevel.slug);
    const visible = children.length > 0 ? children : [topLevel];
    return {
      topLevel,
      totalCount: getProductsByCategory(topLevel.slug).length,
      children: visible.map((category) => ({
        category,
        count: getProductsByCategory(category.slug).length,
      })),
    };
  });
}