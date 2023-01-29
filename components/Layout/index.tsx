import React from "react";
import Sidebar from "../Sidebar";

const Layout = ({ children }: any) => {
  return (
    <div>
      <div className="h-screen flex flex-row justify-start">
        <Sidebar />
        <div className="bg-primary flex-1 p-4 text-black">
          {children}
        </div>
      </div>
    </div>
  )
};

export default Layout;
