import { useMemo, useState } from "react";

const goals = [
  "组织规模化 PK 促营收",
  "为主播精准撮合 PK",
  "提高主播跃迁率",
  "提高主播 PK 频次",
  "召回失活主播",
  "其他",
];

const recentTasks = [
  "为主播精准撮合 PK",
  "今日有哪些直播热点？",
  "流量资源应该优先给哪些主播？",
  "帮我为主播 7789829374927 创建 PK",
];

const followUpQuestions = {
  "组织规模化 PK 促营收": "你希望在什么时间段，为哪一类主播组织 PK？预期达成的营收目标是多少？",
  "为主播精准撮合 PK": "你希望在什么时间段，为谁精准撮合 PK 呢？",
  "提高主播跃迁率": "你想提升哪一类主播的跃迁率？目标层级和周期分别是什么？",
  "提高主播 PK 频次": "你希望先提升哪个主播群体的 PK 频次？对频次提升的目标是多少？",
  "召回失活主播": "你想召回哪些失活主播？更关注复播率、流水还是活跃天数恢复？",
  其他: "告诉我你的运营目标，我会继续追问关键约束，帮你把任务拆清楚。",
};

const sampleResponses = {
  "组织规模化 PK 促营收": "面向本周晚高峰活跃的腰尾部主播，每晚安排 20:00 - 23:00 的规模化 PK，优先覆盖有营收潜力但近 7 天增长停滞的主播，目标将场均营收提升 15%。",
  "为主播精准撮合 PK": "优先给近 7 天开播稳定、粉丝体量接近、营收能力互补的主播做精准 PK，时间集中在晚间黄金档，目标提升场均停留和礼物转化。",
  "提高主播跃迁率": "先聚焦近 14 天活跃稳定但还没跃迁的潜力主播，目标在两周内把 20 位主播从新锐层提升到成长层。",
  "提高主播 PK 频次": "针对当前开播稳定但 PK 渗透率偏低的主播，先把周均 PK 场次从 1.8 提升到 3.5，时间范围看最近 30 天。",
  "召回失活主播": "优先召回近 14 天断播但历史营收还不错的主播，希望在一周内把复播率拉回到 30% 以上。",
  其他: "我想围绕主播增长和营收效率做专项运营，请你帮我设计下一步动作。",
};

const dashboardData = {
  summary: {
    title: "智能撮合分析结论",
    text: "当前目标适合从“潜力主播筛选、对手匹配、黄金档排期、话术准备”四个环节一起推进。系统已经按营收潜力和 PK 适配度给出优先级。",
  },
  matchCards: [
    {
      title: "高优先级匹配池",
      stat: "18 位主播",
      accent: "适合今晚 20:00 - 23:00",
      items: [
        "营收能力相近，PK 对抗更均衡",
        "近 7 天开播时段重合度高",
        "粉丝画像互补，适合刺激转化",
      ],
    },
    {
      title: "待唤醒潜力池",
      stat: "12 位主播",
      accent: "建议先补召回动作",
      items: [
        "历史 PK 表现不错，但近期活跃下降",
        "需要先用召回话术恢复开播稳定性",
        "适合在活动场景下批量拉回",
      ],
    },
  ],
  actionCards: [
    {
      title: "优先执行动作",
      button: "生成安排",
      rows: [
        { name: "营收冲刺组", detail: "今晚优先组织 6 组实力接近主播进入限时 PK。" },
        { name: "新锐跃迁组", detail: "安排成长型主播与强带教主播进行陪跑式 PK。" },
        { name: "召回补位组", detail: "先发送复播提醒，再在次日补进排期池。" },
      ],
    },
    {
      title: "AI 建议",
      button: "查看方案",
      rows: [
        { name: "匹配策略", detail: "按营收段、在线峰值、最近 PK 胜率三维计算匹配分。" },
        { name: "排期策略", detail: "把高意愿主播向晚高峰集中，错开同类目强竞争场次。" },
        { name: "转化策略", detail: "为每组主播生成开场预热和礼物刺激话术。" },
      ],
    },
  ],
};

function Icon({ children }) {
  return <span className="icon">{children}</span>;
}

function Sidebar({ selectedGoal }) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-left">
          <button className="icon-button" aria-label="返回">
            <Icon>‹</Icon>
          </button>
          <strong>Rena</strong>
        </div>
        <button className="mini-button" aria-label="折叠">
          <Icon>⇥</Icon>
        </button>
      </div>

      <button className="primary-button">
        <Icon>+</Icon>
        新建任务
      </button>

      <nav className="sidebar-nav">
        <button className="nav-item">
          <Icon>▱</Icon>
          运营工作台
        </button>
        <button className="nav-item">
          <Icon>⌘</Icon>
          历史任务
        </button>
      </nav>

      <div className="divider" />

      <section className="recent-panel">
        <span className="recent-title">最近</span>
        {recentTasks.map((task) => (
          <button
            key={task}
            className={`recent-item ${task === selectedGoal ? "active" : ""}`}
            type="button"
          >
            {task}
          </button>
        ))}
      </section>
    </aside>
  );
}

function GoalPicker({ selectedGoal, onPick }) {
  return (
    <section className="goal-picker">
      <p className="section-title">你的目标是什么?</p>
      <div className="goal-row">
        {goals.map((goal) => (
          <button
            key={goal}
            type="button"
            className={`goal-chip ${goal === selectedGoal ? "active" : ""}`}
            onClick={() => onPick(goal)}
          >
            {goal}
          </button>
        ))}
      </div>
    </section>
  );
}

function Composer({
  selectedGoal,
  draft,
  onDraftChange,
  onSubmit,
}) {
  const helperText = selectedGoal
    ? followUpQuestions[selectedGoal]
    : "请先选择一个目标，我会继续追问关键信息。";

  return (
    <section className="composer-shell">
      <div className="composer-hint">{helperText}</div>
      <div className={`composer-card ${selectedGoal ? "active" : ""}`}>
        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="请帮助我完善信息，我将更精准地为你完成任务"
        />
        <div className="composer-toolbar">
          <div className="tool-cluster">
            <button className="tool-button" type="button" aria-label="at">
              @
            </button>
            <button className="tool-button" type="button" aria-label="附件">
              ⎘
            </button>
          </div>
          <button
            className="send-button"
            type="button"
            onClick={onSubmit}
            disabled={!selectedGoal}
            aria-label="发送"
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}

function ResultBoard({ selectedGoal, userInput }) {
  return (
    <section className="result-board">
      <div className="summary-card">
        <div>
          <span className="eyebrow">已生成任务方案</span>
          <h2>{dashboardData.summary.title}</h2>
        </div>
        <p>{dashboardData.summary.text}</p>
        <div className="summary-meta">
          <span className="meta-pill">{selectedGoal}</span>
          <span className="meta-note">{userInput}</span>
        </div>
      </div>

      <div className="match-grid">
        {dashboardData.matchCards.map((card) => (
          <article className="match-card" key={card.title}>
            <div className="match-top">
              <div>
                <h3>{card.title}</h3>
                <strong>{card.stat}</strong>
              </div>
              <span className="accent-pill">{card.accent}</span>
            </div>
            <div className="bullet-list">
              {card.items.map((item) => (
                <div className="bullet-row" key={item}>
                  <span className="bullet-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="action-grid">
        {dashboardData.actionCards.map((card) => (
          <article className="action-card" key={card.title}>
            <header className="action-head">
              <h3>{card.title}</h3>
              <button type="button">{card.button}</button>
            </header>
            <div className="action-list">
              {card.rows.map((row) => (
                <div className="action-row" key={row.name}>
                  <span className="avatar">{row.name.slice(0, 2)}</span>
                  <div>
                    <strong>{row.name}</strong>
                    <p>{row.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentDraft = useMemo(() => {
    if (draft) {
      return draft;
    }

    if (selectedGoal) {
      return sampleResponses[selectedGoal];
    }

    return "";
  }, [draft, selectedGoal]);

  const handleGoalPick = (goal) => {
    setSelectedGoal(goal);
    setSubmitted(false);
    setDraft(sampleResponses[goal]);
  };

  const handleSubmit = () => {
    if (!selectedGoal) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="app-shell">
      <Sidebar selectedGoal={selectedGoal} />

      <main className="main-panel">
        <div className="main-column">
          <GoalPicker selectedGoal={selectedGoal} onPick={handleGoalPick} />

          {selectedGoal && (
            <div className="chat-bubble-row">
              <div className="chat-bubble">{selectedGoal}</div>
            </div>
          )}

          {submitted && selectedGoal ? (
            <ResultBoard selectedGoal={selectedGoal} userInput={currentDraft} />
          ) : (
            <div className="hero-space" />
          )}

          <Composer
            selectedGoal={selectedGoal}
            draft={currentDraft}
            onDraftChange={setDraft}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}
