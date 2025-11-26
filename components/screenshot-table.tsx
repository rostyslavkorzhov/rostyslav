'use client';

import { useState, useEffect } from 'react';
import {
  Root as TableRoot,
  Header as TableHeader,
  Body as TableBody,
  Head as TableHead,
  Row as TableRow,
  Cell as TableCell,
} from '@/components/ui/table';
import {
  Root as ModalRoot,
  Content as ModalContent,
  Header as ModalHeader,
  Body as ModalBody,
} from '@/components/ui/modal';
import { Root as DividerRoot } from '@/components/ui/divider';
import { RiLoader4Line } from '@remixicon/react';
import { getAllScreenshots, ScreenshotData } from '@/utils/storage';
import { useScreenshotStatus } from '@/hooks/use-screenshot-status';
import ScreenshotHighlights from '@/components/screenshot-highlights';

function StatusBadge({ status }: { status: ScreenshotData['status'] }) {
  const baseClasses = 'inline-flex items-center rounded-lg px-2.5 py-1 text-label-sm';
  
  switch (status) {
    case 'completed':
      return (
        <span className={`${baseClasses} bg-green-alpha-10 text-green-700`}>
          Completed
        </span>
      );
    case 'in_progress':
      return (
        <span className={`${baseClasses} bg-primary-alpha-10 text-primary-base`}>
          In Progress
        </span>
      );
    case 'failed':
      return (
        <span className={`${baseClasses} bg-red-alpha-10 text-error-base`}>
          Failed
        </span>
      );
    default:
      return null;
  }
}

export default function ScreenshotTable() {
  const [screenshots, setScreenshots] = useState<ScreenshotData[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Poll for status updates on in-progress screenshots
  useScreenshotStatus();

  useEffect(() => {
    // Load screenshots from localStorage
    const loadScreenshots = () => {
      setScreenshots(getAllScreenshots());
    };

    loadScreenshots();

    // Refresh every 2 seconds to pick up updates from polling hook
    const interval = setInterval(loadScreenshots, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (screenshot: ScreenshotData) => {
    setSelectedScreenshot(screenshot);
    setIsModalOpen(true);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (screenshots.length === 0) {
    return (
      <div className="rounded-2xl bg-bg-white-0 p-8 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200">
        <p className="text-center text-paragraph-sm text-text-sub-600">
          No screenshots captured yet. Submit the form above to capture your first screenshot.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-bg-white-0 p-8 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200">
        <h2 className="text-title-h3 text-text-strong-950 mb-6">
          Screenshots ({screenshots.length})
        </h2>
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Page Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Screenshot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {screenshots.map((screenshot) => (
              <TableRow 
                key={screenshot.id}
                onClick={() => handleRowClick(screenshot)}
                className="cursor-pointer"
              >
                <TableCell className="text-paragraph-sm text-text-strong-950 font-medium">
                  {screenshot.brandName}
                </TableCell>
                <TableCell className="text-paragraph-sm text-text-strong-950">
                  {screenshot.pageType}
                </TableCell>
                <TableCell className="text-paragraph-sm">
                  <a
                    href={screenshot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-base hover:underline"
                    title={screenshot.url}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {screenshot.url.length > 20 
                      ? `${screenshot.url.substring(0, 20)}...` 
                      : screenshot.url}
                  </a>
                </TableCell>
                <TableCell className="text-paragraph-sm">
                  <StatusBadge status={screenshot.status} />
                </TableCell>
              <TableCell className="text-paragraph-sm py-2">
                {screenshot.status === 'completed' && screenshot.imageData ? (
                  <img
                    src={screenshot.imageData}
                    alt={`${screenshot.brandName} ${screenshot.pageType}`}
                    className="h-16 w-16 rounded-lg object-cover border border-stroke-soft-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-bg-weak-50 flex items-center justify-center border border-stroke-soft-200">
                    {screenshot.status === 'in_progress' ? (
                      <RiLoader4Line className="size-6 text-primary-base animate-spin" />
                    ) : (
                      <span className="text-paragraph-xs text-text-sub-600">N/A</span>
                    )}
                  </div>
                )}
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>

      {/* Modal for displaying screenshot details */}
      <ModalRoot open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-2xl max-h-[90vh] flex flex-col">
          {selectedScreenshot && (
            <>
              <ModalHeader
                title={selectedScreenshot.brandName}
                description={`${selectedScreenshot.pageType} - Screenshot Details`}
              />
              <ModalBody className="overflow-y-auto flex-1">
                <div className="space-y-4">
                  {/* Metadata - Top */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-label-sm text-text-sub-600 block mb-1">
                        Brand Name
                      </label>
                      <p className="text-paragraph-sm text-text-strong-950">
                        {selectedScreenshot.brandName}
                      </p>
                    </div>

                    <div>
                      <label className="text-label-sm text-text-sub-600 block mb-1">
                        Page Type
                      </label>
                      <p className="text-paragraph-sm text-text-strong-950">
                        {selectedScreenshot.pageType}
                      </p>
                    </div>

                    <div>
                      <label className="text-label-sm text-text-sub-600 block mb-1">
                        URL
                      </label>
                      <a
                        href={selectedScreenshot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-paragraph-sm text-primary-base hover:underline break-all"
                      >
                        {selectedScreenshot.url}
                      </a>
                    </div>

                    <div>
                      <label className="text-label-sm text-text-sub-600 block mb-1">
                        Status
                      </label>
                      <StatusBadge status={selectedScreenshot.status} />
                    </div>

                    <div>
                      <label className="text-label-sm text-text-sub-600 block mb-1">
                        Captured At
                      </label>
                      <p className="text-paragraph-sm text-text-strong-950">
                        {formatTimestamp(selectedScreenshot.timestamp)}
                      </p>
                    </div>
                  </div>

                  <DividerRoot variant="line-spacing" />

                  {/* Screenshot Image - Bottom */}
                  {selectedScreenshot.status === 'completed' && selectedScreenshot.imageData ? (
                    <div className="relative">
                      <div className="relative h-[500px] overflow-y-auto rounded-lg border border-stroke-soft-200 shadow-regular-xs bg-bg-white-0">
                        <ScreenshotHighlights
                          imageData={selectedScreenshot.imageData}
                          highlights={selectedScreenshot.highlights || []}
                          className="w-full"
                        />
                        {/* White gradient at bottom to indicate scrollable content */}
                        <div className="sticky bottom-0 h-20 bg-gradient-to-t from-bg-white-0 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px] rounded-lg bg-bg-weak-50 border border-stroke-soft-200">
                      {selectedScreenshot.status === 'in_progress' ? (
                        <div className="flex flex-col items-center gap-3">
                          <RiLoader4Line className="size-8 text-primary-base animate-spin" />
                          <span className="text-paragraph-sm text-text-sub-600">
                            Screenshot is still processing...
                          </span>
                        </div>
                      ) : (
                        <span className="text-paragraph-sm text-text-sub-600">
                          Screenshot not available
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </ModalRoot>
    </>
  );
}

