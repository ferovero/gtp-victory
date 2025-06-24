import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowUp, Loader, Square } from "lucide-react";
import { marked } from "marked";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import useConversation from "../hooks/use-conversation";
import {
  appendMessageMutationFn,
  createConversationMutationFn,
} from "../services/conversation";
import css from "../styles/dashboard.module.css";
import CollapseIcon from "./collapse-icon";
import { useGlobalContext } from "./global-context";
const quickQuestions = [
  "Top best performing stocks in last year?",
  "Trending insights and current market hypes?",
];
const ChatBoard = ({
  isWelcome,
  chatSlugConversation,
  setChatSlugConversation,
  setConversations,
  setIsWelcome,
  setIsCollapsed,
  isCollapsed,
}) => {
  const {
    content,
    setContent,
    isFetchSlugConversation,
    setIsFetchSlugConversation,
  } = useGlobalContext();
  const router = useRouter();
  const conversationId = chatSlugConversation?.id;
  console.log(isFetchSlugConversation);
//   debugger;
  const {
    data: conversation,
    isLoading: messagesLoading,
    status, // this represents is status == "error" means unable to fetch the conversation and this should handled sperately
  } = useConversation(conversationId, isFetchSlugConversation);
  const [error, setError] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [sender, setSender] = useState("USER");
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  // ??  Append Message to a conversation - mutation fn
  const { mutate: appendMessage, isPending: appendingMessagePending } =
    useMutation({
      mutationFn: appendMessageMutationFn,
      onSuccess: (res) => {
        console.log(res);
        setContent((prev) => [...prev, { ...res.botMessage, animate: true }]);
        setError(null);
      },
      onError: (error) => {
        // console.log(window.navigator.onLine);
        if (!window.navigator.onLine) {
          return setError({ message: "It seems you are offline." });
        }
        console.log(error);
        const message =
          error?.message ||
          error?.errorMessage ||
          "Something went wrong, please try again later.";
        setError({ message: message });
      },
    });
  // ?? create Conversation if there have no slug means chatSlugConversation is null means no slug is there and this is welcome case right so when user will fill message that will create conversation with mesasge and this will be handled on the server
  const { mutate: createConversation, isPending: creatingConversationPending } =
    useMutation({
      mutationFn: createConversationMutationFn,
      onSuccess: (res) => {
        const conversation = res.conversation;
        const botMessage = res.botMessage;
        setConversations((prev) => [conversation, ...prev]); // ?? updating conversations state to reflect the current conversation into asidebar
        setContent((prev) => [...prev, botMessage]); // ?? setting bot response
        // setChatSlugConversation(conversation);
        setIsFetchSlugConversation(false);
        router.push(`/dashboard/${conversation.id}`, undefined, {
          shallow: true,
        });
      },
      onError: (err) => {
        console.log(err);
        const message =
          err?.errorMessage || err?.message || "Something went wrong.";
        setError({ message: message });
      },
    });
  const autoHeight = useCallback((element, x) => {
    if (element.scrollHeight <= x) {
      element.style.height = "auto";
      return;
    }
    element.style.height = x + "px";
    element.style.height = element.scrollHeight + 2 + "px";
  }, []);
  //  ?? Controlling the messages textbox input
  const handleMessageChange = useCallback((e) => {
    autoHeight(textareaRef.current, 100);
    const message = e.target.value;
    setUserMessage(message);
  }, []);
  // ?? When to click on submit (updating content, calling appendMessage mutation fn, and reseting all state)
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!userMessage || userMessage == "") return;
    if (!window.navigator.onLine) {
      return setError({ message: "It seems you are offline." });
    }
    //  ?? When have slug then add the message and call append message mutation fn
    if (conversationId) {
      setContent((prev) => {
        // here i need an important lookup if user have sent mesage but bot didn't get bot response means the last message root is USER so replace that with the new message
        if (prev[prev.length - 1]?.sender == "USER") {
          return [
            ...prev.map((messageItem, index) => {
              if (index === prev.length - 1) {
                return {
                  conversationId: conversationId,
                  content: userMessage,
                  sender: "USER",
                };
              }
              return messageItem;
            }),
          ];
        }
        return [
          ...prev,
          {
            conversationId: conversationId,
            content: userMessage,
            sender: "USER",
          },
        ];
      });
      appendMessage({
        conversationId: conversationId,
        message: userMessage,
        sender: sender,
      });
    }
    // ?? when there have no any slug then i we have to create conversation with a message
    if (!conversationId) {
        createConversation({
          message: userMessage,
        });
      setContent([
        {
          content: userMessage,
          sender: "USER",
          animate: true,
        },
        {
          content: userMessage,
          sender: "BOT",
          animate: true,
        },
      ]); // ?? setting bot response
    }
    setIsWelcome(false);
    setUserMessage("");
    setError(null);
    textareaRef.current.value = "";
    autoHeight(textareaRef.current, 100);
  };
  // ??  If Messages are there then update content state to populate the messages
  useEffect(() => {
    if (conversation?.messages?.length > 0 && isFetchSlugConversation) {
      setContent(conversation.messages);
    }
  }, [conversation, isFetchSlugConversation]);
  //  ?? user message ref to scroll down
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" }); // or 'auto'
  }, [content, conversationId]);
  return (
    <div style={{ width: "100%", height: "100dvh", overflow: "auto" }}>
      <Link href="/profile" className="profile_circle"></Link>
      {isCollapsed && (
        <CollapseIcon
          onClick={() => setIsCollapsed(false)}
          style={{ marginTop: "2rem", marginLeft: "2rem", position: "fixed" }}
          className="collapsed_icon"
        />
      )}
      <div className={clsx(css.message_body, isWelcome && css.welcome)}>
        {(!isWelcome && chatSlugConversation?.title) ||
          (conversation?.title && (
            <div className={css.conversation_title_in_chatboard}>
              {chatSlugConversation?.title || conversation?.title}
            </div>
          ))}
        {status == "error" && (
          <div className={css.something_error}>
            Unable to fetch the Conversation, Please try again later.
          </div>
        )}
        {isWelcome && <WelcomeMessage quickQuestions={quickQuestions} />}
        {/* && !messagesLoading */}
        {!isWelcome && !messagesLoading && content?.length > 0 && (
          <div className="chat-responses">
            {content?.map((chat) => {
              const messageHtmlBody =
                chat.content && marked(chat.content || "");
              return (
                <div key={chat.id}>
                  {chat.sender == "BOT" ? (
                    <BotMessage messageBody={messageHtmlBody} key={chat.id} />
                  ) : (
                    <UserMessage
                      //   className={chat.animate && "slide_up"}
                      messageBody={messageHtmlBody}
                      key={chat.id}
                    />
                  )}
                </div>
              );
            })}
            {!isWelcome &&
              (appendingMessagePending || creatingConversationPending) && (
                <div>
                  <Loader className={css.spin_loader} />
                </div>
              )}
            {(!creatingConversationPending || !appendingMessagePending) &&
              error?.message && (
                <div className={css.something_error}>
                  {error?.message
                    ? error?.message
                    : "Something went wrong, please try again later"}
                </div>
              )}
            <div ref={endRef} />
          </div>
        )}
        {messagesLoading && (
          <div
            style={{
              width: "100%",
              height: "100dvh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader className="spin_loader" />
          </div>
        )}
        <MessageSubmit
          handleMessageChange={handleMessageChange} // ?? this handles the user input
          handleMessageSubmit={handleMessageSubmit} // ?? when to submit the message
          isPending={appendingMessagePending} // ?? Pending State when sending the message to server and waiting for response
          message={userMessage} // ?? userMessage state to make the message textbox controlled component or sync with the userMessage state so for that this need this state
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
};
const MessageSubmit = ({
  message,
  handleMessageChange,
  handleMessageSubmit,
  isPending,
  textareaRef,
}) => {
  return (
    <form className={css.message_form_container} onSubmit={handleMessageSubmit}>
      <textarea
        placeholder="Message..."
        value={message}
        onChange={handleMessageChange}
        className={css.message_textarea}
        disabled={isPending}
        ref={textareaRef}
      ></textarea>
      <button type="submit" id={css.message_submit_btn} disabled={isPending}>
        {!isPending && <ArrowUp />}
        {isPending && <Square />}
      </button>
    </form>
  );
};
const WelcomeMessage = ({ quickQuestions }) => {
  return (
    <div className={css.welcome_message}>
      <Logo variant="md" />
      <p className={css.welcome_p}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta deserunt
        pariatur a vel? <br /> Fugit quia eos doloribus et eligendi deserunt qui
        vitae odit quos.
      </p>
      <div className={css.welcome_quick_start_messages_container}>
        {quickQuestions?.length > 0 &&
          quickQuestions?.map((question) => (
            <button className={css.quick_start_node} key={question}>
              {question}
            </button>
          ))}
      </div>
    </div>
  );
};
const Logo = ({ variant, ...props }) => {
  return (
    <picture className={clsx(css.aside_bar_brand, css[variant])}>
      <source
        srcset="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
        type="image/webp"
      />
      <img
        alt="GPTVictory Logo"
        loading="lazy"
        fetchpriority="auto"
        src="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
        srcset="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
        sizes="160px"
        {...props}
      />
    </picture>
  );
};
const UserMessage = ({ messageBody, className }) => {
  return (
    <div className={clsx(css.user_chat_con, className)}>
      <div className={clsx(css.chat_message, css.user)}>
        {/* <Profile sender="USER" /> */}
        <div dangerouslySetInnerHTML={{ __html: messageBody }}></div>
      </div>
    </div>
  );
};
const BotMessage = ({ messageBody }) => {
  return (
    <div className={clsx(css.chat_message, css.bot)}>
      {/* <Profile sender="BOT" /> */}
      <div dangerouslySetInnerHTML={{ __html: messageBody }}></div>
    </div>
  );
};
const Profile = ({ sender }) => {
  return (
    <div
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "100%",
        background: "rgba(255,255,255,0.4)",
        overflow: "hidden",
      }}
    >
      {sender == "BOT" && <Logo style={{ height: "100%" }} />}
    </div>
  );
};
export default ChatBoard;
