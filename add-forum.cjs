const fs = require('fs');
const filePath = 'src/database/db.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add forumPosts to SEED_DATA
if (!content.includes('forumPosts: {}')) {
  content = content.replace(
    '  whatsappSettings: {',
    '  forumPosts: {},\n  whatsappSettings: {'
  );

  // 2. Add forumPosts to localCache
  content = content.replace(
    '  whatsappSettings: {},',
    '  forumPosts: {},\n  whatsappSettings: {},'
  );

  // 3. Add to publicNodes
  content = content.replace(
    '"whatsappSettings"',
    '"forumPosts", "whatsappSettings"'
  );

  // 4. Inject forum functions
  const forumMethods = `
  // =====================
  // FORUM POSTS
  // =====================
  getForumPosts() {
    return Object.values(localCache.forumPosts || {}).sort((a, b) => b.timestamp - a.timestamp);
  },

  addForumPost(phone, name, role, content) {
    if (!localCache.forumPosts) localCache.forumPosts = {};
    const postId = "post-" + Date.now();
    const newPost = {
      id: postId,
      phone,
      name,
      role,
      content,
      timestamp: Date.now(),
      likes: {}, // phone -> true
      comments: {}
    };
    localCache.forumPosts[postId] = newPost;
    persist();
    fbSet("forumPosts/" + postId, newPost);
    return { success: true, post: newPost };
  },

  addPostComment(postId, phone, name, role, content) {
    if (!localCache.forumPosts || !localCache.forumPosts[postId]) {
      return { success: false, message: "المنشور غير موجود" };
    }
    const post = localCache.forumPosts[postId];
    if (!post.comments) post.comments = {};
    
    const commentId = "comment-" + Date.now();
    const newComment = {
      id: commentId,
      phone,
      name,
      role,
      content,
      timestamp: Date.now()
    };
    
    post.comments[commentId] = newComment;
    persist();
    fbSet("forumPosts/" + postId + "/comments/" + commentId, newComment);
    return { success: true, comment: newComment };
  },

  togglePostLike(postId, phone) {
    if (!localCache.forumPosts || !localCache.forumPosts[postId]) {
      return { success: false, message: "المنشور غير موجود" };
    }
    const post = localCache.forumPosts[postId];
    if (!post.likes) post.likes = {};
    
    let isLiked = false;
    if (post.likes[phone]) {
      delete post.likes[phone]; // un-like
    } else {
      post.likes[phone] = true; // like
      isLiked = true;
    }
    
    persist();
    fbSet("forumPosts/" + postId + "/likes", post.likes);
    return { success: true, isLiked, likesCount: Object.keys(post.likes).length };
  },

  deleteForumPost(postId) {
    if (!localCache.forumPosts || !localCache.forumPosts[postId]) return false;
    delete localCache.forumPosts[postId];
    persist();
    fbRemove("forumPosts/" + postId);
    return true;
  },
`;

  content = content.replace('  saveAISettings(settings) {\n    localCache.aiSettings = settings;\n    persist();\n    fbSet("aiSettings", settings);\n    return true;\n  }\n};', 
    '  saveAISettings(settings) {\n    localCache.aiSettings = settings;\n    persist();\n    fbSet("aiSettings", settings);\n    return true;\n  },\n' + forumMethods + '\n};'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('db.js updated successfully with forum functionality.');
} else {
  console.log('db.js already contains forumPosts.');
}
