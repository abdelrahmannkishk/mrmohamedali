const fs = require('fs');
const filePath = 'src/components/StudentDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports if missing
if (!content.includes('MessageSquare')) {
  content = content.replace(
    /import {\s*([^}]+)\s*} from 'lucide-react';/,
    "import { $1, MessageSquare, ThumbsUp, MessageCircle, Send, Trash2, Heart } from 'lucide-react';"
  );
}

// 2. Add state
if (!content.includes('const [forumPosts, setForumPosts] = useState([]);')) {
  content = content.replace(
    "const [students, setStudents] = useState({});",
    "const [students, setStudents] = useState({});\n  const [forumPosts, setForumPosts] = useState([]);\n  const [newPostContent, setNewPostContent] = useState('');\n  const [newCommentContents, setNewCommentContents] = useState({});"
  );
}

// 3. Update syncDB
if (!content.includes('setForumPosts(db.getForumPosts());')) {
  content = content.replace(
    "setStudents(data.students || {});",
    "setStudents(data.students || {});\n    if (db.getForumPosts) setForumPosts(db.getForumPosts());"
  );
}

// 4. Add tab to navigation array
if (!content.includes("{ id: 'forum', name: 'المنتدى الطلابي'")) {
  content = content.replace(
    "{ id: 'top_10', name: 'أعلى 10', icon: <Trophy className=\"w-4 h-4\" /> },",
    "{ id: 'top_10', name: 'أعلى 10', icon: <Trophy className=\"w-4 h-4\" /> },\n                { id: 'forum', name: 'المنتدى الطلابي', icon: <MessageSquare className=\"w-4 h-4\" /> },"
  );
}

// 5. Add to Tab Banner Header
if (!content.includes("activeTab === 'forum' && 'المنتدى الطلابي'")) {
  content = content.replace(
    "{activeTab === 'top_10' && 'أعلى 10'}",
    "{activeTab === 'top_10' && 'أعلى 10'}\n                {activeTab === 'forum' && 'المنتدى الطلابي'}"
  );
}

// 6. Define Forum actions
if (!content.includes('handleAddForumPost')) {
  const forumActions = `
  const handleAddForumPost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    db.addForumPost(user.phone, user.name, user.role, newPostContent.trim());
    setNewPostContent('');
    syncDB();
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const comment = newCommentContents[postId];
    if (!comment?.trim()) return;
    db.addPostComment(postId, user.phone, user.name, user.role, comment.trim());
    setNewCommentContents(prev => ({...prev, [postId]: ''}));
    syncDB();
  };

  const handleToggleLike = (postId) => {
    db.togglePostLike(postId, user.phone);
    syncDB();
  };
  `;
  content = content.replace('  // Handle Recharge Request', forumActions + '\n\n  // Handle Recharge Request');
}

// 7. Inject Forum UI component
if (!content.includes('id="forum-tab"')) {
  const forumUI = `
            {/* ----------------- المنتدى الطلابي ----------------- */}
            {activeTab === 'forum' && (
              <div id="forum-tab" className="space-y-6 max-w-3xl mx-auto">
                {/* Create Post Form */}
                <div className={\`p-4 rounded-2xl border \${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm\`}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-egypt-darkGreen text-white flex items-center justify-center font-bold font-cairo shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <form onSubmit={handleAddForumPost} className="flex-1">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="شارك زملائك سؤالك أو استفسارك هنا..."
                        className={\`w-full bg-transparent border-none focus:ring-0 resize-none p-2 font-tajawal \${isDark ? 'text-gray-200 placeholder-slate-500' : 'text-gray-800 placeholder-gray-400'}\`}
                        rows="3"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          type="submit"
                          disabled={!newPostContent.trim()}
                          className="bg-egypt-green hover:bg-egypt-darkGreen text-white px-5 py-2 rounded-xl text-sm font-bold font-cairo flex items-center gap-2 transition disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          نشر
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {forumPosts.map(post => {
                    const isLikedByMe = post.likes && post.likes[user.phone];
                    const likesCount = post.likes ? Object.keys(post.likes).length : 0;
                    const commentsArray = post.comments ? Object.values(post.comments).sort((a,b)=>a.timestamp - b.timestamp) : [];

                    return (
                      <div key={post.id} className={\`rounded-2xl border overflow-hidden \${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm\`}>
                        {/* Post Header */}
                        <div className="p-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 \${post.role === 'admin' ? 'bg-egypt-royalGold text-black text-xl' : 'bg-slate-200 text-slate-800 text-sm'}\`}>
                              {post.role === 'admin' ? '👑' : post.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={\`font-cairo font-bold \${isDark ? 'text-gray-100' : 'text-gray-800'}\`}>{post.name}</span>
                                {post.role === 'admin' && <span className="bg-egypt-royalGold/20 text-egypt-royalGold text-[10px] px-2 py-0.5 rounded-full font-bold">الإدارة</span>}
                              </div>
                              <span className={\`text-xs font-tajawal \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>
                                {new Date(post.timestamp).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          {user.role === 'admin' && (
                            <button onClick={() => { if(window.confirm('حذف المنشور؟')) { db.deleteForumPost(post.id); syncDB(); } }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Post Content */}
                        <div className={\`px-4 pb-4 font-tajawal whitespace-pre-wrap \${isDark ? 'text-gray-300' : 'text-gray-700'}\`}>
                          {post.content}
                        </div>

                        {/* Post Actions */}
                        <div className={\`px-4 py-2 border-t border-b flex items-center gap-4 \${isDark ? 'border-slate-700/50' : 'border-slate-100'}\`}>
                          <button 
                            onClick={() => handleToggleLike(post.id)}
                            className={\`flex items-center gap-1.5 text-sm font-bold font-cairo transition \${isLikedByMe ? 'text-red-500' : isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}\`}
                          >
                            <Heart className={\`w-4 h-4 \${isLikedByMe ? 'fill-current' : ''}\`} />
                            {likesCount > 0 && <span>{likesCount}</span>}
                            <span className="hidden sm:inline">إعجاب</span>
                          </button>
                          <div className={\`flex items-center gap-1.5 text-sm font-bold font-cairo \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>
                            <MessageCircle className="w-4 h-4" />
                            {commentsArray.length > 0 && <span>{commentsArray.length}</span>}
                            <span className="hidden sm:inline">تعليق</span>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className={\`bg-slate-50/50 \${isDark ? 'bg-slate-900/50' : ''}\`}>
                          {commentsArray.length > 0 && (
                            <div className="px-4 py-3 space-y-3">
                              {commentsArray.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                  <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 \${comment.role === 'admin' ? 'bg-egypt-royalGold text-black text-sm' : 'bg-slate-200 text-slate-800'}\`}>
                                    {comment.role === 'admin' ? '👑' : comment.name.charAt(0)}
                                  </div>
                                  <div className={\`flex-1 rounded-2xl rounded-tr-none p-3 \${isDark ? 'bg-slate-800' : 'bg-white'} border \${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm\`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={\`font-cairo font-bold text-xs \${isDark ? 'text-gray-200' : 'text-gray-800'}\`}>{comment.name}</span>
                                      {comment.role === 'admin' && <span className="bg-egypt-royalGold/20 text-egypt-royalGold text-[9px] px-1.5 py-0.5 rounded-full font-bold">الإدارة</span>}
                                      <span className={\`text-[10px] font-tajawal \${isDark ? 'text-slate-500' : 'text-slate-400'}\`}>
                                        {new Date(comment.timestamp).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className={\`text-sm font-tajawal whitespace-pre-wrap \${isDark ? 'text-gray-300' : 'text-gray-600'}\`}>{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Comment Input */}
                          <div className="p-4 pt-2">
                            <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                              <input
                                type="text"
                                value={newCommentContents[post.id] || ''}
                                onChange={(e) => setNewCommentContents({...newCommentContents, [post.id]: e.target.value})}
                                placeholder="اكتب تعليقاً..."
                                className={\`flex-1 rounded-full px-4 py-2 text-sm border focus:ring-1 focus:ring-egypt-green outline-none font-tajawal \${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-gray-800 placeholder-gray-400'}\`}
                              />
                              <button 
                                type="submit"
                                disabled={!newCommentContents[post.id]?.trim()}
                                className="w-10 h-10 rounded-full bg-egypt-green hover:bg-egypt-darkGreen text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {forumPosts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">💭</div>
                      <p className="text-lg font-bold text-gray-400 font-cairo">لا توجد منشورات حتى الآن</p>
                      <p className="text-sm text-gray-500 font-tajawal mt-1">كن أول من يشارك فكرة أو سؤال في المنتدى الطلابي!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* ---------------------------------------------------- */}
`;
  content = content.replace('{/* Tab Banner Header */}', forumUI + '\n          {/* Tab Banner Header */}');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('StudentDashboard.jsx updated successfully.');
