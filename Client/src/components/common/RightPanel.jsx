import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import Search from "./Search";

const RightPanel = () => {
  const isLoading = false;

  return (
    <div className="hidden lg:block m-4 max-w-80">
      <Search />
      <div className="border border-gray-700 rounded-2xl sticky w-80 top-2">
        <p className="font-bold text-xl p-3 px-4">Who to follow</p>
        <div className="flex flex-col">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
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
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
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
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
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
  );
};
export default RightPanel;
