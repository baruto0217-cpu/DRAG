/**
 * DrugAlertCard.jsx
 * 薬剤アラートカード（薬名検索タブ用）
 *
 * Props:
 *   alert    {object}  アラートデータ（ALERTS配列の1要素）
 *   isOpen   {boolean} 展開状態
 *   onToggle {func}    開閉切替ハンドラ
 *   query    {string}  検索キーワード（ハイライト用）
 *   highlight {func}   ハイライト関数
 */

import { LEVEL_META, CATEGORY_COLORS } from "../data/constants.js";

export function DrugAlertCard({ alert, isOpen, onToggle, query, highlight }) {
  const lm = LEVEL_META[alert.level];
  const catColor = CATEGORY_COLORS[alert.category] || "#4a5568";

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${isOpen ? alert.color : "#2d3748"}`,
        overflow: "hidden",
        background: "#161b27",
        transition: "border-color 0.15s",
      }}
    >
      {/* ── カードヘッダー（常時表示） ── */}
      <div
        onClick={onToggle}
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}
      >
        <span style={{ fontSize: 24, flexShrink: 0 }}>{alert.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 重要度・カテゴリバッジ */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: lm.bg, color: lm.color, border: `1px solid ${lm.color}` }}>
              🚨 {lm.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: catColor + "22", color: catColor, border: `1px solid ${catColor}55` }}>
              {alert.category}
            </span>
          </div>

          {/* タイトル */}
          <div style={{ fontWeight: 800, fontSize: 14, color: "#f7fafc", marginBottom: 4, lineHeight: 1.4 }}>
            {highlight(alert.title)}
          </div>

          {/* 薬剤名タグ */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {alert.drugs.slice(0, 6).map((d, i) => (
              <span key={i} style={{ fontSize: 10, color: "#4a90d9", background: "#0d1f35", borderRadius: 4, padding: "1px 6px" }}>
                {highlight(d)}
              </span>
            ))}
            {alert.drugs.length > 6 && (
              <span style={{ fontSize: 10, color: "#4a5568" }}>+{alert.drugs.length - 6}件</span>
            )}
          </div>

          {/* ステム情報 */}
          <div style={{ fontSize: 10, color: "#4a5568", marginTop: 3 }}>{alert.stemHint}</div>

          {/* 背景疾患タグ */}
          {alert.diseases && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
              {alert.diseases.slice(0, 3).map((d, i) => (
                <span key={i} style={{ fontSize: 9, color: "#4a9568", background: "#0a1f14", border: "1px solid #1a4a2a", borderRadius: 4, padding: "1px 5px" }}>
                  {d}
                </span>
              ))}
              {alert.diseases.length > 3 && (
                <span style={{ fontSize: 9, color: "#4a5568" }}>+{alert.diseases.length - 3}件</span>
              )}
            </div>
          )}
        </div>
        <span style={{ color: "#4a5568", fontSize: 13, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", marginTop: 4 }}>▼</span>
      </div>

      {/* ── 展開詳細 ── */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${alert.color}44`, background: "#0f1420" }}>
          <div style={{ padding: "12px 14px" }}>

            {/* 背景疾患（全件） */}
            {alert.diseases && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#68d391", fontWeight: 800, marginBottom: 6, letterSpacing: "0.08em" }}>
                  🏥 この薬を飲んでいる人が患っている疾患
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {alert.diseases.map((d, i) => (
                    <span key={i} style={{ fontSize: 11, color: "#68d391", background: "#0d2a1a", border: "1px solid #276749", borderRadius: 6, padding: "3px 9px" }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 疑うべき病態とアクション */}
            <div style={{ fontSize: 11, color: "#e53e3e", fontWeight: 800, marginBottom: 8, letterSpacing: "0.08em" }}>
              🚨 疑うべき病態とアクション
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alert.conditions.map((cond, i) => (
                <div key={i} style={{ background: "#161b27", borderRadius: 8, border: `1px solid ${alert.color}44`, overflow: "hidden" }}>
                  <div style={{ background: alert.color + "22", padding: "6px 12px", fontWeight: 700, fontSize: 13, color: alert.color }}>
                    {highlight(cond.name)}
                  </div>
                  <div style={{ padding: "8px 12px" }}>
                    <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.7, marginBottom: 6, whiteSpace: "pre-line" }}>
                      {highlight(cond.desc)}
                    </div>
                    <div style={{ fontSize: 12, color: "#f6ad55", background: "#1a1400", borderLeft: "3px solid #d97706", borderRadius: "0 4px 4px 0", padding: "5px 10px", lineHeight: 1.6 }}>
                      ▶ {highlight(cond.action)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 覚えておくべきポイント */}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#63b3ed", fontWeight: 800, marginBottom: 6, letterSpacing: "0.08em" }}>
                📌 覚えておくべきポイント
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {alert.points.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "#e2e8f0", lineHeight: 1.7 }}>
                    <span style={{ color: "#63b3ed", flexShrink: 0 }}>•</span>
                    <span>{highlight(p)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
