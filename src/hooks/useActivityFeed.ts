import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { generateActivityFeed, type ActivityFeedItem } from "@/services/os/activityService";

export function useActivityFeed(): ActivityFeedItem[] {
  const { habits } = useHabitStore();

  return useMemo(() => {
    return generateActivityFeed(habits);
  }, [habits]);
}
