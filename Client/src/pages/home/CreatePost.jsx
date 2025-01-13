import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = ({ data }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Post created successfully");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-start gap-4 border-b border-gray-700">
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <div className="flex items-start px-4 pt-2 gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={data.profileImg || "../../posts/avatar.png"} />
            </div>
          </div>
          <textarea
            className="textarea w-full p-0 text-lg resize-none focus:border-gray-700 focus:border-b focus:mb-3 border-0 focus:outline-none"
            placeholder="What is happening?!"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between px-4 pb-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn bg-white rounded-full text-black hover:bg-white hover:opacity-90 btn-sm px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
