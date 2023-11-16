import { type NextPage } from "next";
import { FAQItem } from "~/components/FAQItem";

const FAQPage: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-16">
      <FAQItem />
    </div>
  );
};

export default FAQPage;
