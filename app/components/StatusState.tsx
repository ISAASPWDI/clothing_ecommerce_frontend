import { ApolloError } from "@apollo/client";

interface statusStateOptions {
  loading: boolean;
  error: ApolloError | undefined;
  loadingMsg: string;
  errorMsg: string;
}

export const StatusState = ({
  loading,
  error,
  loadingMsg,
  errorMsg,
}: statusStateOptions) => {
  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/75 dark:bg-[#302f31]/80 mb-32">
        <div role="status" className="flex justify-center items-center">
          <svg
            className="animate-spin w-20 h-20"
            viewBox="0 0 50 50"
          >
            {/* Fondo del círculo */}
            <circle
              className="text-gray-200 dark:text-[#3a393b]"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
            />
            {/* Arco del spinner */}
            <circle
              className="text-purple-600 dark:text-purple-600"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset="90"
            />
          </svg>
        </div>
        <span className="mt-4 text-gray-600 dark:text-gray-200 text-2xl">{loadingMsg}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex justify-center items-center z-10 bg-white/90 dark:bg-[#302f31]/95 mb-32">
        <div className="text-center bg-red-200 dark:bg-red-900/60 p-5 rounded-md">
          <p className="text-red-600 dark:text-red-300 text-sm">
            {errorMsg}: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
