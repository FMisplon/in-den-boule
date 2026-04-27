import { eventType } from "./event";
import { homePageType } from "./home-page";
import { menuCategoryType } from "./menu-category";
import { menuItemType } from "./menu-item";
import { richTextType } from "./rich-text";
import { shopProductType } from "./shop-product";
import { siteSettingsType } from "./site-settings";

export const schemaTypes = [
  richTextType,
  homePageType,
  siteSettingsType,
  menuCategoryType,
  menuItemType,
  eventType,
  shopProductType
];
