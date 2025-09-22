import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from "drizzle-orm";
import type { ArtifactKind } from "@/components/artifact";
import type { VisibilityType } from "@/components/visibility-selector";
import type { AppUsage } from "../usage";
import { generateUUID } from "../utils";
import { getDb, handleDbError } from "./provider";
import {
  type Chat,
  chat,
  type DBMessage,
  document,
  message,
  type Suggestion,
  stream,
  suggestion,
  type User,
  user,
  vote,
} from "./schema";
import { generateHashedPassword } from "./utils";

// Enable guest user fallback for non-critical flows
const ENABLE_GUEST_USER_FALLBACK =
  process.env.ENABLE_GUEST_USER_FALLBACK === "true";
const ALLOW_GUEST_NO_DB = process.env.ALLOW_GUEST_NO_DB === "1";

export async function getUser(email: string): Promise<User[]> {
  try {
    const db = getDb();
    if (!db && (ENABLE_GUEST_USER_FALLBACK || ALLOW_GUEST_NO_DB)) {
      return [];
    }
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    return handleDbError(error, "Failed to get user by email", []);
  }
}

export async function createUser(email: string, password: string) {
  try {
    const db = getDb();
    if (!db && (ENABLE_GUEST_USER_FALLBACK || ALLOW_GUEST_NO_DB)) {
      return null;
    }

    const hashedPassword = generateHashedPassword(password);
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    return handleDbError(error, "Failed to create user");
  }
}

export async function createGuestUser() {
  // Check for NO-DB mode with guest allowance
  if (ALLOW_GUEST_NO_DB) {
    // Return a synthetic guest user for NO-DB mode
    const timestamp = Date.now();
    return {
      id: `guest-${timestamp}`,
      email: `guest+${timestamp}@local`,
      createdAt: new Date(),
    };
  }

  const db = getDb();
  if (!db) {
    if (ENABLE_GUEST_USER_FALLBACK) {
      // Return a fallback guest user when fallback is enabled
      const timestamp = Date.now();
      return {
        id: `guest-${timestamp}`,
        email: `guest+${timestamp}@local`,
        createdAt: new Date(),
      };
    }
    // No fallback allowed, throw appropriate error
    throw new Error("NO_DB_MODE");
  }

  const timestamp = Date.now();
  const email = `guest+${timestamp}@local`;
  const password = generateHashedPassword(generateUUID());

  try {
    // First attempt: Use returning API (PostgreSQL-style)
    try {
      // @ts-expect-error - Drizzle types don't play well with union types
      const result = await db
        .insert(user)
        .values({ email, password })
        .returning({ id: user.id, email: user.email });

      if (Array.isArray(result) && result[0]?.id) {
        return result[0];
      }

      if (result && "id" in result && "email" in result) {
        return result as { id: number | string; email: string };
      }
    } catch (insertError) {
      // Silently continue to fallback if returning API fails
      console.warn(
        "Insert with returning failed, trying fallback",
        insertError
      );
    }

    // Second attempt: Insert without returning and then select (SQLite-style)
    // @ts-expect-error - Drizzle types don't play well with union types
    await db.insert(user).values({ email, password });

    // Try to retrieve the inserted user
    // @ts-expect-error - Drizzle types don't play well with union types
    const selected = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (selected?.[0]) {
      return selected[0];
    }

    // If we got here, something went wrong but we didn't get an error
    throw new Error("Failed to create guest user and verify insertion.");
  } catch (error) {
    // Final fallback: Check if the user was actually created despite errors
    try {
      // @ts-expect-error - Drizzle types don't play well with union types
      const selected = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      if (selected?.[0]) {
        return selected[0];
      }
    } catch (selectError) {
      // Both insert and select failed, nothing more we can do
      console.error("Failed to verify guest user creation:", selectError);
    }

    // Log the original error and throw a user-friendly message
    console.error("Failed to create guest user:", error);

    if (ENABLE_GUEST_USER_FALLBACK) {
      // Last resort fallback: return synthetic user
      return {
        id: `guest-error-${timestamp}`,
        email: `guest+${timestamp}@local`,
        createdAt: new Date(),
      };
    }

    throw new Error("Failed to create guest user.");
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    return handleDbError(error, "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }

    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    return handleDbError(error, "Failed to delete chat by id");
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return { chats: [], hasMore: false };
    }

    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id)
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Chat[] = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        return handleDbError(
          new Error(`Chat with id ${startingAfter} not found`),
          `Chat with id ${startingAfter} not found`,
          { chats: [], hasMore: false }
        );
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        return handleDbError(
          new Error(`Chat with id ${endingBefore} not found`),
          `Chat with id ${endingBefore} not found`,
          { chats: [], hasMore: false }
        );
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    return handleDbError(error, "Failed to get chats by user id", {
      chats: [],
      hasMore: false,
    });
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    if (!selectedChat) {
      return null;
    }

    return selectedChat;
  } catch (error) {
    return handleDbError(error, "Failed to get chat by id", null);
  }
}

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    return await db.insert(message).values(messages);
  } catch (error) {
    return handleDbError(error, "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    return handleDbError(error, "Failed to get messages by chat id", []);
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    return handleDbError(error, "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    return handleDbError(error, "Failed to get votes by chat id", []);
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    return handleDbError(error, "Failed to save document", []);
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    return handleDbError(error, "Failed to get documents by id", []);
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    return handleDbError(error, "Failed to get document by id", null);
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp)
        )
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    return handleDbError(
      error,
      "Failed to delete documents by id after timestamp",
      []
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    return handleDbError(error, "Failed to save suggestions");
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    return handleDbError(error, "Failed to get suggestions by document id", []);
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    return handleDbError(error, "Failed to get message by id", []);
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );

    const messageIds = messagesToDelete.map(
      (currentMessage: { id: string }) => currentMessage.id
    );

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds))
        );
    }
    return null;
  } catch (error) {
    return handleDbError(
      error,
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    return handleDbError(error, "Failed to update chat visibility by id");
  }
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  // Store merged server-enriched usage object
  context: AppUsage;
}) {
  try {
    const db = getDb();
    if (!db) {
      return;
    }
    return await db
      .update(chat)
      .set({ lastContext: context })
      .where(eq(chat.id, chatId));
  } catch (error) {
    console.warn("Failed to update lastContext for chat", chatId, error);
    return;
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return 0;
    }

    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, "user")
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    return handleDbError(error, "Failed to get message count by user id", 0);
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return null;
    }
    await db
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    return handleDbError(error, "Failed to create stream id");
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const db = getDb();
    if (!db && ENABLE_GUEST_USER_FALLBACK) {
      return [];
    }
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }: { id: string }) => id);
  } catch (error) {
    return handleDbError(error, "Failed to get stream ids by chat id", []);
  }
}
