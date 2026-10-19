import React, { useState, useMemo } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    brands,
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublishProduct,
    formatPrice
  } = useEcommerce();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || 'cat_electronics');
  const [formBrand, setFormBrand] = useState('Apple');
  const [formPrice, setFormPrice] = useState(15000);
  const [formComparePrice, setFormComparePrice] = useState(18000);
  const [formDiscount, setFormDiscount] = useState(15);
  const [formStock, setFormStock] = useState(20);
  const [formLowStock, setFormLowStock] = useState(5);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrimaryImage, setFormPrimaryImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSku(`BDS-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory(categories[0]?.id || 'cat_electronics');
    setFormBrand('Sony Audio');
    setFormPrice(18500);
    setFormComparePrice(21000);
    setFormDiscount(12);
    setFormStock(25);
    setFormLowStock(5);
    setFormIsPublished(true);
    setFormIsFeatured(false);
    setFormShortDesc('Flagship performance and ultra-durable build quality.');
    setFormDesc('Engineered with premium materials for discerning consumers in Bangladesh.');
    setFormPrimaryImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormSku(p.sku);
    setFormCategory(p.categoryId);
    setFormBrand(p.brand);
    setFormPrice(p.price);
    setFormComparePrice(p.compareAtPrice || 0);
    setFormDiscount(p.discountPercent || 0);
    setFormStock(p.stock);
    setFormLowStock(p.lowStockThreshold);
    setFormIsPublished(p.isPublished);
    setFormIsFeatured(p.isFeatured);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormPrimaryImage(p.primaryImage);
    setIsCreateModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find(c => c.id === formCategory);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: formTitle,
        sku: formSku,
        categoryId: formCategory,
        categoryName: catObj?.name || 'Smartphones & Tech',
        brand: formBrand,
        price: Number(formPrice),
        compareAtPrice: Number(formComparePrice) || undefined,
        discountPercent: Number(formDiscount) || 0,
        stock: Number(formStock),
        lowStockThreshold: Number(formLowStock),
        isPublished: formIsPublished,
        isFeatured: formIsFeatured,
        shortDescription: formShortDesc,
        description: formDesc,
        primaryImage: formPrimaryImage,
        images: [formPrimaryImage]
      });
      setNotification(`Product "${formTitle}" updated & edge nodes synced!`);
    } else {
      createProduct({
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6),
        sku: formSku,
        categoryId: formCategory,
        categoryName: catObj?.name || 'Smartphones & Tech',
        brand: formBrand,
        price: Number(formPrice),
        compareAtPrice: Number(formComparePrice) || undefined,
        discountPercent: Number(formDiscount) || 0,
        stock: Number(formStock),
        lowStockThreshold: Number(formLowStock),
        isPublished: formIsPublished,
        isFeatured: formIsFeatured,
        shortDescription: formShortDesc,
        description: formDesc,
        primaryImage: formPrimaryImage,
        images: [formPrimaryImage],
        specifications: {
          'Origin': 'Official International Distributor',
          'Warranty': '1 Year BD Official'
        },
        tags: ['New Release', 'Synchronized']
      });
      setNotification(`Product "${formTitle}" published live to storefront!`);
    }

    setIsCreateModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  // Bulk Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bdshop-products-catalog-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Bulk Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'SKU', 'Category', 'Brand', 'Price_BDT', 'Stock', 'IsPublished'];
    const rows = products.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.sku,
      p.categoryName,
      p.brand,
      p.price,
      p.stock,
      p.isPublished ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `bdshop-products-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Modifications trigger instant cache purge across Cloudflare CDN & Redis in sub-seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="Export Catalog as CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="Export Catalog as JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={openCreateModal}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU, or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU / Brand</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.primaryImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                      />
                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <div className="font-semibold text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-400">{p.categoryName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-cyan-400 font-semibold">{p.sku}</div>
                    <div className="text-[11px] text-slate-400">{p.brand}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {formatPrice(p.price)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold text-xs ${
                        p.stock <= 0
                          ? 'text-rose-400'
                          : p.stock <= p.lowStockThreshold
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublishProduct(p.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono transition-colors cursor-pointer ${
                        p.isPublished
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {p.isPublished ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Unpublished</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-white">
                {editingProduct ? `Edit: ${editingProduct.title}` : 'Add New Catalog Product'}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={formPrimaryImage}
                    onChange={e => setFormPrimaryImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Selling Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Compare Price (৳)</label>
                  <input
                    type="number"
                    value={formComparePrice}
                    onChange={e => setFormComparePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formDiscount}
                    onChange={e => setFormDiscount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Low Stock Warning Threshold</label>
                  <input
                    type="number"
                    required
                    value={formLowStock}
                    onChange={e => setFormLowStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={e => setFormIsPublished(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-200">Publish immediately to Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={e => setFormIsFeatured(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-200">Featured in Spotlight</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  {editingProduct ? 'Save & Sync Updates' : 'Publish Product Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
