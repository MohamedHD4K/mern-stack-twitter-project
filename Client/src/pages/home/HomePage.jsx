import { useEffect, useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const { data } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    document.title = "X Clone \\ Home";
  }, []);

  return (
    <div className="max-w-2xl flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex sticky top-0 z-10 backdrop-blur-lg border-b border-gray-700">
        <div
          className={
            "flex justify-center flex-1 p-3.5 hover:bg-secondary/65 hover:backdrop-blur- transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("forYou")}
        >
          For you
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
          )}
        </div>
        <div
          className="flex justify-center flex-1 p-3.5 hover:bg-secondary/65 transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && (
            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
          )}
        </div>
      </div>

      {/*  CREATE POST INPUT */}
      <CreatePost data={data} />

      {/* POSTS */}
      <Posts feedType={feedType}/>
    </div>
  );
};
export default HomePage;
