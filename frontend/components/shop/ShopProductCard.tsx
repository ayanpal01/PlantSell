"use client";

import { Product } from "@/lib/shopData";

interface ShopProductCardProps {
  product: Product;
  viewMode: string;
  index: number;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
  isWished: boolean;
  onToggleWish: (id: number) => void;
}

function starsHTML(r: number) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= Math.round(r) ? "★" : "☆";
  return s;
}

function badgeClass(b: string | null) {
  if (b === "sale") return "sp-badge-sale";
  if (b === "new") return "sp-badge-new";
  if (b === "organic") return "sp-badge-organic";
  if (b === "hot") return "sp-badge-hot";
  return "";
}

export default function ShopProductCard({
  product: p,
  viewMode,
  index,
  onAddToCart,
  isAdded,
  isWished,
  onToggleWish,
}: ShopProductCardProps) {
  const delay = (index % 6) * 0.07;

  return (
    <div
      className={`sp-card ${viewMode === "list" ? "sp-card--list" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="sp-card__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={p.name} loading="lazy" />
        {p.badge && (
          <span className={`sp-badge ${badgeClass(p.badge)}`}>
            {p.badgeLabel}
          </span>
        )}
        <button
          className="sp-wishlist-btn"
          onClick={() => onToggleWish(p.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="sp-card__body">
        <div className="sp-card__category">{p.category}</div>
        <div className="sp-card__name">{p.name}</div>

        <div className="sp-card__tags">
          {p.tags.map((tag) => (
            <span key={tag} className="sp-card__tag">
              {tag}
            </span>
          ))}
          {p.sameDay && (
            <span className="sp-card__tag sp-card__tag--express">
              ⚡ Same Day
            </span>
          )}
        </div>

        {viewMode === "list" && (
          <p className="sp-card__desc">{p.desc}</p>
        )}

        <div className="sp-card__rating">
          <span className="sp-card__stars">{starsHTML(p.rating)}</span>
          <span className="sp-card__reviews">
            {p.rating} ({p.reviews})
          </span>
        </div>

        <div className="sp-card__footer">
          <div>
            <span className="sp-card__price">
              ₹{p.price.toLocaleString()}
            </span>
            {p.oldPrice && (
              <span className="sp-card__old-price">
                ₹{p.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            className={`sp-add-btn ${isAdded ? "sp-add-btn--added" : ""}`}
            onClick={() => onAddToCart(p)}
            aria-label={`Add ${p.name} to cart`}
          >
            {isAdded ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
