"use client";
import { useState, useMemo, useEffect } from "react";
import Order from "@/components/Order";
import useAuth from "./hooks/useAuth";
import { SlidersHorizontal } from "lucide-react";
import FilterModal, { FilterState, defaultFilters } from "@/components/FilterModal";
import useTranslate from "./hooks/useTranslate";
import { getCourierOrders, CourierOrder } from "./lib/courier.service";
import { STATUS_LABELS } from "./lib/order-status";

const page = () => {
  const { t } = useTranslate();
  useAuth();

  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<FilterState>(defaultFilters);

  useEffect(() => {
    const courierId = localStorage.getItem("courier_id");
    if (!courierId) return;

    getCourierOrders(courierId)
      .then((res) => {
        setOrders(Array.isArray(res.orders) ? res.orders : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeFilterCount = [
    activeFilters.sortBy !== "date_desc",
    activeFilters.statuses.length > 0,
    activeFilters.dateFrom !== "",
    activeFilters.dateTo !== "",
  ].filter(Boolean).length;

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter((o) =>
        o.orderId.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    if (activeFilters.statuses.length > 0) {
      result = result.filter((o) => activeFilters.statuses.includes(o.status));
    }

    if (activeFilters.dateFrom) {
      const from = new Date(activeFilters.dateFrom).getTime();
      result = result.filter((o) => new Date(o.createdAt).getTime() >= from);
    }
    if (activeFilters.dateTo) {
      const to = new Date(activeFilters.dateTo).getTime() + 86400000;
      result = result.filter((o) => new Date(o.createdAt).getTime() <= to);
    }

    if (activeFilters.sortBy === "date_asc") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return result;
  }, [orders, search, activeFilters]);

  return (
    <section className="container px-5">
      <center>
        <h1 className="font-bold text-2xl mt-5 mb-6">
          {t("home.title")}
        </h1>
      </center>

      {/* Search + Filter Row */}
      <section className="flex h-8 items-center justify-between gap-x-2 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 rounded-lg px-5 py-3"
          placeholder={t("orders.search_placeholder")}
        />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="relative bg-gray-200 h-12 w-14 p-1 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <SlidersHorizontal
            className="inline-block"
            size={25}
            strokeWidth={1}
          />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {activeFilterCount}
            </span>
          )}
        </button>
      </section>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {activeFilters.sortBy !== "date_desc" && (
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 font-medium">
              {t("filter.oldest")}
            </span>
          )}
          {activeFilters.statuses.map((s) => (
            <span
              key={s}
              className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 font-medium"
            >
              {STATUS_LABELS[s]}
            </span>
          ))}
          {(activeFilters.dateFrom || activeFilters.dateTo) && (
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 font-medium">
              {activeFilters.dateFrom || "..."} → {activeFilters.dateTo || "..."}
            </span>
          )}
          <button
            onClick={() => setActiveFilters(defaultFilters)}
            className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded-full border border-gray-200 transition-colors"
          >
            {t("filter.clear")} ✕
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gray-400 mb-3">
          {filteredOrders.length} {t("orders.orders_found")}
        </p>
      )}

      {/* Orders list */}
      <section className="flex flex-col w-full">
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Order
              key={order.id}
              orderId={order.id}
              createdAt={order.createdAt}
              status={order.status}
            />
          ))
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium text-gray-500">
              {t("orders.order_not_found")}
            </p>
            <p className="text-sm mt-1">{t("orders.change_filter")}</p>
          </div>
        )}
      </section>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => setActiveFilters(filters)}
        initialFilters={activeFilters}
      />
    </section>
  );
};

export default page;
