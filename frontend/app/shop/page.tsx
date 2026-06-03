"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { PRODUCTS, Product } from "@/lib/shopData";
import CustomCursor from "@/components/sections/CustomCursor";
import PageEffects from "@/components/sections/PageEffects";
import ShopPageHeader from "@/components/shop/ShopPageHeader";
import ShopToolbar from "@/components/shop/ShopToolbar";
import ShopFilterSidebar, {
  FilterState,
} from "@/components/shop/ShopFilterSidebar";
import ShopProductsArea from "@/components/shop/ShopProductsArea";
import ShopCartSidebar, {
  ShopCartItem,
  productToCartItem,
} from "@/components/shop/ShopCartSidebar";

const PER_PAGE = 6;

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceMax: 5000,
  minRating: 0,
  onSale: false,
  sameDay: false,
  inStock: false,
  sizes: [],
};

export default function ShopPage() {
  // Tab / search / sort / view
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Cart
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<ShopCartItem[]>([]);

  // UI states
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [wishedIds, setWishedIds] = useState<Set<number>>(new Set());

  const cartCount = cartItems.reduce((s, x) => s + x.qty, 0);

  // Filtering + sorting logic
  const filteredProducts = useMemo<Product[]>(() => {
    let items = [...PRODUCTS];

    if (activeTab !== "all") {
      items = items.filter((p) => p.type === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    items = items.filter((p) => p.price <= filters.priceMax);

    if (filters.minRating > 0) {
      items = items.filter((p) => p.rating >= filters.minRating);
    }

    if (filters.onSale) {
      items = items.filter((p) => p.badge === "sale");
    }

    if (filters.sameDay) {
      items = items.filter((p) => p.sameDay);
    }

    if (filters.categories.length > 0) {
      items = items.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.sizes.length > 0) {
      items = items.filter((p) => p.size && filters.sizes.includes(p.size));
    }

    // Sort
    if (sortMode === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sortMode === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sortMode === "rating") items.sort((a, b) => b.rating - a.rating);

    return items;
  }, [activeTab, searchQuery, sortMode, filters]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((s: string) => {
    setSortMode(s);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: FilterState) => {
    setFilters(f);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, productToCartItem(product)];
    });

    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  }, []);

  const handleToggleWish = useCallback((id: number) => {
    setWishedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleQtyChange = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 420, behavior: "smooth" });
  }, []);

  return (
    <div className="sp-root">
      <CustomCursor />
      <PageEffects />

      {/* NAV */}
      <nav className="sp-nav" id="navbar">
        <Link href="/" className="sp-logo">
          <span className="logo-leaf" />
          PlantSell
        </Link>
        <ul className="sp-nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop" className="active">Shop</Link></li>
          <li><a href="/#delivery">Delivery</a></li>
          <li><a href="/#hiw">How It Works</a></li>
        </ul>
        <div className="sp-nav-right">
          <button
            id="shopCartBtn"
            className="btn-cart"
            onClick={() => setCartOpen(true)}
          >
            🛒 Cart{" "}
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* PAGE HEADER + TABS */}
      <ShopPageHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {/* TOOLBAR */}
      <ShopToolbar
        searchQuery={searchQuery}
        sortMode={sortMode}
        viewMode={viewMode}
        resultCount={filteredProducts.length}
        onSearch={handleSearch}
        onSort={handleSort}
        onView={setViewMode}
      />

      {/* LAYOUT */}
      <div className="sp-layout">
        <ShopFilterSidebar
          filters={filters}
          activeTab={activeTab}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />
        <ShopProductsArea
          products={filteredProducts}
          viewMode={viewMode}
          currentPage={currentPage}
          perPage={PER_PAGE}
          totalCount={filteredProducts.length}
          addedIds={addedIds}
          wishedIds={wishedIds}
          onAddToCart={handleAddToCart}
          onToggleWish={handleToggleWish}
          onPageChange={handlePageChange}
        />
      </div>

      {/* CART SIDEBAR */}
      <ShopCartSidebar
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onQtyChange={handleQtyChange}
      />
    </div>
  );
}
