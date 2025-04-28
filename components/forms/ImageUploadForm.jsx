"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";

const ImageUploadForm = ({
  recipientEmail,
  senderEmail,
  image1,
  image2,
  title1,
  title2,
  field1,
  field2,
  setField1,
  setField2,
  pic,
}) => {
  // State for both image fields

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  // Handle image change for both fields
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setMessage({ text: "Please select only image files", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (fieldName === "field1") {
        setField1({
          image: file,
          preview: e.target.result,
        });
      } else {
        setField2({
          image: file,
          preview: e.target.result,
        });
      }
    };
    reader.readAsDataURL(file);
    setMessage({ text: "", type: "" });
  };

  // Remove image from either field
  const removeImage = (fieldName) => {
    if (fieldName === "field1") {
      setField1({ image: null, preview: null });
      if (fileInputRef1.current) fileInputRef1.current.value = "";
    } else {
      setField2({ image: null, preview: null });
      if (fileInputRef2.current) fileInputRef2.current.value = "";
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-[300px] sm:max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border-dashed border border-black">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Form fields */}

        {/* Image Field 1 */}
        {pic === "front" && (
          <div className="mb-4 flex flex-col items-center justify-center ">
            <label
              className=" text-gray-700 mb-2 w-[200px] h-[120px] flex flex-col items-center justify-center"
              htmlFor="image1"
            >
              <FontAwesomeIcon
                icon={faCamera}
                className="mb-4 font-bold text-[40px]"
              />
              <span>{title1}</span>
            </label>
            <input
              type="file"
              id="image1"
              ref={fileInputRef1}
              onChange={(e) => handleImageChange(e, "field1")}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md hidden"
            />
            {field1.preview && (
              <div className="mt-2 relative group">
                <img
                  src={field1.preview}
                  alt="Preview 1"
                  className="w-full h-32 object-contain rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage("field1")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Image Field 2 */}
        {pic === "back" && (
          <div className="mb-4  flex flex-col items-center justify-center">
            <label
              className=" text-gray-700 mb-2 w-[200px] h-[120px] flex flex-col items-center justify-center"
              htmlFor="image2"
            >
              <FontAwesomeIcon
                icon={faCamera}
                className="mb-4 font-bold text-[40px]"
              />
              <span>{title2}</span>
            </label>
            <input
              type="file"
              id="image2"
              ref={fileInputRef2}
              onChange={(e) => handleImageChange(e, "field2")}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md hidden"
            />
            {field2.preview && (
              <div className="mt-2 relative group">
                <img
                  src={field2.preview}
                  alt="Preview 2"
                  className="w-full h-32 object-contain rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage("field2")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded-md text-white ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Sending..." : "Submit"}
        </button> */}

        {message.text && (
          <div
            className={`mt-3 p-2 rounded-md ${
              message.type === "error"
                ? "bg-red-100 text-red-800"
                : message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageUploadForm;
