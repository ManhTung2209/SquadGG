import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String, // URL from Cloudinary (legacy support)
    default: null
  },
  images: [{
    type: String // Array of image URLs from Cloudinary
  }],
  textBackground: {
    color: String, // Background gradient
    textColor: String // Text color
  },
  tags: [{
    type: String,
    trim: true
  }],
  game: {
    type: String,
    trim: true,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Post", postSchema);
