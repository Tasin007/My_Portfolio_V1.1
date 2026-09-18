/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
export const languages = [
  ["en", "English"],
  ["ja", "日本語"],
  ["bn", "বাংলা"],
  ["hi", "हिन्दी"],
  ["zh", "简体中文"],
  ["ko", "한국어"],
  ["ar", "العربية"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["pt", "Português"],
  ["ru", "Русский"],
];
export const offlineLanguages = new Set(["en", "ja"]);
const japanese = {
  Overview: "概要",
  Experience: "職務経験",
  Systems: "システム",
  Research: "研究",
  Projects: "プロジェクト",
  Recruiter: "採用担当者",
  Engineer: "エンジニア",
  Researcher: "研究者",
  "Let’s talk": "お問い合わせ",
  "DEVOPS ENGINEER · RESEARCH STUDENT": "DEVOPSエンジニア・研究生",
  "Reliable systems.": "信頼できるシステム。",
  "Intelligent possibilities.": "インテリジェントな可能性。",
  "Explore experience": "職務経験を見る",
  Résumé: "英文履歴書",
  "Take the tour": "ツアーを見る",
  "Higashi-Hiroshima, Japan": "東広島市、日本",
  "Open to conversations": "転職・協業のご相談を歓迎します",
  "THE PERSON BEHIND THE SYSTEMS": "システムを支える人",
  "Engineer. Researcher. Builder.": "エンジニア・研究者・ビルダー",
  "CLOUD INFRASTRUCTURE": "クラウドインフラ",
  "INTELLIGENT AUTOMATION": "インテリジェント・オートメーション",
  "BANGLADESH → JAPAN": "バングラデシュ → 日本",
  "Production platforms": "本番プラットフォーム",
  "Six contexts. Real responsibilities.": "6つの環境で担った実務責任。",
  "Delivery pipeline": "デリバリーパイプライン",
  "Run a release. Test a failure.": "リリースを実行し、障害を検証。",
  Observability: "オブザーバビリティ",
  "Connect metrics with the evidence.": "メトリクスと証拠を結び付ける。",
  "Research studio": "研究スタジオ",
  "Explore navigation and generation.": "ナビゲーションと生成を体験。",
  Explore: "詳しく見る",
  "PROFESSIONAL SNAPSHOT": "職務概要",
  "From production infrastructure": "本番インフラから",
  "to intelligent automation.": "インテリジェント・オートメーションへ。",
  "Production DevOps experience": "本番DevOps経験",
  "Production environments supported": "担当した本番環境",
  "Current professional base": "現在の活動拠点",
  "English test score · not a technical rating":
    "英語試験スコア（技術評価ではありません）",
  "DevOps Engineer": "DevOpsエンジニア",
  "Production infrastructure & operations": "本番インフラ・運用",
  "Delivery & automation": "デリバリー・自動化",
  "Cloud & Linux": "クラウド・Linux",
  "Observability & incidents": "監視・インシデント対応",
  "Data & API infrastructure": "データ・APIインフラ",
  "PRODUCTION IMPACT": "本番環境での実績",
  "Behind the platforms.": "プラットフォームの舞台裏。",
  "Inside the work.": "実務の中身。",
  "Read responsibility case study": "担当事例を見る",
  "ARCHITECTURE LAB": "アーキテクチャ・ラボ",
  "See the connections.": "つながりを見る。",
  "Understand the system.": "システムを理解する。",
  "Use flat / reduced-effects view": "フラット表示に切り替える",
  "Enable spatial view": "立体表示に切り替える",
  Reset: "リセット",
  "LIVE ENGINEERING LABS": "エンジニアリング・ラボ",
  "Don’t just read the skills.": "スキルを読むだけでなく、",
  "Operate the system.": "システムを操作して体験。",
  "RESEARCH LAB · HIROSHIMA UNIVERSITY": "研究ラボ・広島大学",
  "Teaching agents to navigate.": "エージェントにナビゲーションを学習させる。",
  "Exploring how they create.": "生成の仕組みを探究する。",
  "Explore the research": "研究を見る",
  "CAPABILITIES WITH CONTEXT": "実務に結び付くスキル",
  "Not just a stack.": "技術一覧だけではなく、",
  "A connected skill set.": "経験につながるスキルセット。",
  "Search technologies": "技術を検索",
  All: "すべて",
  "Technology evidence": "技術の根拠",
  "Open related evidence": "関連する根拠を見る",
  "PROFESSIONAL CREDENTIALS": "専門資格",
  "Credentials that back the skills.": "スキルを裏付ける資格。",
  "Learning verified by trusted foundations.":
    "信頼できる組織によって認定された学習。",
  "Linux Foundation and OpenSSF coursework covering secure software development, Kubernetes, DevOps and Site Reliability Engineering. Completion dates and credential IDs are intentionally kept private.":
    "Linux FoundationおよびOpenSSFによる、セキュアソフトウェア開発、Kubernetes、DevOps、Site Reliability Engineeringの学習資格です。修了日と認定IDはプライバシー保護のため公開していません。",
  "Secure software development, CI/CD security fundamentals and OpenSSF best practices.":
    "セキュアソフトウェア開発、CI/CDセキュリティの基礎、OpenSSFベストプラクティス。",
  "Kubernetes fundamentals, workloads, services and container orchestration concepts.":
    "Kubernetesの基礎、ワークロード、サービス、コンテナオーケストレーションの概念。",
  "DevOps foundations, reliability principles and Site Reliability Engineering concepts.":
    "DevOpsの基礎、信頼性の原則、Site Reliability Engineeringの概念。",
  Credentials: "資格",
  "THE JOURNEY": "これまでの歩み",
  "Built across borders.": "国境を越えて築いた経験。",
  "Still moving forward.": "次の挑戦へ。",
  "Next chapter": "次へ",
  "RECRUITER CENTER": "採用担当者向け情報",
  "The essentials.": "必要な情報を、",
  "Ready for your next conversation.": "次の対話へ。",
  "Open résumé": "英文履歴書を開く",
  "Open documents": "応募書類を開く",
  "Concise English profile": "英語の簡潔なプロフィール",
  "Detailed CV": "詳細英文CV",
  "Extended English experience": "英語の詳細な職務経験",
  "Japanese application résumé": "日本語の応募用履歴書",
  "Japanese professional history": "日本語の職務経歴書",
  "Choose the document that best matches your hiring process. Each PDF opens in a new tab.":
    "採用プロセスに合う書類をお選びください。各PDFは新しいタブで開きます。",
  "Contact card": "連絡先カード",
  "Print profile": "プロフィールを印刷",
  "Profile JSON": "プロフィールJSON",
  English: "英語",
  Japanese: "日本語",
  Education: "学歴",
  "NEXT CHAPTER · LET’S CONNECT": "次のステージ・お問い合わせ",
  "Reliable systems start": "信頼できるシステムは、",
  "with a conversation.": "対話から始まります。",
  "Email Tasin": "メールを送る",
  "Copy email": "メールアドレスをコピー",
  "Email copied": "コピーしました",
  "Compose an introduction": "お問い合わせ文を作成",
  "Open email draft": "メール下書きを開く",
  "Back to top ↑": "トップへ戻る ↑",
  "Spatial effects on": "立体効果オン",
  "Spatial effects off": "立体効果オフ",
  "Language preference": "言語設定",
  "Understand it your way.": "使いやすい言語でご覧ください。",
  "Available offline": "オフライン対応",
  "Curated Japanese": "日本語対応",
  "Machine translation": "機械翻訳",
  "Needs provider": "外部サービスが必要",
  Dismiss: "閉じる",
  "Guided tour": "ガイドツアー",
  Back: "戻る",
  Continue: "次へ",
  Finish: "完了",
  "Close dialog": "ダイアログを閉じる",
  "Choose language": "言語を選択",
  "Enable light mode": "ライトモードに切り替える",
  "Enable dark mode": "ダークモードに切り替える",
};
const builtIn = { ja: japanese };
const Context = createContext({
  language: "en",
  dictionary: {},
  request: () => {},
});
export function Localization({ children, language, enabled, onStatus }) {
  const [dictionary, setDictionary] = useState(builtIn[language] || {});
  const queue = useRef(new Set());
  const running = useRef(false);
  const cache = useRef({ ...builtIn });
  const generation = useRef(0);
  useEffect(() => {
    generation.current++;
    queue.current.clear();
    setDictionary(cache.current[language] || builtIn[language] || {});
  }, [language]);
  useEffect(() => {
    if (language === "en" || !enabled) return;
    const timer = setInterval(async () => {
      if (running.current || !queue.current.size) return;
      const current = generation.current;
      const texts = [...queue.current].slice(0, 30);
      texts.forEach((t) => queue.current.delete(t));
      running.current = true;
      onStatus("Translating page content…");
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: languages.find((x) => x[0] === language)?.[1] || language,
            texts,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw Error(data.error);
        if (current !== generation.current) return;
        const newValues = Object.fromEntries(
          texts.map((t, i) => [t, data.texts[i]]),
        );
        cache.current[language] = { ...cache.current[language], ...newValues };
        setDictionary(cache.current[language]);
        onStatus(
          "Machine translation · English originals remain the source of truth.",
        );
      } catch {
        if (current === generation.current)
          onStatus(
            "Translation unavailable for some content. English originals are shown. Retry by selecting the language again.",
          );
      } finally {
        running.current = false;
      }
    }, 900);
    return () => clearInterval(timer);
  }, [language, enabled, onStatus]);
  const request = (text) => {
    if (
      language !== "en" &&
      enabled &&
      !(text in (cache.current[language] || {}))
    )
      queue.current.add(text);
  };
  const activeDictionary = { ...(builtIn[language] || {}), ...dictionary };
  return (
    <Context.Provider
      value={{ language, dictionary: activeDictionary, request }}
    >
      {children}
    </Context.Provider>
  );
}
export function L({ value }) {
  const { dictionary, request, language } = useContext(Context);
  const text = typeof value === "string" ? value : null;
  const key = text?.trim() || "";
  useEffect(() => {
    if (key) request(key);
  }, [key, language, dictionary, request]); // Requests are deduplicated by the provider.
  if (Array.isArray(value))
    return value.map((item, i) => <L key={i} value={item} />);
  if (text !== null) {
    const translated = dictionary[key];
    if (!translated) return text;
    const leading = text.match(/^\s+/)?.[0] || "";
    const trailing = text.match(/\s+$/)?.[0] || "";
    return leading + translated + trailing;
  }
  return value ?? null;
}
