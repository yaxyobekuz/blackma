"use client";
import { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import useTranslate from "@/app/hooks/useTranslate";
import {
    ORDER_STATUS_FLOW,
    STATUS_LABELS,
    OrderStatus,
} from "@/app/lib/order-status";

type SortOption = {
    labelKey: string;
    value: string;
};

export type FilterState = {
    sortBy: string;
    statuses: OrderStatus[];
    dateFrom: string;
    dateTo: string;
};

type FilterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters?: FilterState;
};

const sortOptions: SortOption[] = [
    { labelKey: "filter.newest", value: "date_desc" },
    { labelKey: "filter.oldest", value: "date_asc" },
];

const STATUS_OPTIONS: OrderStatus[] = [
    ...ORDER_STATUS_FLOW,
    "CANCELLED",
];

export const defaultFilters: FilterState = {
    sortBy: "date_desc",
    statuses: [],
    dateFrom: "",
    dateTo: "",
};

export default function FilterModal({
    isOpen,
    onClose,
    onApply,
    initialFilters = defaultFilters,
}: FilterModalProps) {
    const { t } = useTranslate();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [visible, setVisible] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters);
            setVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialFilters]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) handleClose();
    };

    const handleReset = () => setFilters(defaultFilters);

    const handleApply = () => {
        onApply(filters);
        handleClose();
    };

    const toggleStatus = (status: OrderStatus) => {
        setFilters((f) => ({
            ...f,
            statuses: f.statuses.includes(status)
                ? f.statuses.filter((s) => s !== status)
                : [...f.statuses, status],
        }));
    };

    const activeFilterCount = [
        filters.sortBy !== "date_desc",
        filters.statuses.length > 0,
        filters.dateFrom !== "",
        filters.dateTo !== "",
    ].filter(Boolean).length;

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{
                backgroundColor: `rgba(0,0,0,${visible ? 0.45 : 0})`,
                transition: "background-color 0.3s ease",
                backdropFilter: visible ? "blur(4px)" : "blur(0px)",
            }}
        >
            <div
                className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
                style={{
                    transform: visible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
                    maxHeight: "90dvh",
                    overflowY: "auto",
                }}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{t("filter.title")}</h2>
                        {activeFilterCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} strokeWidth={2} className="text-gray-600" />
                    </button>
                </div>

                <div className="px-5 py-5 space-y-6">
                    {/* Sort By */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {t("filter.sorting")}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFilters((f) => ({ ...f, sortBy: opt.value }))}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left"
                                    style={{
                                        borderColor:
                                            filters.sortBy === opt.value ? "#3B82F6" : "#F3F4F6",
                                        backgroundColor:
                                            filters.sortBy === opt.value ? "#EFF6FF" : "#F9FAFB",
                                        color:
                                            filters.sortBy === opt.value ? "#1D4ED8" : "#374151",
                                    }}
                                >
                                    <span className="text-sm font-medium leading-snug">
                                        {t(opt.labelKey)}
                                    </span>
                                    {filters.sortBy === opt.value && (
                                        <Check size={15} strokeWidth={2.5} className="text-blue-500 shrink-0 ml-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {t("filter.status")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((status) => {
                                const active = filters.statuses.includes(status);
                                return (
                                    <button
                                        key={status}
                                        onClick={() => toggleStatus(status)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border-2 transition-all duration-200 text-sm"
                                        style={{
                                            borderColor: active ? "#3B82F6" : "#F3F4F6",
                                            backgroundColor: active ? "#EFF6FF" : "#F9FAFB",
                                            color: active ? "#1D4ED8" : "#374151",
                                        }}
                                    >
                                        {active && <Check size={13} strokeWidth={2.5} className="text-blue-500" />}
                                        <span className="font-medium">{STATUS_LABELS[status]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {t("filter.date_range")}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">
                                    {t("filter.from")}
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, dateFrom: e.target.value }))
                                    }
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                            <div className="w-5 h-0.5 bg-gray-300 shrink-0 mt-5" />
                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">
                                    {t("filter.to")}
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, dateTo: e.target.value }))
                                    }
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 pb-8 pt-2 flex gap-3 border-t border-gray-100">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                        {t("filter.clear")}
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-2 w-full py-3.5 rounded-2xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 active:scale-95 transition-all"
                        style={{ flex: 2 }}
                    >
                        {t("filter.apply")}
                        {activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
