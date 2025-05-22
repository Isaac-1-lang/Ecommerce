import { dummyProducts } from "../assets/images/greencart_assets/assets";


export async function ProductsLoader() {
  // Simulate 2 seconds delay
  await new Promise((resolve) => setTimeout(resolve,2000));
  return dummyProducts;
}