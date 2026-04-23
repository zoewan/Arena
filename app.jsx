const { useEffect, useLayoutEffect, useMemo, useRef, useState } = React;

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

const smartmatchResultData = {
  intro: "没问题！我来帮您为这几个主播匹配后天的 PK 赛事",
  successText: "已经成功为 3 位主播撮合了 2026 年 4 月 18 日 21:00 – 22:00 (UTC+08:00) 的 PK 赛事",
  matches: [
    {
      host: "Nexie",
      hostAvatar: "https://www.figma.com/api/mcp/asset/2f92d4eb-2385-491d-905e-93d275d4001e",
      opponent: "Valeria sarmiento 👑💗",
      opponentAvatar: "https://www.figma.com/api/mcp/asset/73c0c741-a876-4e18-957d-97b21f241ebb",
      reason: "比赛数据指标相近，且曾经比赛过",
    },
    {
      host: "🍅En0ch🎸",
      hostAvatar: "https://www.figma.com/api/mcp/asset/8fcde340-5b92-44ef-9ba3-1ce3696a4027",
      opponent: "amal ahmad 🐆",
      opponentAvatar: "https://www.figma.com/api/mcp/asset/12637fd5-69e6-4324-9d4c-304def145bee",
      reason: "主播互相关注，且粉丝相似度高。满足金主备票数 200k 的条件",
    },
    {
      host: "Taey🍒",
      hostAvatar: "https://www.figma.com/api/mcp/asset/8fd8e485-12f8-49d6-889f-4f9dba0e636a",
      opponent: "Lily",
      opponentAvatar: "https://www.figma.com/api/mcp/asset/a7218a32-7711-477a-a3bf-b695740f1233",
      reason: "比赛数据指标相近，且粉丝相似度高",
    },
  ],
  posterThumb: "https://www.figma.com/api/mcp/asset/4b61bff7-bd03-4130-a9ca-8f42cad6b107",
  previews: [
    {
      label: "赛事1",
      title: "主播侧海报",
      image: "https://www.figma.com/api/mcp/asset/fe1d85f7-4ebe-4e5e-9d13-b89ad1555d7f",
    },
    {
      label: "赛事2",
      title: "主播侧海报",
      image: "https://www.figma.com/api/mcp/asset/fe1d85f7-4ebe-4e5e-9d13-b89ad1555d7f",
    },
    {
      label: "赛事3",
      title: "主播侧海报",
      image: "https://www.figma.com/api/mcp/asset/fe1d85f7-4ebe-4e5e-9d13-b89ad1555d7f",
    },
  ],
};

const workbenchChips = [
  { label: "智能撮合", icon: "⌁", action: "smartmatch" },
  { label: "智能触达", icon: "⌁", action: "reach" },
  { label: "流量诊断", icon: "⌁", action: "traffic" },
  { label: "生成教育物料", icon: "⌁", action: "material" },
  { label: "内容调优话术", icon: "⌁", action: "content" },
  { label: "金主分析", icon: "⌁", action: "spender" },
];

const sceneConfigs = {
  smartmatch: {
    title: "智能撮合",
    promptTitle: "你的目标是什么?",
    options: goals,
    samples: sampleResponses,
    questions: followUpQuestions,
    agentIntro: "没问题！我来帮您为这几个主播匹配后天的 PK 赛事",
    loadingSteps: [
      "调用精准撮合技能",
      "分析主播的开播习惯、开播时间段、金主情况、PK 胜率等关键信息",
      "寻找最佳匹配对手",
      "使用系统内置比赛工具来创建赛事",
    ],
  },
  reach: {
    title: "智能触达",
    promptTitle: "你想解决哪类触达问题?",
    options: ["召回失活主播", "提升粉丝回访率", "提高活动触达率", "开播前提醒", "分层私信运营", "其他"],
    samples: {
      "召回失活主播": "我想优先召回近 14 天断播、但过去营收表现稳定的主播，希望通过分层触达把 7 日复播率拉升到 30%。",
      "提升粉丝回访率": "针对近 7 天有互动但回访下降的粉丝，设计分层触达策略，目标提升直播间回访率和次日看播率。",
      "提高活动触达率": "针对本周 PK 活动，想提升目标主播和核心粉丝的活动曝光与到场率。",
      "开播前提醒": "请帮我为重点主播设计开播前 1 小时和开播前 10 分钟的触达提醒方案。",
      "分层私信运营": "想按主播分层和粉丝活跃度做精细化私信触达，提高转化。",
      其他: "请按直播运营目标帮我设计更有效的触达方案。",
    },
    questions: {
      "召回失活主播": "你要触达哪一类失活主播？更关注复播率、营收恢复还是活跃天数恢复？",
      "提升粉丝回访率": "你要触达的是哪类粉丝？目标是提升回访率、看播时长还是互动率？",
      "提高活动触达率": "这次活动的对象是谁？你想提升报名率、到场率还是活动转化率？",
      "开播前提醒": "你希望给哪些主播发送提醒？触达节奏和目标是什么？",
      "分层私信运营": "你想按什么维度分层？主播、公会、粉丝活跃度还是营收能力？",
      其他: "告诉我你的触达目标，我会继续追问关键条件。",
    },
    agentIntro: "收到，我先帮您整理触达对象、目标与节奏，再生成执行建议。",
    loadingSteps: [
      "调用智能触达技能",
      "分析主播分层、目标用户与最佳触达时间",
      "生成分层触达策略与提醒文案",
      "整理可直接执行的触达动作",
    ],
  },
  traffic: {
    title: "流量诊断",
    promptTitle: "你想诊断哪类流量问题?",
    options: ["直播间流量下滑", "曝光高转化低", "新主播冷启动", "短视频导流效果差", "粉丝在线率下降", "其他"],
    samples: {
      "直播间流量下滑": "请分析近 30 天直播间流量下滑的主要原因，并给出可执行优化动作。",
      "曝光高转化低": "我想排查高曝光但礼物转化偏低的主播，找出问题并给方案。",
      "新主播冷启动": "请帮我诊断新主播冷启动阶段的流量承接问题，尤其是前 3 场直播。",
      "短视频导流效果差": "想看短视频导流到直播间后的留存和转化问题。",
      "粉丝在线率下降": "请分析粉丝在线率下降的原因，并判断是内容、时段还是触达问题。",
      其他: "请帮我做一次直播流量问题诊断。",
    },
    questions: {
      "直播间流量下滑": "你想看哪一批主播、哪个时间范围的流量下滑？",
      "曝光高转化低": "你要排查哪类主播？更看重曝光、进房还是礼物转化？",
      "新主播冷启动": "你希望聚焦哪个公会或哪一批新主播？",
      "短视频导流效果差": "你想分析哪种内容类型或导流链路？",
      "粉丝在线率下降": "你要看单主播还是一批主播？需要对比哪个周期？",
      其他: "告诉我你要诊断的问题范围，我会继续细化。",
    },
    agentIntro: "收到，我先帮您定位流量问题，再拆解关键原因与优化方向。",
    loadingSteps: [
      "调用流量诊断技能",
      "分析曝光、进房、停留与转化链路",
      "定位流量异常的关键原因",
      "生成优先级最高的优化动作",
    ],
  },
  material: {
    title: "生成教育物料",
    promptTitle: "你想生成什么类型的教育物料?",
    options: ["主播培训提纲", "活动宣导海报文案", "直播 SOP", "公会陪跑手册", "新人主播话术卡", "其他"],
    samples: {
      "主播培训提纲": "请帮我生成一套面向成长型主播的 PK 提升培训提纲。",
      "活动宣导海报文案": "请为本周晚高峰 PK 活动生成宣导海报文案和核心卖点。",
      "直播 SOP": "想整理一份适用于腰尾部主播的开播前后执行 SOP。",
      "公会陪跑手册": "请生成一份给运营同学使用的主播陪跑手册。",
      "新人主播话术卡": "请生成新人主播冷启动阶段可直接使用的话术卡。",
      其他: "请帮我生成一份运营教育物料。",
    },
    questions: {
      "主播培训提纲": "面向哪类主播？想解决什么问题？",
      "活动宣导海报文案": "活动主题、对象和核心目标分别是什么？",
      "直播 SOP": "这份 SOP 要给谁使用？覆盖哪个阶段？",
      "公会陪跑手册": "是给运营、主播本人还是公会管理者使用？",
      "新人主播话术卡": "你希望用于开场、互动还是转化环节？",
      其他: "告诉我物料用途和受众，我会继续完善需求。",
    },
    agentIntro: "好的，我先梳理物料目标和受众，再为您生成内容草案。",
    loadingSteps: [
      "调用教育物料生成技能",
      "分析受众、目标与使用场景",
      "组织物料结构与重点信息",
      "输出可直接使用的物料内容",
    ],
  },
  content: {
    title: "内容调优话术",
    promptTitle: "你要优化哪类内容话术?",
    options: ["开场留人话术", "PK 拉票话术", "礼物转化话术", "粉丝互动话术", "召回复播话术", "其他"],
    samples: {
      "开场留人话术": "请帮我生成更能留人的直播开场话术，适合娱乐互动型主播。",
      "PK 拉票话术": "需要一套不尴尬、转化率更高的 PK 拉票话术。",
      "礼物转化话术": "想优化礼物转化节点的话术，适合腰部主播。",
      "粉丝互动话术": "请生成能提升评论和停留时长的互动话术。",
      "召回复播话术": "需要面向失活主播的复播召回话术。",
      其他: "请帮我优化主播内容话术。",
    },
    questions: {
      "开场留人话术": "适用于哪类主播和内容风格？",
      "PK 拉票话术": "是单人 PK 还是活动型 PK？更偏强节奏还是轻互动？",
      "礼物转化话术": "你想提升哪类礼物转化？适用于哪个直播阶段？",
      "粉丝互动话术": "你希望提升评论、停留还是回访？",
      "召回复播话术": "目标主播是哪一类？触达语气偏强提醒还是温和关怀？",
      其他: "告诉我话术用途和场景，我会继续补齐条件。",
    },
    agentIntro: "好的，我先识别内容场景和目标，再帮您优化这部分话术。",
    loadingSteps: [
      "调用内容调优技能",
      "分析场景节奏、用户反馈与转化目标",
      "生成更适合该场景的话术方案",
      "整理可直接替换使用的文案版本",
    ],
  },
  spender: {
    title: "金主分析",
    promptTitle: "你想分析哪类金主问题?",
    options: ["高价值用户流失", "金主活跃度下降", "新金主转化", "活动期金主拉动", "主播与金主匹配", "其他"],
    samples: {
      "高价值用户流失": "请分析近 30 天高价值用户流失的主要原因，并给出运营动作。",
      "金主活跃度下降": "想排查近 14 天金主活跃度下降的主播和原因。",
      "新金主转化": "请帮我分析新金主从首充到稳定付费的转化链路。",
      "活动期金主拉动": "想看活动期间金主参与度和拉动效果，给出提升建议。",
      "主播与金主匹配": "请分析主播和高价值用户之间的匹配关系，识别优先维护对象。",
      其他: "请帮我做一份金主分析。",
    },
    questions: {
      "高价值用户流失": "你想看哪些主播或公会下的高价值用户？",
      "金主活跃度下降": "要聚焦哪个时间范围？更看重活跃还是付费？",
      "新金主转化": "你希望分析首充、复充还是成为稳定金主的路径？",
      "活动期金主拉动": "是哪个活动？关注参与率、付费额还是复购？",
      "主播与金主匹配": "你想看单主播还是主播分层？",
      其他: "告诉我你想分析的金主问题范围。",
    },
    agentIntro: "收到，我先帮您拆解金主问题，再输出维护与提升建议。",
    loadingSteps: [
      "调用金主分析技能",
      "分析高价值用户行为、活跃与付费变化",
      "识别风险信号与优先维护对象",
      "生成后续运营建议",
    ],
  },
};

const workbenchBoards = [
  {
    title: "开播活跃提醒 (42)",
    action: "一键促开播",
    rows: [
      ["♚LONEY_TUNNES♔", "连续 3 天有效开播低于基准"],
      ["Gabily", "即将跃迁营收层级，今日出现开播断档"],
      ["saba_muhamed", "5 天未开播"],
      ["buka tui", "7 天未开播"],
    ],
  },
  {
    title: "处罚提醒 (3)",
    action: "一键排查",
    rows: [
      ["Lilia atrash", "命中封禁直播权限处罚，主播开播功能停止使用"],
      ["Looo", "连续收到处罚风险提示，存在封禁或限流隐患"],
      ["RAHAF.", "命中强时不推荐处罚，直播间将不展示在直播公域"],
    ],
  },
  {
    title: "近 30 天流量下降提醒 (5)",
    action: "优化建议",
    rows: [
      ["bap16tui", "日均直播时长下降为主要原因"],
      ["Bad baby", "场均直播时长下降为主要原因"],
      ["3_Hps", "粉丝在线率下降为主要原因"],
      ["IShow", "粉丝在线率下降为主要原因"],
    ],
  },
  {
    title: "营收下降提醒 (4)",
    action: "优化建议",
    rows: [
      ["iamalexiss", "粉丝数增长放缓，与内容吸粉能力下降有关"],
      ["Gabily", "粉丝看播活跃度下降，未形成稳定看播习惯"],
      ["CHIHA", "分人群进房率下降，与内容变化或粉丝运营不足有关"],
      ["Nexie", "分人群进房率下降，与内容变化或粉丝运营不足有关"],
    ],
  },
];

function Icon({ children }) {
  return <span className="icon">{children}</span>;
}

function Sidebar({ selectedGoal, collapsed = false, onGoWorkbench }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand-row">
        <div className="brand-left">
          {!collapsed ? (
            <>
              <button className="icon-button" aria-label="返回">
                <Icon>‹</Icon>
              </button>
              <strong>Rena</strong>
            </>
          ) : (
            <strong className="collapsed-brand">Rena</strong>
          )}
        </div>
        {!collapsed ? (
          <button className="mini-button" aria-label="折叠">
            <Icon>⇥</Icon>
          </button>
        ) : null}
      </div>

      <button className="primary-button">
        <Icon>+</Icon>
        {!collapsed ? "新建任务" : null}
      </button>

      <nav className="sidebar-nav">
        <button className="nav-item" type="button" onClick={onGoWorkbench}>
          <Icon>▱</Icon>
          {!collapsed ? "运营工作台" : null}
        </button>
        <button className="nav-item">
          <Icon>⌘</Icon>
          {!collapsed ? "历史任务" : null}
        </button>
      </nav>

      {!collapsed ? <div className="divider" /> : null}

      {!collapsed ? (
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
      ) : (
        <button className="nav-item nav-clock" type="button" aria-label="最近">
          <Icon>◔</Icon>
        </button>
      )}
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

function AgentInputPanel({
  value,
  onChange,
  onSubmit,
  placeholder,
  helperText,
  autoFocus = false,
  resetSignal = "",
  interactionMode = "default",
  submitDisabled = false,
}) {
  const panelRef = useRef(null);
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const isTyping = value.trim().length > 0;
  const isLockedDefault = interactionMode === "default";
  const isFeedbackPrimed = interactionMode === "feedback";
  const isEditable = interactionMode === "feedback" || interactionMode === "editable";
  const shouldShowHint = Boolean(helperText) && (isFeedbackPrimed || isPanelActive || isFocused || isTyping);
  const panelStateClass = isLockedDefault
    ? "is-default"
    : isTyping
      ? "is-typing"
      : isFeedbackPrimed || isPanelActive || isFocused
        ? shouldShowHint
          ? "is-feedback"
          : "is-active"
        : "is-default";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!isEditable) return;
      if (!panelRef.current) return;
      if (panelRef.current.contains(event.target)) {
        setIsPanelActive(true);
        return;
      }
      setIsPanelActive(false);
      setIsFocused(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isEditable]);

  useEffect(() => {
    setIsPanelActive(false);
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  }, [resetSignal]);

  return (
    <section className="composer-shell">
      {shouldShowHint ? <div className="composer-hint">{helperText}</div> : null}
      <div
        ref={panelRef}
        className={`composer-card ${panelStateClass}`}
        onClick={() => {
          if (!isEditable) return;
          setIsPanelActive(true);
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          onFocus={() => {
            if (!isEditable) return;
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          readOnly={!isEditable}
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
            disabled={submitDisabled}
            aria-label="发送"
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}

function Composer({ selectedGoal, draft, onDraftChange, onSubmit, helperText, resetSignal, interactionMode }) {
  const currentHelperText = selectedGoal
    ? helperText
    : "请先选择一个目标，我会继续追问关键信息。";
  const placeholderText = selectedGoal
    ? "请帮助我完善信息，我将更精准地为你完成任务"
    : "请先选择一个目标，我会继续追问关键信息。";

  return (
    <AgentInputPanel
      value={draft}
      onChange={onDraftChange}
      onSubmit={onSubmit}
      placeholder={placeholderText}
      helperText={currentHelperText}
      autoFocus={false}
      resetSignal={resetSignal}
      interactionMode={interactionMode}
      submitDisabled={!selectedGoal}
    />
  );
}

function AgentProcessing({ intro, steps, visibleCount }) {
  return (
    <section className="agent-processing">
      <div className="agent-processing-intro">{intro}</div>
      <div className="agent-processing-rail">
        <div className="agent-processing-head">
          <span className="agent-processing-mark">✦</span>
          <span>深度执行中</span>
          <span className="agent-processing-caret">⌃</span>
        </div>
        <div className="agent-step-list">
          {steps.slice(0, visibleCount).map((step) => (
            <div className="agent-step-row" key={step}>
              <span className="agent-step-check">✓</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="agent-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

function MatchTag({ avatar, name }) {
  return (
    <span className="match-tag">
      <img src={avatar} alt="" />
      <span>{name}</span>
    </span>
  );
}

function MatchPosterPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const previews = smartmatchResultData.previews;
  const activePreview = previews[activeIndex];

  const handleMove = (direction) => {
    setActiveIndex((current) => (current + direction + previews.length) % previews.length);
  };

  return (
    <aside className="match-preview-panel">
      <div className="match-preview-head">
        <p>比赛海报预览</p>
        <div className="match-preview-actions" aria-hidden="true">
          <span>⤢</span>
          <span>×</span>
        </div>
      </div>
      <div className="match-preview-tabs">
        {previews.map((preview, index) => (
          <button
            key={preview.label}
            type="button"
            className={index === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            {preview.label}
          </button>
        ))}
      </div>
      <div className="match-preview-body">
        <button type="button" className="preview-nav" onClick={() => handleMove(-1)} aria-label="上一张">
          ‹
        </button>
        <div className="poster-stage">
          <p>{activePreview.title}</p>
          <img src={activePreview.image} alt="比赛海报预览" />
        </div>
        <button type="button" className="preview-nav" onClick={() => handleMove(1)} aria-label="下一张">
          ›
        </button>
      </div>
    </aside>
  );
}

function MatchResultBoard({ selectedGoal, userInput }) {
  return (
    <section className="match-result-board">
      <div className="match-result-intro">
        <p>{smartmatchResultData.intro}</p>
        <button type="button" className="process-pill">
          <span className="process-pill-mark">✦</span>
          执行过程
          <span className="process-pill-caret">⌃</span>
        </button>
      </div>

      <div className="match-result-content">
        <p className="result-success-text">
          已经成功为 3 位主播撮合了 <strong>2026 年 4 月 18 日 21:00 – 22:00 (UTC+08:00)</strong> 的 PK 赛事
        </p>
        <div className="result-match-list">
          {smartmatchResultData.matches.map((item) => (
            <article className="result-match-card" key={item.host}>
              <div className="result-match-head">
                <div className="result-match-title">
                  <MatchTag avatar={item.hostAvatar} name={item.host} />
                  <strong>的赛事</strong>
                </div>
                <button type="button" className="match-more-button">
                  推荐更多对手
                </button>
              </div>
              <div className="result-match-copy">
                <p>
                  <span>PK 对手：</span>
                  <MatchTag avatar={item.opponentAvatar} name={item.opponent} />
                </p>
                <p>
                  <span>匹配原因：</span>
                  <em>{item.reason}</em>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="file-card">
          <img src={smartmatchResultData.posterThumb} alt="" />
          <div>
            <strong>比赛海报</strong>
            <span>6 张</span>
          </div>
        </div>

        <div className="result-confirm">
          <p>如果确认无误，请点击 "确认" 以继续创建正式 PK 赛事</p>
          <button type="button">确认</button>
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

function WorkbenchHome({ onEnterScene }) {
  const [workbenchDraft, setWorkbenchDraft] = useState("");

  return (
    <section className="workbench-home">
      <div className="welcome-block">
        <div className="welcome-head">
          <div className="welcome-mark">✦</div>
          <h1>欢迎来到 芷薇 的主播运营工作台</h1>
        </div>

        <AgentInputPanel
          value={workbenchDraft}
          onChange={setWorkbenchDraft}
          onSubmit={() => {}}
          placeholder="我能帮你分析主播问题并制定优化策略，请分配我任务吧"
          submitDisabled={!workbenchDraft.trim()}
        />

        <div className="scene-chip-row">
          {workbenchChips.map((chip) => (
            <button
              key={chip.label}
              className="scene-chip"
              type="button"
              onClick={() => onEnterScene(chip.action)}
            >
              <span className="scene-chip-icon">{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="focus-tabs">
        <button className="active" type="button">
          ☰ 今日重点关注
        </button>
        <button type="button">⌂ 解决方案</button>
      </div>

      <div className="workbench-grid">
        {workbenchBoards.map((card) => (
          <article className="workbench-card" key={card.title}>
            <div className="workbench-card-head">
              <h3>{card.title}</h3>
              <button type="button">{card.action}</button>
            </div>
            <div className="workbench-list">
              {card.rows.map(([name, text]) => (
                <div className="workbench-list-row" key={`${card.title}-${name}`}>
                  <div className="person-pill">
                    <span className="person-avatar">{name.slice(0, 1)}</span>
                    <span>{name}</span>
                  </div>
                  <p>{text}</p>
                  <span className="row-arrow">›</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [currentView, setCurrentView] = useState("workbench");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [submittedText, setSubmittedText] = useState("");
  const [composerDockStyle, setComposerDockStyle] = useState({});
  const [composerSpacerHeight, setComposerSpacerHeight] = useState(220);
  const mainStackRef = useRef(null);
  const composerDockRef = useRef(null);

  const currentScene = sceneConfigs[currentView] || sceneConfigs.smartmatch;
  const currentOptions = currentScene.options;
  const currentSamples = currentScene.samples;
  const currentQuestions = currentScene.questions;
  const currentDraft = draft;
  const currentSampleText = selectedGoal ? currentSamples[selectedGoal] : "";
  const showSmartmatchResult = currentView === "smartmatch" && submitted && selectedGoal;
  const isSidebarCollapsed = showSmartmatchResult;
  const composerResetSignal = `${currentView}-${selectedGoal}-${isProcessing ? "processing" : "idle"}-${submitted ? "submitted" : "editing"}`;
  const composerInteractionMode = isProcessing
    ? "default"
    : selectedGoal
      ? "feedback"
      : "default";

  const handleGoalPick = (goal) => {
    setSelectedGoal(goal);
    setSubmitted(false);
    setIsProcessing(false);
    setDraft("");
  };

  const handleSubmit = () => {
    if (!selectedGoal) return;
    const nextSubmittedText = currentDraft || currentSampleText;
    setSubmittedText(nextSubmittedText);
    setDraft("");
    setSubmitted(false);
    setIsProcessing(true);
    setVisibleStepCount(0);
  };

  const handleEnterScene = (sceneKey) => {
    if (!sceneKey) return;
    setCurrentView(sceneKey);
    setSelectedGoal("");
    setSubmitted(false);
    setIsProcessing(false);
    setDraft("");
    setSubmittedText("");
  };

  useEffect(() => {
    if (!isProcessing) return;

    const steps = currentScene.loadingSteps || [];
    let stepIndex = 0;
    setVisibleStepCount(0);

    const intervalId = window.setInterval(() => {
      stepIndex += 1;
      setVisibleStepCount(Math.min(stepIndex, steps.length));

      if (stepIndex >= steps.length) {
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          setIsProcessing(false);
          setSubmitted(true);
        }, 1100);
      }
    }, 700);

    return () => window.clearInterval(intervalId);
  }, [isProcessing, currentScene]);

  useLayoutEffect(() => {
    if (currentView === "workbench") return undefined;

    const updateComposerLayout = () => {
      if (!mainStackRef.current || !composerDockRef.current) return;

      const rect = mainStackRef.current.getBoundingClientRect();
      const nextWidth = Math.max(0, rect.width);
      const nextLeft = rect.left;
      const nextHeight = composerDockRef.current.offsetHeight;

      setComposerDockStyle({
        left: `${nextLeft}px`,
        width: `${nextWidth}px`,
      });
      setComposerSpacerHeight(nextHeight + 20);
    };

    updateComposerLayout();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateComposerLayout())
        : null;

    if (resizeObserver) {
      if (mainStackRef.current) resizeObserver.observe(mainStackRef.current);
      if (composerDockRef.current) resizeObserver.observe(composerDockRef.current);
    }

    window.addEventListener("resize", updateComposerLayout);
    return () => {
      window.removeEventListener("resize", updateComposerLayout);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [currentView, selectedGoal, submitted, isProcessing, draft]);

  return (
    <div className="app-shell">
      <Sidebar
        selectedGoal={selectedGoal}
        collapsed={isSidebarCollapsed}
        onGoWorkbench={() => {
          setCurrentView("workbench");
          setSubmitted(false);
          setIsProcessing(false);
        }}
      />
      <main className="main-panel">
        <div className={`main-column ${showSmartmatchResult ? "main-column-result" : ""}`}>
          {currentView === "workbench" ? (
            <WorkbenchHome onEnterScene={handleEnterScene} />
          ) : (
            <>
              <div className={`scene-layout ${showSmartmatchResult ? "has-preview" : ""}`}>
                <div className="scene-main-stack" ref={mainStackRef}>
                  <div className="scene-scroll-content" style={{ paddingBottom: `${composerSpacerHeight}px` }}>
                    <section className="goal-picker">
                      <p className="section-title">{currentScene.promptTitle}</p>
                      <div className="goal-row">
                        {currentOptions.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            className={`goal-chip ${goal === selectedGoal ? "active" : ""}`}
                            onClick={() => handleGoalPick(goal)}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </section>
                    {selectedGoal ? (
                      <div className="chat-bubble-row">
                        <div className="chat-bubble">{selectedGoal}</div>
                      </div>
                    ) : null}
                    {isProcessing ? (
                      <>
                        <div className="chat-bubble-row prompt-bubble-row">
                          <div className="chat-bubble prompt-bubble">{submittedText}</div>
                        </div>
                        <AgentProcessing
                          intro={currentScene.agentIntro}
                          steps={currentScene.loadingSteps}
                          visibleCount={visibleStepCount}
                        />
                        <div className="hero-space processing-space" />
                      </>
                    ) : submitted && selectedGoal ? (
                      <>
                        <div className="chat-bubble-row prompt-bubble-row">
                          <div className="chat-bubble prompt-bubble">{submittedText || currentSampleText}</div>
                        </div>
                        {currentView === "smartmatch" ? (
                        <MatchResultBoard selectedGoal={selectedGoal} userInput={submittedText || currentSampleText} />
                      ) : (
                        <ResultBoard selectedGoal={selectedGoal} userInput={submittedText || currentSampleText} />
                      )}
                    </>
                  ) : (
                    <div className="hero-space" />
                  )}
                  </div>
                  <div className="scene-composer-dock" ref={composerDockRef} style={composerDockStyle}>
                    <Composer
                      selectedGoal={selectedGoal}
                      draft={currentDraft}
                      onDraftChange={setDraft}
                      onSubmit={handleSubmit}
                      helperText={currentQuestions[selectedGoal]}
                      resetSignal={composerResetSignal}
                      interactionMode={composerInteractionMode}
                    />
                  </div>
                </div>
                {showSmartmatchResult ? <MatchPosterPreview /> : null}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
