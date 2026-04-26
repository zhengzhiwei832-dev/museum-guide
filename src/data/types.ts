export interface Museum {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  country: string;
  coverImage: string;
  description: string;
  practicalInfo: {
    ticketPrice: string;
    openingHours: string;
    reservation: string;
    transportation: string;
    tips: string[];
  };
  floorMap: {
    overview: string;
    floors: Floor[];
  };
  highlights: Exhibit[];
  hiddenGems: Exhibit[];
  recommendedRoutes: Route[];
}

export interface Floor {
  id: string;
  name: string;
  description: string;
  zones: string[];
}

// 大众版导览内容（8个章节）
export interface ExhibitPopularGuide {
  hook: string;              // 一句话认识它
  importance: string;        // 它为什么重要
  visualScene: string;       // 画面/视觉在发生什么
  characters: { name: string; label: string; detail: string }[];  // 人物/细节速查
  viewingTips: string[];     // 怎么看：专业小贴士（3条）
  hiddenFacts: string[];     // 你可能不知道（3条冷知识）
  challenge: { task: string; meaning: string };  // 互动挑战：寻宝时间
  oneLiner: string;          // 一句话读懂主题
}

// 爱好者版导览内容（8个章节）
export interface ExhibitEnthusiastGuide {
  archive: {
    artist: string;
    year: string;
    medium: string;
    dimensions: string;
    collection: string;
    patron: string;
    genre: string;
  };
  historicalContext: string;  // 时代背景/哲学与社会语境
  artistPhase: string;       // 走近艺术家/创作阶段
  visualAnalysis: string;    // 画面解析/材质、构图与美学视线
  coreElements: { name: string; identity: string; action: string; symbolism: string }[];  // 局部与图鉴
  thematicCore: string;      // 思想内核
  controversies: { school: string; description: string }[];  // 解读争议
  hiddenDetails: string[];   // 细节彩蛋
}

export interface Exhibit {
  id: string;
  name: string;
  nameOriginal?: string;
  image: string;
  period: string;
  location: string;
  artist?: string;
  description: string;
  funFact?: string;
  audioGuideNo?: string;
  popularGuide?: ExhibitPopularGuide;
  enthusiastGuide?: ExhibitEnthusiastGuide;
}

export interface Route {
  id: string;
  duration: string;
  durationLabel: string;
  overview: string;
  designThought: string;
  stops: RouteStop[];
}

export interface RouteStop {
  order: number;
  exhibitId: string;
  exhibitName: string;
  stayMinutes: number;
  tip?: string;
}
