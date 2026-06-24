/**
 * App.jsx
 * 薬剤逆引き警戒アプリ - メインコンポーネント
 *
 * 機能:
 *   - 💊 薬名から検索：薬名 → 疑うべき病態・現場アクション
 *   - 🏥 疾患名から検索：疾患名 → 服用中の可能性がある薬・注意事項
 */

import { useState, useMemo } from "react";
import { ALERTS } from "./data/alerts.js";
import { DISEASE_LOOKUP, DISEASE_CATEGORY_MAP, DISEASE_CATEGORIES } from "./data/diseases.js";
import {
  LEVEL_META,
  CATEGORY_COLORS,
  DISEASE_CAT_COLORS,
  DRUG_CATEGORIES,
  DRUG_SEARCH_HINTS,
  DISEASE_SEARCH_HINTS,
} from "./data/constants.js";
import { highlight as highlightText } from "./utils/highlight.js";
import { DrugAlertCard } from "./components/DrugAlertCard.jsx";
import { DiseaseCard } from "./components/DiseaseCard.jsx";

export default function App() {
  // ── モード切替 ──
  const [mode, setMode] = useState("drug"); // "drug" | "disease"

  // ── 薬名検索タブの状態 ──
  const [drugQuery, setDrugQuery] = useState("");
  const [drugCategory, setDrugCategory] = useState("すべて");
  const [openAlertId, setOpenAlertId] = useState(null);

  // ── 疾患検索タブの状態 ──
  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [diseaseCat, setDiseaseCat] = useState("すべて");
  const [openDiseaseId, setOpenDiseaseId] = useState(null);

  // ── フィルタリング（薬名） ──
  const filteredAlerts = useMemo(() => {
    return ALERTS.filter((a) => {
      const matchCat = drugCategory === "すべて" || a.category === drugCategory;
      const q = drugQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        a.drugs.some((d) => d.toLowerCase().includes(q)) ||
        a.stemHint.toLowerCase().includes(q) ||
        a.title.includes(q) ||
        a.conditions.some((c) => c.name.includes(q) || c.desc.includes(q)) ||
        a.points.some((p) => p.includes(q));
      return matchCat && matchQ;
    });
  }, [drugQuery, drugCategory]);

  // ── フィルタリング（疾患名） ──
  const filteredDiseases = useMemo(() => {
    return DISEASE_LOOKUP.filter((d) => {
      const matchCat = diseaseCat === "すべて" || DISEASE_CATEGORY_MAP[d.id] === diseaseCat;
      const q = diseaseQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.drugs.some((dr) => dr.name.toLowerCase().includes(q) || dr.alerts.includes(q) || dr.reason.includes(q));
      return matchCat && matchQ;
    });
  }, [diseaseQuery, diseaseCat]);

  // ── ハイライト関数（現在のqueryに応じて切替） ──
  const highlight = (text) =>
    highlightText(text, mode === "drug" ? drugQuery : diseaseQuery);

  // ── スタイル定数 ──
  const BASE = {
    fontFamily: "'Noto Sans JP','Hiragino Sans',sans-serif",
    background: "#0a0d14",
    minHeight: "100vh",
    color: "#e2e8f0",
  };

  return (
    <div style={BASE}>

      {/* ════════════════════════════════
          ヘッダー
      ════════════════════════════════ */}
      <div style={{ background: "linear-gradient(135deg, #1a0a0a 0%, #0a0d14 60%)", borderBottom: "2px solid #e53e3e", padding: "18px 20px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* タイトル */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>⚠️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                薬剤逆引き警戒アプリ
              </h1>
              <p style={{ margin: 0, fontSize: 11, color: "#718096", letterSpacing: "0.08em" }}>
                DRUG ALERT REVERSE LOOKUP — お薬手帳を見たら→この病態を疑え｜全{ALERTS.length}パターン / 疾患{DISEASE_LOOKUP.length}種
              </p>
            </div>
          </div>

          {/* 使い方バナー */}
          <div style={{ background: "#1a1a0a", border: "1px solid #d97706", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#d97706", lineHeight: 1.7, marginBottom: 12 }}>
            💡 <strong>使い方：</strong>
            お薬手帳で薬名を見つけたら「薬名から検索」、傷病者の既往歴から調べたい場合は「疾患名から検索」
          </div>

          {/* モード切替タブ */}
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { key: "drug",    label: "💊 薬名から検索" },
              { key: "disease", label: "🏥 疾患名から検索" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: mode === m.key ? "#0a0d14" : "transparent",
                  color: mode === m.key ? "#fff" : "#718096",
                  borderBottom: mode === m.key ? "2px solid #e53e3e" : "2px solid transparent",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          コンテンツエリア
      ════════════════════════════════ */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 14px" }}>

        {/* ─── 疾患名から検索タブ ─── */}
        {mode === "disease" && (
          <div>
            {/* 検索バー */}
            <SearchBar
              value={diseaseQuery}
              onChange={(v) => { setDiseaseQuery(v); setOpenDiseaseId(null); }}
              placeholder="疾患名で検索（例：心房細動、糖尿病、てんかん…）"
            />

            {/* 検索ヒント */}
            {!diseaseQuery && (
              <SearchHints hints={DISEASE_SEARCH_HINTS} onSelect={(h) => setDiseaseQuery(h)} />
            )}

            {/* カテゴリフィルター */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {DISEASE_CATEGORIES.map((cat) => {
                const active = diseaseCat === cat;
                const color = DISEASE_CAT_COLORS[cat] || "#4a5568";
                return (
                  <button
                    key={cat}
                    onClick={() => { setDiseaseCat(cat); setOpenDiseaseId(null); }}
                    style={{ padding: "5px 11px", borderRadius: 14, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: active ? color : "#161b27", color: active ? "#fff" : "#718096", transition: "all 0.15s" }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 11, color: "#4a5568", marginBottom: 10 }}>
              {filteredDiseases.length} / {DISEASE_LOOKUP.length} 件表示
            </p>

            {/* 疾患カードリスト */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredDiseases.map((disease) => {
                const catColor = DISEASE_CAT_COLORS[DISEASE_CATEGORY_MAP[disease.id]] || "#4a5568";
                return (
                  <DiseaseCard
                    key={disease.id}
                    disease={disease}
                    catColor={catColor}
                    catLabel={DISEASE_CATEGORY_MAP[disease.id]}
                    isOpen={openDiseaseId === disease.id}
                    onToggle={() => setOpenDiseaseId(openDiseaseId === disease.id ? null : disease.id)}
                  />
                );
              })}
            </div>

            {filteredDiseases.length === 0 && (
              <EmptyState query={diseaseQuery} onClear={() => setDiseaseQuery("")} />
            )}
          </div>
        )}

        {/* ─── 薬名から検索タブ ─── */}
        {mode === "drug" && (
          <div>
            {/* 検索バー */}
            <SearchBar
              value={drugQuery}
              onChange={(v) => { setDrugQuery(v); setOpenAlertId(null); }}
              placeholder="薬名・商品名・病態名で検索（例：ワーファリン、ジゴキシン、低血糖…）"
            />

            {/* 検索ヒント */}
            {!drugQuery && (
              <SearchHints hints={DRUG_SEARCH_HINTS} onSelect={(h) => setDrugQuery(h)} />
            )}

            {/* カテゴリフィルター */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              {DRUG_CATEGORIES.map((cat) => {
                const active = drugCategory === cat;
                const color = CATEGORY_COLORS[cat] || "#4a5568";
                return (
                  <button
                    key={cat}
                    onClick={() => { setDrugCategory(cat); setOpenAlertId(null); }}
                    style={{ padding: "5px 11px", borderRadius: 14, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: active ? color : "#161b27", color: active ? "#fff" : "#718096", transition: "all 0.15s" }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 11, color: "#4a5568", marginBottom: 10 }}>
              {filteredAlerts.length} / {ALERTS.length} 件表示
            </p>

            {/* アラートカードリスト */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredAlerts.map((alert) => (
                <DrugAlertCard
                  key={alert.id}
                  alert={alert}
                  isOpen={openAlertId === alert.id}
                  onToggle={() => setOpenAlertId(openAlertId === alert.id ? null : alert.id)}
                  query={drugQuery}
                  highlight={highlight}
                />
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <EmptyState query={drugQuery} onClear={() => setDrugQuery("")} />
            )}

            {/* 重要度凡例 */}
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(LEVEL_META).map(([k, v]) => (
                <span
                  key={k}
                  style={{ background: v.bg, color: v.color, border: `1px solid ${v.color}`, borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: 11 }}
                >
                  🚨 {v.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 免責事項 */}
        <div style={{ marginTop: 16, padding: 10, background: "#1a0f0f", borderRadius: 8, border: "1px solid #4a1818", fontSize: 11, color: "#4a5568", lineHeight: 1.7 }}>
          ⚠️ 本アプリは学習・参照用です。実際の判断は各施設のプロトコルと医師の指示に従ってください。
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════
// 共通UIコンポーネント（小規模のためApp内に配置）
// ════════════════════════════════

/** 検索バー */
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 10 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "12px 36px 12px 38px", background: "#161b27", border: "1px solid #2d3748", borderRadius: 8, color: "#e2e8f0", fontSize: 15, outline: "none" }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#718096", cursor: "pointer", fontSize: 18 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

/** 検索ヒントボタン群 */
function SearchHints({ hints, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
      {hints.map((h) => (
        <button
          key={h}
          onClick={() => onSelect(h)}
          style={{ padding: "3px 10px", borderRadius: 12, border: "1px solid #2d3748", background: "none", color: "#718096", fontSize: 11, cursor: "pointer" }}
        >
          {h}
        </button>
      ))}
    </div>
  );
}

/** 検索結果ゼロ時の表示 */
function EmptyState({ query, onClear }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "#4a5568" }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
      <p>「{query}」に一致する結果が見つかりません</p>
      <button
        onClick={onClear}
        style={{ marginTop: 8, padding: "6px 16px", borderRadius: 8, border: "1px solid #2d3748", background: "none", color: "#718096", cursor: "pointer", fontSize: 13 }}
      >
        検索をクリア
      </button>
    </div>
  );
}
