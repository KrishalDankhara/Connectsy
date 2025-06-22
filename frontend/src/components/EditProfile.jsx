import axios from "axios";
import { X, Check } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const { darkMode } = useOutletContext();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age || 18);
  const [about, setAbout] = useState(user.about || "");
  const [gender, setGender] = useState(user.gender || "other");
  const [error, setError] = useState("");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [photos, setPhotos] = useState(user.photos || []);
  const [showToast, setShowToast] = useState(false);
  const [deletingPhotoURL, setDeletingPhotoURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const scrollToPreview = () => {
    cardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleDeletePhoto = async (urlToDelete) => {
    setDeletingPhotoURL(urlToDelete);
    try {
      await axios.delete(`${BASE_URL}/profile/delete-photo`, {
        data: { photoURL: urlToDelete },
        withCredentials: true,
      });
      setPhotos((prev) => prev.filter((url) => url !== urlToDelete));
      if (photoURL === urlToDelete) {
        setPhotoURL("");
      }
    } catch (err) {
      console.error("Failed to delete photo:", err);
      setError("Could not delete photo. Please try again.");
    } finally {
      setDeletingPhotoURL(null);
    }
  };

  const uploadSinglePhoto = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("photos", file);

    try {
      await axios.post(`${BASE_URL}/profile/upload-photos`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const response = await axios.get(`${BASE_URL}/profile/getPhotos`, {
        withCredentials: true,
      });

      setPhotos(response.data.photos);
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError("Could not upload photo. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setError("");

    if (photos.length < 2) {
      setError("Select at least 2 photos to complete your bio.");
      return;
    }

    if (photos.length > 6) {
      setError("Max limit is 6 photos.");
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName,
          lastName,
          age,
          about,
          gender,
          photoURL,
          skills,
          photos,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      navigate("/");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data || "Failed to save profile.");
    }
  };

  return (
    <div className="flex justify-center relative flex-col items-center">
      {uploading && (
        <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center backdrop-blur-sm rounded-lg">
          <div className="text-white text-lg flex items-center gap-2">
            <span className="loading loading-spinner"></span>
            <span>Uploading image...</span>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-4 md:hidden">
        <button
          onClick={scrollToPreview}
          className="btn btn-outline btn-accent text-sm"
        >
          Preview Profile
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center md:space-x-10 my-10 mx-4 md:mx-10 gap-10 md:gap-0">
        {/* Form Card */}
        <div
          className={`w-full md:w-[450px] card shadow-lg border transition-colors duration-500 ${
            darkMode
              ? "bg-slate-700 border-gray-600 text-white"
              : "bg-pink-100 text-black"
          }`}
        >
          <div className="card-body">
            <h2 className="card-title flex justify-center">Edit Profile</h2>
            <div>
              {[ 
                { label: "First Name", value: firstName, onChange: setFirstName },
                { label: "Last Name", value: lastName, onChange: setLastName },
                { label: "Age", value: age, onChange: setAge, type: "number" },
              ].map(({ label, value, onChange, type = "text" }) => (
                <fieldset className="mb-3" key={label}>
                  <legend className="text-sm font-medium mb-1">{label}</legend>
                  <input
                    type={type}
                    className={`input input-bordered w-full ${
                      darkMode ? "bg-gray-800 text-white border-gray-600" : ""
                    }`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </fieldset>
              ))}

              {/* Profile Photo URL Input */}
              <fieldset className="mb-3">
                <legend className="text-sm font-medium mb-1">
                  Profile Picture URL (optional)
                </legend>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    darkMode ? "bg-gray-800 text-white border-gray-600" : ""
                  }`}
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="Paste an image URL or select below"
                />
              </fieldset>

              {/* Select from uploaded photos */}
              {photos.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs mb-1 text-gray-500">
                    Or select one of your uploaded photos:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPhotoURL(url)}
                        className={`w-14 h-14 rounded-md border-2 cursor-pointer relative ${
                          photoURL === url
                            ? "border-green-500 ring ring-green-400"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={url}
                          alt="Profile option"
                          className="w-full h-full object-cover rounded-md"
                        />
                        {photoURL === url && (
                          <div className="absolute top-0 right-0 bg-green-500 rounded-bl-sm text-white p-[2px]">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender */}
              <fieldset className="mb-3">
                <legend className="text-sm font-medium mb-1">Gender</legend>
                <select
                  className={`select select-bordered w-full ${
                    darkMode ? "bg-gray-800 text-white border-gray-600" : ""
                  }`}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </fieldset>

              {/* Skills */}
              <fieldset className="mb-3">
                <legend className="text-sm font-medium mb-1">Skills</legend>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className={`input input-bordered flex-1 ${
                      darkMode ? "bg-gray-800 text-white border-gray-600" : ""
                    }`}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <button
                    className={`btn btn-sm ${
                      darkMode ? "btn-primary" : "btn-warning"
                    }`}
                    onClick={addSkill}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {skill}
                      <button
                        className="ml-2 hover:text-red-500"
                        onClick={() => removeSkill(skill)}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </fieldset>

              {/* About */}
              <fieldset className="mb-3">
                <legend className="text-sm font-medium mb-1">About</legend>
                <textarea
                  className={`textarea textarea-bordered w-full ${
                    darkMode ? "bg-gray-800 text-white border-gray-600" : ""
                  }`}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="3"
                />
              </fieldset>

              {/* Photos Upload Section */}
              <fieldset className="mb-3">
                <legend className="text-sm font-medium mb-1">
                  Profile Photos
                </legend>
                <p className="text-xs text-gray-500 mb-2">
                  You can upload up to 6 photos. Click <strong>+</strong> to
                  add more.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, index) => {
                    const imageURL = photos[index];
                    return (
                      <div
                        key={index}
                        className="relative w-24 h-24 rounded-lg border flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                      >
                        {imageURL ? (
                          <>
                            <img
                              src={imageURL}
                              alt={`Uploaded ${index}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {deletingPhotoURL === imageURL && (
                              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg text-white text-sm">
                                <span className="loading loading-spinner mb-1"></span>
                                <span>Deleting...</span>
                              </div>
                            )}
                            <button
                              className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 text-black hover:text-white p-1 rounded-full transition-opacity"
                              onClick={() => handleDeletePhoto(imageURL)}
                              title="Delete Photo"
                              disabled={
                                deletingPhotoURL === imageURL || uploading
                              }
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <label
                            htmlFor={`photoInput-${index}`}
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
                              +
                            </span>
                            <input
                              id={`photoInput-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  uploadSinglePhoto(file);
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {error && <p className="text-red-500">{error}</p>}

              <div className="card-actions justify-center m-2">
                <button className="btn btn-secondary" onClick={saveProfile}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 relative mt-6 md:mt-0" ref={cardRef}>
          <div className={`${uploading ? "blur-sm pointer-events-none" : ""}`}>
            <UserCard
              user={{
                firstName,
                lastName,
                age,
                about,
                gender,
                photoURL,
                skills,
                photos,
                isVerified: user.isVerified,
              }}
            />
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile Saved Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
