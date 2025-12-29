export type Resolution = '720p' | '1080p';
export type TransitionType = 'fade' | 'kenburns' | 'slide';

export interface VideoConfig {
  resolution: Resolution;
  imageDuration: number; 
  transitionType: TransitionType;
  transitionDuration: number; 
}

export interface VideoProgress {
  progress: number; 
  stage: 'preparing' | 'processing' | 'finalizing' | 'complete';
  message: string;
}