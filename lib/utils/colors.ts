export const getScoreColor = (score: number) => {
  if (score >= 8.5) return '#00FF88';
  if (score >= 8.0) return '#44FF44';
  if (score >= 7.5) return '#88FF00';
  if (score >= 7.0) return '#FFAA00';
  return '#FF6644';
};

export const getProgressColors = (score: number) => {
  if (score >= 8.5) return ['#00FF88', '#00CC66'];
  if (score >= 8.0) return ['#44FF44', '#22CC22'];
  if (score >= 7.5) return ['#88FF00', '#66CC00'];
  if (score >= 7.0) return ['#FFAA00', '#CC8800'];
  return ['#FF6644', '#CC4422'];
};

export const featureEmojis: { [key: string]: string } = {
  'Eyebrows': '🤨',
  'Eyes': '👁️',
  'Nose': '👃',
  'Lips': '👄',
  'Face shape': '🔷',
  'Skin': '✨',
  'Hair': '💇',
  'Chin': '🫵',
  'Overall impression': '🌟',
  'Jawline': '💪',
  'Cheekbones': '💎',
  'Forehead': '🧠',
};

export const getFeatureEmoji = (featureName: string) => {
  return featureEmojis[featureName] || '⭐';
};