export type Resolution = '720p' | '1080p';
export type TransitionType = 'fade' | 'kenburns' | 'slide';

export interface VideoConfig {
  resolution: Resolution;
  imageDuration: number; // 2, 3, or 4 seconds
  transitionType: TransitionType;
  transitionDuration: number; // default 0.5s
}

export interface VideoProgress {
  progress: number; 
  stage: 'preparing' | 'processing' | 'finalizing' | 'complete';
  message: string;
}