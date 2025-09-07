import { useState, useRef } from "react";
import { X, Image, Upload, Trash2, Type, Palette } from "lucide-react";
import usePostStore from "../store/usePostStore";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [game, setGame] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [postType, setPostType] = useState("text"); // "text" or "media"
  const [textBackground, setTextBackground] = useState({
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff"
  });

  const fileInputRef = useRef(null);
  const { createPost, loading } = usePostStore();
  const { authUser } = useAuthStore();

  // Text background templates
  const textBackgroundTemplates = [
    { id: 1, name: "Blue", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", textColor: "#ffffff" },
    { id: 2, name: "Sunset", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", textColor: "#ffffff" },
    { id: 3, name: "Ocean", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", textColor: "#ffffff" },
    { id: 4, name: "Forest", color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", textColor: "#ffffff" },
    { id: 5, name: "Purple", color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", textColor: "#333333" },
    { id: 6, name: "Dark", color: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)", textColor: "#ffffff" },
    { id: 7, name: "Warm", color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", textColor: "#333333" },
    { id: 8, name: "Cool", color: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", textColor: "#333333" }
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...images, ...files];
      setImages(newImages);
      
      // Generate previews
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleTextBackgroundSelect = (background) => {
    setTextBackground({
      color: background.color,
      textColor: background.textColor
    });
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
    if (type === "text") {
      setImages([]);
      setImagePreviews([]);
    }
  };

  const generateTextImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Fill background
    ctx.fillStyle = textOverlay.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.font = `${textOverlay.fontSize}px ${textOverlay.fontFamily}`;
    ctx.fillStyle = textOverlay.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text
    ctx.fillText(textOverlay.text, canvas.width / 2, canvas.height / 2);
    
    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    const postData = {
      content: content.trim(),
      tags,
      game,
      isPublic,
      textBackground: postType === "text" ? textBackground : null,
      images: postType === "media" ? imagePreviews : []
    };

    const result = await createPost(postData);
    
    if (result.success) {
      // Reset form
      setContent("");
      setTags("");
      setGame("");
      setIsPublic(true);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setContent("");
    setTags("");
    setGame("");
    setIsPublic(true);
    setImages([]);
    setImagePreviews([]);
    setPostType("text");
    setTextBackground({
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff"
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="avatar"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-medium">{authUser?.fullName}</p>
              <p className="text-sm text-base-content/60">
                @{authUser?.email.split("@")[0]}
              </p>
            </div>
          </div>

          {/* Post Type Selector */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => handlePostTypeChange("text")}
                className={`btn btn-sm ${postType === "text" ? "btn-primary" : "btn-outline"}`}
              >
                <Type className="w-4 h-4" />
                Text Post
              </button>
              <button
                type="button"
                onClick={() => handlePostTypeChange("media")}
                className={`btn btn-sm ${postType === "media" ? "btn-primary" : "btn-outline"}`}
              >
                <Image className="w-4 h-4" />
                Media Post
              </button>
            </div>
          </div>

          {/* Content - Text Post */}
          {postType === "text" && (
            <div className="mb-6">
              <div 
                className="w-full h-48 rounded-lg p-4 border-2 border-dashed border-base-300 relative overflow-hidden"
                style={{ 
                  background: textBackground.color,
                  color: textBackground.textColor
                }}
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-lg font-medium placeholder-white/70"
                  style={{ color: textBackground.textColor }}
                  maxLength={2000}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-base-content/60">
                  {content.length}/2000 characters
                </span>
              </div>
            </div>
          )}

          {/* Content - Media Post */}
          {postType === "media" && (
            <div className="mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="textarea textarea-bordered w-full h-32 resize-none text-lg"
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-base-content/60">
                  {content.length}/2000 characters
                </span>
              </div>
            </div>
          )}

          {/* Text Background Picker - Only for Text Post */}
          {postType === "text" && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Choose Background Style</h3>
              <div className="grid grid-cols-4 gap-2">
                {textBackgroundTemplates.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleTextBackgroundSelect(bg)}
                    className={`h-12 rounded-lg border-2 transition-colors ${
                      textBackground.color === bg.color 
                        ? "border-primary" 
                        : "border-transparent hover:border-base-300"
                    }`}
                    style={{ background: bg.color }}
                  >
                    <span className="text-xs font-medium" style={{ color: bg.textColor }}>
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Upload - Only for Media Post */}
          {postType === "media" && (
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Images
                </button>
              </div>

              {/* Image Grid - Fixed aspect ratio container */}
              {imagePreviews.length > 0 && (
                <div className="mb-4">
                  <div className="w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {/* Multiple Images Layout */}
                    <div className="w-full h-full grid gap-1">
                      {imagePreviews.length === 1 && (
                        <img
                          src={imagePreviews[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {imagePreviews.length === 2 && (
                        <>
                          <img
                            src={imagePreviews[0]}
                            alt="Preview 1"
                            className="w-full h-full object-cover"
                          />
                          <img
                            src={imagePreviews[1]}
                            alt="Preview 2"
                            className="w-full h-full object-cover"
                          />
                        </>
                      )}
                      {imagePreviews.length === 3 && (
                        <>
                          <img
                            src={imagePreviews[0]}
                            alt="Preview 1"
                            className="w-full h-full object-cover"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={imagePreviews[1]}
                              alt="Preview 2"
                              className="w-full h-full object-cover"
                            />
                            <img
                              src={imagePreviews[2]}
                              alt="Preview 3"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </>
                      )}
                      {imagePreviews.length >= 4 && (
                        <>
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={imagePreviews[0]}
                              alt="Preview 1"
                              className="w-full h-full object-cover"
                            />
                            <img
                              src={imagePreviews[1]}
                              alt="Preview 2"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={imagePreviews[2]}
                              alt="Preview 3"
                              className="w-full h-full object-cover"
                            />
                            <div className="relative">
                              <img
                                src={imagePreviews[3]}
                                alt="Preview 4"
                                className="w-full h-full object-cover"
                              />
                              {imagePreviews.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <span className="text-white text-2xl font-bold">
                                    +{imagePreviews.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Image Remove Buttons */}
                  {imagePreviews.map((preview, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {/* Compact Tags and Game */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (gaming, fun, etc.)"
                className="input input-bordered w-full input-sm"
              />
            </div>
            <div>
              <input
                type="text"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                placeholder="Game (optional)"
                className="input input-bordered w-full input-sm"
              />
            </div>
          </div>

          {/* Privacy Checkbox */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm">Make this post public</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
