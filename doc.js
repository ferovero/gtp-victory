// ?? States :
// !! ==================== 1. setChatSlugConversation && chatSlugConversation  ===========================:
// ?? 1.1: setChatSlugConversation({ id: slug, name: "" }); --> when slug params update --> in  Dashboard-layout.jsx
// ?? 1.2: setChatSlugConversation(null); --> when to click on New Chat Button so clear that chatSlugConversation State --> in Dashboard-layout.jsx
// ?? 1.3: setChatSlugConversation(conversation); --> When created conversation give successfull response then creating a new conversation (in conversation have {id: conversationId, name: conversation_name}); --> in chat-board.jsx

// ?? 1.4: chatSlugConversation; --> using this to check active conversation in asidebar (sent props from Dashboard.jsx --> Asidebar component --> Conversations component --> ConversationItem --> checking :isActive={chatSlugConversation?.id === conversation.id}
// ?? 1.5: chatSlugConversation; --> using this state in chat-board.jsx when to submit Message then to check is chatSlugConversation state found then we know that slug is active so we have to call he append message mutation fn and if chatSlugConversation is empty then we have to call new chat creation mutation fn.
// ?? 1.1
// ?? 1.1