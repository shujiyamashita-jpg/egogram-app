import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SCALE_LABELS, SCALE_COLORS, type ScaleKey } from '../data/questions'

interface Result {
  id: number; name: string; email: string;
  cp: number; np: number; a: number; fc: number; ac: number; rc: number;
  created_at: string;
}

const SCALES: ScaleKey[] = ['cp', 'np', 'a', 'fc', 'ac', 'rc']

export default function AdminPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/results')
      .then(r => r.json())
      .then(data => { setResults(data); setLoading(false) })
      .catch(() => { setError('データ取得失敗。バックエンドを確認してください。'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`${name} さんのデータを削除しますか？`)) return
    await fetch(`/api/results/${id}`, { method: 'DELETE' })
    load()
  }

  function handleExport() {
    window.open('/api/export/csv', '_blank')
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22 }}>管理画面 — 受験者一覧</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ background: '#ecf0f1', color: '#2c3e50' }}>更新</button>
          <button onClick={handleExport} style={{ background: '#27ae60', color: '#fff' }}>CSV出力</button>
        </div>
      </div>

      {error && <p style={{ color: '#e74c3c', marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <p style={{ color: '#7f8c8d' }}>読み込み中...</p>
      ) : results.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', color: '#95a5a6', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>
          受験者データがありません
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={th}>氏名</th>
                  <th style={th}>メール</th>
                  {SCALES.map(s => (
                    <th key={s} style={{ ...th, color: SCALE_COLORS[s] }}>
                      {SCALE_LABELS[s]}
                    </th>
                  ))}
                  <th style={th}>受験日時</th>
                  <th style={th}>操作</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={td}>
                      <Link to={`/result/${r.id}`} style={{ color: '#3498db', fontWeight: 600 }}>{r.name}</Link>
                    </td>
                    <td style={{ ...td, color: '#7f8c8d', fontSize: 13 }}>{r.email || '—'}</td>
                    {SCALES.map(s => (
                      <td key={s} style={{ ...td, textAlign: 'center', fontWeight: 700, color: SCALE_COLORS[s] }}>
                        {r[s]}
                      </td>
                    ))}
                    <td style={{ ...td, fontSize: 12, color: '#95a5a6' }}>
                      {new Date(r.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        style={{ background: '#e74c3c', color: '#fff', padding: '4px 12px', fontSize: 12 }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#2c3e50',
}
const td: React.CSSProperties = {
  padding: '12px 16px', fontSize: 14,
}
