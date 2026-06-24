/**
 * highlight.js
 * 検索キーワードをテキスト内でハイライト表示するユーティリティ
 *
 * @param {string} text    - 対象テキスト
 * @param {string} query   - 検索キーワード
 * @returns {Array|string} - React要素の配列、またはそのままのテキスト
 */
export function highlight(text, query) {
  if (!query?.trim() || typeof text !== "string") return text;

  const q = query.trim().toLowerCase();
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === q
      ? (
        <mark
          key={i}
          style={{
            background: "#f6e05e",
            color: "#1a1a1a",
            borderRadius: 2,
            padding: "0 1px",
          }}
        >
          {part}
        </mark>
      )
      : part
  );
}
