{/* New chat Refrences */ }
{/* <div
                style={{
                  marginBottom: "0.75rem",
                }}
              >
                {latestCreatedConversation?.id && (
                  <ConversationItem
                    key={latestCreatedConversation.id}
                    conversation={latestCreatedConversation}
                    editable={false}
                  />
                )}
              </div> */}

// Dashboard Layout
//   const latestCreatedConversation = useMemo(() => {
//     const conversations = conversationsData?.conversations;
//     return !conversationsLoading && conversations?.length > 0
//       ? conversations.filter((i) => i?._count?.messages == 0)[0]
//       : null;
//   }, [conversationsData]);

//   const chatSlugConversation = useMemo(() => {
//     const conversations = conversationsData?.conversations;
//     return !conversationsLoading && conversations?.length > 0
//       ? conversations.filter((i) => i.id == slug)[0]
//       : null;
//   }, [conversationsData, slug]);


// //   Window scroll to top
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   });

// Dashboard layout 28 no line approx

//   check is the latest post have any message if not means it is blank space then no create any conversation space
//   useEffect(() => {
//     if (latestCreatedConversation?._count?.messages > 0) {
//       // creating new conversation space
//       createConversation(null);
//     } else {
//       setSelectedConversation(latestCreatedConversation);
//     }
//   }, [latestCreatedConversation]);











// ConversationItem
//   if (!editable) {
//     return (
//       <button
//         key={conversation.id}
//         className={css.css_9rto4r_builder_block}
//         style={{ background: "transparent" }}
//         onClick={handleConversationClick}
//       >
//         <span className="builder-block builder-9a1c16654f844cf7b9724e6aa4c438c7 builder-has-component css-vky7x4">
//           <span className={css.conversation_name}>{conversation.title}</span>
//         </span>
//       </button>
//     );
//   }









{/* Loading Button */ }
{/* {conversationsLoading && (
          <div
            className={css.css_1k2cfop_builder_block}
            builder-id="builder-07af320d54a04e37afcbca91e939cc3f"
          >
            <Loader className={css.spin_loader} />
            <span
              className="builder-block builder-ef542ba300ad4192b22cfc1150e2727f builder-has-component css-y2p0nr"
              builder-id="builder-ef542ba300ad4192b22cfc1150e2727f"
            >
              <span className="builder-text css-1qggkls"> Loading...</span>
            </span>
          </div>
        )}  */}


// Dashboard layout


// ?? Initial load of page = 1 only
//   useEffect(() => {
//     if (sidebarHeight > 0 && initialLoad) {
//       setInitialLoad(false);
//       //   debugger;
//       console.log("Setting Page :: Sidebar Height ");
//       setPage((prev) => prev + 1);
//     }
//   }, [sidebarHeight, initialLoad]);


// ?? to ensure when user give any slug then increase page to get tthat slug in conversations
//   useEffect(() => {
//     if (chatSlugConversation?.page) {
//       for (let page = chatSlugConversation.page; page >= 1; page--) {
// debugger;
//         console.log("Page updating in Chat Slug Conversation ");
//         setPage(page);
//       }
//     }
//   }, [chatSlugConversation]);



// console.log(conversationsData?.conversations);
// console.log(
//   "When Page",
//   page,
//   "then conversations is:",
//   conversationsData?.conversations
// );




// chat-board 59
// if (
//     lastMessage?.sender == "USER" &&
//     lastMessage.conversationId === conversationId
// ) {
//     // ?? here one more chance update user message so that we can sure about the user message has been added okay
//     prev = [
//         ...prev.map((messageItem, index) => {
//             if (
//                 index === prev.length - 1 &&
//                 messageItem.conversationId == conversationId
//             ) {
//                 return {
//                     id: Date.now(),
//                     conversationId: conversationId,
//                     content: userMessage,
//                     sender: "USER",
//                 };
//             }
//             return messageItem;
//         }),
//     ];
// } else {
//     // if by mistake there have no user message in the content box then add user Message
//     console.log("Fired");
//     if (res.conversationId === conversationId) {
//         prev.push(res.userMessage);
//     }
// }
// console.log(prev);
// return [...prev, { ...res.botMessage, animate: true }];
