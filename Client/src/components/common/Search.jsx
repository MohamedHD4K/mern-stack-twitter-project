import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div
      className="flex items-center border gap-3 border-gray-700 rounded-full mb-3 p-3
     focus-within:outline focus-within:outline-blue-600 focus-within:outline-2"
    >
      <IoSearch className="text-gray-700 text-lg" />
      <input
        type="text"
        className="transition-all bg-inherit outline-none w-full text-sm"
        placeholder="Search"
      />
    </div>
  );
};

export default Search;
