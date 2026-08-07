import { safeISOString } from "@/utils/safeDate";

export type EventType =
  | "MISSION_COMPLETED"
  | "MISSION_CREATED"
  | "MISSION_DELETED"
  | "GOAL_COMPLETED"
  | "PROJECT_FINISHED"
  | "CALENDAR_UPDATED"
  | "KNOWLEDGE_CREATED"
  | "SCHEDULED_TICK";

export interface SystemEvent {
  type: EventType;
  payload: Record<string, any>;
  timestamp: string;
}

type EventListener = (event: SystemEvent) => void;

class EventBusService {
  private listeners: Map<EventType, EventListener[]> = new Map();

  subscribe(eventType: EventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(listener);

    return () => {
      const current = this.listeners.get(eventType) || [];
      this.listeners.set(
        eventType,
        current.filter((l) => l !== listener)
      );
    };
  }

  publish(eventType: EventType, payload: Record<string, any> = {}): SystemEvent {
    const event: SystemEvent = {
      type: eventType,
      payload,
      timestamp: safeISOString(new Date()),
    };

    const targetListeners = this.listeners.get(eventType) || [];
    targetListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error(`[EventBus] Error handling event ${eventType}:`, err);
      }
    });

    return event;
  }
}

export const eventBusService = new EventBusService();
