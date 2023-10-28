function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      type="text"
      className="w-6/12 max-w-lg rounded border border-gray-800 px-4 dark:text-gray-800"
    ></input>
  );
}

export default Input;
