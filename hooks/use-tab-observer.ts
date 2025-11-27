'use client';

import * as React from 'react';

interface UseTabObserverOptions {
  onActiveTabChange?: (prevTab: HTMLElement | null, activeTab: HTMLElement) => void;
}

export function useTabObserver({ onActiveTabChange }: UseTabObserverOptions = {}) {
  const [mounted, setMounted] = React.useState(false);
  const listRef = React.useRef<HTMLElement>(null);
  const prevActiveTabRef = React.useRef<HTMLElement | null>(null);
  const onActiveTabChangeRef = React.useRef(onActiveTabChange);

  // Keep ref updated
  React.useEffect(() => {
    onActiveTabChangeRef.current = onActiveTabChange;
  }, [onActiveTabChange]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Function to update active tab position
  const updateActiveTab = React.useCallback(() => {
    if (!listRef.current) return;

    const list = listRef.current;
    const activeTab = list.querySelector<HTMLElement>(
      `[data-state="active"]`
    );

    if (activeTab && onActiveTabChangeRef.current) {
      const prevTab = prevActiveTabRef.current;
      onActiveTabChangeRef.current(prevTab, activeTab);
      prevActiveTabRef.current = activeTab;
    }
  }, []);

  // Use MutationObserver to watch for data-state changes
  React.useEffect(() => {
    if (!listRef.current || !mounted) return;

    const list = listRef.current;

    // Initial update
    updateActiveTab();

    // Watch for attribute changes on trigger elements
    const observer = new MutationObserver(() => {
      updateActiveTab();
    });

    // Observe all trigger elements for data-state changes
    const triggers = list.querySelectorAll('[data-state]');
    triggers.forEach((trigger) => {
      observer.observe(trigger, {
        attributes: true,
        attributeFilter: ['data-state'],
      });
    });

    // Also observe the list itself for child changes (in case triggers are added dynamically)
    observer.observe(list, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted, updateActiveTab]);

  return {
    mounted,
    listRef,
  };
}

