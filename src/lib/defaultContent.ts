import type { LPData } from "./types";

export const defaultContent: LPData = {
  s1: {
    menuItems: ["特徴", "業種", "事例", "お申込みの流れ"],
    ctaText: "無料でアカウント開設",
  },
  s2: {
    mainCopy: "サービス名なら、今日の働き手がすぐ見つかる",
    subCopy: "1,370万人の働き手の中から、希望の人材マッチング",
    ctaText: "無料でアカウント開設",
    secondaryCtaText: "資料をダウンロード",
    trustBadges: ["応募課金0円", "最短即日マッチング", "基本掲載無料"],
  },
  s3: {
    heading: "サービス名は「働きたい時間」と「働いて欲しい時間」をマッチングするスキマバイト募集サービスです",
    body: "企業は求めて欲しい時間やあるスキルを登録するだけで条件に合ったワーカーを呼ぶことができます。",
  },
  s4: {
    sectionHeading: "こんなお悩みありませんか？",
    cards: [
      {
        iconHint: "急いでいるビジネスパーソンのイラスト",
        heading: "急な発注や欠員でスタッフが確保できない",
        description: "突然のシフト変更や繁忙期に対応できず、サービス品質が低下してしまう。",
      },
      {
        iconHint: "困っている表情の採用担当者のイラスト",
        heading: "現場が郊外なのでなかなか人が集まらない",
        description: "都心から離れた勤務地では応募が少なく、常に人手不足の状態が続いている。",
      },
      {
        iconHint: "カレンダーとシフト表のイラスト",
        heading: "人員が安定せず繁忙期の稼働が安定しない",
        description: "季節変動が大きく、ピーク時に必要な人数を確保できない。",
      },
    ],
  },
  s5: {
    sectionHeading: "サービス名が選ばれる理由",
    cards: [
      {
        pointLabel: "POINT1",
        title: "最短即日でマッチング",
        description: "お仕事の内容とスキルを登録するだけでマッチング開始。急な欠員にも対応できます。",
        imageHint: "スマートフォンでマッチング画面を見ているイラスト",
      },
      {
        pointLabel: "POINT2",
        title: "希望の人材を呼べる",
        description: "条件に合ったワーカーのみマッチングします。過去の実績評価も参考にできます。",
        imageHint: "人材リストから選んでいるイラスト",
      },
      {
        pointLabel: "POINT3",
        title: "実績あるワーカーと出会える",
        description: "豊富な実績のワーカーが多数登録。評価の高い人材を優先的にマッチング。",
        imageHint: "握手するビジネスパーソンのイラスト",
      },
    ],
  },
  s6: {
    sectionHeading: "募集できる仕事",
    cards: [
      { name: "飲食", subText: "洗い場 / ホール / 調理 / 軽作業 など", imageHint: "飲食店の写真" },
      { name: "小売", subText: "レジ / 陳列 / 接客 / 棚卸 など", imageHint: "小売店の写真" },
      { name: "オフィスワーク", subText: "電話対応 / データ入力 / 事務作業 など", imageHint: "オフィスの写真" },
      { name: "配送", subText: "フードデリバリー / 荷物配送 など", imageHint: "配送の写真" },
      { name: "物流", subText: "ピッキング / 梱包 / 仕分け / 配送 など", imageHint: "倉庫の写真" },
      { name: "その他", subText: "引越し / 清掃 / 美容 / 介護施設 など", imageHint: "多様な職種の写真" },
    ],
    cta1: "無料でアカウント開設",
    cta2: "資料をダウンロード",
  },
  s7: {
    sectionHeading: "導入事例",
    cards: [
      {
        companyName: "サンプル物流株式会社",
        imageHint: "物流倉庫で働くスタッフの写真",
        summary: "繁忙期に必要な20名の確保が困難でしたが、導入後は平均3日で充足。コスト削減にも成功。",
      },
      {
        companyName: "サンプル食品株式会社",
        imageHint: "食品工場のラインで働くスタッフの写真",
        summary: "急な欠員への対応が課題でしたが、当日マッチングで生産ラインの稼働率が安定。",
      },
      {
        companyName: "サンプルリテール株式会社",
        imageHint: "小売店で接客するスタッフの写真",
        summary: "年末商戦の人員確保に活用。スポットスタッフの活用で売上前年比120%を達成。",
      },
    ],
    linkText: "他の導入事例を見る",
    cta1: "無料でアカウント開設",
    cta2: "資料をダウンロード",
  },
  s8: {
    sectionHeading: "お申込みの流れ",
    steps: [
      {
        stepLabel: "Step 1",
        iconHint: "フォーム入力のアイコン",
        title: "利用申込み",
        description: "利用規約にご同意の上、フォームにメールアドレスのご入力をお願いします。",
      },
      {
        stepLabel: "Step 2",
        iconHint: "アカウント設定のアイコン",
        title: "アカウントの作成",
        description: "ご登録手続きの案内に沿って情報の入力をお願いします。作成は無料です。",
      },
      {
        stepLabel: "Step 3",
        iconHint: "求人公開のアイコン",
        title: "求人の公開",
        description: "管理画面へログインし、求人情報へご記入をお願いします。",
      },
      {
        stepLabel: "Step 4",
        iconHint: "マッチング成立のアイコン",
        title: "マッチング",
        description: "求人に記載の勤務時間にワーカーの受け入れをお願いします。",
      },
    ],
  },
  s9: {
    faqs: [
      {
        question: "マッチング後のキャンセルについて知りたい",
        answer: "ワーカーのキャンセルは勤務開始前であれば可能です。キャンセル率が高いワーカーには制限がかかる仕組みです。",
      },
      {
        question: "ワーカーがキャンセルしたら、欠勤したらどうするの？",
        answer: "代替ワーカーの自動マッチング機能があります。また、キャンセル・欠勤したワーカーにはペナルティが適用されます。",
      },
      {
        question: "どんな人が来るか事前に分かる？",
        answer: "マッチング成立後、ワーカーのプロフィール（経験・評価・自己紹介）をアプリ上で確認できます。",
      },
      {
        question: "利用できない職種はある？",
        answer: "法令に抵触する業務、危険を伴う業務など一部制限がございます。詳細はご相談ください。",
      },
      {
        question: "求人公開後の流れを知りたい",
        answer: "求人公開後、条件に合ったワーカーへ自動通知されます。ワーカーが応募するとマッチングが成立します。",
      },
    ],
    formHeading: "まずは資料請求",
    formConfig: {
      fields: [
        { id: "name",    label: "お名前",         type: "text",  placeholder: "山田 太郎",                required: true  },
        { id: "company", label: "会社名",          type: "text",  placeholder: "株式会社サンプル",         required: true  },
        { id: "email",   label: "メールアドレス",  type: "email", placeholder: "example@company.co.jp",   required: true  },
        { id: "tel",     label: "電話番号",        type: "tel",   placeholder: "03-1234-5678",             required: false },
        {
          id: "size", label: "従業員数", type: "select", placeholder: "",  required: true,
          options: ["選択してください", "1〜10名", "11〜50名", "51〜300名", "301名以上"],
        },
      ],
      submitLabel: "資料を請求する",
      actionUrl: "",
      adminEmail: "",
      ccEmail: "",
      privacyLabel: "プライバシーポリシーに同意する",
      successMessage: "お問い合わせありがとうございます。担当者よりご連絡いたします。",
    },
  },
  s10: {
    microCopy: "まずは資料請求してみませんか？",
    cta1: "無料でアカウント開設",
    cta2: "資料をダウンロード",
  },
  s11: {
    links: ["アプリについて", "サポート", "プライバシーポリシー", "利用規約", "電子公告"],
    copyright: "© 2025 サービス名, Inc.",
  },
  images: {},
};
