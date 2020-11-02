import React from "react";

const HeaderAccount = () => {
  return (
    <div
      className="fixed top-0 ml-5/6 md:ml-5/6 w-1/6 md:w-1/6 bg-blue-800 flex flex-row-reverse items-center z-30"
      style={{ height: "64px" }}
    >
      <div className="hover:bg-blue-700 flex flex-row items-center p-1 mr-1 rounded-sm cursor-pointer">
        <img className="rounded-full w-8 h-8 md:mr-3" src="https://ui-avatars.com/api/?name=Giovanni+Leon" alt="" />
        <span className="hidden lg:block text-white pr-3 font-semibold">Giovanni Leon</span>
      </div>
    </div>
  );
};

export default HeaderAccount;
