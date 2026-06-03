import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions, SCALE_LABELS, type ScaleKey } from '../data/questions'

const ANSWER_LABELS = ['あまりない', 'ときにそうである', '大体そうである', 'まったくその通り']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TestPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'profile' | 'test'>('profile')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [current, setCurrent] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const shuffled = useMemo(() => shuffle(questions), [])
  const total = shuffled.length
  const q = shuffled[current]
  const progress = Math.round(((current + (answers[q?.id] !== undefined ? 1 : 0)) / total) * 100)

  function selectAnswer(val: number) {
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  function goNext() {
    if (current < total - 1) setCurrent(c => c + 1)
  }

  function goPrev() {
    if (current > 0) setCurrent(c => c - 1)
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < total) {
      setError('全ての質問に回答してください')
      return
    }
    setSubmitting(true)
    setError('')
    const scores: Record<ScaleKey, number> = { cp: 0, np: 0, a: 0, fc: 0, ac: 0, rc: 0 }
    for (const item of questions) {
      scores[item.scale] += answers[item.id] ?? 0
    }
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, ...scores }),
      })
      const data = await res.json()
      navigate(`/result/${data.id}`)
    } catch {
      setError('送信に失敗しました。バックエンドサーバーが起動しているか確認してください。')
      setSubmitting(false)
    }
  }

  if (step === 'profile') {
    return (
      <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>エゴグラム診断</h1>
          <p style={{ color: '#7f8c8d', marginBottom: 32, lineHeight: 1.7 }}>
            全60問の質問に対し、自分にどの程度当てはまるかを選んでください。
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>氏名 <span style={{ color: '#e74c3c' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="山田 太郎" />
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>メールアドレス</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
          </div>
          <button
            onClick={() => name.trim() && setStep('test')}
            disabled={!name.trim()}
            style={{ width: '100%', background: '#3498db', color: '#fff', padding: '14px', fontSize: 16, fontWeight: 700 }}
          >
            診断を始める →
          </button>
        </div>
      </div>
    )
  }

  const answered = Object.keys(answers).length
  const isLast = current === total - 1
  const currentAnswered = answers[q.id] !== undefined

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px 60px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#7f8c8d' }}>
          <span style={{ fontWeight: 600, color: '#2c3e50' }}>{name} さんの診断</span>
          <span>{answered} / {total} 回答済み</span>
        </div>
        <div style={{ background: '#ecf0f1', borderRadius: 4, height: 8 }}>
          <div style={{ background: '#3498db', height: 8, borderRadius: 4, width: `${Math.round(answered / total * 100)}%`, transition: 'width .3s' }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '40px 32px', boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#95a5a6', marginBottom: 20 }}>質問 {current + 1} / {total}</div>
        <p style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 36, fontWeight: 500 }}>{q.text}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ANSWER_LABELS.map((lbl, i) => {
            const val = i
            const selected = answers[q.id] === val
            return (
              <button
                key={val}
                onClick={() => selectAnswer(val)}
                style={{
                  background: selected ? '#3498db' : '#f8f9fa',
                  color: selected ? '#fff' : '#2c3e50',
                  border: selected ? '2px solid #3498db' : '2px solid #ecf0f1',
                  borderRadius: 8,
                  padding: '14px 20px',
                  textAlign: 'left',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all .15s',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: selected ? 'rgba(255,255,255,.3)' : '#ecf0f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{val}</span>
                {lbl}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button
          onClick={goPrev}
          disabled={current === 0}
          style={{ background: '#ecf0f1', color: '#2c3e50', padding: '12px 24px' }}
        >
          ← 前の質問
        </button>

        {isLast ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {error && <p style={{ color: '#e74c3c', fontSize: 13, margin: 0 }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting || answered < total}
              style={{ background: '#2ecc71', color: '#fff', padding: '12px 32px', fontWeight: 700 }}
            >
              {submitting ? '送信中...' : `診断結果を見る（${answered}/${total}回答）`}
            </button>
          </div>
        ) : (
          <button
            onClick={goNext}
            disabled={!currentAnswered}
            style={{ background: '#3498db', color: '#fff', padding: '12px 24px', fontWeight: 600 }}
          >
            次の質問 →
          </button>
        )}
      </div>
    </div>
  )
}
