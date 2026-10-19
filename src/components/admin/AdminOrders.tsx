import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Order } from '../../types';
import {
  Search,
  Filter,
  Printer,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, formatPrice, dispatchOrderToCourier } = useEcommerce();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchSearch =
      !search.trim() ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Orders & Courier Fulfillment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track Pathao & Steadfast logistics handoffs, inspect atomic payment transactions, and print invoices.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Orders Recorded: <strong className="text-white">{orders.length}</strong>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ref (BDS-...), customer name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order Ref / Date</th>
                <th className="py-3 px-4">Customer & Address</th>
                <th className="py-3 px-4">Courier & Zone</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-cyan-400">{order.orderNumber}</div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{order.shippingAddress}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="capitalize text-slate-200 font-medium">{order.shippingZone.replace('_', ' ')}</div>
                    <div className="text-[11px] text-cyan-400">{order.trackingCourier}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Ref: {order.trackingNumber}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white">{formatPrice(order.total)}</div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      {order.paymentMethod} · {order.paymentStatus}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-medium cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5">
                    {order.orderStatus !== 'shipped' && order.orderStatus !== 'delivered' && (
                      <button
                        onClick={() => {
                          const res = dispatchOrderToCourier(order.id, 'Steadfast');
                          alert(res.message);
                        }}
                        className="inline-flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                        title="1-Click Dispatch to Steadfast Courier API"
                      >
                        <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Send to Steadfast</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      title="View & Print Official Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-950 text-cyan-400 flex items-center justify-center font-bold font-display">
                    BD
                  </div>
                  <span className="font-display font-black text-xl text-slate-900">BD SHOP LTD</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Dhaka Fulfillment Hub · Road 11, Banani, Dhaka-1213 <br />
                  VAT Registration: BIN 00389124-0102
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tax Invoice</div>
                <div className="font-mono font-bold text-slate-900 text-base">{selectedOrder.orderNumber}</div>
                <div className="text-xs text-slate-500">{new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Customer Details</div>
                <div className="font-semibold text-slate-900 text-sm mt-1">{selectedOrder.customerName}</div>
                <div className="text-slate-600">{selectedOrder.customerPhone}</div>
                <div className="text-slate-600">{selectedOrder.customerEmail}</div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Shipping Destination</div>
                <div className="text-slate-800 mt-1">{selectedOrder.shippingAddress}</div>
                <div className="text-slate-600">{selectedOrder.city} - {selectedOrder.postalCode}</div>
                <div className="text-slate-600 capitalize">Zone: {selectedOrder.shippingZone.replace('_', ' ')}</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border-t border-slate-200">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-slate-800">{it.title}</td>
                    <td className="py-2.5 font-mono text-slate-500">{it.sku}</td>
                    <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatPrice(it.price)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{formatPrice(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total breakdown */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({selectedOrder.couponCode}):</span>
                  <span className="font-mono">- {formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span className="font-mono">৳{selectedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="font-mono">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
