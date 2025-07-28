import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '~/lib/supabase';
import dayjs from 'dayjs';
import { Avatar, Button, Spin } from 'antd';
import { EllipsisOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';

// Number of messages to load per page
const MESSAGES_PER_PAGE = 300;
// Days to keep messages before applying date filter
const DAYS_TO_KEEP = 7;

export default function ManagerGroupChat({ isDarkMode }: { isDarkMode: boolean }) {
    const [getAuthID, setAuthID] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const groupChatId = 1;
    const user = { id: Number(getAuthID) };

    // Fetch messages with date filtering and pagination
    const fetchMessages = useCallback(async (initialLoad = false) => {
        setLoading(true);

        try {
            const cutoffDate = dayjs().subtract(DAYS_TO_KEEP, 'day').toISOString();

            let query = supabase
                .from('messages')
                .select('*, user:users(id, first_name, middle_name, last_name)')
                .eq('group_chat_id', groupChatId)
                .gt('created_at', cutoffDate) // Only get recent messages
                .order('created_at', { ascending: false })
                .limit(MESSAGES_PER_PAGE);

            // For pagination, get messages older than the oldest one we have
            if (!initialLoad && messages.length > 0) {
                const oldestMessageDate = messages[messages.length - 1].created_at;
                query = query.lt('created_at', oldestMessageDate);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                if (initialLoad) {
                    setMessages(data.reverse());
                } else {
                    setMessages(prev => [...prev, ...data.reverse()]);
                }
                setHasMore(data.length === MESSAGES_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [messages]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Initial load and realtime subscription
    useEffect(() => {
        setAuthID(localStorage.getItem('userAuthID') || '');
        fetchMessages(true);

        const subscription = supabase
            .channel('realtime:messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `group_chat_id=eq.${groupChatId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, []);

    // Load more messages when scrolling to top
    const handleScroll = useCallback(() => {
        if (messagesContainerRef.current) {
            const { scrollTop } = messagesContainerRef.current;
            if (scrollTop === 0 && !loading && hasMore) {
                fetchMessages();
            }
        }
    }, [loading, hasMore, fetchMessages]);

    // Send message with error handling
    const sendMessage = useCallback(async () => {
        if (!newMessage.trim()) return;

        try {
            const { error } = await supabase.from('messages').insert([
                {
                    content: newMessage,
                    user_id: user.id,
                    group_chat_id: groupChatId,
                },
            ]);

            if (error) throw error;

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [newMessage]);

    // Group messages by date for better organization
    const groupMessagesByDate = useCallback(() => {
        const grouped: Record<string, any[]> = {};

        messages.forEach(msg => {
            const date = dayjs(msg.created_at).format('MMMM D, YYYY');
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });

        return grouped;
    }, [messages]);

    const groupedMessages = groupMessagesByDate();

    return (
        <div className={`max-w-lg p-1 mx-auto rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex flex-col h-[450px]">
                {/* Chat messages area with scroll handling */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-t-lg relative"
                    onScroll={handleScroll}
                >
                    {/* Inner container for padding and content */}
                    <div className="p-2 h-full flex flex-col">
                        {loading && messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <Spin
                                    size="small"
                                    indicator={
                                        <LoadingOutlined
                                            style={{
                                                fontSize: 36,
                                                color: '#1890ff'
                                            }}
                                            spin
                                        />
                                    }
                                />
                            </div>
                        ) : (
                            <div className="flex-1">
                                {hasMore && (
                                    <div className="flex justify-center mb-4">
                                        <Button
                                            type="text"
                                            icon={<DownOutlined />}
                                            onClick={() => fetchMessages()}
                                            loading={loading}
                                        >
                                            Load Older Messages
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                        <div key={date} className="relative">
                                            {/* Sticky date header */}
                                            <div
                                                className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-center mb-2 mx-auto px-2 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400 w-fit"
                                                style={{
                                                    position: 'sticky',
                                                    top: '0',
                                                    marginTop: '-1px',
                                                    transform: 'translateZ(0)' // Fix for flickering in some browsers
                                                }}
                                            >
                                                {date}
                                            </div>

                                            {/* Messages for this date */}
                                            <div className="space-y-4">
                                                {dateMessages.map((msg) => {
                                                    const isOwn = msg.user_id === user.id;
                                                    const fullName = `${msg.user?.first_name || ''} ${msg.user?.last_name || ''}`.trim();

                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            {!isOwn && (
                                                                <Avatar
                                                                    size="small"
                                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.user?.first_name || 'U'}`}
                                                                    alt={msg.user?.first_name}
                                                                />
                                                            )}

                                                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                                                <span className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                                                    {isOwn ? 'You' : fullName || 'Unknown'}
                                                                </span>

                                                                <div
                                                                    className={`rounded-xl px-4 py-2 text-sm shadow-md whitespace-pre-wrap break-words ${isOwn
                                                                            ? 'bg-blue-600 text-white rounded-br-none'
                                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-bl-none'
                                                                        }`}
                                                                    style={{ maxWidth: '280px' }}
                                                                >
                                                                    {msg.content}
                                                                </div>

                                                                <span className="text-[10px] text-gray-400 mt-1">
                                                                    {dayjs(msg.created_at).format('h:mm A')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Message input - fixed at bottom */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex border-t pb-4 p-2 bg-white dark:bg-gray-800 rounded-b-lg"
                >
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}