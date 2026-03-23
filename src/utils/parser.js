import JSZip from 'jszip';
import {
  calculateScreenTime,
  analyzeHourlyActivity,
  analyzeWeeklyActivity,
  analyzeTopCreators,
  analyzeHashtags,
  analyzeComments,
  generateCalendarData,
  segmentByTimeOfDay,
  segmentByWeekType,
  categorizeContent,
  generateRecommendations
} from './analytics';

// TikTok endrer eksportformatet sitt hele tiden, så vi sjekker flere stier
const FILE_PATHS = {
  viewHistory: [
    'Activity/Video Browsing History.json',
    'Activity/Browsing History.json',
    'Browsing History.json',
    'Video Browsing History.json',
    'Activity/Watch History.json'
  ],
  likes: [
    'Activity/Like List.json',
    'Activity/Likes.json',
    'Like List.json',
    'Likes.json'
  ],
  comments: [
    'Activity/Comment/Comments.json',
    'Activity/Comments.json',
    'Comments.json',
    'Comment/Comments.json'
  ],
  loginHistory: [
    'Activity/Login History.json',
    'Activity/Logins.json',
    'Login History.json'
  ],
  profile: [
    'Profile/Profile Information.json',
    'Profile Information.json',
    'Profile.json'
  ]
};

const findAndParseFile = async (zip, possiblePaths) => {
  for (const path of possiblePaths) {
    let file = zip.file(path);

    if (!file) {
      file = zip.file(`user_data_tiktok/${path}`);
    }

    // prøver case-insensitive hvis vi ikke finner noe
    if (!file) {
      const files = zip.file(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (files.length > 0) {
        file = files[0];
      }
    }

    if (file) {
      try {
        const content = await file.async('string');
        return JSON.parse(content);
      } catch (e) {
        console.warn(`Failed to parse ${path}:`, e);
      }
    }
  }
  return null;
};

const normalizeViewHistory = (data) => {
  if (!data) return [];

  // Handle different data structures
  let list = data.VideoList || data.BrowsingHistoryList || data.BrowsingHistory || data.VideoHistory || data.ActivityList || data;

  if (!Array.isArray(list)) {
    // kanskje det er et objekt med en liste inni
    if (list && typeof list === 'object') {
      const keys = Object.keys(list);
      const arrayKey = keys.find(k => Array.isArray(list[k]));
      if (arrayKey) list = list[arrayKey];
    }
  }

  if (!Array.isArray(list)) return [];

  return list.map(item => ({
    Date: item.Date || item.date || item.Timestamp || item.timestamp || item.WatchTime,
    Link: item.Link || item.link || item.VideoLink || item.URL || item.url,
    VideoDescription: item.VideoDescription || item.Description || item.description || item.Sound || ''
  })).filter(item => item.Date);
};

const normalizeLikes = (data) => {
  if (!data) return [];

  let list = data.LikeList || data.ItemFavoriteList || data.Likes || data;

  if (!Array.isArray(list)) {
    if (list && typeof list === 'object') {
      const keys = Object.keys(list);
      const arrayKey = keys.find(k => Array.isArray(list[k]));
      if (arrayKey) list = list[arrayKey];
    }
  }

  if (!Array.isArray(list)) return [];

  return list.map(item => ({
    Date: item.Date || item.date || item.Timestamp,
    Link: item.Link || item.link || item.VideoLink
  })).filter(item => item.Date);
};

const normalizeComments = (data) => {
  if (!data) return [];

  let list = data.CommentsList || data.Comments || data.CommentList || data;

  if (!Array.isArray(list)) {
    if (list && typeof list === 'object') {
      const keys = Object.keys(list);
      const arrayKey = keys.find(k => Array.isArray(list[k]));
      if (arrayKey) list = list[arrayKey];
    }
  }

  if (!Array.isArray(list)) return [];

  return list.map(item => ({
    Date: item.Date || item.date || item.Timestamp,
    Comment: item.Comment || item.comment || item.Text || item.text || item.Content
  })).filter(item => item.Comment);
};

const normalizeLoginHistory = (data) => {
  if (!data) return [];

  let list = data.LoginHistoryList || data.LoginHistory || data.Logins || data;

  if (!Array.isArray(list)) {
    if (list && typeof list === 'object') {
      const keys = Object.keys(list);
      const arrayKey = keys.find(k => Array.isArray(list[k]));
      if (arrayKey) list = list[arrayKey];
    }
  }

  if (!Array.isArray(list)) return [];

  return list.map(item => ({
    Date: item.Date || item.date || item.Timestamp,
    DeviceModel: item.DeviceModel || item.Device || item.device,
    IP: item.IP || item.ip || item.IPAddress
  })).filter(item => item.Date);
};

const normalizeProfile = (data) => {
  if (!data) return null;

  const profile = data.Profile || data.ProfileInformation || data.UserProfile || data;

  return {
    userName: profile.userName || profile.username || profile.UserName || profile.uniqueId || 'User',
    profilePhoto: profile.profilePhoto || profile.ProfilePhoto || profile.avatar || null
  };
};

export const parseZipFile = async (file, onProgress) => {
  const zip = new JSZip();

  onProgress?.({ stage: 'loading', progress: 10 });

  const contents = await zip.loadAsync(file, {
    createFolders: true
  });

  const fileNames = Object.keys(contents.files);
  console.log('Filer i ZIP:', fileNames);

  onProgress?.({ stage: 'parsing', progress: 30 });

  let viewHistoryRaw = null;
  let likesRaw = null;
  let commentsRaw = null;
  let loginHistoryRaw = null;
  let profileRaw = null;

  // sjekk om det er nytt format med én samlet JSON-fil
  const singleJsonFile = fileNames.find(f =>
    f.toLowerCase().includes('user_data') && f.endsWith('.json')
  );

  if (singleJsonFile) {
    // nytt TikTok-format: alt i én fil
    const fileContent = await contents.files[singleJsonFile].async('string');
    const allData = JSON.parse(fileContent);
    console.log('Nøkler i data:', Object.keys(allData));

    // TikTok 2024/2025 format - dataen er nestet
    const activity = allData['Your Activity'] || allData.Activity || {};
    const likesSection = allData['Likes and Favorites'] || allData.Likes || {};
    const commentSection = allData.Comment || {};
    const profileSection = allData['Profile And Settings'] || allData.Profile || {};

    console.log('=== DEBUG ===');
    console.log('Top level keys:', Object.keys(allData));
    console.log('Activity keys:', Object.keys(activity));

    // sjekk hver activity-nøkkel for å finne video history
    Object.keys(activity).forEach(key => {
      const val = activity[key];
      if (val && typeof val === 'object') {
        const subKeys = Object.keys(val);
        console.log(`Activity.${key} keys:`, subKeys);
        // sjekk om noen av sub-keys inneholder arrays
        subKeys.forEach(sk => {
          if (Array.isArray(val[sk])) {
            console.log(`  -> ${sk} is array with ${val[sk].length} items`);
          }
        });
      }
    });

    // Watch History er under activity['Watch History'].VideoList
    const watchHistory = activity['Watch History'] || activity['Video Browsing History'] || {};
    viewHistoryRaw = watchHistory.VideoList || watchHistory.BrowsingHistoryList || watchHistory;

    // Likes
    const likesData = likesSection['Like List'] || likesSection;
    likesRaw = likesData.ItemFavoriteList || likesData;

    // Comments er under Comment.Comments.CommentsList
    const commentsData = commentSection.Comments || {};
    commentsRaw = commentsData.CommentsList || commentsData;

    // Login history
    const loginData = activity['Login History'] || {};
    loginHistoryRaw = loginData.LoginHistoryList || loginData;

    // Profile
    const profileData = profileSection['Profile Information'] || profileSection;
    profileRaw = profileData.ProfileMap || profileData;

    // Hashtags fra Activity (nytt format har ikke hashtags i video-data)
    const hashtagData = activity['Hashtag'] || {};
    const hashtagList = hashtagData.HashtagList || [];
    console.log('HashtagList:', hashtagList);

    // Searches kan gi oss info om interesser
    const searchData = activity['Searches'] || {};
    const searchList = searchData.SearchList || [];
    console.log('SearchList length:', searchList.length);
    if (searchList.length > 0) {
      console.log('Første søk:', searchList[0]);
    }

    console.log('viewHistoryRaw type:', Array.isArray(viewHistoryRaw) ? 'array' : typeof viewHistoryRaw);
    console.log('viewHistoryRaw length:', Array.isArray(viewHistoryRaw) ? viewHistoryRaw.length : 'N/A');
    console.log('commentsRaw length:', Array.isArray(commentsRaw) ? commentsRaw.length : 'N/A');

    // debug: vis struktur på første video
    if (Array.isArray(viewHistoryRaw) && viewHistoryRaw.length > 0) {
      console.log('Første video keys:', Object.keys(viewHistoryRaw[0]));
      console.log('Første video data:', viewHistoryRaw[0]);
    }
  } else {
    // gammelt format med separate filer
    [viewHistoryRaw, likesRaw, commentsRaw, loginHistoryRaw, profileRaw] = await Promise.all([
      findAndParseFile(contents, FILE_PATHS.viewHistory),
      findAndParseFile(contents, FILE_PATHS.likes),
      findAndParseFile(contents, FILE_PATHS.comments),
      findAndParseFile(contents, FILE_PATHS.loginHistory),
      findAndParseFile(contents, FILE_PATHS.profile)
    ]);
  }

  onProgress?.({ stage: 'processing', progress: 70 });

  const data = {
    viewHistory: normalizeViewHistory(viewHistoryRaw),
    likes: normalizeLikes(likesRaw),
    comments: normalizeComments(commentsRaw),
    loginHistory: normalizeLoginHistory(loginHistoryRaw),
    profile: normalizeProfile(profileRaw)
  };

  onProgress?.({ stage: 'complete', progress: 100 });

  // sjekk om video-data har creator-info (@ i link) eller beskrivelser
  const hasCreatorData = data.viewHistory.some(v => v.Link && v.Link.includes('@'));
  const hasHashtagData = data.viewHistory.some(v => v.VideoDescription && v.VideoDescription.includes('#'));

  const availableSlides = {
    welcome: true,
    screenTime: data.viewHistory.length > 0,
    dayRhythm: data.viewHistory.length > 0,
    topCreators: hasCreatorData,
    hashtags: hasHashtagData,
    comments: data.comments.length > 0,
    segmentation: data.viewHistory.length > 0,
    recommendations: data.viewHistory.length > 0,
    calendar: data.viewHistory.length > 0 || data.loginHistory.length > 0,
    share: true
  };

  // pre-kalkulerer all analytics så slidene ikke trenger å vente
  onProgress?.({ stage: 'analyzing', progress: 85 });

  const analytics = {
    screenTime: data.viewHistory.length > 0 ? calculateScreenTime(data.viewHistory) : null,
    hourlyActivity: data.viewHistory.length > 0 ? analyzeHourlyActivity(data.viewHistory) : null,
    weeklyActivity: data.viewHistory.length > 0 ? analyzeWeeklyActivity(data.viewHistory) : null,
    topCreators: hasCreatorData ? analyzeTopCreators(data.viewHistory) : null,
    hashtags: hasHashtagData ? analyzeHashtags(data.viewHistory) : null,
    comments: data.comments.length > 0 ? analyzeComments(data.comments) : null,
    calendar: data.viewHistory.length > 0 ? generateCalendarData(data.viewHistory) : null,
    timeSegments: data.viewHistory.length > 0 ? segmentByTimeOfDay(data.viewHistory) : null,
    weekSegments: data.viewHistory.length > 0 ? segmentByWeekType(data.viewHistory) : null,
    contentCategories: data.viewHistory.length > 0 ? categorizeContent(data.viewHistory) : null,
    recommendations: data.viewHistory.length > 0 ? generateRecommendations(data.viewHistory, data.comments) : null
  };

  onProgress?.({ stage: 'complete', progress: 100 });

  return {
    ...data,
    analytics,
    availableSlides,
    stats: {
      totalVideos: data.viewHistory.length,
      totalLikes: data.likes.length,
      totalComments: data.comments.length,
      totalLogins: data.loginHistory.length
    }
  };
};

export const parseJsonFiles = async (files, onProgress) => {
  const data = {
    viewHistory: [],
    likes: [],
    comments: [],
    loginHistory: [],
    profile: null
  };

  let processed = 0;
  const total = files.length;

  for (const file of files) {
    try {
      const content = await file.text();
      const json = JSON.parse(content);
      const fileName = file.name.toLowerCase();

      if (fileName.includes('browsing') || fileName.includes('video') || fileName.includes('watch')) {
        data.viewHistory = normalizeViewHistory(json);
      } else if (fileName.includes('like')) {
        data.likes = normalizeLikes(json);
      } else if (fileName.includes('comment')) {
        data.comments = normalizeComments(json);
      } else if (fileName.includes('login')) {
        data.loginHistory = normalizeLoginHistory(json);
      } else if (fileName.includes('profile')) {
        data.profile = normalizeProfile(json);
      }
    } catch (e) {
      console.warn(`Failed to parse ${file.name}:`, e);
    }

    processed++;
    onProgress?.({
      stage: 'parsing',
      progress: Math.round((processed / total) * 100)
    });
  }

  // sjekk om video-data har creator-info (@ i link) eller beskrivelser
  const hasCreatorData = data.viewHistory.some(v => v.Link && v.Link.includes('@'));
  const hasHashtagData = data.viewHistory.some(v => v.VideoDescription && v.VideoDescription.includes('#'));

  const availableSlides = {
    welcome: true,
    screenTime: data.viewHistory.length > 0,
    dayRhythm: data.viewHistory.length > 0,
    topCreators: hasCreatorData,
    hashtags: hasHashtagData,
    comments: data.comments.length > 0,
    segmentation: data.viewHistory.length > 0,
    recommendations: data.viewHistory.length > 0,
    calendar: data.viewHistory.length > 0 || data.loginHistory.length > 0,
    share: true
  };

  // pre-kalkulerer all analytics så slidene slipper å vente
  const analytics = {
    screenTime: data.viewHistory.length > 0 ? calculateScreenTime(data.viewHistory) : null,
    hourlyActivity: data.viewHistory.length > 0 ? analyzeHourlyActivity(data.viewHistory) : null,
    weeklyActivity: data.viewHistory.length > 0 ? analyzeWeeklyActivity(data.viewHistory) : null,
    topCreators: hasCreatorData ? analyzeTopCreators(data.viewHistory) : null,
    hashtags: hasHashtagData ? analyzeHashtags(data.viewHistory) : null,
    comments: data.comments.length > 0 ? analyzeComments(data.comments) : null,
    calendar: data.viewHistory.length > 0 ? generateCalendarData(data.viewHistory) : null,
    timeSegments: data.viewHistory.length > 0 ? segmentByTimeOfDay(data.viewHistory) : null,
    weekSegments: data.viewHistory.length > 0 ? segmentByWeekType(data.viewHistory) : null,
    contentCategories: data.viewHistory.length > 0 ? categorizeContent(data.viewHistory) : null,
    recommendations: data.viewHistory.length > 0 ? generateRecommendations(data.viewHistory, data.comments) : null
  };

  return {
    ...data,
    analytics,
    availableSlides,
    stats: {
      totalVideos: data.viewHistory.length,
      totalLikes: data.likes.length,
      totalComments: data.comments.length,
      totalLogins: data.loginHistory.length
    }
  };
};

export default { parseZipFile, parseJsonFiles };
