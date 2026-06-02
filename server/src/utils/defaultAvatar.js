/** 新用户默认头像（与小程序 static 路径一致） */
const DEFAULT_AVATAR_PATHS = [
  "/static/images/profile-picture/1.png",
  "/static/images/profile-picture/2.png",
  "/static/images/profile-picture/3.png",
];

function pickRandomDefaultAvatar() {
  const index = Math.floor(Math.random() * DEFAULT_AVATAR_PATHS.length);
  return DEFAULT_AVATAR_PATHS[index];
}

/** 按用户 id 稳定映射（用于补全历史空头像） */
function pickDefaultAvatarByUserId(userId) {
  const id = Number(userId) || 0;
  return DEFAULT_AVATAR_PATHS[Math.abs(id) % DEFAULT_AVATAR_PATHS.length];
}

module.exports = {
  DEFAULT_AVATAR_PATHS,
  pickRandomDefaultAvatar,
  pickDefaultAvatarByUserId,
};
