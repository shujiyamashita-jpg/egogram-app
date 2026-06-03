import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { SCALE_LABELS, SCALE_COLORS, SCALE_DESCRIPTIONS, type ScaleKey } from '../data/questions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Result {
  id: number; name: string; email: string;
  cp: number; np: number; a: number; fc: number; ac: number; rc: number;
  created_at: string;
}

const SCALES: ScaleKey[] = ['cp', 'np', 'a', 'fc', 'ac', 'rc']

function getLevel(score: number) {
  if (score >= 24) return { label: '非常に高い', color: '#e74c3c' }
  if (score >= 18) return { label: '高い', color: '#e67e22' }
  if (score >= 11) return { label: '普通', color: '#3498db' }
  if (score >= 5)  return { label: '低い', color: '#95a5a6' }
  return { label: '非常に低い', color: '#bdc3c7' }
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/results/${id}`)
      .then(r => r.json())
      .then(data => { if (data.error) setError(data.error); else setResult(data) })
      .catch(() => setError('データの取得に失敗しました'))
  }, [id])

  if (error) return <div style={{ textAlign: 'center', marginTop: 60, color: '#e74c3c' }}>{error}</div>
  if (!result) return <div style={{ textAlign: 'center', marginTop: 60, color: '#7f8c8d' }}>読み込み中...</div>

  const chartData = {
    labels: SCALES.map(s => SCALE_LABELS[s]),
    datasets: [{
      label: 'スコア',
      data: SCALES.map(s => result[s]),
      backgroundColor: SCALES.map(s => SCALE_COLORS[s] + 'cc'),
      borderColor: SCALES.map(s => SCALE_COLORS[s]),
      borderWidth: 2,
      borderRadius: 6,
    }],
  }

  const highest = SCALES.reduce((a, b) => result[a] >= result[b] ? a : b)
  const lowest = SCALES.reduce((a, b) => result[a] <= result[b] ? a : b)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 60px' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>{result.name} さんの診断結果</h1>
        <p style={{ color: '#95a5a6', fontSize: 13, marginBottom: 32 }}>
          受験日時: {new Date(result.created_at).toLocaleString('ja-JP')}
        </p>

        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: { y: { min: 0, max: 30, ticks: { stepSize: 5 } } },
            plugins: { legend: { display: false } },
          }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>スコア詳細</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 13 }}>尺度</th>
              <th style={{ textAlign: 'center', padding: '8px 0', fontSize: 13 }}>スコア</th>
              <th style={{ textAlign: 'center', padding: '8px 0', fontSize: 13 }}>レベル</th>
            </tr>
          </thead>
          <tbody>
            {SCALES.map(s => {
              const level = getLevel(result[s])
              return (
                <tr key={s} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 0', fontSize: 14 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: SCALE_COLORS[s], marginRight: 8 }} />
                    {SCALE_LABELS[s]}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, color: SCALE_COLORS[s] }}>{result[s]}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ background: level.color + '22', color: level.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {level.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>採用担当者向けコメント</h2>
        <div style={{ marginBottom: 16, padding: 16, background: '#f8f9fa', borderRadius: 8, borderLeft: `4px solid ${SCALE_COLORS[highest]}` }}>
          <p style={{ fontSize: 13, color: '#7f8c8d', marginBottom: 4 }}>最も高い尺度: <strong style={{ color: SCALE_COLORS[highest] }}>{SCALE_LABELS[highest]}</strong>（{result[highest]}点）</p>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>{SCALE_DESCRIPTIONS[highest]}</p>
        </div>
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, borderLeft: `4px solid ${SCALE_COLORS[lowest]}` }}>
          <p style={{ fontSize: 13, color: '#7f8c8d', marginBottom: 4 }}>最も低い尺度: <strong style={{ color: SCALE_COLORS[lowest] }}>{SCALE_LABELS[lowest]}</strong>（{result[lowest]}点）</p>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>{SCALE_DESCRIPTIONS[lowest]}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/">
          <button style={{ background: '#3498db', color: '#fff' }}>新しい診断を始める</button>
        </Link>
        <Link to="/admin">
          <button style={{ background: '#2c3e50', color: '#fff' }}>管理画面へ</button>
        </Link>
      </div>
    </div>
  )
}
