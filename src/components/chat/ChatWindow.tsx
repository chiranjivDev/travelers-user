'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, Message } from '@/contexts/ChatContext';
import {
  FiSend,
  FiPaperclip,
  FiImage,
  FiMoreVertical,
  FiCheck,
  FiCheckCircle,
  FiMessageCircle,
  FiPackage,
  FiUser,
  FiMap,
  FiCalendar,
  FiShield,
  FiClock,
  FiTruck,
  FiInfo,
  FiDollarSign,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
        >
          {/* {message.content} */}
          {message.message}
        </div>
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
      </div>
    </motion.div>
  );
}

export default function ChatWindow() {
  // redux
  const { chatMessages: messages } = useSelector((state) => state.chats);
  console.log('CHAT MESSAGES', messages);
  // redux

  const {
    activeConversation,
    // messages,
    users,
    sendMessage,
    isTyping,
    setIsTyping,
  } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // new
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);

  // const otherUser = activeConversation
  //   ? users.find(user =>
  //       activeConversation.participants.includes(user.id) && user.id !== '1'
  //     )
  //   : null

  // Fetch user
  const { user } = useAuth();
  console.log('user', user);

  const otherUser = activeConversation
    ? activeConversation.participants.find(
        (participant) => participant.id !== user?.userId
      )
    : null;

  console.log('otherUser', otherUser);
  // test end

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage(
          file.name,
          file.type.startsWith('image/') ? 'image' : 'file'
        );
      };
      reader.readAsDataURL(file);
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

  // New Implementations
  // Handle Send Message
  const handleSendMessage = () => {
    console.log('handle send message');

    if (newMessage.trim()) {
      const socket = getSocket();
      console.log('socket from send message', socket);
      console.log('user id from send message', otherUser.id);

      if (socket && otherUser.id) {
        socket.emit(
          'private_message',
          JSON.stringify({
            receiverId: otherUser.id,
            message: newMessage,
          })
        );
        console.log(
          'Sent private message to:',
          otherUser.id,
          'Message:',
          newMessage
        );
      }
      setNewMessage('');
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
        {/* package imformation : new */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPackageDetails((prev) => !prev)}
            className="text-gray-400 hover:text-white transition-colors"
            title="View Package Details"
          >
            <FiPackage className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowNegotiation((prev) => !prev)}
            className="text-gray-400 hover:text-white transition-colors"
            title="View Profile"
          >
            <FiUser className="w-6 h-6" />
          </button>
        </div>
        {/* <button className="p-2 hover:bg-gray-800 rounded-full">
          <FiMoreVertical className="w-5 h-5 text-gray-400" />
        </button> */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {showPackageDetails && (
          <PackageInformation onClose={() => setShowPackageDetails(false)} />
        )}

        {showNegotiation && (
          <MakeOfferComponent
            onClose={() => setShowNegotiation(false)}
            otherUser={otherUser}
          />
        )}

        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            // isOwn={message.senderId === '1'}
            isOwn={message.senderId === user?.userId}
          />
        ))}
        {isTyping && (
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
            <span className="ml-2">{otherUser.name} is typing...</span>
          </div>
        )}
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

// Package Info Component:
export function PackageInformation({ onClose }) {
  const handleClose = useCallback(
    (e: React.MouseEvent | KeyboardEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key !== 'Escape') {
        return;
      }
      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleClose);
    return () => document.removeEventListener('keydown', handleClose);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gray-900 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          aria-label="Close dialog"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="pr-12">
          <h2 className="text-xl font-semibold mb-6">Package Details</h2>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FiPackage className="text-blue-400" />
              <span className="font-medium">ID:</span>
              <span className="text-gray-300">id</span>
            </div>

            <div className="flex items-center gap-2">
              <FiMap className="text-green-400" />
              <span className="font-medium">Route:</span>
              <span className="text-gray-300">origin → destination</span>
            </div>

            <div className="flex items-center gap-2">
              <FiCalendar className="text-purple-400" />
              <span className="font-medium">Delivery Date:</span>
              <span className="text-gray-300"> date</span>
            </div>

            <div className="flex items-center gap-2">
              <FiDollarSign className="text-yellow-400" />
              <span className="font-medium">Price:</span>
              <span className="text-gray-300">$ price</span>
            </div>
          </div>

          {/* Package Specifications */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400">Weight:</span>
                <div className="text-white">10 kg</div>
              </div>
              <div>
                <span className="text-gray-400">Dimensions:</span>
                <div className="text-white">10x 10x 10</div>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <div className="text-white">category</div>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <div className="text-white capitalize">status</div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3">Services</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <FiShield
                  className={true ? 'text-green-400' : 'text-gray-500'}
                />
                <span>Insurance</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock
                  className={true ? 'text-green-400' : 'text-gray-500'}
                />
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck
                  className={true ? 'text-green-400' : 'text-gray-500'}
                />
                <span>Tracking</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {true && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-3">
                Special Instructions
              </h3>
              <div className="bg-gray-800 p-3 rounded-lg">
                <FiInfo className="inline-block mr-2 text-blue-400" />
                special instructions
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Make offer
export function MakeOfferComponent({ onClose, otherUser }) {
  const [price, setPrice] = useState('100'); // Hardcoded price
  const [date, setDate] = useState('2025-03-01'); // Hardcoded date
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'insurance',
  ]); // Hardcoded selected services
  const [note, setNote] = useState(''); // Empty note

  const services = [
    {
      id: 'insurance',
      name: 'Insurance',
      icon: <FiShield />,
      price: 5, // Hardcoded price
      description: 'Full coverage for your package',
    },
    {
      id: 'priority',
      name: 'Priority Delivery',
      icon: <FiClock />,
      price: 10, // Hardcoded price
      description: 'Faster delivery time',
    },
    {
      id: 'tracking',
      name: 'Live Tracking',
      icon: <FiTruck />,
      price: 3, // Hardcoded price
      description: 'Real-time package location',
    },
  ];

  const calculateTotal = () => {
    const basePrice = Number(price) || 0;
    const servicesTotal = selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + servicesTotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form data
    const formData = {
      price,
      date,
      selectedServices,
      note, // Note as the message
      total: calculateTotal(),
    };
    console.log('form data', formData);
    // Trigger the send message with form data
    handleSendMessage(formData);
    onClose();
  };

  // Handle Send Message
  const handleSendMessage = (formData: any) => {
    console.log('handle send message initiated'); // Log when the function is called

    // const message = formData.total; // Extracting the price as the message
    // console.log('Extracted message:', message); // Log the extracted message

    // Generate a custom message combining the field values
    const message = `
    Price: €${formData.price}
    Delivery Date: ${formData.date}
    Selected Services: ${formData.selectedServices.join(', ')}
    Note: ${formData.note}
    Total: €${formData.total}
  `;

    if (message.trim()) {
      // Check if message is not empty or whitespace
      console.log('Message is not empty. Proceeding to send.');

      const socket = getSocket(); // Getting the socket instance
      console.log('Socket instance:', socket); // Log the socket instance

      if (socket) {
        console.log('Socket is available. Emitting private message...');
        socket.emit(
          'private_message',
          JSON.stringify({
            receiverId: otherUser.id, // Logging the receiver's user ID
            message, // Sending the message (price in this case)
          })
        );
        console.log(
          'Sent private message to:',
          otherUser.id,
          'Message:',
          message
        );
      } else {
        console.error('Socket is not available.');
      }
    } else {
      console.warn('Message is empty. Not sending the message.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Make an Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (€)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiDollarSign />
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delivery Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiCalendar />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Additional Services
            </label>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices((prev) => [...prev, service.id]);
                        } else {
                          setSelectedServices((prev) =>
                            prev.filter((id) => id !== service.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={service.id}
                      className="ml-3 flex items-center cursor-pointer"
                    >
                      <span className="text-gray-400 mr-2">{service.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {service.description}
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="text-sm text-gray-300">€{service.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Add a note to your offer..."
            />
          </div>

          {/* Total */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-300">Total:</span>
              <span className="text-white">€{calculateTotal()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Send Offer
          </button>
        </form>
      </div>
    </div>
  );
}
