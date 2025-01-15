import XSvg from "../svgs/XSvg";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoLanguage } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { data } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isPending,
    mutate: logout,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error("Something went wrong");

        if (data.error) throw new Error(data.error || "Something went wrong");
        toast.success(data.message);

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  if (isError) {
    console.log(error);
  }

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-64">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full transition-all fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col mt-2">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center  hover:bg-stone-900 transition-all rounded-full duration-300 p-3 pl-2 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center  hover:bg-stone-900 transition-all rounded-full duration-300 p-3 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${data?.username}`}
              state={data._id}
              className="flex gap-3 items-center  hover:bg-stone-900 transition-all rounded-full duration-300 p-3 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <div className="flex gap-3 items-center  hover:bg-stone-900 transition-all rounded-full duration-300 p-3 max-w-fit cursor-pointer">
              <IoLanguage className="w-6 h-6" />
              <span className="text-lg hidden md:block">Language</span>
            </div>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10 flex mx-2 gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src="../../posts/avatar.png" />
              </div>
            </div>
            <div className="flex justify-between items-center flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="w-7 h-7 cursor-pointer hover:bg-gray-600 p-1.5 rounded-full transition-all"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
