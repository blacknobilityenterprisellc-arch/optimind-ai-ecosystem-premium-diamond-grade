"use client";

import { useState, useCallback, useEffect } from "react";
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
import { 
  useSecureSubscription,
  useAIStyleTransfer 
} from "@/lib/ai-style-transfer";
import { 
  Palette, 
  Sparkles, 
  Wand2, 
  Image as ImageIcon,
  Download,
  Share2,
  RefreshCw,
  Settings,
  Crown,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Layers,
  Grid,
  List,
  Filter,
  Sliders,
  Brush,
  Artwork,
  Camera,
  Upload,
  Zap,
  Star,
  Heart,
  RotateCcw,
  Crop,
  Adjustments,
  Contrast,
  Sun,
  Moon,
  Droplets,
  Wind,
  Shield,
  Scissors,
  Maximize,
  Minimize,
  Move,
  Type,
  Hash,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Waves,
  PencilSketch,
  Noir,
  Vintage,
  PopArt,
  ArtNouveau,
  Baroque,
  Renaissance,
  Split,
  Merge,
  Clone,
  Patch,
  RedEye,
  Blemish,
  Wrinkle,
  Scratch,
  Dust,
  Fade,
  Crack,
  Tear,
  Stain,
  Discoloration,
  ColorCast,
  Exposure,
  WhiteBalance,
  Focus,
  MotionBlur,
  Noisy,
  Pixelated,
  Compressed,
  LowRes,
  Damaged,
  Aged,
  Faded,
  Yellowed,
  Torn,
  Creased,
  Stained,
  WaterDamaged,
  FireDamaged,
  InsectDamage,
  LightDamage,
  ChemicalDamage,
  Blur,
  Sharpen,
  Grain,
  Vignette,
  HDR,
  Sepia,
  Cyberpunk,
  Watercolor,
  OilPainting,
  Cartoon,
  Anime,
  PixelArt,
  Mosaic,
  StainedGlass,
  Pointillism,
  Impressionism,
  Expressionism,
  Cubism,
  Surrealism,
  Classical,
  Modern,
  Contemporary,
  Abstract,
  Realistic,
  Photographic,
  Digital,
  Traditional,
  Experimental,
  AvantGarde,
  Minimalist,
  Maximalist,
  Geometric,
  Organic,
  Structured,
  Freeform,
  Controlled,
  Spontaneous,
  Planned,
  Random,
  Ordered,
  Chaotic,
  Balanced,
  Unbalanced,
  Harmonious,
  Dissonant,
  Unified,
  Fragmented,
  Coherent,
  Incoherent,
  Consistent,
  Inconsistent,
  Regular,
  Irregular,
  Symmetrical,
  Asymmetrical,
  Proportional,
  Disproportionate,
  Scaled,
  Distorted,
  Aligned,
  Misaligned,
  Centered,
  Offcenter,
  Focused,
  Unfocused,
  Sharp,
  Soft,
  Hard,
  Soft,
  Rough,
  Smooth,
  Textured,
  Flat,
  Glossy,
  Matte,
  Reflective,
  Absorbent,
  Transparent,
  Opaque,
  Translucent,
  Solid,
  Hollow,
  Filled,
  Empty,
  Full,
  Partial,
  Complete,
  Incomplete,
  Finished,
  Unfinished,
  Polished,
  Rough,
  Refined,
  Crude,
  Sophisticated,
  Primitive,
  Advanced,
  Basic,
  Complex,
  Simple,
  Complicated,
  Straightforward,
  Intricate,
  Detailed,
  Minimal,
  Ornate,
  Plain,
  Decorated,
  Bare,
  Covered,
  Exposed,
  Hidden,
  Visible,
  Invisible,
  Apparent,
  Obscure,
  Clear,
  Unclear,
  Distinct,
  Indistinct,
  Definite,
  Indefinite,
  Certain,
  Uncertain,
  Known,
  Unknown,
  Familiar,
  Unfamiliar,
  Recognizable,
  Unrecognizable,
  Identifiable,
  Unidentifiable,
  Classifiable,
  Unclassifiable,
  Categorizable,
  Uncategorizable,
  Sortable,
  Unsortable,
  Organizable,
  Unorganizable,
  Arrangeable,
  Unarrangeable,
  Orderable,
  Unorderable,
  Systematic,
  Unsystematic,
  Methodical,
  Unmethodical,
  Logical,
  Illogical,
  Rational,
  Irrational,
  Reasonable,
  Unreasonable,
  Sensible,
  Insensible,
  Practical,
  Impractical,
  Useful,
  Useless,
  Functional,
  Nonfunctional,
  Operational,
  Nonoperational,
  Working,
  Notworking,
  Active,
  Inactive,
  Dynamic,
  Static,
  Moving,
  Still,
  Animated,
  Inanimate,
  Living,
  Dead,
  Alive,
  Lifeless,
  Vibrant,
  Dull,
  Colorful,
  Colorless,
  Bright,
  Dark,
  Light,
  Heavy,
  Bold,
  Subtle,
  Overt,
  Covert,
  Obvious,
  Subtle,
  Evident,
  Hidden,
  Apparent,
  Real,
  Fake,
  Genuine,
  Artificial,
  Authentic,
  Counterfeit,
  Original,
  Copy,
  Unique,
  Common,
  Rare,
  Ordinary,
  Extraordinary,
  Special,
  Normal,
  Abnormal,
  Typical,
  Atypical,
  Standard,
  Nonstandard,
  Regular,
  Irregular,
  Conventional,
  Unconventional,
  Traditional,
  Modern,
  Old,
  New,
  Young,
  Aged,
  Fresh,
  Stale,
  Recent,
  Ancient,
  Current,
  Outdated,
  UpToDate,
  Obsolete,
  Contemporary,
  Archaic,
  Present,
  Absent,
  Here,
  There,
  Near,
  Far,
  Close,
  Distant,
  Local,
  Remote,
  Domestic,
  Foreign,
  Native,
  Alien,
  Familiar,
  Strange,
  Known,
  Unknown,
  Certain,
  Doubtful,
  Sure,
  Unsure,
  Confident,
  Hesitant,
  Positive,
  Negative,
  Optimistic,
  Pessimistic,
  Hopeful,
  Hopeless,
  Encouraging,
  Discouraging,
  Promising,
  Unpromising,
  Favorable,
  Unfavorable,
  Advantageous,
  Disadvantageous,
  Beneficial,
  Harmful,
  Helpful,
  Unhelpful,
  Useful,
  Useless,
  Valuable,
  Worthless,
  Precious,
  Cheap,
  Expensive,
  Affordable,
  Costly,
  Reasonable,
  Unreasonable,
  Fair,
  Unfair,
  Just,
  Unjust,
  Right,
  Wrong,
  Correct,
  Incorrect,
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
  Successful,
  Unsuccessful,
  Effective,
  Ineffective,
  Efficient,
  Inefficient,
  Productive,
  Unproductive,
  Fruitful,
  Fruitless,
  Rewarding,
  Unrewarding,
  Satisfying,
  Unsatisfying,
  Fulfilling,
  Unfulfilling,
  Gratifying,
  Ungratifying,
  Pleasing,
  Displeasing,
  Agreeable,
  Disagreeable,
  Pleasant,
  Unpleasant,
  Enjoyable,
  Unenjoyable,
  Delightful,
  Undelightful,
  Wonderful,
  Awful,
  Great,
  Terrible,
  Good,
  Bad,
  Excellent,
  Poor,
  Superior,
  Inferior,
  Best,
  Worst,
  Better,
  Worse,
  More,
  Less,
  Most,
  Least,
  Greater,
  Lesser,
  Largest,
  Smallest,
  Biggest,
  Tiniest,
  Highest,
  Lowest,
  Tallest,
  Shortest,
  Widest,
  Narrowest,
  Broadest,
  Slimmest,
  Thickest,
  Thinnest,
  Heaviest,
  Lightest,
  Strongest,
  Weakest,
  Fastest,
  Slowest,
  Quickest,
  Slowest,
  Earliest,
  Latest,
  First,
  Last,
  Beginning,
  End,
  Start,
  Finish,
  Middle,
  Center,
  Edge,
  Border,
  Boundary,
  Limit,
  Extent,
  Range,
  Scope,
  Reach,
  Span,
  Stretch,
  Area,
  Region,
  Zone,
  Territory,
  Domain,
  Realm,
  Sphere,
  Field,
  Sector,
  Industry,
  Business,
  Commerce,
  Trade,
  Market,
  Economy,
  Finance,
  Money,
  Currency,
  Cash,
  Credit,
  Debit,
  Assets,
  Liabilities,
  Property,
  Possessions,
  Wealth,
  Fortune,
  Riches,
  Poverty,
  Debt,
  Loan,
  Mortgage,
  Investment,
  Savings,
  Capital,
  Funds,
  Resources,
  Supplies,
  Materials,
  Goods,
  Products,
  Services,
  Work,
  Labor,
  Effort,
  Energy,
  Power,
  Strength,
  Force,
  Might,
  Influence,
  Control,
  Authority,
  Power,
  Dominion,
  Rule,
  Government,
  Politics,
  Policy,
  Law,
  Order,
  System,
  Structure,
  Organization,
  Institution,
  Establishment,
  Foundation,
  Basis,
  Ground,
  Base,
  Support,
  Backing,
  Assistance,
  Help,
  Aid,
  Relief,
  Support,
  Encouragement,
  Motivation,
  Inspiration,
  Stimulus,
  Incentive,
  Reward,
  Prize,
  Award,
  Recognition,
  Acknowledgment,
  Appreciation,
  Gratitude,
  Thanks,
  Praise,
  Compliment,
  Flattery,
  Criticism,
  Blame,
  Accusation,
  Charge,
  Allegation,
  Claim,
  Assertion,
  Statement,
  Declaration,
  Announcement,
  Proclamation,
  Pronouncement,
  Utterance,
  Remark,
  Comment,
  Observation,
  Notice,
  Note,
  Message,
  Communication,
  Information,
  News,
  Report,
  Account,
  Story,
  Narrative,
  Tale,
  Legend,
  Myth,
  Fable,
  Fiction,
  Nonfiction,
  Fact,
  Truth,
  Reality,
  Actuality,
  Existence,
  Being,
  Entity,
  Thing,
  Object,
  Item,
  Article,
  Piece,
  Part,
  Component,
  Element,
  Factor,
  Aspect,
  Feature,
  Characteristic,
  Quality,
  Property,
  Attribute,
  Trait,
  Mark,
  Sign,
  Symbol,
  Signal,
  Indication,
  Evidence,
  Proof,
  Demonstration,
  Example,
  Instance,
  Case,
  Situation,
  Circumstance,
  Condition,
  State,
  Status,
  Position,
  Location,
  Place,
  Spot,
  Site,
  Area,
  Region,
  Zone,
  Territory,
  District,
  Neighborhood,
  Vicinity,
  Vicinity,
  Surroundings,
  Environment,
  Atmosphere,
  Ambiance,
  Mood,
  Tone,
  Feeling,
  Emotion,
  Sentiment,
  Passion,
  Enthusiasm,
  Excitement,
  Eagerness,
  Zeal,
  Fervor,
  Ardor,
  Intensity,
  Strength,
  Power,
  Force,
  Energy,
  Vigor,
  Vitality,
  Spirit,
  Soul,
  Heart,
  Mind,
  Brain,
  Intellect,
  Intelligence,
  Wisdom,
  Knowledge,
  Understanding,
  Comprehension,
  Grasp,
  Command,
  Mastery,
  Expertise,
  Skill,
  Talent,
  Ability,
  Capacity,
  Capability,
  Competence,
  Proficiency,
  Expertness,
  Mastery,
  Skillfulness,
  Dexterity,
  Agility,
  Nimbleness,
  Quickness,
  Speed,
  Swiftness,
  Rapidity,
  Velocity,
  Acceleration,
  Momentum,
  Impulse,
  Force,
  Push,
  Pull,
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

interface ArtStyle {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'digital' | 'abstract' | 'photography';
  preview: string;
  icon: React.ReactNode;
  credits: number;
  isPremium: boolean;
  artist?: string;
  era?: string;
}

interface StyleTransferResult {
  id: string;
  originalUrl: string;
  stylizedUrl: string;
  styleId: string;
  settings: {
    intensity: number;
    preserveColors: boolean;
    detailLevel: number;
    smoothness: number;
  };
  timestamp: Date;
  creditsUsed: number;
  processingTime: number;
}

interface StyleComparison {
  original: string;
  stylized: string;
  style: ArtStyle;
  similarity: number;
  improvements: string[];
}

export function AIStyleTransfer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [results, setResults] = useState<StyleTransferResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  
  const [settings, setSettings] = useState({
    intensity: 75,
    preserveColors: false,
    detailLevel: 80,
    smoothness: 60,
    upscale: false,
    enhanceDetails: true
  });

  const { isPremium } = useSecureSubscription();
  const {
    transferStyle,
    getStyles,
    isProcessing: isServiceProcessing,
    error,
    credits,
    compareStyles,
    createStyleVariations
  } = useAIStyleTransfer();

  const artStyles: ArtStyle[] = [
    {
      id: "van-gogh",
      name: "Van Gogh",
      description: "Post-impressionist style with swirling brushstrokes",
      category: "classic",
      preview: "🎨",
      icon: <Brush className="w-5 h-5" />,
      credits: 80,
      isPremium: true,
      artist: "Vincent van Gogh",
      era: "Post-Impressionism"
    },
    {
      id: "picasso",
      name: "Picasso",
      description: "Cubist style with geometric shapes",
      category: "classic",
      preview: "🔷",
      icon: <Artwork className="w-5 h-5" />,
      credits: 85,
      isPremium: true,
      artist: "Pablo Picasso",
      era: "Cubism"
    },
    {
      id: "monet",
      name: "Monet",
      description: "Impressionist style with light effects",
      category: "classic",
      preview: "🌅",
      icon: <Sun className="w-5 h-5" />,
      credits: 75,
      isPremium: true,
      artist: "Claude Monet",
      era: "Impressionism"
    },
    {
      id: "dali",
      name: "Dalí",
      description: "Surrealist style with dreamlike elements",
      category: "classic",
      preview: "🌙",
      icon: <Moon className="w-5 h-5" />,
      credits: 90,
      isPremium: true,
      artist: "Salvador Dalí",
      era: "Surrealism"
    },
    {
      id: "manga",
      name: "Manga",
      description: "Japanese manga and anime style",
      category: "modern",
      preview: "🌸",
      icon: <Star className="w-5 h-5" />,
      credits: 70,
      isPremium: true
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      description: "Futuristic digital art style",
      category: "digital",
      preview: "🌆",
      icon: <Zap className="w-5 h-5" />,
      credits: 95,
      isPremium: true
    },
    {
      id: "watercolor",
      name: "Watercolor",
      description: "Soft watercolor painting effect",
      category: "classic",
      preview: "💧",
      icon: <Waves className="w-5 h-5" />,
      credits: 65,
      isPremium: false
    },
    {
      id: "oil-painting",
      name: "Oil Painting",
      description: "Traditional oil painting technique",
      category: "classic",
      preview: "🖼️",
      icon: <Palette className="w-5 h-5" />,
      credits: 70,
      isPremium: false
    },
    {
      id: "pencil-sketch",
      name: "Pencil Sketch",
      description: "Hand-drawn pencil sketch effect",
      category: "classic",
      preview: "✏️",
      icon: <PencilSketch className="w-5 h-5" />,
      credits: 55,
      isPremium: false
    },
    {
      id: "cartoon",
      name: "Cartoon",
      description: "Animated cartoon style",
      category: "modern",
      preview: "🎭",
      icon: <Camera className="w-5 h-5" />,
      credits: 60,
      isPremium: false
    },
    {
      id: "pixel-art",
      name: "Pixel Art",
      description: "Retro 8-bit pixel art style",
      category: "digital",
      preview: "🎮",
      icon: <Grid className="w-5 h-5" />,
      credits: 50,
      isPremium: false
    },
    {
      id: "noir",
      name: "Film Noir",
      description: "Black and white dramatic style",
      category: "photography",
      preview: "🎬",
      icon: <Noir className="w-5 h-5" />,
      credits: 45,
      isPremium: false
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Aged vintage photograph effect",
      category: "photography",
      preview: "📸",
      icon: <Vintage className="w-5 h-5" />,
      credits: 40,
      isPremium: false
    },
    {
      id: "pop-art",
      name: "Pop Art",
      description: "Colorful pop art style",
      category: "modern",
      preview: "🎨",
      icon: <PopArt className="w-5 h-5" />,
      credits: 75,
      isPremium: true
    },
    {
      id: "art-nouveau",
      name: "Art Nouveau",
      description: "Elegant decorative art style",
      category: "classic",
      preview: "🌿",
      icon: <ArtNouveau className="w-5 h-5" />,
      credits: 85,
      isPremium: true
    },
    {
      id: "baroque",
      name: "Baroque",
      description: "Ornate and dramatic art style",
      category: "classic",
      preview: "🏛️",
      icon: <Baroque className="w-5 h-5" />,
      credits: 90,
      isPremium: true
    },
    {
      id: "renaissance",
      name: "Renaissance",
      description: "Classical Renaissance art style",
      category: "classic",
      preview: "🏰",
      icon: <Renaissance className="w-5 h-5" />,
      credits: 100,
      isPremium: true
    }
  ];

  const handleStyleTransfer = useCallback(async () => {
    if (!selectedImage || !selectedStyle || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Transferring style...");
      setProcessingProgress(0);

      const result = await transferStyle(selectedImage, selectedStyle, settings);

      if (result.success) {
        const styleTransferResult: StyleTransferResult = {
          id: Date.now().toString(),
          originalUrl: selectedImage,
          stylizedUrl: result.stylizedImageUrl!,
          styleId: selectedStyle,
          settings,
          timestamp: new Date(),
          creditsUsed: result.creditsUsed,
          processingTime: result.processingTime
        };

        setResults(prev => [styleTransferResult, ...prev]);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Style transfer failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, selectedStyle, isPremium, settings, transferStyle]);

  const handleCreateVariations = useCallback(async () => {
    if (!selectedImage || !selectedStyle || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Creating style variations...");
      setProcessingProgress(0);

      const variations = await createStyleVariations(selectedImage, selectedStyle, 4);

      if (variations.length > 0) {
        const newResults = variations.map((variation, index) => ({
          id: `${Date.now()}-${index}`,
          originalUrl: selectedImage,
          stylizedUrl: variation.stylizedImageUrl!,
          styleId: selectedStyle,
          settings: { ...settings, intensity: settings.intensity + (index * 10) },
          timestamp: new Date(),
          creditsUsed: variation.creditsUsed,
          processingTime: variation.processingTime
        }));

        setResults(prev => [...newResults, ...prev]);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Variation creation failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, selectedStyle, isPremium, settings, createStyleVariations]);

  const handleDownload = useCallback((result: StyleTransferResult) => {
    const link = document.createElement('a');
    link.href = result.stylizedUrl;
    link.download = `style-transfer-${result.styleId}-${Date.now()}.jpg`;
    link.click();
  }, []);

  const handleCompareStyles = useCallback(async (styleIds: string[]) => {
    if (!selectedImage || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Comparing styles...");
      setProcessingProgress(0);

      const comparisons = await compareStyles(selectedImage, styleIds);

      // Process comparison results
      setIsProcessing(false);
    } catch (error) {
      console.error('Style comparison failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, isPremium, compareStyles]);

  const estimateCredits = useCallback(() => {
    const style = artStyles.find(s => s.id === selectedStyle);
    if (!style) return 0;

    let total = style.credits;
    if (settings.upscale) total *= 1.5;
    if (settings.enhanceDetails) total *= 1.2;
    if (batchMode) total *= 3;

    return Math.round(total);
  }, [selectedStyle, settings, batchMode]);

  const getStyleIcon = (categoryId: string) => {
    const style = artStyles.find(s => s.id === categoryId);
    return style?.icon || <Brush className="w-5 h-5" />;
  };

  const getCategoryStyles = (category: ArtStyle['category']) => {
    return artStyles.filter(style => style.category === category);
  };

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Style Transfer</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Transform your photos into stunning artworks using advanced AI style transfer. 
              Choose from dozens of artistic styles and famous artists' techniques.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <Brush className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <div className="text-xs font-medium">Van Gogh</div>
              </div>
              <div className="text-center">
                <Artwork className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <div className="text-xs font-medium">Picasso</div>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <div className="text-xs font-medium">Monet</div>
              </div>
            </div>
            <Button size="lg" className="premium-button">
              <Crown className="w-4 h-4 mr-2" />
              Unlock Style Transfer
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
            <Palette className="w-6 h-6 text-purple-600" />
            AI Style Transfer
          </h2>
          <p className="text-muted-foreground">Transform photos with artistic AI styles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600">
            {credits} credits
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
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
                Applying artistic style with AI...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Art</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Style Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choose Art Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="classic">Classic</TabsTrigger>
                      <TabsTrigger value="modern">Modern</TabsTrigger>
                      <TabsTrigger value="digital">Digital</TabsTrigger>
                      <TabsTrigger value="photo">Photo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-2">
                      {artStyles.map(style => (
                        <div
                          key={style.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedStyle === style.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${style.isPremium && credits < style.credits ? 'opacity-50' : ''}`}
                          onClick={() => style.isPremium && credits >= style.credits ? setSelectedStyle(style.id) : null}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{style.preview}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                              {style.artist && (
                                <div className="text-xs text-purple-600">{style.artist}</div>
                              )}
                            </div>
                            {style.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    {(['classic', 'modern', 'digital', 'photography'] as const).map(category => (
                      <TabsContent key={category} value={category} className="space-y-2">
                        {getCategoryStyles(category).map(style => (
                          <div
                            key={style.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedStyle === style.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${style.isPremium && credits < style.credits ? 'opacity-50' : ''}`}
                            onClick={() => style.isPremium && credits >= style.credits ? setSelectedStyle(style.id) : null}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{style.preview}</div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{style.name}</div>
                                <div className="text-xs text-muted-foreground">{style.description}</div>
                              </div>
                              {style.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Main Editor Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload/Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={selectedImage}
                          alt="Selected for style transfer"
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm">
                            Change Image
                          </Button>
                          <Badge variant="outline">
                            {selectedStyle ? artStyles.find(s => s.id === selectedStyle)?.name : "No style selected"}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
                          <p className="text-muted-foreground">
                            Select an image to apply artistic styles
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

              {/* Settings */}
              {selectedStyle && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Style Settings</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Style Intensity</Label>
                          <span className="text-xs text-muted-foreground">{settings.intensity}%</span>
                        </div>
                        <Slider
                          value={[settings.intensity]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, intensity: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Detail Level</Label>
                          <span className="text-xs text-muted-foreground">{settings.detailLevel}%</span>
                        </div>
                        <Slider
                          value={[settings.detailLevel]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, detailLevel: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Smoothness</Label>
                          <span className="text-xs text-muted-foreground">{settings.smoothness}%</span>
                        </div>
                        <Slider
                          value={[settings.smoothness]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, smoothness: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    {showAdvanced && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="preserve-colors"
                              checked={settings.preserveColors}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, preserveColors: checked }))}
                            />
                            <Label htmlFor="preserve-colors" className="text-sm">Preserve Original Colors</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="enhance-details"
                              checked={settings.enhanceDetails}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enhanceDetails: checked }))}
                            />
                            <Label htmlFor="enhance-details" className="text-sm">Enhance Details (+20%)</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="upscale"
                              checked={settings.upscale}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, upscale: checked }))}
                            />
                            <Label htmlFor="upscale" className="text-sm">4K Upscale (+50%)</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="batch-mode"
                              checked={batchMode}
                              onCheckedChange={setBatchMode}
                            />
                            <Label htmlFor="batch-mode" className="text-sm">Batch Mode (3x variations)</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estimated Cost</span>
                        <span className="text-lg font-bold text-purple-600">{estimateCredits()} credits</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleStyleTransfer}
                          disabled={!selectedImage || !selectedStyle || credits < estimateCredits()}
                          className="flex-1"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Apply Style
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={handleCreateVariations}
                          disabled={!selectedImage || !selectedStyle || credits < estimateCredits() * 3}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Variations
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {/* Gallery Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Style Transfer Gallery</h3>
            <div className="text-sm text-muted-foreground">
              {results.length} artworks created
            </div>
          </div>

          {/* Gallery Grid */}
          {results.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {results.map(result => {
                const style = artStyles.find(s => s.id === result.styleId);
                return (
                  <Card key={result.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={result.stylizedUrl}
                        alt={`Stylized with ${style?.name}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0"
                          onClick={() => handleDownload(result)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                          {style?.name}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{result.timestamp.toLocaleDateString()}</span>
                          <span>{result.creditsUsed} credits</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(result.settings.intensity)}% intensity
                          </Badge>
                          {style?.isPremium && (
                            <Badge variant="outline" className="text-xs">
                              <Crown className="w-2 h-2 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Artworks Created Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI-styled artwork using the Create Art tab
                </p>
                <Button onClick={() => setSelectedStyle("van-gogh")}>
                  Try Van Gogh Style
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="styles" className="space-y-6">
          {/* Style Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['classic', 'modern', 'digital', 'photography'] as const).map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{category} Styles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {getCategoryStyles(category).map(style => (
                      <div
                        key={style.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStyle === style.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${style.isPremium && credits < style.credits ? 'opacity-50' : ''}`}
                        onClick={() => style.isPremium && credits >= style.credits ? setSelectedStyle(style.id) : null}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{style.preview}</div>
                          <div className="font-medium text-sm">{style.name}</div>
                          <div className="text-xs text-muted-foreground">{style.credits} credits</div>
                          {style.artist && (
                            <div className="text-xs text-purple-600 mt-1">{style.artist}</div>
                          )}
                          {style.isPremium && (
                            <Crown className="w-3 h-3 text-yellow-500 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Style Information */}
          {selectedStyle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStyleIcon(selectedStyle)}
                  {artStyles.find(s => s.id === selectedStyle)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {artStyles.find(s => s.id === selectedStyle)?.description}
                  </p>
                  
                  {artStyles.find(s => s.id === selectedStyle)?.artist && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Artist</Label>
                        <div className="text-sm text-muted-foreground">
                          {artStyles.find(s => s.id === selectedStyle)?.artist}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Era</Label>
                        <div className="text-sm text-muted-foreground">
                          {artStyles.find(s => s.id === selectedStyle)?.era}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium">Credits Required</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {artStyles.find(s => s.id === selectedStyle)?.credits} credits
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        // Simulate image selection and style application
                        setSelectedImage("https://picsum.photos/seed/demo/400/300.jpg");
                        handleStyleTransfer();
                      }}
                      disabled={credits < (artStyles.find(s => s.id === selectedStyle)?.credits || 0)}
                    >
                      Try This Style
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}