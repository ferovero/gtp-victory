import { useMutation } from "@tanstack/react-query";
import {
  Check,
  Loader,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/router.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteConversationMutationFn,
  editConversationNameMutationFn,
} from "../../services/conversation.js";
import css from "../../styles/dashboard.module.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useOutsideClick from "../../hooks/use-outside-click.jsx";
import clsx from "clsx";
const Conversations = ({
  conversations,
  setConversations,
  chatSlugConversation,
  setIsFetchSlugConversation,
  sidebarRef,
  hasMore,
  loading,
  loadingRef,
}) => {
  const [isAnyDialogOpen, setIsAnyDialogOpen] = useState({ id: null });
  const [isRenameAnyOne, setIsRenameAnyOne] = useState({
    id: null,
    handlerFn: () => {},
  });
  return (
    <div ref={sidebarRef} className={css.asidebar_chats_menu}>
      {/* Chat Placeholder */}
      <span
        style={{
          fontSize: "0.815rem",
          color: "rgba(255, 255, 255, 0.4)",
        }}
      >
        Chats
      </span>
      <TransitionGroup>
        {conversations
          ?.filter((i) => i?._count?.messages > 0)
          .map((conversation) => (
            <CSSTransition
              key={conversation.id}
              timeout={500}
              classNames="slide-left"
              unmountOnExit
            >
              <ConversationItem
                conversation={conversation}
                setConversations={setConversations}
                isActive={chatSlugConversation?.id === conversation.id}
                setIsFetchSlugConversation={setIsFetchSlugConversation}
                setIsAnyDialogOpen={setIsAnyDialogOpen}
                isAnyDialogOpen={isAnyDialogOpen}
                setIsRenameAnyOne={setIsRenameAnyOne}
                isRenameAnyOne={isRenameAnyOne}
              />
            </CSSTransition>
          ))}
      </TransitionGroup>
      {/* Intersection observer target */}
      <div ref={loadingRef} className={css.conversations_loading}>
        {hasMore && (
          <>
            <Loader className="spin_loader" />
            {" Loading..."}
          </>
        )}
      </div>
      {!hasMore && !loading && (
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            userSelect: "none",
            marginTop: "0.5rem",
          }}
        >
          You covered all
        </div>
      )}
    </div>
  );
};

const ConversationItem = ({
  conversation,
  setConversations,
  isActive = false,
  setIsFetchSlugConversation,
  setIsAnyDialogOpen,
  isAnyDialogOpen,
  setIsRenameAnyOne,
  isRenameAnyOne,
}) => {
  const router = useRouter();
  const [rename, setRename] = useState(false);
  const handleConversationClick = useCallback(() => {
    if (!rename) {
      setIsFetchSlugConversation(true);
      router.push(`/dashboard/${conversation.id}`);
      return;
    }
  }, [rename]);
  const [title, setTitle] = useState("");
  const [inputMounted, setIsInputMounted] = useState(false);
  const [dialog, setDialogOpen] = useState(false);
  const [dialogPos, setDialogPos] = useState({ x: 0, y: 0 });
  const [editLoading, setIsEditLoading] = useState(false);
  const { mutate: editConversationTitle } = useMutation({
    mutationFn: editConversationNameMutationFn,
    onError: (error) => {
      console.log(error);
      setIsEditLoading(false);
    },
    onMutate: () => setIsEditLoading(true),
    onSettled: () => setIsEditLoading(false),
    onSuccess: (res) => {
      setTitle(res.title);
      setIsRenameAnyOne({ id: null, handlerFn: () => {} });
    },
  });
  const { mutate: deleteConversation, isPending: deleteConversationPending } =
    useMutation({
      mutationFn: deleteConversationMutationFn,
      onSuccess: (res) => {
        // console.log(res.conversationId);
        setConversations((prev) => [
          ...prev.filter(
            (conversationItem) => conversationItem.id !== res.conversationId
          ),
        ]);
      },
    });
  const startRenaming = (e) => {
    e.stopPropagation();
    setIsAnyDialogOpen({ id: null });
    setIsRenameAnyOne({
      id: conversation.id,
      handlerFn: (title) =>
        editConversationTitle({ title, conversationId: conversation.id }),
    });
  };
  const deleteConversationHandleFn = (e) => {
    e.stopPropagation();
    setIsAnyDialogOpen({ id: null });
    deleteConversation(conversation.id);
  };
  // ??  Initiate the name state with conversation name in start
  useEffect(() => {
    if (conversation.title) {
      setTitle(conversation.title);
    }
  }, [conversation]);
  const handleOpeningDialog = (e) => {
    e.stopPropagation();
    const parent = e.currentTarget.parentElement;
    const rect = parent.getBoundingClientRect();
    const windowInnerHeight = window.innerHeight;
    const dialogHeight = 100;
    if (windowInnerHeight - Math.floor(rect.bottom) >= dialogHeight) {
      setDialogPos({
        x: rect.right,
        y: rect.bottom, // 20px below the parent
      });
    } else {
      setDialogPos({
        x: rect.right,
        y: rect.bottom - dialogHeight, // 20px below the parent
      });
    }
    setIsAnyDialogOpen((prev) => {
      console.log(prev);
      if (prev?.id) {
        if (prev.id == conversation.id) {
          console.log("h");
          return { id: null };
        }
        console.log("h");
        return { id: conversation.id };
      }
      console.log("h");
      return { id: conversation.id };
    });
    console.log(window.screenY);
  };
  useEffect(() => {
    console.log(isAnyDialogOpen);
    if (isAnyDialogOpen?.id) {
      if (isAnyDialogOpen?.id == conversation.id) {
        setDialogOpen(true);
      } else {
        setDialogOpen(false);
      }
    } else {
      setDialogOpen(false);
    }
  }, [isAnyDialogOpen]);
  useEffect(() => {
    if (isRenameAnyOne?.id) {
      if (isRenameAnyOne?.id == conversation.id) {
        console.log("isRename");
        setRename(true);
      } else {
        setRename(false);
      }
    } else {
      setRename(false);
    }
  }, [isRenameAnyOne]);
  return (
    <button
      className={css.css_9rto4r_builder_block}
      style={{
        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
      }}
      disabled={editLoading}
      onClick={handleConversationClick}
    >
      {!rename && (
        <span
          className="builder-block builder-9a1c16654f844cf7b9724e6aa4c438c7 builder-has-component css-vky7x4"
          builder-id="builder-9a1c16654f844cf7b9724e6aa4c438c7"
        >
          <div className={css.conversation_name}>{title}</div>
        </span>
      )}
      {rename && (
        <RenameInputComponent
          title={title}
          setTitle={setTitle}
          conversation={conversation}
          isRenameAnyOne={isRenameAnyOne}
          setIsAnyDialogOpen={setIsAnyDialogOpen}
          setIsInputMounted={setIsInputMounted}
          setIsRenameAnyOne={setIsRenameAnyOne}
          inputMounted={inputMounted}
          editLoading={editLoading}
        />
      )}
      {/* Edit Icon */}
      {!rename && !editLoading && !deleteConversationPending && (
        <MoreHorizontal onClick={handleOpeningDialog} className="action_icon" />
      )}
      {!rename && dialog && (
        <Dialog
          deleteConversationHandleFn={deleteConversationHandleFn}
          dialogPos={dialogPos}
          setIsAnyDialogOpen={setIsAnyDialogOpen}
          isAnyDialogOpen={isAnyDialogOpen}
          startRenaming={startRenaming}
        />
      )}
      {(editLoading || deleteConversationPending) && (
        <Loader className={css.spin_loader} />
      )}
    </button>
  );
};
const Dialog = ({
  setIsAnyDialogOpen,
  dialogPos,
  deleteConversationHandleFn,
  startRenaming,
}) => {
  const dialogRef = useRef(null);
  useOutsideClick(dialogRef, () => setIsAnyDialogOpen({ id: null }), "click");
  return (
    <div
      className={css.dialog}
      style={{ "--x": `${dialogPos.x}px`, "--y": `${dialogPos.y}px` }}
      ref={dialogRef}
    >
      <div className={css.action_button_item} onClick={(e) => startRenaming(e)}>
        <Pencil className="action_icon" /> <span>Rename</span>
      </div>
      <div
        className={clsx(css.action_button_item, css.delete_btn)}
        onClick={deleteConversationHandleFn}
      >
        <Trash className="action_icon" />
        <span>Delete</span>
      </div>
    </div>
  );
};
const RenameInputComponent = ({
  setTitle,
  title,
  setIsInputMounted,
  isRenameAnyOne,
  setIsAnyDialogOpen,
  setIsRenameAnyOne,
  conversation,
  inputMounted,
  editLoading,
}) => {
  // debugger;
  const inputRef = useRef(null);
  const conversationItemRef = useRef(null);
  // ?? When Rename state is changing then i focus the conversation input
  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
      setIsInputMounted(true);
    }
  }, []);
  const handleNameChange = (e) => {
    //   debugger;
    const value = e.target.value;
    console.log(value);
    console.log(value);
    setTitle(value);
  };
  const handleRenameValue = useCallback(
    (e, state) => {
      e.stopPropagation();
      setIsRenameAnyOne((prev) => {
        if (prev.id) {
          if (prev.id == conversation.id) {
            prev.handlerFn(title);
          }
        }
        return { id: null, handlerFn: () => {} };
      });
      setIsAnyDialogOpen({ id: null });
      // ?? if state == false then the Check button is clicked and when Check btn clicked then update the conversation title
    },
    [title, isRenameAnyOne]
  );
  useOutsideClick(conversationItemRef, (e) => handleRenameValue(e), "click");
  return (
    <div ref={conversationItemRef} style={{display: "flex", alignItems: "center"}}>
      <span
        className="builder-block builder-9a1c16654f844cf7b9724e6aa4c438c7 builder-has-component css-vky7x4"
        builder-id="builder-9a1c16654f844cf7b9724e6aa4c438c7"
      >
        <input
          type="text"
          className="builder-text css-1qggkls"
          value={title}
          onChange={handleNameChange}
          ref={inputRef}
        />
      </span>
      {!editLoading && inputMounted && (
        <InputCheckButton
          inputRef={inputRef}
          handleRenameValue={handleRenameValue}
        />
      )}
    </div>
  );
};
const InputCheckButton = ({ handleRenameValue }) => {
  return (
    <Check className="action_icon" style={{marginLeft:"0.5rem"}} onClick={(e) => handleRenameValue(e)} />
  );
};
export default Conversations;
