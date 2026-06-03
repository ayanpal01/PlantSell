"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/context/CartContext";

const products = [
  { id: "fiddle-leaf", category: "Indoor Tree", name: "Fiddle Leaf Fig", price: 1299, oldPrice: 1599, rating: "★★★★★", reviews: "(124)", badge: "-20%", image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&q=80" },
  { id: "npk-blend", category: "Fertilizer", name: "NPK Premium Blend 20-20-20", price: 449, oldPrice: null, rating: "★★★★★", reviews: "(89)", badge: null, image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80" },
  { id: "mango", category: "Fruit Tree", name: "Dwarf Alphonso Mango", price: 2199, oldPrice: null, rating: "★★★★", reviews: "(67)", badge: "Hot", image: "https://images.unsplash.com/photo-1621380401601-1c0e2e83c19e?w=600&q=80" },
  { id: "vermicompost", category: "Fertilizer", name: "Premium Vermicompost 5kg", price: 299, oldPrice: null, rating: "★★★★★", reviews: "(203)", badge: null, image: "https://images.unsplash.com/photo-1603436326446-74c1e516f6d0?w=600&q=80" },
  { id: "bonsai", category: "Bonsai", name: "Ficus Bonsai Starter Kit", price: 899, oldPrice: 1049, rating: "★★★★", reviews: "(41)", badge: "-15%", image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80" },
  { id: "hibiscus", category: "Flowering Shrub", name: "Double Hibiscus - Red", price: 549, oldPrice: null, rating: "★★★★★", reviews: "(57)", badge: null, image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&q=80" },
];

const filterTabs = ["All Products", "Small Trees", "Fertilizers", "Flowering", "Indoor", "Fruit Trees"];

export default function ProductsSection() {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  const handleAdd = (product: typeof products[0]) => {
    addItem({
      _id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      description: "",
      stock: 99,
      category: product.category,
      type: "",
      tags: [],
      ratings: { average: 4.5, count: 0 },
      discount: 0,
      isFeatured: false,
      isAvailable: true,
      createdAt: "",
    });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1200);
  };

  return (
    <section className="products-section" id="products">
      <div className="products-header reveal">
        <div>
          <div className="section-label">Our Range</div>
          <h2 className="section-title">Featured <em>Products</em></h2>
        </div>
        <a className="see-all" href="/shop">View All &gt;</a>
      </div>
      <div className="filter-tabs reveal">
        {filterTabs.map((label) => (
          <button key={label} className={`filter-tab ${activeFilter === label ? "active" : ""}`} onClick={() => setActiveFilter(label)}>
            {label}
          </button>
        ))}
      </div>
      <div className="products-grid reveal">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img">
              <Link href={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              {product.badge && <div className="product-badge">{product.badge}</div>}
            </div>
            <div className="product-body">
              <div className="product-category">{product.category}</div>
              <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                <div className="product-name">{product.name}</div>
              </Link>
              <div className="product-meta">
                <span className="product-rating">{product.rating}</span>
                <span className="product-reviews">{product.reviews}</span>
              </div>
              <div className="product-footer">
                <div>
                  <span className="product-price">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="product-price-old">{formatPrice(product.oldPrice)}</span>}
                </div>
                <button className="add-btn" onClick={() => handleAdd(product)}>
                  {added[product.id] ? "✓" : "+"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
