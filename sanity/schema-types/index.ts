import { eventType } from "./event";
import { homePageType } from "./home-page";
import { menuCategoryType } from "./menu-category";
import { menuItemType } from "./menu-item";
import { richTextType } from "./rich-text";
import { shopProductType } from "./shop-product";
import { siteSettingsType } from "./site-settings";
import { venuePageType } from "./venue-page";

export const schemaTypes = [
  richTextType,
  homePageType,
  venuePageType,
  siteSettingsType,
  menuCategoryType,
  menuItemType,
  eventType,
  shopProductType
];
