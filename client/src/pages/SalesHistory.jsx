import React, { useEffect, useState, useCallback } from 'react';
import { Search, Calendar, RefreshCw, X, Download, Filter } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import SalesTable from '../components/Sales/SalesTable';
import SaleDetailModal from '../components/Sales/SaleDetailModal';
import BillPreview from '../components/Billing/BillPreview';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const SalesHistory = () => {
  const { sales, total, totalPages, loading, fetchSales } = useSales();

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Selected sale for detail modal and bill preview modal
  const [viewingSale, setViewingSale] = useState(null);
  const [printingSale, setPrintingSale] = useState(null);

  const loadData = useCallback(() => {
    fetchSales({
      search,
      from: fromDate,
      to: toDate,
      page: currentPage,
      limit: 15
    });
  }, [fetchSales, search, fromDate, toDate, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  const handleSetQuickDate = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (preset === 'today') {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === 'week') {
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      setFromDate(lastWeek.toISOString().slice(0, 10));
      setToDate(todayStr);
    } else if (preset === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(firstDay.toISOString().slice(0, 10));
      setToDate(todayStr);
    } else if (preset === 'all') {
      setFromDate('');
      setToDate('');
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sales & Billing History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search invoices, filter by date, inspect customer transactions, and reprint bills.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={loadData}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Filter and Date Range Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box (5 cols) */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Bill #, Customer name, Phone..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* From Date (3 cols) */}
          <div className="md:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="From Date"
              />
            </div>
          </div>

          {/* To Date (3 cols) */}
          <div className="md:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="To Date"
              />
            </div>
          </div>

          {/* Clear Filters (1 col) */}
          {(search || fromDate || toDate) && (
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Reset all filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Last 7 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSetQuickDate(item.id)}
              className="px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table Section */}
      <div className="relative">
        {loading && <LoadingSpinner overlay message="Loading sales history..." />}
        <SalesTable
          sales={sales}
          loading={loading}
          onView={(sale) => setViewingSale(sale)}
          onPrint={(sale) => setPrintingSale(sale)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View Detail Modal */}
      <SaleDetailModal
        isOpen={Boolean(viewingSale)}
        onClose={() => setViewingSale(null)}
        sale={viewingSale}
        onPrint={(sale) => setPrintingSale(sale)}
      />

      {/* Printable Invoice Modal */}
      <BillPreview
        isOpen={Boolean(printingSale)}
        onClose={() => setPrintingSale(null)}
        sale={printingSale}
      />
    </div>
  );
};

export default SalesHistory;
