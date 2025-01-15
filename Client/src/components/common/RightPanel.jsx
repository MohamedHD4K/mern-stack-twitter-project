import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { follow, isPending } = useFollow();

  const { data: USERS_FOR_RIGHT_PANEL, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        if (!res.ok) throw new Error("Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  if(USERS_FOR_RIGHT_PANEL?.length === 0) return

  return (
    <div className="flex flex-col">
      <span className="hidden lg:block bg-black z-10 sticky top-0 ">
        <Search />
      </span>
      <div className="hidden lg:block sticky top-20 m-4 max-w-80">
        <div className="border border-gray-700 rounded-2xl sticky w-80 top-2">
          <p className="font-bold text-xl p-3 px-4">Who to follow</p>
          <div className="flex flex-col">
            {/* item */}
            {isLoading && (
              <div className="flex flex-col items-center transition-all justify-between">
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </div>
            )}
            {!isLoading &&
              USERS_FOR_RIGHT_PANEL?.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center hover:bg-zinc-950 transition-all p-3 px-4 justify-between"
                  key={user._id}
                >
                  <div className="flex gap-2 items-center">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={user.profileImg || "../posts/avatar.png"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold tracking-tight truncate w-28">
                        {user.fullName}
                      </span>
                      <span className="text-sm text-slate-500">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                      onClick={() => follow(user._id)}
                    >
                      {isPending ? <LoadingSpinner size="xs mx-3"/> : "Follow"}
                    </button>
                  </div>
                </Link>
              ))}
            <span className="text-primary hover:bg-zinc-950 p-3 cursor-pointer px-4 rounded-br-2xl transition-all rounded-bl-2xl">
              Show more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
