/**
 * DiseaseCard.jsx
 * 疾患逆引きカード（疾患名検索タブ用）
 *
 * Props:
 *   disease  {object}  疾患データ（DISEASE_LOOKUP配列の1要素）
 *   catColor {string}  カテゴリカラー（hex）
 *   isOpen   {boolean} 展開状態
 *   onToggle {func}    開閉切替ハンドラ
 *   catLabel {string}  カテゴリ名
 */

export function DiseaseCard({ disease, catColor, isOpen, onToggle, catLabel }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${isOpen ? catColor : "#2d3748"}`,
        overflow: "hidden",
        background: "#161b27",
        transition: "border-color 0.15s",
      }}
    >
      {/* ── カードヘッダー ── */}
      <div
        onClick={onToggle}
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>{disease.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#f7fafc" }}>{disease.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 8, background: catColor + "22", color: catColor, border: `1px solid ${catColor}55` }}>
              {catLabel}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#4a5568" }}>
            服用中の可能性がある薬：{disease.drugs.map((d) => d.name.split("（")[0]).join(" / ")}
          </div>
        </div>
        <span style={{ color: "#4a5568", fontSize: 13, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
      </div>

      {/* ── 展開詳細 ── */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${catColor}44`, background: "#0f1420", padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#63b3ed", fontWeight: 800, marginBottom: 8, letterSpacing: "0.08em" }}>
            💊 服用中の可能性がある薬と注意事項
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {disease.drugs.map((drug, i) => (
              <div key={i} style={{ background: "#161b27", borderRadius: 8, border: "1px solid #2d3748", overflow: "hidden" }}>
                <div style={{ background: catColor + "18", padding: "6px 12px" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: catColor }}>{drug.name}</span>
                </div>
                <div style={{ padding: "8px 12px" }}>
                  <div style={{ fontSize: 11, color: "#718096", marginBottom: 5 }}>
                    処方目的：<span style={{ color: "#a0aec0" }}>{drug.reason}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#f6ad55", background: "#1a1400", borderLeft: "3px solid #e53e3e", borderRadius: "0 4px 4px 0", padding: "6px 10px", lineHeight: 1.7 }}>
                    ⚠ {drug.alerts}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
