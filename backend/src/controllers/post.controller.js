import Post from "../models/post.model.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, tags, game, isPublic, textBackground, images } = req.body;
    const authorId = req.user._id;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    // Process tags
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Create new post
    const newPost = new Post({
      content: content.trim(),
      author: authorId,
      tags: processedTags,
      game: game?.trim() || null,
      isPublic: isPublic !== false,
      textBackground: textBackground || null,
      images: images || []
    });

    await newPost.save();

    // Populate author information
    await newPost.populate('author', 'fullName email profilePic');

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all posts with infinite scroll
export const getAllPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastPostId = req.query.lastPostId; // ID của bài viết cuối cùng đã load

    let query = { isPublic: true };
    
    // Nếu có lastPostId, chỉ lấy bài viết cũ hơn
    if (lastPostId) {
      const lastPost = await Post.findById(lastPostId);
      if (lastPost) {
        query.createdAt = { $lt: lastPost.createdAt };
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'fullName email profilePic')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Kiểm tra xem còn bài viết nào không
    const hasMore = posts.length === limit;

    res.status(200).json({
      success: true,
      data: {
        posts,
        hasMore,
        lastPostId: posts.length > 0 ? posts[posts.length - 1]._id : null
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
