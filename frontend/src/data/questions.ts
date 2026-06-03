export type ScaleKey = 'cp' | 'np' | 'a' | 'fc' | 'ac' | 'rc';

export interface Question {
  id: number;
  scale: ScaleKey;
  text: string;
}

export const SCALE_LABELS: Record<ScaleKey, string> = {
  cp: 'CP',
  np: 'NP',
  a:  'A',
  fc: 'FC',
  ac: 'AC',
  rc: 'RC',
};

export const SCALE_COLORS: Record<ScaleKey, string> = {
  cp: '#e74c3c',
  np: '#e67e22',
  a:  '#3498db',
  fc: '#2ecc71',
  ac: '#9b59b6',
  rc: '#1abc9c',
};

export const SCALE_DESCRIPTIONS: Record<ScaleKey, string> = {
  cp: '規律・責任感・批判的思考を重視する。高いと厳格で原則を守り、チームを律することができる。',
  np: '思いやり・世話好き・支援的。高いと周囲のフォローが得意で、チームの調和を保てる。',
  a:  '論理的・客観的・情報収集を重視。高いと冷静な判断力があり、データに基づいて行動できる。',
  fc: '自由・創造性・自発性。高いと発想力が豊かで活気があり、新しいことに積極的に挑戦できる。',
  ac: '協調性・従順さ・遠慮がち。高いと指示に従いやすいが、自己主張が弱くなる傾向がある。',
  rc: '反抗・自己主張・独立心。高いと既存ルールへの疑問や変革への意欲が強い。',
};

export const questions: Question[] = [
  // CP
  { id: 1,  scale: 'cp', text: '物事は正しく行うべきだと強く思う' },
  { id: 2,  scale: 'cp', text: '約束や締め切りは絶対に守るべきだと思う' },
  { id: 3,  scale: 'cp', text: '責任感がない人を見ると厳しく指摘したくなる' },
  { id: 4,  scale: 'cp', text: '規則やルールは守られて当然だと思う' },
  { id: 5,  scale: 'cp', text: '他人の仕事のミスや手抜きが気になる' },
  { id: 6,  scale: 'cp', text: '「もっとしっかりやれ」と他人に言いたくなることがある' },
  { id: 7,  scale: 'cp', text: '高い基準を求め、妥協することが苦手だ' },
  { id: 8,  scale: 'cp', text: '正義感が強く、不公平なことは見過ごせない' },
  { id: 9,  scale: 'cp', text: '他人に対して批判的になることがある' },
  { id: 10, scale: 'cp', text: '自分にも他人にも厳しい基準を求める' },

  // NP
  { id: 11, scale: 'np', text: '困っている人がいると放っておけない' },
  { id: 12, scale: 'np', text: '相手の気持ちに寄り添うことが得意だ' },
  { id: 13, scale: 'np', text: '人の相談に乗ることが好きだ' },
  { id: 14, scale: 'np', text: '周囲の人が元気かどうか気にかける' },
  { id: 15, scale: 'np', text: '人を褒めることを自然にできる' },
  { id: 16, scale: 'np', text: '後輩や部下の成長を助けることにやりがいを感じる' },
  { id: 17, scale: 'np', text: 'チームの雰囲気を和やかに保つよう心がける' },
  { id: 18, scale: 'np', text: '人の痛みや苦労を理解しようとする' },
  { id: 19, scale: 'np', text: '相手が話しやすいように配慮する' },
  { id: 20, scale: 'np', text: '人の良いところを見つけて伝えることが好きだ' },

  // A
  { id: 21, scale: 'a', text: '感情より事実やデータをもとに判断する' },
  { id: 22, scale: 'a', text: '問題に直面したとき、まず原因を分析する' },
  { id: 23, scale: 'a', text: '計画を立てるときは論理的に順序を考える' },
  { id: 24, scale: 'a', text: '感情的にならず冷静に対処できる' },
  { id: 25, scale: 'a', text: '複数の選択肢を比較して最善策を選ぶ' },
  { id: 26, scale: 'a', text: '情報収集を大切にして物事を判断する' },
  { id: 27, scale: 'a', text: '客観的に物事を見ることができる' },
  { id: 28, scale: 'a', text: '思い込みより根拠を重視する' },
  { id: 29, scale: 'a', text: '長期的な視点でものごとを考えることが多い' },
  { id: 30, scale: 'a', text: '感情に流されず論理的に話し合いを進められる' },

  // FC
  { id: 31, scale: 'fc', text: '新しいことに挑戦するのがワクワクする' },
  { id: 32, scale: 'fc', text: '自分の感情や気持ちを素直に表現できる' },
  { id: 33, scale: 'fc', text: '好奇心旺盛で、興味があることはすぐ試してみたい' },
  { id: 34, scale: 'fc', text: '楽しいことには全力で取り組む' },
  { id: 35, scale: 'fc', text: '笑いや遊び心を大切にしている' },
  { id: 36, scale: 'fc', text: '仕事でも遊び心を忘れない' },
  { id: 37, scale: 'fc', text: '直感や閃きを大事にする' },
  { id: 38, scale: 'fc', text: '感情豊かで、喜怒哀楽がはっきりしている' },
  { id: 39, scale: 'fc', text: '自由な発想でアイデアを出すことが得意だ' },
  { id: 40, scale: 'fc', text: '子どものように夢中になれることがある' },

  // AC
  { id: 41, scale: 'ac', text: '周囲の期待に応えようとするあまり自分を抑えることがある' },
  { id: 42, scale: 'ac', text: '人から頼まれると断れないことが多い' },
  { id: 43, scale: 'ac', text: '上司や権威ある人の意見に反論しにくい' },
  { id: 44, scale: 'ac', text: '場の雰囲気を壊さないよう自分の意見を引っ込めることがある' },
  { id: 45, scale: 'ac', text: '他人に嫌われないよう行動を気にする' },
  { id: 46, scale: 'ac', text: '批判されると必要以上に落ち込む' },
  { id: 47, scale: 'ac', text: '自分の意見より他人の意見を優先することが多い' },
  { id: 48, scale: 'ac', text: '周囲に合わせて行動することが多い' },
  { id: 49, scale: 'ac', text: '指示された通りに動くことが安心できる' },
  { id: 50, scale: 'ac', text: '人目が気になって本音を言えないことがある' },

  // RC
  { id: 51, scale: 'rc', text: '理不尽なルールや指示には従いたくないと感じる' },
  { id: 52, scale: 'rc', text: '慣習や慣例より自分のやり方を試したい' },
  { id: 53, scale: 'rc', text: '権威的な人に対して反発心を感じることがある' },
  { id: 54, scale: 'rc', text: '納得できないことには「なぜ？」と問い返す' },
  { id: 55, scale: 'rc', text: '組織の当たり前に疑問を感じることが多い' },
  { id: 56, scale: 'rc', text: '変化や改革を望む気持ちが強い' },
  { id: 57, scale: 'rc', text: '自分の信念に反することは従いたくない' },
  { id: 58, scale: 'rc', text: '物事の現状維持に抵抗を感じる' },
  { id: 59, scale: 'rc', text: '従来のやり方より新しいアプローチを好む' },
  { id: 60, scale: 'rc', text: '上からの指示より自分の判断を優先したい気持ちがある' },
];
