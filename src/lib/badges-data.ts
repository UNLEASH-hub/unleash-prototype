export type BadgeCategory = {
  label: string
  tags: string[]
  premium: boolean
}

export const BADGE_CATEGORIES: BadgeCategory[] = [
  { label: 'セクシャル',  premium: false, tags: ['ゲイ', 'バイ', 'ノンケ寄り', 'トランス'] },
  { label: 'ポジション',  premium: false, tags: ['タチ', 'ウケ', 'リバ', 'バニラ派', 'ポジション不明'] },
  { label: '目的',        premium: false, tags: ['ご飯行きたい', '添い寝希望', 'お酒飲みたい', 'クラブ好き', 'Bar好き', '温泉好き', 'サウナ好き', 'メッセージしたい', '電話したい', 'ヤリモク'] },
  { label: '募集内容',    premium: true,  tags: ['友だち募集', '恋人募集', 'その他募集'] },
  { label: '好み',        premium: true,  tags: ['パパ募集', 'サポ希望', '年上好き', '年下好き', '同年代好き', '野郎好き', 'GMPD専', '女装好き', 'SM好き', '老け専', '前髪系好き', 'ジャニ系好き', '細専', 'D専'] },
  { label: 'プレイ',      premium: true,  tags: ['マッサージ希望', 'マッサージ得意', 'SM', '秘密主義', '目隠し', '野外', '生派', '複数', '練習中', 'Prep服用', '開発得意', '開発希望', 'ゴム必須', 'ハメ撮り好き', '首絞め'] },
  { label: 'アクセス',    premium: true,  tags: ['足アリ', '場所あり', '足なし', '場所なし'] },
  { label: 'ステータス',  premium: true,  tags: ['元体育会系', '学生', '会社員', '恋人あり', '既婚者', '土日休み', '平日休み', '性病検査済', '顔写真希望'] },
  { label: 'サイズ',      premium: true,  tags: ['P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20以上', '(太)', '絶倫', '上反り', '下反り'] },
]
