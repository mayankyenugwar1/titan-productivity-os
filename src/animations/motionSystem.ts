import type { Variants } from "framer-motion";

// Apple/Linear style custom spring ease curve
export const APPLE_SPRING_EASE = [0.16, 1, 0.3, 1] as const;

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: APPLE_SPRING_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: APPLE_SPRING_EASE,
    },
  },
};

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: APPLE_SPRING_EASE } },
};

export const scaleUpVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: APPLE_SPRING_EASE } },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const dialogEntrance: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: APPLE_SPRING_EASE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: APPLE_SPRING_EASE,
    },
  },
};

export const cardHoverAnimation = {
  whileHover: {
    y: -2,
    transition: { duration: 0.2, ease: APPLE_SPRING_EASE },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: APPLE_SPRING_EASE },
  },
};

export const toastEntrance: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: APPLE_SPRING_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: APPLE_SPRING_EASE,
    },
  },
};
