function ListboxWrapper(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className="w-full  rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100 max-h-48"
    >
      {props.children}
    </div>
  );
}

export default ListboxWrapper;
