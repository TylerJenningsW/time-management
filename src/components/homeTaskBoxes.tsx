function HomeBox(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className="flex flex-row gap-4 border-black bg-neutral-300 p-4 dark:bg-neutral-600"
    >
      {props.children}
    </div>
  );
}

export default HomeBox;
