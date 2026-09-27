import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Table,
  Zap,
  Lock,
  ExternalLink,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  HealthCheckReport,
  checkDatabaseHealth,
  getSessionId,
  resetSessionId,
  SUPABASE_URL,
  SUPABASE_SETUP_SQL,
  SUPABASE_DASHBOARD_SQL_URL
} from '../lib/supabase';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionReset: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onSessionReset,
}) => {
  const [report, setReport] = useState<HealthCheckReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);
  const currentSession = getSessionId();

  const projectRef = (report?.url || SUPABASE_URL)
    .replace('https://', '')
    .split('.')[0];

  const sqlEditorUrl =
    projectRef && projectRef !== 'wwxalepbdmfjdzadisgp'
      ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
      : SUPABASE_DASHBOARD_SQL_URL;

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await checkDatabaseHealth();
      setReport(res);
    } catch (err) {
      console.warn('Health check query notice:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySession = () => {
    navigator.clipboard.writeText(currentSession);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleResetSession = () => {
    resetSessionId();
    onSessionReset();
    runCheck();
  };

  const isReady = report?.isSchemaReady;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
              isReady
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                : 'bg-amber-500/20 border-amber-400/40 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
                  Database & API Verification
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  isReady
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isReady ? 'Active & Seeded' : 'Setup Pending'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Supabase endpoint status & schema integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status banner */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border ${
            isReady
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isReady
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
              }`}>
                {isReady ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className={`font-bold text-sm ${
                  isReady ? 'text-emerald-950 dark:text-emerald-300' : 'text-amber-950 dark:text-amber-300'
                }`}>
                  {isReady ? 'Supabase Database Connected & Ready (200 OK)' : 'Endpoint Connected — Schema Tables Pending'}
                </div>
                <div className={`text-xs ${
                  isReady ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {isReady
                    ? 'All tables created and accessible via publishable key with RLS.'
                    : 'The database is linked, but public tables (products, categories, etc.) are waiting to be created.'}
                </div>
              </div>
            </div>
            <button
              onClick={runCheck}
              disabled={loading}
              className={`px-3 py-1.5 bg-white dark:bg-slate-800 border text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0 ${
                isReady
                  ? 'border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                  : 'border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-verify
            </button>
          </div>

          {/* Quick Setup Guide if Schema is Pending */}
          {!isReady && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1-Step Database Setup</span>
                </div>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Takes 10 seconds
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Run the setup SQL in your Supabase project to automatically create the tables, security policies, and initial product catalog:
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>SQL Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Setup SQL Script</span>
                    </>
                  )}
                </button>

                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowSqlPreview((prev) => !prev)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showSqlPreview ? 'Hide SQL Code' : 'View SQL Code'}</span>
                  {showSqlPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showSqlPreview && (
                <div className="mt-2 rounded-xl bg-slate-950 text-slate-300 p-3 text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                  <pre>{SUPABASE_SETUP_SQL}</pre>
                </div>
              )}
            </div>
          )}

          {/* Connection Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-semibold">
                <Server className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Host Endpoint</span>
              </div>
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate" title={report?.url || SUPABASE_URL}>
                {projectRef}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">supabase.co (REST v1)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>API Latency</span>
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-base">
                {report?.latencyMs ? `${report.latencyMs} ms` : 'Measuring...'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Round-trip query speed</div>
            </div>
          </div>

          {/* Tables Verified Grid */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-slate-400" />
              Verified Tables & Collections
            </div>

            <div className="space-y-2">
              {[
                {
                  name: 'products',
                  label: 'Product Catalog',
                  count: report?.tables.products.count ?? 0,
                  desc: 'Names, prices, tags, brands, and imagery',
                  ok: report?.tables.products.ok ?? false,
                  statusText: report?.tables.products.ok ? 'Active in DB' : 'Pending SQL Setup',
                },
                {
                  name: 'categories',
                  label: 'Product Categories',
                  count: report?.tables.categories.count ?? 0,
                  desc: 'Clothing, Footwear, Toys, Accessories, Baby, Gift',
                  ok: report?.tables.categories.ok ?? false,
                  statusText: report?.tables.categories.ok ? 'Active in DB' : 'Pending SQL Setup',
                },
                {
                  name: 'cart_items',
                  label: 'Shopping Cart Session Items',
                  count: report?.tables.cart_items.count ?? 0,
                  desc: 'Read/Write enabled for anonymous user sessions',
                  ok: report?.tables.cart_items.ok ?? false,
                  statusText: report?.tables.cart_items.ok ? 'Active in DB' : 'Local Fallback Active',
                },
                {
                  name: 'wishlist_items',
                  label: 'Saved Favorites',
                  count: report?.tables.wishlist_items.count ?? 0,
                  desc: 'Read/Write enabled for anonymous user sessions',
                  ok: report?.tables.wishlist_items.ok ?? false,
                  statusText: report?.tables.wishlist_items.ok ? 'Active in DB' : 'Local Fallback Active',
                },
                {
                  name: 'product_reviews',
                  label: 'Parent Reviews & Ratings',
                  count: report?.tables.product_reviews?.count ?? 0,
                  desc: 'Ratings, titles, feedback comments, and helpful votes',
                  ok: report?.tables.product_reviews?.ok ?? false,
                  statusText: report?.tables.product_reviews?.ok ? 'Active in DB' : 'Local Fallback Active',
                },
              ].map((table) => (
                <div
                  key={table.name}
                  className={`p-3 rounded-2xl border bg-white dark:bg-slate-800/80 flex items-center justify-between transition-colors ${
                    table.ok
                      ? 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500'
                      : 'border-amber-200/80 dark:border-amber-900/60 bg-amber-50/20'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {table.name}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        ({table.label})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{table.desc}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      table.ok
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {table.ok ? `${table.count} rows` : table.statusText}
                    </span>
                    {table.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Session Management */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/70 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Active Session UUID (Cart & Wishlist key)
              </span>
              <button
                onClick={handleResetSession}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold underline text-[11px] cursor-pointer"
              >
                Reset Session
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-amber-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <span className="truncate flex-1">{currentSession}</span>
              <button
                onClick={handleCopySession}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy Session ID"
              >
                {copiedSession ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              Each user gets a persistent session ID in localStorage that binds cart and wishlist rows in Supabase without requiring user account creation.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isReady ? '✓ Database fully operational' : '• Script: supabase_schema.sql'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Close Verification Panel
          </button>
        </div>
      </div>
    </div>
  );
};
