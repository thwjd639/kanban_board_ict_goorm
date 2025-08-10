import { useState, useRef } from 'react';
import type { Task } from '../types/types';

export const useDragAndDrop = () => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false); // 새로 추가
  const [dragPosition, setDragPosition] = useState<number>(-1); // 드롭 위치 추적
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, task: Task, columnId: string) => {
    setDraggedTask(task);
    setDraggedFrom(columnId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    
    // 드래그 이미지 커스터마이징 (선택사항)
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    // dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 150, 50);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string, position?: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDraggedOver(columnId);
    if (position !== undefined) {
      setDragPosition(position);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOver(null);
      setDragPosition(-1);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const resetDrag = () => {
    setDraggedTask(null);
    setDraggedFrom(null);
    setDraggedOver(null);
    setIsDragging(false);
    setDragPosition(-1);
    dragCounter.current = 0;
  };

  return {
    draggedTask,
    draggedFrom,
    draggedOver,
    isDragging,
    dragPosition,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    resetDrag
  };
};