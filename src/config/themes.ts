export type SurpriseType = 'birthday' | 'wedding' | 'love';

export interface ThemeConfig {
  type: SurpriseType;
  route: string;
  name: string;
  emoji: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  cardGlassBg: string;
  badgeBg: string;
  buttonGradient: string;
  audioTrack: string; // 'birthday' | '/music/wedding.mp3' | '/music/love.mp3'

  // Step 1 Copy & Fields
  step1Title: string;
  step1Subtitle: string;
  fields: {
    primaryName: { label: string; placeholder: string };
    secondaryName?: { label: string; placeholder: string };
    senderName: { label: string; placeholder: string };
    dateLabel?: string;
    dateNotice?: string;
    extraNumberLabel?: string;
    extraNumberPlaceholder?: string;
  };

  // Step 2 Wishes Copy & Presets
  wishesTitle: string;
  wishesSubtitle: string;
  wishesLabel: string;
  wishesPresets: string[];

  // Step 3 Photos Copy
  photosTitle: string;
  photosSubtitle: string;

  // Step 4 Letter Copy & Presets
  letterTitle: string;
  letterSubtitle: string;
  letterPrompt: string;
  letterPresets: Array<{ title: string; text: string }>;

  // Viewer Copy & Dynamic Functions
  coverBadge: string;
  coverTitle: (details: any) => string;
  coverSubtitle: string;
  introTitle: (details: any) => string[];
  introSubtitle: string;
  wishesSectionTitle: string;
  wishesSectionSubtitle: string;
  wishesBadge: string;
  letterBadge: string;
  letterTitleViewer: (details: any) => string;
  finaleTitle: (details: any) => string;
  finaleMessage: (details: any) => string;
  acceptButtonText: string;
}

export const THEMES: Record<SurpriseType, ThemeConfig> = {
  birthday: {
    type: 'birthday',
    route: 'birthday',
    name: 'Birthday Surprise',
    emoji: '🎂',
    tagline: 'Personalized birthday magic with balloon pops & memories',
    bgGradient: 'from-pink-950 via-purple-950/70 to-pink-950',
    accentColor: '#f472b6',
    cardGlassBg: 'rgba(30, 27, 46, 0.7)',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    buttonGradient: 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
    audioTrack: 'birthday',

    step1Title: "Who's the birthday star? 🎂",
    step1Subtitle: "Tell us who we are celebrating so we can tailor the magic!",
    fields: {
      primaryName: { label: 'Their First Name', placeholder: 'e.g. Alex' },
      secondaryName: { label: 'Their Last Name', placeholder: 'e.g. Morgan' },
      senderName: { label: 'Your Name (Sender)', placeholder: 'e.g. Your Bestie, Sam' },
      dateLabel: 'Date of Birth (Optional)',
      dateNotice: '⏰ Midnight Countdown: If opened before their birthday, a countdown to midnight will build excitement!',
      extraNumberLabel: 'Turning Age (Optional)',
      extraNumberPlaceholder: 'e.g. 25',
    },

    wishesTitle: 'Wishes & Blessings 🎈',
    wishesSubtitle: 'Add 3 to 5 wishes. Each wish will be hidden inside a balloon!',
    wishesLabel: 'birthday wishes & blessings',
    wishesPresets: [
      'May your year ahead be overflowing with pure joy, adventures & laughter! 🌟',
      'Wishing you courage to chase your biggest dreams and win! 🚀',
      'May your heart always be warm, peaceful, and surrounded by loved ones 💛',
      "Here's to endless cups of hot coffee and zero bad days ☕✨",
      'May every goal you set this year turn into absolute magic ✨',
      'Wishing you vibrant health, glowing energy, and continuous growth 🌿',
    ],

    photosTitle: 'Photo Memories 📸',
    photosSubtitle: 'Upload up to 5 pictures to hang like fairy lights on paper strings!',

    letterTitle: 'The Birthday Letter 💌',
    letterSubtitle: 'Write a heartfelt note. It will materialize like ink appearing on paper!',
    letterPrompt: 'Dear Alex, Happy Birthday! I wanted to let you know...',
    letterPresets: [
      {
        title: '❤️ Heartfelt & Warm',
        text: "Happy Birthday! I hope today brings you as much happiness as you bring to everyone around you. Thank you for being such an extraordinary, kind, and beautiful soul. I am so grateful to have you in my life! Here's to making this year your happiest one yet! ✨",
      },
      {
        title: '🎉 Playful & Fun',
        text: "Happy Birthday legend! Another year older, wiser, and somehow still as cool as ever. May your day be filled with cake, laughter, and zero adulting responsibilities! Let's celebrate soon! 🥂",
      },
      {
        title: '🌟 Inspiring & Deep',
        text: "Happy Birthday! Looking back at everything you've accomplished this past year makes me so proud. You inspire everyone with your grace and strength. May this new chapter bring you endless growth, peace, and unforgettable adventures. 💛",
      },
    ],

    coverBadge: '✨ Birthday Surprise',
    coverTitle: (d) => `A surprise for ${d.primaryName || 'You'}`,
    coverSubtitle: 'Someone who loves you made this — just for you 💌',
    introTitle: (d) => [`HAPPY`, `BIRTHDAY`, `${(d.primaryName || 'FRIEND').toUpperCase()}!`, `🎉`],
    introSubtitle: "It's officially your day to shine ✨",
    wishesSectionTitle: 'Pop the balloons to reveal wishes! ✨',
    wishesSectionSubtitle: 'Tap any balloon below to pop it and unwrap its hidden blessing',
    wishesBadge: '🎈 Floating Blessings',
    letterBadge: '💌 Sealed Letter',
    letterTitleViewer: (d) => `A Message From ${d.senderName || 'Someone Special'} ✨`,
    finaleTitle: (d) => `HAPPY BIRTHDAY ${(d.primaryName || '').toUpperCase()}! 🎂`,
    finaleMessage: (d) => `Wishing you the happiest year yet 🎂 — from ${d.senderName || 'Someone Special'}`,
    acceptButtonText: 'Accept ✨ / Thank You 💛',
  },

  wedding: {
    type: 'wedding',
    route: 'wedding',
    name: 'Wedding Wishes',
    emoji: '💍',
    tagline: 'Elegant wedding blessings & couple memory journey',
    bgGradient: 'from-pink-950 via-rose-950/70 to-pink-950',
    accentColor: '#f43f5e',
    cardGlassBg: 'rgba(40, 20, 35, 0.7)',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    buttonGradient: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
    audioTrack: '/music/wedding.mp3',

    step1Title: "Who's getting married? 💍",
    step1Subtitle: 'Enter the names of the happy couple to customize their wedding card!',
    fields: {
      primaryName: { label: "Partner 1 / Bride's Name", placeholder: 'e.g. Emma' },
      secondaryName: { label: "Partner 2 / Groom's Name", placeholder: 'e.g. Liam' },
      senderName: { label: 'Your Name (Sender)', placeholder: 'e.g. The Johnsons, Cousin Sarah' },
      dateLabel: 'Wedding Date (Optional)',
      dateNotice: '💒 Countdown to the Big Day: Shows a countdown timer if their wedding is coming up!',
    },

    wishesTitle: 'Wedding Wishes & Blessings 🌸',
    wishesSubtitle: 'Add 3 to 5 wedding blessings for their lifelong journey together!',
    wishesLabel: 'wedding blessings',
    wishesPresets: [
      'May your love grow deeper and sweeter with every passing year 💍',
      'Wishing you a lifetime of laughter, harmony, and shared adventures 🥂',
      'May your home always be filled with warmth, grace, and endless joy 🏡✨',
      'Here to celebrating forever with your soulmate and best friend ❤️',
      'May you always find comfort and strength in each other’s arms 🌸',
      'Cheers to two beautiful souls becoming one! Wishing you eternal bliss 🌟',
    ],

    photosTitle: 'Couple & Engagement Photos 📸',
    photosSubtitle: 'Upload up to 5 photos of the couple to display on a romantic film strip!',

    letterTitle: 'The Wedding Message 💌',
    letterSubtitle: 'Write your heart-felt wedding message for the happy couple!',
    letterPrompt: 'Dear Emma & Liam, Congratulations on your beautiful wedding day...',
    letterPresets: [
      {
        title: '🥂 Heartfelt Wedding Toast',
        text: "Congratulations on your wedding day! Seeing the love and devotion you share is truly inspiring. May your marriage be blessed with endless happiness, patience, and unbreakable joy. Wishing you both a lifetime of love! 💍✨",
      },
      {
        title: '🌟 Warm Best Wishes',
        text: "Warmest congratulations to a match made in heaven! May the love you feel today only grow stronger as you build your future together. So happy to celebrate this monumental day with you both! ❤️",
      },
    ],

    coverBadge: '💍 Wedding Surprise',
    coverTitle: (d) => `A Wedding Surprise for ${d.primaryName || 'Bride'} & ${d.secondaryName || 'Groom'}`,
    coverSubtitle: 'Sending love and blessings for your magical union 🌸',
    introTitle: (d) => [`CONGRATULATIONS`, `${(d.primaryName || 'PARTNER 1').toUpperCase()}`, `&`, `${(d.secondaryName || 'PARTNER 2').toUpperCase()}!`, `💍`],
    introSubtitle: 'Two hearts, one lifelong journey of love ✨',
    wishesSectionTitle: 'Pop the balloons for wedding blessings! 🌸',
    wishesSectionSubtitle: 'Tap each balloon to unwrap a heartfelt blessing for your marriage',
    wishesBadge: '🌸 Wedding Blessings',
    letterBadge: '💌 Wedding Message',
    letterTitleViewer: (d) => `Wedding Toast From ${d.senderName || 'a Loved One'} ✨`,
    finaleTitle: (d) => `HAPPY MARRIED LIFE ${(d.primaryName || '').toUpperCase()} & ${(d.secondaryName || '').toUpperCase()}! 🥂`,
    finaleMessage: (d) => `Wishing you endless bliss & love 🥂 — from ${d.senderName || 'Your Loved Ones'}`,
    acceptButtonText: 'Accept Blessings ✨ / Thank You 💛',
  },

  love: {
    type: 'love',
    route: 'love',
    name: 'Love Letter',
    emoji: '💌',
    tagline: 'Reasons I love you & custom romantic journey',
    bgGradient: 'from-pink-900 via-rose-950 to-pink-900',
    accentColor: '#fb7185',
    cardGlassBg: 'rgba(45, 15, 30, 0.75)',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    buttonGradient: 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    audioTrack: '/music/love.mp3',

    step1Title: "Who is this love letter for? 💕",
    step1Subtitle: 'Create a sweet surprise to remind them how much they mean to you!',
    fields: {
      primaryName: { label: 'Their Name', placeholder: 'e.g. My Darling, Sophia' },
      senderName: { label: 'Your Name / Nickname', placeholder: 'e.g. Yours Always, Leo' },
      dateLabel: 'Together Since (Optional)',
      dateNotice: '💖 Memory Counter: Highlights how long you two have been creating memories together!',
    },

    wishesTitle: 'Reasons Why I Love You ❤️',
    wishesSubtitle: 'Add 3 to 5 reasons why they are your favorite person in the world!',
    wishesLabel: 'reasons I love you',
    wishesPresets: [
      'Your smile instantly brightens up even my hardest days ✨',
      'How safe, warm, and understood I feel whenever I am with you 💛',
      'Your kindness, gentle heart, and how deeply you care for others 🌸',
      'All our silly late-night talks and inside jokes that no one else gets ☕',
      'Because you inspire me to be the best version of myself every day 🚀',
      'Simply because you are YOU, and my world is infinitely better with you in it ❤️',
    ],

    photosTitle: 'Our Favorite Memories 📸',
    photosSubtitle: 'Upload up to 5 photos of you two to thread together with golden light!',

    letterTitle: 'My Love Letter 💌',
    letterSubtitle: 'Write a romantic love letter. It will reveal line by line with sparkle light!',
    letterPrompt: 'My dearest, I wanted to create something special just for you...',
    letterPresets: [
      {
        title: '❤️ Romantic & Devoted',
        text: "My love, words will never fully capture how deeply you have touched my life. Every day with you is a gift I treasure. Thank you for your warmth, your laughter, and for being my safe space. I love you more than yesterday, and less than tomorrow. Forever yours! 💕",
      },
      {
        title: '✨ Sweet & Cute',
        text: "To my absolute favorite human! Thank you for making my life so sweet, fun, and full of happiness. You are my best friend and my favorite notification. I love you to the moon and back! 🌙❤️",
      },
    ],

    coverBadge: '💕 Love Letter Surprise',
    coverTitle: (d) => `Something special just for ${d.primaryName || 'You'} 💕`,
    coverSubtitle: 'Made with all my heart, just for you 💌',
    introTitle: (d) => [`I`, `LOVE`, `YOU`, `${(d.primaryName || 'MY LOVE').toUpperCase()}!`, `❤️`],
    introSubtitle: 'You make my world infinitely brighter ✨',
    wishesSectionTitle: 'Reasons why I love you ❤️',
    wishesSectionSubtitle: 'Tap each balloon to reveal a reason why you mean the world to me',
    wishesBadge: '❤️ Reasons Why I Love You',
    letterBadge: '💌 My Love Letter',
    letterTitleViewer: (d) => `Love Letter From ${d.senderName || 'Your Love'} 💕`,
    finaleTitle: (d) => `I LOVE YOU ${(d.primaryName || '').toUpperCase()}! ❤️`,
    finaleMessage: (d) => `Always and forever 💖 — from ${d.senderName || 'Your Love'}`,
    acceptButtonText: 'I Love You Too ❤️ / Thank You 💛',
  },
};
