'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChat, Message } from '@/contexts/ChatContext';
import {
  FiSend,
  FiPaperclip,
  FiImage,
  FiCheck,
  FiCheckCircle,
  FiMessageCircle,
  FiPackage,
  FiUser,
  FiFileText,
} from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { FETCH_CHAT_MESSAGES, UPLOAD_FILE } from '@/app/chat/redux/chatsAction';
import { clearFileUrl } from '@/app/chat/redux/chatsSlice';
import PackageDropdown from './PackageDropdown';
import { SENDER_PACKAGES } from '@/app/sender/dashboard/redux/packagesAction';
import { PackageInformation } from './SenderPackageInformation';
import { MakeOfferComponent } from './MakeAnOffer';
import TravelerPackageInformation from './TravelerPackageInformation';
import { TRAVELER_PACKAGES } from '@/app/traveler/redux/tripsAction';
import TravelerPackageDropdown from './TravelerPackageDropdown';
import { CREATE_ORDER } from '@/app/sender/dashboard/redux/orderAction';
import { clearOrdersState } from '@/app/sender/dashboard/redux/orderSlice';

// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
  isSender,
  roomId,
  senderId,
}: {
  message: Message;
  isOwn: boolean;
  isSender: boolean;
  roomId: string;
  senderId?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPDF = message.fileUrl?.endsWith('.pdf');
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}${message.fileUrl}`;
  console.log('message bubble', message);
  // dispatch
  const dispatch = useDispatch();

  // Trigger update status event
  const handleUpdateOfferStatus = (status: string) => {
    const socket = getSocket();
    const payload = {
      messageId: message.id,
      roomId: roomId,
      offerStatus: status,
    };
    console.log('Emitting update_offer_status event with:', payload);
    socket.emit('update_offer_status', payload);
  };

  // Function to handle Place Order action
  const handlePlaceOrderClick = async () => {
    console.log('Handle place order');
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle Place Order
  const confirmPlaceOrder = (e) => {
    e.preventDefault();

    if (!message?.travelerPkgId || !message?.senderPkgId || !senderId) {
      alert('Both Traveler and Sender packages are required');
      return;
    }
    const payload = {
      senderId: senderId,
      traveler_package_id: message?.travelerPkgId,
      sender_package_id: message?.senderPkgId,
    };
    dispatch({ type: CREATE_ORDER, payload });
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* File Handling: If the message contains a file */}
        {message.fileUrl && (
          <div className="max-w-xs rounded-lg bg-gray-800 p-2">
            {isPDF ? (
              // PDF Preview as a link
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <FiFileText className="w-5 h-5 text-white" />
                <span>View PDF</span>
              </a>
            ) : (
              // Display Image Preview
              <img
                src={fileUrl}
                alt="Message content"
                className="max-w-full max-h-60 object-cover rounded-lg"
              />
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
        >
          {/* {message.content} */}
          {message.message}
        </div>

        {/* Offer Buttons (Appear Below the Message on Hover) */}
        {message?.isOffer && !isOwn && message?.offerStatus === 'pending' && (
          <motion.div
            className="mt-2 flex space-x-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {/* Accept Button */}
            <button
              className="px-2 py-2 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-green-500/50"
              onClick={() => handleUpdateOfferStatus('approved')}
            >
              ✅ Accept
            </button>

            {/* Decline Button */}
            <button
              className="px-5 py-2 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-red-500/50"
              onClick={() => handleUpdateOfferStatus('declined')}
            >
              ❌ Decline
            </button>
          </motion.div>
        )}

        {/* Status Display After Accept/Decline */}
        {message?.offerStatus === 'approved' && (
          <div className="px-2 py-2 rounded-xl bg-gradient-to-r text-white font-semibold flex justify-center">
            {!isOwn ? '✅ You accepted the offer' : '✅ Offer accepted'}
          </div>
        )}
        {message?.offerStatus === 'declined' && (
          <div className="mt-2 text-red-400">
            {!isOwn ? '❌ You declined the offer' : '❌ Offer declined'}
          </div>
        )}

        {/* Place Order Button After Accept/Decline */}
        {message?.offerStatus === 'approved' &&
          isSender &&
          message?.senderPkgId &&
          message?.travelerPkgId && (
            <motion.div
              className="mt-2 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                className="px-5 py-2 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-blue-500/50"
                onClick={handlePlaceOrderClick}
              >
                🛒 Place Order
              </button>
            </motion.div>
          )}

        {/* Timestamp & Status */}
        <div
          className={`flex items-center mt-1 text-xs text-gray-400 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {isOwn && (
            <span className="ml-2 flex items-center">
              {message.status === 'sent' && <FiCheck className="w-3 h-3" />}
              {message.status === 'delivered' && (
                <div className="flex">
                  <FiCheck className="w-3 h-3" />
                  <FiCheck className="w-3 h-3 -ml-1" />
                </div>
              )}
              {message.status === 'read' && (
                <FiCheckCircle className="w-3 h-3 text-blue-400" />
              )}
            </span>
          )}
        </div>

        {/* Modal for Order Confirmation */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center max-w-sm w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Place Order
              </h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to place the order?
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmPlaceOrder}
                >
                  Place Order
                </motion.button>

                <motion.button
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Main Chat Window Component
export default function ChatWindow() {
  const { chatMessages: messages, file_url } = useSelector(
    (state) => state.chats
  );
  const fullFileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file_url}`;
  console.log('CHAT MESSAGES', messages);
  console.log('FILE URL from ui', fullFileUrl);

  const { activeConversation } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // new
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [showTripPackageDetails, setShowTripPackageDetails] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch user
  const { user } = useAuth();
  console.log('user', user);

  const otherUser = activeConversation
    ? activeConversation.participants.find(
        (participant) => participant.id !== user?.userId
      )
    : null;

  console.log('otherUser', otherUser);

  // testing with packages dropdowns =================>
  const { senderPackages } = useSelector((state) => state.packages); // sender packages for dropdown
  const { travelerPackages } = useSelector((state) => state.trips); // traveler packages for dropdown
  const [selectedSenderPackage, setSelectedSenderPackage] = useState('');
  const [selectedTravelerPackage, setSelectedTravelerPackage] = useState('');

  console.log('sender packages from chat window', senderPackages);
  console.log(
    'selected sender packages from chat window',
    selectedSenderPackage
  );
  console.log('traveler packages from chat window', travelerPackages);
  console.log(
    'selected traveler packages from chat window',
    selectedTravelerPackage
  );

  // populate the selected sender packages
  useEffect(() => {
    const packageId = messages?.length
      ? messages[messages.length - 1].senderPkgId || ''
      : '';
    console.log('default package id:', packageId);
    if (packageId) {
      setSelectedSenderPackage(packageId);
    } else {
      return;
    }
  }, [messages]);

  // populate the selected traveler packages
  useEffect(() => {
    const packageId = messages?.length
      ? messages[messages.length - 1].travelerPkgId || ''
      : '';
    console.log('default trip package id:', packageId);
    if (packageId) {
      setSelectedTravelerPackage(packageId);
    } else {
      return;
    }
  }, [messages]);

  const dispatch = useDispatch();

  // fetch sender packages
  useEffect(() => {
    console.log('inside fetch sender packages effect');
    dispatch({
      type: SENDER_PACKAGES,
      payload: { senderId: user?.userId },
    });
  }, []);

  // fetch messages related to selected packages
  console.log('active conversation', activeConversation);
  useEffect(() => {
    if (
      !selectedSenderPackage ||
      // !selectedTravelerPackage ||
      !activeConversation?.id
    )
      return;
    console.log('inside fetch context messages effect');
    dispatch({
      type: FETCH_CHAT_MESSAGES,
      payload: {
        roomId: activeConversation.id,
        senderPackageId: selectedSenderPackage,
        // travelerPackageId: selectedTravelerPackage,
      },
    });
  }, [selectedSenderPackage, activeConversation]);

  // fetch trip or traveler packages
  useEffect(() => {
    if (user?.permissions === 'traveler') {
      console.log('inside fetch traveler packages effect');
      dispatch({
        type: TRAVELER_PACKAGES,
        payload: { travelerId: user.userId },
      });
    }
  }, []); // Added dependencies

  // testing...... ====================================>

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // scroll to bottom of conversation
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle Image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({ type: UPLOAD_FILE, payload: file }); // Dispatch action with file
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string); // Set the image preview
      };
      reader.readAsDataURL(file); // Convert the file to base64 for preview
    }
  };

  if (!activeConversation || !otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <FiMessageCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  // Handle Send Message
  const handleSendMessage = () => {
    console.log('handle send message');

    if (newMessage.trim() || imagePreview) {
      const socket = getSocket();
      console.log('socket from send message', socket);
      console.log('user id from send message', otherUser.id);

      if (socket && otherUser.id) {
        socket.emit(
          'private_message',
          JSON.stringify({
            receiverId: otherUser.id,
            message: newMessage || 'Sent a file',
            fileUrl: imagePreview ? file_url : '',
            senderPkgId: selectedSenderPackage,
            travelerPkgId: selectedTravelerPackage,
          })
        );
        console.log(
          'Sent private message to:',
          otherUser.id,
          'Message:',
          newMessage,
          'senderPkgId:',
          selectedSenderPackage,
          'travelerPkgId:',
          selectedTravelerPackage
        );
      }
      setNewMessage('');
      setImagePreview(null);

      // Clear redux state
      dispatch(clearFileUrl());
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{otherUser.name}</h3>
            <p className="text-sm text-gray-400">
              {otherUser.status === 'online'
                ? 'Online'
                : `Last seen ${
                    otherUser.lastSeen
                      ? new Date(otherUser.lastSeen).toLocaleTimeString()
                      : 'recently'
                  }`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Package Selection dropdowns */}
          <div className="flex items-center space-x-3">
            {/* Sender Package Dropdown */}
            {user?.permissions === 'sender' && (
              <PackageDropdown
                label="Sender Package"
                options={senderPackages}
                selectedValue={selectedSenderPackage}
                onSelect={setSelectedSenderPackage}
              />
            )}

            {/* Traveler Package Dropdown */}
            {user?.permissions === 'traveler' && (
              <TravelerPackageDropdown
                label="Traveler Package"
                options={travelerPackages}
                selectedValue={selectedTravelerPackage}
                onSelect={setSelectedTravelerPackage}
              />
            )}
          </div>

          {/* package imformation : new */}
          <div className="flex items-center space-x-4">
            {/* Sender package button */}
            {selectedSenderPackage && (
              <button
                onClick={() => setShowPackageDetails((prev) => !prev)}
                className="text-gray-400 hover:text-white transition-colors"
                title="View Package Details"
              >
                <FiPackage className="w-6 h-6" />
              </button>
            )}

            {/* traveler package button */}
            {selectedTravelerPackage && (
              <button
                onClick={() => setShowTripPackageDetails((prev) => !prev)}
                className="text-gray-400 hover:text-white transition-colors"
                title="View Trip Package Details"
              >
                <MdFlight className="w-6 h-6" />
              </button>
            )}

            {/* Make offer button */}
            <button
              onClick={() => setShowNegotiation((prev) => !prev)}
              className="text-gray-400 hover:text-white transition-colors"
              title="View Profile"
            >
              <FiUser className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {showPackageDetails && (
          <PackageInformation
            onClose={() => setShowPackageDetails(false)}
            packageId={selectedSenderPackage}
          />
        )}

        {showTripPackageDetails && (
          <TravelerPackageInformation
            onClose={() => setShowTripPackageDetails(false)}
            packageId={selectedTravelerPackage}
          />
        )}

        {showNegotiation && (
          <MakeOfferComponent
            onClose={() => setShowNegotiation(false)}
            otherUser={otherUser}
            selectedSenderPackage={selectedSenderPackage}
            selectedTravelerPackage={selectedTravelerPackage}
          />
        )}

        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user?.userId}
            isSender={user?.permissions === 'sender'}
            roomId={activeConversation?.id}
            senderId={user?.permissions === 'sender' ? user?.userId : undefined}
          />
        ))}
        {/* {isTyping && (
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
            <span className="ml-2">{otherUser.name} is typing...</span>
          </div>
        )} */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-300"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-300"
          >
            <FiImage className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="Image preview"
                className="max-w-xs max-h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setImagePreview(null)} // Remove image preview if the user wants to select a new image
                className="absolute top-0 right-0 text-white bg-gray-500 p-1 rounded-full"
              >
                &times;
              </button>
            </div>
          )}

          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              rows={1}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // onClick={handleSend}
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
          >
            <FiSend className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
