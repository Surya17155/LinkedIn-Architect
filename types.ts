
export enum TextStyle {
  NORMAL = 'NORMAL',
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  BOLD_ITALIC = 'BOLD_ITALIC',
  SCRIPT = 'SCRIPT',
  BOLD_SCRIPT = 'BOLD_SCRIPT',
  MONOSPACE = 'MONOSPACE',
  STRIKETHROUGH = 'STRIKETHROUGH',
  UNDERLINE = 'UNDERLINE',
  LIST = 'LIST',
  
  // New Styles
  SERIF_BOLD = 'SERIF_BOLD',
  SERIF_ITALIC = 'SERIF_ITALIC',
  SERIF_BOLD_ITALIC = 'SERIF_BOLD_ITALIC',
  FRAKTUR = 'FRAKTUR',
  BOLD_FRAKTUR = 'BOLD_FRAKTUR',
  DOUBLE_STRUCK = 'DOUBLE_STRUCK',
  CIRCLED = 'CIRCLED',
  SQUARED = 'SQUARED'
}

export interface UserProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  profileUrl: string;
}

export interface MediaFile {
  url: string;
  type: 'image' | 'pdf';
  name?: string;
}

export interface PostState {
  content: string;
  media: MediaFile[];
}
