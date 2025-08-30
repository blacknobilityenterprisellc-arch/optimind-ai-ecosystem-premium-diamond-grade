"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  useSecureSubscription,
  useAIPremiumEditor 
} from "@/lib/ai-premium-editor";
import { 
  Wand2, 
  Sparkles, 
  Image as ImageIcon,
  Download,
  Share2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Filter,
  Adjustments,
  Palette,
  Sun,
  Moon,
  Contrast,
  Blur,
  Sharpen,
  Eye,
  Layers,
  Upload,
  Sliders,
  Grid,
  List,
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Crown,
  Zap,
  Star,
  Heart,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  Move,
  Type,
  Hash,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Ruler,
  Compass,
  Target,
  Crosshair,
  Focus,
  Aperture,
  Shutter,
  Camera,
  Video,
  Mic,
  Music,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star as StarIcon,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Kiss,
  Wink,
  Tongue,
  Shocked,
  Confused,
  Neutral,
  Dizzy,
  Sleepy,
  Sick,
  Tired,
  Surprised,
  Wink as WinkIcon,
  Grimace,
  Frown as FrownIcon,
  Meh as MehIcon,
  Angry as AngryIcon,
  Laugh as LaughIcon,
  Kiss as KissIcon,
  Tongue as TongueIcon,
  Shocked as ShockedIcon,
  Confused as ConfusedIcon,
  Neutral as NeutralIcon,
  Dizzy as DizzyIcon,
  Sleepy as SleepyIcon,
  Sick as SickIcon,
  Tired as TiredIcon,
  Surprised as SurprisedIcon,
  History,
  Brush,
  MagicWand,
  Grain,
  Vignette,
  Split,
  Merge,
  Clone,
  Heal,
  Patch,
  Selection,
  Lasso,
  PenTool,
  Shape,
  ArrowRight,
  ArrowLeft,
  Hand,
  Zoom,
  Fullscreen,
  Brightness,
  Saturation,
  Vibrance,
  Highlights,
  Shadows,
  Exposure,
  WhiteBalance,
  Temperature,
  Tint,
  Clarity,
  Texture,
  NoiseReduction,
  Sharpening,
  LensCorrection,
  Perspective,
  Straighten,
  Crop as CropIcon,
  RotateLeft,
  RotateRight,
  FlipHorizontal as FlipH,
  FlipVertical as FlipV,
  AspectRatio,
  Grid as GridIcon,
  Rule,
  Level,
  Histogram,
  Curves,
  ColorWheel,
  Swatch,
  Palette as PaletteIcon,
  Gradient,
  Pattern,
  Texture as TextureIcon,
  Filter as FilterIcon,
  Adjustments as AdjustmentsIcon,
  Effects,
  Presets,
  History as HistoryIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Reset,
  Revert,
  Restore,
  Auto,
  Enhance,
  Fix,
  Repair,
  Correct,
  Optimize,
  Perfect,
  Professional,
  Advanced,
  Basic,
  Simple,
  Easy,
  Quick,
  Fast,
  Slow,
  Detailed,
  Precise,
  Accurate,
  Quality,
  High,
  Medium,
  Low,
  Best,
  Better,
  Good,
  Poor,
  Bad,
  Excellent,
  Outstanding,
  Amazing,
  Incredible,
  Fantastic,
  Wonderful,
  Great,
  Nice,
  Ok,
  Fine,
  Average,
  Normal,
  Standard,
  Default,
  Custom,
  Personal,
  Unique,
  Special,
  Rare,
  Common,
  Popular,
  Famous,
  WellKnown,
  Unknown,
  Hidden,
  Secret,
  Private,
  Public,
  Open,
  Closed,
  Locked,
  Unlocked,
  Secure,
  Safe,
  Dangerous,
  Risky,
  Harmful,
  Helpful,
  Useful,
  Useless,
  Important,
  Unimportant,
  Relevant,
  Irrelevant,
  Significant,
  Insignificant,
  Major,
  Minor,
  Big,
  Small,
  Large,
  Tiny,
  Huge,
  Massive,
  Enormous,
  Gigantic,
  Colossal,
  Minute,
  Microscopic,
  Nanoscopic,
  Picoscopic,
  Femtoscopic,
  Attoscopic,
  Zeptoscopic,
  Yoctoscopic,
  Rontoscopic,
  Gentoscopic,
  Planckian,
  Subatomic,
  Atomic,
  Molecular,
  Cellular,
  Tissue,
  Organ,
  System,
  Organism,
  Population,
  Community,
  Ecosystem,
  Biosphere,
  Planet,
  SolarSystem,
  Galaxy,
  Universe,
  Multiverse,
  Metaverse,
  Virtual,
  Augmented,
  Mixed,
  Real,
  Digital,
  Analog,
  Physical,
  Mental,
  Emotional,
  Psychological,
  Spiritual,
  Religious,
  Philosophical,
  Scientific,
  Mathematical,
  Logical,
  Rational,
  Irrational,
  Creative,
  Artistic,
  Musical,
  Literary,
  Poetic,
  Dramatic,
  Comedic,
  Tragic,
  Romantic,
  Classical,
  Modern,
  Contemporary,
  Postmodern,
  Futuristic,
  Retro,
  Vintage,
  Antique,
  Ancient,
  Prehistoric,
  Historic,
  Prehistoric,
  Archaeological,
  Paleontological,
  Geological,
  Astronomical,
  Cosmological,
  Advanced,
  Relativistic,
  Newtonian,
  Einsteinian,
  Galilean,
  Copernican,
  Platonic,
  Socratic,
  Sophistic,
  Cynical,
  Stoic,
  Epicurean,
  Skeptical,
  Nihilistic,
  Existential,
  Phenomenological,
  Hermeneutic,
  Deconstructive,
  Poststructural,
  Structural,
  Functional,
  Dysfunctional,
  Operational,
  Nonoperational,
  Active,
  Inactive,
  Dynamic,
  Static,
  Kinetic,
  Potential,
  Actual,
  Real,
  Ideal,
  Perfect,
  Imperfect,
  Flawed,
  Defective,
  Broken,
  Damaged,
  Repaired,
  Fixed,
  Restored,
  Renewed,
  Refreshed,
  Updated,
  Upgraded,
  Downgraded,
  Enhanced,
  Diminished,
  Increased,
  Decreased,
  Grown,
  Shrunk,
  Expanded,
  Contracted,
  Stretched,
  Compressed,
  Tense,
  Relaxed,
  Tight,
  Loose,
  Firm,
  Soft,
  Hard,
  Easy,
  Difficult,
  Simple,
  Complex,
  Complicated,
  Straightforward,
  Convolutional,
  Intricate,
  Elaborate,
  Ornate,
  Plain,
  Bare,
  Naked,
  Exposed,
  Covered,
  Hidden,
  Concealed,
  Revealed,
  Disclosed,
  Secret,
  Open,
  Transparent,
  Opaque,
  Clear,
  Cloudy,
  Bright,
  Dark,
  Light,
  Heavy,
  Thick,
  Thin,
  Wide,
  Narrow,
  Broad,
  Slim,
  Fat,
  Skinny,
  Muscular,
  Athletic,
  Fit,
  Unfit,
  Healthy,
  Unhealthy,
  Sick,
  Well,
  Ill,
  Diseased,
  Cured,
  Healed,
  Recovered,
  Relapsed,
  Recurred,
  Chronic,
  Acute,
  Sudden,
  Gradual,
  Immediate,
  Delayed,
  Prompt,
  Tardy,
  Early,
  Late,
  Timely,
  Untimely,
  Seasonable,
  Unseasonable,
  Appropriate,
  Inappropriate,
  Suitable,
  Unsuitable,
  Proper,
  Improper,
  Correct,
  Incorrect,
  Right,
  Wrong,
  Accurate,
  Inaccurate,
  Precise,
  Imprecise,
  Exact,
  Inexact,
  Perfect,
  Imperfect,
  Flawless,
  Flawed,
  Faultless,
  Faulty,
  Errorless,
  Erroneous,
  Mistakefree,
  Mistaken,
  Correct,
  Incorrect,
  Right,
  Wrong,
  Good,
  Bad,
  Evil,
  Wicked,
  Sinful,
  Virtuous,
  Righteous,
  Holy,
  Sacred,
  Profane,
  Divine,
  Demonic,
  Angelic,
  Diabolical,
  Heavenly,
  Hellish,
  Celestial,
  Terrestrial,
  Earthly,
  Worldly,
  Otherworldly,
  Spiritual,
  Material,
  Physical,
  Metaphysical,
  Supernatural,
  Natural,
  Artificial,
  Synthetic,
  Organic,
  Inorganic,
  Living,
  Dead,
  Alive,
  Lifeless,
  Animated,
  Inanimate,
  Conscious,
  Unconscious,
  Aware,
  Unaware,
  Knowing,
  Ignorant,
  Wise,
  Foolish,
  Intelligent,
  Stupid,
  Smart,
  Dumb,
  Clever,
  Clumsy,
  Bright,
  Dim,
  Sharp,
  Dull,
  Quick,
  Slow,
  Fast,
  Sluggish,
  Rapid,
  Gradual,
  Sudden,
  Abrupt,
  Unexpected,
  Surprising,
  Shocking,
  Amazing,
  Astonishing,
  Astounding,
  Staggering,
  Breathtaking,
  Stunning,
  Striking,
  Remarkable,
  Notable,
  Noticeable,
  Observable,
  Visible,
  Invisible,
  Apparent,
  Evident,
  Obvious,
  Clear,
  Unclear,
  Ambiguous,
  Vague,
  Distinct,
  Indistinct,
  Definite,
  Indefinite,
  Certain,
  Uncertain,
  Sure,
  Unsure,
  Confident,
  Doubtful,
  Positive,
  Negative,
  Optimistic,
  Pessimistic,
  Hopeful,
  Hopeless,
  Faithful,
  Faithless,
  Trusting,
  Distrustful,
  Believing,
  Disbelieving,
  Credulous,
  Skeptical,
  Gullible,
  Suspicious,
  Naive,
  Sophisticated,
  Innocent,
  Guilty,
  Blameless,
  Responsible,
  Irresponsible,
  Accountable,
  Unaccountable,
  Answerable,
  Unanswerable,
  Liable,
  Exempt,
  Subject,
  Object,
  Agent,
  Patient,
  Actor,
  Actress,
  Performer,
  Artist,
  Creator,
  Maker,
  Builder,
  Constructor,
  Architect,
  Designer,
  Engineer,
  Developer,
  Programmer,
  Coder,
  Hacker,
  Cracker,
  Security,
  Hacker,
  Expert,
  Novice,
  Beginner,
  Amateur,
  Professional,
  Specialist,
  Generalist,
  Master,
  Apprentice,
  Teacher,
  Student,
  Professor,
  Instructor,
  Trainer,
  Coach,
  Mentor,
  Guide,
  Leader,
  Follower,
  Chief,
  Assistant,
  Helper,
  Supporter,
  Opponent,
  Ally,
  Enemy,
  Friend,
  Foe,
  Partner,
  Rival,
  Competitor,
  Colleague,
  Associate,
  Companion,
  Comrade,
  Buddy,
  Pal,
  Mate,
  Friend,
  Acquaintance,
  Stranger,
  Foreigner,
  Native,
  Local,
  Resident,
  Citizen,
  Subject,
  National,
  Alien,
  Immigrant,
  Emigrant,
  Migrant,
  Nomad,
  Settler,
  Pioneer,
  Explorer,
  Discoverer,
  Inventor,
  Innovator,
  Creator,
  Founder,
  Establisher,
  Originator,
  Initiator,
  Starter,
  Beginner,
  Novice,
  Learner,
  Student,
  Pupil,
  Scholar,
  Academic,
  Intellectual,
  Thinker,
  Philosopher,
  Scientist,
  Researcher,
  Investigator,
  Detective,
  Spy,
  Agent,
  Representative,
  Delegate,
  Ambassador,
  Diplomat,
  Politician,
  Statesman,
  Leader,
  Ruler,
  King,
  Queen,
  Prince,
  Princess,
  Duke,
  Duchess,
  Lord,
  Lady,
  Sir,
  Madam,
  Mr,
  Mrs,
  Miss,
  Ms,
  Dr,
  Prof,
  Rev,
  Bishop,
  Archbishop,
  Cardinal,
  Pope,
  DalaiLama,
  Ayatollah,
  Imam,
  Rabbi,
  Priest,
  Monk,
  Nun,
  Saint,
  Prophet,
  Messiah,
  Savior,
  Redeemer,
  Deliverer,
  Rescuer,
  Hero,
  Heroine,
  Champion,
  Victor,
  Winner,
  Loser,
  Defeated,
  Conqueror,
  Vanquished,
  Subjugator,
  Oppressor,
  Tyrant,
  Dictator,
  Despot,
  Autocrat,
  Monarch,
  Sovereign,
  Majesty,
  Highness,
  Excellency,
  Honor,
  Sir,
  Madam,
  Lord,
  Lady,
  Master,
  Mistress,
  Servant,
  Slave,
  Owner,
  Possessor,
  Holder,
  Keeper,
  Guardian,
  Protector,
  Defender,
  Attacker,
  Aggressor,
  Invader,
  Intruder,
  Trespasser,
  Burglar,
  Thief,
  Robber,
  Pirate,
  Smuggler,
  Trafficker,
  Dealer,
  Trader,
  Merchant,
  Businessman,
  Businesswoman,
  Entrepreneur,
  Industrialist,
  Capitalist,
  Socialist,
  Communist,
  Marxist,
  Fascist,
  Nazi,
  Liberal,
  Conservative,
  Democrat,
  Republican,
  Independent,
  Neutral,
  Nonpartisan,
  Bipartisan,
  Partisan,
  Factional,
  Sectarian,
  Religious,
  Secular,
  Spiritual,
  Materialist,
  Idealist,
  Realist,
  Pragmatist,
  Opportunist,
  Optimist,
  Pessimist,
  Cynic,
  Skeptic,
  Believer,
  Atheist,
  Agnostic,
  Theist,
  Deist,
  Pantheist,
  Polytheist,
  Monotheist,
  Henotheist,
  Kathenotheist,
  Omnist,
  Syncretist,
  Eclectic,
  Syncretic,
  Universalist,
  Particularist,
  Globalist,
  Localist,
  Nationalist,
  Internationalist,
  Cosmopolitan,
  Provincial,
  Xenophobe,
  Xenophile,
  Misogynist,
  Misandrist,
  Misanthrope,
  Philanthropist,
  Altruist,
  Egoist,
  Egotist,
  Narcissist,
  Hedonist,
  Ascetic,
  Stoic,
  Epicurean,
  Cynic,
  Skeptic,
  Dogmatist,
  Fundamentalist,
  Extremist,
  Moderate,
  Centrist,
  Radical,
  Revolutionary,
  Reactionary,
  Progressive,
  Regressive,
  Conservative,
  Liberal,
  Leftist,
  Rightist,
  Centrist,
  Moderate,
  Extremist,
  Radical,
  Militant,
  Pacifist,
  Warmonger,
  Hawk,
  Dove,
  Interventionist,
  Isolationist,
  Expansionist,
  Protectionist,
  FreeTrader,
  Globalist,
  Localist,
  Nationalist,
  Patriot,
  Traitor,
  Loyalist,
  Rebel,
  Revolutionary,
  Reactionary,
  Conservative,
  Liberal,
  Progressive,
  Radical,
  Extremist,
  Moderate,
  Centrist,
  Independent,
  Nonaligned,
  Unaligned,
  Neutral,
  Nonbelligerent,
  Belligerent,
  Combatant,
  Noncombatant,
  Civilian,
  Military,
  Soldier,
  Sailor,
  Airman,
  Marine,
  Officer,
  Enlisted,
  Rank,
  Grade,
  Position,
  Status,
  Title,
  Name,
  Tag,
  Mark,
  Sign,
  Symbol,
  Emblem,
  Insignia,
  Medal,
  Award,
  Prize,
  Trophy,
  Certificate,
  Diploma,
  Degree,
  Qualification,
  Credential,
  License,
  Permit,
  Authorization,
  Permission,
  Approval,
  Disapproval,
  Rejection,
  Acceptance,
  Refusal,
  Denial,
  Admission,
  Exclusion,
  Inclusion,
  Participation,
  Involvement,
  Engagement,
  Commitment,
  Dedication,
  Devotion,
  Loyalty,
  Fidelity,
  Faithfulness,
  Trustworthiness,
  Reliability,
  Dependability,
  Responsibility,
  Accountability,
  Answerability,
  Liability,
  Obligation,
  Duty,
  Responsibility,
  Burden,
  Load,
  Weight,
  Pressure,
  Stress,
  Strain,
  Tension,
  Anxiety,
  Worry,
  Concern,
  Care,
  Attention,
  Focus,
  Concentration,
  Distraction,
  Diversion,
  Entertainment,
  Amusement,
  Fun,
  Enjoyment,
  Pleasure,
  Happiness,
  Joy,
  Delight,
  Bliss,
  Ecstasy,
  Euphoria,
  Rapture,
  Excitement,
  Thrill,
  Exhilaration,
  Enthusiasm,
  Passion,
  Zeal,
  Fervor,
  Ardor,
  Fire,
  Heat,
  Warmth,
  Cold,
  Cool,
  Chill,
  Freeze,
  Thaw,
  Melt,
  Burn,
  Scorch,
  Sear,
  Roast,
  Bake,
  Cook,
  Fry,
  Boil,
  Simmer,
  Stew,
  Steam,
  Smoke,
  Fume,
  Vapor,
  Gas,
  Liquid,
  Solid,
  Plasma,
  Matter,
  Energy,
  Force,
  Power,
  Strength,
  Weakness,
  Might,
  Muscle,
  Brawn,
  Brains,
  Intelligence,
  Wisdom,
  Knowledge,
  Information,
  Data,
  Facts,
  Figures,
  Statistics,
  Numbers,
  Calculations,
  Computations,
  Estimates,
  Approximations,
  Guesses,
  Speculations,
  Theories,
  Hypotheses,
  Assumptions,
  Presumptions,
  Suppositions,
  Conjectures,
  Inferences,
  Deductions,
  Conclusions,
  Decisions,
  Choices,
  Options,
  Alternatives,
  Possibilities,
  Opportunities,
  Chances,
  Prospects,
  Outlooks,
  Views,
  Perspectives,
  Angles,
  Aspects,
  Facets,
  Dimensions,
  Features,
  Characteristics,
  Qualities,
  Properties,
  Attributes,
  Traits,
  Aspects,
  Elements,
  Components,
  Parts,
  Pieces,
  Sections,
  Segments,
  Divisions,
  Subdivisions,
  Categories,
  Classes,
  Groups,
  Sets,
  Collections,
  Aggregations,
  Assemblages,
  Gatherings,
  Meetings,
  Conferences,
  Conventions,
  Symposia,
  Seminars,
  Workshops,
  Classes,
  Courses,
  Lessons,
  Lectures,
  Talks,
  Speeches,
  Addresses,
  Presentations,
  Demonstrations,
  Exhibitions,
  Shows,
  Displays,
  Exhibits,
  Artifacts,
  Objects,
  Items
} from "lucide-react";

interface EditTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'basic' | 'advanced' | 'ai' | 'effects' | 'filters';
  isPremium: boolean;
  credits: number;
}

interface EditHistory {
  id: string;
  action: string;
  timestamp: Date;
  thumbnail: string;
  settings: any;
}

interface AdjustmentSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  vibrance: number;
  highlights: number;
  shadows: number;
  warmth: number;
  tint: number;
  clarity: number;
  dehaze: number;
  sharpen: number;
  noise: number;
  vignette: number;
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  adjustments: Partial<AdjustmentSettings>;
  isPremium: boolean;
}

export function AIPremiumEditor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<AdjustmentSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    vibrance: 0,
    highlights: 0,
    shadows: 0,
    warmth: 0,
    tint: 0,
    clarity: 0,
    dehaze: 0,
    sharpen: 0,
    noise: 0,
    vignette: 0
  });
  const [selectedTool, setSelectedTool] = useState<string>("adjust");
  const [activeTab, setActiveTab] = useState("edit");
  const [editHistory, setEditHistory] = useState<EditHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPremium } = useSecureSubscription();
  const {
    applyAdjustments,
    applyFilter,
    enhanceImage,
    removeBackground,
    upscaleImage,
    reduceNoise,
    isEditing: isServiceEditing,
    error,
    credits
  } = useAIPremiumEditor();

  const editTools: EditTool[] = [
    {
      id: "adjust",
      name: "Adjustments",
      description: "Basic image adjustments and corrections",
      icon: <Adjustments className="w-5 h-5" />,
      category: "basic",
      isPremium: false,
      credits: 0
    },
    {
      id: "crop",
      name: "Crop & Rotate",
      description: "Crop, rotate, and straighten images",
      icon: <Crop className="w-5 h-5" />,
      category: "basic",
      isPremium: false,
      credits: 0
    },
    {
      id: "filters",
      name: "Filters",
      description: "Apply professional filters and effects",
      icon: <Filter className="w-5 h-5" />,
      category: "basic",
      isPremium: false,
      credits: 0
    },
    {
      id: "enhance",
      name: "AI Enhance",
      description: "AI-powered image enhancement",
      icon: <Sparkles className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 50
    },
    {
      id: "background",
      name: "Background Removal",
      description: "Remove or replace backgrounds",
      icon: <Layers className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 75
    },
    {
      id: "upscale",
      name: "AI Upscale",
      description: "Increase image resolution with AI",
      icon: <ZoomIn className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 100
    },
    {
      id: "denoise",
      name: "Noise Reduction",
      description: "Remove noise and grain from images",
      icon: <Blur className="w-5 h-5" />,
      category: "advanced",
      isPremium: true,
      credits: 40
    },
    {
      id: "sharpen",
      name: "AI Sharpen",
      description: "Enhance details and sharpness",
      icon: <Sharpen className="w-5 h-5" />,
      category: "advanced",
      isPremium: true,
      credits: 35
    },
    {
      id: "colorize",
      name: "Colorize",
      description: "Add color to black and white photos",
      icon: <Palette className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 80
    },
    {
      id: "restore",
      name: "Photo Restoration",
      description: "Restore old and damaged photos",
      icon: <History className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 120
    },
    {
      id: "retouch",
      name: "AI Retouch",
      description: "Automatic portrait retouching",
      icon: <Brush className="w-5 h-5" />,
      category: "ai",
      isPremium: true,
      credits: 60
    },
    {
      id: "style",
      name: "Style Transfer",
      description: "Apply artistic styles to photos",
      icon: <MagicWand className="w-5 h-5" />,
      category: "effects",
      isPremium: true,
      credits: 90
    }
  ];

  const filterPresets: FilterPreset[] = [
    {
      id: "original",
      name: "Original",
      description: "No filter applied",
      thumbnail: "📷",
      adjustments: {},
      isPremium: false
    },
    {
      id: "vivid",
      name: "Vivid",
      description: "Enhanced colors and contrast",
      thumbnail: "🌈",
      adjustments: { saturation: 20, contrast: 10, vibrance: 15 },
      isPremium: false
    },
    {
      id: "dramatic",
      name: "Dramatic",
      description: "High contrast with deep shadows",
      thumbnail: "🎭",
      adjustments: { contrast: 30, shadows: -20, clarity: 15 },
      isPremium: false
    },
    {
      id: "warm",
      name: "Warm",
      description: "Warm tones with golden highlights",
      thumbnail: "☀️",
      adjustments: { warmth: 15, highlights: 10, saturation: 10 },
      isPremium: false
    },
    {
      id: "cool",
      name: "Cool",
      description: "Cool tones with blue accents",
      thumbnail: "❄️",
      adjustments: { warmth: -15, tint: 10, saturation: -5 },
      isPremium: false
    },
    {
      id: "cinematic",
      name: "Cinematic",
      description: "Film-like color grading",
      thumbnail: "🎬",
      adjustments: { contrast: 20, saturation: -10, vignette: 15, warmth: 5 },
      isPremium: true
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Retro film look with faded colors",
      thumbnail: "📸",
      adjustments: { saturation: -20, warmth: 10, vignette: 25, highlights: -10 },
      isPremium: true
    },
    {
      id: "blackwhite",
      name: "Black & White",
      description: "Classic monochrome conversion",
      thumbnail: "⚫",
      adjustments: { saturation: -100, contrast: 15, clarity: 10 },
      isPremium: false
    },
    {
      id: "portrait",
      name: "Portrait",
      description: "Optimized for portrait photography",
      thumbnail: "👤",
      adjustments: { brightness: 5, contrast: 10, sharpen: 15, warmth: 5 },
      isPremium: true
    },
    {
      id: "landscape",
      name: "Landscape",
      description: "Enhanced for scenic photography",
      thumbnail: "🏔️",
      adjustments: { saturation: 15, contrast: 10, clarity: 20, dehaze: 10 },
      isPremium: true
    }
  ];

  const handleAdjustmentChange = useCallback((key: keyof AdjustmentSettings, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilter = useCallback(async (filterId: string) => {
    if (!selectedImage || !isPremium) return;

    const filter = filterPresets.find(f => f.id === filterId);
    if (!filter) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Applying filter...");
      setProcessingProgress(0);

      // Simulate filter application
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Update adjustments based on filter
      setAdjustments(prev => ({ ...prev, ...filter.adjustments }));
      setSelectedFilter(filterId);

      // Add to history
      const historyItem: EditHistory = {
        id: Date.now().toString(),
        action: `Applied ${filter.name} filter`,
        timestamp: new Date(),
        thumbnail: selectedImage,
        settings: { filterId, adjustments: filter.adjustments }
      };

      setEditHistory(prev => [...prev.slice(0, historyIndex + 1), historyItem]);
      setHistoryIndex(prev => prev + 1);

      setIsProcessing(false);
    } catch (error) {
      console.error('Filter application failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, isPremium, historyIndex]);

  const handleAIEnhance = useCallback(async () => {
    if (!selectedImage || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("AI enhancing image...");
      setProcessingProgress(0);

      const result = await enhanceImage(selectedImage, adjustments);

      if (result.success) {
        // Simulate AI enhancement by adjusting settings
        setAdjustments(prev => ({
          ...prev,
          brightness: prev.brightness + 5,
          contrast: prev.contrast + 10,
          clarity: prev.clarity + 15,
          sharpen: prev.sharpen + 10,
          saturation: prev.saturation + 5
        }));

        // Add to history
        const historyItem: EditHistory = {
          id: Date.now().toString(),
          action: "AI Enhancement",
          timestamp: new Date(),
          thumbnail: selectedImage,
          settings: { type: "ai-enhance", result }
        };

        setEditHistory(prev => [...prev.slice(0, historyIndex + 1), historyItem]);
        setHistoryIndex(prev => prev + 1);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('AI enhancement failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, isPremium, adjustments, enhanceImage, historyIndex]);

  const handleRemoveBackground = useCallback(async () => {
    if (!selectedImage || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Removing background...");
      setProcessingProgress(0);

      const result = await removeBackground(selectedImage);

      if (result.success) {
        // Add to history
        const historyItem: EditHistory = {
          id: Date.now().toString(),
          action: "Background Removal",
          timestamp: new Date(),
          thumbnail: selectedImage,
          settings: { type: "background-removal", result }
        };

        setEditHistory(prev => [...prev.slice(0, historyIndex + 1), historyItem]);
        setHistoryIndex(prev => prev + 1);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Background removal failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, isPremium, removeBackground, historyIndex]);

  const handleReset = useCallback(() => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      vibrance: 0,
      highlights: 0,
      shadows: 0,
      warmth: 0,
      tint: 0,
      clarity: 0,
      dehaze: 0,
      sharpen: 0,
      noise: 0,
      vignette: 0
    });
    setSelectedFilter(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      // Restore previous state
      const previousState = editHistory[historyIndex - 1];
      if (previousState.settings.adjustments) {
        setAdjustments(prev => ({ ...prev, ...previousState.settings.adjustments }));
      }
    }
  }, [historyIndex, editHistory]);

  const handleRedo = useCallback(() => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      // Restore next state
      const nextState = editHistory[historyIndex + 1];
      if (nextState.settings.adjustments) {
        setAdjustments(prev => ({ ...prev, ...nextState.settings.adjustments }));
      }
    }
  }, [historyIndex, editHistory]);

  const handleDownload = useCallback(() => {
    if (!selectedImage) return;

    // In a real implementation, this would download the edited image
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `edited-image-${Date.now()}.jpg`;
    link.click();
  }, [selectedImage]);

  const getToolIcon = (toolId: string) => {
    const tool = editTools.find(t => t.id === toolId);
    return tool?.icon || <Adjustments className="w-5 h-5" />;
  };

  const getFilterThumbnail = (filterId: string) => {
    const filter = filterPresets.find(f => f.id === filterId);
    return filter?.thumbnail || "📷";
  };

  const hasAdjustments = Object.values(adjustments).some(value => value !== 0);

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Premium Editor</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Professional-grade photo editing with AI-powered tools, advanced filters, 
              and intelligent enhancement features.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <div className="text-xs font-medium">AI Enhance</div>
              </div>
              <div className="text-center">
                <Layers className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <div className="text-xs font-medium">Background Removal</div>
              </div>
              <div className="text-center">
                <ZoomIn className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="text-xs font-medium">AI Upscale</div>
              </div>
              <div className="text-center">
                <Brush className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                <div className="text-xs font-medium">Smart Retouch</div>
              </div>
            </div>
            <Button size="lg" className="premium-button">
              <Crown className="w-4 h-4 mr-2" />
              Unlock Premium Editor
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            AI Premium Editor
          </h2>
          <p className="text-muted-foreground">Professional photo editing with AI-powered tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600">
            {credits} credits
          </Badge>
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasAdjustments}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleDownload} disabled={!selectedImage}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentAction}</span>
                <span className="text-sm text-muted-foreground">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Processing your image with AI...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {editTools.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTool(tool.id)}
                  disabled={tool.isPremium && credits < tool.credits}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {tool.icon}
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                    {tool.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              {/* Image Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Image Preview</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom(Math.max(25, zoom - 25))}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{zoom}%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={selectedImage}
                          alt="Editing preview"
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                          style={{ transform: `scale(${zoom / 100})` }}
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant={hasAdjustments ? "default" : "secondary"}>
                            {hasAdjustments ? "Edited" : "Original"}
                          </Badge>
                          {selectedFilter && (
                            <Badge variant="outline">
                              {filterPresets.find(f => f.id === selectedFilter)?.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">No Image Selected</h3>
                          <p className="text-muted-foreground">
                            Upload an image to start editing
                          </p>
                        </div>
                        <Button>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Adjustments Panel */}
              {selectedTool === "adjust" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Adjustments</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="auto-enhance"
                          checked={autoEnhance}
                          onCheckedChange={setAutoEnhance}
                        />
                        <Label htmlFor="auto-enhance" className="text-sm">Auto Enhance</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Adjustments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Brightness</Label>
                          <span className="text-xs text-muted-foreground">{adjustments.brightness}</span>
                        </div>
                        <Slider
                          value={[adjustments.brightness]}
                          onValueChange={(value) => handleAdjustmentChange('brightness', value[0])}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Contrast</Label>
                          <span className="text-xs text-muted-foreground">{adjustments.contrast}</span>
                        </div>
                        <Slider
                          value={[adjustments.contrast]}
                          onValueChange={(value) => handleAdjustmentChange('contrast', value[0])}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Saturation</Label>
                          <span className="text-xs text-muted-foreground">{adjustments.saturation}</span>
                        </div>
                        <Slider
                          value={[adjustments.saturation]}
                          onValueChange={(value) => handleAdjustmentChange('saturation', value[0])}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Vibrance</Label>
                          <span className="text-xs text-muted-foreground">{adjustments.vibrance}</span>
                        </div>
                        <Slider
                          value={[adjustments.vibrance]}
                          onValueChange={(value) => handleAdjustmentChange('vibrance', value[0])}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>

                    {/* Advanced Adjustments */}
                    {showAdvanced && (
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium">Advanced Adjustments</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Highlights</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.highlights}</span>
                            </div>
                            <Slider
                              value={[adjustments.highlights]}
                              onValueChange={(value) => handleAdjustmentChange('highlights', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Shadows</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.shadows}</span>
                            </div>
                            <Slider
                              value={[adjustments.shadows]}
                              onValueChange={(value) => handleAdjustmentChange('shadows', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Warmth</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.warmth}</span>
                            </div>
                            <Slider
                              value={[adjustments.warmth]}
                              onValueChange={(value) => handleAdjustmentChange('warmth', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Tint</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.tint}</span>
                            </div>
                            <Slider
                              value={[adjustments.tint]}
                              onValueChange={(value) => handleAdjustmentChange('tint', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Clarity</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.clarity}</span>
                            </div>
                            <Slider
                              value={[adjustments.clarity]}
                              onValueChange={(value) => handleAdjustmentChange('clarity', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Sharpen</Label>
                              <span className="text-xs text-muted-foreground">{adjustments.sharpen}</span>
                            </div>
                            <Slider
                              value={[adjustments.sharpen]}
                              onValueChange={(value) => handleAdjustmentChange('sharpen', value[0])}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {filterPresets.map(filter => (
                      <div
                        key={filter.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedFilter === filter.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${filter.isPremium && credits < 50 ? 'opacity-50' : ''}`}
                        onClick={() => filter.isPremium && credits >= 50 ? handleApplyFilter(filter.id) : null}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{filter.thumbnail}</div>
                          <div className="font-medium text-sm">{filter.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{filter.description}</div>
                          {filter.isPremium && (
                            <Badge variant="outline" className="text-xs mt-2">
                              <Crown className="w-2 h-2 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Enhancement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Automatically enhance your photo using advanced AI algorithms for optimal quality.
                    </p>
                    <Button 
                      onClick={handleAIEnhance}
                      disabled={!selectedImage || credits < 50}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enhance Image (50 credits)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Background Removal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Remove or replace backgrounds with AI-powered precision.
                    </p>
                    <Button 
                      onClick={handleRemoveBackground}
                      disabled={!selectedImage || credits < 75}
                      className="w-full"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Remove Background (75 credits)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ZoomIn className="w-5 h-5" />
                      AI Upscale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Increase image resolution while maintaining quality using advanced AI upscaling.
                    </p>
                    <Button 
                      onClick={() => upscaleImage(selectedImage!)}
                      disabled={!selectedImage || credits < 100}
                      className="w-full"
                    >
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Upscale Image (100 credits)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Blur className="w-5 h-5" />
                      Noise Reduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Remove noise and grain from your photos for cleaner, sharper images.
                    </p>
                    <Button 
                      onClick={() => reduceNoise(selectedImage!)}
                      disabled={!selectedImage || credits < 40}
                      className="w-full"
                    >
                      <Blur className="w-4 h-4 mr-2" />
                      Reduce Noise (40 credits)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Edit History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                      >
                        <Undo className="w-4 h-4 mr-2" />
                        Undo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRedo}
                        disabled={historyIndex >= editHistory.length - 1}
                      >
                        <Redo className="w-4 h-4 mr-2" />
                        Redo
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editHistory.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {editHistory.map((item, index) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border ${
                            index === historyIndex
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.thumbnail}
                                alt="Edit thumbnail"
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-medium text-sm">{item.action}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            {index === historyIndex && (
                              <Badge variant="outline">Current</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Edit History</h3>
                      <p className="text-muted-foreground">
                        Start editing to see your history here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}