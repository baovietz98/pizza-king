const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: Array<{
    size: string;
    price: number;
  }>;
  basePrice: number;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
} 