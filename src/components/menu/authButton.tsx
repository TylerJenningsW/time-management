import React from "react";

function AuthButton(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-blue-900 hover:text-white"
    >
      {props.children}
    </button>
  );
}

export default AuthButton;
