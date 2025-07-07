"use client";

// Force this page to be rendered dynamically on the client only to avoid hydration mismatch
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductListSection from "@/components/ProductListSection";
import CategoryTabs from "@/components/CategoryTabs";
import HorizontalSection from "@/components/HorizontalSection";
import ProductModal from "@/components/ProductModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number | null;
  image: string;
  isNew?: boolean;
}

  
  
  



export default function Home() {
  const [activeTab, _setActiveTab] = useState("favorite");
  const setActiveTab = (id: string) => {
    _setActiveTab(id);
    const el = document.getElementById(`${id}-section`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  const [pizza, setPizza] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const openProduct = (id:string)=>setSelectedId(id);
  const closeProduct = ()=>setSelectedId(null);

  useEffect(() => {
    function adaptProduct(raw: any): Product {
      return {
        _id: raw._id ?? raw.id ?? "",
        name: raw.name ?? raw.title ?? "",
        price: (() => {
          const p = raw.comboPrice ?? raw.price ?? raw.basePrice ?? (raw.sizes && raw.sizes[0]?.price);
          return typeof p === "string" ? parseInt(p, 10) : p ?? null;
        })(),
        description: raw.description ?? raw.desc ?? "",
    image: raw.image ?? raw.imageUrl ?? raw.thumbnail ?? "/placeholder.jpg",
        isNew: raw.isNew ?? false,
      };
    }

    async function load() {
      try {
        const [pizzaRes, comboRes] = await Promise.all([
          fetch(`${API_BASE}/products?category=pizza`).then((r) => r.json()),
          fetch(`${API_BASE}/combos`).then((r) => r.json()),
        ]);
        setPizza((pizzaRes.data || pizzaRes).map(adaptProduct));
        setCombos((comboRes.data || comboRes).map(adaptProduct));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-sm text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <HeroCarousel />
      <CategoryTabs active={activeTab} onChange={setActiveTab} />
      {!loading && (
        <>
          <ProductListSection
            id="pizza-section"
            title="Pizza"
            products={pizza.map((p) => ({ id: p._id, title: p.name, description: p.description, price: p.price, image: p.image, isNew: p.isNew }))}
            onProductClick={openProduct}
          />
          <ProductListSection
            id="combo-section"
            title="Combo"
            products={combos.map((p) => ({ id: p._id, title: p.name, description: p.description, price: p.price, image: p.image, isNew: p.isNew }))}
          />
        </>
      )}
      <ProductModal id={selectedId} open={!!selectedId} onClose={closeProduct} apiBase={API_BASE} />
    </div>
  );
}