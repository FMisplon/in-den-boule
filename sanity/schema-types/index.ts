import { eventType } from "./event";
import { menuCategoryType } from "./menu-category";
import { menuItemType } from "./menu-item";
import { shopProductType } from "./shop-product";
import { siteSettingsType } from "./site-settings";

export const schemaTypes = [
  siteSettingsType,
  menuCategoryType,
  menuItemType,
  eventType,
  shopProductType
];
