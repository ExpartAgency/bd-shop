import React, { useState, useMemo } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { SlidersHorizontal, ArrowUpDown, Sparkles, X, Flame } from 'lucide-react';

interface StoreCatalogProps {
  onSelectProduct: (product: Product) => void;
  selectedCategorySlug?: string;
  onClearCategoryFilter?: () => void;
}

export const StoreCatalog: React.FC<StoreCatalogProps> = ({
  onSelectProduct,
  selectedCategorySlug,
  onClearCategoryFilter
}) => {
  const { publishedProducts, categories, searchQuery, setSearchQuery, currentTheme } = useEcommerce();

  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<
    'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'sales'
  >('featured');

  // Sync category if prop changes
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...publishedProducts];

    // Filter by category
    if (activeCategory !== 'all') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) {
        list = list.filter(p => p.categoryId === cat.id);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'sales':
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [publishedProducts, activeCategory, categories, searchQuery, sortBy]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 space-y-4">
      {/* 1. Catalog Header with Quick Sorting & Active Matches */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold shadow-xs"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="font-display font-black text-base sm:text-lg text-gray-900 leading-tight">
              Explore Today's Recommended Deals
            </h2>
            <p className="text-[11px] text-gray-500">
              Showing {filteredProducts.length} live verified items with fast Bangladesh dispatch
            </p>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-500 font-medium">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-gray-100 hover:bg-gray-200/80 text-gray-800 text-xs font-semibold py-1.5 px-3 rounded-full border border-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="featured">🔥 Best Matches</option>
              <option value="sales">Top Sales</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (★ 4.5+)</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Filter Pills (Scrollable on phones) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => {
            setActiveCategory('all');
            if (onClearCategoryFilter) onClearCategoryFilter();
          }}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
            activeCategory === 'all'
              ? 'text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          style={{
            backgroundColor: activeCategory === 'all' ? currentTheme.primaryColor : undefined
          }}
        >
          All Items ({publishedProducts.length})
        </button>

        {categories.map(cat => {
          const count = publishedProducts.filter(p => p.categoryId === cat.id).length;
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              style={{
                backgroundColor: isActive ? currentTheme.primaryColor : undefined
              }}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Filter Chip (if active) */}
      {searchQuery && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#FA5D00]">
          <div className="flex items-center gap-2">
            <span>
              Search for: <strong>"{searchQuery}"</strong>
            </span>
            <span className="text-gray-500">({filteredProducts.length} items found)</span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <span>Clear</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Product Cards Grid (Strictly 2 Columns on Mobile, up to 5 on Desktop) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto text-[#FA5D00]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-gray-900 text-base">
            No products found matching criteria
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your category, clearing your search query, or check back soon for catalog restocks.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold px-5 py-2 rounded-full text-xs cursor-pointer shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
