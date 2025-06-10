/**
 * @typedef {Object} Message
 * @property {string} _id - Message ID
 * @property {string} senderId - ID of the sender
 * @property {string} receiverId - ID of the receiver
 * @property {string} text - Message content
 * @property {string} [image] - Optional image URL
 * @property {boolean} isRead - Whether the message has been read
 * @property {Date} createdAt - Message creation timestamp
 */

/**
 * @typedef {Object} ChatUser
 * @property {string} _id - User ID
 * @property {string} fullName - User's full name
 * @property {string} [profilePic] - Optional profile picture URL
 */

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
};

export const ChatEvents = {
  NEW_MESSAGE: 'newMessage',
  MESSAGE_READ: 'messageRead',
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
}; 