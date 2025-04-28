import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";

const ImageUploader = ({ recipientEmail, title }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const newImages = [...images];
    const newPreviews = [...previews];

    files.forEach((file) => {
      if (!file.type.match("image.*")) {
        setMessage("Please select only image files");
        return;
      }

      newImages.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
    setMessage("");
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Sending images...");

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("recipientEmail", recipientEmail);

      const response = await fetch("/api/sendemail", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setMessage("Images sent successfully!");
      setImages([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending images:", error);
      setMessage("Failed to send images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-4 bg-white rounded-lg shadow-md w-[400px] border-dashed border border-black">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 w-full flex items-center justify-center">
          <label
            className=" text-gray-700 mb-2 w-[200px] h-[120px] flex flex-col items-center justify-center"
            htmlFor="images"
          >
            <FontAwesomeIcon icon={faCamera} className="mb-4" />
            <span>{title}</span>
          </label>
          <input
            type="file"
            id="images"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className=" hidden w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {previews.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Preview
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {images.length} image(s) selected
          </span>
          <button
            type="submit"
            disabled={isLoading || images.length === 0}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading || images.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send Images"}
          </button>
        </div> */}

        {message && (
          <p
            className={`mt-3 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;
