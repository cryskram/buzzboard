"use client";

import Loader from "@/components/Loader";
import Poll from "@/components/Poll";
import { GET_POLL } from "@/lib/operations";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SlugPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery(GET_POLL, {
    variables: { id: slug },
  });

  const [voterId, setVoterId] = useState("");

  useEffect(() => {
    let existingId = localStorage.getItem("voter-id");
    if (!existingId) {
      existingId = crypto.randomUUID();
      localStorage.setItem("voter-id", existingId);
    }
    setVoterId(existingId);
  }, []);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col w-full">
        <Link href="/" className="font-bold text-3xl">
          Buzz
          <span className="bg-slate-800 text-slate-200 rounded-xl p-1">
            Board
          </span>
        </Link>

        {loading && (
          <div className="mt-10 flex justify-center items-center">
            <Loader />
          </div>
        )}

        {data?.poll && (
          <div className="mt-8 w-full">
            <Poll poll={data.poll} currentUserId={voterId} />
          </div>
        )}

        {error && (
          <div className="text-red-500">
            Error fetching poll: {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlugPage;
