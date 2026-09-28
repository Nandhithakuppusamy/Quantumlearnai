import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart3,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { stockLogService, productService } from '../api/services';
import { formatDateTime } from '../utils/formatDate';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const StockLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stockLogService.getAll({
        product: selectedProduct === 'All' ? '' : selectedProduct,
        changeType: selectedType === 'All' ? '' : selectedType,
        page: currentPage,
        limit: 15
      });
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load stock logs', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProduct, selectedType, currentPage]);

  useEffect(() => {
    productService.getAll({ limit: 100 }).then((res) => {
      setProductsList(res.products || []);
    });
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'sale':
        return {
          label: 'Sale Deduct',
          bg: 'bg-red-50 text-red-700 border-red-200/60',
          icon: ArrowDownLeft
        };
      case 'purchase':
        return {
          label: 'Purchase / Inward',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          icon: ArrowUpRight
        };
      case 'adjustment':
        return {
          label: 'Adjustment',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
          icon: SlidersHorizontal
        };
      case 'return':
        return {
          label: 'Customer Return',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
          icon: RotateCcw
        };
      default:
        return {
          label: type,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: BarChart3
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Inventory Stock Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete audit trail of sales deductions, supplier inward entries, and inventory adjustments.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={fetchLogs}
          loading={loading}
        >
          Refresh Logs
        </Button>
      </div>

      {/* Filter Control Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Product Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="All">All Products</option>
              {productsList.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Change Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="All">All Change Types</option>
              <option value="purchase">Purchase (Inward)</option>
              <option value="sale">Sale (Deduction)</option>
              <option value="adjustment">Manual Adjustment</option>
              <option value="return">Customer Return</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-500 overflow-x-auto w-full md:w-auto justify-start md:justify-end">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Purchase
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Sale
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Adjustment
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Return
          </span>
        </div>
      </div>

      {/* Stock Logs Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden relative">
        {loading && <LoadingSpinner overlay message="Updating audit logs..." />}

        {logs.length === 0 && !loading ? (
          <div className="p-12 text-center text-slate-500">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Stock Logs Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              No inventory movements recorded matching your current filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Product Name</th>
                  <th className="px-4 py-3.5 text-center">Type</th>
                  <th className="px-4 py-3.5 text-center">Quantity Change</th>
                  <th className="px-4 py-3.5 text-center">Ending Balance</th>
                  <th className="px-5 py-3.5">Reference / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const badge = getTypeBadge(log.changeType);
                  const Icon = badge.icon;
                  const isPositive = Number(log.changeQty) > 0;

                  return (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 text-xs text-slate-600 font-mono">
                        {formatDateTime(log.createdAt)}
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        {log.productName}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3 shrink-0" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono font-bold">
                        <span
                          className={
                            isPositive
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }
                        >
                          {isPositive ? `+${log.changeQty}` : log.changeQty}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center font-bold text-slate-800 font-mono">
                        {log.balanceQty}
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {log.reference && (
                          <span className="font-semibold text-slate-700 block">
                            Ref: {log.reference}
                          </span>
                        )}
                        <span>{log.notes || '—'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{logs.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{total}</span> log events
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-800">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockLogs;
