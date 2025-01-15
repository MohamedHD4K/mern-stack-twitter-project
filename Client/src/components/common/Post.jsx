import { FaHeart, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      toast.success("Post Liked successfully");
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        if (!comment || comment.trim().length === 0) {
          throw new Error("Comment cannot be empty");
        }
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment.trim() }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment has been add");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const date = formatPostDate(post?.createdAt);
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = post.user._id === authUser._id;
  const formattedDate = date;

  const handleDeletePost = () => {
    deletePost();
    console.log("Delete :", post.text);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost(comment);
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleShowMoreInfo = () => {};

  return (
    <div className="flex gap-2 items-start hover:bg-zinc-950 transition-all cursor-pointer pt-3 px-4 border-b border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 h-8 rounded-full overflow-hidden"
        >
          <img src={postOwner.profileImg || "../posts/avatar.png"} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost ? (
            <span className="flex justify-end flex-1">
              <span
                onClick={handleDeletePost}
                className="cursor-pointer text-gray-400 flex justify-center items-center transition-all hover:bg-gray-900 p-2 w-8 h-8 rounded-full"
              >
                {isDeleting ? <LoadingSpinner /> : <FaTrash />}
              </span>
            </span>
          ) : (
            <span className="flex justify-end flex-1">
              <span
                onClick={handleShowMoreInfo}
                className="cursor-pointer text-gray-400 flex justify-center items-center transition-all hover:bg-gray-900 p-2 w-8 h-8 rounded-full"
              >
                <BsThreeDots />
              </span>
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="max-h-80 bg-black object-contain rounded-2xl border border-gray-700"
              alt=""
            />
          )}
        </div>
        <div className="flex justify-between items-center my-1">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <div className="hover:bg-sky-600/40 cursor-pointer p-2 transition-all rounded-full">
                <FaRegComment className="text-slate-500 group-hover:text-sky-400" />
              </div>
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            {/* We're using Modal Component from DaisyUI */}
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet add the first comment
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImg || "../posts/avatar.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 px-3 rounded text-md resize-none border focus:outline-none  border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn bg-white hover:bg-gray-300 transition-all rounded-full btn-sm text-black px-4">
                    {isCommenting ? <LoadingSpinner size="sm mx-1" /> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div className="flex items-center group cursor-pointer">
              <div className="hover:bg-green-600/40 cursor-pointer p-1.5 transition-all rounded-full">
                <BiRepost className="text-slate-500 w-5 h-5 group-hover:text-green-500" />
              </div>
              <span className="text-sm text-slate-500 group-hover:text-green-500">
                0
              </span>
            </div>
            <div
              className="flex items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              {isLiking && <LoadingSpinner size="xs" className="m-2" />}
              {!isLiked && !isLiking && (
                <div className="hover:bg-pink-800/40 cursor-pointer p-2 transition-all rounded-full">
                  <FaRegHeart className="text-slate-500 group-hover:text-pink-700" />
                </div>
              )}
              {isLiked && !isLiking && (
                <div className="hover:bg-slate-800/40 cursor-pointer p-2  transition-all rounded-full">
                  <FaHeart className=" text-pink-800 " />
                </div>
              )}

              <span
                className={`text-sm text-slate-500 transition-all group-hover:text-pink-800 ${
                  isLiked ? "text-pink-800" : "text-slate-500"
                }`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
          <div className="flex w-1/3 justify-end gap-2 items-center">
            <div className="hover:bg-blue-600/40 cursor-pointer p-2 transition-all rounded-full">
              <FaRegBookmark className="text-slate-500 hover:to-blue-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
