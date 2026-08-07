export const getBuilderBadges = (builderData) => {
  const badges = [];

  // Logic based on existing project/builder data
  if (builderData.is_verified) {
    badges.push({ label: "Verified", icon: "💎", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" });
  }

  // Example logic assuming project count or likes might define 'Top' or 'Trending'
  if (builderData.likes > 1000) {
    badges.push({ label: "Top Builder", icon: "🏆", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" });
  }

  if (builderData.projects && builderData.projects.length > 5) {
    badges.push({ label: "Early Builder", icon: "🚀", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" });
  }

  return badges;
};
