import type { CollectionChatData, EnrichedMessage } from "@coral-xyz/common";

import { getDb } from "./index";

export const latestReceivedMessage = async (
  uuid: string,
  roomId: string,
  type: string
) => {
  return (
    await getDb(uuid)
      .messages.where({ room: roomId, type: type, from_http_server: 1 })
      .reverse()
      .sortBy("created_at")
  )[0];
};

export const oldestReceivedMessage = async (
  uuid: string,
  roomId: string,
  type: string
) => {
  return (
    await getDb(uuid)
      .messages.where({ room: roomId, type: type, from_http_server: 1 })
      .sortBy("created_at")
  )[0];
};

export const bulkAddChats = (uuid: string, chats: EnrichedMessage[]) => {
  getDb(uuid).messages.bulkPut(chats);
};

export const clearChats = (uuid: string, room: string, type: string) => {
  return getDb(uuid).messages.where({ room }).delete();
};

export const createOrUpdateCollection = async (
  uuid: string,
  data: CollectionChatData
) => {
  const db = getDb(uuid);
  if (await db.collections.get(data.collectionId)) {
    db.collections.update(data.collectionId, data);
  } else {
    db.collections.put(data);
  }
};
