import Link from "next/link";
import { GrTask } from "react-icons/gr";

const CredentialsHeader = ({ heading, paragraph, linkName, linkUrl = "#" }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <GrTask className="h-20 w-20 text-green-600" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-green-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">
        {paragraph}{" "}
        <Link
          href={linkUrl}
          className="font-medium text-green-600 hover:text-green-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
};

export default CredentialsHeader;
