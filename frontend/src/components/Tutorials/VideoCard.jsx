
import React, { useState, useEffect } from "react";
import { ref, set, onValue, push, remove } from "firebase/database";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

// Helper function for "time ago" display
function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function VideoCard({ video }) {
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [views, setViews] = useState(video.views || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Listen to ratings
  useEffect(() => {
    const ratingsRef = ref(db, `tutorials/${video.id}/ratings`);
    onValue(ratingsRef, (snap) => {
      const ratings = snap.val() || {};
      const values = Object.values(ratings).map(Number);
      const avg = values.length
        ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
        : 0;
      setAvgRating(avg);
      setUserRating(ratings[currentUser.uid] || 0);
    });
  }, [video.id, currentUser.uid]);

  // Listen to comments
  useEffect(() => {
    const commentsRef = ref(db, `tutorials/${video.id}/comments`);
    onValue(commentsRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data)
        .map(([id, c]) => ({ id, ...c }))
        .sort((a, b) => a.createdAt - b.createdAt);
      setComments(list);
    });
  }, [video.id]);

  // Handle rating
  const handleRating = (val) => {
    set(ref(db, `tutorials/${video.id}/ratings/${currentUser.uid}`), val);
  };

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      user: currentUser.email,
      createdAt: Date.now(),
      replies: {},
    };

    await push(ref(db, `tutorials/${video.id}/comments`), commentData);
    setNewComment("");
  };

  const handleDeleteComment = (id) => {
    remove(ref(db, `tutorials/${video.id}/comments/${id}`));
  };

  const handleEditComment = (id, text) => {
    const newText = prompt("Edit comment:", text);
    if (newText) set(ref(db, `tutorials/${video.id}/comments/${id}/text`), newText);
  };

  const handleReply = (id) => {
    const replyText = prompt("Reply:");
    if (!replyText) return;
    const replyData = {
      text: replyText,
      user: currentUser.email,
      createdAt: Date.now(),
    };
    push(ref(db, `tutorials/${video.id}/comments/${id}/replies`), replyData);
  };

  // Handle views
  const handleView = () => {
    const newViews = views + 1;
    setViews(newViews);
    set(ref(db, `tutorials/${video.id}/views`), newViews);
  };

  //  Handle Delete Video
  const handleDeleteVideo = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;
    remove(ref(db, `tutorials/${video.id}`))
      .then(() => {
        alert("Video deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting video:", err);
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200">
      {/* Title & Delete Button */}
      <div className="flex justify-between items-center p-5">
        <h2 className="text-2xl font-semibold text-gray-800">{video.title}</h2>

        {/* Show delete button only for owner */}
        {currentUser?.email === video.uploadedBy && (
          <button
            onClick={handleDeleteVideo}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-lg shadow-sm transition"
          >
            🗑 Delete
          </button>
        )}
      </div>

      {/* Video Player */}
      <video
        src={video.videoUrl}
        controls
        onPlay={handleView}
        className="w-full rounded-xl border border-gray-200 mb-3"
      ></video>

      {/* Info */}
      <div className="px-5">
        <p className="text-sm text-gray-600 mb-4">
          Uploaded by <span className="font-medium">{video.uploadedBy}</span> |{" "}
          <span className="text-gray-700 font-semibold">{views}</span> views | ⭐{" "}
          <span className="text-yellow-500 font-bold">{avgRating}</span> rating
        </p>

        {/* Rating Stars */}
        <div className="flex mb-5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => handleRating(s)}
              className={`cursor-pointer text-2xl mr-1 ${
                s <= userRating ? "text-yellow-400" : "text-gray-300"
              } hover:scale-110 transition-transform`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Comment
          </button>
        </form>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-3 max-h-56 overflow-y-auto">
          {comments.length === 0 && (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="mb-3">
              <p className="text-sm text-gray-800">
                <strong>{c.user}</strong>{" "}
                <span className="text-xs text-gray-400">
                  {timeAgo(c.createdAt)}
                </span>
                : {c.text}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 text-xs mt-1">
                {(c.user === currentUser.email ||
                  video.uploadedBy === currentUser.email) && (
                  <>
                    <button
                      onClick={() => handleEditComment(c.id, c.text)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleReply(c.id)}
                  className="text-green-500 hover:underline"
                >
                  Reply
                </button>
              </div>

              {/* Nested Replies */}
              {c.replies &&
                Object.values(c.replies).map((r, i) => (
                  <div key={i} className="ml-5 mt-1 text-gray-600 text-sm">
                    <strong>{r.user}</strong>{" "}
                    <span className="text-xs text-gray-400">
                      {timeAgo(r.createdAt)}
                    </span>
                    : {r.text}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
