"use client";

import { useMemo, useState } from "react";

type CampaignGoal = "awareness" | "engagement" | "conversion" | "retention";
type BudgetTier = "lean" | "steady" | "aggressive";

type Persona = {
  name: string;
  description: string;
  vibe: string;
  painPoints: string[];
  triggers: string[];
  channelHabits: string[];
};

type CampaignInputs = {
  brandName: string;
  offering: string;
  differentiation: string;
  audience: string;
  tone: string;
  goal: CampaignGoal;
  budget: number;
  campaignLength: number;
  selectedPlatforms: PlatformKey[];
};

type ContentPillar = {
  title: string;
  purpose: string;
  proof: string;
  formats: string[];
};

type WeeklySprint = {
  week: number;
  theme: string;
  focus: string;
  deliverables: string[];
  optimization: string;
};

type ContentIdea = {
  title: string;
  platform: string;
  format: string;
  hook: string;
  beats: string[];
  success: string;
};

type CampaignMoment = {
  title: string;
  description: string;
  activation: string;
  metric: string;
};

type MeasurementItem = {
  label: string;
  cadence: string;
  notes: string;
  target: string;
};

type GoalKit = {
  title: string;
  northStar: string;
  successSignals: string[];
  creativeAngles: string[];
  ctas: string[];
  narrativeArc: string[];
  momentumPlays: string[];
  proofDrivers: string[];
};

type PlatformConfig = {
  label: string;
  accent: string;
  summary: string;
  cadences: Record<BudgetTier, string>;
  bestTimes: string[];
  heroHooks: Record<CampaignGoal, string>;
  recommendedContent: string[];
  automation: string[];
  proTips: string[];
  culturalNotes: string[];
};

const GOAL_LIBRARY: Record<CampaignGoal, GoalKit> = {
  awareness: {
    title: "Break New Ground",
    northStar:
      "Turn lurkers into fans by dramatizing the problem and showing the category shift your product unlocks.",
    successSignals: [
      "Organic reach growth",
      "Profile visits",
      "Share rate",
      "New followers",
    ],
    creativeAngles: [
      "Future-state storytelling",
      "Category tension moments",
      "Data-backed hooks",
      "Earned media and PR beats",
    ],
    ctas: ["Follow for daily signal drops", "Share with your marketing squad", "Save for your next planning sprint"],
    narrativeArc: [
      "Spark intrigue",
      "Name the tension",
      "Introduce the vehicle",
      "Show quick social proof",
      "Invite participation",
    ],
    momentumPlays: [
      "Trending audio hijacks",
      "Creator duets and stitches",
      "Community listening prompts",
      "AMA or livestream Q&A",
      "Press or podcast amplification",
    ],
    proofDrivers: [
      "Numbers that feel inevitable",
      "Before/after transformations",
      "Third-party validation",
      "Customer or expert POV quotes",
    ],
  },
  engagement: {
    title: "Energize The Community",
    northStar:
      "Pull the audience into co-creating the story with participatory formats and rapid response." ,
    successSignals: [
      "Comment quality",
      "Saves and shares",
      "Audience-generated content",
      "DM conversations",
    ],
    creativeAngles: [
      "Challenge formats",
      "Community spotlights",
      "Open loops and episodic storytelling",
      "Behind-the-scenes access",
    ],
    ctas: ["Drop your take", "Vote in the poll", "Tag a teammate", "Co-create with us"],
    narrativeArc: [
      "Issue the challenge",
      "Spotlight responses",
      "Double down on community wins",
      "Reveal exclusive access",
      "Launch episodic hero",
    ],
    momentumPlays: [
      "Duet-worthy prompts",
      "Debate formats",
      "Shout-outs and stitched responses",
      "Weekly live recap",
      "Reward loop for top contributors",
    ],
    proofDrivers: [
      "Volume of participation",
      "Screenshots of high-signal engagements",
      "Community testimonials",
      "User-generated highlight reels",
    ],
  },
  conversion: {
    title: "Accelerate Pipeline",
    northStar:
      "Prime the audience with proof and urgency to convert attention into qualified demand.",
    successSignals: [
      "Click-through rate",
      "Demo or trial sign-ups",
      "Lead form submissions",
      "Cost per acquisition",
    ],
    creativeAngles: [
      "Pain-to-solution breakdowns",
      "ROI calculators",
      "Fast-track case studies",
      "Offer driven retargeting",
    ],
    ctas: ["Book a strategy session", "Start the free trial", "Download the playbook", "Lock in founder pricing"],
    narrativeArc: [
      "Expose the hidden cost",
      "Quantify the upside",
      "Show the proof stack",
      "Remove friction",
      "Drive the decision",
    ],
    momentumPlays: [
      "Countdown offers",
      "Success-teardown webinars",
      "Partner co-marketing",
      "Retargeting workflow",
      "Referral unlocks",
    ],
    proofDrivers: [
      "Win-rate jumps",
      "Customer logo momentum",
      "Integration partners",
      "ROI highlights",
    ],
  },
  retention: {
    title: "Deepen Loyalty",
    northStar:
      "Keep champions activated with insider access, tailored wins, and community recognition.",
    successSignals: [
      "Repeat purchase rate",
      "Expansion conversations",
      "Net promoter sentiment",
      "Referral volume",
    ],
    creativeAngles: [
      "Product roadmap sneak peeks",
      "Customer milestone celebrations",
      "Power user tutorials",
      "Co-creation studio",
    ],
    ctas: ["Vote on the roadmap", "Share your win", "Refer a peer", "Unlock VIP resources"],
    narrativeArc: [
      "Celebrate the insiders",
      "Unlock elevated access",
      "Teach elite workflows",
      "Spotlight community wins",
      "Activate referral flywheel",
    ],
    momentumPlays: [
      "Member-only drops",
      "Office-hours series",
      "Ambassador program",
      "Quarterly business review mashups",
      "Advocate leaderboard",
    ],
    proofDrivers: [
      "Time-to-value reductions",
      "Power user transformations",
      "Exclusive roadmap reveals",
      "Referral testimonials",
    ],
  },
};

const PLATFORM_LIBRARY = {
  instagram: {
    label: "Instagram",
    accent: "#ec4899",
    summary: "Visual storytelling and cultural momentum through Reels, carousels, and story labs.",
    cadences: {
      lean: "3 Reels, 2 carousel drops, + daily story clusters",
      steady: "4 Reels, 3 carousels, 4 story labs, bi-weekly Live",
      aggressive: "5 Reels, 4 carousels, daily story arcs, weekly Live collabs",
    },
    bestTimes: ["Mon 9am", "Wed 12pm", "Thu 6pm"],
    heroHooks: {
      awareness: "Launch a swipe-stopping Reel that visualizes the pain point with data overlays and motion graphics.",
      engagement: "Run story labs with polls + slider heatmaps to crowdsource narrative fuel.",
      conversion: "Drop a carousel teardown: ‘3 signals you’re about to lose a customer and how to intercept them’.",
      retention: "Publish a Reel celebrating power users and tease insider-only feature drops.",
    },
    recommendedContent: [
      "Trend-reactive short-form video",
      "Swipeable insight carousels",
      "Story poll experiments",
      "Creator remix collaborations",
    ],
    automation: [
      "Meta Business Suite scheduling",
      "CapCut templates library",
      "Later.com performance tagging",
    ],
    proTips: [
      "Use 0.8x speed edits to land more story frames without feeling rushed.",
      "Hook the Reel with a hard data stat visualized in the first 1.5 seconds.",
      "Stack story features (poll + question) to boost completion rate.",
    ],
    culturalNotes: [
      "Reels favor bold typography with high contrast backgrounds in the opening frame.",
      "Carousels that feel like mini playbooks outperform single images by 3.1x.",
      "Story series that span 7-9 frames hold retention best for SaaS audiences.",
    ],
  },
  tiktok: {
    label: "TikTok",
    accent: "#22d3ee",
    summary: "Attention hacking with fast-paced story arcs, education, and duet-friendly prompts.",
    cadences: {
      lean: "4 short-form drops + 1 stitch per week",
      steady: "5 original drops, 2 stitches, 1 community recap",
      aggressive: "7 drops (mix of original + duet), 2 live office hours",
    },
    bestTimes: ["Tue 8pm", "Thu 7pm", "Sat 10am"],
    heroHooks: {
      awareness: "Kick off with a pattern interrupt: ‘POV: You’re about to miss the customer sentiment spike’.",
      engagement: "Challenge the audience: ‘Stitch this with the wildest brand signal you’ve spotted this week’.",
      conversion: "Run a fast-paced ‘myth vs metric’ explainer with on-screen receipts.",
      retention: "Host a live feature lab where power users vote in real time.",
    },
    recommendedContent: [
      "POV explainers",
      "Trend hijacks with data receipts",
      "Duet invitations",
      "Behind-the-scenes montage",
    ],
    automation: [
      "OpusClip repurposing pipeline",
      "Descript for lightning-fast captions",
      "Metricool for smart scheduling",
    ],
    proTips: [
      "Layer contextual subtitles with emoji anchors to hold attention.",
      "End with an explicit ask to stitch/duet to unlock algorithmic amplification.",
      "Switch camera angles mid-sentence to pace the energy.",
    ],
    culturalNotes: [
      "Educational content with a personal POV outperform brand-first clips by 2.4x.",
      "Creator collaborations unlock faster time-to-trust for new SaaS categories.",
      "Live shopping style demos drive deeper session watch time even without a product cart.",
    ],
  },
  linkedin: {
    label: "LinkedIn",
    accent: "#2563eb",
    summary: "Thought leadership and demand creation for professional buyers with narrative carousels and POV videos.",
    cadences: {
      lean: "3 narrative posts + 1 document carousel",
      steady: "4 posts (mix POV + data), 2 carousels, 1 newsletter",
      aggressive: "5 posts, 2 carousels, weekly newsletter + audio event",
    },
    bestTimes: ["Tue 8am", "Wed 9am", "Thu 11am"],
    heroHooks: {
      awareness: "Publish a first-person manifesto on the market shift only your data can see.",
      engagement: "Host an audio event with community operators debating the shift.",
      conversion: "Drop a narrative post ending with an invite to a private teardown session.",
      retention: "Celebrate customer wins in a long-form spotlight post and tag partners.",
    },
    recommendedContent: [
      "Document carousels",
      "Founder POV essays",
      "Pulse check polls",
      "Team member video journals",
    ],
    automation: [
      "Shield analytics for content scoring",
      "Taplio scheduling",
      "Fathom notes to capture customer soundbites",
    ],
    proTips: [
      "Lead with a tension statement in the first 200 characters to maximize dwell time.",
      "Use carousel slides with gradient overlays to feel premium and on-brand.",
      "Invite tagged voices into the comments within the first hour to spark debate.",
    ],
    culturalNotes: [
      "Narrative carousels with story math drive 1.8x more saves than job-style updates.",
      "Executive POV videos optimized for subtitles hold the scroll on mobile.",
      "Comment-first prompts nudge the algorithm to boost the post to 2nd-degree networks.",
    ],
  },
  x: {
    label: "X (Twitter)",
    accent: "#0ea5e9",
    summary: "Real-time narrative shaping through threads, hot takes, and community replies.",
    cadences: {
      lean: "Daily conversational post + weekly thread",
      steady: "2-3 posts daily, 1 thread, 2 quote-retweets of customers",
      aggressive: "3-4 posts daily, 2 threads, Spaces session, curated list engagement",
    },
    bestTimes: ["Mon 11am", "Wed 3pm", "Fri 9am"],
    heroHooks: {
      awareness: "Thread the state of the industry with punchy metrics and a contrarian POV.",
      engagement: "Run a ‘build with us’ prompt thread where operators drop their workflows.",
      conversion: "Pin a thread breaking down ROI with a CTA to a playbook landing page.",
      retention: "Host a Spaces with customer operators swapping playbooks.",
    },
    recommendedContent: [
      "Narrative threads",
      "Quote-retweet spotlights",
      "Live event coverage",
      "Spaces conversations",
    ],
    automation: [
      "Typefully thread drafting",
      "TweetHunter inspiration vault",
      "SavvyCal for Spaces scheduling",
    ],
    proTips: [
      "Use lead-in hooks under 220 characters to earn expand taps.",
      "Reply to your own thread within 60 seconds to stack visibility.",
      "Curate and share community lists to become the signal hub.",
    ],
    culturalNotes: [
      "Operator threads with charts and quick wins outperform link posts by 3x.",
      "Spaces sessions during commute windows sustain 25+ minute listen time.",
      "Pinned tweet refresh every 10 days keeps profile conversions high.",
    ],
  },
  youtube: {
    label: "YouTube",
    accent: "#f97316",
    summary: "Deep-dive authority through episodic explainers, livestreams, and Shorts repurposing.",
    cadences: {
      lean: "1 long-form breakdown + 2 Shorts",
      steady: "Bi-weekly deep dives, 3 Shorts, 1 livestream recap",
      aggressive: "Weekly deep dives, 4 Shorts, weekly livestream AMA",
    },
    bestTimes: ["Wed 4pm", "Thu 2pm", "Sun 10am"],
    heroHooks: {
      awareness: "Publish a cinematic case study that shows before/after social listening impact.",
      engagement: "Drop a workflow teardown with chaptered timestamps for bingeable consumption.",
      conversion: "Launch a product demo live with in-stream CTA overlays.",
      retention: "Host a customer roundtable that previews roadmap exclusives.",
    },
    recommendedContent: [
      "Chaptered explainers",
      "Customers roundtables",
      "Shorts recaps of hero stats",
      "Livestream office hours",
    ],
    automation: [
      "TubeBuddy optimization tracking",
      "StreamYard multicasting",
      "Lumen5 auto-highlight clipping",
    ],
    proTips: [
      "Open with a cold hook visual inside the first 5 seconds before the bumper.",
      "Chapter your videos so viewers can jump to value fast.",
      "Republish top Shorts with refreshed hooks every 45 days.",
    ],
    culturalNotes: [
      "Educational explainers with motion graphics keep watch time above 52%.",
      "Community posts that tease upcoming drops re-engage dormant subscribers.",
      "Livestream replays with timestamps convert 1.6x better than raw reuploads.",
    ],
  },
} satisfies Record<string, PlatformConfig>;

type PlatformKey = keyof typeof PLATFORM_LIBRARY;

type PersonaTemplate = {
  match: RegExp;
  persona: Persona;
};

const PERSONA_LIBRARY: PersonaTemplate[] = [
  {
    match: /(founder|startup|entrepreneur|bootstrap)/i,
    persona: {
      name: "Founder Finn",
      description:
        "Scrappy startup builders who oscillate between product fires and go-to-market experiments.",
      vibe: "Ambitious, fast-learning, allergic to bureaucracy.",
      painPoints: [
        "Hard to track which narrative is landing in real time",
        "Need momentum without large budgets",
        "Lack of consistent social proof to win investor confidence",
      ],
      triggers: [
        "Battle-tested frameworks",
        "Proof that speed beats size",
        "Dashboard screenshots that feel like unfair advantage",
      ],
      channelHabits: ["Scrolls TikTok at night", "Lives on X for real-time intel", "Checks LinkedIn over morning coffee"],
    },
  },
  {
    match: /(marketing director|brand manager|cm|enterprise|corporate|fortune)/i,
    persona: {
      name: "Brand Builder Bailey",
      description:
        "Senior marketing leaders at scaling brands balancing storytelling, performance, and internal buy-in.",
      vibe: "Strategic, data-curious, collaborative.",
      painPoints: [
        "Need proof that creative decisions ladder to business results",
        "Struggle to keep teams aligned on the social calendar",
        "Missing intelligence on competitors and cultural shifts",
      ],
      triggers: [
        "Benchmark reports that feel credible",
        "Stories of cross-functional wins",
        "Confidence that the plan protects the brand",
      ],
      channelHabits: ["Lives in LinkedIn DMs", "Subscribes to industry newsletters", "Screenshots TikTok trends to brief agencies"],
    },
  },
  {
    match: /(ecommerce|d2c|retail|shopify)/i,
    persona: {
      name: "Ecom Operator Eli",
      description:
        "Performance-minded ecommerce operators focused on conversion velocity and repeat purchase lifts.",
      vibe: "Numbers-first but playful.",
      painPoints: [
        "Need fast signals on which offers are landing",
        "Hard to differentiate in saturated channels",
        "Always-on pressure to drive repeat revenue",
      ],
      triggers: [
        "Split tests with clear results",
        "Offer frameworks they can swipe",
        "Proof of higher AOV from better storytelling",
      ],
      channelHabits: ["Checks Instagram Shops daily", "Studies TikTok trend reports", "Listens to DTC podcasts"],
    },
  },
  {
    match: /(developer|product manager|data team|engineer)/i,
    persona: {
      name: "Product Strategist Priya",
      description:
        "Product and data leaders who translate customer signals into roadmap bets.",
      vibe: "Analytical, systems-thinking, selective attention.",
      painPoints: [
        "Need structured signals to prioritize builds",
        "Skeptical of fluffy marketing claims",
        "Looking for tooling that integrates with existing stack",
      ],
      triggers: [
        "API-first angles",
        "Architecture diagrams",
        "Case studies with measurable adoption",
      ],
      channelHabits: ["Watches YouTube explainers", "Skims product hunt", "Prefers Slack-style communities"],
    },
  },
];

const DEFAULT_PERSONA: Persona = {
  name: "Growth Leader Jordan",
  description: "Ambitious growth operators steered by data but motivated by bold storytelling.",
  vibe: "Curious, pragmatic, play-to-win mindset.",
  painPoints: [
    "Need differentiated creative that still maps to revenue",
    "Limited headcount to execute omni-channel",
    "Struggle to translate audience signals into action fast enough",
  ],
  triggers: [
    "Clear strategic frameworks",
    "Proof from brands they admire",
    "Time-saving automation",
  ],
  channelHabits: ["Juggles between LinkedIn and X", "Saves TikTok inspiration on weekends", "Binge listens to GTM podcasts"],
};

const GOAL_OPTIONS: { key: CampaignGoal; label: string }[] = [
  { key: "awareness", label: "Awareness" },
  { key: "engagement", label: "Engagement" },
  { key: "conversion", label: "Conversion" },
  { key: "retention", label: "Retention" },
];

const PLATFORM_ORDER: PlatformKey[] = [
  "instagram",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
];

const DEFAULT_INPUTS: CampaignInputs = {
  brandName: "SignalSync Labs",
  offering: "AI-powered social listening co-pilot that predicts trend surges before they peak",
  differentiation: "Predictive sentiment radar across TikTok, Instagram, and X with workflow automation",
  audience: "Director-level marketers at modern ecommerce and consumer tech brands",
  tone: "Bold, insightful, forward-leaning",
  goal: "awareness",
  budget: 58,
  campaignLength: 6,
  selectedPlatforms: ["instagram", "linkedin", "tiktok"],
};

function matchPersona(audience: string): Persona {
  const template = PERSONA_LIBRARY.find((entry) => entry.match.test(audience));
  return template?.persona ?? DEFAULT_PERSONA;
}

function getBudgetTier(budget: number): BudgetTier {
  if (budget >= 75) return "aggressive";
  if (budget >= 45) return "steady";
  return "lean";
}

function stringSeed(input: string): number {
  return Array.from(input).reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
}

function pickFromArray<T>(items: T[], seed: number): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty array");
  }
  const index = Math.abs(seed) % items.length;
  return items[index];
}

function generateTagline(inputs: CampaignInputs, goalKit: GoalKit, persona: Persona): string {
  const firstName = persona.name.split(" ")[0];
  const action = goalKit.creativeAngles[0] ?? "Tell a fresher story";
  return `${inputs.brandName}: ${action.replace(/\.$/, "")} so ${firstName} wins the scroll.`;
}

function buildPositioning(inputs: CampaignInputs, persona: Persona): string {
  const personaDescriptor = persona.description.split(".")[0];
  return `For ${personaDescriptor.toLowerCase()}, ${inputs.brandName} delivers ${inputs.offering} by ${inputs.differentiation}.`;
}

function generateStoryline(goalKit: GoalKit, tone: string): string {
  const toneFragment = tone.toLowerCase();
  return `We’ll move with a ${toneFragment} cadence that walks the audience through ${goalKit.narrativeArc.join(" → ").toLowerCase()}.`;
}

function createContentPillars(
  inputs: CampaignInputs,
  persona: Persona,
  goalKit: GoalKit
): ContentPillar[] {
  const primaryPain = persona.painPoints[0] ?? "Need a proven playbook";
  const trigger = persona.triggers[0] ?? "Seeing proof in numbers";
  const proof = goalKit.proofDrivers[0] ?? "Quantified success";
  return [
    {
      title: "Signal Intelligence",
      purpose: `Show new insight no-one else sees so your audience can react faster than competitors.
`,
      proof: `${inputs.differentiation} visualized through snackable data drops.`,
      formats: ["Hero stat Reels", "LinkedIn document carousel", "Narrated YouTube short"],
    },
    {
      title: "Operator Playbooks",
      purpose: `Translate insight into action with frameworks ${persona.name.split(" ")[0]} can swipe instantly.`,
      proof: `${primaryPain} solved via step-by-step flow.
`,
      formats: ["Carousel checklist", "TikTok workflow demo", "Threaded how-to on X"],
    },
    {
      title: "Proof Stack",
      purpose: `Turn ${trigger.toLowerCase()} into credibility that accelerates decisions.`,
      proof: `${proof} packaged as narrative case studies and community testimonials.`,
      formats: ["Mini case-study video", "Customer spotlight post", "Livestream roundtable"],
    },
    {
      title: "Community Co-Lab",
      purpose: `Co-create with the audience to unlock continual momentum and social proof.`,
      proof: `Crowdsource signals via AMAs, polls, and duet challenges shaped by ${goalKit.momentumPlays[0]}.`,
      formats: ["Story labs", "Spaces conversation", "TikTok stitch challenge"],
    },
  ];
}

type PlatformBlueprint = {
  key: PlatformKey;
  label: string;
  accent: string;
  summary: string;
  cadence: string;
  bestTimes: string[];
  heroAngle: string;
  recommendedContent: string[];
  automation: string[];
  proTip: string;
};

function createPlatformBlueprint(
  key: PlatformKey,
  inputs: CampaignInputs,
  goalKit: GoalKit,
  tier: BudgetTier
): PlatformBlueprint {
  const config = PLATFORM_LIBRARY[key];
  const seed = stringSeed(`${inputs.brandName}-${key}-${inputs.goal}`);
  const proTip = pickFromArray(config.proTips, seed + 11);
  return {
    key,
    label: config.label,
    accent: config.accent,
    summary: config.summary,
    cadence: config.cadences[tier],
    bestTimes: config.bestTimes,
    heroAngle: config.heroHooks[inputs.goal],
    recommendedContent: config.recommendedContent,
    automation: config.automation,
    proTip,
  };
}

function createWeeklySprints(
  inputs: CampaignInputs,
  goalKit: GoalKit,
  persona: Persona,
  platforms: PlatformBlueprint[]
): WeeklySprint[] {
  const arcs = goalKit.narrativeArc;
  const heroPlatform = platforms[0]?.label ?? "Instagram";
  const secondPlatform = platforms[1]?.label ?? "LinkedIn";
  const templates: WeeklySprint[] = [
    {
      week: 1,
      theme: arcs[0] ?? "Ignite attention",
      focus: `Launch hero narrative and tease the category tension ${persona.name.split(" ")[0]} feels daily.`,
      deliverables: [
        `${heroPlatform} hero drop`,
        `${secondPlatform} POV post`,
        "Story poll heat check",
      ],
      optimization: "Watch early retention and pin top comment responses.",
    },
    {
      week: 2,
      theme: arcs[1] ?? "Name the problem",
      focus: "Stack social proof and quantify the upside with a mini data report.",
      deliverables: [
        `${heroPlatform} data carousel`,
        `${secondPlatform} newsletter snippet`,
        "TikTok stitch challenge kickoff",
      ],
      optimization: "Double down on hooks that triggered shares.",
    },
    {
      week: 3,
      theme: arcs[2] ?? "Introduce the win",
      focus: `Show product in action and hand the mic to an operator.`,
      deliverables: [
        "Creator collaboration segment",
        "Live demo highlight",
        "Thread with ROI receipts",
      ],
      optimization: "Trim friction in CTA flows; test two variants.",
    },
    {
      week: 4,
      theme: arcs[3] ?? "Invite participation",
      focus: "Run an interactive build-with-us sprint to harvest UGC.",
      deliverables: [
        "Story AMA",
        "Community shout-out reel",
        "Poll-driven roadmap teaser",
      ],
      optimization: "Reward top contributors and feature them publicly.",
    },
    {
      week: 5,
      theme: arcs[4] ?? "Scale momentum",
      focus: "Spin up partnerships and cross-post to earned channels.",
      deliverables: [
        "Co-marketing announcement",
        "YouTube roundtable recap",
        "Retargeting creative refresh",
      ],
      optimization: "Compare platform-level CPA and shift budget accordingly.",
    },
    {
      week: 6,
      theme: "Sustain and optimize",
      focus: "Package learnings into evergreen assets and reinforce the CTA.",
      deliverables: [
        "Highlights montage",
        "LinkedIn carousel playbook",
        "Email round-up of best drops",
      ],
      optimization: "Ship post-campaign report and identify evergreen winners.",
    },
  ];

  const weeks = inputs.campaignLength;
  return Array.from({ length: weeks }, (_, index) => {
    const base = templates[index % templates.length];
    return {
      week: index + 1,
      theme: base.theme,
      focus: base.focus,
      deliverables: base.deliverables,
      optimization: base.optimization,
    };
  });
}

function createContentIdeas(
  inputs: CampaignInputs,
  persona: Persona,
  goalKit: GoalKit,
  platforms: PlatformBlueprint[]
): ContentIdea[] {
  const heroPlatform = platforms[0]?.label ?? "Instagram";
  const secondPlatform = platforms[1]?.label ?? "LinkedIn";
  const thirdPlatform = platforms[2]?.label ?? "TikTok";
  const primaryPain = persona.painPoints[0] ?? "Need a repeatable playbook";
  const trigger = persona.triggers[1] ?? "Seeing peers winning";
  const proofDriver = goalKit.proofDrivers[0] ?? "ROI stories";
  return [
    {
      title: `${heroPlatform} Hero Drop`,
      platform: heroPlatform,
      format: "Short-form video",
      hook: `Open with: “POV: ${primaryPain.toLowerCase()}.” Cut to dashboard receipts within 2 seconds.`,
      beats: [
        "Scene 1: Visualize the tension with motion graphics",
        "Scene 2: Show the dashboard snapshot when your tool steps in",
        `Scene 3: Close with ${goalKit.ctas[0]}`,
      ],
      success: goalKit.successSignals[0] ?? "Reach lift",
    },
    {
      title: `${secondPlatform} Authority Thread`,
      platform: secondPlatform,
      format: "Document carousel",
      hook: `Frame the core narrative: “How we turned chaotic signals into a ${trigger.toLowerCase()} engine.”`,
      beats: [
        "Slide 1: Market tension headline",
        "Slides 2-4: Step-by-step framework",
        "Slide 5: Call-to-action with scheduling link",
      ],
      success: goalKit.successSignals[1] ?? "High-intent traffic",
    },
    {
      title: "Creator Collaboration",
      platform: thirdPlatform,
      format: "Duet challenge",
      hook: "Invite operators to share their wildest customer signal screenshot and tag your handle.",
      beats: [
        "Kickoff clip with energetic intro",
        "Feature top submissions in stitches",
        "Reward winners with spotlight reel",
      ],
      success: goalKit.successSignals[2] ?? "Share velocity",
    },
    {
      title: "Proof Stack Spotlight",
      platform: heroPlatform,
      format: "Case-study mini doc",
      hook: `Tell the story through the customer’s voice to highlight ${proofDriver.toLowerCase()}.`,
      beats: [
        "Cold open with customer quote",
        "Reveal metric before/after",
        "Close with next-step CTA",
      ],
      success: goalKit.successSignals[3] ?? "Follower lift",
    },
    {
      title: "Evergreen Playbook Drop",
      platform: secondPlatform,
      format: "Newsletter + carousel",
      hook: `Package the top lessons from the campaign with a cheat sheet and invite replies for personalized audits.`,
      beats: [
        "Intro: campaign headline win",
        "Section: top-performing creative",
        "CTA: book the deep-dive session",
      ],
      success: "Leads captured",
    },
  ];
}

function createCampaignMoments(
  inputs: CampaignInputs,
  goalKit: GoalKit,
  platforms: PlatformBlueprint[]
): CampaignMoment[] {
  const heroPlatform = platforms[0]?.label ?? "Instagram";
  const secondPlatform = platforms[1]?.label ?? "LinkedIn";
  return [
    {
      title: "Signal Launch Day",
      description: `Kick off with a synchronized drop across ${heroPlatform} and owned email announcing ${inputs.brandName}'s new narrative.`,
      activation: `${heroPlatform} hero video + ${secondPlatform} manifesto post + partner amplification.`,
      metric: goalKit.successSignals[0] ?? "Reach",
    },
    {
      title: "Operator Takeover Week",
      description: "Feature power users running the playbook via live sessions, stitches, and carousel spotlights.",
      activation: "Creator collabs, LinkedIn audio event, stitched reactions.",
      metric: goalKit.successSignals[2] ?? "Share velocity",
    },
    {
      title: "Proof Summit",
      description: "Bundle outcomes into a downloadable playbook and invite the community to unlock exclusive access.",
      activation: "YouTube premiere + gated PDF + nurture emails.",
      metric: goalKit.successSignals[3] ?? "Follower lift",
    },
  ];
}

function buildMeasurementPlan(
  goalKit: GoalKit,
  tier: BudgetTier
): MeasurementItem[] {
  const cadenceMap: Record<BudgetTier, string[]> = {
    lean: ["Daily pulse", "Weekly retro", "Bi-weekly insights", "Monthly roll-up"],
    steady: ["Daily pulse", "Weekly retro", "Weekly insights", "Monthly leadership drop"],
    aggressive: ["Twice daily pulse", "Weekly growth council", "Weekly insights", "Monthly exec report"],
  };
  const cadence = cadenceMap[tier];
  return goalKit.successSignals.map((label, index) => ({
    label,
    cadence: cadence[Math.min(index, cadence.length - 1)],
    notes: goalKit.momentumPlays[index % goalKit.momentumPlays.length],
    target:
      tier === "aggressive"
        ? "Stretch +40% over baseline"
        : tier === "steady"
        ? "Grow +25% over baseline"
        : "Grow +15% over baseline",
  }));
}

function buildAutomationStack(
  platforms: PlatformBlueprint[],
  inputs: CampaignInputs
): string[] {
  const base = new Set<string>([
    "Notion HQ board to orchestrate weekly drops",
    "Figma template kit for fast-turn creative",
    "Airtable sprint tracker connected to analytics",
    "Zapier workflow piping form fills into Slack alerts",
    `Gong or Fathom clips library to pull narrative soundbites for ${inputs.brandName}`,
  ]);
  platforms.forEach((platform) => {
    platform.automation.forEach((tool) => base.add(`${platform.label}: ${tool}`));
  });
  return Array.from(base);
}

type CampaignPlan = {
  persona: Persona;
  goalKit: GoalKit;
  budgetTier: BudgetTier;
  tagline: string;
  positioning: string;
  storyline: string;
  contentPillars: ContentPillar[];
  platformBlueprint: PlatformBlueprint[];
  weeklySprints: WeeklySprint[];
  contentIdeas: ContentIdea[];
  campaignMoments: CampaignMoment[];
  measurement: MeasurementItem[];
  automationStack: string[];
};

function generatePlan(inputs: CampaignInputs): CampaignPlan {
  const persona = matchPersona(inputs.audience);
  const goalKit = GOAL_LIBRARY[inputs.goal];
  const budgetTier = getBudgetTier(inputs.budget);
  const platformBlueprint = inputs.selectedPlatforms.map((key) =>
    createPlatformBlueprint(key, inputs, goalKit, budgetTier)
  );
  const tagline = generateTagline(inputs, goalKit, persona);
  const positioning = buildPositioning(inputs, persona);
  const storyline = generateStoryline(goalKit, inputs.tone);
  const contentPillars = createContentPillars(inputs, persona, goalKit);
  const weeklySprints = createWeeklySprints(inputs, goalKit, persona, platformBlueprint);
  const contentIdeas = createContentIdeas(inputs, persona, goalKit, platformBlueprint);
  const campaignMoments = createCampaignMoments(inputs, goalKit, platformBlueprint);
  const measurement = buildMeasurementPlan(goalKit, budgetTier);
  const automationStack = buildAutomationStack(platformBlueprint, inputs);

  return {
    persona,
    goalKit,
    budgetTier,
    tagline,
    positioning,
    storyline,
    contentPillars,
    platformBlueprint,
    weeklySprints,
    contentIdeas,
    campaignMoments,
    measurement,
    automationStack,
  };
}

const badgeStyles: Record<BudgetTier, string> = {
  lean: "bg-amber-100 text-amber-700 border border-amber-300",
  steady: "bg-sky-100 text-sky-700 border border-sky-300",
  aggressive: "bg-emerald-100 text-emerald-700 border border-emerald-300",
};

export default function MarketingAgent() {
  const [inputs, setInputs] = useState<CampaignInputs>(DEFAULT_INPUTS);

  const campaign = useMemo(() => generatePlan(inputs), [inputs]);

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-24 pt-16 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.11),_transparent_65%)]" />
        <div className="gridlines absolute inset-0" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="glass-panel relative overflow-hidden rounded-3xl border border-white/60 p-10 shadow-lg">
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-gradient-to-br from-sky-100/80 via-indigo-100/70 to-transparent lg:block" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                Social Marketing Agent
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                Launch multi-channel momentum in minutes
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Feed in your brand context and instantly receive a full-funnel social playbook with persona intelligence, content pillars, platform cadences, and measurement rhythms tuned for modern growth teams.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
              <span className="text-xs uppercase tracking-wide text-slate-400">Current mission</span>
              <span>{campaign.goalKit.title}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[campaign.budgetTier]}`}>
                {campaign.budgetTier.charAt(0).toUpperCase() + campaign.budgetTier.slice(1)} budget mode
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
          <section className="flex flex-col gap-6">
            <div className="pro-card relative overflow-hidden p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400" />
              <h2 className="text-xl font-semibold text-slate-900">Brand DNA</h2>
              <p className="mt-2 text-sm text-slate-500">
                Adapt the plan by tailoring these inputs. Updates sync instantly across the playbook.
              </p>
              <div className="mt-4 flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Brand name
                  <input
                    value={inputs.brandName}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, brandName: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Core offering
                  <textarea
                    value={inputs.offering}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, offering: event.target.value }))
                    }
                    rows={3}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Differentiation
                  <textarea
                    value={inputs.differentiation}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, differentiation: event.target.value }))
                    }
                    rows={2}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Target audience
                  <textarea
                    value={inputs.audience}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, audience: event.target.value }))
                    }
                    rows={2}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Tone of voice
                  <input
                    value={inputs.tone}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, tone: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </label>
              </div>
            </div>

            <div className="pro-card p-7">
              <h2 className="text-xl font-semibold text-slate-900">Mission settings</h2>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Primary goal</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {GOAL_OPTIONS.map((option) => {
                      const isActive = inputs.goal === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() =>
                            setInputs((prev) => ({ ...prev, goal: option.key }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "border-sky-500 bg-sky-100 text-sky-700 shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Budget intensity</span>
                    <span className="text-slate-500">{inputs.budget}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={inputs.budget}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, budget: Number(event.target.value) }))
                    }
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Adjust to increase cadence, experiments, and partner activations.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Campaign length (weeks)</span>
                    <span className="text-slate-500">{inputs.campaignLength}</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={10}
                    step={1}
                    value={inputs.campaignLength}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        campaignLength: Number(event.target.value),
                      }))
                    }
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Determines sprint count and key campaign beats.
                  </p>
                </div>
              </div>
            </div>

            <div className="pro-card p-7">
              <h2 className="text-xl font-semibold text-slate-900">Channel stack</h2>
              <p className="mt-2 text-sm text-slate-500">
                Toggle the platforms to shape channel-specific cadences.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PLATFORM_ORDER.map((key) => {
                  const config = PLATFORM_LIBRARY[key];
                  const isSelected = inputs.selectedPlatforms.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setInputs((prev) => {
                          const exists = prev.selectedPlatforms.includes(key);
                          if (exists && prev.selectedPlatforms.length === 1) {
                            return prev; // keep at least one channel active
                          }
                          return {
                            ...prev,
                            selectedPlatforms: exists
                              ? prev.selectedPlatforms.filter((item) => item !== key)
                              : [...prev.selectedPlatforms, key],
                          };
                        })
                      }
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "border-transparent text-white shadow-lg"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                      style={
                        isSelected
                          ? { background: config.accent }
                          : undefined
                      }
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: config.accent }} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="pro-card p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Persona intelligence
                  </span>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {campaign.persona.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    {campaign.persona.description}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <p className="font-semibold text-slate-700">Vibe</p>
                  <p>{campaign.persona.vibe}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Pain points
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {campaign.persona.painPoints.map((item) => (
                      <li key={item} className="rounded-xl bg-slate-100 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Buying triggers
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {campaign.persona.triggers.map((item) => (
                      <li key={item} className="rounded-xl bg-slate-100 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Channel habits
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {campaign.persona.channelHabits.map((item) => (
                      <li key={item} className="rounded-xl bg-slate-100 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pro-card p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Campaign narrative</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Align the team around this storyline before producing assets.
                  </p>
                </div>
                <div className="rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {campaign.goalKit.title}
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-700">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600">Tagline</h3>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{campaign.tagline}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600">Positioning</h3>
                  <p className="mt-1 text-sm text-slate-700">{campaign.positioning}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600">Storyline</h3>
                  <p className="mt-1 text-sm text-slate-700">{campaign.storyline}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {campaign.contentPillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{pillar.purpose}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Proof</p>
                    <p className="text-sm text-slate-600">{pillar.proof}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Formats</p>
                    <ul className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                      {pillar.formats.map((format) => (
                        <li key={format} className="rounded-full bg-slate-100 px-3 py-1">
                          {format}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">Channel blueprint</h2>
                <p className="text-sm text-slate-500">
                  Cadence and hero moves tailored to each platform.
                </p>
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {campaign.platformBlueprint.map((platform) => (
                  <div
                    key={platform.key}
                    className="relative flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span
                      className="inline-flex w-max items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: platform.accent }}
                    >
                      <span className="h-2 w-2 rounded-full bg-white" />
                      {platform.label}
                    </span>
                    <p className="text-sm text-slate-600">{platform.summary}</p>
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-400">Cadence</h3>
                      <p className="text-sm text-slate-700">{platform.cadence}</p>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-400">Prime posting windows</h3>
                      <p className="text-sm text-slate-700">{platform.bestTimes.join(", ")}</p>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-400">Hero play</h3>
                      <p className="text-sm text-slate-700">{platform.heroAngle}</p>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-400">Formats</h3>
                      <ul className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        {platform.recommendedContent.map((item) => (
                          <li key={item} className="rounded-full bg-slate-100 px-3 py-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-400">Pro tip</h3>
                      <p className="text-sm text-slate-700">{platform.proTip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">Sprint timeline</h2>
                <p className="text-sm text-slate-500">
                  Use this as the backbone for weekly standups.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {campaign.weeklySprints.map((sprint) => (
                  <div
                    key={sprint.week}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        W{sprint.week}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{sprint.theme}</p>
                        <p className="text-xs text-slate-500">{sprint.focus}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                      {sprint.deliverables.map((deliverable) => (
                        <span key={deliverable} className="rounded-full bg-slate-100 px-3 py-1">
                          {deliverable}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">Optimize: {sprint.optimization}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <h2 className="text-2xl font-semibold text-slate-900">High-impact content plays</h2>
              <p className="mt-2 text-sm text-slate-600">
                Blend these ideas into production cycles to compound momentum.
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {campaign.contentIdeas.map((idea) => (
                  <div key={idea.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {idea.platform}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {idea.format}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{idea.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{idea.hook}</p>
                    <ul className="mt-3 space-y-1 text-xs text-slate-500">
                      {idea.beats.map((beat) => (
                        <li key={beat} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                          <span>{beat}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-500">
                      Success: {idea.success}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Signature campaign moments</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {campaign.campaignMoments.map((moment) => (
                  <div key={moment.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">{moment.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{moment.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Activation</p>
                    <p className="text-sm text-slate-600">{moment.activation}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-500">
                      Measure: {moment.metric}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">Measurement rhythm</h2>
                <p className="text-sm text-slate-500">
                  Layer these into your ops cadence so insights stay actionable.
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {campaign.measurement.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.cadence}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.notes}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-500">
                      Target: {item.target}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Automation + ops stack</h2>
              <p className="mt-2 text-sm text-slate-600">
                Plug these systems in to keep the campaign flowing while the team sleeps.
              </p>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {campaign.automationStack.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
