import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, ArrowUpDown, Trash2, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getVideoComments } from '../../services/api';

export default function CommentsSection({ videoId }) {
  const { showToast } = useApp();
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState('Comments');
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [sortBy, setSortBy] = useState('top');

  useEffect(() => {
    let active = true;
    setLoading(true);

    getVideoComments(videoId).then((res) => {
      if (active) {
        setComments(res.comments || []);
        setTotalCount(res.totalCount || 'Comments');
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [videoId]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const created = {
      id: Date.now(),
      author: 'You (PlayTube Streamer)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      time: 'Just now',
      text: newComment.trim(),
      likes: 0,
      isLiked: false,
      isDisliked: false,
      isUserComment: true
    };

    setComments([created, ...comments]);
    setNewComment('');
    setIsFocused(false);
    showToast('Comment posted!');
  };

  const handleLike = (id) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isDisliked: false
        };
      }
      return c;
    }));
  };

  const handleDislike = (id) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isDisliked: !c.isDisliked,
          isLiked: false,
          likes: c.isLiked ? c.likes - 1 : c.likes
        };
      }
      return c;
    }));
  };

  const handleDelete = (id) => {
    setComments(comments.filter(c => c.id !== id));
    showToast('Comment deleted');
  };

  return (
    <div className="mt-6 pt-6 border-t border-neutral-800">
      {/* Header & Sorting */}
      <div className="flex items-center gap-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-100">
          {totalCount}
        </h3>
        <button
          onClick={() => setSortBy(sortBy === 'top' ? 'newest' : 'top')}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white transition"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>Sort by: {sortBy === 'top' ? 'Top comments' : 'Newest first'}</span>
        </button>
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handlePostComment} className="flex gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
          P
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Add a comment on PlayTube..."
            className="w-full bg-transparent border-b border-neutral-700 focus:border-white py-1.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition"
          />
          {isFocused && (
            <div className="flex items-center justify-end gap-3 mt-3 animate-in fade-in">
              <button
                type="button"
                onClick={() => {
                  setNewComment('');
                  setIsFocused(false);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition shadow-sm"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-10 gap-3 text-neutral-400 text-sm">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading official YouTube comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-neutral-500 text-sm">
          No comments yet. Be the first to start the conversation!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 sm:gap-4 group">
              <img
                src={comment.avatar}
                alt={comment.author}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-1 ring-neutral-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-200 hover:text-red-400 transition cursor-pointer">
                    {comment.author}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {comment.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed break-words whitespace-pre-wrap">
                  {comment.text}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      comment.isLiked ? 'text-blue-500 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(comment.id)}
                    className={`p-1 text-xs transition ${
                      comment.isDisliked ? 'text-red-500 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => showToast('Reply thread feature ready')}
                    className="text-xs text-neutral-400 hover:text-white font-medium"
                  >
                    Reply
                  </button>

                  {comment.replyCount && comment.replyCount !== '0' && (
                    <button
                      onClick={() => showToast(`Viewing ${comment.replyCount} replies`)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 ml-2"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{comment.replyCount} replies</span>
                    </button>
                  )}

                  {comment.isUserComment && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-neutral-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
