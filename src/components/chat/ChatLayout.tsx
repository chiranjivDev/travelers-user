'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { FETCH_CHAT_MESSAGES } from '@/app/chat/redux/chatsAction';

export default function ChatLayout() {
  // fetch active chat messages
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: FETCH_CHAT_MESSAGES,
  //     payload: {
  //       roomId:
  //         '287187d7-14df-4aab-ba89-f6752e3b8ee2_82921eb3-bdb6-4a1b-a640-890c7190a04a',
  //     },
  //   });
  // }, []);

  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-900">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
