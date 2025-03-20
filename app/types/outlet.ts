export type Outlet = {
  id: string;
  provider: string;
  providerImageSrc: string;
  imageSrc: string;
  imageSrcFallback: string;
  name: string;
  cuisine: string;
  rating?: number;
  distance: string;
  priceTag: number;
  path?: string;
};

export type OutletDetail = {
  name: string;
  photoHref: string;
  cuisine: string;
  address: string;
  menus: Menu[];
};

export type Menu = {
  provider: string;
  providerImageSrc: string;
  rating: number;
  categories: Category[];
  priceLevel?: number;
};

export type Category = {
  name: string;
  products: Product[];
  id?: string;
};

export type Product = {
  name: string;
  description?: string;
  imgSrc: string;
  price: number;
  priceDiscounted: number;
  isPromo: boolean;
  id?: string;
};
