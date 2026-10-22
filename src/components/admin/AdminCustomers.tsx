import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  UserCheck,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, formatPrice, orders } = useEcommerce();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || c.district.toLowerCase().includes(districtFilter.toLowerCase());
    return matchesSearch && matchesDistrict;
  });

  const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-400 font-black border border-purple-800">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Customer Intelligence & VIP Registry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your registered customer accounts, total order lifetime value, and delivery demographics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-950 text-purple-300 font-mono font-bold px-3 py-1.5 rounded-xl border border-purple-800">
            {customers.length} Registered Customers
          </span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Registered Customers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-display font-black text-2xl text-white font-mono">
            {customers.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>100% Verified Bangladesh Phone Numbers</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Combined Lifetime Value</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl text-white font-mono">
            {formatPrice(totalSpentAll)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Average LTV: {formatPrice(Math.round(totalSpentAll / customers.length))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Top Geographic Zones</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-black text-base text-white">
            Dhaka (Banani, Uttara, Gulshan) & CTG
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fastest Steadfast 24h Courier Coverage
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone (017...), email, or district..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">District / Area</th>
                <th className="py-3 px-4 text-center">Orders Count</th>
                <th className="py-3 px-4 font-mono">Lifetime Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((cust, idx) => (
                <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {cust.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{cust.name}</div>
                        <div className="text-[11px] text-slate-400">{cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-300">
                    {cust.phone}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{cust.district}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                      {cust.ordersCount} orders
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {formatPrice(cust.totalSpent)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {cust.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
