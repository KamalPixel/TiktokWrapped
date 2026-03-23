import { format, parseISO, getHours, getDay, eachDayOfInterval, isWeekend } from 'date-fns';
import { nb } from 'date-fns/locale';

// kategorier for å segmentere innhold basert på hashtags
const CONTENT_CATEGORIES = {
  comedy: {
    name: 'Humor & Underholdning',
    icon: '😂',
    color: '#ff0050',
    keywords: ['funny', 'comedy', 'humor', 'lol', 'meme', 'joke', 'prank', 'fail', 'laugh', 'haha', 'lmao', 'morsom', 'humor']
  },
  music: {
    name: 'Musikk & Dans',
    icon: '🎵',
    color: '#00f2ea',
    keywords: ['music', 'dance', 'song', 'singer', 'dj', 'concert', 'cover', 'remix', 'beat', 'musikk', 'dans', 'sang']
  },
  lifestyle: {
    name: 'Livsstil & Vlog',
    icon: '✨',
    color: '#bf00ff',
    keywords: ['lifestyle', 'vlog', 'day', 'life', 'routine', 'grwm', 'aesthetic', 'vibes', 'mood', 'liv', 'hverdag']
  },
  food: {
    name: 'Mat & Matlaging',
    icon: '🍕',
    color: '#ff6b00',
    keywords: ['food', 'recipe', 'cooking', 'baking', 'eat', 'restaurant', 'mukbang', 'foodie', 'chef', 'mat', 'oppskrift']
  },
  fitness: {
    name: 'Trening & Helse',
    icon: '💪',
    color: '#b8ff00',
    keywords: ['fitness', 'gym', 'workout', 'health', 'exercise', 'training', 'muscle', 'yoga', 'run', 'trening', 'helse']
  },
  beauty: {
    name: 'Skjønnhet & Mote',
    icon: '💄',
    color: '#ff69b4',
    keywords: ['beauty', 'makeup', 'skincare', 'fashion', 'style', 'ootd', 'outfit', 'hair', 'nails', 'sminke', 'mote']
  },
  gaming: {
    name: 'Gaming',
    icon: '🎮',
    color: '#9400d3',
    keywords: ['gaming', 'game', 'gamer', 'playstation', 'xbox', 'pc', 'streamer', 'esport', 'minecraft', 'fortnite', 'spill']
  },
  education: {
    name: 'Læring & Tips',
    icon: '📚',
    color: '#4169e1',
    keywords: ['learn', 'education', 'tips', 'hack', 'howto', 'tutorial', 'diy', 'facts', 'science', 'lær', 'tips', 'fakta']
  },
  pets: {
    name: 'Dyr & Kjæledyr',
    icon: '🐕',
    color: '#8b4513',
    keywords: ['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'cute', 'animals', 'hund', 'katt', 'dyr']
  },
  travel: {
    name: 'Reise & Opplevelser',
    icon: '✈️',
    color: '#20b2aa',
    keywords: ['travel', 'trip', 'vacation', 'explore', 'adventure', 'destination', 'hotel', 'flight', 'reise', 'ferie']
  }
};

export const calculateScreenTime = (viewHistory) => {
  const totalVideos = viewHistory.length;
  const avgVideoDuration = 30; // antar ca 30 sek per video
  const totalSeconds = totalVideos * avgVideoDuration;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return {
    totalVideos,
    totalSeconds,
    hours,
    minutes,
    formatted: `${hours}t ${minutes}m`,
    perDay: Math.round(totalSeconds / 365 / 60), // minutes per day average
    comparison: getScreenTimeComparison(hours)
  };
};

const getScreenTimeComparison = (hours) => {
  const comparisons = [
    { hours: 50, text: 'nok til å binge-watche hele Game of Thrones 3 ganger' },
    { hours: 100, text: 'nok til å fly rundt jorden 4 ganger' },
    { hours: 200, text: 'nok til å lære et nytt språk' },
    { hours: 300, text: 'som å jobbe fulltid i 2 måneder' },
    { hours: 500, text: 'mer enn de fleste bruker på søvn i en måned' }
  ];

  for (const comp of comparisons) {
    if (hours < comp.hours) {
      return comp.text;
    }
  }
  return 'nok til å bli TikTok-ekspert på profesjonelt nivå';
};

export const analyzeHourlyActivity = (viewHistory) => {
  const hourCounts = new Array(24).fill(0);

  viewHistory.forEach(item => {
    try {
      const date = parseISO(item.Date);
      const hour = getHours(date);
      hourCounts[hour]++;
    } catch {
      // ugyldig dato, hopp over
    }
  });

  const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
  const minHour = hourCounts.indexOf(Math.min(...hourCounts.filter(c => c > 0)));

  // Determine user type based on peak hours
  let userType = 'Dagscroller';
  if (maxHour >= 22 || maxHour < 5) {
    userType = 'Nattuglen';
  } else if (maxHour >= 5 && maxHour < 9) {
    userType = 'Morgenfuglen';
  } else if (maxHour >= 12 && maxHour < 14) {
    userType = 'Lunsjscrolleren';
  } else if (maxHour >= 17 && maxHour < 22) {
    userType = 'Kveldschilleren';
  }

  return {
    hourCounts,
    peakHour: maxHour,
    quietHour: minHour,
    userType,
    chartData: hourCounts.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      videos: count
    }))
  };
};

export const analyzeWeeklyActivity = (viewHistory) => {
  const dayCounts = new Array(7).fill(0);
  const dayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

  viewHistory.forEach(item => {
    try {
      const date = parseISO(item.Date);
      const day = getDay(date);
      dayCounts[day]++;
    } catch {
      // ugyldig dato, hopp over
    }
  });

  const maxDay = dayCounts.indexOf(Math.max(...dayCounts));

  return {
    dayCounts,
    peakDay: dayNames[maxDay],
    chartData: dayCounts.map((count, index) => ({
      day: dayNames[index],
      videos: count
    }))
  };
};

export const analyzeTopCreators = (viewHistory, limit = 10) => {
  const creatorCounts = {};

  viewHistory.forEach(item => {
    // Extract creator from URL or description
    let creator = null;

    if (item.Link) {
      const match = item.Link.match(/@([^/]+)/);
      if (match) creator = `@${match[1]}`;
    }

    if (!creator && item.VideoDescription) {
      const match = item.VideoDescription.match(/@(\w+)/);
      if (match) creator = `@${match[1]}`;
    }

    if (creator) {
      creatorCounts[creator] = (creatorCounts[creator] || 0) + 1;
    }
  });

  const sorted = Object.entries(creatorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count], index) => ({
      rank: index + 1,
      name,
      count,
      percentage: Math.round((count / viewHistory.length) * 100)
    }));

  return {
    topCreators: sorted,
    totalUniqueCreators: Object.keys(creatorCounts).length
  };
};

export const analyzeHashtags = (viewHistory, limit = 15) => {
  const hashtagCounts = {};

  viewHistory.forEach(item => {
    if (item.VideoDescription) {
      const hashtags = item.VideoDescription.match(/#\w+/g) || [];
      hashtags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        hashtagCounts[normalizedTag] = (hashtagCounts[normalizedTag] || 0) + 1;
      });
    }
  });

  const sorted = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count], index) => ({
      rank: index + 1,
      tag,
      count,
      percentage: Math.round((count / viewHistory.length) * 100)
    }));

  // Determine content personality based on top hashtags
  const topTags = sorted.slice(0, 5).map(t => t.tag.toLowerCase());
  let personality = 'Den Nysgjerrige';

  if (topTags.some(t => t.includes('comedy') || t.includes('funny') || t.includes('humor'))) {
    personality = 'Humorsansen';
  } else if (topTags.some(t => t.includes('dance') || t.includes('music'))) {
    personality = 'Dansefoten';
  } else if (topTags.some(t => t.includes('food') || t.includes('cooking') || t.includes('recipe'))) {
    personality = 'Foodien';
  } else if (topTags.some(t => t.includes('fitness') || t.includes('gym') || t.includes('workout'))) {
    personality = 'Treningsentusiasten';
  } else if (topTags.some(t => t.includes('gaming') || t.includes('game'))) {
    personality = 'Gameren';
  } else if (topTags.some(t => t.includes('fashion') || t.includes('style') || t.includes('ootd'))) {
    personality = 'Fashionista';
  }

  return {
    topHashtags: sorted,
    totalUniqueHashtags: Object.keys(hashtagCounts).length,
    personality
  };
};

export const analyzeComments = (comments) => {
  if (!comments.length) return null;

  // Find most common words (excluding common stopwords)
  const stopwords = ['og', 'i', 'på', 'er', 'det', 'en', 'et', 'som', 'til', 'med', 'for', 'the', 'a', 'an', 'is', 'this', 'that', 'to', 'of', 'and'];
  const wordCounts = {};

  comments.forEach(item => {
    if (item.Comment) {
      const words = item.Comment.toLowerCase().match(/\b\w{3,}\b/g) || [];
      words.forEach(word => {
        if (!stopwords.includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    }
  });

  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Calculate average comment length
  const avgLength = Math.round(
    comments.reduce((sum, c) => sum + (c.Comment?.length || 0), 0) / comments.length
  );

  // Determine commenter type
  let commenterType = 'Den Stille Observatøren';
  if (comments.length > 500) {
    commenterType = 'Kommentar-Kongen';
  } else if (comments.length > 200) {
    commenterType = 'Den Aktive';
  } else if (comments.length > 50) {
    commenterType = 'Den Engasjerte';
  }

  return {
    totalComments: comments.length,
    avgLength,
    topWords,
    commenterType,
    randomComments: comments
      .filter(c => c.Comment && c.Comment.length > 10)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  };
};

export const generateCalendarData = (viewHistory, year = new Date().getFullYear()) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const dayCounts = {};

  viewHistory.forEach(item => {
    try {
      const date = parseISO(item.Date);
      if (date.getFullYear() === year) {
        const key = format(date, 'yyyy-MM-dd');
        dayCounts[key] = (dayCounts[key] || 0) + 1;
      }
    } catch {
      // ugyldig dato, hopp over
    }
  });

  const maxCount = Math.max(...Object.values(dayCounts), 1);

  const calendarData = allDays.map(day => {
    const key = format(day, 'yyyy-MM-dd');
    const count = dayCounts[key] || 0;
    return {
      date: key,
      count,
      level: count === 0 ? 0 : Math.ceil((count / maxCount) * 4)
    };
  });

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  calendarData.forEach(day => {
    if (day.count > 0) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  const today = new Date();
  for (let i = calendarData.length - 1; i >= 0; i--) {
    const dayDate = parseISO(calendarData[i].date);
    if (dayDate > today) continue;

    if (calendarData[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  const mostActiveDay = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    calendarData,
    maxStreak,
    currentStreak,
    mostActiveDay: mostActiveDay ? {
      date: mostActiveDay[0],
      count: mostActiveDay[1],
      formatted: format(parseISO(mostActiveDay[0]), 'd. MMMM', { locale: nb })
    } : null,
    totalActiveDays: Object.keys(dayCounts).length
  };
};

export const segmentByTimeOfDay = (viewHistory) => {
  const segments = {
    morning: { name: 'Morgen', range: '06:00 - 12:00', icon: '🌅', count: 0, hours: [6, 7, 8, 9, 10, 11] },
    afternoon: { name: 'Ettermiddag', range: '12:00 - 18:00', icon: '☀️', count: 0, hours: [12, 13, 14, 15, 16, 17] },
    evening: { name: 'Kveld', range: '18:00 - 24:00', icon: '🌆', count: 0, hours: [18, 19, 20, 21, 22, 23] },
    night: { name: 'Natt', range: '00:00 - 06:00', icon: '🌙', count: 0, hours: [0, 1, 2, 3, 4, 5] }
  };

  const segmentData = {
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  };

  viewHistory.forEach(item => {
    try {
      const date = parseISO(item.Date);
      const hour = getHours(date);

      if (hour >= 6 && hour < 12) {
        segments.morning.count++;
        segmentData.morning.push(item);
      } else if (hour >= 12 && hour < 18) {
        segments.afternoon.count++;
        segmentData.afternoon.push(item);
      } else if (hour >= 18 && hour < 24) {
        segments.evening.count++;
        segmentData.evening.push(item);
      } else {
        segments.night.count++;
        segmentData.night.push(item);
      }
    } catch {
      // ugyldig dato, hopp over
    }
  });

  const total = viewHistory.length;
  const segmentArray = Object.entries(segments).map(([key, data]) => ({
    id: key,
    ...data,
    percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    videos: segmentData[key]
  }));

  // Find dominant segment
  const dominant = segmentArray.reduce((max, seg) => seg.count > max.count ? seg : max, segmentArray[0]);

  return {
    segments: segmentArray,
    dominant,
    total,
    insights: generateTimeInsights(dominant, segmentArray)
  };
};

const generateTimeInsights = (dominant, segments) => {
  const insights = [];

  if (dominant.id === 'night') {
    insights.push({
      type: 'warning',
      icon: '🦉',
      text: 'Du er en skikkelig nattuggle! Vurder å scrolle litt tidligere for bedre søvn.'
    });
  } else if (dominant.id === 'morning') {
    insights.push({
      type: 'positive',
      icon: '🌟',
      text: 'Imponerende! Du starter dagen med TikTok-energi.'
    });
  }

  const nightPercentage = segments.find(s => s.id === 'night')?.percentage || 0;
  if (nightPercentage > 30) {
    insights.push({
      type: 'tip',
      icon: '💤',
      text: `${nightPercentage}% av scrollingen din skjer om natten. Prøv å sette en grense!`
    });
  }

  return insights;
};

export const segmentByWeekType = (viewHistory) => {
  const weekday = { name: 'Ukedager', icon: '💼', count: 0, videos: [], avgPerDay: 0 };
  const weekend = { name: 'Helg', icon: '🎉', count: 0, videos: [], avgPerDay: 0 };

  const weekdayDays = new Set();
  const weekendDays = new Set();

  viewHistory.forEach(item => {
    try {
      const date = parseISO(item.Date);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (isWeekend(date)) {
        weekend.count++;
        weekend.videos.push(item);
        weekendDays.add(dateKey);
      } else {
        weekday.count++;
        weekday.videos.push(item);
        weekdayDays.add(dateKey);
      }
    } catch {
      // ugyldig dato, hopp over
    }
  });

  // Calculate averages
  weekday.avgPerDay = weekdayDays.size > 0 ? Math.round(weekday.count / weekdayDays.size) : 0;
  weekend.avgPerDay = weekendDays.size > 0 ? Math.round(weekend.count / weekendDays.size) : 0;

  const total = viewHistory.length;
  weekday.percentage = total > 0 ? Math.round((weekday.count / total) * 100) : 0;
  weekend.percentage = total > 0 ? Math.round((weekend.count / total) * 100) : 0;

  // Determine behavior type
  let behaviorType = 'Balansert';
  let behaviorDescription = 'Du har en jevn balanse mellom ukedager og helg.';

  const ratio = weekend.avgPerDay / (weekday.avgPerDay || 1);

  if (ratio > 2) {
    behaviorType = 'Helgekrigeren';
    behaviorDescription = 'Du slår deg virkelig løs i helgene! Dobbelt så mye scrolling.';
  } else if (ratio > 1.5) {
    behaviorType = 'Helgechilleren';
    behaviorDescription = 'Helgen er din tid for ekstra TikTok-pauser.';
  } else if (ratio < 0.5) {
    behaviorType = 'Hverdagsscrolleren';
    behaviorDescription = 'Du foretrekker å scrolle i hverdagen, kanskje som pauser fra jobb?';
  } else if (ratio < 0.75) {
    behaviorType = 'Produktiv Helg';
    behaviorDescription = 'Du holder deg opptatt i helgene - mindre skjermtid da!';
  }

  return {
    weekday,
    weekend,
    behaviorType,
    behaviorDescription,
    ratio: Math.round(ratio * 100) / 100,
    insights: generateWeekInsights(weekday, weekend, ratio)
  };
};

const generateWeekInsights = (weekday, weekend, ratio) => {
  const insights = [];

  if (weekend.avgPerDay > 100) {
    insights.push({
      type: 'info',
      icon: '📊',
      text: `I snitt ser du ${weekend.avgPerDay} videoer hver helgedag!`
    });
  }

  if (ratio > 2) {
    insights.push({
      type: 'tip',
      icon: '⚖️',
      text: 'Prøv å spre underholdningen mer utover uken for bedre balanse.'
    });
  }

  return insights;
};

export const categorizeContent = (viewHistory) => {
  const categories = {};

  Object.entries(CONTENT_CATEGORIES).forEach(([key, cat]) => {
    categories[key] = {
      ...cat,
      id: key,
      count: 0,
      videos: [],
      percentage: 0
    };
  });

  categories.other = {
    id: 'other',
    name: 'Annet',
    icon: '📱',
    color: '#666666',
    count: 0,
    videos: [],
    percentage: 0
  };

  viewHistory.forEach(item => {
    const description = (item.VideoDescription || '').toLowerCase();
    let matched = false;

    for (const [key, cat] of Object.entries(CONTENT_CATEGORIES)) {
      if (cat.keywords.some(kw => description.includes(kw))) {
        categories[key].count++;
        categories[key].videos.push(item);
        matched = true;
        break;
      }
    }

    if (!matched) {
      categories.other.count++;
      categories.other.videos.push(item);
    }
  });

  const total = viewHistory.length;

  const sortedCategories = Object.values(categories)
    .map(cat => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0
    }))
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);

  const top3 = sortedCategories.slice(0, 3);

  // Generate content personality
  const personality = generateContentPersonality(top3);

  return {
    categories: sortedCategories,
    top3,
    personality,
    totalCategorized: total - (categories.other?.count || 0),
    insights: generateContentInsights(sortedCategories)
  };
};

const generateContentPersonality = (top3) => {
  if (top3.length === 0) return { title: 'Utforskeren', description: 'Du liker litt av alt!' };

  const topCategory = top3[0];

  const personalities = {
    comedy: { title: 'Humoristen', description: 'Latter er din medisin! Du elsker å le og dele morsomme klipp.' },
    music: { title: 'Musikkelskeren', description: 'Rytmen driver deg! Dans og musikk får hjertet ditt til å slå.' },
    lifestyle: { title: 'Lifestyle-Guruen', description: 'Du er alltid på jakt etter inspirasjon til hverdagen.' },
    food: { title: 'Foodie-Entusiasten', description: 'Mat er kjærlighet! Du elsker matinspirasjon og oppskrifter.' },
    fitness: { title: 'Treningsinspiratoren', description: 'Helse og fitness er din greie. Keep grinding!' },
    beauty: { title: 'Skjønnhetseksperten', description: 'Stil og skjønnhet er din lidenskap.' },
    gaming: { title: 'Gaming-Legenden', description: 'Controller i hånd, verden i lomma. Game on!' },
    education: { title: 'Kunnskapssøkeren', description: 'Du bruker TikTok til å lære nye ting. Smart!' },
    pets: { title: 'Dyreelskeren', description: 'Søte dyr får deg til å smile hver gang.' },
    travel: { title: 'Eventyreren', description: 'Reise og opplevelser kaller på deg!' },
    other: { title: 'Utforskeren', description: 'Du har en unik smak som er vanskelig å kategorisere!' }
  };

  return personalities[topCategory.id] || personalities.other;
};

const generateContentInsights = (categories) => {
  const insights = [];

  if (categories.length > 0) {
    const topCat = categories[0];
    if (topCat.percentage > 40) {
      insights.push({
        type: 'dominant',
        icon: topCat.icon,
        text: `${topCat.name} dominerer feeden din med ${topCat.percentage}% av innholdet!`
      });
    }
  }

  // Check for diversity
  const categoriesAbove10Percent = categories.filter(c => c.percentage >= 10);
  if (categoriesAbove10Percent.length >= 4) {
    insights.push({
      type: 'positive',
      icon: '🌈',
      text: 'Du har en variert smak med mange interesser!'
    });
  }

  return insights;
};

export const generateRecommendations = (viewHistory, comments) => {
  const timeSegments = segmentByTimeOfDay(viewHistory);
  const weekSegments = segmentByWeekType(viewHistory);
  const contentCategories = categorizeContent(viewHistory);

  const recommendations = [];

  if (timeSegments.dominant.id === 'night' && timeSegments.dominant.percentage > 25) {
    recommendations.push({
      category: 'Søvnhygiene',
      icon: '😴',
      title: 'Bedre søvnrutiner',
      description: 'Du scroller mye om natten. Prøv å sette en "TikTok-stoppetid" 1 time før leggetid.',
      priority: 'high',
      color: '#ff0050'
    });
  }

  if (weekSegments.ratio > 2.5) {
    recommendations.push({
      category: 'Balanse',
      icon: '⚖️',
      title: 'Spre underholdningen',
      description: 'Helge-scrollingen din er veldig høy. Korte pauser i hverdagen kan gi bedre balanse.',
      priority: 'medium',
      color: '#00f2ea'
    });
  }

  if (contentCategories.top3.length > 0) {
    const topCategory = contentCategories.top3[0];
    if (topCategory.percentage > 50) {
      recommendations.push({
        category: 'Innholdsvariasjon',
        icon: '🔄',
        title: 'Utforsk nye temaer',
        description: `${topCategory.name} dominerer feeden din. Prøv å utforske andre kategorier for variasjon!`,
        priority: 'low',
        color: '#bf00ff'
      });
    }

    const complementary = getComplementaryCategories(topCategory.id);
    if (complementary.length > 0) {
      recommendations.push({
        category: 'Anbefaling',
        icon: '💡',
        title: `Kanskje du liker ${complementary[0].name}?`,
        description: `Basert på din interesse for ${topCategory.name}, kan ${complementary[0].name} være noe for deg!`,
        priority: 'low',
        color: complementary[0].color
      });
    }
  }

  if (comments && comments.length > 0) {
    const commentRatio = comments.length / viewHistory.length;
    if (commentRatio < 0.01) {
      recommendations.push({
        category: 'Engasjement',
        icon: '💬',
        title: 'Bli mer aktiv!',
        description: 'Du kommenterer sjelden. Å engasjere seg kan gjøre opplevelsen mer sosial!',
        priority: 'low',
        color: '#b8ff00'
      });
    }
  }

  if (timeSegments.dominant.id === 'evening' && timeSegments.dominant.percentage < 40) {
    recommendations.push({
      category: 'Bra jobbet!',
      icon: '🌟',
      title: 'Sunn scrollevane',
      description: 'Du har en fin balanse i når du bruker TikTok. Keep it up!',
      priority: 'positive',
      color: '#00f2ea'
    });
  }

  return {
    recommendations: recommendations.slice(0, 4), // Max 4 recommendations
    summary: generateRecommendationSummary(timeSegments, weekSegments, contentCategories),
    score: calculateHealthScore(timeSegments, weekSegments, contentCategories)
  };
};

const getComplementaryCategories = (categoryId) => {
  const complements = {
    comedy: ['music', 'lifestyle'],
    music: ['dance', 'comedy'],
    lifestyle: ['beauty', 'travel'],
    food: ['lifestyle', 'travel'],
    fitness: ['food', 'lifestyle'],
    beauty: ['fashion', 'lifestyle'],
    gaming: ['comedy', 'education'],
    education: ['lifestyle', 'travel'],
    pets: ['comedy', 'lifestyle'],
    travel: ['food', 'lifestyle']
  };

  const complementIds = complements[categoryId] || [];
  return complementIds
    .filter(id => CONTENT_CATEGORIES[id])
    .map(id => ({ id, ...CONTENT_CATEGORIES[id] }));
};

const generateRecommendationSummary = (time, week, content) => {
  const parts = [];

  parts.push(`Du er en ${time.dominant.name.toLowerCase()}-scroller`);

  if (week.behaviorType !== 'Balansert') {
    parts.push(week.behaviorType.toLowerCase());
  }

  if (content.personality) {
    parts.push(`med ${content.personality.title.toLowerCase()}-personlighet`);
  }

  return parts.join(', ') + '.';
};

const calculateHealthScore = (time, week, content) => {
  let score = 70; // Base score

  // Penalize night scrolling
  const nightPct = time.segments.find(s => s.id === 'night')?.percentage || 0;
  score -= nightPct * 0.5;

  // Reward balance
  if (week.ratio >= 0.8 && week.ratio <= 1.5) {
    score += 10;
  }

  // Reward content diversity
  const diverseCategories = content.categories.filter(c => c.percentage >= 10).length;
  score += diverseCategories * 3;

  // Cap score
  return Math.min(100, Math.max(0, Math.round(score)));
};
