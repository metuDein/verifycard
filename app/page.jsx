"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [heading, setHeading] = useState("Efficient Tracking");
  const [subHeading, setSubHeading] = useState(
    "get real-time data for your gift cards."
  );

  useEffect(() => {
    if (currentSection === 1) {
      setHeading("Efficient Tracking");
      setSubHeading(
        "get real-time data for your gift cards. Never wonder about your gift card balance again! Our system provides instant, up-to-date information on your card’s value, transaction history, and activation status so you can shop with confidence."
      );
    } else if (currentSection === 2) {
      setHeading("Enhanced features for your convenience.");
      setSubHeading(
        "Securely track all your gift card balances, expiry dates, and transactions in one without the hassle, no more lost cards or surprise declines!"
      );
    } else {
      setHeading("Get Started");
      setSubHeading("get more details about your giftcard now.");
    }
  }, [currentSection]);

  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="">
      <main className="relative min-h-screen sm:max-h-screen flex flex-col gap-[32px] items-center justify-center row-start-2 sm:items-start">
        <div className="absolute w-full max-h-[620px] overflow-hidden self-start top-0">
          <Image
            className="dark:invert mb-3 object-cover"
            src="/assets/banner.png"
            alt="Next.js logo"
            width={1330}
            height={720}
          />
        </div>

        <div className="bg-[#000000] flex items-center justify-start pt-20  w-full flex-col  min-h-[400px] sm:min-h-[500px] absolute bottom-0 rounded-tl-2xl rounded-tr-2xl">
          <h1 className=" text-xl sm:text-3xl font-bold my-3 text-center">
            {heading}
          </h1>
          <p className="sm:w-[500px] sm:text-[18px] text-[15px] text-center w-[320px] min-h-[96px]">
            {subHeading}
          </p>

          <div className="flex space-x-2 items-center justify-center z-30 my-7">
            {/* <div
              className={`w-[10px] h-[10px] bg-[#fff]/70`}
              onClick={() => setCurrentSection(1)}
            ></div> */}
            <div
              className={`w-[10px] h-[10px] ${
                currentSection === 1 ? "bg-[#fff]/70" : "bg-[#fff]/20"
              } rounded-full`}
              onClick={() => setCurrentSection(1)}
            ></div>
            <div
              className={`w-[10px] h-[10px] ${
                currentSection === 2 ? "bg-[#fff]/70" : "bg-[#fff]/20"
              } rounded-full`}
              onClick={() => setCurrentSection(2)}
            ></div>
            <div
              className={`w-[10px] h-[10px] ${
                currentSection === 3 ? "bg-[#fff]/70" : "bg-[#fff]/20"
              } rounded-full`}
              onClick={() => setCurrentSection(3)}
            ></div>
          </div>
          <div>
            {currentSection !== 3 && (
              <button
                className="p-3 rounded-[15px] text-[#fff] mt-3 bg-[#256785] w-[200px]"
                onClick={() => setCurrentSection((prev) => prev + 1)}
              >
                {" "}
                Next{" "}
              </button>
            )}
            {currentSection >= 3 && (
              <button
                className="p-3 rounded-[15px] text-[#fff] mt-3 bg-[#256785] w-[200px]"
                onClick={() => router.push("/verifyform")}
              >
                {" "}
                Get Started{" "}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
